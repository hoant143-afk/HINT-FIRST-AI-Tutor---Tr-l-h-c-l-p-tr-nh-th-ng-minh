import React from 'react';
import { UserProfile, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { User, LogIn, LogOut, ShieldAlert, GraduationCap, X, Sparkles, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser?: (user: UserProfile) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const { firebaseUser, isFirebaseReady, loginWithGoogle, logout, switchToDemoMode, applyForTeacher, configError, isLoading } = useAuth();

  if (!isOpen) return null;

  const isLoggedInWithGoogle = Boolean(firebaseUser);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">HINT-FIRST AI Tutor</h3>
              <p className="text-xs text-slate-400">Trợ lý học lập trình thông minh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {configError && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">{configError}</div>
            </div>
          )}

          {isLoggedInWithGoogle ? (
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-500 mx-auto flex items-center text-emerald-400 font-bold text-lg overflow-hidden">
                {firebaseUser?.photoURL ? (
                  <img src={firebaseUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{currentUser.name}</h4>
                <p className="text-[11px] text-slate-400">{currentUser.email || firebaseUser?.email}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">UID: {firebaseUser?.uid}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold rounded-full text-[10px]">
                  <span>Vai trò: {currentUser.role === 'admin' ? 'Quản trị viên (Admin)' : currentUser.isApprovedTeacher ? 'Giáo viên (Đã duyệt)' : currentUser.teacherApprovalStatus === 'pending' ? 'Giáo viên (Chờ duyệt PENDING)' : 'Học sinh'}</span>
                </div>
              </div>

              {/* Apply for Teacher button if user is student */}
              {currentUser.role !== 'admin' && !currentUser.isApprovedTeacher && currentUser.teacherApprovalStatus !== 'pending' && (
                <div className="border-t border-slate-800 pt-3">
                  <button
                    onClick={() => {
                      applyForTeacher();
                      alert('Đã gửi yêu cầu đăng ký giáo viên lên hệ thống. Vui lòng chờ quản trị viên phê duyệt!');
                    }}
                    className="w-full py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Đăng ký vai trò giáo viên</span>
                  </button>
                </div>
              )}

              {currentUser.teacherApprovalStatus === 'pending' && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-amber-300 text-[11px] flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Yêu cầu làm giáo viên đang chờ quản trị viên phê duyệt (PENDING)</span>
                </div>
              )}

              <button
                onClick={logout}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất Google</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
                <h4 className="font-bold text-white text-sm">Đăng nhập tài khoản Google</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Đăng nhập để lưu tiến trình học tập và sử dụng các chức năng theo tài khoản của bạn.
                </p>
                <button
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                  className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{isLoading ? 'Đang kết nối...' : 'Đăng nhập với Google'}</span>
                </button>
                {!isFirebaseReady && (
                  <p className="text-[10px] text-amber-400 italic">
                    (Đang sử dụng cấu hình trực tiếp từ Firebase Console).
                  </p>
                )}
              </div>

              {/* DEMO Mode section */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <span className="font-semibold text-slate-400 block text-[11px]">
                  Hoặc tiếp tục ở chế độ DEMO:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      switchToDemoMode('student');
                      onClose();
                    }}
                    className="p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Học sinh</span>
                  </button>
                  <button
                    onClick={() => {
                      switchToDemoMode('teacher');
                      onClose();
                    }}
                    className="p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>Giáo viên (Demo)</span>
                  </button>
                  <button
                    onClick={() => {
                      switchToDemoMode('admin');
                      onClose();
                    }}
                    className="p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Quản trị (Demo)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            HINT-FIRST AI Tutor • Quản lý vai trò & Phân quyền
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
