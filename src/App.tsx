/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { THCS_PROBLEMS } from './data/thcsProblems';
import {
  INITIAL_CLASSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import {
  Problem,
  ProgrammingLanguage,
  TutorTier,
  StudentEvidence,
  ChatMessage,
  TestResult,
  UserProfile,
  ClassRoom,
  Assignment,
  LearningJournalEntry,
  TeacherReview,
  SystemAuditLog,
} from './types';
import { runPythonCodePyodide, terminateActivePythonWorker } from './utils/pythonRunner';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CodingWorkspacePage } from './pages/CodingWorkspacePage';
import { ProblemRepositoryPage } from './pages/ProblemRepositoryPage';
import { AITutorPage } from './pages/AITutorPage';
import { JournalProgressPage } from './pages/JournalProgressPage';
import { UserGuidePage } from './pages/UserGuidePage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { AccountModal } from './components/AccountModal';
import { ReflectionModal } from './components/ReflectionModal';
import { HandbookModal } from './components/HandbookModal';
import { PedagogyGuideModal } from './components/PedagogyGuideModal';
import { CustomProblemModal } from './components/CustomProblemModal';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { AuthProvider, useAuth } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // User Profile from AuthContext
  const { currentUser, selectRole, firebaseUser, previewRole } = useAuth();
  const effectiveUser = {
    ...currentUser,
    role: previewRole || currentUser.role,
    isApprovedTeacher: previewRole === 'teacher' || currentUser.isApprovedTeacher,
  };

  // Data Collections
  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem('hintfirst_problems');
    return saved ? JSON.parse(saved) : THCS_PROBLEMS;
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem('hintfirst_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('hintfirst_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [journalEntries, setJournalEntries] = useState<LearningJournalEntry[]>(() => {
    const saved = localStorage.getItem('hintfirst_journals');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  const [reviews, setReviews] = useState<TeacherReview[]>(() => {
    const saved = localStorage.getItem('hintfirst_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => {
    const saved = localStorage.getItem('hintfirst_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Active Problem in Coding Workspace
  const [selectedProblem, setSelectedProblem] = useState<Problem>(problems[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('python');
  const [code, setCode] = useState<string>(problems[0].starterCode.python);
  const [currentTier, setCurrentTier] = useState<TutorTier>(1);
  const [highestUnlockedTier, setHighestUnlockedTier] = useState<TutorTier>(1);
  const [viewingTier, setViewingTier] = useState<TutorTier>(1);
  const [sessionId, setSessionId] = useState<string>(() => 'session-' + Math.random().toString(36).substring(2, 9));
  const [studentEvidence, setStudentEvidence] = useState<StudentEvidence | null>(null);
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testedCodeSnapshot, setTestedCodeSnapshot] = useState<string>('');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const currentTestSessionRef = useRef<string | null>(null);
  const [isNoAiMode, setIsNoAiMode] = useState(false);
  const [hasInitError, setHasInitError] = useState(false);

  const handleRetryPython = () => {
    terminateActivePythonWorker(true);
    setHasInitError(false);
    setTestResults([]);
    alert('Đã làm mới môi trường Python. Vui lòng nhấn Chạy kiểm thử lại.');
  };
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());

  // Chat History
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Modals
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isPedagogyGuideOpen, setIsPedagogyGuideOpen] = useState(false);
  const [isCustomProblemOpen, setIsCustomProblemOpen] = useState(false);

  // Save changes to localStorage for offline persistence in DEMO mode
  useEffect(() => {
    localStorage.setItem('hintfirst_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('hintfirst_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('hintfirst_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('hintfirst_journals', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('hintfirst_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('hintfirst_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Sync starter code and reset on problem change
  useEffect(() => {
    setCode(selectedProblem.starterCode[selectedLanguage] || selectedProblem.starterCode.python);
    setTestedCodeSnapshot('');
    setCurrentTier(1);
    setHighestUnlockedTier(1);
    setViewingTier(1);
    setSessionId('session-' + Math.random().toString(36).substring(2, 9));
    setStudentEvidence(null);
    setPredictions({});
    setTestResults([]);

    const welcomeMsg: ChatMessage = {
      id: `welcome-${selectedProblem.id}-${Date.now()}`,
      role: 'assistant',
      content: `👋 Chào bạn nhỏ! Thầy/cô trợ lý rất vui được đồng hành cùng em với bài toán **"${selectedProblem.title}"** (Mã: ${selectedProblem.codeNumber}).

Tôn chỉ sư phạm: **"Tự suy nghĩ – AI gợi ý – Em làm chủ kiến thức."** Trợ lý hỗ trợ em theo giàn giáo 4 tầng và tuyệt đối không làm bài thay.

📌 **Để bắt đầu bài học:**
1. Em hãy đọc kỹ phần Input và Output bên trái.
2. Em hãy chia sẻ một suy nghĩ ban đầu hoặc thử nghiệm vào ô **"Cổng Bằng Chứng Tư Duy"** nhé!`,
      tier: 1,
      timestamp: Date.now(),
      isFirstResponse: true,
    };

    setMessages([welcomeMsg]);
  }, [selectedProblem, selectedLanguage]);

  // Handle Run All Tests with Pyodide Worker and session control
  const handleRunAllTests = async () => {
    const sessionId = 'session-' + Date.now();
    currentTestSessionRef.current = sessionId;
    setIsRunningTests(true);
    setTestedCodeSnapshot(code);

    try {
      const results: TestResult[] = [];
      for (const tc of selectedProblem.testCases) {
        if (currentTestSessionRef.current !== sessionId) {
          break;
        }

        const studentPred = predictions[tc.id] || '';
        const runRes = await runPythonCodePyodide(code, tc.input, 4000);
        if (runRes.error?.category === 'InitError') {
          setHasInitError(true);
        } else {
          setHasInitError(false);
        }

        if (currentTestSessionRef.current !== sessionId) {
          break;
        }

        const normalizedActual = (runRes.output || '').trim();
        const normalizedExpected = tc.expectedOutput.trim();
        const passed = !runRes.error && normalizedActual === normalizedExpected;
        const predCorrect = studentPred.trim() === normalizedActual;

        results.push({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: runRes.output || '',
          studentPrediction: studentPred,
          passed,
          predictionCorrect: predCorrect,
          executionTimeMs: runRes.executionTimeMs,
          errorMessage: runRes.error ? `[${runRes.error.category}] ${runRes.error.message}` : undefined,
        });
      }

      if (currentTestSessionRef.current === sessionId) {
        setTestResults(results);
        setIsRunningTests(false);

        const allPassed = results.length > 0 && results.every((r) => r.passed);
        if (allPassed) {
          setSolvedProblemIds((prev) => new Set([...prev, selectedProblem.id]));
          setIsReflectionOpen(true);

          const newJournal: LearningJournalEntry = {
            id: `journal-${Date.now()}`,
            problemId: selectedProblem.id,
            problemTitle: selectedProblem.title,
            studentCode: currentUser.studentCode || currentUser.name,
            priorEffort: studentEvidence?.content || 'Đã suy nghĩ và thử viết code trực tiếp.',
            studentQuestions: messages.filter((m) => m.role === 'user').map((m) => m.content).slice(-3),
            aiHintsReceived: messages.filter((m) => m.role === 'assistant').map((m) => m.content.slice(0, 100)).slice(-2),
            selfCorrections: '(Học sinh chưa nhập phản tư tự đánh giá)',
            testCasesUsed: selectedProblem.testCases.map((tc) => `${tc.input} -> ${tc.expectedOutput}`),
            testResultsSummary: `Đạt ${results.filter((r) => r.passed).length}/${results.length} testcase`,
            lessonsLearned: selectedProblem.learningGoals.join('; '),
            remainingDoubts: '(Học sinh chưa nhập điều chưa hiểu)',
            timestamp: Date.now(),
            highestTierUsed: currentTier,
            isNoAiMode,
          };

          setJournalEntries((prev) => [newJournal, ...prev.filter((j) => j.problemId !== selectedProblem.id)]);
        }
      } else {
        setIsRunningTests(false);
      }
    } catch (err) {
      setIsRunningTests(false);
    }
  };

  const handleStopTests = () => {
    currentTestSessionRef.current = null;
    terminateActivePythonWorker();
    setIsRunningTests(false);
  };

  // Send message to AI Tutor with actionType
  const handleSendMessage = async (text: string, actionType: string = 'ASK_QUESTION', evidenceToSubmit?: StudentEvidence | null) => {
    if (isNoAiMode) {
      alert('Chế độ thử thách tự lập trình (không có AI) đang bật. Em hãy tự suy nghĩ và kiểm thử nhé!');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTutorLoading(true);

    const evidencePayload = actionType === 'SUBMIT_EVIDENCE' ? (evidenceToSubmit !== undefined ? evidenceToSubmit : studentEvidence) : null;

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          problem: selectedProblem,
          studentEvidence: evidencePayload,
          currentCode: code,
          language: selectedLanguage,
          actionType,
          isNoAiMode,
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        if (data.currentTier) {
          setCurrentTier(data.currentTier);
          setViewingTier(data.currentTier);
        }
        if (data.highestUnlockedTier) {
          setHighestUnlockedTier(data.highestUnlockedTier);
        }
        const assistantMsg: ChatMessage = {
          id: `tutor-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          tier: data.currentTier || currentTier,
          timestamp: Date.now(),
          structuredData: data.structuredData,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (actionType === 'SUBMIT_EVIDENCE') {
          setStudentEvidence(null);
        }
      } else {
        throw new Error(data.error || 'Lỗi phản hồi từ trợ lý.');
      }
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `tutor-fallback-${Date.now()}`,
        role: 'assistant',
        content: `💡 [Gợi ý từ ngân hàng bài tập] – Không kết nối được Gemini:\n\nThầy/cô trợ lý đã nhận được thắc mắc: "${text}".\n\n📌 **Gợi ý định hướng ở Tầng ${currentTier}:**\n- ${selectedProblem.tieredGuidance.tier1.guidingQuestions[0]}\n- Em hãy quan sát ví dụ mẫu và tính nhẩm từng bước nhé!`,
        tier: currentTier,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handleAskTutorAboutError = (category: string, message: string) => {
    handleSendMessage(`Chương trình của em khi chạy bị báo lỗi: "${message}". Nhờ trợ lý chỉ ra nhóm lỗi và vùng em cần kiểm tra, đừng viết lại code hộ em nhé!`, 'ASK_QUESTION');
  };

  const handleResetCode = () => {
    if (confirm('Em có chắc chắn muốn đặt lại mã nguồn về trạng thái ban đầu của bài?')) {
      setCode(selectedProblem.starterCode[selectedLanguage] || selectedProblem.starterCode.python);
      setTestResults([]);
    }
  };

  const handleSelectProblemAndOpenWorkspace = (p: Problem) => {
    setSelectedProblem(p);
    setActiveTab('workspace');
  };

  const handleAddCustomProblem = (p: Problem) => {
    setProblems((prev) => [p, ...prev]);
    setSelectedProblem(p);
    setActiveTab('workspace');
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        action: 'Thêm bài tập mới',
        actorRole: currentUser.role,
        actorName: currentUser.name,
        details: `Đã thêm bài tập ${p.title} vào kho dữ liệu.`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-800/60 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={effectiveUser}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        isNoAiMode={isNoAiMode}
      />

      {/* Pages Container */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <HomePage onNavigate={setActiveTab} />
        )}

        {activeTab === 'workspace' && (
          <CodingWorkspacePage
            problem={selectedProblem}
            allProblems={problems}
            onSelectProblem={setSelectedProblem}
            code={code}
            onCodeChange={(newCode) => {
              setCode(newCode);
              if (testedCodeSnapshot && newCode !== testedCodeSnapshot) {
                setTestResults([]);
              }
            }}
            language={selectedLanguage}
            onResetCode={handleResetCode}
            currentTier={currentTier}
            highestUnlockedTier={highestUnlockedTier}
            viewingTier={viewingTier}
            onSelectViewingTier={setViewingTier}
            studentEvidence={studentEvidence}
            onSaveEvidence={(ev) => {
              setStudentEvidence(ev);
              handleSendMessage(`Em đã chuẩn bị bằng chứng tư duy (${ev.type}): "${ev.content}". Trợ lý hãy kiểm tra giúp em nhé!`, 'SUBMIT_EVIDENCE', ev);
            }}
            onClearEvidence={() => setStudentEvidence(null)}
            predictions={predictions}
            onPredictionChange={(id, val) => setPredictions((prev) => ({ ...prev, [id]: val }))}
            testResults={testResults}
            onRunAllTests={handleRunAllTests}
            onStopTests={handleStopTests}
            isRunningTests={isRunningTests}
            messages={messages}
            onSendMessage={handleSendMessage}
            isTutorLoading={isTutorLoading}
            isNoAiMode={isNoAiMode}
            onToggleNoAiMode={() => setIsNoAiMode(!isNoAiMode)}
            onAskTutorAboutError={handleAskTutorAboutError}
            onOpenReflection={() => setIsReflectionOpen(true)}
            currentUser={effectiveUser}
            hasInitError={hasInitError}
            onRetryPython={handleRetryPython}
          />
        )}

        {activeTab === 'repository' && (
          <ProblemRepositoryPage
            problems={problems}
            onSelectProblem={handleSelectProblemAndOpenWorkspace}
            currentUser={effectiveUser}
            onOpenCustomProblem={() => setIsCustomProblemOpen(true)}
          />
        )}

        {activeTab === 'tutor' && (
          <AITutorPage problems={problems} />
        )}

        {activeTab === 'progress' && (
          <JournalProgressPage
            journalEntries={journalEntries}
            currentUser={effectiveUser}
            problems={problems}
            onAddJournalEntry={(entry) => setJournalEntries((prev) => [entry, ...prev])}
          />
        )}

        {activeTab === 'guide' && (
          <UserGuidePage />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboardPage
            classes={classes}
            assignments={assignments}
            problems={problems}
            reviews={reviews}
            onAddClass={(cls) => setClasses((prev) => [cls, ...prev])}
            onAddAssignment={(assign) => setAssignments((prev) => [assign, ...prev])}
            onUpdateAssignment={(updated) =>
              setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
            }
            onSaveReview={(rev) => setReviews((prev) => [rev, ...prev])}
            onPreviewProblem={handleSelectProblemAndOpenWorkspace}
            currentUser={effectiveUser}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortalPage
            auditLogs={auditLogs}
            onAddAuditLog={(log) => setAuditLogs((prev) => [log, ...prev])}
            currentUser={effectiveUser}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <RoleSelectionModal
        isOpen={Boolean(firebaseUser && currentUser.needsRoleSelection)}
        onSelectRole={selectRole}
        userEmail={firebaseUser?.email || currentUser.email}
        userName={firebaseUser?.displayName || currentUser.name}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentUser={currentUser}
      />

      <ReflectionModal
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
        problem={selectedProblem}
        onSendReflectionToTutor={(text) => handleSendMessage(text, 'ASK_QUESTION')}
      />

      <HandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      <PedagogyGuideModal
        isOpen={isPedagogyGuideOpen}
        onClose={() => setIsPedagogyGuideOpen(false)}
      />

      <CustomProblemModal
        isOpen={isCustomProblemOpen}
        onClose={() => setIsCustomProblemOpen(false)}
        onAddProblem={handleAddCustomProblem}
      />
    </div>
  );
}
