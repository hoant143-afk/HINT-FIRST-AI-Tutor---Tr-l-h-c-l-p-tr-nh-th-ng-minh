import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Problem, StudentEvidence, TutorTier, ProgrammingLanguage } from '../types';
import { Send, Sparkles, Layers, ShieldCheck, HelpCircle, Bot, User, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

interface AITutorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, actionType: 'ASK_QUESTION' | 'SUBMIT_EVIDENCE' | 'REQUEST_NEXT_HINT' | 'REVIEW_PREVIOUS_HINT', evidenceToSubmit?: StudentEvidence | null) => void;
  isLoading: boolean;
  problem: Problem;
  currentTier: TutorTier;
  highestUnlockedTier: TutorTier;
  studentEvidence: StudentEvidence | null;
  language: ProgrammingLanguage;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  currentTier,
  highestUnlockedTier,
  studentEvidence,
}) => {
  const [inputText, setInputText] = useState('');
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const action = studentEvidence ? 'SUBMIT_EVIDENCE' : 'ASK_QUESTION';
    onSendMessage(inputText.trim(), action, studentEvidence);
    setInputText('');
  };

  const handleActionClick = (actionType: 'ASK_QUESTION' | 'SUBMIT_EVIDENCE' | 'REQUEST_NEXT_HINT' | 'REVIEW_PREVIOUS_HINT', promptText: string) => {
    if (isLoading) return;
    onSendMessage(promptText, actionType, studentEvidence);
  };

  const toggleVerify = (messageId: string) => {
    setVerifiedMap((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const tierColors = {
    1: 'from-sky-500/20 to-sky-600/10 text-sky-300 border-sky-500/30',
    2: 'from-amber-500/20 to-amber-600/10 text-amber-300 border-amber-500/30',
    3: 'from-indigo-500/20 to-indigo-600/10 text-indigo-300 border-indigo-500/30',
    4: 'from-emerald-500/20 to-emerald-600/10 text-emerald-300 border-emerald-500/30',
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full min-h-[580px]">
      {/* Tutor Header */}
      <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Trợ Lý Sư Phạm Socratic
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Chuẩn 13 Quy Tắc
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Giàn giáo 4 tầng • Kiểm soát hành động từ server
            </p>
          </div>
        </div>

        {/* Current Tier & Highest Unlocked Indicator */}
        <div className={`px-2.5 py-1 rounded-lg border bg-gradient-to-r ${tierColors[currentTier]} flex items-center gap-1.5 text-xs font-bold`}>
          <Layers className="w-3.5 h-3.5" />
          <span>Tầng {currentTier} (Cao nhất mở: Tầng {highestUnlockedTier})</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isTutor = msg.role === 'assistant';
          const isVerified = verifiedMap[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isTutor ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow ${
                  isTutor
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                {isTutor ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  isTutor
                    ? 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-md'
                    : 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                }`}
              >
                {/* Tutor Tag */}
                {isTutor && (
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800/80 text-[10px]">
                    <span className="font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" /> Trợ lý Sư phạm THCS
                    </span>
                    <span className="text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="whitespace-pre-line text-xs font-normal space-y-2">
                  {msg.content}
                </div>

                {/* Structured unlock / evaluation feedback if present */}
                {isTutor && msg.structuredData?.unlockReason && (
                  <div className="mt-2 p-2 bg-slate-900/90 border border-slate-800 rounded text-[11px] text-slate-300">
                    <span className="font-semibold text-emerald-400 block mb-0.5">Trạng thái giàn giáo:</span>
                    <span>{msg.structuredData.unlockReason}</span>
                  </div>
                )}

                {/* AI Verification Pill (Rule 13: Học sinh kiểm chứng AI) */}
                {isTutor && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 italic text-[10px]">
                      Kiểm chứng: Em đã chạy thử để kiểm tra gợi ý này chưa?
                    </span>
                    <button
                      onClick={() => toggleVerify(msg.id)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                        isVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isVerified ? 'Đã kiểm chứng trên máy' : 'Đánh dấu đã kiểm chứng'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Trợ lý đang kiểm tra bằng chứng và đánh giá tiến trình...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Pedagogical Action Buttons (Rule II: Action-based API) */}
      <div className="bg-slate-950/80 px-3 py-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-semibold flex items-center gap-1 flex-shrink-0">
          <HelpCircle className="w-3 h-3" /> Hành động:
        </span>

        <button
          onClick={() => handleActionClick('SUBMIT_EVIDENCE', 'Em đã chuẩn bị nỗ lực mới, nhờ trợ lý kiểm tra và hướng dẫn.')}
          className="bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <CheckCircle2 className="w-3 h-3" /> Em đã thử
        </button>

        <button
          onClick={() => handleActionClick('REQUEST_NEXT_HINT', 'Em xin xét mở Tầng tiếp theo để nhận gợi ý sâu hơn.')}
          className="bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-700/50 px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <ArrowRight className="w-3 h-3" /> Em cần gợi ý tiếp
        </button>

        <button
          onClick={() => handleActionClick('ASK_QUESTION', 'Em gặp thông báo lỗi hoặc khúc mắc cần trợ lý chỉ giúp vùng nghi vấn.')}
          className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50 px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3" /> Hỏi trợ lý về lỗi
        </button>

        <button
          onClick={() => handleActionClick('REVIEW_PREVIOUS_HINT', 'Em xin xem lại gợi ý của tầng hiện tại để củng cố kiến thức.')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Xem lại gợi ý trước
        </button>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            studentEvidence
              ? 'Nhập câu hỏi hoặc chia sẻ khúc mắc của em với trợ lý...'
              : 'Hãy chia sẻ ý tưởng hoặc câu hỏi của em để nhận gợi ý 4 tầng...'
          }
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Gửi</span>
        </button>
      </form>
    </div>
  );
};
