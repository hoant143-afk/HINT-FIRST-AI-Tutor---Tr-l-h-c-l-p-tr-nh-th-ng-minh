import React from 'react';
import {
  Problem,
  TutorTier,
  StudentEvidence,
  ChatMessage,
  TestResult,
  ProgrammingLanguage,
  UserProfile,
} from '../types';
import { ProblemCard } from '../components/ProblemCard';
import { EvidenceGate } from '../components/EvidenceGate';
import { CodeEditor } from '../components/CodeEditor';
import { TestBench } from '../components/TestBench';
import { AITutorChat } from '../components/AITutorChat';
import { Lock, Unlock } from 'lucide-react';

interface CodingWorkspacePageProps {
  problem: Problem;
  allProblems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  code: string;
  onCodeChange: (code: string) => void;
  language: ProgrammingLanguage;
  onResetCode: () => void;
  currentTier: TutorTier;
  highestUnlockedTier: TutorTier;
  viewingTier: TutorTier;
  onSelectViewingTier: (tier: TutorTier) => void;
  studentEvidence: StudentEvidence | null;
  onSaveEvidence: (ev: StudentEvidence) => void;
  onClearEvidence: () => void;
  predictions: Record<string, string>;
  onPredictionChange: (tcId: string, val: string) => void;
  testResults: TestResult[];
  onRunAllTests: () => void;
  onStopTests: () => void;
  isRunningTests: boolean;
  messages: ChatMessage[];
  onSendMessage: (text: string, actionType?: 'ASK_QUESTION' | 'SUBMIT_EVIDENCE' | 'REQUEST_NEXT_HINT' | 'REVIEW_PREVIOUS_HINT', evidenceToSubmit?: StudentEvidence | null) => void;
  isTutorLoading: boolean;
  isNoAiMode: boolean;
  onToggleNoAiMode: () => void;
  onAskTutorAboutError: (cat: string, msg: string) => void;
  onOpenReflection: () => void;
  currentUser: UserProfile;
  hasInitError?: boolean;
  onRetryPython?: () => void;
}

export const CodingWorkspacePage: React.FC<CodingWorkspacePageProps> = ({
  problem,
  allProblems,
  onSelectProblem,
  code,
  onCodeChange,
  language,
  onResetCode,
  currentTier,
  highestUnlockedTier,
  viewingTier,
  onSelectViewingTier,
  studentEvidence,
  onSaveEvidence,
  onClearEvidence,
  predictions,
  onPredictionChange,
  testResults,
  onRunAllTests,
  onStopTests,
  isRunningTests,
  messages,
  onSendMessage,
  isTutorLoading,
  isNoAiMode,
  onToggleNoAiMode,
  onAskTutorAboutError,
  onOpenReflection,
  currentUser,
  hasInitError,
  onRetryPython,
}) => {
  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 space-y-4">
      {/* Workspace Top Bar (No-AI Toggle & Slogan reminder) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Không gian lập trình thực hành
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            • Áp dụng chu trình 6 bước
          </span>
        </div>

        {/* Section XI: No-AI Challenge Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleNoAiMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isNoAiMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Bật chế độ thử thách tự lập trình (không có trợ lý AI) để đánh giá năng lực độc lập"
          >
            {isNoAiMode ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isNoAiMode ? 'Chế độ: Thử thách tự lập trình (Không AI)' : 'Chế độ: Có Trợ lý AI'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left / Center / Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (Span 7 if AI active, Span 12 if No-AI active) */}
        <div className={`${isNoAiMode ? 'lg:col-span-12' : 'lg:col-span-7'} flex flex-col gap-4`}>
          {/* Problem Brief & 4-Tier Ladder */}
          <ProblemCard
            problem={problem}
            allProblems={allProblems}
            onSelectProblem={onSelectProblem}
            currentTier={currentTier}
            highestUnlockedTier={highestUnlockedTier}
            viewingTier={viewingTier}
            onSelectViewingTier={onSelectViewingTier}
          />

          {/* Evidence Gate (Rule 2) - Only needed when AI is active */}
          {!isNoAiMode && (
            <EvidenceGate
              evidence={studentEvidence}
              onSaveEvidence={onSaveEvidence}
              onClearEvidence={onClearEvidence}
              onQuickAskTutor={(q) => onSendMessage(q, 'SUBMIT_EVIDENCE', studentEvidence)}
            />
          )}

          {/* Code Editor */}
          <CodeEditor
            code={code}
            onChange={onCodeChange}
            language={language}
            onReset={onResetCode}
            onRunTestBench={onRunAllTests}
            onStopRun={onStopTests}
            isRunning={isRunningTests}
          />

          {/* Testbench with Prediction (Rule 9) */}
          <TestBench
            testCases={problem.testCases}
            testResults={testResults}
            predictions={predictions}
            onPredictionChange={onPredictionChange}
            onRunAllTests={onRunAllTests}
            isRunning={isRunningTests}
            onAskTutorAboutError={onAskTutorAboutError}
            onOpenReflection={onOpenReflection}
            hasInitError={hasInitError}
            onRetryPython={onRetryPython}
          />
        </div>

        {/* Right Column: AI Tutor Chat (Hidden when isNoAiMode is true) */}
        {!isNoAiMode && (
          <div className="lg:col-span-5 sticky top-20">
            <AITutorChat
              messages={messages}
              onSendMessage={onSendMessage}
              isLoading={isTutorLoading}
              problem={problem}
              currentTier={currentTier}
              highestUnlockedTier={highestUnlockedTier}
              studentEvidence={studentEvidence}
              language={language}
            />
          </div>
        )}

        {/* No-AI Mode Active Banner if hidden */}
        {isNoAiMode && (
          <div className="lg:col-span-12 bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <strong className="block text-white text-sm">
                  Chế độ "Thử thách tự lập trình" đang bật
                </strong>
                <span>
                  Trợ lý AI đã được ẩn theo phương pháp rút giàn giáo nhận thức. Em hãy tự đọc đề, viết mã và kiểm thử để làm chủ kiến thức!
                </span>
              </div>
            </div>
            <button
              onClick={onToggleNoAiMode}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg border border-amber-500/40 cursor-pointer"
            >
              Mở lại Trợ lý AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
