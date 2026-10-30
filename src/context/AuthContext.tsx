import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, TeacherApprovalStatus, TeacherApplication } from '../types';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebaseClient';
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile;
  firebaseUser: any;
  isLoading: boolean;
  isFirebaseReady: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchToDemoMode: (role: UserRole) => void;
  selectRole: (role: UserRole, applyForTeacher?: boolean) => void;
  applyForTeacher: () => void;
  previewRole: UserRole | null;
  setPreviewRole: (role: UserRole | null) => void;
  teacherApplications: TeacherApplication[];
  approveTeacher: (uid: string) => void;
  rejectTeacher: (uid: string) => void;
  configError: string | null;
}

const ADMIN_EMAIL = 'cohangtinhoc@gmail.com';

const defaultStudent: UserProfile = {
  id: 'student-demo-' + Math.random().toString(36).substring(2, 7),
  name: 'Học sinh Khách (DEMO)',
  role: 'student',
  studentCode: 'HS-DEMO',
  classCode: 'TIN7A1',
  needsRoleSelection: false,
};

const AuthContext = createContext<AuthContextType>({
  currentUser: defaultStudent,
  firebaseUser: null,
  isLoading: false,
  isFirebaseReady: false,
  loginWithGoogle: async () => {},
  logout: async () => {},
  switchToDemoMode: () => {},
  selectRole: () => {},
  applyForTeacher: () => {},
  previewRole: null,
  setPreviewRole: () => {},
  teacherApplications: [],
  approveTeacher: () => {},
  rejectTeacher: () => {},
  configError: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hintfirst_current_user_profile');
    return saved ? JSON.parse(saved) : defaultStudent;
  });
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);

  const [teacherApplications, setTeacherApplications] = useState<TeacherApplication[]>(() => {
    const saved = localStorage.getItem('hintfirst_teacher_applications');
    return saved ? JSON.parse(saved) : [
      {
        uid: 'demo-teacher-1',
        email: 'teacher.demo@hintfirst.edu.vn',
        name: 'Giáo viên Demo',
        status: 'approved',
        requestedAt: Date.now() - 86400000,
        reviewedAt: Date.now() - 43200000,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hintfirst_teacher_applications', JSON.stringify(teacherApplications));
  }, [teacherApplications]);

  useEffect(() => {
    localStorage.setItem('hintfirst_current_user_profile', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const email = user.email || '';
        const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        // Check if user already has a saved profile in localStorage for this uid
        const savedProfiles = localStorage.getItem('hintfirst_user_profiles');
        const profilesMap = savedProfiles ? JSON.parse(savedProfiles) : {};
        const existingProfile = profilesMap[user.uid];

        if (existingProfile) {
          // Check if teacher application status was updated by admin
          let approvalStatus = existingProfile.teacherApprovalStatus;
          const appRecord = teacherApplications.find(a => a.uid === user.uid);
          if (appRecord) {
            approvalStatus = appRecord.status;
          }

          setCurrentUser({
            ...existingProfile,
            id: user.uid,
            name: user.displayName || existingProfile.name,
            email: email,
            teacherApprovalStatus: approvalStatus,
            isApprovedTeacher: approvalStatus === 'approved',
          });
        } else {
          // First time login with Google -> needs role selection
          const initialRole: UserRole = isAdminEmail ? 'admin' : 'student';
          const newProfile: UserProfile = {
            id: user.uid,
            name: user.displayName || email.split('@')[0] || 'Người dùng Google',
            email: email,
            role: initialRole,
            studentCode: `HS-${user.uid.substring(0, 5).toUpperCase()}`,
            classCode: 'TIN7A1',
            needsRoleSelection: !isAdminEmail, // Prompt role selection for new users unless admin email
          };
          setCurrentUser(newProfile);
          profilesMap[user.uid] = newProfile;
          localStorage.setItem('hintfirst_user_profiles', JSON.stringify(profilesMap));
        }
      } else {
        // Not logged in via Firebase
        setCurrentUser(defaultStudent);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [teacherApplications]);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setConfigError(
        'Firebase chưa được cấu hình! Vui lòng kiểm tra cấu hình Firebase trong firebaseClient.ts hoặc biến môi trường.'
      );
      return;
    }

    setConfigError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const errCode = err.code || 'unknown';
      const errMessage = err.message || 'Lỗi không xác định';

      if (errCode === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        const currentOrigin = window.location.origin;
        setConfigError(
          `Lỗi Firebase [auth/unauthorized-domain]: Tên miền hiện tại (${currentDomain} / ${currentOrigin}) chưa được cấp phép trong Firebase Console. Vui lòng vào Firebase Console > Authentication > Settings > Authorized domains và thêm tên miền này.`
        );
      } else {
        setConfigError(`Lỗi Firebase [${errCode}]: ${errMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setConfigError(null);
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
    setFirebaseUser(null);
    setPreviewRole(null);
    setCurrentUser(defaultStudent);
  };

  const selectRole = (role: UserRole, applyForTeacher?: boolean) => {
    const email = currentUser.email || '';
    const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    let finalRole = role;
    if (role === 'admin' && !isAdminEmail) {
      // Prevent self-granting admin
      alert('Tài khoản này không phải là Quản trị viên chính thức. Hệ thống giữ nguyên vai trò Học sinh.');
      finalRole = 'student';
    }

    let approvalStatus = currentUser.teacherApprovalStatus;
    if (applyForTeacher) {
      approvalStatus = 'pending';
      // Add or update teacher application
      const newApp: TeacherApplication = {
        uid: currentUser.id,
        email: email,
        name: currentUser.name,
        status: 'pending',
        requestedAt: Date.now(),
      };
      setTeacherApplications(prev => {
        const filtered = prev.filter(p => p.uid !== currentUser.id);
        return [newApp, ...filtered];
      });
    }

    const updated: UserProfile = {
      ...currentUser,
      role: finalRole,
      teacherApprovalStatus: approvalStatus,
      isApprovedTeacher: approvalStatus === 'approved',
      needsRoleSelection: false,
    };

    setCurrentUser(updated);

    // Save to profile map
    if (firebaseUser) {
      const savedProfiles = localStorage.getItem('hintfirst_user_profiles');
      const profilesMap = savedProfiles ? JSON.parse(savedProfiles) : {};
      profilesMap[firebaseUser.uid] = updated;
      localStorage.setItem('hintfirst_user_profiles', JSON.stringify(profilesMap));
    }
  };

  const applyForTeacher = () => {
    const approvalStatus: TeacherApprovalStatus = 'pending';
    const newApp: TeacherApplication = {
      uid: currentUser.id,
      email: currentUser.email || '',
      name: currentUser.name,
      status: 'pending',
      requestedAt: Date.now(),
    };
    setTeacherApplications(prev => {
      const filtered = prev.filter(p => p.uid !== currentUser.id);
      return [newApp, ...filtered];
    });

    const updated: UserProfile = {
      ...currentUser,
      teacherApprovalStatus: approvalStatus,
    };
    setCurrentUser(updated);
  };

  const approveTeacher = (uid: string) => {
    setTeacherApplications(prev =>
      prev.map(app => (app.uid === uid ? { ...app, status: 'approved', reviewedAt: Date.now() } : app))
    );
    if (currentUser.id === uid) {
      setCurrentUser(prev => ({ ...prev, teacherApprovalStatus: 'approved', isApprovedTeacher: true }));
    }
  };

  const rejectTeacher = (uid: string) => {
    setTeacherApplications(prev =>
      prev.map(app => (app.uid === uid ? { ...app, status: 'rejected', reviewedAt: Date.now() } : app))
    );
    if (currentUser.id === uid) {
      setCurrentUser(prev => ({ ...prev, teacherApprovalStatus: 'rejected', isApprovedTeacher: false }));
    }
  };

  const switchToDemoMode = (role: UserRole) => {
    setConfigError(null);
    setPreviewRole(null);
    if (role === 'admin') {
      setCurrentUser({
        id: 'demo-admin',
        name: 'Quản trị viên (DEMO)',
        email: ADMIN_EMAIL,
        role: 'admin',
        studentCode: 'ADM-DEMO',
        needsRoleSelection: false,
      });
    } else if (role === 'teacher') {
      setCurrentUser({
        id: 'demo-teacher',
        name: 'Giáo viên (DEMO)',
        email: 'teacher.demo@hintfirst.edu.vn',
        role: 'student',
        teacherApprovalStatus: 'approved',
        isApprovedTeacher: true,
        studentCode: 'GV-DEMO',
        needsRoleSelection: false,
      });
    } else {
      setCurrentUser({
        id: 'demo-student',
        name: 'Học sinh (DEMO)',
        email: 'student.demo@hintfirst.edu.vn',
        role: 'student',
        studentCode: 'HS-DEMO',
        classCode: 'TIN7A1',
        needsRoleSelection: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isLoading,
        isFirebaseReady: isFirebaseConfigured,
        loginWithGoogle,
        logout,
        switchToDemoMode,
        selectRole,
        applyForTeacher,
        previewRole,
        setPreviewRole,
        teacherApplications,
        approveTeacher,
        rejectTeacher,
        configError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
