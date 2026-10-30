/**
 * Robust Pyodide Web Worker runner v11 - Distinct user cancellation vs worker failure/timeout,
 * separate session generation for user stop vs worker reset, singleton worker, and timeout separation.
 */

export type RunnerState = 'idle' | 'initializing' | 'ready' | 'running' | 'completed' | 'error' | 'cancelled' | 'timeout';

export interface RunResult {
  output: string;
  error?: {
    category: 'SyntaxError' | 'IndentationError' | 'ZeroDivisionError' | 'NameError' | 'ValueError' | 'TypeError' | 'EOFError' | 'InfiniteLoop' | 'Cancelled' | 'InitError' | 'LogicError';
    message: string;
    pedagogicalHint: string;
  };
  executionTimeMs: number;
  state: RunnerState;
}

let persistentWorker: Worker | null = null;
let workerLifecycleState: 'idle' | 'initializing' | 'ready' | 'error' = 'idle';

let initPromise: Promise<void> | null = null;
let resolveInit: (() => void) | null = null;
let rejectInit: ((err: any) => void) | null = null;
let initTimer: any = null;

let userCancellationGeneration = 0;

const pendingRuns = new Map<string, {
  resolve: (res: RunResult) => void;
  timer: any;
  startTime: number;
  generation: number;
}>();

export function terminateActivePythonWorker(isUserAction = true) {
  workerLifecycleState = 'idle';

  if (isUserAction) {
    userCancellationGeneration++;
  }

  if (initTimer) {
    clearTimeout(initTimer);
    initTimer = null;
  }

  if (rejectInit) {
    const rej = rejectInit;
    resolveInit = null;
    rejectInit = null;
    initPromise = null;
    try {
      if (isUserAction) {
        const cancelErr = new Error('Tác vụ khởi tạo Pyodide đã bị hủy.');
        (cancelErr as any).isCancelled = true;
        rej(cancelErr);
      } else {
        const timeoutErr = new Error('TimeoutError: Khởi tạo môi trường Python (Pyodide) quá thời gian giới hạn.');
        (timeoutErr as any).isInitTimeout = true;
        rej(timeoutErr);
      }
    } catch (e) {}
  } else {
    initPromise = null;
  }

  for (const [runId, run] of pendingRuns.entries()) {
    clearTimeout(run.timer);
    const elapsed = Math.round(performance.now() - run.startTime);
    run.resolve({
      output: '',
      error: {
        category: isUserAction ? 'Cancelled' : 'InitError',
        message: isUserAction ? 'Đã hủy thực thi theo yêu cầu của học sinh.' : 'Lỗi khởi tạo môi trường Python.',
        pedagogicalHint: isUserAction ? 'Tác vụ đã bị dừng.' : 'Không thể khởi tạo môi trường Python.',
      },
      executionTimeMs: elapsed,
      state: isUserAction ? 'cancelled' : 'error',
    });
  }
  pendingRuns.clear();

  if (persistentWorker) {
    persistentWorker.terminate();
    persistentWorker = null;
  }
}

function createWorkerInstance(): Worker {
  if (persistentWorker) {
    persistentWorker.terminate();
    persistentWorker = null;
  }

  workerLifecycleState = 'initializing';
  const worker = new Worker('/pyodideWorker.js');
  persistentWorker = worker;

  worker.onmessage = (event) => {
    const { type, runId, output, errorType, errorMessage, status } = event.data;

    if (type === 'status') {
      console.log(`[Pyodide Status] ${status}`);
      return;
    }

    if (type === 'ready') {
      workerLifecycleState = 'ready';
      if (initTimer) {
        clearTimeout(initTimer);
        initTimer = null;
      }
      if (resolveInit) {
        const r = resolveInit;
        resolveInit = null;
        rejectInit = null;
        r();
      }
      return;
    }

    if (type === 'init_error') {
      workerLifecycleState = 'error';
      if (initTimer) {
        clearTimeout(initTimer);
        initTimer = null;
      }
      const errMsg = errorMessage || 'Lỗi khởi tạo môi trường Python';
      if (rejectInit) {
        const rej = rejectInit;
        resolveInit = null;
        rejectInit = null;
        const initErr = new Error(errMsg);
        (initErr as any).isInitError = true;
        rej(initErr);
      }
      return;
    }

    if (runId && pendingRuns.has(runId)) {
      const run = pendingRuns.get(runId)!;
      pendingRuns.delete(runId);
      clearTimeout(run.timer);

      const elapsed = Math.round(performance.now() - run.startTime);

      if (errorMessage || errorType) {
        const msg = errorMessage || 'Lỗi thực thi Python';
        type PythonErrorCategory = 'SyntaxError' | 'IndentationError' | 'ZeroDivisionError' | 'NameError' | 'ValueError' | 'TypeError' | 'EOFError' | 'InfiniteLoop' | 'Cancelled' | 'InitError' | 'LogicError';
        let category: PythonErrorCategory = 'LogicError';
        let hint = 'Em hãy kiểm tra lại câu lệnh Python.';

        if (errorType === 'SyntaxError' || msg.includes('SyntaxError')) {
          category = 'SyntaxError';
          hint = 'Lỗi cú pháp Python. Kiểm tra dấu hai chấm (:) hoặc ngoặc đơn.';
        } else if (errorType === 'IndentationError' || msg.includes('IndentationError')) {
          category = 'IndentationError';
          hint = 'Lỗi thụt lề (Indentation). Kiểm tra khoảng trắng đầu dòng.';
        } else if (errorType === 'ZeroDivisionError' || msg.includes('ZeroDivisionError') || msg.includes('division by zero')) {
          category = 'ZeroDivisionError';
          hint = 'Lỗi chia cho số 0. Mẫu số không được bằng 0!';
        } else if (errorType === 'NameError' || msg.includes('NameError')) {
          category = 'NameError';
          hint = 'Biến chưa được khai báo hoặc gõ sai tên.';
        } else if (errorType === 'ValueError' || msg.includes('ValueError')) {
          category = 'ValueError';
          hint = 'Giá trị không hợp lệ (ví dụ: ép kiểu int() với chữ cái).';
        } else if (errorType === 'TypeError' || msg.includes('TypeError')) {
          category = 'TypeError';
          hint = 'Lỗi kiểu dữ liệu (ví dụ: cộng chuỗi với số nguyên).';
        } else if (errorType === 'EOFError' || msg.includes('EOFError')) {
          category = 'EOFError';
          hint = 'Hết dữ liệu đầu vào (input()). Chương trình đọc quá số dòng cung cấp.';
        }

        run.resolve({
          output: output || '',
          error: {
            category,
            message: msg,
            pedagogicalHint: hint,
          },
          executionTimeMs: elapsed,
          state: 'error',
        });
      } else {
        run.resolve({
          output: output || '',
          executionTimeMs: elapsed,
          state: 'completed',
        });
      }
    }
  };

  worker.onerror = (err) => {
    workerLifecycleState = 'error';
    if (initTimer) {
      clearTimeout(initTimer);
      initTimer = null;
    }
    const errObj = new Error(err.message || 'Worker Error during execution');
    if (rejectInit) {
      const rej = rejectInit;
      resolveInit = null;
      rejectInit = null;
      rej(errObj);
    }
    for (const [runId, run] of pendingRuns.entries()) {
      clearTimeout(run.timer);
      const elapsed = Math.round(performance.now() - run.startTime);
      run.resolve({
        output: '',
        error: {
          category: 'LogicError',
          message: errObj.message,
          pedagogicalHint: 'Lỗi môi trường thực thi Python.',
        },
        executionTimeMs: elapsed,
        state: 'error',
      });
    }
    pendingRuns.clear();
  };

  return worker;
}

async function ensureWorkerReady(timeoutMs: number = 90000): Promise<void> {
  if (workerLifecycleState === 'ready' && persistentWorker) {
    return;
  }

  if (workerLifecycleState === 'initializing' && initPromise) {
    return initPromise;
  }

  createWorkerInstance();

  initPromise = new Promise<void>((resolve, reject) => {
    resolveInit = resolve;
    rejectInit = reject;

    initTimer = setTimeout(() => {
      if (workerLifecycleState !== 'ready') {
        terminateActivePythonWorker(false);
        const timeoutErr = new Error('TimeoutError: Khởi tạo môi trường Python (Pyodide) quá thời gian giới hạn.');
        (timeoutErr as any).isInitTimeout = true;
        reject(timeoutErr);
      }
    }, timeoutMs);
  });

  return initPromise;
}

let executionQueue = Promise.resolve();

export function runPythonCodePyodide(
  code: string,
  stdinInput: string,
  timeoutMs: number = 4000
): Promise<RunResult> {
  if (!code || !code.trim()) {
    return Promise.resolve({
      output: '',
      error: {
        category: 'SyntaxError',
        message: 'Chương trình chưa có mã nguồn nào để chạy.',
        pedagogicalHint: 'Em hãy viết vài câu lệnh Python nhé!',
      },
      executionTimeMs: 0,
      state: 'completed',
    });
  }

  const runGeneration = userCancellationGeneration;

  return new Promise((resolve) => {
    executionQueue = executionQueue.then(async () => {
      if (runGeneration !== userCancellationGeneration) {
        resolve({
          output: '',
          error: {
            category: 'Cancelled',
            message: 'Đã hủy thực thi theo yêu cầu của học sinh.',
            pedagogicalHint: 'Tác vụ đã bị dừng.',
          },
          executionTimeMs: 0,
          state: 'cancelled',
        });
        return;
      }

      try {
        await ensureWorkerReady(15000);
      } catch (initErr: any) {
        const isCancelled = initErr && initErr.isCancelled;
        const isInitTimeout = initErr && initErr.isInitTimeout;
        
        let category: any = 'InitError';
        let message = initErr.message || 'Không thể khởi tạo môi trường Python.';
        let pedagogicalHint = 'Kiểm tra kết nối mạng hoặc thử lại.';
        let state: RunnerState = 'error';

        if (isCancelled) {
          category = 'Cancelled';
          message = 'Đã hủy thực thi theo yêu cầu của học sinh.';
          pedagogicalHint = 'Tác vụ đã bị dừng.';
          state = 'cancelled';
        } else if (isInitTimeout) {
          category = 'InitError';
          message = 'TimeoutError: Khởi tạo môi trường Python (Pyodide) quá thời gian giới hạn.';
          pedagogicalHint = 'Mạng chậm hoặc không tải được Pyodide. Em hãy thử lại!';
          state = 'timeout';
        }

        resolve({
          output: '',
          error: {
            category,
            message,
            pedagogicalHint,
          },
          executionTimeMs: 0,
          state,
        });
        return;
      }

      if (runGeneration !== userCancellationGeneration) {
        resolve({
          output: '',
          error: {
            category: 'Cancelled',
            message: 'Đã hủy thực thi theo yêu cầu của học sinh.',
            pedagogicalHint: 'Tác vụ đã bị dừng.',
          },
          executionTimeMs: 0,
          state: 'cancelled',
        });
        return;
      }

      await new Promise<RunResult>((runResolve) => {
        const startTime = performance.now();
        const runId = 'run-' + Math.random().toString(36).substring(2, 9);

        const timer = setTimeout(() => {
          if (pendingRuns.has(runId)) {
            pendingRuns.delete(runId);
            const elapsed = Math.round(performance.now() - startTime);
            terminateActivePythonWorker(false);
            runResolve({
              output: '',
              error: {
                category: 'InfiniteLoop',
                message: 'TimeoutError: Chương trình chạy quá thời gian giới hạn (có thể do vòng lặp vô hạn).',
                pedagogicalHint: 'Vòng lặp của em chưa có điều kiện dừng hoặc biến đếm không thay đổi!',
              },
              executionTimeMs: elapsed,
              state: 'timeout',
            });
          }
        }, timeoutMs);

        pendingRuns.set(runId, {
          resolve: runResolve,
          timer,
          startTime,
          generation: runGeneration,
        });

        const worker = persistentWorker;
        if (worker && runGeneration === userCancellationGeneration) {
          worker.postMessage({ runId, code, stdin: stdinInput });
        } else {
          clearTimeout(timer);
          pendingRuns.delete(runId);
          runResolve({
            output: '',
            error: {
              category: 'Cancelled',
              message: 'Tác vụ đã bị hủy.',
              pedagogicalHint: 'Tác vụ đã bị dừng.',
            },
            executionTimeMs: 0,
            state: 'cancelled',
          });
        }
      }).then(resolve);
    });
  });
}
