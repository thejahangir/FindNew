import React, { useState } from 'react';
import AgencyNavbar from './AgencyNavbar';
import AgencySidebar from './AgencySidebar';
import { useTheme } from '../../contexts/ThemeContext';

export default function AgencyLayout({ children }) {
 const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
 const { theme } = useTheme();
 
 const toggleSidebar = () => {
 setIsSidebarCollapsed(!isSidebarCollapsed);
 };

 return (
 <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#161c24]' : 'bg-gray-100'}`}>
 <AgencyNavbar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
 
 <div className="flex flex-1 pt-16">
 <AgencySidebar isSidebarCollapsed={isSidebarCollapsed} />
 
 <main className={`flex-1 overflow-y-auto pt-[2px] pl-[4px] pr-2 pb-2 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
 {children}
 </main>
 </div>
 </div>
 );
}
