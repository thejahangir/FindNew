import React, { useState } from 'react';
import { HelpCircle, Bell, Menu, Sun, Moon, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import FindNewLogo from '../../assets/findnew-logo.png';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationPanel from './NotificationPanel';
import { mockNotifications } from '../../data/mockNotifications';

export default function AgencyNavbar({ isSidebarCollapsed, toggleSidebar }) {
 const location = useLocation();
 const currentPath = location.pathname;
 const [isNotificationOpen, setIsNotificationOpen] = useState(false);
 const [notifications] = useState(mockNotifications);
 const { theme, toggleTheme } = useTheme();

 const navLinks = [
 { name: 'Job', path: '/dashboard/job' },
 { name: 'Candidate Reports', path: '/dashboard/candidate-reports' },
 { name: 'Integrations', path: '/dashboard/integrations' }
 ];

 const unreadCount = notifications.filter(n => !n.isRead).length;

 return (
 <>
 <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#161c24] border-b border-gray-200 dark:border-gray-800/50 z-40 flex items-center justify-between pr-6 transition-colors duration-300">
 <div className="flex items-center h-full">
 {/* Left container matches sidebar width perfectly, pushing links to align with workspace body */}
 <div className={`flex items-center px-4 transition-all duration-300 h-full border-r border-transparent ${isSidebarCollapsed ? 'w-20 justify-center' : 'w-64 justify-between'}`}>
 {!isSidebarCollapsed && (
 <Link to="/" className="flex items-center">
 <img src={FindNewLogo} alt="FindNew Logo" className="h-8 object-contain" />
 </Link>
 )}
 <button 
 onClick={toggleSidebar}
 className="p-2 text-gray-500 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors flex-shrink-0"
 >
 <Menu size={20} />
 </button>
 </div>
 
 <div className="hidden md:flex items-center gap-2 ml-6 h-full">
 {navLinks.map((link) => {
 const isActive = currentPath.includes(link.path);
 return (
 <Link 
 key={link.name} 
 to={link.path}
 className={`relative flex items-center h-full px-3 text-sm font-medium transition-colors group cursor-pointer ${
 isActive ? 'text-[#1890FF]' : 'text-black dark:text-white hover:text-[#1890FF] dark:hover:text-[#1890FF]'
 }`}
 >
 {link.name}
 {/* Animated Underline */}
 <span 
 className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#1890FF] rounded-t-sm transform origin-left transition-transform duration-300 ease-out ${
 isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
 }`}
 />
 </Link>
 );
 })}
 </div>
 </div>

 {/* Search Bar */}
 <div className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-8">
 <div className="relative w-full">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
 <input 
 type="text" 
 placeholder="Search candidates, jobs, or agencies..." 
 className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#161c24] border border-gray-200 dark:border-gray-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all text-[#212b36] dark:text-white"
 />
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button 
 onClick={toggleTheme}
 className="p-2 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full transition-colors cursor-pointer"
 title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
 >
 {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
 </button>
 <button className="p-2 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full transition-colors cursor-pointer">
 <HelpCircle size={20} />
 </button>
 <button 
 onClick={() => setIsNotificationOpen(true)}
 className="relative p-2 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full transition-colors cursor-pointer"
 >
 <Bell size={20} />
 {unreadCount > 0 && (
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5630] rounded-full border border-white dark:border-[#161c24]"></span>
 )}
 </button>
 </div>
 </nav>

 <NotificationPanel 
 isOpen={isNotificationOpen} 
 onClose={() => setIsNotificationOpen(false)} 
 notifications={notifications}
 />
 </>
 );
}
