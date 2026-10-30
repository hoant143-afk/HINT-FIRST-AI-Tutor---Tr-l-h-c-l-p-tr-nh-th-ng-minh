import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Code2,
  BookOpen,
  Bot,
  Layers,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Brain,
  Lightbulb,
  FileCode,
  ListOrdered,
  Lock,
  Compass,
} from 'lucide-react';
import { NavTab } from '../components/Navbar';

interface HomePageProps {
  onNavigate: (tab: NavTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const steps = [
    {
      step: 1,
      title: '1. Hiểu nhiệm vụ',
      desc: 'Đọc kỹ đề bài, xác định rõ ràng Input (đầu vào), Output (đầu ra) và các điều kiện ràng buộc. Chưa vội viết code ngay.',
      icon: Compass,
      color: 'from-sky-500/20 to-sky-600/10 text-sky-400 border-sky-500/30',
    },
    {
      step: 2,
      title: '2. Nỗ lực đầu tiên',
      desc: 'Nêu bằng chứng tự suy nghĩ: viết ý tưởng thuật toán, giả mã các bước, hoặc đoạn code đã tự gõ thử trước khi nhờ trợ giúp.',
      icon: Lightbulb,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
    },
    {
      step: 3,
      title: '3. Chẩn đoán khó khăn',
      desc: 'AI Tutor phân tích thông tin để nhận diện xem em đang vướng ở đâu: cú pháp, logic, thụt lề, vòng lặp hay điều kiện.',
      icon: Brain,
      color: 'from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30',
    },
    {
      step: 4,
      title: '4. Gợi ý theo 4 tầng',
      desc: 'Nhận hỗ trợ tăng dần qua 4 tầng giàn giáo (Định hướng -> Khái niệm -> Giả mã -> Khung code khuyết). Tuyệt đối không cho bài giải.',
      icon: Layers,
      color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30',
    },
    {
      step: 5,
      title: '5. Kiểm chứng',
      desc: 'Tự dự đoán kết quả đầu ra trước khi nhấn Chạy máy. Chạy trên ít nhất 2 test case (có trường hợp biên như số 0, số 1).',
      icon: CheckCircle2,
      color: 'from-teal-500/20 to-teal-600/10 text-teal-400 border-teal-500/30',
    },
    {
      step: 6,
      title: '6. Phản tư & Chuyển giao',
      desc: 'Khi code chạy đúng, giải thích vì sao thuật toán đúng, vai trò của biến và nhận thử thách biến thể nhỏ để làm chủ kiến thức.',
      icon: Sparkles,
      color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
    },
  ];

  const tiers = [
    {
      tier: 'Tầng 1',
      name: 'Câu hỏi định hướng',
      desc: 'Chỉ gồm tối đa 1-2 câu hỏi dẫn dắt ngắn. Không đưa mã nguồn.',
      example: '"Để duyệt qua các số từ 1 đến n, em đã học câu lệnh nào trong Python?"',
      color: 'border-sky-500/40 bg-sky-950/20 text-sky-300',
    },
    {
      tier: 'Tầng 2',
      name: 'Gợi ý kiến thức & Quy tắc',
      desc: 'Nhắc lại quy tắc toán học, cú pháp cơ bản hoặc cách chia dư.',
      example: '"Số chẵn là số chia hết cho 2, trong Python em dùng phép toán chia dư i % 2 == 0."',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
    {
      tier: 'Tầng 3',
      name: 'Gợi ý thuật toán (Giả mã)',
      desc: 'Hướng dẫn các bước logic tuần tự bằng lời (B1, B2, B3...). Chưa đưa code.',
      example: '"B1: Nhập n. B2: Khởi tạo tong = 0. B3: Lặp i từ 1 đến n..."',
      color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
    },
    {
      tier: 'Tầng 4',
      name: 'Khung mã khuyết (Scaffold)',
      desc: 'Chỉ vùng dòng nghi vấn hoặc cho khung code có chỗ trống (___) để em tự điền.',
      example: '"tong = tong + ___. Chỗ trống này em cần cộng giá trị nào vào tổng?"',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Phương pháp Giàn Giáo Nhận Thức (Cognitive Scaffolding) THCS
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            HINT-FIRST AI Tutor
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Trợ Lý Học Lập Trình Thông Minh
            </span>
          </h1>

          {/* Slogan */}
          <p className="text-lg sm:text-xl font-bold text-amber-300 tracking-wide">
            "Tự suy nghĩ – AI gợi ý – Em làm chủ kiến thức."
          </p>

          <p className="max-w-2xl mx-auto text-sm text-slate-300 leading-relaxed">
            Hệ thống trợ lý học tập Tin học THCS theo chương trình GDPT 2018. AI đồng hành khơi gợi tư duy từng nấc thang, giúp học sinh tự hiểu đề, tự viết mã, tự tìm lỗi và tự kiểm chứng.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('workspace')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Bắt đầu học ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('repository')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Khám phá 10 chủ đề bài tập</span>
            </button>

            <button
              onClick={() => onNavigate('tutor')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Thử nghiệm trợ lý AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* Notice: AI Doesn't Solve For You */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-emerald-950/40 border border-sky-500/30 rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Tại sao HINT-FIRST AI Tutor KHÔNG giải bài thay em?
            </h3>
            <p className="leading-relaxed">
              Nếu AI cho em sẵn mã nguồn hoàn chỉnh để sao chép, em sẽ không bao giờ học được cách tư duy giải quyết vấn đề. Khi gặp bài kiểm tra hay thử thách mới, em sẽ bị lúng túng.
            </p>
            <p className="text-slate-400">
              Tại HINT-FIRST, AI giống như một <strong>người thầy/huấn luyện viên</strong>: luôn đặt câu hỏi gợi mở, giúp em tự nhận ra mình đang vướng ở đâu, tự tay sửa từng lỗi và tự hào khi chương trình chạy đúng!
            </p>
          </div>
        </div>
      </section>

      {/* Diagram of the 6-Step Learning Process */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Quy trình sư phạm chuẩn
          </span>
          <h2 className="text-2xl font-bold text-white">
            Quy Trình 6 Bước Học Tập HINT-FIRST
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Mỗi bài tập trên hệ thống đều tuân thủ 6 bước khép kín giúp hình thành thói quen tư duy máy tính bền vững.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className={`p-4 rounded-2xl border bg-slate-900/80 shadow-md space-y-2.5 transition-all hover:border-slate-600 ${s.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                    Bước {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{s.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Explanation of 4 Tiers of Hints */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Giàn giáo nhận thức
          </span>
          <h2 className="text-2xl font-bold text-white">
            Giải Thích 4 Tầng Gợi Ý (The 4-Tier Scaffolding)
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Hệ thống chỉ nâng tầng khi em đã thử sức nhưng tiếp tục gặp khó khăn. Không bao giờ nhảy cóc đến lời giải.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border shadow-md space-y-2 flex flex-col justify-between ${t.color}`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  {t.tier}
                </span>
                <h4 className="font-bold text-white text-sm mb-1">{t.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{t.desc}</p>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-[11px] italic">
                <span className="block font-semibold not-italic text-slate-400 mb-0.5">
                  Ví dụ minh họa:
                </span>
                {t.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Three Mandatory Highlight Exercises */}
      <section className="max-w-6xl mx-auto px-4 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-white">3 Bài Toán Minh Họa Bắt Buộc</h2>
            <p className="text-xs text-slate-400">
              Kiểm chứng phương pháp HINT-FIRST trên các chủ đề kinh điển của Tin học THCS
            </p>
          </div>
          <button
            onClick={() => onNavigate('repository')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>Xem tất cả 10 chủ đề</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                THCS-01 • Lớp 7
              </span>
              <h3 className="font-bold text-white text-sm mt-2">Tổng các số chẵn từ 1 đến N</h3>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Nhập số n, tính tổng các số chẵn (VD: n = 6 &rarr; kết quả 12). Rèn luyện biến tích lũy, vòng lặp for và phép chia dư %.
              </p>
            </div>
            <button
              onClick={() => onNavigate('workspace')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold rounded-lg text-center transition-all cursor-pointer"
            >
              Thực hành bài này
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                THCS-02 • Lớp 8
              </span>
              <h3 className="font-bold text-white text-sm mt-2">Đếm ký tự trong xâu</h3>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Đếm số lần ký tự c xuất hiện trong xâu S mà <strong>không sử dụng hàm count()</strong> có sẵn, học sinh tự duyệt từng ký tự.
              </p>
            </div>
            <button
              onClick={() => onNavigate('workspace')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg text-center transition-all cursor-pointer"
            >
              Thực hành bài này
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                THCS-03 • Lớp 7
              </span>
              <h3 className="font-bold text-white text-sm mt-2">Phát hiện và sửa lỗi logic</h3>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Chương trình bị lỗi gán đè <code>s = i</code> thay vì cộng dồn <code>s = s + i</code>. AI hỏi vai trò của biến chứ không sửa hộ!
              </p>
            </div>
            <button
              onClick={() => onNavigate('workspace')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold rounded-lg text-center transition-all cursor-pointer"
            >
              Thực hành bài này
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
