import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, ArrowRight, Check, Eye, X } from 'lucide-react';
import { INITIAL_RECOMMENDATIONS } from './candidateRecommendationsData';
import CandidateRecommendationsModal from './CandidateRecommendationsModal';

export default function CandidateRecommendationsCard({ 
  onViewProfile, 
  onManageSourcing, 
  onReviewAll 
}) {
  const [candidates, setCandidates] = useState(INITIAL_RECOMMENDATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    // Keep candidates in sync with INITIAL_RECOMMENDATIONS if Vite HMR preserved older state
    setCandidates(prev => 
      INITIAL_RECOMMENDATIONS.map(initial => {
        const existing = prev.find(p => p.id === initial.id);
        return existing ? { ...initial, status: existing.status } : initial;
      })
    );
  }, []);

  const handleAction = (id, newStatus) => {
    setCandidates(prev => 
      prev.map(c => c.id === id ? { ...c, status: c.status === newStatus ? null : newStatus } : c)
    );
  };

  const handleReviewClick = () => {
    setIsModalOpen(true);
    if (onReviewAll) {
      onReviewAll();
    }
  };

  const displayedCandidates = candidates.slice(0, 3);

  return (
    <>
      <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all duration-200">

        {/* 1. Card Header: Icon + Title + Subtitle + Pill */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] flex items-center justify-center border border-blue-100/60 dark:border-blue-800/40 shrink-0 shadow-2xs">
              <Sparkles size={17} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-none uppercase tracking-wide">
                CANDIDATE RECOMMENDATIONS
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mt-1">
                Potential matches found for this job.
              </p>
            </div>
          </div>

          {/* 12 new Pill - clickable to open review modal */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-900/20 text-[#1890FF] hover:bg-blue-100/60 dark:hover:bg-blue-900/40 text-xs font-bold px-3 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
            title="View all 12 recommendations"
          >
            12 new
          </button>
        </div>

        {/* 3. Candidate Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800 mt-2">
          {displayedCandidates.map((candidate) => {
            const sourceName = candidate.source || INITIAL_RECOMMENDATIONS.find(c => c.id === candidate.id)?.source || 'Direct';
            return (
            <div 
              key={candidate.id}
              className={`py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-opacity ${
                candidate.status === 'passed' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* Left: Avatar + Details */}
              <div className="min-w-0 flex-1">
                {/* Avatar + Candidate Name + Source + Status Badge */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-800/40">
                    {candidate.initials}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#212b36] dark:text-white leading-none">
                      {candidate.name}
                    </span>
                    {sourceName && (
                      <>
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-normal select-none">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none whitespace-nowrap">
                          Source : <span className="text-gray-800 dark:text-gray-200 font-semibold">{sourceName}</span>
                        </span>
                      </>
                    )}
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
                </div>

                {/* Role and Skills Pills underneath, aligned with name text */}
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
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => onViewProfile && onViewProfile(candidate)}
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-gray-500 dark:text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-2xs flex items-center justify-center cursor-pointer shrink-0"
                    title="Profile View"
                    aria-label="Profile View"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(candidate.id, 'passed')}
                    className={`w-7 h-7 rounded-lg border transition-colors shadow-2xs flex items-center justify-center cursor-pointer shrink-0 ${
                      candidate.status === 'passed'
                        ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-400'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200'
                    }`}
                    title={candidate.status === 'passed' ? 'Undo pass' : 'Pass'}
                    aria-label="Pass"
                  >
                    <X size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(candidate.id, 'interested')}
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
            );
          })}
        </div>

        {/* 4. Card Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => onManageSourcing && onManageSourcing()}
              className="px-3.5 py-2 rounded-xl border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-[#161c24] text-xs font-bold text-[#212b36] dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Manage sourcing</span>
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium ml-3">
              3 of {candidates.length} shown
            </span>
          </div>

          <button
            type="button"
            onClick={handleReviewClick}
            className="px-4 py-2 rounded-xl bg-[#161c24] dark:bg-white text-white dark:text-[#161c24] text-xs sm:text-[13px] font-bold hover:bg-black dark:hover:bg-gray-100 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Review {candidates.length} recommendations</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* 5. Modal with all 12 recommendations */}
      <CandidateRecommendationsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidates={candidates}
        onAction={handleAction}
        onViewProfile={onViewProfile}
      />
    </>
  );
}
