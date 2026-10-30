import React, { useRef, useState } from 'react';
import { ProgrammingLanguage, CodeVersion } from '../types';
import {
  Code2,
  RotateCcw,
  Copy,
  Check,
  Play,
  Square,
  Trash2,
  Bookmark,
  History,
  CornerDownRight,
  Clock,
} from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: ProgrammingLanguage;
  onReset: () => void;
  onRunTestBench: () => void;
  onStopRun?: () => void;
  isRunning?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onReset,
  onRunTestBench,
  onStopRun,
  isRunning,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedDraft, setSavedDraft] = useState<string | null>(null);
  const [versions, setVersions] = useState<CodeVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearCode = () => {
    if (confirm('Em có chắc chắn muốn xóa toàn bộ mã nguồn trên trình soạn thảo không?')) {
      // Save to version history before clearing so student never loses work!
      setVersions((prev) => [
        { id: `ver-${Date.now()}`, timestamp: Date.now(), code, note: 'Bản lưu trước khi xóa' },
        ...prev.slice(0, 4),
      ]);
      onChange('');
    }
  };

  const handleSaveDraft = () => {
    setSavedDraft(code);
    setVersions((prev) => [
      { id: `ver-${Date.now()}`, timestamp: Date.now(), code, note: `Bản nháp lúc ${new Date().toLocaleTimeString('vi-VN')}` },
      ...prev.slice(0, 4),
    ]);
    alert('Đã lưu bản nháp mã nguồn vào bộ nhớ phiên học!');
  };

  const handleRestoreDraft = () => {
    if (savedDraft !== null) {
      onChange(savedDraft);
    } else {
      alert('Chưa có bản nháp nào được lưu trước đó.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enable Tab key indentation (4 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newCode = code.substring(0, start) + snippet + code.substring(end);
    onChange(newCode);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + snippet.length;
      }
    }, 0);
  };

  const pythonSnippets = [
    { label: 'for i in range()', code: 'for i in range(1, n + 1):\n    ' },
    { label: 'if condition:', code: 'if i % 2 == 0:\n    ' },
    { label: 'while a != b:', code: 'while a != b:\n    ' },
    { label: 'int(input())', code: 'int(input())' },
    { label: 'print()', code: 'print()' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full min-h-[440px]">
      {/* Editor Header */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2.5 flex-wrap">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Trình soạn thảo ({language.toUpperCase()})
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            • Tab = 4 spaces
          </span>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-700 transition-all cursor-pointer"
            title="Sao chép toàn bộ code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-sky-300 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-700 transition-all cursor-pointer"
            title="Lưu bản nháp tạm thời"
          >
            <Bookmark className="w-3 h-3" />
            <span className="hidden sm:inline">Lưu nháp</span>
          </button>

          {savedDraft && (
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 bg-sky-950/40 hover:bg-sky-900/60 px-2 py-1 rounded-md border border-sky-500/30 transition-all cursor-pointer"
              title="Khôi phục bản nháp đã lưu"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Nạp nháp</span>
            </button>
          )}

          {versions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-700 transition-all cursor-pointer"
              title="Lịch sử các phiên bản mã đã lưu"
            >
              <History className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Lịch sử ({versions.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClearCode}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-700 transition-all cursor-pointer"
            title="Xóa sạch mã nguồn trên trình soạn thảo"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Xóa mã</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-700 transition-all cursor-pointer"
            title="Khôi phục mã mẫu của bài toán"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Mã mẫu</span>
          </button>

          {isRunning ? (
            <button
              type="button"
              onClick={onStopRun}
              className="flex items-center gap-1 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg shadow transition-all cursor-pointer"
              title="Dừng chạy chương trình"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Dừng</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onRunTestBench}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg shadow-md transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Chạy mã</span>
            </button>
          )}
        </div>
      </div>

      {/* Version History Drawer */}
      {showHistory && (
        <div className="bg-slate-950 p-2.5 border-b border-slate-800 text-xs space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
            <span>Lịch sử các phiên bản mã đã lưu:</span>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="text-slate-400 hover:text-white"
            >
              Đóng
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {versions.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onChange(v.code);
                  setShowHistory(false);
                }}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{v.note}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Snippet Bar (Python helpers) */}
      {language === 'python' && (
        <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <CornerDownRight className="w-3 h-3 text-slate-500" /> Chèn nhanh:
          </span>
          {pythonSnippets.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertSnippet(s.code)}
              className="text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700/80 hover:border-emerald-500/50 transition-all whitespace-nowrap cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Editor Body */}
      <div className="relative flex-1 flex bg-slate-950/90 font-mono text-xs overflow-hidden">
        {/* Line Numbers */}
        <div className="select-none py-3 px-3 text-right text-slate-600 bg-slate-950/50 border-r border-slate-800/80 font-mono text-xs min-w-[42px]">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 py-3 px-4 bg-transparent text-slate-100 font-mono text-xs leading-6 resize-none focus:outline-none focus:ring-0 whitespace-pre overflow-x-auto selection:bg-emerald-900/60"
          placeholder="Hãy tự viết mã Python hoặc hoàn thiện từ khung gợi ý..."
        />
      </div>
    </div>
  );
};
