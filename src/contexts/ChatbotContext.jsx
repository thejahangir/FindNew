import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatbotContext = createContext();

export function ChatbotProvider({ children }) {
  const [isChatbotCollapsed, setIsChatbotCollapsed] = useState(true);
  const [chatbotWidth, setChatbotWidth] = useState(320); // DEFAULT_CHATBOT_WIDTH
  const [isChatbotResizing, setIsChatbotResizing] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hi! I can help you analyze your hiring pipeline, find jobs, compare candidates, or summarize evaluations.'
    },
    {
      id: 2,
      sender: 'user',
      text: 'Which jobs need attention today?'
    },
    {
      id: 3,
      sender: 'ai',
      text: 'Three areas need attention:\n• Product Design Lead - still in Draft\n• Backend Developer - no candidates yet\n• Data Engineer - 12 active candidates'
    }
  ]);

  const compareCandidates = (candidates) => {
    if (!candidates || candidates.length === 0) return;
    setIsChatbotCollapsed(false);
    setChatbotWidth(prev => Math.max(prev, 460));

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: `Compare candidates: ${candidates.map(c => c.name).join(', ')}`
    };

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      type: 'comparison',
      candidates: candidates,
      summary: `Here is the AI comparative breakdown for ${candidates.length} candidate${candidates.length > 1 ? 's' : ''}:`,
      analysis: candidates.map(c => {
        const numScore = parseFloat(String(c.score).replace('/10', '')) || 7.5;
        return {
          id: c.id,
          name: c.name,
          score: c.score || '7.5',
          numScore,
          stage: c.stage || 'Applied',
          agency: c.agency || 'Direct Application',
          strengths: numScore >= 8.5
            ? 'Exceptional architecture proficiency, strong React/Node.js mastery, clear technical leadership track record.'
            : numScore >= 6.0
            ? 'Solid domain skills, strong delivery velocity; expanding people leadership and enterprise-scale experience.'
            : 'Adequate fundamentals; domain background may require additional ramp-up time.',
          verdict: numScore >= 8.5 ? 'Top Recommendation' : numScore >= 6.0 ? 'Strong Contender' : 'Moderate Fit'
        };
      })
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    };
    
    // Quick automated AI reply
    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: `Thanks for asking about "${text.trim()}". I am analyzing your pipeline data to provide real-time suggestions.`
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isChatbotResizing || isChatbotCollapsed) return;
      const newWidth = document.documentElement.clientWidth - e.clientX;
      setChatbotWidth(Math.max(280, Math.min(newWidth, 640)));
    };

    const handleMouseUp = () => {
      if (isChatbotResizing) {
        setIsChatbotResizing(false);
      }
    };

    if (isChatbotResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isChatbotResizing, isChatbotCollapsed]);

  const value = {
    isChatbotCollapsed,
    setIsChatbotCollapsed,
    chatbotWidth,
    setChatbotWidth,
    isChatbotResizing,
    setIsChatbotResizing,
    DEFAULT_CHATBOT_WIDTH: 320,
    messages,
    setMessages,
    sendMessage,
    compareCandidates
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
