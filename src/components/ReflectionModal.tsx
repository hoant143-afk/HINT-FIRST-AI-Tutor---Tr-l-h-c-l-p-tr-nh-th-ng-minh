import React, { useState } from 'react';
import { Problem } from '../types';
import { Sparkles, Trophy, Brain, Target, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  onSendReflectionToTutor: (reflectionText: string) => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  problem,
  onSendReflectionToTutor,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleAnswerChange = (index: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [index]: val }));
  };

  const handleSendToTutor = () => {
    const combined = problem.reflectionQuestions
      .map((q, idx) => `Câu hỏi: ${q}\nEm trả lời: "${answers[idx] || '(Chưa trả lời)'}"`)
      .join('\n\n');
    onSendReflectionToTutor(`Em đã hoàn thành bài và suy nghĩ phản tư như sau:\n${combined}\nTrợ lý nhận xét giúp em xem em hiểu đúng bản chất chưa nhé!`);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Chương Trình Chạy Đúng! Nhưng Khoan Dừng Lại...
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Thực hiện Quy tắc sư phạm #10 & #11: Phản tư bản chất & Thử thách biến thể
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-xs text-slate-200">
          {/* Rule 10: Reflection Questions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Brain className="w-4 h-4" />
              <span>1. Phản tư: Em có thật sự hiểu vì sao chương trình chạy đúng?</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Một lập trình viên giỏi không chỉ biết làm cho code chạy, mà còn hiểu rõ từng dòng lệnh hoạt động thế nào. Em hãy trả lời ngắn gọn các câu hỏi sau:
            </p>

            <div className="space-y-3">
              {problem.reflectionQuestions.map((q, idx) => (
                <div key={idx} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                  <p className="font-semibold text-slate-200 text-xs">
                    {idx + 1}. {q}
                  </p>
                  <textarea
                    rows={2}
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder="Em suy nghĩ và viết câu trả lời vào đây..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSendToTutor}
                disabled={submitted}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{submitted ? 'Đã gửi cho Trợ lý nhận xét!' : 'Gửi lời giải thích cho Trợ lý'}</span>
              </button>
            </div>
          </div>

          {/* Rule 11: Transfer Challenge */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>2. Thử thách biến thể (Không kèm lời giải):</span>
            </div>
            <h4 className="font-bold text-white text-xs">
              {problem.transferChallenge.title}
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              {problem.transferChallenge.description}
            </p>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-amber-300/90 italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Theo Quy tắc 11: Thử thách này không có sẵn lời giải. Em hãy tự vận dụng kiến thức vừa học để biến đổi mã nguồn!
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            CodeKhaiTâm • Rèn luyện năng lực tự học và tư duy máy tính
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-all"
          >
            Quay lại bảng làm việc
          </button>
        </div>
      </div>
    </div>
  );
};
