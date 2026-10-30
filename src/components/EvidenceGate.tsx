import React, { useState } from 'react';
import { StudentEvidence, EvidenceType } from '../types';
import { Lightbulb, FileText, Code2, AlertTriangle, HelpCircle, Check, Send } from 'lucide-react';

interface EvidenceGateProps {
  evidence: StudentEvidence | null;
  onSaveEvidence: (evidence: StudentEvidence) => void;
  onClearEvidence: () => void;
  onQuickAskTutor: (question: string) => void;
}

export const EvidenceGate: React.FC<EvidenceGateProps> = ({
  evidence,
  onSaveEvidence,
  onClearEvidence,
  onQuickAskTutor,
}) => {
  const [selectedType, setSelectedType] = useState<EvidenceType>(evidence?.type || 'idea');
  const [content, setContent] = useState(evidence?.content || '');

  const evidenceOptions: Array<{
    type: EvidenceType;
    label: string;
    icon: any;
    placeholder: string;
    examples: string[];
  }> = [
    {
      type: 'idea' as EvidenceType,
      label: 'Ý tưởng ban đầu',
      icon: Lightbulb,
      placeholder: 'Em định giải bài này thế nào? (Ví dụ: Em định dùng vòng lặp duyệt từ 1 đến N rồi cộng dồn...)',
      examples: [
        'Em định dùng vòng lặp for duyệt từ 1 đến N và kiểm tra số chẵn bằng i % 2 == 0.',
        'Em nghĩ bài này cần 1 biến để lưu tổng và 1 biến đếm.',
        'Em định kiểm tra xem N có chia hết cho số nào từ 2 đến N-1 không.',
      ],
    },
    {
      type: 'pseudocode' as EvidenceType,
      label: 'Giả mã / Các bước',
      icon: FileText,
      placeholder: 'Viết các bước giải bằng lời (Bước 1: Nhập N, Bước 2: Khởi tạo tổng = 0...)',
      examples: [
        'B1: Nhập N. B2: Khởi tạo tong = 0. B3: Lặp i từ 1 đến N. B4: Nếu i chẵn thì cộng vào tong. B5: In tong.',
        'B1: Nhập năm. B2: Nếu năm chia hết cho 400 hoặc (chia hết cho 4 và không chia hết cho 100) thì in YES, ngược lại in NO.',
      ],
    },
    {
      type: 'prediction' as EvidenceType,
      label: 'Dự đoán bằng tay',
      icon: HelpCircle,
      placeholder: 'Nếu cho số cụ thể, em tính nhẩm bằng tay kết quả sẽ ra bao nhiêu?',
      examples: [
        'Nếu N = 6, các số chẵn là 2, 4, 6 nên kết quả phải bằng 12.',
        'Nếu năm là 1900, em nghĩ nó không phải năm nhuận vì chia hết cho 100.',
      ],
    },
    {
      type: 'error' as EvidenceType,
      label: 'Lỗi đang gặp phải',
      icon: AlertTriangle,
      placeholder: 'Em đang gặp thông báo lỗi gì khi chạy thử? (IndentationError, NameError...)',
      examples: [
        'Em bị lỗi: IndentationError: unindent does not match any outer indentation level.',
        'Chương trình của em chạy nhưng không in ra kết quả gì cả.',
      ],
    },
  ];

  const currentOption = evidenceOptions.find((o) => o.type === selectedType) || evidenceOptions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSaveEvidence({
      evidenceId: 'ev-' + Math.random().toString(36).substring(2, 9),
      type: selectedType,
      content: content.trim(),
      timestamp: Date.now(),
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Cổng Bằng Chứng Tư Duy
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Quy tắc sư phạm #2
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Trước khi nhờ trợ lý, em hãy nêu ít nhất 1 suy nghĩ hoặc thử nghiệm ban đầu!
            </p>
          </div>
        </div>

        {evidence && (
          <button
            onClick={onClearEvidence}
            className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
          >
            Đổi bằng chứng khác
          </button>
        )}
      </div>

      {evidence ? (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-300">
                  Đã ghi nhận: {evidence.type === 'idea' ? 'Ý tưởng' : evidence.type === 'pseudocode' ? 'Giả mã' : evidence.type === 'prediction' ? 'Dự đoán' : 'Lỗi'}
                </span>
                <span className="text-[10px] text-emerald-400/80">
                  ✓ Sẵn sàng nhận hướng dẫn 4 tầng
                </span>
              </div>
              <p className="text-xs text-slate-200 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                "{evidence.content}"
              </p>
            </div>
          </div>
          <button
            onClick={() => onQuickAskTutor(`Em đã chia sẻ ý tưởng: "${evidence.content}". Trợ lý hãy hướng dẫn em theo Tầng 1 nhé!`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
          >
            <Send className="w-3 h-3" />
            <span>Hỏi Trợ lý ngay</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Type Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {evidenceOptions.map((opt) => {
              const active = selectedType === opt.type;
              const Icon = opt.icon;
              return (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => {
                    setSelectedType(opt.type);
                    setContent('');
                  }}
                  className={`flex items-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-all text-left ${
                    active
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick example clicks */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Gợi ý mẫu để em chọn nhanh:</span>
            <div className="flex flex-wrap gap-1.5">
              {currentOption.examples.map((ex, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setContent(ex)}
                  className="text-[11px] text-left bg-slate-800 hover:bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition-all truncate max-w-full"
                >
                  "{ex.slice(0, 60)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Text input */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={currentOption.placeholder}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 italic">
              * Không cần viết đúng hoàn toàn, chỉ cần em đã tự suy nghĩ!
            </span>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md"
            >
              Lưu bằng chứng tư duy
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
