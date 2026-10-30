import React, { useState } from 'react';
import { Problem, GradeLevel } from '../types';
import { PlusCircle, X, Check } from 'lucide-react';

interface CustomProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProblem: (problem: Problem) => void;
}

export const CustomProblemModal: React.FC<CustomProblemModalProps> = ({
  isOpen,
  onClose,
  onAddProblem,
}) => {
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('lop7');
  const [topic, setTopic] = useState('Vòng lặp & Rẽ nhánh');
  const [description, setDescription] = useState('');
  const [inputFormat, setInputFormat] = useState('Một số nguyên N');
  const [outputFormat, setOutputFormat] = useState('Kết quả theo đề bài');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newProblem: Problem = {
      id: `custom-${Date.now()}`,
      codeNumber: `THCS-GV-${Math.floor(Math.random() * 900 + 100)}`,
      title: title.trim(),
      grade,
      difficulty: 'Trung bình',
      topic,
      topicCategory: 'advanced',
      requiredKnowledge: ['Đọc hiểu đề bài', 'Khai báo biến', 'Cấu trúc điều khiển'],
      learningGoals: ['Tự vận dụng kiến thức giải quyết bài toán thực tế'],
      description: description.trim(),
      inputFormat: inputFormat.trim() || 'Theo đề bài',
      outputFormat: outputFormat.trim() || 'Theo đề bài',
      constraints: 'Theo đề bài',
      sampleInput: sampleInput.trim() || '0',
      sampleOutput: sampleOutput.trim() || '0',
      commonMistakes: ['Sai định dạng đầu vào hoặc đầu ra'],
      teacherReferenceSolution: `# [ĐÁP ÁN THAM KHẢO DÀNH CHO GIÁO VIÊN]\n# Bài toán: ${title.trim()}\n# Tự động lưu theo cấu hình của giáo viên`,
      starterCode: {
        python: `# Bài toán: ${title.trim()}\n# Hãy bắt đầu bằng việc đọc đề và xác định Input/Output\n\n`,
        cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Code của em\n    return 0;\n}`,
        scratch: `Khi nhấn cờ xanh\n...`,
      },
      testCases: [
        {
          id: 'custom-tc1',
          input: sampleInput.trim() || '5',
          expectedOutput: sampleOutput.trim() || '0',
          description: 'Test case mẫu do em/thầy cô thiết lập',
        },
      ],
      tieredGuidance: {
        tier1: {
          guidingQuestions: [
            'Đầu vào của bài toán gồm những giá trị nào?',
            'Kết quả cần in ra là gì?',
            'Em hãy thử tính nhẩm bằng tay với một ví dụ đơn giản.',
          ],
          conceptHint: 'Xác định rõ ràng kiểu dữ liệu của biến trước khi viết câu lệnh lặp hoặc rẽ nhánh.',
        },
        tier2: {
          concepts: [
            'Sử dụng câu lệnh rẽ nhánh if/else nếu bài toán có điều kiện.',
            'Sử dụng vòng lặp for hoặc while nếu bài toán cần lặp lại nhiều lần.',
          ],
          explanation: 'Quy tắc: Luôn khởi tạo biến đếm hoặc biến tích luỹ trước khi bước vào vòng lặp.',
          rulesToRemember: ['Thụt lề đồng đều', 'Đúng cú pháp dấu hai chấm'],
        },
        tier3: {
          pseudocodeSteps: [
            'Bước 1: Nhập dữ liệu đầu vào.',
            'Bước 2: Xử lý theo thuật toán.',
            'Bước 3: In kết quả ra màn hình.',
          ],
        },
        tier4: {
          fillInTheBlankCode: `# Hãy thử tự viết mã nguồn dựa trên các gợi ý ở Tầng 1, 2, 3!`,
          blankExplanation: 'Dùng trợ lý AI để nhận khung code khuyết cho bài toán này nhé.',
        },
      },
      reflectionQuestions: [
        'Biến nào là biến quan trọng nhất trong bài toán này?',
        'Thuật toán của em có hoạt động tốt với số 0 hoặc số âm không?',
      ],
      transferChallenge: {
        title: 'Thử thách mở rộng cho bài này',
        description: 'Em hãy thử nghĩ thêm một trường hợp mở rộng khi dữ liệu đầu vào lớn hơn!',
      },
    };

    onAddProblem(newProblem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nhập Đề Bài Riêng / Bài Tập Về Nhà</h3>
              <p className="text-[11px] text-slate-400">
                Thêm bài tập từ sách giáo khoa để Trợ lý Sư phạm hướng dẫn theo 4 tầng
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-slate-300">
          <div>
            <label className="font-semibold block mb-1 text-slate-200">
              Tên bài toán: <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Tính chu vi và diện tích hình tam giác"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-200">Khối lớp:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="lop6">Lớp 6</option>
                <option value="lop7">Lớp 7</option>
                <option value="lop8">Lớp 8</option>
                <option value="lop9">Lớp 9</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-200">Chủ đề:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="VD: Cấu trúc rẽ nhánh"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-200">
              Nội dung đề bài chi tiết: <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập yêu cầu bài toán từ sách giáo khoa hoặc đề bài của thầy cô..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-200">Đầu vào mẫu (Input):</label>
              <input
                type="text"
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                placeholder="VD: 5"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-200">Đầu ra mẫu (Output):</label>
              <input
                type="text"
                value={sampleOutput}
                onChange={(e) => setSampleOutput(e.target.value)}
                placeholder="VD: 15"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Thêm bài toán vào học</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
