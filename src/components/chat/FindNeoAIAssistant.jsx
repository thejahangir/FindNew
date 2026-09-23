import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeft, ChevronsRight, GripVertical, Send, Sparkles, Award, ArrowRight } from 'lucide-react';
import findNewIco from "../../assets/findnew-ico.png";
import { useChatbot } from '../../contexts/ChatbotContext';

export default function FindNeoAIAssistant() {
  const {
    isChatbotCollapsed,
    setIsChatbotCollapsed,
    chatbotWidth,
    setChatbotWidth,
    isChatbotResizing,
    setIsChatbotResizing,
    DEFAULT_CHATBOT_WIDTH,
    messages,
    sendMessage
  } = useChatbot();

  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (!isChatbotCollapsed && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatbotCollapsed]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setChatbotWidth(DEFAULT_CHATBOT_WIDTH);
          setIsChatbotCollapsed(false);
        }}
        className={`hidden xl:flex fixed right-0 top-16 bottom-0 w-10 z-[100] flex-col items-center justify-center gap-4 bg-[#E6F4FF] dark:bg-[#1C2C47] border border-r-0 border-[#1890FF]/20 dark:border-[#1890FF]/30 shadow-sm rounded-none text-[#1890FF] hover:bg-[#D6EFFF] dark:hover:bg-[#203456] cursor-pointer ${
          isChatbotResizing ? '' : 'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
        } ${isChatbotCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
        aria-label="Expand FindNeo AI"
      >
        <ChevronsLeft size={18} className="shrink-0" />
        <img src={findNewIco} alt="" className="w-6 h-6 object-contain shrink-0" />
        <span className="text-[12px] font-bold tracking-wider uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
          FindNeo AI Assistant
        </span>
      </button>

      <div
        style={{
          width: chatbotWidth,
          transform: isChatbotCollapsed ? 'translateX(100%)' : 'translateX(0)',
          transition: isChatbotResizing ? 'none' : 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)'
        }}
        className={`fixed right-0 top-16 bottom-0 z-[100] hidden xl:flex flex-col bg-white dark:bg-[#161c24] rounded-none border-t border-l border-r xl:border-r-0 border-gray-100 dark:border-gray-800/50 overflow-hidden ${
          chatbotWidth > DEFAULT_CHATBOT_WIDTH && !isChatbotCollapsed ? 'shadow-[-12px_0_32px_rgba(22,28,36,0.12)]' : 'shadow-sm'
        } ${isChatbotResizing ? 'select-none pointer-events-none' : ''} ${isChatbotCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            if (!isChatbotCollapsed) setIsChatbotResizing(true);
          }}
          className={`absolute left-0 top-0 bottom-0 w-4 z-10 flex items-center justify-center cursor-w-resize group ${
            isChatbotResizing ? 'bg-[#1890FF]/15' : 'hover:bg-[#1890FF]/10'
          }`}
          title="Drag left to widen"
        >
          <span
            className={`flex items-center justify-center w-[18px] h-11 rounded-full border shadow-sm transition-colors ${
              isChatbotResizing
                ? 'bg-[#1890FF] border-[#1890FF] text-white'
                : 'bg-white dark:bg-[#161c24] border-gray-200 dark:border-gray-600 text-[#454f5b] dark:text-gray-300 group-hover:border-[#1890FF] group-hover:text-[#1890FF]'
            }`}
          >
            <GripVertical size={14} />
          </span>
        </div>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-3 bg-gray-50 dark:bg-gray-800/20">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
            <img src={findNewIco} alt="FindNew AI" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 min-w-0"><h3 className="text-sm font-bold text-[#212b36] dark:text-white">FindNeo AI</h3><p className="text-[11px] text-gray-500">Always here to help</p></div>
          <button
            type="button"
            onClick={() => setIsChatbotCollapsed(true)}
            className="p-1.5 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Collapse FindNew AI"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex flex-col gap-1 items-end ml-auto max-w-[88%]">
                  <div className="bg-[#1890FF] text-white px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-[13px] font-medium shadow-sm leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (msg.type === 'comparison') {
              return (
                <div key={msg.id} className="flex flex-col gap-2 items-start w-full">
                  <div className="w-full bg-white dark:bg-[#1E2732] border border-[#1890FF]/30 rounded-2xl p-4 shadow-sm space-y-3.5">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-700/60">
                      <div className="w-6 h-6 rounded-lg bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                        <Sparkles size={14} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">Candidate AI Comparison</h4>
                        <p className="text-[10px] text-gray-400">{msg.candidates?.length} candidates analyzed side-by-side</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300">{msg.summary}</p>

                    <div className="space-y-3">
                      {msg.analysis?.map((cand, idx) => (
                        <div key={cand.id || idx} className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">{cand.name}</span>
                              <span className="text-[11px] text-gray-400">({cand.agency})</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="px-2 py-0.5 rounded-full bg-[#1890FF] text-white text-[11px] font-bold">
                                {cand.score}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="font-semibold text-gray-400">Verdict:</span>
                            <span className={`font-bold px-2 py-0.5 rounded ${
                              cand.numScore >= 8.5 
                                ? 'bg-[#00A76F]/10 text-[#00A76F]' 
                                : cand.numScore >= 6.0 
                                ? 'bg-[#1890FF]/10 text-[#1890FF]' 
                                : 'bg-[#FFAB00]/10 text-[#FFAB00]'
                            }`}>
                              {cand.verdict}
                            </span>
                            <span className="text-gray-400">• Stage: {cand.stage}</span>
                          </div>

                          <div className="text-[12px] leading-relaxed text-[#454f5b] dark:text-gray-300 bg-white dark:bg-[#161c24] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                            <span className="font-semibold text-[#212b36] dark:text-white">AI Analysis: </span>
                            {cand.strengths}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Live AI Model Evaluation</span>
                      <span className="text-[#1890FF] font-medium flex items-center gap-1">Confidence: 98%</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex flex-col gap-1 items-start max-w-[90%]">
                <div className="bg-gray-100 dark:bg-gray-800 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-4">
            <p className="text-[11px] font-bold text-gray-400 mb-2">Suggested Inquiries</p>
            <div className="space-y-2">
              {["Who is the top candidate overall?", "Compare React proficiency", "Summarize interview feedback"].map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-[12px] font-medium text-[#212b36] dark:text-white transition-colors cursor-pointer shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div ref={chatBottomRef} />
        </div>
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24]">
          <div className="relative">
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask me anything..." 
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-[#212b36] dark:text-white"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg cursor-pointer">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

