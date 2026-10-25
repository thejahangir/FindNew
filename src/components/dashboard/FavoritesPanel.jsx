import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Star, 
  Briefcase, 
  User, 
  FileCheck,
  ArrowUpRight, 
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStoredFavorites, saveStoredFavorites } from '../../data/favoritesData';

const CATEGORIES = [
  { id: 'Job', label: 'Jobs', path: '/dashboard/jobs' },
  { id: 'Candidate', label: 'Candidate', path: '/dashboard/candidates' },
  { id: 'Application', label: 'Application', path: '/dashboard/applications' },
];

export default function FavoritesPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Job');
  const [favorites, setFavorites] = useState(() => getStoredFavorites());

  // Keep synced with localStorage & custom events
  useEffect(() => {
    setFavorites(getStoredFavorites());
    const handleUpdate = () => {
      setFavorites(getStoredFavorites());
    };
    window.addEventListener('favorites-updated', handleUpdate);
    return () => window.removeEventListener('favorites-updated', handleUpdate);
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

  const handleRemove = (id, e) => {
    e.stopPropagation();
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    saveStoredFavorites(updated);
  };

  const handleNavigate = (path) => {
    onClose();
    if (path) {
      navigate(path);
    }
  };

  const activeCat = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
  const filteredItems = favorites.filter(f => f.type === selectedCategory);

  const handleViewMore = () => {
    onClose();
    navigate(`${activeCat.path}?view=favorites`);
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
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Side Panel Sliding From Right */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white dark:bg-[#161c24] shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col font-sans ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
              <Star size={18} className="fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Favorites
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
                  {favorites.length}
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">Quick-access pinned items</p>
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
            const count = favorites.filter(f => f.type === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25 ring-2 ring-amber-500/20'
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

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => {
              const Icon = getItemIcon(item.type);
              return (
                <div 
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className="p-3.5 bg-gray-50/70 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-[#1E293B] border border-gray-200/80 dark:border-gray-800 rounded-2xl transition-all cursor-pointer group shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                          {item.title}
                        </h4>
                        {item.meta && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {item.meta}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            {activeCat.label}
                          </span>
                          {item.tag && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
                              {item.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => handleRemove(item.id, e)}
                      className="cursor-pointer text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-lg transition-colors shrink-0"
                      title="Remove from favorites"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
              <Star size={44} className="text-gray-200 dark:text-gray-800 mb-3" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                No favorite {activeCat.label.toLowerCase()} found
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Click the Star icon on any {activeCat.label.toLowerCase()} item to save it for quick access here.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Category CTA Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/60 shrink-0 bg-gray-50/50 dark:bg-gray-800/30">
          <button 
            type="button"
            onClick={handleViewMore}
            className="cursor-pointer w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 group"
          >
            <span>View more Favorite for &apos;{activeCat.label}&apos;</span>
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </>,
    document.body
  );
}
