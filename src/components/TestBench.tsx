import React, { useState } from 'react';
import { TestCase, TestResult } from '../types';
import { CheckCircle2, XCircle, Play, Sparkles, AlertCircle, ArrowRight, HelpCircle, Send, RefreshCw } from 'lucide-react';

interface TestBenchProps {
  testCases: TestCase[];
  testResults: TestResult[];
  predictions: Record<string, string>;
  onPredictionChange: (testCaseId: string, value: string) => void;
  onRunAllTests: () => void;
  isRunning?: boolean;
  onAskTutorAboutError: (errorCategory: string, errorMessage: string) => void;
  onOpenReflection: () => void;
  hasInitError?: boolean;
  onRetryPython?: () => void;
}

export const TestBench: React.FC<TestBenchProps> = ({
  testCases,
  testResults,
  predictions,
  onPredictionChange,
  onRunAllTests,
  isRunning,
  onAskTutorAboutError,
  onOpenReflection,
  hasInitError,
  onRetryPython,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'custom'>('tests');

  // Check how many test cases have student predictions
  const predictedCount = testCases.filter((tc) => (predictions[tc.id] || '').trim().length > 0).length;
  const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Testbench Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Khung Kiểm Thử & Dự Đoán
              <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Quy tắc sư phạm #9
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Hãy tập thói quen tự dự đoán kết quả trước khi nhấn Chạy máy!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunAllTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Đang chạy...' : 'Chạy kiểm thử'}</span>
          </button>
        </div>
      </div>

      {/* Environment InitError Banner & Retry Button */}
      {hasInitError && (
        <div className="bg-rose-950/50 border border-rose-500/50 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-rose-200">
                Chưa chạy được – lỗi môi trường Python (Pyodide InitError)
              </p>
              <p className="text-slate-300 text-[11px]">
                Không thể tải Pyodide từ CDN chính trực. Vui lòng kiểm tra kết nối mạng hoặc thử lại.
              </p>
            </div>
          </div>
          {onRetryPython && (
            <button
              onClick={onRetryPython}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử tải lại Python</span>
            </button>
          )}
        </div>
      )}

      {/* Prediction Warning / Encouragement */}
      {predictedCount < 2 && !hasInitError && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5 flex items-start gap-2 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Lời nhắc sư phạm:</p>
            <p className="text-slate-300 text-[11px]">
              Để rèn luyện tư duy thuật toán, em hãy điền ô "Dự đoán của em" cho ít nhất 2 test case trước khi chạy nhé (hiện có {predictedCount}/2).
            </p>
          </div>
        </div>
      )}

      {/* Success Banner when all tests pass */}
      {allPassed && !hasInitError && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-300">
                Tuyệt vời! Tất cả các test case đều đã chạy chính xác!
              </p>
              <p className="text-slate-300 text-[11px]">
                Theo Quy tắc 10 & 11: Em hãy giải thích vai trò của biến và nhận thử thách biến thể.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenReflection}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span>Phản tư & Biến thể</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Test Cases List */}
      <div className="space-y-2.5">
        {testCases.map((tc, idx) => {
          const result = testResults.find((r) => r.testCaseId === tc.id);
          const studentPred = predictions[tc.id] || '';
          const isEnvError = hasInitError || result?.errorMessage?.includes('InitError');

          return (
            <div
              key={tc.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                result
                  ? isEnvError
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : result.passed
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">Test #{idx + 1}</span>
                  {tc.isEdgeCase && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Trường hợp biên
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 italic">
                    {tc.description}
                  </span>
                </div>

                {/* Status Badge */}
                {result && (
                  <div className="flex items-center gap-1 font-bold">
                    {isEnvError ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Chưa chạy được – lỗi môi trường
                      </span>
                    ) : result.passed ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đạt
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Chưa đạt
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Data Grid: Input, Expected, Prediction, Actual */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                {/* Input */}
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-medium">Đầu vào (Input):</span>
                  <code className="text-slate-200 font-mono font-semibold">{tc.input}</code>
                </div>

                {/* Expected */}
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-medium">Kết quả mẫu:</span>
                  <code className="text-indigo-300 font-mono font-semibold">{tc.expectedOutput}</code>
                </div>

                {/* Student Prediction Input */}
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-amber-400 block font-medium">Dự đoán của em:</span>
                  <input
                    type="text"
                    value={studentPred}
                    onChange={(e) => onPredictionChange(tc.id, e.target.value)}
                    placeholder="Em đoán sẽ ra..."
                    className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-amber-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {result && studentPred && !isEnvError && (
                    <span className="text-[10px] block mt-1">
                      {result.actualOutput.trim() === studentPred.trim() ? (
                        <span className="text-emerald-400">✓ Khớp dự đoán!</span>
                      ) : (
                        <span className="text-amber-400">Khác với dự đoán</span>
                      )}
                    </span>
                  )}
                </div>

                {/* Actual Output */}
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-medium">Máy chạy ra:</span>
                  {result ? (
                    <code
                      className={`font-mono font-semibold ${
                        isEnvError ? 'text-amber-300' : result.passed ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      {isEnvError ? 'Lỗi khởi tạo Pyodide' : (result.actualOutput || '(Không in gì)')}
                    </code>
                  ) : (
                    <span className="text-slate-500 italic">Chưa chạy</span>
                  )}
                </div>
              </div>

              {/* Error diagnostic if any */}
              {result?.errorMessage && (
                <div className="mt-2.5 p-2 bg-rose-950/40 border border-rose-500/30 rounded-lg flex items-start justify-between gap-2">
                  <div className="text-rose-200 text-[11px]">
                    <span className="font-bold text-rose-300 block mb-0.5">
                      Báo lỗi: {result.errorMessage}
                    </span>
                  </div>
                  <button
                    onClick={() => onAskTutorAboutError('Lỗi chạy chương trình', result.errorMessage!)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[10px] font-semibold border border-rose-700/60 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Hỏi Trợ lý cách sửa</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
