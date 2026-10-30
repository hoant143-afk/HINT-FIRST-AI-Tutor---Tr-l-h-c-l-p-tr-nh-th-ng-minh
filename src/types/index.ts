export type GradeLevel = 'lop6' | 'lop7' | 'lop8' | 'lop9';

export type ProgrammingLanguage = 'python' | 'cpp' | 'scratch';

export type TutorTier = 1 | 2 | 3 | 4;

export type UserRole = 'student' | 'teacher' | 'admin';

export type TeacherApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revoked';

export interface TeacherApplication {
  uid: string;
  email: string;
  name: string;
  status: TeacherApprovalStatus;
  requestedAt: number;
  reviewedAt?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  classCode?: string;
  studentCode?: string; // Anonymous ID e.g. HS-0724
  isApprovedTeacher?: boolean;
  teacherApprovalStatus?: TeacherApprovalStatus;
  needsRoleSelection?: boolean;
  previewRole?: UserRole;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isEdgeCase?: boolean;
  description: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  codeNumber: string; // e.g. THCS-01
  title: string;
  grade: GradeLevel;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  topic: string; // e.g. 'Vòng lặp for và range', 'Xâu ký tự'
  topicCategory: 'variables' | 'io' | 'operators' | 'ifelse' | 'forloop' | 'whileloop' | 'strings' | 'lists' | 'debugging' | 'advanced';
  requiredKnowledge: string[];
  learningGoals: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  commonMistakes: string[];
  starterCode: {
    python: string;
    cpp: string;
    scratch: string;
  };
  teacherReferenceSolution: string; // Protected, only visible to teacher role!
  testCases: TestCase[];
  tieredGuidance: {
    tier1: {
      guidingQuestions: string[];
      conceptHint: string;
    };
    tier2: {
      concepts: string[];
      explanation: string;
      rulesToRemember: string[];
    };
    tier3: {
      pseudocodeSteps: string[];
    };
    tier4: {
      fillInTheBlankCode: string;
      blankExplanation: string;
    };
  };
  reflectionQuestions: string[];
  transferChallenge: {
    title: string;
    description: string;
  };
}

export type EvidenceType = 'idea' | 'pseudocode' | 'code' | 'error' | 'prediction';

export interface StudentEvidence {
  evidenceId?: string;
  type: EvidenceType;
  content: string;
  timestamp: number;
}

export interface StructuredAiResponse {
  diagnosis: string;
  hint_level: TutorTier;
  highestUnlockedTier?: TutorTier;
  hint: string;
  next_action: string;
  evidence_used: string;
  needs_teacher: boolean;
  uncertainty?: string;
  unlockReason?: string;
  evidenceEvaluation?: any;
  canRequestNextHint?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tier?: TutorTier;
  timestamp: number;
  errorCategory?: string;
  isFirstResponse?: boolean;
  structuredData?: StructuredAiResponse;
  verifiedByStudent?: boolean;
}

export interface TestResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  studentPrediction?: string;
  passed: boolean;
  predictionCorrect?: boolean;
  executionTimeMs?: number;
  errorMessage?: string;
}

export interface CodeVersion {
  id: string;
  timestamp: number;
  code: string;
  note: string;
}

export interface LearningJournalEntry {
  id: string;
  problemId: string;
  problemTitle: string;
  studentCode: string;
  priorEffort: string;
  studentQuestions: string[];
  aiHintsReceived: string[];
  selfCorrections: string;
  testCasesUsed: string[];
  testResultsSummary: string;
  lessonsLearned: string;
  remainingDoubts: string;
  timestamp: number;
  highestTierUsed: TutorTier;
  isNoAiMode?: boolean;
}

export interface ClassRoom {
  id: string;
  code: string; // e.g. TIN7A1
  name: string;
  grade: GradeLevel;
  teacherId: string;
  teacherName: string;
  createdAt: number;
  studentCodes: string[];
  activeAssignmentId?: string;
  isLocked?: boolean;
}

export interface Assignment {
  id: string;
  classId: string;
  problemId: string;
  title: string;
  dueDate: string;
  aiEnabled: boolean;
  maxAiTier: TutorTier;
  allowNoAiChallenge: boolean;
  assignedAt: number;
}

export interface RubricLevel {
  level: 1 | 2 | 3 | 4;
  label: string;
  description: string;
  score: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  levels: RubricLevel[];
}

export interface TeacherReview {
  id: string;
  studentCode: string;
  assignmentId: string;
  problemId: string;
  scores: Record<string, number>; // criterionId -> score (1-4)
  feedback: string;
  reviewerName: string;
  reviewedAt: number;
}

export interface SystemAuditLog {
  id: string;
  timestamp: number;
  action: string;
  actorRole: UserRole;
  actorName: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}
