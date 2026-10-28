import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  User, 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  ExternalLink, 
  LifeBuoy, 
  SlidersHorizontal, 
  Palette, 
  Key, 
  LogOut, 
  X, 
  Check, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Monitor, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Upload 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import userAvatar from '../../assets/user-avatar.png';

export default function UserMenu({ isSidebarCollapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'preference' | 'languageTheme' | 'profile' | 'password' | null
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme, setTheme } = useTheme();

  // Profile State
  const [profileData, setProfileData] = useState({
    name: 'Corporate HR',
    email: 'admin@findnew.com',
    title: 'Director of Talent Acquisition',
    department: 'Human Resources',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA (Hybrid)',
    bio: 'Overseeing corporate recruitment operations, agency partnerships, and talent acquisition pipelines at FindNew.'
  });

  // Personal Preference State
  const [preferences, setPreferences] = useState({
    defaultView: 'Hiring Overview',
    density: 'comfortable',
    timezone: 'IST (UTC+5:30)',
    dateFormat: 'DD/MM/YYYY',
    emailAlerts: true,
    candidateAlerts: true,
    slackSync: false
  });

  // Language & Theme State
  const [selectedAccent, setSelectedAccent] = useState('blue');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Change Password State
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });
  const [showPass, setShowPass] = useState({
    current: false,
    newPass: false,
    confirmPass: false
  });
  const [passwordError, setPasswordError] = useState('');

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    navigate('/auth');
  };

  // Password validation & save
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwords.current) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!passwords.newPass || passwords.newPass.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordError('');
    setPasswords({ current: '', newPass: '', confirmPass: '' });
    setActiveModal(null);
    showToast('Password changed successfully.');
  };

  return (
    <div className="relative border-t border-gray-200 dark:border-gray-800/50 p-4 bg-white dark:bg-[#161c24] shrink-0 transition-colors duration-300" ref={menuRef}>
      
      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute bottom-full mb-2 bg-white dark:bg-[#212b36] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-gray-200/90 dark:border-gray-800 overflow-hidden z-50 animate-fade-in origin-bottom ${
            isSidebarCollapsed ? 'left-2 w-60' : 'left-3 right-3'
          }`}
        >
          {/* Menu Items Container */}
          <div className="p-1.5 space-y-0.5">
            
            {/* 1. Personal Preference */}
            <button 
              onClick={() => {
                setIsOpen(false);
                setActiveModal('preference');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-[#1890FF] dark:hover:text-[#1890FF] rounded-xl transition-colors text-left font-medium cursor-pointer group"
            >
              <SlidersHorizontal size={16} className="text-gray-400 dark:text-gray-400 group-hover:text-[#1890FF] shrink-0 transition-colors" />
              <span className="truncate">Personal Preference</span>
            </button>

            {/* 2. Language & Theme */}
            <button 
              onClick={() => {
                setIsOpen(false);
                setActiveModal('languageTheme');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-[#1890FF] dark:hover:text-[#1890FF] rounded-xl transition-colors text-left font-medium cursor-pointer group"
            >
              <Palette size={16} className="text-gray-400 dark:text-gray-400 group-hover:text-[#1890FF] shrink-0 transition-colors" />
              <span className="truncate">Language & Theme</span>
            </button>

            {/* 3. My Profile */}
            <button 
              onClick={() => {
                setIsOpen(false);
                setActiveModal('profile');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-[#1890FF] dark:hover:text-[#1890FF] rounded-xl transition-colors text-left font-medium cursor-pointer group"
            >
              <User size={16} className="text-gray-400 dark:text-gray-400 group-hover:text-[#1890FF] shrink-0 transition-colors" />
              <span className="truncate">My Profile</span>
            </button>

            {/* 4. Change Password */}
            <button 
              onClick={() => {
                setIsOpen(false);
                setPasswordError('');
                setActiveModal('password');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-[#1890FF] dark:hover:text-[#1890FF] rounded-xl transition-colors text-left font-medium cursor-pointer group"
            >
              <Key size={16} className="text-gray-400 dark:text-gray-400 group-hover:text-[#1890FF] shrink-0 transition-colors" />
              <span className="truncate">Change Password</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-1"></div>

            {/* 5. Help & Support */}
            <button 
              onClick={() => {
                setIsOpen(false);
                setActiveModal('help');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-[#1890FF] dark:hover:text-[#1890FF] rounded-xl transition-colors text-left font-medium cursor-pointer group"
            >
              <HelpCircle size={16} className="text-gray-400 dark:text-gray-400 group-hover:text-[#1890FF] shrink-0 transition-colors" />
              <span className="truncate">Help & Support</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-1"></div>

            {/* 5. Logout */}
            <button 
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors text-left font-semibold cursor-pointer group"
            >
              <LogOut size={16} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
              <span className="truncate">Logout</span>
            </button>

          </div>
        </div>
      )}
      
      {/* Avatar Button Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center p-2 rounded-xl transition-colors cursor-pointer ${
          isOpen ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        } ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
        title={isSidebarCollapsed ? profileData.name : undefined}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <img 
            src={userAvatar} 
            alt={profileData.name} 
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm" 
          />
          {!isSidebarCollapsed && (
            <div className="text-left truncate">
              <p className="text-sm font-semibold text-[#212b36] dark:text-white truncate">{profileData.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profileData.email}</p>
            </div>
          )}
        </div>
      </button>

      {/* ======================================================== */}
      {/* 1. PERSONAL PREFERENCE MODAL                             */}
      {/* ======================================================== */}
      {activeModal === 'preference' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A222C] rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] flex items-center justify-center">
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Personal Preference</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Configure your workspace defaults and notifications</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Default Landing Page */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Default Landing Dashboard
                </label>
                <select 
                  value={preferences.defaultView}
                  onChange={(e) => setPreferences({ ...preferences, defaultView: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                >
                  <option value="Hiring Overview">Hiring Overview</option>
                  <option value="Jobs Dashboard">Jobs Dashboard</option>
                  <option value="Candidates">Candidates</option>
                  <option value="Pipeline">Pipeline</option>
                  <option value="Career Page">Career Page</option>
                </select>
              </div>

              {/* Interface Density */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Interface Display Density
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, density: 'comfortable' })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      preferences.density === 'comfortable'
                        ? 'border-[#1890FF] bg-blue-50/50 dark:bg-blue-900/20 text-[#1890FF]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="block text-xs font-bold">Comfortable</span>
                    <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Spacious spacing for ease of reading</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, density: 'compact' })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      preferences.density === 'compact'
                        ? 'border-[#1890FF] bg-blue-50/50 dark:bg-blue-900/20 text-[#1890FF]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="block text-xs font-bold">Compact</span>
                    <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Dense row height for data heavy pages</span>
                  </button>
                </div>
              </div>

              {/* Timezone & Date Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Preferred Timezone
                  </label>
                  <select 
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  >
                    <option value="IST (UTC+5:30)">IST (UTC+5:30) - Mumbai</option>
                    <option value="EST (UTC-5:00)">EST (UTC-5:00) - New York</option>
                    <option value="PST (UTC-8:00)">PST (UTC-8:00) - San Francisco</option>
                    <option value="GMT (UTC+0:00)">GMT (UTC+0:00) - London</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Date Format
                  </label>
                  <select 
                    value={preferences.dateFormat}
                    onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (25/10/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (10/25/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-25)</option>
                  </select>
                </div>
              </div>

              {/* Notification Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  System Notifications
                </label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={preferences.emailAlerts}
                      onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1890FF] focus:ring-[#1890FF] accent-[#1890FF] cursor-pointer"
                    />
                    <span>Email alerts on urgent candidate updates</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={preferences.candidateAlerts}
                      onChange={(e) => setPreferences({ ...preferences, candidateAlerts: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1890FF] focus:ring-[#1890FF] accent-[#1890FF] cursor-pointer"
                    />
                    <span>Desktop notifications for interview slot confirmations</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={preferences.slackSync}
                      onChange={(e) => setPreferences({ ...preferences, slackSync: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1890FF] focus:ring-[#1890FF] accent-[#1890FF] cursor-pointer"
                    />
                    <span>Automatic sync to corporate Slack channels</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/30">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  showToast('Personal preferences saved successfully.');
                }}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] rounded-xl shadow-md shadow-[#1890FF]/25 transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* 2. LANGUAGE & THEME MODAL                                */}
      {/* ======================================================== */}
      {activeModal === 'languageTheme' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A222C] rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Palette size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Language & Theme</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Personalize display modes, color schemes, and language</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Appearance / Theme */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Appearance Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Light */}
                  <button
                    type="button"
                    onClick={() => setTheme && setTheme('light')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'border-[#1890FF] bg-blue-50/60 text-[#1890FF] shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Sun size={20} />
                    <span className="text-xs font-bold">Light</span>
                  </button>

                  {/* Dark */}
                  <button
                    type="button"
                    onClick={() => setTheme && setTheme('dark')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'border-[#1890FF] bg-blue-900/30 text-[#1890FF] shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Moon size={20} />
                    <span className="text-xs font-bold">Dark</span>
                  </button>

                  {/* System */}
                  <button
                    type="button"
                    onClick={() => toggleTheme()}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:border-gray-300 cursor-pointer transition-all"
                  >
                    <Monitor size={20} />
                    <span className="text-xs font-bold">Toggle</span>
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'blue', color: '#1890FF', name: 'FindNew Blue' },
                    { id: 'emerald', color: '#10B981', name: 'Emerald' },
                    { id: 'violet', color: '#8B5CF6', name: 'Violet' },
                    { id: 'amber', color: '#F59E0B', name: 'Amber' }
                  ].map(acc => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedAccent(acc.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        selectedAccent === acc.id
                          ? 'border-gray-900 dark:border-white shadow-xs'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: acc.color }}></span>
                      <span className="text-gray-800 dark:text-gray-200">{acc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Language */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Display Language
                </label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                  <option value="es-ES">Español (Spanish)</option>
                  <option value="fr-FR">Français (French)</option>
                  <option value="de-DE">Deutsch (German)</option>
                  <option value="hi-IN">हिन्दी (Hindi)</option>
                  <option value="ja-JP">日本語 (Japanese)</option>
                </select>
              </div>

              {/* Base Currency */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Compensation Currency Format
                </label>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/30">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  showToast('Language and theme preferences updated.');
                }}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] rounded-xl shadow-md shadow-[#1890FF]/25 transition-all cursor-pointer"
              >
                Apply & Save
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* 3. MY PROFILE MODAL                                      */}
      {/* ======================================================== */}
      {activeModal === 'profile' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A222C] rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">My Profile</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View and update your corporate account details</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Profile Avatar Row */}
              <div className="flex items-center gap-4 p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                <img 
                  src={userAvatar} 
                  alt={profileData.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md" 
                />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{profileData.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{profileData.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      type="button" 
                      onClick={() => showToast('Avatar updated successfully.')}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#1890FF] bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Upload size={12} />
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Work Email</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                </div>
              </div>

              {/* Title & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Designation</label>
                  <input 
                    type="text" 
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                </div>
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">About Me</label>
                <textarea 
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/30">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  showToast('Profile updated successfully.');
                }}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] rounded-xl shadow-md shadow-[#1890FF]/25 transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* 4. CHANGE PASSWORD MODAL                                 */}
      {/* ======================================================== */}
      {activeModal === 'password' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A222C] rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Change Password</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Update your account login credentials</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
              
              {passwordError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
                  {passwordError}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input 
                    type={showPass.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input 
                    type={showPass.newPass ? "text" : "password"}
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass({ ...showPass, newPass: !showPass.newPass })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showPass.newPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input 
                    type={showPass.confirmPass ? "text" : "password"}
                    value={passwords.confirmPass}
                    onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                    placeholder="Re-type new password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass({ ...showPass, confirmPass: !showPass.confirmPass })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showPass.confirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Security Requirements Checklist */}
              <div className="pt-2 text-[11px] text-gray-500 dark:text-gray-400 space-y-1 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Password Requirements:</span>
                <p className="flex items-center gap-1.5">
                  <Check size={12} className={passwords.newPass.length >= 8 ? "text-emerald-500" : "text-gray-400"} />
                  <span>At least 8 characters in length</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check size={12} className={/[A-Z]/.test(passwords.newPass) && /[a-z]/.test(passwords.newPass) ? "text-emerald-500" : "text-gray-400"} />
                  <span>Mix of uppercase and lowercase letters</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check size={12} className={/[0-9!@#$%^&*]/.test(passwords.newPass) ? "text-emerald-500" : "text-gray-400"} />
                  <span>Includes at least one number or special symbol</span>
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] rounded-xl shadow-md shadow-[#1890FF]/25 transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

            {/* ======================================================== */}
      {/* HELP & SUPPORT MODAL                                     */}
      {/* ======================================================== */}
      {activeModal === 'help' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A222C] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] flex items-center justify-center">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Help & Support</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Resources, documentation, and recruiter assistance</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
              
              {/* Quick Support Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-[#1890FF]/40 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#1890FF] flex items-center justify-center mb-2.5">
                    <BookOpen size={16} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Documentation</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Step-by-step guides on managing jobs, candidates, and hiring workflows.
                  </p>
                  <a 
                    href="#docs" 
                    onClick={(e) => { e.preventDefault(); showToast("Opening Documentation portal..."); }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1890FF] hover:underline mt-2.5 cursor-pointer"
                  >
                    <span>Read Docs</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-[#1890FF]/40 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                    <MessageSquare size={16} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Live Assistance</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Connect directly with our 24/7 dedicated recruiter success specialists.
                  </p>
                  <button 
                    type="button"
                    onClick={() => { setActiveModal(null); showToast("Live Chat initiated. An agent will connect shortly."); }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-2.5 cursor-pointer"
                  >
                    <span>Start Chat</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Direct Contact Info */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                  <LifeBuoy size={15} className="text-[#1890FF]" />
                  <span>Direct Recruiter Helpdesk</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <p className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">support@findnew.com</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Phone Hotline:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">+1 (800) 555-0199 (Mon–Fri)</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Response SLA:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">&lt; 15 minutes</span>
                  </p>
                </div>
              </div>

              {/* FAQ Accordion Summary */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Frequently Asked</h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-0.5">How do favorites and following work?</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Click the Star or Bookmark icon on any job, candidate, or application to follow it. Access all followed items instantly from the top header panels.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-0.5">Need help posting a new job role?</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Navigate to Jobs from the sidebar and use the &ldquo;Post a Job&rdquo; button or contact your account manager.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] rounded-xl shadow-md shadow-[#1890FF]/25 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* 5. LOGOUT CONFIRMATION MODAL                             */}
      {/* ======================================================== */}
      {showLogoutConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A222C] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-6 border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={28} className="text-[#FF5630]" />
            </div>
            <h2 className="text-xl font-bold text-[#212b36] dark:text-white mb-2">Ready to Leave?</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 px-2">
              You are about to log out of your FindNew account. You will need to log back in to access your dashboard.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout} 
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#FF5630] hover:bg-[#FF5630]/90 rounded-xl shadow-md shadow-[#FF5630]/25 transition-all cursor-pointer"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast Feedback */}
      {toastMessage && createPortal(
        <div className="fixed bottom-6 right-6 z-[10000] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-fade-in border border-gray-700 dark:border-gray-200">
          <CheckCircle2 size={18} className="text-[#1890FF]" />
          <span>{toastMessage}</span>
        </div>,
        document.body
      )}

    </div>
  );
}
