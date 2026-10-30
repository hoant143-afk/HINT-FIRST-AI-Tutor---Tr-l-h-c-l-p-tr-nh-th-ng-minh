import { Problem } from '../types';

export const THCS_PROBLEMS: Problem[] = [
  // Bài 1 (Bắt buộc theo yêu cầu): Tổng các số chẵn
  {
    id: 'tong-so-chan',
    codeNumber: 'THCS-01',
    title: 'Tính tổng các số chẵn từ 1 đến N',
    grade: 'lop7',
    difficulty: 'Cơ bản',
    topic: 'Vòng lặp for và range',
    topicCategory: 'forloop',
    requiredKnowledge: ['Biến tích lũy', 'Vòng lặp for', 'Hàm range()', 'Phép chia lấy phần dư %'],
    learningGoals: [
      'Hiểu cách dùng biến tích lũy khởi tạo từ 0.',
      'Sử dụng hàm range(1, n + 1) để duyệt toàn bộ đoạn từ 1 đến n.',
      'Kiểm tra tính chẵn lẻ bằng phép chia dư cho 2 (i % 2 == 0).',
    ],
    description: 'Nhập một số nguyên dương n. Hãy tính và in ra tổng của tất cả các số chẵn trong phạm vi từ 1 đến n (bao gồm cả n nếu n là số chẵn).',
    inputFormat: 'Một số nguyên dương n (1 <= n <= 1000)',
    outputFormat: 'Một số nguyên duy nhất là tổng các số chẵn.',
    constraints: '1 <= n <= 1000',
    sampleInput: '6',
    sampleOutput: '12',
    commonMistakes: [
      'Ghi range(1, n) khiến số n bị bỏ sót không được duyệt.',
      'Quên khởi tạo biến tong = 0 trước vòng lặp.',
      'Gán đè tong = i thay vì cộng dồn tong = tong + i.',
    ],
    starterCode: {
      python: `# Bài 1: Tính tổng các số chẵn từ 1 đến n
n = int(input())

# Hãy khai báo biến tích lũy và vòng lặp for duyệt từ 1 đến n
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int tong = 0;
    // Viet vong lap o day
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh
Hỏi "Nhập n:" và đợi
Đặt [tong v] thành (0)
Lặp lại...`,
    },
    teacherReferenceSolution: `# [ĐÁP ÁN THAM KHẢO DÀNH CHO GIÁO VIÊN - KHÔNG CÔNG KHAI CHO HỌC SINH]
n = int(input())
tong = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        tong = tong + i
print(tong)

# Cách 2 tối ưu bước nhảy:
# tong = 0
# for i in range(2, n + 1, 2):
#     tong += i
# print(tong)`,
    testCases: [
      {
        id: 'tc1',
        input: '6',
        expectedOutput: '12',
        description: 'n = 6 (các số chẵn 2, 4, 6; tổng = 12)',
      },
      {
        id: 'tc2',
        input: '5',
        expectedOutput: '6',
        description: 'n lẻ (các số chẵn 2, 4; tổng = 6)',
      },
      {
        id: 'tc3',
        input: '1',
        expectedOutput: '0',
        isEdgeCase: true,
        description: 'Biên nhỏ nhất n = 1: Không có số chẵn nào, kết quả là 0',
      },
      {
        id: 'tc4',
        input: '10',
        expectedOutput: '30',
        description: 'n = 10 (2 + 4 + 6 + 8 + 10 = 30)',
      },
      {
        id: 'tc5',
        input: '2',
        expectedOutput: '2',
        isEdgeCase: true,
        description: 'Biên n = 2: Chỉ có số 2',
      },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: [
          'Dấu hiệu toán học nào để nhận biết một số nguyên i là số chẵn?',
          'Để duyệt qua tất cả các số từ 1 đến n, hàm range trong Python cần bắt đầu từ đâu và kết thúc ở đâu?',
        ],
        conceptHint: 'Em hãy tự hỏi: Cần một biến để gom các số chẵn lại, biến đó ban đầu nên có giá trị là bao nhiêu?',
      },
      tier2: {
        concepts: [
          'Biến tích lũy (Accumulator): Tạo tong = 0 trước khi bước vào vòng lặp.',
          'Hàm range(1, n + 1): Trong Python, range(start, stop) sẽ dừng ở stop - 1, do đó muốn tới n phải ghi n + 1.',
          'Phép chia dư %: i % 2 == 0 nghĩa là i chia hết cho 2 (số chẵn).',
        ],
        explanation: 'Biến tích lũy giống như con heo đất: ban đầu trống rỗng (tong = 0), mỗi lần gặp số chẵn thì em thả số đó vào (tong = tong + i).',
        rulesToRemember: [
          'range(1, n + 1) mới duyệt tới n.',
          'Dấu hai chấm (:) ở cuối câu lệnh for và if.',
          'Thụt lề đúng 4 dấu cách cho các lệnh bên trong.',
        ],
      },
      tier3: {
        pseudocodeSteps: [
          'Bước 1: Nhập số nguyên n từ bàn phím bằng int(input()).',
          'Bước 2: Tạo biến tong và gán bằng 0.',
          'Bước 3: Cho i chạy từ 1 đến n bằng vòng lặp for i in range(1, n + 1).',
          'Bước 4: Nếu i % 2 == 0 thì cộng dồn i vào tong (tong = tong + i).',
          'Bước 5: In giá trị biến tong ra màn hình.',
        ],
      },
      tier4: {
        fillInTheBlankCode: `n = int(input())
tong = 0

for i in range(1, ___):
    if i % 2 == ___:
        tong = tong + ___

print(tong)`,
        blankExplanation: 'Chỗ trống 1: Chặn trên của range để duyệt đến n. Chỗ trống 2: Số dư của phép chia cho 2 khi là số chẵn. Chỗ trống 3: Biến nào được cộng dồn vào tong?',
      },
    },
    reflectionQuestions: [
      'Biến "tong" đóng vai trò gì trong chương trình và tại sao phải gán nó bằng 0 trước vòng lặp?',
      'Tại sao trong hàm range lại cần ghi là "n + 1" thay vì chỉ ghi là "n"?',
      'Nếu muốn chỉ duyệt các số chẵn mà không cần câu lệnh "if", em có thể thay đổi bước nhảy trong range(start, stop, step) như thế nào?',
    ],
    transferChallenge: {
      title: 'Thử thách biến thể: Tính trung bình cộng các số chẵn',
      description: 'Hãy nâng cấp bài toán: In ra trung bình cộng của các số chẵn từ 1 đến n. Lưu ý xử lý trường hợp biên khi n = 1 (không có số chẵn nào để tránh lỗi chia cho 0)!',
    },
  },

  // Bài 2 (Bắt buộc theo yêu cầu): Đếm ký tự trong xâu (không dùng count())
  {
    id: 'dem-ky-tu-xau',
    codeNumber: 'THCS-02',
    title: 'Đếm ký tự trong xâu (Không dùng count())',
    grade: 'lop8',
    difficulty: 'Cơ bản',
    topic: 'Xâu ký tự (Strings)',
    topicCategory: 'strings',
    requiredKnowledge: ['Duyệt xâu ký tự', 'Vòng lặp for ch in S', 'Biến đếm', 'So sánh bằng =='],
    learningGoals: [
      'Hiểu cách duyệt từng ký tự trong một xâu văn bản.',
      'Sử dụng biến đếm để ghi nhận số lần xuất hiện.',
      'Rèn luyện tư duy thuật toán cơ bản mà không dựa dẫm vào hàm có sẵn (s.count()).',
    ],
    description: 'Nhập một xâu ký tự S và một ký tự c. Hãy đếm số lần ký tự c xuất hiện trong xâu S mà KHÔNG SỬ DỤNG hàm count() có sẵn của Python. In ra số lần xuất hiện đó.',
    inputFormat: 'Dòng 1 chứa xâu S. Dòng 2 chứa một ký tự c.',
    outputFormat: 'Một số nguyên duy nhất là số lần ký tự c xuất hiện trong S.',
    constraints: 'Độ dài xâu S từ 1 đến 500 ký tự',
    sampleInput: 'banana\na',
    sampleOutput: '3',
    commonMistakes: [
      'Sử dụng hàm S.count(c) thay vì tự viết thuật toán duyệt.',
      'Khởi tạo biến đếm = 1 thay vì bằng 0.',
      'So sánh phân biệt hoa thường chưa chuẩn nếu đề bài yêu cầu chính xác.',
    ],
    starterCode: {
      python: `# Bài 2: Đếm ký tự c trong xâu S (KHÔNG dùng hàm S.count())
s = input()
c = input()

# Gợi ý: Dùng vòng lặp for ch in s để duyệt qua từng ký tự
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    char c;
    getline(cin, s);
    cin >> c;
    // Dem so lan xuat hien
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh
Hỏi "Nhập xâu S:" và đợi
Đặt [S v] thành (câu trả lời)
...`,
    },
    teacherReferenceSolution: `# [ĐÁP ÁN THAM KHẢO DÀNH CHO GIÁO VIÊN]
s = input()
c = input()
dem = 0
for ch in s:
    if ch == c:
        dem = dem + 1
print(dem)`,
    testCases: [
      {
        id: 'tc1',
        input: 'banana\na',
        expectedOutput: '3',
        description: 'Xâu "banana", ký tự "a" xuất hiện 3 lần',
      },
      {
        id: 'tc2',
        input: 'lap trinh python\nt',
        expectedOutput: '2',
        description: 'Xâu có dấu cách, ký tự "t" xuất hiện 2 lần',
      },
      {
        id: 'tc3',
        input: 'hello\nx',
        expectedOutput: '0',
        isEdgeCase: true,
        description: 'Trường hợp ký tự không xuất hiện: kết quả là 0',
      },
      {
        id: 'tc4',
        input: 'aaaaa\na',
        expectedOutput: '5',
        description: 'Tất cả các ký tự đều trùng khớp',
      },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: [
          'Làm thế nào để đi qua từng chữ cái một trong một xâu văn bản?',
          'Trước khi bắt đầu đếm, số lượng ban đầu của ký tự c phải bằng bao nhiêu?',
        ],
        conceptHint: 'Hãy tưởng tượng em lật giở từng trang sách và đếm xem có bao nhiêu trang chứa hình bông hoa.',
      },
      tier2: {
        concepts: [
          'Vòng lặp duyệt xâu: for ch in s sẽ lần lượt gán từng ký tự của s vào biến ch.',
          'Biến đếm (Counter): Khởi tạo dem = 0, mỗi khi ch == c thì dem = dem + 1.',
          'Toán tử so sánh bằng: Dùng hai dấu bằng == để so sánh hai ký tự.',
        ],
        explanation: 'Mỗi khi nhìn thấy ký tự trùng với c, em gõ vào bàn một cái (tăng biến đếm thêm 1). Hết xâu thì số tiếng gõ chính là kết quả.',
        rulesToRemember: ['Nhớ so sánh bằng == chứ không dùng dấu gán =.'],
      },
      tier3: {
        pseudocodeSteps: [
          'Bước 1: Nhập xâu s và ký tự c từ bàn phím.',
          'Bước 2: Khởi tạo biến dem = 0.',
          'Bước 3: Dùng vòng lặp for ch in s để duyệt từng ký tự.',
          'Bước 4: Kiểm tra nếu ch == c thì tăng dem lên 1 (dem = dem + 1).',
          'Bước 5: In giá trị dem ra màn hình.',
        ],
      },
      tier4: {
        fillInTheBlankCode: `s = input()
c = input()

dem = 0
for ch in ___:
    if ch == ___:
        dem = dem + 1

print(___)`,
        blankExplanation: 'Chỗ trống 1: Xâu cần duyệt. Chỗ trống 2: Ký tự cần so sánh. Chỗ trống 3: Biến lưu kết quả cần in.',
      },
    },
    reflectionQuestions: [
      'Biến "dem" tăng lên khi nào? Điều kiện so sánh là gì?',
      'Tại sao việc tự viết vòng lặp duyệt xâu lại giúp em hiểu bản chất hơn là chỉ gọi hàm s.count()?',
    ],
    transferChallenge: {
      title: 'Thử thách biến thể: Đếm số nguyên âm',
      description: 'Hãy viết chương trình đếm xem trong xâu S có bao nhiêu nguyên âm tiếng Anh (a, e, i, o, u, không phân biệt hoa thường)!',
    },
  },

  // Bài 3 (Bắt buộc theo yêu cầu): Phát hiện và sửa lỗi logic (s = i thay vì s = s + i)
  {
    id: 'phat-hien-loi-logic',
    codeNumber: 'THCS-03',
    title: 'Phát hiện và sửa lỗi logic (Gán đè biến tích lũy)',
    grade: 'lop7',
    difficulty: 'Trung bình',
    topic: 'Phát hiện và sửa lỗi (Debugging)',
    topicCategory: 'debugging',
    requiredKnowledge: ['Đọc hiểu mã nguồn', 'Vai trò biến tích lũy', 'Gỡ lỗi logic'],
    learningGoals: [
      'Phát hiện lỗi logic: phân biệt giữa phép gán đè (=) và phép cộng dồn (+= hoặc s = s + i).',
      'Giải thích được tại sao chương trình chạy không báo lỗi cú pháp nhưng kết quả lại sai.',
      'Sửa đúng vị trí lỗi mà không làm thay đổi các phần code chuẩn.',
    ],
    description: 'Một bạn học sinh viết chương trình sau để tính tổng các số chẵn từ 1 đến n:\n\n```python\nn = int(input())\ns = 0\nfor i in range(1, n + 1):\n    if i % 2 == 0:\n        s = i\nprint(s)\n```\n\nKhi chạy với n = 6, chương trình in ra kết quả là 6 (trong khi kết quả đúng phải là 12 = 2 + 4 + 6).\nEm hãy phát hiện lỗi nằm ở đâu và sửa lại chương trình cho đúng!',
    inputFormat: 'Một số nguyên dương n (1 <= n <= 1000)',
    outputFormat: 'Một số nguyên duy nhất là tổng các số chẵn đúng.',
    constraints: '1 <= n <= 1000',
    sampleInput: '6',
    sampleOutput: '12',
    commonMistakes: [
      'Không nhận ra s = i là lệnh gán đè, chỉ giữ lại số chẵn cuối cùng.',
      'Nhầm lẫn giữa cú pháp đúng và logic đúng.',
    ],
    starterCode: {
      python: `# Đoạn mã đang bị lỗi logic: Hãy tìm dòng sai và sửa lại!
n = int(input())
s = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        s = i
print(s)
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int s = 0;
    for (int i = 1; i <= n; i++) {
        if (i % 2 == 0) {
            s = i; // Dong nay bi loi logic!
        }
    }
    cout << s;
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh
...`,
    },
    teacherReferenceSolution: `# [ĐÁP ÁN THAM KHẢO DÀNH CHO GIÁO VIÊN]
# Lỗi nằm ở dòng 6: s = i (gán đè)
# Sửa thành: s = s + i (hoặc s += i)
n = int(input())
s = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        s = s + i
print(s)`,
    testCases: [
      {
        id: 'tc1',
        input: '6',
        expectedOutput: '12',
        description: 'n = 6: tổng đúng là 2 + 4 + 6 = 12',
      },
      {
        id: 'tc2',
        input: '4',
        expectedOutput: '6',
        description: 'n = 4: tổng đúng là 2 + 4 = 6',
      },
      {
        id: 'tc3',
        input: '1',
        expectedOutput: '0',
        isEdgeCase: true,
        description: 'n = 1: Không có số chẵn, in 0',
      },
      {
        id: 'tc4',
        input: '8',
        expectedOutput: '20',
        description: 'n = 8: 2 + 4 + 6 + 8 = 20',
      },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: [
          'Khi i = 2, biến s nhận giá trị bao nhiêu? Rồi đến khi i = 4, biến s lại nhận giá trị bao nhiêu?',
          'Biến s có được cộng dồn giá trị cũ không hay bị thay thế hoàn toàn bởi giá trị mới?',
        ],
        conceptHint: 'Quy tắc HINT-FIRST: AI không được sửa ngay s = i thành s = s + i, mà hãy hỏi em về vai trò của s qua từng vòng lặp!',
      },
      tier2: {
        concepts: [
          'Phép gán đè: s = i sẽ xóa sạch giá trị trước đó của s và thay bằng i.',
          'Phép cộng dồn: s = s + i lấy giá trị hiện tại của s cộng thêm i rồi mới cất lại vào s.',
        ],
        explanation: 'Giống như bạn học sinh cất sách vào cặp: thay vì xếp thêm quyển vở mới vào cặp (s = s + i), bạn ấy lại vứt hết sách cũ ra ngoài rồi mới cho sách mới vào (s = i)!',
        rulesToRemember: ['Muốn tích lũy tổng, vế phải luôn phải chứa chính biến đó: s = s + ...'],
      },
      tier3: {
        pseudocodeSteps: [
          'Bước 1: Quan sát dòng lệnh bên trong khối if: s = i.',
          'Bước 2: Thay đổi phép gán đè đó thành phép cộng tích lũy: s = s + i hoặc s += i.',
          'Bước 3: Chạy lại thử nghiệm với n = 6 và kiểm tra xem kết quả có ra 12 chưa.',
        ],
      },
      tier4: {
        fillInTheBlankCode: `n = int(input())
s = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        s = ___ + i  # Hãy sửa dòng này
print(s)`,
        blankExplanation: 'Chỗ trống: Cần giữ lại giá trị cũ của biến nào trước khi cộng thêm i?',
      },
    },
    reflectionQuestions: [
      'Tại sao khi n = 6, mã nguồn cũ lại in ra số 6?',
      'Sự khác nhau bản chất giữa câu lệnh s = i và câu lệnh s = s + i là gì?',
    ],
    transferChallenge: {
      title: 'Thử thách biến thể: Tính tích các số',
      description: 'Nếu muốn tính TÍCH các số từ 1 đến n (P = 1 * 2 * ... * n), em cần khởi tạo P bằng bao nhiêu và dòng cập nhật sẽ là gì?',
    },
  },

  // Bài 4: Biến và kiểu dữ liệu - Đổi giây sang Giờ, Phút, Giây
  {
    id: 'doi-giay-gio-phut-giay',
    codeNumber: 'THCS-04',
    title: 'Đổi thời gian từ Giây sang Giờ, Phút, Giây',
    grade: 'lop6',
    difficulty: 'Cơ bản',
    topic: 'Biến và kiểu dữ liệu',
    topicCategory: 'variables',
    requiredKnowledge: ['Phép chia nguyên //', 'Phép chia dư %', 'Khởi tạo biến'],
    learningGoals: [
      'Sử dụng phép chia nguyên // để lấy phần nguyên của giờ và phút.',
      'Sử dụng phép chia dư % để lấy số giây còn dư.',
    ],
    description: 'Nhập một số nguyên dương T biểu thị thời gian tính bằng giây. Hãy đổi T thành số Giờ, Phút, Giây tương ứng và in ra màn hình cách nhau bởi dấu cách.',
    inputFormat: 'Một số nguyên dương T (1 <= T <= 86400)',
    outputFormat: 'Ba số nguyên: Gio Phut Giay',
    constraints: '1 <= T <= 86400',
    sampleInput: '3665',
    sampleOutput: '1 1 5',
    commonMistakes: ['Dùng phép chia thực / khiến kết quả ra số thập phân.'],
    starterCode: {
      python: `# Nhập số giây T
t = int(input())

# 1 giờ = 3600 giây, 1 phút = 60 giây
# Dùng phép chia nguyên // và chia dư %
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    int t;
    cin >> t;
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh...`,
    },
    teacherReferenceSolution: `t = int(input())
gio = t // 3600
con_lai = t % 3600
phut = con_lai // 60
giay = con_lai % 60
print(gio, phut, giay)`,
    testCases: [
      { id: 'tc1', input: '3665', expectedOutput: '1 1 5', description: '3665 giây = 1 giờ 1 phút 5 giây' },
      { id: 'tc2', input: '3600', expectedOutput: '1 0 0', description: 'Tròn 1 giờ' },
      { id: 'tc3', input: '59', expectedOutput: '0 0 59', isEdgeCase: true, description: 'Chưa đủ 1 phút' },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: [
          'Một giờ có bao nhiêu giây? Một phút có bao nhiêu giây?',
          'Phép toán nào trong Python giúp em lấy phần nguyên mà không bị lẻ thập phân?',
        ],
        conceptHint: 'Hãy chia cho 3600 để tìm số giờ trước, phần còn lại dùng để tính phút và giây.',
      },
      tier2: {
        concepts: ['Phép chia nguyên //: 3665 // 3600 = 1', 'Phép chia dư %: 3665 % 3600 = 65'],
        explanation: 'Sau khi lấy hết số giờ đầy đủ, số giây còn thừa sẽ chia tiếp cho 60 để lấy số phút.',
        rulesToRemember: ['Dùng dấu phẩy trong print(gio, phut, giay) để in cách nhau bởi dấu cách.'],
      },
      tier3: {
        pseudocodeSteps: [
          'Bước 1: gio = t // 3600',
          'Bước 2: con_lai = t % 3600',
          'Bước 3: phut = con_lai // 60',
          'Bước 4: giay = con_lai % 60',
          'Bước 5: print(gio, phut, giay)',
        ],
      },
      tier4: {
        fillInTheBlankCode: `t = int(input())
gio = t // ___
du = t % 3600
phut = du // ___
giay = du % 60
print(gio, phut, giay)`,
        blankExplanation: 'Chỗ trống 1: Số giây trong 1 giờ. Chỗ trống 2: Số giây trong 1 phút.',
      },
    },
    reflectionQuestions: ['Tại sao lại dùng // mà không dùng /?'],
    transferChallenge: {
      title: 'Đổi sang định dạng đồng hồ',
      description: 'In theo định dạng hh:mm:ss với đủ 2 chữ số (ví dụ 01:01:05)!',
    },
  },

  // Bài 5: Phép toán - Chu vi và diện tích hình chữ nhật
  {
    id: 'chu-vi-dien-tich-hcn',
    codeNumber: 'THCS-05',
    title: 'Tính chu vi và diện tích hình chữ nhật',
    grade: 'lop6',
    difficulty: 'Cơ bản',
    topic: 'Phép toán số học',
    topicCategory: 'operators',
    requiredKnowledge: ['Toán tử cộng + và nhân *', 'Nhập nhiều số trên 1 dòng'],
    learningGoals: ['Thực hiện phép toán số học cơ bản.', 'Nhập xuất dữ liệu chuẩn.'],
    description: 'Nhập vào hai số nguyên dương a và b là chiều dài và chiều rộng của hình chữ nhật. Hãy tính và in ra chu vi và diện tích của hình chữ nhật đó trên cùng một dòng, cách nhau một dấu cách.',
    inputFormat: 'Hai số nguyên a và b (1 <= a, b <= 1000)',
    outputFormat: 'Hai số nguyên: ChuVi DienTich',
    constraints: '1 <= a, b <= 1000',
    sampleInput: '5 3',
    sampleOutput: '16 15',
    commonMistakes: ['Quên nhân 2 trong công thức chu vi (a + b) * 2.'],
    starterCode: {
      python: `a, b = map(int, input().split())
# Tính chu vi và diện tích
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh...`,
    },
    teacherReferenceSolution: `a, b = map(int, input().split())
cv = (a + b) * 2
dt = a * b
print(cv, dt)`,
    testCases: [
      { id: 'tc1', input: '5 3', expectedOutput: '16 15', description: 'Chu vi 16, diện tích 15' },
      { id: 'tc2', input: '4 4', expectedOutput: '16 16', isEdgeCase: true, description: 'Hình vuông a = b' },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: ['Công thức tính chu vi hình chữ nhật là gì? Còn diện tích?'],
        conceptHint: 'Chú ý đặt ngoặc đơn (a + b) trước khi nhân với 2!',
      },
      tier2: {
        concepts: ['Thứ tự ưu tiên phép toán: Nhân chia trước, cộng trừ sau. Do đó cần (a + b) * 2.'],
        explanation: 'Nếu viết a + b * 2 thì máy tính sẽ tính b * 2 trước rồi mới cộng a, dẫn đến kết quả sai.',
        rulesToRemember: ['Dùng ngoặc tròn () để gom nhóm.'],
      },
      tier3: {
        pseudocodeSteps: ['Bước 1: Nhập a, b.', 'Bước 2: cv = (a + b) * 2.', 'Bước 3: dt = a * b.', 'Bước 4: print(cv, dt).'],
      },
      tier4: {
        fillInTheBlankCode: `a, b = map(int, input().split())
cv = (a + b) * ___
dt = a ___ b
print(cv, dt)`,
        blankExplanation: 'Chỗ trống 1: Hệ số nhân chu vi. Chỗ trống 2: Dấu phép nhân.',
      },
    },
    reflectionQuestions: ['Tại sao lại phải có dấu ngoặc (a + b)?'],
    transferChallenge: {
      title: 'Hình thang cân',
      description: 'Nhập đáy lớn, đáy nhỏ, chiều cao hình thang và tính diện tích!',
    },
  },

  // Bài 6: Rẽ nhánh if - else - Kiểm tra năm nhuận
  {
    id: 'kiem-tra-nam-nhuan',
    codeNumber: 'THCS-06',
    title: 'Kiểm tra năm nhuận theo Dương lịch',
    grade: 'lop7',
    difficulty: 'Cơ bản',
    topic: 'Câu lệnh if, if-else',
    topicCategory: 'ifelse',
    requiredKnowledge: ['Toán tử logic and / or', 'Toán tử chia dư %'],
    learningGoals: ['Hiểu và kết hợp các điều kiện logic phức tạp bằng and, or.'],
    description: 'Một năm là năm nhuận nếu: chia hết cho 400 HOẶC (chia hết cho 4 VÀ không chia hết cho 100). Viết chương trình nhập năm và in ra "YES" nếu nhuận, ngược lại in "NO".',
    inputFormat: 'Một số nguyên dương là năm (ví dụ: 2024, 1900)',
    outputFormat: 'YES hoặc NO',
    constraints: '1 <= year <= 9999',
    sampleInput: '2024',
    sampleOutput: 'YES',
    commonMistakes: ['Nghĩ rằng cứ chia hết cho 4 là năm nhuận (sai với năm 1900, 2100).'],
    starterCode: {
      python: `year = int(input())
# Kiểm tra năm nhuận
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    int year;
    cin >> year;
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh...`,
    },
    teacherReferenceSolution: `year = int(input())
if (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):
    print("YES")
else:
    print("NO")`,
    testCases: [
      { id: 'tc1', input: '2024', expectedOutput: 'YES', description: 'Năm nhuận thường chia hết cho 4' },
      { id: 'tc2', input: '1900', expectedOutput: 'NO', isEdgeCase: true, description: '1900 chia hết cho 4 nhưng chia hết cho 100 -> KHÔNG nhuận' },
      { id: 'tc3', input: '2000', expectedOutput: 'YES', isEdgeCase: true, description: '2000 chia hết cho 400 -> Nhuận' },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: ['Có mấy trường hợp dẫn đến năm nhuận?', 'Toán tử and và or khác nhau thế nào?'],
        conceptHint: 'Năm 1900 không nhuận nhưng năm 2000 lại nhuận, em hãy thử chia nhẩm xem sao.',
      },
      tier2: {
        concepts: ['Điều kiện kép: (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0)'],
        explanation: 'year % 100 != 0 nghĩa là KHÔNG chia hết cho 100.',
        rulesToRemember: ['!= là so sánh khác.'],
      },
      tier3: {
        pseudocodeSteps: ['B1: Nhập year.', 'B2: Nếu thỏa mãn quy tắc in YES, ngược lại in NO.'],
      },
      tier4: {
        fillInTheBlankCode: `year = int(input())
if (year % 400 == 0) ___ ((year % 4 == 0) ___ (year % 100 != 0)):
    print("YES")
else:
    print("NO")`,
        blankExplanation: 'Điền or và and vào chỗ trống.',
      },
    },
    reflectionQuestions: ['Tại sao thế kỷ 1900 không phải năm nhuận?'],
    transferChallenge: {
      title: 'Số ngày của tháng 2',
      description: 'Nhập năm và in ra số ngày của tháng 2 trong năm đó (28 hoặc 29 ngày)!',
    },
  },

  // Bài 7: Vòng lặp while - Ước chung lớn nhất (UCLN)
  {
    id: 'uoc-chung-lon-nhat',
    codeNumber: 'THCS-07',
    title: 'Tìm Ước chung lớn nhất (UCLN) bằng thuật toán Euclid',
    grade: 'lop8',
    difficulty: 'Trung bình',
    topic: 'Vòng lặp while',
    topicCategory: 'whileloop',
    requiredKnowledge: ['Vòng lặp while', 'Thuật toán trừ dần Euclid'],
    learningGoals: ['Hiểu cách dùng vòng lặp while khi chưa biết trước số lần lặp.'],
    description: 'Nhập vào hai số nguyên dương a và b. Hãy tìm và in ra ước chung lớn nhất (UCLN) của hai số đó.',
    inputFormat: 'Hai số nguyên a và b cách nhau một dấu cách',
    outputFormat: 'Một số nguyên duy nhất là UCLN',
    constraints: '1 <= a, b <= 10^9',
    sampleInput: '24 36',
    sampleOutput: '12',
    commonMistakes: ['Không thay đổi a hoặc b bên trong vòng lặp dẫn đến lặp vô tận (infinite loop).'],
    starterCode: {
      python: `a, b = map(int, input().split())
# Dùng vòng lặp while a != b
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh...`,
    },
    teacherReferenceSolution: `a, b = map(int, input().split())
while a != b:
    if a > b:
        a = a - b
    else:
        b = b - a
print(a)`,
    testCases: [
      { id: 'tc1', input: '24 36', expectedOutput: '12', description: 'UCLN(24, 36) = 12' },
      { id: 'tc2', input: '7 13', expectedOutput: '1', description: 'Hai số nguyên tố cùng nhau' },
      { id: 'tc3', input: '15 15', expectedOutput: '15', isEdgeCase: true, description: 'Hai số bằng nhau' },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: ['Thuật toán Euclid trừ dần hoạt động như thế nào?', 'Khi nào thì vòng lặp while sẽ dừng?'],
        conceptHint: 'Nếu a > b thì bớt a đi một lượng bằng b, lặp lại đến khi a bằng b.',
      },
      tier2: {
        concepts: ['while a != b: tiếp tục lặp khi a vẫn còn khác b.'],
        explanation: 'Mỗi bước ta rút ngắn khoảng cách giữa hai số.',
        rulesToRemember: ['Phải cập nhật a hoặc b để không bị lặp vô tận.'],
      },
      tier3: {
        pseudocodeSteps: ['B1: Nhập a, b.', 'B2: Khi a != b: nếu a > b gán a = a - b, ngược lại b = b - a.', 'B3: In a.'],
      },
      tier4: {
        fillInTheBlankCode: `a, b = map(int, input().split())
while a ___ b:
    if a > b:
        a = a - b
    else:
        b = b - a
print(a)`,
        blankExplanation: 'Chỗ trống: Điều kiện để tiếp tục lặp (!=).',
      },
    },
    reflectionQuestions: ['Nếu một trong hai số ban đầu là 0 thì sao?'],
    transferChallenge: {
      title: 'Bội chung nhỏ nhất (BCNN)',
      description: 'Dựa vào UCLN, tính BCNN = (a * b) // UCLN(a, b)!',
    },
  },

  // Bài 8: Danh sách List - Tìm điểm cao nhất trong lớp
  {
    id: 'tim-diem-cao-nhat',
    codeNumber: 'THCS-08',
    title: 'Tìm điểm số cao nhất trong danh sách lớp',
    grade: 'lop8',
    difficulty: 'Trung bình',
    topic: 'Danh sách List',
    topicCategory: 'lists',
    requiredKnowledge: ['Khởi tạo list', 'Duyệt danh sách bằng for', 'Cập nhật giá trị lớn nhất max'],
    learningGoals: ['Hiểu kỹ thuật đặt lính canh (sentinel) tìm phần tử lớn nhất.'],
    description: 'Nhập vào một danh sách các điểm số nguyên của học sinh trên một dòng. Hãy tìm và in ra điểm số cao nhất mà không sử dụng hàm max() có sẵn của Python.',
    inputFormat: 'Một dòng gồm các số nguyên cách nhau bởi dấu cách',
    outputFormat: 'Một số nguyên là điểm cao nhất',
    constraints: 'Danh sách có từ 1 đến 100 số nguyên từ 0 đến 10',
    sampleInput: '7 9 5 10 8',
    sampleOutput: '10',
    commonMistakes: ['Khởi tạo max_val = 0 nhưng gặp danh sách toàn số âm.'],
    starterCode: {
      python: `# Nhập danh sách điểm số
diem = list(map(int, input().split()))

# Gợi ý: Giả sử phần tử đầu tiên là lớn nhất (max_val = diem[0])
# Duyệt các phần tử còn lại để cập nhật
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh...`,
    },
    teacherReferenceSolution: `diem = list(map(int, input().split()))
max_val = diem[0]
for x in diem:
    if x > max_val:
        max_val = x
print(max_val)`,
    testCases: [
      { id: 'tc1', input: '7 9 5 10 8', expectedOutput: '10', description: 'Điểm cao nhất là 10' },
      { id: 'tc2', input: '6 6 6', expectedOutput: '6', description: 'Các phần tử bằng nhau' },
      { id: 'tc3', input: '8', expectedOutput: '8', isEdgeCase: true, description: 'Chỉ có 1 phần tử' },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: ['Em chọn ai làm "quán quân tạm thời" trước khi bắt đầu so tài?', 'Khi nào quán quân bị đổi ngôi?'],
        conceptHint: 'Chọn phần tử đầu tiên diem[0] làm quán quân tạm thời.',
      },
      tier2: {
        concepts: ['Kỹ thuật lính canh: max_val = diem[0], nếu gặp x > max_val thì gán max_val = x.'],
        explanation: 'Giống như cuộc thi vật: người giữ cúp ban đầu là bạn đầu tiên, nếu bạn nào thắng người giữ cúp thì đoạt cúp.',
        rulesToRemember: ['Duyệt qua danh sách bằng for x in diem.'],
      },
      tier3: {
        pseudocodeSteps: ['B1: Nhập list.', 'B2: max_val = diem[0].', 'B3: Duyệt x trong diem: nếu x > max_val thì max_val = x.', 'B4: In max_val.'],
      },
      tier4: {
        fillInTheBlankCode: `diem = list(map(int, input().split()))
max_val = diem[0]
for x in diem:
    if x ___ max_val:
        max_val = ___
print(max_val)`,
        blankExplanation: 'Điền > và x vào chỗ trống.',
      },
    },
    reflectionQuestions: ['Tại sao lại gán max_val = diem[0] mà không phải gán bằng 0?'],
    transferChallenge: {
      title: 'Đếm số bạn đạt điểm cao nhất',
      description: 'Tìm điểm cao nhất và đếm xem có bao nhiêu bạn đạt cùng mức điểm đó!',
    },
  },

  // Bài 9: Xâu ký tự - Đếm số từ trong câu văn
  {
    id: 'dem-so-tu',
    codeNumber: 'THCS-09',
    title: 'Đếm số từ trong câu văn',
    grade: 'lop9',
    difficulty: 'Trung bình',
    topic: 'Xâu ký tự (Strings)',
    topicCategory: 'strings',
    requiredKnowledge: ['Phương thức split()', 'Hàm len()'],
    learningGoals: ['Xử lý khoảng trắng thừa và đếm phần tử danh sách.'],
    description: 'Nhập một câu văn có thể chứa nhiều khoảng trắng thừa ở đầu, giữa hoặc cuối câu. Đếm số lượng từ có trong câu văn đó.',
    inputFormat: 'Một dòng chứa câu văn',
    outputFormat: 'Một số nguyên duy nhất là số từ',
    constraints: 'Độ dài câu từ 1 đến 500 ký tự',
    sampleInput: '   Hoc   lap   trinh   ',
    sampleOutput: '3',
    commonMistakes: ['Dùng split(" ") thay vì split() khiến các khoảng trắng thừa bị tính thành từ rỗng.'],
    starterCode: {
      python: `s = input()
# Tách các từ và đếm
`,
      cpp: `#include <iostream>
using namespace std;
int main() { return 0; }`,
      scratch: `Khi nhấn cờ xanh...`,
    },
    teacherReferenceSolution: `s = input()
cac_tu = s.split()
print(len(cac_tu))`,
    testCases: [
      { id: 'tc1', input: '   Hoc   lap   trinh   ', expectedOutput: '3', description: 'Có nhiều dấu cách thừa' },
      { id: 'tc2', input: 'Python', expectedOutput: '1', description: 'Chỉ có 1 từ' },
      { id: 'tc3', input: 'Tin hoc lop 8 rat vui', expectedOutput: '6', description: 'Câu bình thường' },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: ['Phương thức nào trong Python giúp tự gom các khoảng trắng liên tiếp để tách từ?'],
        conceptHint: 's.split() không truyền tham số sẽ tự động xử lý toàn bộ khoảng trắng thừa.',
      },
      tier2: {
        concepts: ['s.split() trả về list các từ', 'len(list) trả về số lượng phần tử'],
        explanation: 'Hàm split() giống như chiếc kéo cắt các khoảng trắng.',
        rulesToRemember: ['Không truyền gì vào s.split() để tự động gom dấu cách.'],
      },
      tier3: {
        pseudocodeSteps: ['B1: Nhập s.', 'B2: tu = s.split().', 'B3: In len(tu).'],
      },
      tier4: {
        fillInTheBlankCode: `s = input()
tu = s.___()
print(___(tu))`,
        blankExplanation: 'Điền split và len vào chỗ trống.',
      },
    },
    reflectionQuestions: ['Sự khác nhau giữa s.split() và s.split(" ") là gì?'],
    transferChallenge: {
      title: 'Tìm từ dài nhất',
      description: 'In ra từ có độ dài lớn nhất trong câu văn!',
    },
  },

  // Bài 10: Bài tập tổng hợp - Kiểm tra số nguyên tố
  {
    id: 'kiem-tra-so-nguyen-to',
    codeNumber: 'THCS-10',
    title: 'Kiểm tra một số có phải số nguyên tố không',
    grade: 'lop8',
    difficulty: 'Trung bình',
    topic: 'Bài tập tổng hợp',
    topicCategory: 'advanced',
    requiredKnowledge: ['Định nghĩa số nguyên tố', 'Kỹ thuật đặt cờ (Flag boolean)', 'Vòng lặp và lệnh break'],
    learningGoals: ['Kết hợp vòng lặp, điều kiện rẽ nhánh và biến cờ hiệu logic.'],
    description: 'Nhập vào một số nguyên dương n. Kiểm tra xem n có phải là số nguyên tố hay không. In ra "YES" nếu đúng, ngược lại in "NO".',
    inputFormat: 'Một số nguyên dương n (1 <= n <= 10^6)',
    outputFormat: 'YES hoặc NO',
    constraints: '1 <= n <= 10^6',
    sampleInput: '7',
    sampleOutput: 'YES',
    commonMistakes: ['Cho rằng số 1 là số nguyên tố (sai định nghĩa).'],
    starterCode: {
      python: `n = int(input())
# Số nguyên tố lớn hơn 1 và chỉ chia hết cho 1 và chính nó
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    return 0;
}`,
      scratch: `Khi nhấn cờ xanh...`,
    },
    teacherReferenceSolution: `n = int(input())
if n <= 1:
    print("NO")
else:
    la_snt = True
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            la_snt = False
            break
    if la_snt:
        print("YES")
    else:
        print("NO")`,
    testCases: [
      { id: 'tc1', input: '7', expectedOutput: 'YES', description: 'Số 7 là số nguyên tố' },
      { id: 'tc2', input: '8', expectedOutput: 'NO', description: 'Số 8 là hợp số' },
      { id: 'tc3', input: '1', expectedOutput: 'NO', isEdgeCase: true, description: 'Số 1 KHÔNG PHẢI số nguyên tố' },
      { id: 'tc4', input: '2', expectedOutput: 'YES', isEdgeCase: true, description: 'Số 2 là số nguyên tố chẵn duy nhất' },
    ],
    tieredGuidance: {
      tier1: {
        guidingQuestions: ['Số 1 có phải số nguyên tố không?', 'Để chứng minh n KHÔNG PHẢI số nguyên tố, em cần tìm thấy điều gì?'],
        conceptHint: 'Chỉ cần tìm thấy MỘT ước số từ 2 đến n-1 thì n không phải số nguyên tố.',
      },
      tier2: {
        concepts: ['Kỹ thuật cờ hiệu: la_snt = True, nếu tìm thấy ước thì đổi thành False và thoát sớm bằng break.'],
        explanation: 'Giống như thám tử: ban đầu giả định nghi can vô tội, chỉ cần 1 chứng cứ là kết luận ngay.',
        rulesToRemember: ['n <= 1 in NO ngay lập tức.'],
      },
      tier3: {
        pseudocodeSteps: ['B1: Nếu n <= 1 in NO.', 'B2: Ngược lại la_snt = True.', 'B3: Duyệt i từ 2 đến căn n: nếu n chia hết cho i thì la_snt = False, break.', 'B4: Kiểm tra cờ và in YES/NO.'],
      },
      tier4: {
        fillInTheBlankCode: `n = int(input())
if n <= 1:
    print("NO")
else:
    la_snt = True
    for i in range(2, int(n**0.5) + 1):
        if n % i == ___:
            la_snt = False
            break
    if la_snt:
        print("___")
    else:
        print("NO")`,
        blankExplanation: 'Điền 0 và YES vào chỗ trống.',
      },
    },
    reflectionQuestions: ['Tại sao chỉ cần kiểm tra đến căn bậc hai của n là đủ?'],
    transferChallenge: {
      title: 'Đếm số nguyên tố trong đoạn',
      description: 'Cho hai số A và B, đếm xem có bao nhiêu số nguyên tố nằm trong đoạn [A, B]!',
    },
  },
];
