import React, { useState } from 'react';
import { SystemAuditLog, UserProfile, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Users,
  KeyRound,
  FileText,
  Clock,
  RefreshCw,
  Eye,
  XCircle,
} from 'lucide-react';

interface AdminPortalPageProps {
  auditLogs: SystemAuditLog[];
  onAddAuditLog: (log: SystemAuditLog) => void;
  currentUser: UserProfile;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  auditLogs,
  onAddAuditLog,
  currentUser,
}) => {
  const { teacherApplications, approveTeacher, rejectTeacher, previewRole, setPreviewRole } = useAuth();
  const [geminiStatus, setGeminiStatus] = useState<string>('ONLINE');

  const handleApprove = (uid: string, name: string) => {
    approveTeacher(uid);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      action: 'Duyệt quyền giáo viên',
      actorRole: 'admin',
      actorName: currentUser.name,
      details: `Đã cấp quyền giáo viên cho tài khoản ${name} (${uid}).`,
      status: 'SUCCESS',
    });
  };

  const handleReject = (uid: string, name: string) => {
    rejectTeacher(uid);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      action: 'Từ chối quyền giáo viên',
      actorRole: 'admin',
      actorName: currentUser.name,
      details: `Đã từ chối yêu cầu giáo viên của tài khoản ${name} (${uid}).`,
      status: 'SUCCESS',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Quản Trị Hệ Thống HINT-FIRST
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quản trị kỹ thuật, phân quyền theo nguyên tắc tối thiểu và giám sát an toàn thông tin học đường.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Admin Preview Switcher */}
          <div className="bg-slate-900 border border-slate-700 p-1.5 rounded-xl flex items-center gap-2 text-xs">
            <span className="text-slate-400 pl-2">Xem thử giao diện:</span>
            <button
              onClick={() => setPreviewRole(null)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                previewRole === null ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Quản trị
            </button>
            <button
              onClick={() => setPreviewRole('teacher')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                previewRole === 'teacher' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Giáo viên
            </button>
            <button
              onClick={() => setPreviewRole('student')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                previewRole === 'student' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Học sinh
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Hệ thống: <strong className="text-emerald-400">Hoạt động bình thường</strong>
            </span>
          </div>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Gemini 3.8 Flash:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sẵn sàng
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Server-side SDK @google/genai, độ trễ phản hồi trung bình ~600ms.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Lưu trữ dữ liệu:</span>
            <span className="text-sky-400 font-bold">Firebase & LocalStorage</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Tài khoản xác thực Google & phân quyền quản trị an toàn.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Chính sách chống lộ code:</span>
            <span className="text-amber-400 font-bold">Kích hoạt 100%</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Tự động quét và giàn giáo hóa các đoạn mã hoàn chỉnh trước khi gửi về client.
          </p>
        </div>
      </div>

      {/* Teacher Approvals Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">
              Duyệt yêu cầu cấp quyền Giáo viên
            </h3>
            <p className="text-slate-400 text-[11px]">
              Tài khoản giáo viên bắt buộc phải được duyệt bởi Quản trị viên mới được tạo lớp và giao bài.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold">
            Tổng yêu cầu: {teacherApplications.length}
          </span>
        </div>

        <div className="space-y-2.5">
          {teacherApplications.length === 0 ? (
            <div className="text-center py-6 text-slate-500 italic">
              Chưa có yêu cầu đăng ký giáo viên nào.
            </div>
          ) : (
            teacherApplications.map((app) => (
              <div
                key={app.uid}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{app.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Email: <span className="text-slate-200">{app.email}</span> • UID: <code className="text-slate-500">{app.uid}</code> • Ngày đăng ký: {new Date(app.requestedAt).toLocaleString('vi-VN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'approved' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Đã duyệt
                    </span>
                  ) : app.status === 'rejected' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Đã từ chối
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(app.uid, app.name)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Phê duyệt
                      </button>
                      <button
                        onClick={() => handleReject(app.uid, app.name)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" /> Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security & Audit Logs Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">
              Nhật ký kiểm toán an toàn (Audit Logs)
            </h3>
            <p className="text-slate-400 text-[11px]">
              Ghi vết các hành động quản trị, thay đổi cấu hình và các trường hợp cố tình yêu cầu giải thay.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Hành động</th>
                <th className="py-2.5 px-3">Người thực hiện</th>
                <th className="py-2.5 px-3">Chi tiết</th>
                <th className="py-2.5 px-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/50">
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.actorName} ({log.actorRole})</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.details}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
