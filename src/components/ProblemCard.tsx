import React, { useState } from 'react';
import { Problem, TutorTier } from '../types';
import { Layers, ChevronDown, CheckCircle2, Lock, HelpCircle, FileCode, ListOrdered, Sparkles, AlertCircle, Eye } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  allProblems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  currentTier: TutorTier;
  highestUnlockedTier: TutorTier;
  viewingTier: TutorTier;
  onSelectViewingTier: (tier: TutorTier) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  allProblems,
  onSelectProblem,
  currentTier,
  highestUnlockedTier,
  viewingTier,
  onSelectViewingTier,
}) => {
  const [showTierDetails, setShowTierDetails] = useState<TutorTier | null>(null);
  const [lockWarning, setLockWarning] = useState<string | null>(null);

  const gradeBadge =
    problem.grade === 'lop6'
      ? 'Lớp 6'
      : problem.grade === 'lop7'
      ? 'Lớp 7'
      : problem.grade === 'lop8'
      ? 'Lớp 8'
      : 'Lớp 9';

  const tierLabels = [
    { tier: 1, name: 'Tầng 1: Câu hỏi định hướng', icon: HelpCircle, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { tier: 2, name: 'Tầng 2: Nhắc kiến thức', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { tier: 3, name: 'Tầng 3: Gợi ý thuật toán', icon: ListOrdered, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { tier: 4, name: 'Tầng 4: Khoanh vùng lỗi / Khung code', icon: FileCode, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  ];

  const isTierUnlocked = (t: TutorTier) => {
    if (t === 1) return true;
    return t <= highestUnlockedTier;
  };

  const handleTierClick = (tier: TutorTier) => {
    if (isTierUnlocked(tier)) {
      onSelectViewingTier(tier);
      setShowTierDetails(showTierDetails === tier ? null : tier);
      setLockWarning(null);
    } else {
      setLockWarning(`Tầng ${tier} chưa được server mở khóa! Em cần hoàn thành nỗ lực ở tầng trước để mở khóa tuần tự.`);
      setTimeout(() => setLockWarning(null), 5000);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Problem Header & Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {gradeBadge}
          </span>
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {problem.topic}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
              problem.difficulty === 'Cơ bản'
                ? 'bg-blue-500/10 text-blue-300'
                : problem.difficulty === 'Trung bình'
                ? 'bg-amber-500/10 text-amber-300'
                : 'bg-rose-500/10 text-rose-300'
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Quick Problem Switcher */}
        <div className="relative">
          <select
            value={problem.id}
            onChange={(e) => {
              const found = allProblems.find((p) => p.id === e.target.value);
              if (found) onSelectProblem(found);
            }}
            className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-slate-700/80 transition-all cursor-pointer"
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.grade.toUpperCase()}] {p.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Problem Title & Body */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          {problem.title}
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
          {problem.description}
        </p>
      </div>

      {/* Input / Output Spec */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div>
          <span className="font-semibold text-slate-400 block mb-1">
            Đầu vào (Input):
          </span>
          <p className="text-slate-200 font-mono bg-slate-900 px-2 py-1.5 rounded border border-slate-800">
            {problem.inputFormat}
          </p>
        </div>
        <div>
          <span className="font-semibold text-slate-400 block mb-1">
            Đầu ra (Output):
          </span>
          <p className="text-slate-200 font-mono bg-slate-900 px-2 py-1.5 rounded border border-slate-800">
            {problem.outputFormat}
          </p>
        </div>
      </div>

      {/* Sample Input/Output */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex-1 min-w-[140px] bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 font-medium block mb-1">Ví dụ Input:</span>
          <code className="text-emerald-400 font-mono font-semibold block">
            {problem.sampleInput}
          </code>
        </div>
        <div className="flex-1 min-w-[140px] bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 font-medium block mb-1">Ví dụ Output:</span>
          <code className="text-cyan-400 font-mono font-semibold block">
            {problem.sampleOutput}
          </code>
        </div>
      </div>

      {/* 4-Tier Socratic Ladder Indicator (Server-Controlled Progressive Unlocking) */}
      <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800">
        <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Tháp 4 Tầng Sư Phạm (Server Kiểm Soát)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Tầng học active: <strong className="text-emerald-300">Tầng {currentTier}</strong></span>
            <span>Đang xem lại: <strong className="text-cyan-300">Tầng {viewingTier}</strong></span>
          </div>
        </div>

        {lockWarning && (
          <div className="mb-2.5 p-2 bg-rose-950/50 border border-rose-500/40 rounded-lg text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{lockWarning}</span>
          </div>
        )}

        {/* Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {tierLabels.map((item) => {
            const isViewing = viewingTier === item.tier;
            const isCurrent = currentTier === item.tier;
            const isUnlocked = isTierUnlocked(item.tier as TutorTier);
            const Icon = item.icon;

            return (
              <button
                key={item.tier}
                onClick={() => handleTierClick(item.tier as TutorTier)}
                className={`flex items-center justify-between p-2 rounded-lg text-left border transition-all text-xs font-medium ${
                  isViewing
                    ? 'ring-2 ring-cyan-500 bg-cyan-950/40 border-cyan-500/50 text-white'
                    : isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                    : isUnlocked
                    ? `${item.color} hover:bg-slate-800 cursor-pointer`
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {isUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  )}
                  <span className="truncate">{item.name.split(':')[0]}</span>
                </div>
                {isViewing && <Eye className="w-3 h-3 text-cyan-400 flex-shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Tier Details Drawer if expanded */}
        {showTierDetails && isTierUnlocked(showTierDetails) && (
          <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-700/70 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Xem lại nội dung {tierLabels[showTierDetails - 1].name}
              </span>
              <button
                onClick={() => setShowTierDetails(null)}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                Đóng
              </button>
            </div>

            {showTierDetails === 1 && (
              <div className="space-y-1.5 text-slate-300">
                <p className="font-medium text-sky-300">Câu hỏi gợi ý để em tự suy nghĩ:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {problem.tieredGuidance.tier1.guidingQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
                <p className="text-amber-300/90 italic pt-1">
                  💡 {problem.tieredGuidance.tier1.conceptHint}
                </p>
              </div>
            )}

            {showTierDetails === 2 && (
              <div className="space-y-1.5 text-slate-300">
                <p className="font-medium text-amber-300">Khái niệm & Quy tắc cần nhớ:</p>
                <p className="text-slate-300 italic">{problem.tieredGuidance.tier2.explanation}</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pt-1">
                  {problem.tieredGuidance.tier2.concepts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {showTierDetails === 3 && (
              <div className="space-y-1.5 text-slate-300">
                <p className="font-medium text-indigo-300">Các bước thuật toán (Giả mã):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  {problem.tieredGuidance.tier3.pseudocodeSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {showTierDetails === 4 && (
              <div className="space-y-1.5 text-slate-300">
                <p className="font-medium text-emerald-300">
                  Khung code có chỗ trống (Em hãy tự điền vào các dấu ___):
                </p>
                <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                  {problem.tieredGuidance.tier4.fillInTheBlankCode}
                </pre>
                <p className="text-slate-400 italic">
                  🔍 {problem.tieredGuidance.tier4.blankExplanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
