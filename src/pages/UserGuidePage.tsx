import React, { useState } from 'react';
import {
  HelpCircle,
  GraduationCap,
  User,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Code2,
  FileText,
  Compass,
} from 'lucide-react';

export const UserGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'pedagogy'>('student');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-sky-400" />
          Hướng Dẫn Sử Dụng HINT-FIRST AI Tutor
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cẩm nang phương pháp dạy & học lập trình Python có sự đồng hành của trợ lý trí tuệ nhân tạo.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('student')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'student'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Dành cho Học sinh</span>
        </button>

        <button
          onClick={() => setActiveTab('teacher')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'teacher'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Dành cho Giáo viên</span>
        </button>

        <button
          onClick={() => setActiveTab('pedagogy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pedagogy'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>13 Quy Tắc & 4 Tầng Gợi Ý</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'student' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Làm thế nào để học hiệu quả cùng HINT-FIRST AI Tutor?
            </h2>
            <p>
              Chào em! Khi học lập trình, điều quý giá nhất là <strong>quá trình tư duy của chính em</strong>. Trợ lý AI ở đây để lắng nghe, dẫn dắt từng bước khi em bị tắc đường, chứ không phải chiếc máy làm bài hộ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-emerald-400 text-xs">Nên làm:</h3>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li>Luôn đọc kỹ ví dụ Input và Output, tự tính nhẩm bằng tay 1-2 trường hợp trước khi gõ code.</li>
                <li>Ghi lại ý tưởng hoặc đoạn code em đã thử vào ô <strong>Cổng Bằng Chứng Tư Duy</strong>.</li>
                <li>Trước khi bấm Chạy, tự nhập số vào ô <strong>Dự đoán của em</strong> để rèn luyện mắt nhìn thuật toán.</li>
                <li>Đọc kỹ phản hồi của AI và tự tay gõ lại sửa code của mình.</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-rose-400 text-xs">Không nên làm:</h3>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li>Hỏi câu "Làm hộ em", "Cho code hoàn chỉnh đi" (Hệ thống sẽ từ chối và nhắc nhở em).</li>
                <li>Vừa gặp lỗi đã vội bấm xin gợi ý tầng cao mà chưa tự đọc kỹ thông báo lỗi.</li>
                <li>Bỏ qua bước dự đoán testcase và bước phản tư cuối bài.</li>
                <li>Chia sẻ thông tin cá nhân (họ tên đầy đủ, số điện thoại, địa chỉ nhà) vào ô trò chuyện.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-sky-950/20 border border-sky-500/30 rounded-xl space-y-1 text-slate-300">
            <h4 className="font-bold text-sky-300 text-xs">Mẹo gỡ lỗi nhanh:</h4>
            <p>
              Nếu máy báo lỗi <code>IndentationError</code>: hãy kiểm tra các dòng bên trong lệnh <code>for</code> hoặc <code>if</code> đã thẳng hàng nhau (4 dấu cách) chưa. Nếu báo <code>NameError</code>: hãy xem tên biến có bị gõ sai chữ hoa/chữ thường không nhé!
            </p>
          </div>
        </div>
      )}

      {activeTab === 'teacher' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              Hướng Dẫn Quản Lý Lớp Học & Đánh Giá Bằng Rubric
            </h2>
            <p>
              Hệ thống được thiết kế hỗ trợ giáo viên Tin học THCS theo phương pháp dạy học phân hóa, theo dõi quá trình tự học và can thiệp kịp thời khi học sinh thật sự bế tắc.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs">1. Quản lý lớp học & Mã ẩn danh</h3>
            <p className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              Nhằm bảo vệ dữ liệu học sinh THCS theo chuẩn an toàn thông tin, hệ thống tự động cấp phát <strong>Mã học tập ẩn danh</strong> (ví dụ: <code>HS-0701</code>) gắn với Mã lớp (ví dụ: <code>TIN7A1</code>). Giáo viên lưu danh sách đối chiếu nội bộ tại trường.
            </p>

            <h3 className="font-bold text-white text-xs">2. Giới hạn mức độ hỗ trợ của AI</h3>
            <p className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              Khi giao bài, thầy cô có thể điều chỉnh <strong>Mức hỗ trợ tối đa (Max AI Tier)</strong>:
              <br />
              • Đặt <strong>Tầng 2</strong> nếu muốn học sinh tự suy nghĩ thuật toán.
              <br />
              • Đặt <strong>Tầng 3</strong> đối với bài tập rèn kỹ năng viết code.
              <br />
              • Bật chế độ <strong>"Thử thách tự lập trình (Không AI)"</strong> để kiểm tra năng lực độc lập sau khi đã rút giàn giáo.
            </p>

            <h3 className="font-bold text-white text-xs">3. Đánh giá quá trình bằng Rubric 5 tiêu chí</h3>
            <p className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              Bộ Rubric gồm 5 tiêu chí rõ ràng (Phân tích bài toán, Nỗ lực trước khi hỏi, Gỡ lỗi và kiểm thử, Giải thích lời giải, Sử dụng AI có trách nhiệm) với 4 mức mô tả chi tiết, hỗ trợ ghi nhận xét định tính và xuất bảng điểm CSV/Excel.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'pedagogy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs text-slate-300">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            13 Nguyên Tắc Tương Tác Sư Phạm Bắt Buộc Của Hệ Thống
          </h2>
          <ol className="list-decimal list-inside space-y-2 leading-relaxed">
            <li><strong className="text-slate-100">Không đưa mã hoàn chỉnh:</strong> Phản hồi đầu tiên và xuyên suốt tuyệt đối không chứa bài giải nguyên vẹn.</li>
            <li><strong className="text-slate-100">Yêu cầu bằng chứng:</strong> Hỏi học sinh đã thử gì (ý tưởng, giả mã, mã lỗi, dự đoán) trước khi trợ giúp.</li>
            <li><strong className="text-slate-100">Dẫn dắt ngắn gọn:</strong> Đặt 1-2 câu hỏi ngắn nếu học sinh chưa biết bắt đầu.</li>
            <li><strong className="text-slate-100">Tháp 4 tầng:</strong> Tầng 1 (Định hướng) &rarr; Tầng 2 (Kiến thức) &rarr; Tầng 3 (Giả mã) &rarr; Tầng 4 (Khung code có chỗ trống).</li>
            <li><strong className="text-slate-100">Chỉ chuyển tầng khi cần:</strong> Nâng tầng khi học sinh đã thử ở tầng dưới nhưng vẫn kẹt.</li>
            <li><strong className="text-slate-100">Chỉ vùng lỗi:</strong> Phân loại nhóm lỗi, chỉ vùng nghi vấn và hỏi học sinh tự sửa.</li>
            <li><strong className="text-slate-100">Tiếng Việt trong sáng:</strong> Thân thiện, phù hợp lứa tuổi 11-15, giải thích thuật ngữ bằng hình ảnh đời thường.</li>
            <li><strong className="text-slate-100">Không vượt chuẩn THCS:</strong> Dùng cú pháp cơ bản (for, while, if, list), không dùng thư viện ngoài cao siêu.</li>
            <li><strong className="text-slate-100">Kiểm thử bắt buộc:</strong> Học sinh phải tự dự đoán kết quả trước khi chạy ít nhất 2 test case (có trường hợp biên).</li>
            <li><strong className="text-slate-100">Phản tư khi đúng:</strong> Hỏi vai trò biến, điều kiện vòng lặp và lý do thuật toán đúng.</li>
            <li><strong className="text-slate-100">Thử thách biến thể:</strong> Đề xuất một bài toán mở rộng không kèm lời giải.</li>
            <li><strong className="text-slate-100">Bảo mật thông tin:</strong> Không hỏi họ tên, địa chỉ, số điện thoại hay thông tin cá nhân.</li>
            <li><strong className="text-slate-100">Kiểm chứng AI:</strong> Nêu rõ mức độ chắc chắn và yêu cầu học sinh kiểm chứng bằng chạy thử máy hoặc hỏi thầy cô.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
