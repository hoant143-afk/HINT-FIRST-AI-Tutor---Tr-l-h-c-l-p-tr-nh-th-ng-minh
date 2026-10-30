import React, { useState } from 'react';
import {
  ClassRoom,
  Assignment,
  Problem,
  RubricCriterion,
  TeacherReview,
  TutorTier,
  UserProfile,
} from '../types';
import { RUBRIC_CRITERIA } from '../data/mockData';
import {
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sliders,
  PlusCircle,
  FileSpreadsheet,
  Lock,
  Unlock,
  Eye,
  Edit3,
  Award,
  BarChart3,
  Calendar,
  Clock,
} from 'lucide-react';

interface TeacherDashboardPageProps {
  classes: ClassRoom[];
  assignments: Assignment[];
  problems: Problem[];
  reviews: TeacherReview[];
  onAddClass: (cls: ClassRoom) => void;
  onAddAssignment: (assign: Assignment) => void;
  onUpdateAssignment: (assign: Assignment) => void;
  onSaveReview: (review: TeacherReview) => void;
  onPreviewProblem: (problem: Problem) => void;
  currentUser: UserProfile;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({
  classes,
  assignments,
  problems,
  reviews,
  onAddClass,
  onAddAssignment,
  onUpdateAssignment,
  onSaveReview,
  onPreviewProblem,
  currentUser,
}) => {
  if (currentUser.teacherApprovalStatus === 'pending' && currentUser.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/25 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white">Yêu cầu đăng ký Giáo viên đang chờ phê duyệt</h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-lg mx-auto">
          Tài khoản của bạn đã gửi yêu cầu đăng ký vai trò <strong className="text-purple-400">Giáo viên</strong> và đang ở trạng thái <strong className="text-amber-400">PENDING</strong>. Quản trị viên hệ thống sẽ xem xét và phê duyệt trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'assignments' | 'classes' | 'rubric' | 'analytics'>('overview');

  // Form states for adding class
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<'lop6' | 'lop7' | 'lop8' | 'lop9'>('lop7');

  // Form states for creating assignment
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignClassId, setAssignClassId] = useState(classes[0]?.id || '');
  const [assignProblemId, setAssignProblemId] = useState(problems[0]?.id || '');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignMaxTier, setAssignMaxTier] = useState<TutorTier>(4);
  const [assignAiEnabled, setAssignAiEnabled] = useState(true);

  // Rubric scoring form states
  const [selectedStudentForReview, setSelectedStudentForReview] = useState('HS-0701');
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    'crit-1': 4,
    'crit-2': 3,
    'crit-3': 4,
    'crit-4': 3,
    'crit-5': 4,
  });
  const [rubricFeedback, setRubricFeedback] = useState('Em tiến bộ rõ rệt trong việc phân tích bài toán và tự dự đoán test case.');

  // Create class handler
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassCode.trim()) return;

    const newCls: ClassRoom = {
      id: `class-${Date.now()}`,
      code: newClassCode.trim().toUpperCase(),
      name: newClassName.trim(),
      grade: newClassGrade,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      createdAt: Date.now(),
      studentCodes: ['HS-01', 'HS-02', 'HS-03', 'HS-04', 'HS-05'],
      isLocked: false,
    };

    onAddClass(newCls);
    setShowAddClass(false);
    setNewClassName('');
    setNewClassCode('');
  };

  // Create assignment handler
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const prob = problems.find((p) => p.id === assignProblemId);
    const newAssign: Assignment = {
      id: `assign-${Date.now()}`,
      classId: assignClassId,
      problemId: assignProblemId,
      title: assignTitle.trim() || `Bài tập: ${prob?.title || 'Lập trình'}`,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      aiEnabled: assignAiEnabled,
      maxAiTier: assignMaxTier,
      allowNoAiChallenge: true,
      assignedAt: Date.now(),
    };

    onAddAssignment(newAssign);
    setShowAssignModal(false);
    setAssignTitle('');
  };

  // Save Rubric handler
  const handleSaveRubric = () => {
    const rev: TeacherReview = {
      id: `rev-${Date.now()}`,
      studentCode: selectedStudentForReview,
      assignmentId: assignments[0]?.id || 'assign-1',
      problemId: problems[0]?.id || 'tong-so-chan',
      scores: rubricScores,
      feedback: rubricFeedback,
      reviewerName: currentUser.name,
      reviewedAt: Date.now(),
    };

    onSaveReview(rev);
    alert(`Đã lưu đánh giá Rubric cho học sinh ${selectedStudentForReview}!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['MaHocSinh', 'MaLop', 'TieuChi1_PhanTich', 'TieuChi2_NoLuc', 'TieuChi3_KiemThu', 'TieuChi4_GiaiThich', 'TieuChi5_TrachNhiemAI', 'NhanXetGiaoVien'],
      [selectedStudentForReview, 'TIN7A1', rubricScores['crit-1'], rubricScores['crit-2'], rubricScores['crit-3'], rubricScores['crit-4'], rubricScores['crit-5'], `"${rubricFeedback}"`],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DanhGia_Rubric_Lop7A1.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Teacher Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Không Gian Quản Lý Của Giáo Viên
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tiến trình 6 bước, quản lý mức độ hỗ trợ của AI và đánh giá quá trình học tập bằng Rubric.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Giao bài mới</span>
          </button>

          <button
            onClick={() => setShowAddClass(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Tạo lớp học</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: '1. Tổng quan lớp học', icon: BarChart3 },
          { id: 'assignments', label: '2. Quản lý bài tập & Mức AI', icon: BookOpen },
          { id: 'classes', label: '3. Danh sách lớp & Mã ẩn danh', icon: Users },
          { id: 'rubric', label: '4. Đánh giá quá trình (Rubric)', icon: Award },
          { id: 'analytics', label: '5. Thống kê & Phân tích lỗi', icon: Sliders },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">Số lớp phụ trách:</span>
              <span className="text-xl font-bold text-white mt-1 block">{classes.length} lớp</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">Bài tập đã giao:</span>
              <span className="text-xl font-bold text-sky-400 mt-1 block">{assignments.length} bài</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">Tổng số học sinh:</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">
                {classes.reduce((sum, c) => sum + c.studentCodes.length, 0)} em
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">Bài đã hoàn thành:</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">85%</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[11px] block">Trường hợp cần hỗ trợ:</span>
              <span className="text-xl font-bold text-rose-400 mt-1 block">1 ca</span>
            </div>
          </div>

          {/* Active Student Monitoring Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                Theo dõi tiến trình trực tiếp theo 6 bước (Lớp 7A1)
              </h3>
              <span className="text-[11px] text-slate-400">Dữ liệu cập nhật theo phiên</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2.5 px-3">Mã học sinh</th>
                    <th className="py-2.5 px-3">Bài tập đang làm</th>
                    <th className="py-2.5 px-3">Bước học hiện tại</th>
                    <th className="py-2.5 px-3">Tầng AI cao nhất</th>
                    <th className="py-2.5 px-3">Nỗ lực tự lực</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-slate-100">HS-0701</td>
                    <td className="py-3 px-3">Tổng các số chẵn (THCS-01)</td>
                    <td className="py-3 px-3 text-emerald-400">Bước 6: Phản tư</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        Tầng 2 (Kiến thức)
                      </span>
                    </td>
                    <td className="py-3 px-3">Ý tưởng + Thử code</td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold">✓ Đã hoàn thành</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-slate-100">HS-0702</td>
                    <td className="py-3 px-3">Phát hiện lỗi logic (THCS-03)</td>
                    <td className="py-3 px-3 text-emerald-400">Bước 6: Phản tư</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        Tầng 1 (Định hướng)
                      </span>
                    </td>
                    <td className="py-3 px-3">Phát hiện s = i</td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold">✓ Đã hoàn thành</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-slate-100">HS-0704</td>
                    <td className="py-3 px-3">Tổng các số chẵn (THCS-01)</td>
                    <td className="py-3 px-3 text-amber-400">Bước 3: Chẩn đoán</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        Hỏi giải hộ (Đã chặn)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-rose-300">Chưa nộp ý tưởng</td>
                    <td className="py-3 px-3 text-amber-400 font-semibold">Cần GV nhắc nhở</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNMENTS & AI POLICIES */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              Danh sách bài tập và Chính sách AI được phân quyền
            </h3>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              + Giao bài mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assign) => {
              const prob = problems.find((p) => p.id === assign.problemId);
              const cls = classes.find((c) => c.id === assign.classId);

              return (
                <div
                  key={assign.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {cls?.name || 'Lớp học'}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1">{assign.title}</h4>
                      <p className="text-slate-400 text-[11px]">Hạn nộp: {assign.dueDate}</p>
                    </div>

                    <button
                      onClick={() => prob && onPreviewProblem(prob)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Xem trước</span>
                    </button>
                  </div>

                  {/* AI Policy Settings */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
                    <span className="font-bold text-slate-300 block text-[11px]">
                      Chính sách AI hỗ trợ:
                    </span>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Trạng thái Trợ lý AI:</span>
                      <button
                        onClick={() =>
                          onUpdateAssignment({ ...assign, aiEnabled: !assign.aiEnabled })
                        }
                        className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer ${
                          assign.aiEnabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {assign.aiEnabled ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        <span>{assign.aiEnabled ? 'Đang bật AI' : 'Đã khóa AI (Tự lực)'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mức gợi ý tối đa:</span>
                      <select
                        value={assign.maxAiTier}
                        onChange={(e) =>
                          onUpdateAssignment({
                            ...assign,
                            maxAiTier: Number(e.target.value) as TutorTier,
                          })
                        }
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs"
                      >
                        <option value={1}>Tối đa Tầng 1 (Định hướng)</option>
                        <option value={2}>Tối đa Tầng 2 (Kiến thức)</option>
                        <option value={3}>Tối đa Tầng 3 (Giả mã)</option>
                        <option value={4}>Tối đa Tầng 4 (Khung code)</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CLASSES & ANONYMOUS CODES */}
      {activeSubTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Quản lý lớp học & Mã định danh ẩn danh</h3>
            <button
              onClick={() => setShowAddClass(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              + Tạo lớp mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{cls.name}</h4>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Mã lớp: {cls.code}
                  </span>
                </div>
                <p className="text-slate-400">
                  Giáo viên: {cls.teacherName} • Sĩ số: {cls.studentCodes.length} học sinh
                </p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-slate-400 block text-[11px]">
                    Danh sách mã học sinh ẩn danh:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.studentCodes.map((code) => (
                      <span
                        key={code}
                        className="font-mono bg-slate-900 border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-[11px]"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-1">
                    * Tuân thủ quy định bảo mật: giáo viên giữ bảng đối chiếu tên thật tại sổ điểm lớp học.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RUBRIC EVALUATION */}
      {activeSubTab === 'rubric' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs text-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Phiếu Đánh Giá Quá Trình Bằng Rubric (5 Tiêu Chí)
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Đánh giá toàn diện năng lực tự điều chỉnh, tinh thần tự lực và trách nhiệm khi dùng AI.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">Học sinh:</span>
                <select
                  value={selectedStudentForReview}
                  onChange={(e) => setSelectedStudentForReview(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-1 text-xs"
                >
                  <option value="HS-0701">HS-0701 (Lớp 7A1)</option>
                  <option value="HS-0702">HS-0702 (Lớp 7A1)</option>
                  <option value="HS-0704">HS-0704 (Lớp 7A1)</option>
                </select>
              </div>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xuất CSV</span>
              </button>
            </div>
          </div>

          {/* 5 Criteria */}
          <div className="space-y-4">
            {RUBRIC_CRITERIA.map((crit) => {
              const currentScore = rubricScores[crit.id] || 3;
              return (
                <div key={crit.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{crit.name}</h4>
                      <p className="text-slate-400 text-[11px]">{crit.description}</p>
                    </div>
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      Mức {currentScore}/4
                    </span>
                  </div>

                  {/* 4 Levels selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                    {crit.levels.map((lvl) => {
                      const selected = currentScore === lvl.level;
                      return (
                        <button
                          key={lvl.level}
                          type="button"
                          onClick={() =>
                            setRubricScores((prev) => ({ ...prev, [crit.id]: lvl.level }))
                          }
                          className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                            selected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="font-bold block">{lvl.label}</span>
                          <span className="text-[10px] leading-tight block mt-0.5 opacity-90">
                            {lvl.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-1.5">
            <label className="font-bold text-white text-xs block">
              Nhận xét định tính của giáo viên:
            </label>
            <textarea
              rows={3}
              value={rubricFeedback}
              onChange={(e) => setRubricFeedback(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleSaveRubric}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Lưu đánh giá Rubric
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm">Phân bố các tầng trợ giúp học sinh đã dùng</h3>
            <p className="text-slate-400 text-xs">
              Mục tiêu lý tưởng: Đa số học sinh dừng lại ở Tầng 1 và Tầng 2, thể hiện năng lực tự suy nghĩ cao.
            </p>
            <div className="space-y-2 pt-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Tầng 1 (Câu hỏi định hướng):</span>
                  <span className="font-bold text-sky-400">45%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Tầng 2 (Khái niệm & Quy tắc):</span>
                  <span className="font-bold text-amber-400">30%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Tầng 3 (Giả mã từng bước):</span>
                  <span className="font-bold text-indigo-400">18%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Tầng 4 (Khung code khuyết):</span>
                  <span className="font-bold text-emerald-400">7%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm">Những lỗi học sinh hay mắc phải nhất</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Quên số n trong range(1, n)</strong>
                  <span className="text-slate-400">range chỉ duyệt đến n-1, phải viết range(1, n+1).</span>
                </div>
              </li>
              <li className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Gán đè biến tích lũy (s = i)</strong>
                  <span className="text-slate-400">Làm mất các giá trị cộng dồn trước đó, phải là s = s + i.</span>
                </div>
              </li>
              <li className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Lỗi thụt lề IndentationError</strong>
                  <span className="text-slate-400">Thụt lề không đều giữa phím Tab và dấu cách.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal Add Class */}
      {showAddClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleCreateClass}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-4 text-xs text-slate-300 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white">Tạo Lớp Học Mới</h3>
            <div>
              <label className="block mb-1 text-slate-400">Tên lớp:</label>
              <input
                type="text"
                required
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Ví dụ: Lớp 7A3 - Tin học"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-400">Mã tham gia lớp:</label>
              <input
                type="text"
                required
                value={newClassCode}
                onChange={(e) => setNewClassCode(e.target.value)}
                placeholder="Ví dụ: TIN7A3"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-400">Khối lớp:</label>
              <select
                value={newClassGrade}
                onChange={(e) => setNewClassGrade(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="lop6">Khối 6</option>
                <option value="lop7">Khối 7</option>
                <option value="lop8">Khối 8</option>
                <option value="lop9">Khối 9</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddClass(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg"
              >
                Tạo lớp
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Assign Exercise */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleCreateAssignment}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full space-y-4 text-xs text-slate-300 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white">Giao Bài Tập Cho Lớp Học</h3>

            <div>
              <label className="block mb-1 text-slate-400">Lớp nhận bài:</label>
              <select
                value={assignClassId}
                onChange={(e) => setAssignClassId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Chọn bài tập:</label>
              <select
                value={assignProblemId}
                onChange={(e) => setAssignProblemId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              >
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.codeNumber}] {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Tiêu đề nhiệm vụ:</label>
              <input
                type="text"
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                placeholder="Mặc định: Tên bài toán"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-400">Trạng thái AI:</label>
                <select
                  value={assignAiEnabled ? 'yes' : 'no'}
                  onChange={(e) => setAssignAiEnabled(e.target.value === 'yes')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="yes">Bật trợ lý AI</option>
                  <option value="no">Khóa AI (Tự lực)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-400">Mức tối đa (Max Tier):</label>
                <select
                  value={assignMaxTier}
                  onChange={(e) => setAssignMaxTier(Number(e.target.value) as TutorTier)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value={1}>Tầng 1 (Định hướng)</option>
                  <option value={2}>Tầng 2 (Kiến thức)</option>
                  <option value={3}>Tầng 3 (Giả mã)</option>
                  <option value={4}>Tầng 4 (Khung code)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg"
              >
                Xác nhận giao bài
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
