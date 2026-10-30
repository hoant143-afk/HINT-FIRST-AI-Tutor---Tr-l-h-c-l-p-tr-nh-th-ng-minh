/**
 * Pyodide Web Worker runner v10 - Detailed lifecycle states, robust timeout (90s), unified protocol.
 */

self.postMessage({ type: 'status', status: 'STARTING_WORKER' });

try {
  self.postMessage({ type: 'status', status: 'LOADING_PYODIDE_SCRIPT' });
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.3/full/pyodide.js");
} catch (importErr) {
  const msg = importErr && importErr.message ? importErr.message : String(importErr);
  self.postMessage({ type: 'status', status: 'INIT_FAILED' });
  self.postMessage({ type: 'init_error', errorMessage: `Failed to import pyodide.js: ${msg}` });
  throw importErr;
}

let pyodideInstance = null;
let initPromise = null;

async function loadPyodideEnvironment() {
  if (pyodideInstance) return pyodideInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      self.postMessage({ type: 'status', status: 'INITIALIZING_PYODIDE' });
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.3/full/",
      });
      self.postMessage({ type: 'status', status: 'READY' });
      self.postMessage({ type: 'ready' });
      return pyodideInstance;
    } catch (err) {
      initPromise = null;
      pyodideInstance = null;
      const msg = err && err.message ? err.message : String(err);
      self.postMessage({ type: 'status', status: 'INIT_FAILED' });
      self.postMessage({ type: 'init_error', errorMessage: msg });
      throw new Error(msg);
    }
  })();

  return initPromise;
}

// Start loading immediately
loadPyodideEnvironment().catch((err) => {});

let executionQueue = Promise.resolve();

self.onmessage = (event) => {
  const { runId, code, stdin } = event.data;
  if (!runId) return;

  executionQueue = executionQueue.then(async () => {
    try {
      let py;
      try {
        py = await loadPyodideEnvironment();
      } catch (loadErr) {
        self.postMessage({
          type: 'result',
          runId,
          output: '',
          errorType: 'InitError',
          errorMessage: (loadErr && loadErr.message) || 'Không thể tải môi trường Pyodide từ CDN chính thức.',
        });
        return;
      }

      const stdinStr = (stdin !== undefined && stdin !== null) ? String(stdin) : '';

      const wrapper = `
import sys
import io
import traceback

sys.stdin = io.StringIO(${JSON.stringify(stdinStr)})
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

__locals = {}
try:
    exec(${JSON.stringify(code)}, __locals)
except Exception as e:
    traceback.print_exc(file=sys.stderr)
    raise e
`;

      let output = '';
      let stderrOutput = '';
      let errorType = null;
      let errorMessage = null;

      try {
        await py.runPythonAsync(wrapper);
      } catch (err) {
        errorMessage = err && err.message ? err.message : String(err);
      }

      try {
        output = py.runPython("sys.stdout.getvalue()");
      } catch (e) {}

      try {
        stderrOutput = py.runPython("sys.stderr.getvalue()");
      } catch (e) {}

      const fullErr = stderrOutput.trim() || errorMessage;
      if (fullErr) {
        if (fullErr.includes('SyntaxError')) errorType = 'SyntaxError';
        else if (fullErr.includes('IndentationError')) errorType = 'IndentationError';
        else if (fullErr.includes('ZeroDivisionError') || fullErr.includes('division by zero')) errorType = 'ZeroDivisionError';
        else if (fullErr.includes('NameError')) errorType = 'NameError';
        else if (fullErr.includes('ValueError')) errorType = 'ValueError';
        else if (fullErr.includes('TypeError')) errorType = 'TypeError';
        else if (fullErr.includes('EOFError')) errorType = 'EOFError';
        else errorType = 'LogicError';
      }

      self.postMessage({
        type: 'result',
        runId,
        output: output,
        stderr: stderrOutput,
        errorType,
        errorMessage: fullErr || undefined,
      });

    } catch (err) {
      self.postMessage({
        type: 'result',
        runId,
        output: '',
        errorType: 'RuntimeError',
        errorMessage: (err && err.message) || String(err),
      });
    }
  });
};
