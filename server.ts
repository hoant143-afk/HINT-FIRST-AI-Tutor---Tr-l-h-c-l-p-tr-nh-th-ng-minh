import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `
VAI TRÒ:
Bạn là HINT-FIRST AI Tutor – Trợ lý học lập trình thông minh dành cho học sinh THCS (11-15 tuổi).
Slogan: "Tự suy nghĩ – AI gợi ý – Em làm chủ kiến thức."
Tôn chỉ cao nhất: Giàn giáo nhận thức (scaffolding) và phản hồi hình thành. Giúp học sinh tự suy nghĩ, tự phát hiện lỗi và tự sửa. Bạn TUYỆT ĐỐI KHÔNG BAO GIỜ làm bài thay và KHÔNG BAO GIỜ đưa ra mã nguồn hoàn chỉnh có thể sao chép nộp bài.

13 NGUYÊN TẮC BẮT BUỘC:
1. Phản hồi đầu tiên KHÔNG ĐƯỢC chứa mã nguồn hoặc lời giải hoàn chỉnh.
2. Trước khi hỗ trợ sâu, kiểm tra xem học sinh đã có bằng chứng nỗ lực hợp lệ chưa (ý tưởng, giả mã, mã đã thử, thông báo lỗi).
3. Nếu học sinh chưa thử, chỉ hỏi 1-2 câu dẫn dắt ngắn ở Tầng 1.
4. Hỗ trợ theo 4 tầng giàn giáo tuần tự (Tầng 1 -> Tầng 2 -> Tầng 3 -> Tầng 4). Không nhảy cóc.
5. Chỉ nâng mức hỗ trợ khi học sinh đã thử sức ở tầng hiện tại và cung cấp bằng chứng nỗ lực hợp lệ được phân loại RELEVANT.
6. Khi học sinh đưa mã sai, KHÔNG tự viết lại toàn bộ mã đúng. Hãy nêu nhóm lỗi, chỉ vùng nghi vấn và đặt câu hỏi.
7. Dùng tiếng Việt ngắn gọn, thân thiện, khích lệ lứa tuổi 11-15.
8. Không dùng kiến thức vượt trình độ THCS.
9. Yêu cầu học sinh kiểm thử và dự đoán kết quả trước khi chạy.
10. Khi chạy đúng, yêu cầu giải thích vai trò biến.
11. Cuối bài đưa thử thách biến thể (Transfer challenge) không kèm lời giải.
12. Không yêu cầu hay lưu trữ thông tin cá nhân.
13. Hướng dẫn học sinh tự kiểm chứng thực nghiệm.

CHÍNH SÁCH CHỐNG LÀM BÀI THAY:
Nếu học sinh nói: "Làm giúp em", "Cho code hoàn chỉnh", "Cho đáp án", "Bỏ qua các bước":
Bạn PHẢI kiên quyết từ chối giải thay một cách lịch sự, thân thiện và đưa ra câu hỏi định hướng ở Tầng 1.
`;

interface HintRecord {
  hintId: string;
  problemId: string;
  tier: number;
  content: string;
  timestamp: number;
}

interface EvidenceRecord {
  evidenceId: string;
  problemId: string;
  tierWhenSubmitted: number;
  responseToHintId: string;
  content: string;
  classification: 'RELEVANT' | 'INCOMPLETE' | 'IRRELEVANT' | 'DUPLICATE' | 'UNCERTAIN';
  reason: string;
  timestamp: number;
  consumed?: boolean;
}

interface TutorSession {
  sessionId: string;
  problemId: string;
  currentTier: number; // 1 to 4
  highestUnlockedTier: number; // 1 to 4
  maxAllowedTier: number;
  hintHistory: HintRecord[];
  evidenceHistory: EvidenceRecord[];
  submittedEvidenceIds: Set<string>;
  normalizedEvidenceContents: Set<string>;
  lastHint: string;
  aiEnabled: boolean;
  isNoAiMode: boolean;
  createdAt: number;
  updatedAt: number;
  isProcessing?: boolean;
}

const tutorSessions = new Map<string, TutorSession>();
const TEACHER_LOCKED_NO_AI_PROBLEMS = new Set<string>([
  'prob-exam-noai',
  'prob-strict-01',
]);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

function getOrCreateSecureSession(sessionId: string, problemId: string): TutorSession {
  const now = Date.now();
  const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

  for (const [sId, sess] of tutorSessions.entries()) {
    if (now - sess.updatedAt > TTL_MS || tutorSessions.size > 500) {
      tutorSessions.delete(sId);
    }
  }

  const serverForcedNoAi = TEACHER_LOCKED_NO_AI_PROBLEMS.has(problemId);
  let session = tutorSessions.get(sessionId);

  if (!session || session.problemId !== problemId) {
    const effectiveNoAi = serverForcedNoAi;
    session = {
      sessionId: sessionId || crypto.randomUUID(),
      problemId: problemId || 'prob-default',
      currentTier: 1,
      highestUnlockedTier: 1,
      maxAllowedTier: 4,
      hintHistory: [],
      evidenceHistory: [],
      submittedEvidenceIds: new Set<string>(),
      normalizedEvidenceContents: new Set<string>(),
      lastHint: '',
      aiEnabled: !effectiveNoAi,
      isNoAiMode: effectiveNoAi,
      createdAt: now,
      updatedAt: now,
      isProcessing: false,
    };
    tutorSessions.set(session.sessionId, session);
  } else {
    if (serverForcedNoAi) {
      session.isNoAiMode = true;
      session.aiEnabled = false;
    }
    session.updatedAt = now;
  }
  return session;
}

function detectCheatingAttempt(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  const cheatPhrases = [
    'làm giúp em',
    'giải hộ em',
    'giải giúp em',
    'cho em code hoàn chỉnh',
    'cho code hoàn chỉnh',
    'viết code hoàn chỉnh',
    'cho đáp án',
    'bỏ qua các bước',
    'bỏ qua quy tắc',
    'cho lời giải',
    'viết hộ',
    'cho code luôn đi',
    'cho em bài giải',
  ];
  return cheatPhrases.some((phrase) => lower.includes(phrase));
}

function sanitizeAndCheckCodeLeak(content: string, problem: any): { isLeaked: boolean; sanitized: string } {
  const codeBlockRegex = /```python([\s\S]*?)```/g;
  let hasLeak = false;
  const sanitized = content.replace(codeBlockRegex, (match, codeInside) => {
    const lines = codeInside.trim().split('\n');
    const hasInput = /input\(/.test(codeInside);
    const hasPrint = /print\(/.test(codeInside);
    const hasLoopOrIf = /for |while |if /.test(codeInside);
    const hasBlank = /___/.test(codeInside);

    if (lines.length >= 4 && hasInput && hasPrint && hasLoopOrIf && !hasBlank) {
      hasLeak = true;
      return `\`\`\`python\n# [AI Tutor: Giàn giáo nhận thức Tầng 4 - Hãy tự điền vào chỗ trống]\n${lines
        .map((l: string, idx: number) => {
          if (idx === 0 || idx === lines.length - 1) return l;
          if (l.includes('=')) {
            const parts = l.split('=');
            return `${parts[0]}= ___`;
          }
          return l;
        })
        .join('\n')}\n\`\`\``;
    }
    return match;
  });

  return { isLeaked: hasLeak, sanitized };
}

function normalizeContent(text: string): string {
  return (text || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

// Robust Semantic Evidence Evaluation returning UNCERTAIN on error/invalid JSON
async function evaluateEvidenceSemantic(
  content: string,
  problem: any,
  currentTier: number,
  recentHint: string,
  submittedIds: Set<string>,
  normalizedHistory: Set<string>,
  evidenceId?: string
): Promise<{ classification: 'RELEVANT' | 'INCOMPLETE' | 'IRRELEVANT' | 'DUPLICATE' | 'UNCERTAIN'; reason: string }> {
  if (!content || content.trim().length < 3) {
    return { classification: 'INCOMPLETE', reason: 'Bằng chứng quá ngắn, chưa đủ thể hiện ý tưởng giải quyết bài toán.' };
  }

  const id = evidenceId || crypto.randomUUID();
  if (submittedIds.has(id)) {
    return { classification: 'DUPLICATE', reason: 'Bằng chứng này (evidenceId) đã được gửi trước đó.' };
  }

  const norm = normalizeContent(content);
  if (normalizedHistory.has(norm)) {
    return { classification: 'DUPLICATE', reason: 'Nội dung bằng chứng này trùng lặp với nội dung đã gửi trước đó.' };
  }

  const safeContent = content.slice(0, 500);

  try {
    const evalPrompt = `Bạn là chuyên gia đánh giá sư phạm AI cho học sinh THCS (11-15 tuổi).
Bài toán: "${problem?.title}" - ${problem?.description}
Mục tiêu học tập: ${(problem?.learningGoals || []).join('; ')}
Tầng giàn giáo hiện tại: Tầng ${currentTier}
Gợi ý gần nhất từ trợ lý: "${recentHint || 'Chưa có'}"
Nội dung học sinh vừa cung cấp: "${safeContent}"

Hãy đánh giá xem nội dung này thuộc loại nào trong 5 loại sau:
1. RELEVANT: Có nỗ lực tư duy, ý tưởng, giả mã, mã thử nghiệm hoặc câu hỏi thắc mắc có liên quan đến bài toán và tiến trình học.
2. INCOMPLETE: Có nỗ lực nhưng còn sơ lược, cần làm rõ thêm.
3. IRRELEVANT: Hoàn toàn lạc đề, không liên quan đến bài học.
4. DUPLICATE: Trùng lặp nội dung.
5. UNCERTAIN: Chưa đủ căn cứ kết luận.

Trả về kết quả dưới dạng JSON duy nhất, không có markdown khác:
{
  "classification": "RELEVANT" | "INCOMPLETE" | "IRRELEVANT" | "DUPLICATE" | "UNCERTAIN",
  "reason": "Giải thích ngắn gọn bằng tiếng Việt"
}`;

    const evalRes = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: evalPrompt,
      config: {
        temperature: 0.1,
      },
    });

    const text = evalRes.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (['RELEVANT', 'INCOMPLETE', 'IRRELEVANT', 'DUPLICATE', 'UNCERTAIN'].includes(parsed.classification)) {
        return {
          classification: parsed.classification,
          reason: parsed.reason || 'Đã phân tích bằng chứng theo ngữ cảnh.',
        };
      }
    }
  } catch (err) {
    console.error('Semantic evaluation error, returning UNCERTAIN:', err);
  }

  return { classification: 'UNCERTAIN', reason: 'Không thể phân loại chắc chắn do lỗi kết nối hoặc định dạng. Cần học sinh làm rõ thêm.' };
}

function findValidEvidenceForUpgrade(
  session: TutorSession,
  currentTier: number,
  problemId: string
): { valid: boolean; evidence: EvidenceRecord | null; reason: string } {
  const tierHints = session.hintHistory.filter(h => h.tier === currentTier && h.problemId === problemId);
  if (tierHints.length === 0) {
    return { valid: false, evidence: null, reason: `Chưa có gợi ý nào ở Tầng ${currentTier} từ hệ thống cho bài toán này.` };
  }

  for (const ev of session.evidenceHistory) {
    if (ev.consumed) continue;
    if (ev.classification !== 'RELEVANT') continue;
    if (ev.problemId && problemId && ev.problemId !== problemId) continue;

    const matchedHint = tierHints.find(h => h.hintId === ev.responseToHintId);
    if (matchedHint && ev.timestamp > matchedHint.timestamp) {
      return { valid: true, evidence: ev, reason: `Tìm thấy bằng chứng hợp lệ phản hồi gợi ý (ID: ${matchedHint.hintId}).` };
    }
  }

  return { valid: false, evidence: null, reason: `Chưa có bằng chứng nỗ lực RELEVANT nào phản hồi các gợi ý tại Tầng ${currentTier} của bài toán này.` };
}

app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      messages,
      problem,
      studentEvidence,
      currentCode,
      language,
      actionType = 'ASK_QUESTION', // ASK_QUESTION | SUBMIT_EVIDENCE | REQUEST_NEXT_HINT | REVIEW_PREVIOUS_HINT
    } = req.body;

    // Server-side authoritative session & No-AI lock check (ignoring client override)
    const session = getOrCreateSecureSession(sessionId, problem?.id);

    if (session.isNoAiMode || !session.aiEnabled) {
      return res.status(403).json({
        success: false,
        error: 'Bài tập này đang ở chế độ "Thử thách tự lập trình" (không có AI) theo quy định của giáo viên.',
      });
    }

    if (session.isProcessing) {
      return res.status(409).json({
        success: false,
        error: 'Đang xử lý yêu cầu trước, vui lòng đợi.',
      });
    }

    session.isProcessing = true;

    try {
      // Error C: REVIEW_PREVIOUS_HINT should return immediately without calling Gemini or mutating state
      if (actionType === 'REVIEW_PREVIOUS_HINT') {
        const existingHint = session.hintHistory.slice().reverse().find(h => h.tier === session.currentTier) || session.hintHistory[session.hintHistory.length - 1];
        const replyContent = existingHint ? existingHint.content : 'Chưa có gợi ý nào được ghi nhận trước đó cho tầng này.';
        return res.json({
          success: true,
          currentTier: session.currentTier,
          highestUnlockedTier: session.highestUnlockedTier,
          unlockReason: `Đang xem lại gợi ý Tầng ${session.currentTier} (Không gọi Gemini).`,
          reply: replyContent,
          structuredData: {
            diagnosis: 'Xem lại gợi ý cũ',
            hint_level: session.currentTier,
            highestUnlockedTier: session.highestUnlockedTier,
            hint: replyContent,
            unlockReason: 'Xem lại gợi ý cũ',
            canRequestNextHint: session.highestUnlockedTier < 4,
          },
        });
      }

      let evidenceEvaluation = null;

      // Determine latest hint before evaluating/adding new evidence
      const latestHint = session.hintHistory.length > 0 ? session.hintHistory[session.hintHistory.length - 1] : null;
      const responseToHintId = latestHint ? latestHint.hintId : 'initial';

      if (studentEvidence && studentEvidence.content) {
        const recentHintText = latestHint ? latestHint.content : '';
        const evalResult = await evaluateEvidenceSemantic(
          studentEvidence.content,
          problem,
          session.currentTier,
          recentHintText,
          session.submittedEvidenceIds,
          session.normalizedEvidenceContents,
          studentEvidence.evidenceId
        );
        evidenceEvaluation = evalResult;

        if (evalResult.classification === 'RELEVANT' || evalResult.classification === 'INCOMPLETE') {
          const id = studentEvidence.evidenceId || crypto.randomUUID();
          const norm = normalizeContent(studentEvidence.content);

          if (!session.submittedEvidenceIds.has(id) && !session.normalizedEvidenceContents.has(norm)) {
            session.submittedEvidenceIds.add(id);
            session.normalizedEvidenceContents.add(norm);

            const evRecord: EvidenceRecord = {
              evidenceId: id,
              problemId: problem?.id || 'prob-default',
              tierWhenSubmitted: session.currentTier,
              responseToHintId,
              content: studentEvidence.content,
              classification: evalResult.classification,
              reason: evalResult.reason,
              timestamp: Date.now(),
              consumed: false,
            };

            session.evidenceHistory.push(evRecord);
          }
        }
      }

      // Tentative tier upgrade planning (Đợt 3: do not commit tier permanently before Gemini success)
      let tentativeNextTier = session.currentTier;
      let matchingEvidenceToConsume: EvidenceRecord | null = null;
      let unlockReason = 'Tiến trình đang ở tầng hiện tại.';

      if (actionType === 'REQUEST_NEXT_HINT') {
        const nextTier = session.currentTier + 1;
        if (nextTier <= 4) {
          const evalUpgrade = findValidEvidenceForUpgrade(session, session.currentTier, problem?.id);
          if (evalUpgrade.valid && evalUpgrade.evidence) {
            tentativeNextTier = nextTier;
            matchingEvidenceToConsume = evalUpgrade.evidence;
            unlockReason = `Đủ điều kiện mở khóa Tầng ${nextTier} (Đang chờ trợ lý AI tạo gợi ý).`;
          } else {
            unlockReason = `Chưa đủ điều kiện lên Tầng ${nextTier}: ${evalUpgrade.reason}`;
          }
        } else {
          unlockReason = 'Bạn đã ở tầng cao nhất (Tầng 4).';
        }
      }

      const effectiveTier = tentativeNextTier;
      const latestUserMsg = (messages || []).filter((m: any) => m.role === 'user').slice(-1)[0]?.content || '';
      const isCheating = detectCheatingAttempt(latestUserMsg);

      let promptContext = `THÔNG TIN BÀI TOÁN HIỆN TẠI:
- Mã bài: ${problem?.codeNumber || 'THCS'}
- Tên bài: ${problem?.title || 'Chưa chọn'}
- Mục tiêu học tập: ${(problem?.learningGoals || []).join('; ') || problem?.description}
- Đầu vào (Input): ${problem?.inputFormat || 'Theo đề bài'}
- Đầu ra (Output): ${problem?.outputFormat || 'Theo đề bài'}
- Tầng giàn giáo Server kiểm soát: TẦNG ${effectiveTier} (Cao nhất đã mở: Tầng ${Math.max(session.highestUnlockedTier, tentativeNextTier)})
- Đánh giá bằng chứng gần nhất: ${evidenceEvaluation ? `${evidenceEvaluation.classification} - ${evidenceEvaluation.reason}` : 'Chưa có'}
- Hành động yêu cầu: ${actionType}
- Lý do mở/giữ tầng: ${unlockReason}

MÃ HIỆN TẠI CỦA HỌC SINH:
\`\`\`${language || 'python'}
${currentCode || '(Chưa viết)'}
\`\`\`
`;

      if (isCheating) {
        promptContext += `\nCẢNH BÁO BẢO VỆ: Học sinh yêu cầu làm bài thay: "${latestUserMsg}". Kiên quyết từ chối lịch sự, nhắc slogan "Tự suy nghĩ – AI gợi ý – Em làm chủ kiến thức", và đặt câu hỏi định hướng ở Tầng 1.`;
      }

      const conversationHistory = (messages || []).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const fullContents = [...conversationHistory];
      if (fullContents.length === 0 || fullContents[fullContents.length - 1].role !== 'user') {
        fullContents.push({
          role: 'user',
          parts: [{ text: `${promptContext}\nEm chào thầy/cô trợ lý!` }],
        });
      } else {
        const last = fullContents[fullContents.length - 1];
        last.parts[0].text = `[BỐI CẢNH SƯ PHẠM SERVER]:\n${promptContext}\n\n[CÂU HỎI HỌC SINH]:\n${last.parts[0].text}`;
      }

      // Call Gemini API - if this fails, state is NOT mutated (Đợt 3 requirement)
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: fullContents as any,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
        },
      });

      const rawReply = response.text ? response.text.trim() : '';

      if (!rawReply || rawReply.length < 5) {
        return res.status(502).json({
          success: false,
          error: 'Trợ lý AI trả về phản hồi trống hoặc không hợp lệ. Vui lòng thử lại.',
          fallbackLabel: '💡 [Gợi ý từ ngân hàng bài tập] – Không nhận được phản hồi hợp lệ từ Gemini',
        });
      }

      const { isLeaked, sanitized } = sanitizeAndCheckCodeLeak(rawReply, problem);

      // Successfully generated valid hint! Now commit tentative state changes (Đợt 3)
      if (tentativeNextTier > session.currentTier) {
        session.currentTier = tentativeNextTier;
        session.highestUnlockedTier = Math.max(session.highestUnlockedTier, tentativeNextTier);
        if (matchingEvidenceToConsume) {
          matchingEvidenceToConsume.consumed = true;
        }
        unlockReason = `Đã mở khóa thành công Tầng ${tentativeNextTier}.`;
      }

      const hintId = 'hint-' + crypto.randomUUID();
      session.hintHistory.push({
        hintId,
        problemId: problem?.id || 'prob-default',
        tier: session.currentTier,
        content: sanitized,
        timestamp: Date.now(),
      });

      session.lastHint = sanitized;
      session.updatedAt = Date.now();

      return res.json({
        success: true,
        currentTier: session.currentTier,
        highestUnlockedTier: session.highestUnlockedTier,
        unlockReason,
        reply: sanitized,
        structuredData: {
          diagnosis: isCheating ? 'Yêu cầu làm bài thay (Đã chặn)' : 'Đang hỗ trợ theo giàn giáo Socratic tuần tự',
          hint_level: session.currentTier,
          highestUnlockedTier: session.highestUnlockedTier,
          hint: sanitized,
          evidenceEvaluation,
          unlockReason,
          canRequestNextHint: session.highestUnlockedTier < 4,
        },
      });
    } finally {
      session.isProcessing = false;
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Có lỗi xảy ra khi kết nối trợ lý AI.',
      fallbackLabel: '💡 [Gợi ý từ ngân hàng bài tập] – Không kết nối được Gemini',
    });
  }
});

// Endpoint: Evaluate Student Algorithmic Reflection (Rule 10)
app.post('/api/tutor/evaluate-reflection', async (req: Request, res: Response) => {
  try {
    const { problemTitle, reflectionAnswers } = req.body;

    const prompt = `Bạn là chuyên gia sư phạm Tin học THCS.
Học sinh vừa hoàn thành bài toán "${problemTitle}" và trả lời các câu hỏi phản tư sau:
${JSON.stringify(reflectionAnswers, null, 2)}

Hãy nhận xét ngắn gọn (khoảng 3-4 câu) bằng tiếng Việt thân thiện, động viên học sinh:
1. Khen ngợi điểm học sinh đã hiểu đúng về vai trò của biến hoặc vòng lặp.
2. Nếu có chỗ nào chưa thật chính xác, khéo léo giải thích thêm.
3. Không cho điểm số chính thức, chỉ nhận xét định tính khích lệ.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      feedback: response.text || 'Thầy/cô rất khen ngợi tinh thần tự suy nghĩ và giải thích thuật toán của em!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// System Health Endpoint
app.get('/api/system/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ONLINE',
    systemName: 'HINT-FIRST AI Tutor Server',
    geminiStatus: hasKey ? 'CONNECTED' : 'KEY_NOT_CONFIGURED',
    model: 'gemini-3.8-flash',
    timestamp: Date.now(),
    serverTimeISO: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`HINT-FIRST AI Tutor server running at http://localhost:${PORT}`);
  });
}

startServer();
