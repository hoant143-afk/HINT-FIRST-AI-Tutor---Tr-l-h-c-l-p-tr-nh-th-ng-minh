import React, { useState } from 'react';
import { Problem, GradeLevel, UserProfile } from '../types';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Code2,
  Lock,
  Eye,
  PlusCircle,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  EyeOff,
} from 'lucide-react';

interface ProblemRepositoryPageProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  currentUser: UserProfile;
  onOpenCustomProblem: () => void;
}

export const ProblemRepositoryPage: React.FC<ProblemRepositoryPageProps> = ({
  problems,
  onSelectProblem,
  currentUser,
  onOpenCustomProblem,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';

  const categories = [
    { id: 'all', label: 'Tất cả 10 chủ đề' },
    { id: 'variables', label: '1. Biến & Kiểu dữ liệu' },
    { id: 'io', label: '2. Nhập & Xuất dữ liệu' },
    { id: 'operators', label: '3. Phép toán số học' },
    { id: 'ifelse', label: '4. Câu lệnh if, if-else' },
    { id: 'forloop', label: '5. Vòng lặp for và range' },
    { id: 'whileloop', label: '6. Vòng lặp while' },
    { id: 'strings', label: '7. Xâu ký tự (Strings)' },
    { id: 'lists', label: '8. Danh sách (List)' },
    { id: 'debugging', label: '9. Phát hiện & Sửa lỗi' },
    { id: 'advanced', label: '10. Bài tập tổng hợp' },
  ];

  const filtered = problems.filter((p) => {
    if (selectedGrade !== 'all' && p.grade !== selectedGrade) return false;
    if (selectedCategory !== 'all' && p.topicCategory !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCode = p.codeNumber.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTopic = p.topic.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchDesc && !matchTopic) return false;
    }
    return true;
  });

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Kho Bài Tập Python THCS
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
              {filtered.length} bài tập
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Thiết kế chuẩn hóa theo 10 chủ đề Tin học THCS (Chương trình GDPT 2018), tích hợp sẵn giàn giáo 4 tầng.
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={onOpenCustomProblem}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm bài tập mới</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên bài, mã bài..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả các khối lớp</option>
            <option value="lop6">Khối Lớp 6</option>
            <option value="lop7">Khối Lớp 7</option>
            <option value="lop8">Khối Lớp 8</option>
            <option value="lop9">Khối Lớp 9</option>
          </select>

          {/* Topic Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả độ khó</option>
            <option value="Cơ bản">Cơ bản</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Nâng cao">Nâng cao</option>
          </select>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((problem) => {
          const isRevealed = revealedSolutions[problem.id];
          const gradeBadge =
            problem.grade === 'lop6'
              ? 'Lớp 6'
              : problem.grade === 'lop7'
              ? 'Lớp 7'
              : problem.grade === 'lop8'
              ? 'Lớp 8'
              : 'Lớp 9';

          return (
            <div
              key={problem.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:border-slate-700 hover:shadow-xl"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {problem.codeNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {gradeBadge}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      problem.difficulty === 'Cơ bản'
                        ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        : problem.difficulty === 'Trung bình'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-white text-base leading-snug">
                  {problem.title}
                </h3>

                {/* Topic */}
                <span className="inline-block text-[11px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {problem.topic}
                </span>

                {/* Description snippet */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {problem.description}
                </p>

                {/* Goals */}
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1">
                  <span className="font-semibold text-slate-400 block">Mục tiêu học tập:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {(problem.learningGoals || []).slice(0, 2).map((g, idx) => (
                      <li key={idx} className="truncate">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Teacher Solution Guarded Accordion */}
                {isTeacher && (
                  <div className="pt-2 border-t border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-purple-400 flex items-center gap-1 text-[11px]">
                        <Lock className="w-3 h-3" /> Đáp án tham khảo (Giáo viên)
                      </span>
                      <button
                        onClick={() => toggleSolution(problem.id)}
                        className="text-[10px] text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isRevealed ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
                      </button>
                    </div>

                    {isRevealed && (
                      <pre className="p-2.5 bg-slate-950 border border-purple-500/30 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto leading-5 animate-in fade-in duration-200">
                        {problem.teacherReferenceSolution}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {problem.testCases.length} testcase có sẵn
                </span>
                <button
                  onClick={() => onSelectProblem(problem)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Vào học bài này</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-2">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-300">Không tìm thấy bài tập phù hợp bộ lọc.</p>
          <p>Em thử đổi chủ đề hoặc từ khóa tìm kiếm nhé!</p>
        </div>
      )}
    </div>
  );
};
