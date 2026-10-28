import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  Star, 
  Bookmark 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FindNewLogo from '../../assets/findnew-logo.png';
import NotificationPanel from './NotificationPanel';
import FavoritesPanel from './FavoritesPanel';
import FollowupsPanel from './FollowupsPanel';
import GlobalSearch from './GlobalSearch';
import { mockNotifications } from '../../data/mockNotifications';
import { getStoredFavorites } from '../../data/favoritesData';
import { getStoredFollowups } from '../../data/followupsData';

export default function AgencyNavbar({ isSidebarCollapsed, toggleSidebar }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isFollowupsOpen, setIsFollowupsOpen] = useState(false);
  const [notifications] = useState(mockNotifications);

  const [favorites, setFavorites] = useState(() => getStoredFavorites());
  const [followups, setFollowups] = useState(() => getStoredFollowups());

  // Listen for storage / custom event updates in real-time
  useEffect(() => {
    const syncFavs = () => setFavorites(getStoredFavorites());
    const syncFollowups = () => setFollowups(getStoredFollowups());

    window.addEventListener('favorites-updated', syncFavs);
    window.addEventListener('followups-updated', syncFollowups);
    return () => {
      window.removeEventListener('favorites-updated', syncFavs);
      window.removeEventListener('followups-updated', syncFollowups);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasFavorites = favorites && favorites.some(f => f.type === 'Job' || f.type === 'Candidate');
  const hasFollowups = followups && followups.some(f => f.type === 'Application');

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
              className="p-2 text-gray-500 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <GlobalSearch />

        {/* Right Action Icons: Favorites, Follow ups, Help, Notifications */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* 1. Favorites Icon Button */}
          <button 
            onClick={() => setIsFavoritesOpen(true)}
            className={`p-2 rounded-full transition-colors cursor-pointer relative ${
              isFavoritesOpen
                ? 'bg-gray-100 dark:bg-gray-800 text-[#212b36] dark:text-white'
                : 'text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            title="Favourites"
          >
            <Star size={19} />
            {hasFavorites && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-white dark:border-[#161c24]"></span>
            )}
          </button>

          {/* 2. Following Icon Button */}
          <button 
            onClick={() => setIsFollowupsOpen(true)}
            className={`p-2 rounded-full transition-colors cursor-pointer relative ${
              isFollowupsOpen
                ? 'bg-gray-100 dark:bg-gray-800 text-[#212b36] dark:text-white'
                : 'text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            title="Following"
          >
            <Bookmark size={19} />
            {hasFollowups && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#1890FF] rounded-full border border-white dark:border-[#161c24]"></span>
            )}
          </button>

          {/* 4. Notifications Icon Button */}
          <button 
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5630] rounded-full border border-white dark:border-[#161c24]"></span>
            )}
          </button>

        </div>
      </nav>

      {/* ======================================================== */}
      {/* SLIDING PANELS (ALL SLIDE IN FROM THE RIGHT)             */}
      {/* ======================================================== */}
      
      {/* Favorites Panel */}
      <FavoritesPanel 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
      />

      {/* Follow ups Panel */}
      <FollowupsPanel 
        isOpen={isFollowupsOpen} 
        onClose={() => setIsFollowupsOpen(false)} 
      />

      {/* Notifications Panel */}
      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
        notifications={notifications}
      />
    </>
  );
}
