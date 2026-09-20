import React from 'react';
import { ChevronsLeft, ChevronsRight, GripVertical, Send } from 'lucide-react';
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
    DEFAULT_CHATBOT_WIDTH
  } = useChatbot();

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
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="flex flex-col gap-1 items-start max-w-[85%]">
            <div className="bg-gray-100 dark:bg-gray-800 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white leading-relaxed">
              Hi! I can help you analyze your hiring pipeline, find jobs, or summarize candidates.
            </div>
          </div>
          
          <div className="flex flex-col gap-1 items-end ml-auto max-w-[85%]">
            <div className="bg-[#1890FF] text-white px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-[13px] font-medium shadow-sm">
              Which jobs need attention today?
            </div>
          </div>
          
          <div className="flex flex-col gap-1 items-start max-w-[90%]">
            <div className="bg-gray-100 dark:bg-gray-800 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white leading-relaxed">
              <p className="mb-2">Three areas need attention:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><span className="font-bold">Product Design Lead</span> - still in Draft</li>
                <li><span className="font-bold">Backend Developer</span> - no candidates yet</li>
                <li><span className="font-bold">Data Engineer</span> - 12 active candidates</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-4">
            <p className="text-[11px] font-bold text-gray-400 mb-2 ">Suggested Questions</p>
            <div className="space-y-2">
              {["Who are my top candidates?", "Which jobs are overdue?", "Summarize this week"].map((q, i) => (
                <button key={i} className="w-full text-left px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-[12px] font-medium text-[#212b36] dark:text-white transition-colors cursor-pointer shadow-sm">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24]">
          <div className="relative">
            <input type="text" placeholder="Ask me anything..." className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-[#212b36] dark:text-white"/>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
