import React from 'react';
import { HelpCircle, X, Layers, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface PedagogyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PedagogyGuideModal: React.FC<PedagogyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    { no: 1, title: 'Không bao giờ đưa mã hoàn chỉnh', desc: 'Phản hồi đầu tiên và xuyên suốt quá trình hướng dẫn tuyệt đối không chứa bài giải hoàn chỉnh có thể sao chép.' },
    { no: 2, title: 'Yêu cầu bằng chứng tư duy', desc: 'Trước khi hỗ trợ, yêu cầu học sinh nêu ít nhất một bằng chứng: ý tưởng, giả mã, mã đã thử, thông báo lỗi hoặc dự đoán đầu ra.' },
    { no: 3, title: 'Dẫn dắt ngắn gọn nếu chưa thử', desc: 'Nếu học sinh chưa biết bắt đầu, trợ lý đặt 1-2 câu hỏi định hướng ngắn gọn để khơi gợi.' },
    { no: 4, title: 'Mô hình tháp 4 tầng sư phạm', desc: 'Tầng 1 (Định hướng) -> Tầng 2 (Khái niệm) -> Tầng 3 (Giả mã bước làm) -> Tầng 4 (Khung code có chỗ trống fill-in-the-blank).' },
    { no: 5, title: 'Chỉ chuyển tầng khi học sinh đã thử', desc: 'Chỉ nâng cấp độ gợi ý lên tầng cao hơn khi học sinh thật sự mắc kẹt sau khi đã thử sức ở tầng hiện tại.' },
    { no: 6, title: 'Chỉ vùng lỗi, không viết lại code', desc: 'Khi học sinh gửi mã lỗi: Phân loại nhóm lỗi, chỉ vùng nghi vấn và đặt câu hỏi để học sinh tự tìm cách sửa.' },
    { no: 7, title: 'Ngôn ngữ phù hợp lứa tuổi 11-15', desc: 'Dùng tiếng Việt trong sáng, câu ngắn, ví dụ trực quan đời sống; thuật ngữ mới luôn được giải thích.' },
    { no: 8, title: 'Không vượt quá chuẩn THCS', desc: 'Ưu tiên cách làm cơ bản bằng vòng lặp, rẽ nhánh, danh sách; không dùng thư viện hay kỹ thuật cao siêu.' },
    { no: 9, title: 'Dự đoán trước khi chạy (Kiểm thử)', desc: 'Mọi lời giải phải được kiểm thử. Yêu cầu học sinh tự dự đoán kết quả trước khi chạy ít nhất 2 test case (có trường hợp biên).' },
    { no: 10, title: 'Phản tư khi bài làm chạy đúng', desc: 'Khi test case pass, chưa dừng lại! Trợ lý hỏi học sinh giải thích vai trò của biến, vòng lặp và vì sao thuật toán đúng.' },
    { no: 11, title: 'Thử thách biến thể (Transfer)', desc: 'Cuối nhiệm vụ, đề xuất một biến thể nhỏ để học sinh tự vận dụng; tuyệt đối không kèm lời giải.' },
    { no: 12, title: 'An toàn dữ liệu học đường', desc: 'Không hỏi và không thu thập tên, trường lớp cụ thể, số điện thoại hay thông tin cá nhân của học sinh.' },
    { no: 13, title: 'Kiểm chứng câu trả lời của AI', desc: 'Hình thành thói quen phản biện và kiểm chứng lời giải thích của AI bằng thực nghiệm chạy máy hoặc hỏi thầy cô.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                13 Quy Tắc Tương Tác Sư Phạm THCS
              </h3>
              <p className="text-xs text-slate-400">
                Triết lý giáo dục: Tự suy nghĩ - Tự thử nghiệm - Tự sửa lỗi
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

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-300">
          {/* 4 Tiers Illustration */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Tháp 4 Tầng Hỗ Trợ (Pedagogical Ladder)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="bg-sky-950/30 border border-sky-500/30 p-3 rounded-xl">
                <span className="font-bold text-sky-300 block mb-1">Tầng 1: Định hướng</span>
                <p className="text-[11px] text-slate-300">
                  Câu hỏi gợi ý, xác định Input/Output, gợi ý biến và điều kiện dừng.
                </p>
              </div>
              <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl">
                <span className="font-bold text-amber-300 block mb-1">Tầng 2: Khái niệm</span>
                <p className="text-[11px] text-slate-300">
                  Nhắc quy tắc toán/lập trình (chia dư %, thụt lề, range, if-else).
                </p>
              </div>
              <div className="bg-indigo-950/30 border border-indigo-500/30 p-3 rounded-xl">
                <span className="font-bold text-indigo-300 block mb-1">Tầng 3: Giả mã</span>
                <p className="text-[11px] text-slate-300">
                  Các bước thuật toán bằng lời (B1, B2, B3...) để học sinh hình dung luồng dữ liệu.
                </p>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl">
                <span className="font-bold text-emerald-300 block mb-1">Tầng 4: Khung code</span>
                <p className="text-[11px] text-slate-300">
                  Cung cấp khung code có chỗ trống (___) để học sinh tự hoàn thiện mảnh ghép.
                </p>
              </div>
            </div>
          </div>

          {/* 13 Rules List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Chi tiết 13 nguyên tắc sư phạm bắt buộc:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {rules.map((r) => (
                <div
                  key={r.no}
                  className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    {r.no}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-100 text-xs mb-0.5">{r.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg"
          >
            Đã hiểu và tiếp tục học
          </button>
        </div>
      </div>
    </div>
  );
};
