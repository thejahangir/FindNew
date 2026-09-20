import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatbotContext = createContext();

export function ChatbotProvider({ children }) {
  const [isChatbotCollapsed, setIsChatbotCollapsed] = useState(true);
  const [chatbotWidth, setChatbotWidth] = useState(320); // DEFAULT_CHATBOT_WIDTH
  const [isChatbotResizing, setIsChatbotResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isChatbotResizing || isChatbotCollapsed) return;
      const newWidth = document.documentElement.clientWidth - e.clientX;
      setChatbotWidth(Math.max(280, Math.min(newWidth, 600)));
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
    DEFAULT_CHATBOT_WIDTH: 320
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
