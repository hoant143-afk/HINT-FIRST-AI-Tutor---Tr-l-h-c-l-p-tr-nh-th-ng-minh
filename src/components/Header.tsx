import React from 'react';
import { BookOpen, Sparkles, HelpCircle, Code2, PlusCircle, Award } from 'lucide-react';
import { GradeLevel, ProgrammingLanguage } from '../types';

interface HeaderProps {
  selectedGrade: GradeLevel | 'all';
  onSelectGrade: (grade: GradeLevel | 'all') => void;
  selectedLanguage: ProgrammingLanguage;
  onSelectLanguage: (lang: ProgrammingLanguage) => void;
  onOpenHandbook: () => void;
  onOpenPedagogyGuide: () => void;
  onOpenCustomProblem: () => void;
  solvedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedGrade,
  onSelectGrade,
  selectedLanguage,
  onSelectLanguage,
  onOpenHandbook,
  onOpenPedagogyGuide,
  onOpenCustomProblem,
  solvedCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                CodeKhaiTâm
              </h1>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                THCS Sư Phạm
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Trợ lý học lập trình 4 tầng • Tự nghĩ - Tự sửa - Không giải thay
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Grade Selector */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700 text-xs">
            <span className="text-slate-400 px-2 font-medium">Khối:</span>
            {(['all', 'lop6', 'lop7', 'lop8', 'lop9'] as const).map((grade) => {
              const label =
                grade === 'all'
                  ? 'Tất cả'
                  : grade === 'lop6'
                  ? 'Lớp 6'
                  : grade === 'lop7'
                  ? 'Lớp 7'
                  : grade === 'lop8'
                  ? 'Lớp 8'
                  : 'Lớp 9';
              const active = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => onSelectGrade(grade)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700 text-xs">
            <Code2 className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {(['python', 'cpp', 'scratch'] as const).map((lang) => {
              const label = lang === 'python' ? 'Python (GDPT)' : lang === 'cpp' ? 'C++' : 'Scratch';
              const active = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Solved Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Đã vượt qua: {solvedCount}</span>
          </div>

          {/* Handbook Button */}
          <button
            onClick={onOpenHandbook}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
            title="Mở sổ tay kiến thức Tin học THCS"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sổ tay</span>
          </button>

          {/* 4 Tiers Guide */}
          <button
            onClick={onOpenPedagogyGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
            title="Tìm hiểu 4 Tầng Sư Phạm của trợ lý"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>4 Tầng AI</span>
          </button>

          {/* Custom Problem */}
          <button
            onClick={onOpenCustomProblem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
            title="Thêm bài tập từ sách giáo khoa của em"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Đề bài riêng</span>
          </button>
        </div>
      </div>
    </header>
  );
};
