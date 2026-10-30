import React from 'react';
import {
  Sparkles,
  Home,
  Code2,
  BookOpen,
  Bot,
  TrendingUp,
  HelpCircle,
  GraduationCap,
  ShieldAlert,
  User,
  Lock,
  LogIn,
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab =
  | 'home'
  | 'workspace'
  | 'repository'
  | 'tutor'
  | 'progress'
  | 'guide'
  | 'teacher'
  | 'admin';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  onOpenAccountModal: () => void;
  isNoAiMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenAccountModal,
  isNoAiMode,
}) => {
  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';
  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Demo Notice Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-emerald-950 px-4 py-1.5 border-b border-slate-800/80 text-[11px] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center gap-1 font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            HINT-FIRST AI TUTOR
          </span>
          <span>
            Hệ thống giàn giáo nhận thức lập trình THCS
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          {isNoAiMode && (
            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Chế độ tự lập trình (Không AI)
            </span>
          )}
          <span className="hidden sm:inline">
            Tài khoản:{' '}
            <strong className="text-emerald-300">
              {currentUser.name} ({currentUser.role === 'student' ? 'Học sinh' : currentUser.role === 'teacher' ? 'Giáo viên' : 'Quản trị viên'})
            </strong>
          </span>
          <button
            onClick={onOpenAccountModal}
            className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[10px]"
          >
            <LogIn className="w-3 h-3" />
            <span>Tài khoản & Đăng nhập</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo and Slogan */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-white via-sky-100 to-emerald-200 bg-clip-text text-transparent">
                HINT-FIRST AI Tutor
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                THCS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Tự suy nghĩ – AI gợi ý – Em làm chủ kiến thức
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'home'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </button>

          <button
            onClick={() => onSelectTab('workspace')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'workspace'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Học lập trình</span>
          </button>

          <button
            onClick={() => onSelectTab('repository')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'repository'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kho bài tập</span>
          </button>

          <button
            onClick={() => onSelectTab('tutor')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'tutor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Trợ lý AI</span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'progress'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tiến trình</span>
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'guide'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hướng dẫn</span>
          </button>

          {/* Teacher Tab (Role guarded) */}
          {isTeacher && (
            <button
              onClick={() => onSelectTab('teacher')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'teacher'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/50 border border-purple-500/30'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Không gian GV</span>
            </button>
          )}

          {/* Admin Tab (Role guarded) */}
          {isAdmin && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-300 hover:text-white hover:bg-rose-950/50 border border-rose-500/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Quản trị HT</span>
            </button>
          )}
        </nav>

        {/* Right User Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAccountModal}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">{currentUser.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
