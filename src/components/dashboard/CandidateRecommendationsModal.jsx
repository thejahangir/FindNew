import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Check } from 'lucide-react';

export default function CandidateRecommendationsModal({
  open,
  onClose,
  candidates = [],
  onAction,
  onViewProfile
}) {
  // Keyboard shortcut (Escape) & body scroll lock
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  // Counts for footer summary
  const stats = useMemo(() => {
    const interested = candidates.filter(c => c.status === 'interested').length;
    const passed = candidates.filter(c => c.status === 'passed').length;
    const pending = candidates.filter(c => !c.status).length;
    return { interested, passed, pending, total: candidates.length };
  }, [candidates]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] flex items-center justify-center border border-blue-100/60 dark:border-blue-800/40 shrink-0 shadow-2xs">
                <Sparkles size={17} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-none uppercase tracking-wide">
                CANDIDATE RECOMMENDATIONS
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-900/20 text-[#1890FF] text-xs font-bold px-3 py-1 rounded-full shrink-0">
                {candidates.length} new
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Subtitle below the title */}
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium pl-12 mt-1">
            Potential matches found for this job.
          </p>
        </div>

        {/* Modal Scrollable Candidate List */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-1 divide-y divide-gray-100 dark:divide-gray-800 custom-scrollbar">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-opacity ${
                candidate.status === 'passed' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* Left: Avatar + Details */}
              <div className="min-w-0 flex-1">
                {/* Avatar + Candidate Name: center-aligned with each other */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-800/40">
                    {candidate.initials}
                  </div>
                  <span className="text-sm font-bold text-[#212b36] dark:text-white leading-none">
                    {candidate.name}
                  </span>
                  {candidate.status === 'interested' && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-900/40 leading-none">
                      <Check size={10} strokeWidth={3} /> Interested
                    </span>
                  )}
                  {candidate.status === 'passed' && (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.2 rounded-full leading-none">
                      Passed
                    </span>
                  )}
                </div>

                {/* Role and Skills Pills underneath, aligned with name text (just designation and experience) */}
                <div className="pl-[42px] mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    {candidate.role}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {candidate.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-1.5 py-0.5 rounded leading-none"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Match Score + Action Buttons */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end md:self-center">
                {/* Profile Match Score */}
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium block leading-none">
                    Profile match
                  </span>
                  <div className="mt-1 leading-none">
                    <span className="text-base font-extrabold text-[#212b36] dark:text-white">
                      {candidate.matchScore}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-0.5">
                      / 10
                    </span>
                  </div>
                </div>

                {/* Action Buttons: content-fitting width */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewProfile && onViewProfile(candidate)}
                    className="h-7 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-[11px] font-bold text-[#212b36] dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-2xs flex items-center justify-center cursor-pointer whitespace-nowrap"
                  >
                    Profile View
                  </button>

                  <button
                    type="button"
                    onClick={() => onAction && onAction(candidate.id, 'passed')}
                    className={`h-7 px-3 rounded-lg border text-[11px] font-bold transition-colors shadow-2xs flex items-center justify-center cursor-pointer whitespace-nowrap ${
                      candidate.status === 'passed'
                        ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-500'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200'
                    }`}
                  >
                    Pass
                  </button>

                  <button
                    type="button"
                    onClick={() => onAction && onAction(candidate.id, 'interested')}
                    className={`h-7 px-3 rounded-lg text-[11px] font-bold transition-all shadow-2xs flex items-center justify-center cursor-pointer whitespace-nowrap ${
                      candidate.status === 'interested'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-[#1890FF] hover:bg-[#0077e6] active:scale-98 text-white'
                    }`}
                  >
                    {candidate.status === 'interested' ? 'Interested ✓' : 'Yes Interested'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong className="text-[#212b36] dark:text-white">{stats.interested}</strong> interested
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <strong className="text-[#212b36] dark:text-white">{stats.passed}</strong> passed
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1890FF]" />
              <strong className="text-[#212b36] dark:text-white">{stats.pending}</strong> pending review
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#161c24] dark:bg-white text-white dark:text-[#161c24] text-xs font-bold hover:bg-black dark:hover:bg-gray-100 transition-colors shadow-xs cursor-pointer"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
