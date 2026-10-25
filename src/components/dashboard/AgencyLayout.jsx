import React, { useState } from 'react';
import AgencyNavbar from './AgencyNavbar';
import AgencySidebar from './AgencySidebar';
import { useTheme } from '../../contexts/ThemeContext';
import FindNeoAIAssistant from '../chat/FindNeoAIAssistant';
import { useChatbot } from '../../contexts/ChatbotContext';

export default function AgencyLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme } = useTheme();
  const { isChatbotCollapsed, chatbotWidth, isChatbotResizing } = useChatbot();
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 overflow-x-clip ${theme === 'dark' ? 'dark bg-[#0f141a]' : 'bg-[#E5E7EB]'}`}>
      <AgencyNavbar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16 overflow-x-clip max-w-full">
        <AgencySidebar isSidebarCollapsed={isSidebarCollapsed} />
        
        <main 
          className={`flex-1 min-w-0 max-w-full overflow-x-clip transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
          style={{ 
            paddingRight: !isChatbotCollapsed ? `calc(0.5rem + ${chatbotWidth}px)` : 'calc(0.5rem + 40px)',
            transition: isChatbotResizing ? 'none' : 'padding-right 300ms cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {children}
        </main>
        
        <FindNeoAIAssistant />
      </div>
    </div>
  );
}
