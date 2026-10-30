import React, { useState } from 'react';
import { BookOpen, X, Code, Terminal, CheckCircle2, ChevronRight } from 'lucide-react';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HandbookModal: React.FC<HandbookModalProps> = ({ isOpen, onClose }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('bien');

  if (!isOpen) return null;

  const topics = [
    {
      id: 'bien',
      title: 'Biến & Kiểu dữ liệu',
      description: 'Khái niệm biến, kiểu số nguyên int, số thực float, chuỗi str, đúng/sai bool.',
      content: `### 1. Biến là gì?
- Biến giống như một **chiếc hộp có dán nhãn** trong bộ nhớ máy tính để cất giữ một giá trị (số, chữ, danh sách).
- Trong Python, ta gán giá trị cho biến bằng dấu bằng \`=\`.
  \`\`\`python
  n = 10         # Biến n lưu số nguyên 10
  ten = "An"     # Biến ten lưu chuỗi ký tự
  la_chan = True # Biến logic (Boolean)
  \`\`\`

### 2. Các kiểu dữ liệu cơ bản ở THCS:
- \`int\`: Số nguyên (ví dụ: -5, 0, 100)
- \`float\`: Số thực / số thập phân (ví dụ: 3.14, 7.5)
- \`str\`: Chuỗi ký tự đặt trong dấu ngoặc kép hoặc đơn (ví dụ: "Tin hoc")
- \`bool\`: Kiểu logic chỉ có 2 giá trị là \`True\` hoặc \`False\` (chú ý viết hoa chữ cái đầu!).

### 3. Nhập dữ liệu từ bàn phím:
- Hàm \`input()\` luôn trả về một **chuỗi ký tự (str)**.
- Muốn chuyển sang số nguyên để tính toán, phải ép kiểu bằng \`int(input())\`.`,
    },
    {
      id: 're-nhanh',
      title: 'Cấu trúc rẽ nhánh if - else',
      description: 'Cách ra quyết định trong chương trình với câu lệnh if, elif, else.',
      content: `### 1. Cấu trúc if đơn giản:
\`\`\`python
if dieu_kien:
    # Các lệnh được thực hiện khi điều kiện ĐÚNG
\`\`\`

### 2. Cấu trúc if - else đầy đủ:
\`\`\`python
if n % 2 == 0:
    print("So chan")
else:
    print("So le")
\`\`\`

### 3. Cấu trúc nhiều nhánh if - elif - else:
\`\`\`python
if diem >= 8:
    print("Gioi")
elif diem >= 6.5:
    print("Kha")
else:
    print("Can co gang")
\`\`\`

### 4. Quy tắc thụt lề (Indentation):
- Mọi câu lệnh nằm bên trong khối \`if\`, \`elif\`, \`else\` **BẮT BUỘC** phải thụt lề vào trong (thường là 4 dấu cách).
- Kết thúc dòng điều kiện phải luôn có **dấu hai chấm (\`:\`)**.`,
    },
    {
      id: 'vong-lap-for',
      title: 'Vòng lặp for & hàm range()',
      description: 'Lặp với số lần biết trước, duyệt danh sách và dãy số.',
      content: `### 1. Hàm \`range()\` trong Python:
- \`range(stop)\`: Chạy từ 0 đến \`stop - 1\`. Ví dụ \`range(5)\` tạo dãy: 0, 1, 2, 3, 4.
- \`range(start, stop)\`: Chạy từ \`start\` đến \`stop - 1\`.
  *Lưu ý quan trọng:* Muốn duyệt tới số N, em phải viết là \`range(1, n + 1)\`!
- \`range(start, stop, step)\`: Bước nhảy \`step\`.
  Ví dụ duyệt các số chẵn từ 2 đến 10: \`range(2, 11, 2)\`.

### 2. Ví dụ tính tổng từ 1 đến N:
\`\`\`python
tong = 0
for i in range(1, n + 1):
    tong = tong + i
print(tong)
\`\`\``,
    },
    {
      id: 'vong-lap-while',
      title: 'Vòng lặp while & Vòng lặp vô tận',
      description: 'Lặp khi điều kiện còn đúng, phù hợp bài toán chưa biết trước số lần lặp.',
      content: `### 1. Cú pháp:
\`\`\`python
while dieu_kien:
    # Lặp lại chừng nào dieu_kien vẫn còn True
\`\`\`

### 2. Thuật toán trừ Euclid tìm UCLN:
\`\`\`python
while a != b:
    if a > b:
        a = a - b
    else:
        b = b - a
print(a)
\`\`\`

### 3. Cảnh báo "Vòng lặp vô tận" (Infinite Loop):
- Nếu bên trong \`while\` mà giá trị của các biến điều khiển không thay đổi, điều kiện sẽ **luôn luôn đúng** và chương trình bị treo!
- Hãy luôn tự hỏi: Sau mỗi bước lặp, bài toán có tiến gần hơn đến điều kiện dừng không?`,
    },
    {
      id: 'phep-toan-so-hoc',
      title: 'Phép chia nguyên // và chia dư %',
      description: 'Hai phép toán số học cực kỳ quan trọng trong môn Tin học THCS.',
      content: `### 1. Phép chia thực \`/\`:
- \`7 / 2 = 3.5\` (kết quả luôn là số thực float).

### 2. Phép chia lấy phần nguyên \`//\`:
- \`7 // 2 = 3\` (bỏ phần thập phân, chỉ lấy phần nguyên).
- Ứng dụng: Bỏ chữ số tận cùng của một số nguyên: \`123 // 10 = 12\`.

### 3. Phép chia lấy phần dư \`%\` (Modulo):
- \`7 % 2 = 1\` vì 7 chia 2 được 3 dư 1.
- Ứng dụng quan trọng:
  - Kiểm tra số chẵn: \`n % 2 == 0\`
  - Kiểm tra số chia hết cho 3: \`n % 3 == 0\`
  - Lấy chữ số hàng đơn vị: \`123 % 10 = 3\``,
    },
    {
      id: 'go-loi',
      title: 'Kỹ năng gỡ lỗi (Debugging)',
      description: 'Nhận diện các loại lỗi phổ biến và cách tự sửa.',
      content: `### Các nhóm lỗi thường gặp ở THCS:
1. **Lỗi cú pháp (SyntaxError):**
   - Quên dấu hai chấm (\`:\`) sau \`if\`, \`for\`, \`while\`.
   - Mở ngoặc mà quên đóng ngoặc.
   - Nhầm dấu so sánh \`==\` thành dấu gán \`=\`.

2. **Lỗi thụt lề (IndentationError):**
   - Thụt lề không đều (chỗ 2 dấu cách, chỗ 4 dấu cách, hoặc lẫn phím Tab).

3. **Lỗi tên biến (NameError):**
   - Dùng biến trước khi tạo ra nó.
   - Gõ sai chính tả (Python phân biệt chữ HOA và chữ thường: \`Tong\` khác \`tong\`).

4. **Lỗi kiểu dữ liệu (TypeError / ValueError):**
   - Lấy chuỗi cộng với số: \`"5" + 2\` (cần \`int("5") + 2\`).

5. **Lỗi logic (LogicError):**
   - Code chạy được nhưng ra kết quả sai (ví dụ: \`range(1, n)\` thay vì \`range(1, n+1)\`).`,
    },
  ];

  const currentTopic = topics.find((t) => t.id === selectedTopic) || topics[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sổ Tay Kiến Thức Tin Học THCS</h3>
              <p className="text-[11px] text-slate-400">
                Tài liệu tra cứu nhanh khái niệm cốt lõi theo chương trình GDPT 2018
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

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar topics */}
          <div className="w-1/3 bg-slate-950/60 border-r border-slate-800 p-3 space-y-1 overflow-y-auto">
            {topics.map((t) => {
              const active = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    active
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="truncate">{t.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Topic Content */}
          <div className="flex-1 p-5 overflow-y-auto text-xs text-slate-300 leading-relaxed space-y-3">
            <h4 className="text-base font-bold text-white mb-1">{currentTopic.title}</h4>
            <p className="text-slate-400 text-xs italic mb-4">{currentTopic.description}</p>
            <div className="space-y-3 whitespace-pre-line font-normal text-slate-200 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
              {currentTopic.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
          >
            Đóng sổ tay
          </button>
        </div>
      </div>
    </div>
  );
};
