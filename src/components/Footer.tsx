import React from 'react';
import { Sparkles, ShieldCheck, Heart, BookOpen, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Brand Col */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <span className="font-bold text-white text-sm">
              HINT-FIRST AI Tutor – Trợ lý học lập trình thông minh
            </span>
          </div>
          <p className="text-emerald-400 font-semibold text-xs">
            Slogan: "Tự suy nghĩ – AI gợi ý – Em làm chủ kiến thức."
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Sản phẩm khoa học giáo dục minh họa cho đề tài tiểu luận thạc sĩ:
            <br />
            <strong className="text-slate-300">"AI tạo sinh và trợ lý học tập trong dạy học lập trình"</strong>.
            Áp dụng phương pháp giàn giáo nhận thức (scaffolding), lý thuyết tự điều chỉnh (SRL) và phản hồi hình thành.
          </p>
        </div>

        {/* 6 Steps and 4 Tiers */}
        <div className="space-y-1.5">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block">
            Quy trình Sư phạm
          </span>
          <ul className="space-y-1 text-[11px] text-slate-400">
            <li>• 1. Hiểu nhiệm vụ</li>
            <li>• 2. Nỗ lực đầu tiên (Bằng chứng)</li>
            <li>• 3. Chẩn đoán khó khăn</li>
            <li>• 4. Gợi ý 4 tầng (Không giải thay)</li>
            <li>• 5. Kiểm chứng (Dự đoán & Chạy)</li>
            <li>• 6. Phản tư & Chuyển giao</li>
          </ul>
        </div>

        {/* Privacy & Safety */}
        <div className="space-y-2">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> An toàn học đường
          </span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Học sinh tham gia bằng mã lớp và mã học tập ẩn danh. Hệ thống không thu thập họ tên đầy đủ, địa chỉ, số điện thoại hay dữ liệu nhạy cảm.
          </p>
          <div className="pt-2 text-[10px] text-slate-500">
            © 2026 HINT-FIRST AI Tutor. Bản quyền phương pháp sư phạm Tin học THCS.
          </div>
        </div>
      </div>
    </footer>
  );
};
