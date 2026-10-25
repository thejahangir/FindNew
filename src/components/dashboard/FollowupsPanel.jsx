import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ArrowUpRight,
  Briefcase,
  User,
  FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getStoredFollowups, 
  toggleFollowupStatus, 
  deleteFollowup
} from '../../data/followupsData';

const CATEGORIES = [
  { id: 'Job', label: 'Jobs', path: '/dashboard/jobs' },
  { id: 'Candidate', label: 'Candidate', path: '/dashboard/candidates' },
  { id: 'Application', label: 'Application', path: '/dashboard/applications' },
];

export default function FollowupsPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Job');
  const [followups, setFollowups] = useState(() => getStoredFollowups());

  // Keep synced with localStorage & custom events
  useEffect(() => {
    setFollowups(getStoredFollowups());
    const handleUpdate = () => {
      setFollowups(getStoredFollowups());
    };
    window.addEventListener('followups-updated', handleUpdate);
    return () => window.removeEventListener('followups-updated', handleUpdate);
  }, [isOpen]);

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

  const toggleStatus = (id) => {
    const updated = toggleFollowupStatus(id);
    setFollowups(updated);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = deleteFollowup(id);
    setFollowups(updated);
  };

  const activeCat = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
  const filteredTasks = followups.filter(f => f.type === selectedCategory);
  const pendingCount = followups.filter(f => !f.isDone).length;

  const handleViewMore = () => {
    onClose();
    navigate(`${activeCat.path}?view=followups`);
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'Job': return Briefcase;
      case 'Candidate': return User;
      case 'Application': return FileCheck;
      default: return Briefcase;
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity duration-300 z-[9999] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-over Drawer (From the Right) */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white dark:bg-[#161c24] shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-800 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Panel Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] flex items-center justify-center">
              <CalendarClock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Follow Ups</h3>
                {pendingCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1890FF] text-white">
                    {pendingCount} pending
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled reminders and priority action items</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Three Compact Category Pills */}
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-2 shrink-0 bg-gray-50/30 dark:bg-gray-900/20">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count = followups.filter(f => f.type === cat.id && !f.isDone).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1890FF] text-white shadow-sm shadow-[#1890FF]/25 ring-2 ring-[#1890FF]/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected 
                    ? 'bg-white/25 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-bar: Category Summary */}
        <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between shrink-0 text-xs text-gray-500">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            {activeCat.label} Reminders ({filteredTasks.length})
          </span>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => {
              return (
                <div 
                  key={task.id}
                  className={`p-3.5 bg-gray-50/70 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-[#1E293B] border border-gray-200/80 dark:border-gray-800 rounded-2xl transition-all shadow-2xs hover:shadow-sm ${
                    task.isDone ? 'opacity-50 bg-gray-100/50 dark:bg-gray-800/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    {/* Left: Content (no square checkbox button) */}
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate ${
                        task.isDone ? 'line-through text-gray-400 dark:text-gray-500' : ''
                      }`}>
                        {task.title}
                      </h4>
                      {task.subject && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {task.subject}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                          <Clock size={11} className="text-gray-400" />
                          {task.due}
                        </span>
                        {task.priority === 'Urgent' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30">
                            Urgent
                          </span>
                        )}
                        {task.priority === 'High' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Sole Mark as Completed button + Delete button */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleStatus(task.id)}
                        className={`cursor-pointer p-1 rounded-lg transition-colors ${
                          task.isDone
                            ? 'text-[#1890FF] bg-blue-50 dark:bg-blue-900/30'
                            : 'text-gray-400 hover:text-[#1890FF] hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                        title={task.isDone ? "Mark as pending" : "Mark as completed"}
                        aria-label={task.isDone ? "Mark as pending" : "Mark as completed"}
                      >
                        <CheckCircle2 size={16} className={task.isDone ? 'fill-[#1890FF]/20 text-[#1890FF]' : ''} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(task.id, e)}
                        className="cursor-pointer text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-lg transition-colors"
                        title="Delete reminder"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
              <CalendarClock size={44} className="text-gray-200 dark:text-gray-800 mb-3" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                All caught up on {activeCat.label.toLowerCase()}!
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                No follow-up reminders for this category. Use the Follow Up icon on any {activeCat.label.toLowerCase()} to add reminders.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Category CTA Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/60 shrink-0 bg-gray-50/50 dark:bg-gray-800/30">
          <button 
            type="button"
            onClick={handleViewMore}
            className="cursor-pointer w-full py-2.5 px-4 bg-[#1890FF] hover:bg-[#096dd9] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-[#1890FF]/25 flex items-center justify-center gap-2 group"
          >
            <span>View more Follow Up for &apos;{activeCat.label}&apos;</span>
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </>,
    document.body
  );
}
