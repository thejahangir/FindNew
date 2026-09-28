import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, User, Calendar, Briefcase, MessageSquare, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel({ isOpen, onClose, notifications }) {
  const navigate = useNavigate();

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleViewMore = () => {
    onClose();
    navigate('/dashboard/notifications');
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'candidate': return <User size={18} className="text-[#1890FF]" />;
      case 'interview': return <Calendar size={18} className="text-[#FFC107]" />;
      case 'job': return <Briefcase size={18} className="text-[#00A76F]" />;
      case 'message': return <MessageSquare size={18} className="text-[#8E33FF]" />;
      case 'report': return <FileText size={18} className="text-[#FF5630]" />;
      default: return <Bell size={18} className="text-black" />;
    }
  };

  const getIconBgForType = (type) => {
    switch (type) {
      case 'candidate': return 'bg-[#1890FF]/10';
      case 'interview': return 'bg-[#FFC107]/10';
      case 'job': return 'bg-[#00A76F]/10';
      case 'message': return 'bg-[#8E33FF]/10';
      case 'report': return 'bg-[#FF5630]/10';
      default: return 'bg-gray-100';
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white dark:bg-[#161c24] shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
            Notifications
            <span className="bg-[#FF5630] text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {notifications.filter(n => !n.isRead).length} new
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.slice(0, 5).map(notification => (
                <div key={notification.id} className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBgForType(notification.type)}`}>
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${notification.isRead ? 'text-[#212b36] dark:text-white ' : 'text-[#212b36] dark:text-white font-bold'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-black dark:text-white line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-[11px] text-[#919eab] dark:text-white mt-1.5 font-medium">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#00A76F] mt-1.5 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-black dark:text-white ">
              <Bell size={48} className="text-gray-200 dark:text-gray-800 mb-4" />
              <p>You have no notifications.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 shrink-0">
          <button 
            onClick={handleViewMore}
            className="w-full py-2.5 px-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-[#212b36] dark:text-white text-sm font-bold rounded-lg transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            View More
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
