import { ClassRoom, Assignment, RubricCriterion, TeacherReview, SystemAuditLog, LearningJournalEntry } from '../types';

export const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'crit-1',
    name: '1. Phân tích và hiểu bài toán',
    description: 'Khả năng xác định đúng Input, Output, điều kiện biên và kiến thức cần vận dụng.',
    levels: [
      { level: 1, label: 'Mức 1 (Cần cố gắng)', description: 'Chưa xác định được Input/Output, hiểu nhầm yêu cầu đề bài.', score: 1 },
      { level: 2, label: 'Mức 2 (Đạt)', description: 'Xác định được Input/Output cơ bản nhưng chưa chú ý đến điều kiện ràng buộc.', score: 2 },
      { level: 3, label: 'Mức 3 (Khá)', description: 'Xác định chính xác Input/Output và liên hệ được kiến thức cần dùng.', score: 3 },
      { level: 4, label: 'Mức 4 (Tốt/Xuất sắc)', description: 'Hiểu sâu sắc bài toán, phát hiện ngay trường hợp đặc biệt và biên dữ liệu.', score: 4 },
    ],
  },
  {
    id: 'crit-2',
    name: '2. Nỗ lực tự lực trước khi hỏi AI',
    description: 'Thói quen tự tư duy, đưa ra bằng chứng (ý tưởng, giả mã, thử nghiệm) trước khi nhờ trợ giúp.',
    levels: [
      { level: 1, label: 'Mức 1 (Cần cố gắng)', description: 'Hỏi AI ngay lập tức khi vừa đọc đề, yêu cầu làm bài thay hoặc cho đáp án.', score: 1 },
      { level: 2, label: 'Mức 2 (Đạt)', description: 'Nêu được ý tưởng sơ sài nhưng chưa thử nghiệm viết mã hay tính nhẩm.', score: 2 },
      { level: 3, label: 'Mức 3 (Khá)', description: 'Có giả mã hoặc đoạn mã đã tự viết thử nghiệm trước khi yêu cầu gợi ý.', score: 3 },
      { level: 4, label: 'Mức 4 (Tốt/Xuất sắc)', description: 'Tự lực thử nhiều phương án, khoanh vùng rõ điểm mình đang mắc kẹt để hỏi đúng trọng tâm.', score: 4 },
    ],
  },
  {
    id: 'crit-3',
    name: '3. Gỡ lỗi và kiểm thử độc lập',
    description: 'Thói quen dự đoán trước khi chạy máy, tự tạo testcase và phân loại lỗi gặp phải.',
    levels: [
      { level: 1, label: 'Mức 1 (Cần cố gắng)', description: 'Chỉ nhấn chạy mà không dự đoán, không hiểu thông báo lỗi báo gì.', score: 1 },
      { level: 2, label: 'Mức 2 (Đạt)', description: 'Dự đoán được testcase mẫu đơn giản, nhận diện được lỗi cú pháp cơ bản.', score: 2 },
      { level: 3, label: 'Mức 3 (Khá)', description: 'Tự dự đoán đúng trên 2 testcase, phân loại được lỗi cú pháp vs lỗi logic.', score: 3 },
      { level: 4, label: 'Mức 4 (Tốt/Xuất sắc)', description: 'Chủ động thử nghiệm testcase biên (0, âm, xâu rỗng), sửa lỗi logic chính xác.', score: 4 },
    ],
  },
  {
    id: 'crit-4',
    name: '4. Khả năng giải thích lời giải (Phản tư)',
    description: 'Giải thích được vai trò các biến, vòng lặp và lý do tại sao thuật toán đúng.',
    levels: [
      { level: 1, label: 'Mức 1 (Cần cố gắng)', description: 'Không giải thích được các dòng code do mình viết ra.', score: 1 },
      { level: 2, label: 'Mức 2 (Đạt)', description: 'Nêu được tên biến nhưng chưa giải thích rõ vai trò qua từng vòng lặp.', score: 2 },
      { level: 3, label: 'Mức 3 (Khá)', description: 'Giải thích mạch lạc vai trò biến tích lũy, điều kiện dừng của vòng lặp.', score: 3 },
      { level: 4, label: 'Mức 4 (Tốt/Xuất sắc)', description: 'Hiểu bản chất thuật toán và tự tin giải quyết được bài toán biến thể mở rộng.', score: 4 },
    ],
  },
  {
    id: 'crit-5',
    name: '5. Sử dụng AI có trách nhiệm',
    description: 'Không lạm dụng gợi ý tầng cao, luôn kiểm chứng câu trả lời của AI.',
    levels: [
      { level: 1, label: 'Mức 1 (Cần cố gắng)', description: 'Liên tục bấm xin tầng 4 hoặc sao chép gợi ý mà không suy nghĩ.', score: 1 },
      { level: 2, label: 'Mức 2 (Đạt)', description: 'Dừng lại ở Tầng 2-3 nhưng đôi khi quên chạy thử để kiểm chứng.', score: 2 },
      { level: 3, label: 'Mức 3 (Khá)', description: 'Chỉ xin gợi ý tầng cao khi thật sự bế tắc, luôn kiểm chứng lời gợi ý.', score: 3 },
      { level: 4, label: 'Mức 4 (Tốt/Xuất sắc)', description: 'Làm chủ tiến trình học tập, phản biện sắc sảo khi phát hiện AI gợi ý chưa tối ưu.', score: 4 },
    ],
  },
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'class-7a1',
    code: 'TIN7A1',
    name: 'Lớp 7A1 - Tin học GDPT 2018',
    grade: 'lop7',
    teacherId: 'teacher-1',
    teacherName: 'Thầy Nguyễn Minh Thức',
    createdAt: Date.now() - 86400000 * 14,
    studentCodes: ['HS-0701', 'HS-0702', 'HS-0703', 'HS-0704', 'HS-0705'],
    activeAssignmentId: 'assign-1',
    isLocked: false,
  },
  {
    id: 'class-8a2',
    code: 'TIN8A2',
    name: 'Lớp 8A2 - Thuật toán Python',
    grade: 'lop8',
    teacherId: 'teacher-1',
    teacherName: 'Thầy Nguyễn Minh Thức',
    createdAt: Date.now() - 86400000 * 7,
    studentCodes: ['HS-0811', 'HS-0812', 'HS-0813'],
    activeAssignmentId: 'assign-2',
    isLocked: false,
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    classId: 'class-7a1',
    problemId: 'tong-so-chan',
    title: 'Bài tập tuần 8: Tổng các số chẵn',
    dueDate: '2026-11-05',
    aiEnabled: true,
    maxAiTier: 4,
    allowNoAiChallenge: true,
    assignedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'assign-2',
    classId: 'class-8a2',
    problemId: 'dem-ky-tu-xau',
    title: 'Thực hành xâu: Đếm ký tự trong văn bản',
    dueDate: '2026-11-10',
    aiEnabled: true,
    maxAiTier: 3, // Teacher limits to Tier 3 max!
    allowNoAiChallenge: true,
    assignedAt: Date.now() - 86400000 * 2,
  },
];

export const INITIAL_JOURNAL_ENTRIES: LearningJournalEntry[] = [
  {
    id: 'journal-1',
    problemId: 'tong-so-chan',
    problemTitle: 'Tính tổng các số chẵn từ 1 đến N',
    studentCode: 'HS-0701',
    priorEffort: 'Em đã thử viết vòng lặp for i in range(1, n) nhưng bị thiếu mất số n.',
    studentQuestions: ['Tại sao hàm range(1, 6) lại không duyệt đến số 6 ạ?'],
    aiHintsReceived: ['Nhắc quy tắc: range(start, stop) chỉ duyệt đến stop - 1.'],
    selfCorrections: 'Em đã đổi thành range(1, n + 1) và khởi tạo tong = 0 trước vòng lặp.',
    testCasesUsed: ['n = 6 -> 12', 'n = 1 -> 0 (biên)', 'n = 5 -> 6'],
    testResultsSummary: 'Đạt 3/3 test case, khớp dự đoán.',
    lessonsLearned: 'Hiểu rõ nguyên lý hoạt động của hàm range và biến tích lũy.',
    remainingDoubts: 'Nếu n rất lớn (ví dụ 1 triệu) thì có công thức toán nào tính ngay mà không cần lặp không thầy?',
    timestamp: Date.now() - 86400000 * 1,
    highestTierUsed: 2,
    isNoAiMode: false,
  },
  {
    id: 'journal-2',
    problemId: 'phat-hien-loi-logic',
    problemTitle: 'Phát hiện và sửa lỗi logic (Gán đè biến tích lũy)',
    studentCode: 'HS-0702',
    priorEffort: 'Em đọc đoạn code mẫu s = i và thấy in ra 6.',
    studentQuestions: ['Tại sao máy không báo lỗi đỏ nhưng kết quả lại sai ạ?'],
    aiHintsReceived: ['AI hỏi: Khi i = 2 thì s là mấy? Rồi khi i = 4 thì s là mấy?'],
    selfCorrections: 'Em nhận ra s = i là lệnh gán đè, làm mất các số chẵn trước đó. Em sửa thành s = s + i.',
    testCasesUsed: ['n = 6 -> 12', 'n = 4 -> 6'],
    testResultsSummary: 'Đạt 100% test case.',
    lessonsLearned: 'Phân biệt rõ giữa lỗi cú pháp (SyntaxError) và lỗi logic (kết quả sai).',
    remainingDoubts: 'Đã hiểu bài hoàn toàn.',
    timestamp: Date.now() - 3600000 * 5,
    highestTierUsed: 1,
    isNoAiMode: false,
  },
];

export const INITIAL_REVIEWS: TeacherReview[] = [
  {
    id: 'rev-1',
    studentCode: 'HS-0701',
    assignmentId: 'assign-1',
    problemId: 'tong-so-chan',
    scores: {
      'crit-1': 4,
      'crit-2': 3,
      'crit-3': 4,
      'crit-4': 4,
      'crit-5': 3,
    },
    feedback: 'Em phân tích bài toán rất tốt, đã tự phát hiện điểm dừng n + 1 sau gợi ý Tầng 2. Rất khen ngợi câu hỏi mở rộng về công thức cấp số cộng!',
    reviewerName: 'Thầy Nguyễn Minh Thức',
    reviewedAt: Date.now() - 3600000 * 12,
  },
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'log-1',
    timestamp: Date.now() - 86400000 * 2,
    action: 'Khởi tạo cấu hình HINT-FIRST',
    actorRole: 'admin',
    actorName: 'Admin Hệ Thống',
    details: 'Áp dụng 13 nguyên tắc sư phạm và 4 tầng gợi ý không giải thay.',
    status: 'SUCCESS',
  },
  {
    id: 'log-2',
    timestamp: Date.now() - 86400000 * 1,
    action: 'Giao bài tập lớp 7A1',
    actorRole: 'teacher',
    actorName: 'Thầy Nguyễn Minh Thức',
    details: 'Giao bài THCS-01 (Tổng các số chẵn) với mức hỗ trợ tối đa Tầng 4.',
    status: 'SUCCESS',
  },
  {
    id: 'log-3',
    timestamp: Date.now() - 3600000 * 4,
    action: 'Chặn yêu cầu giải thay mã nguồn',
    actorRole: 'student',
    actorName: 'Học sinh HS-0704',
    details: 'Học sinh nhập "Giải hộ bài này đi". Hệ thống kích hoạt cơ chế phòng vệ Socratic.',
    status: 'WARNING',
  },
];
