import React, { useState } from 'react';
import { LearningJournalEntry, Problem, UserProfile } from '../types';
import {
  TrendingUp,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Brain,
  Lightbulb,
  Layers,
  HelpCircle,
  PlusCircle,
  Award,
} from 'lucide-react';

interface JournalProgressPageProps {
  journalEntries: LearningJournalEntry[];
  currentUser: UserProfile;
  problems: Problem[];
  onAddJournalEntry: (entry: LearningJournalEntry) => void;
}

export const JournalProgressPage: React.FC<JournalProgressPageProps> = ({
  journalEntries,
  currentUser,
  problems,
  onAddJournalEntry,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<LearningJournalEntry | null>(
    journalEntries[0] || null
  );

  const completedCount = journalEntries.length;
  const avgTier =
    completedCount > 0
      ? (journalEntries.reduce((sum, e) => sum + e.highestTierUsed, 0) / completedCount).toFixed(1)
      : '0';

  const exportJournalText = () => {
    const content = journalEntries
      .map(
        (j, idx) => `========================================
NHẬT KÝ HỌC TẬP #${idx + 1}
Mã bài: ${j.problemId} - Tên bài: ${j.problemTitle}
Học sinh: ${currentUser.studentCode || currentUser.name}
Thời gian: ${new Date(j.timestamp).toLocaleString('vi-VN')}
Tầng hỗ trợ cao nhất: Tầng ${j.highestTierUsed}
----------------------------------------
1. Em đã thử gì trước khi hỏi AI?
${j.priorEffort}

2. Em đã hỏi AI điều gì?
${(j.studentQuestions || []).join('\n')}

3. AI đã gợi ý gì?
${(j.aiHintsReceived || []).join('\n')}

4. Em đã tự sửa điều gì?
${j.selfCorrections}

5. Testcase đã dùng và kết quả:
- Danh sách testcase: ${(j.testCasesUsed || []).join(', ')}
- Kết quả: ${j.testResultsSummary}

6. Bài học rút ra:
${j.lessonsLearned}

7. Thắc mắc còn lại:
${j.remainingDoubts || '(Không còn thắc mắc)'}
`
      )
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NhatKyHocTap_${currentUser.studentCode || 'HS'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Tiến Trình & Nhật Ký Học Tập
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {currentUser.studentCode || currentUser.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ghi nhận khách quan quá trình tự điều chỉnh nhận thức (SRL): từ nỗ lực ban đầu, câu hỏi tới AI, cách tự sửa lỗi và phản tư.
          </p>
        </div>

        <button
          onClick={exportJournalText}
          disabled={journalEntries.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Xuất hồ sơ nhật ký (.TXT)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Số bài đã ghi nhận:</span>
            <span className="text-xl font-bold text-white">{completedCount} bài</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Tầng trợ giúp trung bình:</span>
            <span className="text-xl font-bold text-white">Tầng {avgTier}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Mức độ tự lực:</span>
            <span className="text-xl font-bold text-emerald-300">Tự sửa 100%</span>
          </div>
        </div>
      </div>

      {/* Journal Browser Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="font-bold text-white text-xs block mb-1">
            Danh sách bài học đã lưu nhật ký:
          </span>

          {journalEntries.map((j) => {
            const active = selectedEntry?.id === j.id;
            return (
              <div
                key={j.id}
                onClick={() => setSelectedEntry(j)}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                  active
                    ? 'bg-amber-950/20 border-amber-500/50 text-white shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-200 truncate">{j.problemTitle}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-400">
                    Tầng {j.highestTierUsed}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(j.timestamp).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            );
          })}

          {journalEntries.length === 0 && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400 space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Chưa có mục nhật ký nào.</p>
              <p className="text-[11px]">
                Sau khi hoàn thành một bài lập trình ở mục "Học lập trình", hệ thống sẽ lưu lại nhật ký cho em!
              </p>
            </div>
          )}
        </div>

        {/* Right Details Viewer */}
        <div className="lg:col-span-8">
          {selectedEntry ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-xs text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedEntry.problemTitle}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Mã bài: {selectedEntry.problemId} • Ghi nhận ngày{' '}
                    {new Date(selectedEntry.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Mức hỗ trợ tối đa: Tầng {selectedEntry.highestTierUsed}
                </span>
              </div>

              {/* 7 Questions of the Journal */}
              <div className="space-y-4">
                {/* 1 */}
                <div className="space-y-1">
                  <span className="font-bold text-sky-400 block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> 1. Em đã thử gì trước khi hỏi AI? (Bằng chứng)
                  </span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 italic">
                    "{selectedEntry.priorEffort || 'Chưa ghi'}"
                  </div>
                </div>

                {/* 2 & 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-indigo-400 block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" /> 2. Em đã hỏi AI điều gì?
                    </span>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                      {(selectedEntry.studentQuestions || []).map((q, i) => (
                        <p key={i}>• {q}</p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> 3. AI đã gợi ý gì?
                    </span>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                      {(selectedEntry.aiHintsReceived || []).map((h, i) => (
                        <p key={i}>• {h}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4 */}
                <div className="space-y-1">
                  <span className="font-bold text-emerald-400 block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 4. Em đã tự sửa điều gì?
                  </span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                    {selectedEntry.selfCorrections || 'Tự sửa mã thành công.'}
                  </div>
                </div>

                {/* 5 */}
                <div className="space-y-1">
                  <span className="font-bold text-teal-400 block text-[11px] uppercase tracking-wider">
                    5. Testcase đã dùng và kết quả kiểm thử:
                  </span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                    <p className="mb-1">
                      <strong>Testcase:</strong> {(selectedEntry.testCasesUsed || []).join(' | ')}
                    </p>
                    <p>
                      <strong>Kết quả:</strong> {selectedEntry.testResultsSummary}
                    </p>
                  </div>
                </div>

                {/* 6 & 7 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-purple-400 block text-[11px] uppercase tracking-wider">
                      6. Bài học rút ra:
                    </span>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                      {selectedEntry.lessonsLearned}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-rose-400 block text-[11px] uppercase tracking-wider">
                      7. Thắc mắc còn lại:
                    </span>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                      {selectedEntry.remainingDoubts || 'Không còn thắc mắc.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
              Chọn một bài học bên trái để xem nhật ký chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
