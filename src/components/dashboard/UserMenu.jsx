import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userAvatar from '../../assets/user-avatar.png';

export default function UserMenu({ isSidebarCollapsed }) {
 const [isOpen, setIsOpen] = useState(false);
 const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
 const menuRef = useRef(null);
 const navigate = useNavigate();

 useEffect(() => {
 function handleClickOutside(event) {
 if (menuRef.current && !menuRef.current.contains(event.target)) {
 setIsOpen(false);
 }
 }
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const handleLogoutClick = () => {
 setIsOpen(false);
 setShowLogoutConfirm(true);
 };

 const confirmLogout = () => {
 navigate('/auth');
 };

 return (
 <div className="relative border-t border-gray-200 dark:border-gray-800/50 p-4 bg-white dark:bg-[#161c24] shrink-0 transition-colors duration-300" ref={menuRef}>
 {isOpen && (
 <div className={`absolute bottom-full mb-2 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_24px_rgba(149,157,165,0.2)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800/50 overflow-hidden z-50 animate-fade-in origin-bottom ${isSidebarCollapsed ? 'left-4 w-48' : 'left-4 right-4'}`}>
 <div className="p-2">
 <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors text-left font-medium cursor-pointer">
 <User size={16} className="text-black dark:text-white shrink-0" />
 <span className={isSidebarCollapsed ? 'md:hidden lg:inline' : ''}>My Profile</span>
 </button>
 <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors text-left font-medium cursor-pointer">
 <Settings size={16} className="text-black dark:text-white shrink-0" />
 <span className={isSidebarCollapsed ? 'md:hidden lg:inline' : ''}>Settings</span>
 </button>
 <div className="h-px bg-gray-100 dark:bg-gray-800/50 my-1"></div>
 <button 
 onClick={handleLogoutClick}
 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors text-left font-bold cursor-pointer"
 >
 <LogOut size={16} className="shrink-0" />
 <span className={isSidebarCollapsed ? 'md:hidden lg:inline' : ''}>Logout</span>
 </button>
 </div>
 </div>
 )}
 
 <button 
 onClick={() => setIsOpen(!isOpen)}
 className={`w-full flex items-center p-2 rounded-xl transition-colors cursor-pointer ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'} ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
 title={isSidebarCollapsed ? "Corporate HR" : undefined}
 >
 <div className="flex items-center gap-3 overflow-hidden">
 <img src={userAvatar} alt="Corporate HR" className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700" />
 {!isSidebarCollapsed && (
 <div className="text-left truncate">
 <p className="text-sm font-semibold text-[#212b36] dark:text-white truncate">Corporate HR</p>
 <p className="text-xs text-black dark:text-white truncate">admin@findnew.com</p>
 </div>
 )}
 </div>
 </button>

 {/* Logout Confirmation Modal */}
 {showLogoutConfirm && createPortal(
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#212b36] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6 scale-in-center">
 <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
 <LogOut size={28} className="text-[#FF5630]" />
 </div>
 <h2 className="text-xl font-bold text-[#212b36] dark:text-white mb-2">Ready to Leave?</h2>
 <p className="text-sm text-black dark:text-white mb-8 px-2">You are about to log out of your FindNew account. You will need to log back in to access your dashboard.</p>
 <div className="flex items-center gap-3 w-full">
 <button 
 onClick={() => setShowLogoutConfirm(false)} 
 className="flex-1 px-4 py-2.5 text-sm font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={confirmLogout} 
 className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#FF5630] hover:bg-[#FF5630]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
 >
 Logout Now
 </button>
 </div>
 </div>
 </div>,
 document.body
 )}
 </div>
 );
}
