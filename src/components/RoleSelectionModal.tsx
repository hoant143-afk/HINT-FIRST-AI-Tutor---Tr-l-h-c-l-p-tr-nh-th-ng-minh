import React, { useState } from 'react';
import { UserRole } from '../types';
import { GraduationCap, User, ShieldAlert, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onSelectRole: (role: UserRole, applyForTeacher?: boolean) => void;
  userEmail?: string;
  userName?: string;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onSelectRole,
  userEmail = '',
  userName = '',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  if (!isOpen) return null;

  const ADMIN_EMAIL = 'cohangtinhoc@gmail.com';

  const handleConfirm = () => {
    if (!selectedRole) return;
    setAdminError(null);

    if (selectedRole === 'admin') {
      const isVerifiedAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      if (!isVerifiedAdmin) {
        setAdminError(
          `Tài khoản (${userEmail}) chưa được cấp quyền quản trị viên. Quyền Admin chỉ dành cho tài khoản chính (${ADMIN_EMAIL}) hoặc sau khi xác thực bảo mật.`
        );
        return;
      }
    }

    if (selectedRole === 'teacher') {
      // Teacher role starts as pending application
      onSelectRole('student', true); // Register as teacher with PENDING status
    } else if (selectedRole === 'admin') {
      onSelectRole('admin');
    } else {
      onSelectRole('student');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 border-b border-slate-800 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Xác thực tài khoản Google thành công
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            CHÀO MỪNG ĐẾN VỚI HINT-FIRST AI TUTOR
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Xin chào <span className="text-emerald-400 font-bold">{userName || userEmail}</span>. Vui lòng lựa chọn vai trò của bạn để tiếp tục:
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {adminError && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-2xl text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <div className="text-xs leading-relaxed">{adminError}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Student */}
            <div
              onClick={() => {
                setSelectedRole('student');
                setAdminError(null);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                selectedRole === 'student'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Học sinh</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Học lập trình Python với giàn giáo 4 tầng AI, làm bài tập và theo dõi tiến trình học tập.
                </p>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Truy cập ngay
              </div>
            </div>

            {/* Teacher */}
            <div
              onClick={() => {
                setSelectedRole('teacher');
                setAdminError(null);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                selectedRole === 'teacher'
                  ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Giáo viên</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Đăng ký quản lý lớp học và bài tập. Cần chờ Quản trị viên phê duyệt trước khi truy cập.
                </p>
              </div>
              <div className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                Gửi yêu cầu xét duyệt
              </div>
            </div>

            {/* Admin */}
            <div
              onClick={() => {
                setSelectedRole('admin');
                setAdminError(null);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                selectedRole === 'admin'
                  ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Quản trị viên</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Quản lý hệ thống, phê duyệt giáo viên và kiểm tra nhật ký. Yêu cầu tài khoản {ADMIN_EMAIL}.
                </p>
              </div>
              <div className="text-[10px] text-rose-400 font-semibold">
                Xác thực phân quyền
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedRole}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            Xác nhận và tiếp tục
          </button>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
          HINT-FIRST AI Tutor • Bảo mật & Xác thực phân quyền
        </div>
      </div>
    </div>
  );
};
