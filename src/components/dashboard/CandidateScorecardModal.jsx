import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SCORECARD_DATA_BY_CANDIDATE = {
  'Harper Cole': {
    name: 'Harper Cole',
    role: 'Senior Product Designer',
    stage: 'Technical interview',
    interviewer: 'Mina Shah',
    completedAt: 'Oct 7 · 4:15 PM',
    decision: 'Strong Yes',
    overallScore: '4.7 / 5',
    rubrics: [
      { name: 'Role expertise', score: '4.8 / 5' },
      { name: 'Problem solving', score: '4.6 / 5' },
      { name: 'Communication', score: '4.7 / 5' }
    ],
    feedback: 'The candidate showed strong product judgment, explained trade-offs with clarity, and connected design decisions to measurable user outcomes.'
  },
  'Alex Rivera': {
    name: 'Alex Rivera',
    role: 'Senior UX Designer',
    stage: 'Panel interview',
    interviewer: 'Chris Nguyen',
    completedAt: 'Oct 8 · 2:30 PM',
    decision: 'Pending',
    overallScore: '4.4 / 5',
    rubrics: [
      { name: 'Role expertise', score: '4.5 / 5' },
      { name: 'Problem solving', score: '4.3 / 5' },
      { name: 'Communication', score: '4.4 / 5' }
    ],
    feedback: 'Strong user research fundamentals and systems thinking. Follow-up needed on cross-functional alignment and delivery velocity under tight timelines.'
  },
  'Quinn Davis': {
    name: 'Quinn Davis',
    role: 'Product Design Lead',
    stage: 'HR interview',
    interviewer: 'Taylor Brooks',
    completedAt: 'Oct 9 · 11:00 AM',
    decision: 'Yes',
    overallScore: '4.6 / 5',
    rubrics: [
      { name: 'Role expertise', score: '4.7 / 5' },
      { name: 'Problem solving', score: '4.5 / 5' },
      { name: 'Communication', score: '4.8 / 5' }
    ],
    feedback: 'Excellent communication and values alignment. Demonstrated mature leadership in past design sprint execution and talent mentoring.'
  }
};

export default function CandidateScorecardModal({ 
  open, 
  onClose, 
  candidate 
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open || !candidate) return null;

  const candidateName = candidate.name || 'Harper Cole';
  const scorecard = SCORECARD_DATA_BY_CANDIDATE[candidateName] || {
    name: candidateName,
    role: candidate.currentDesignation || candidate.role?.split('·')[0]?.trim() || 'Senior Product Designer',
    stage: candidate.currentStage || 'Technical interview',
    interviewer: candidate.lastInterviewer || 'Mina Shah',
    completedAt: 'Oct 7 · 4:15 PM',
    decision: candidate.decision || 'Strong Yes',
    overallScore: candidate.scorecardScore ? `${(parseFloat(candidate.scorecardScore) / 2).toFixed(1)} / 5` : '4.7 / 5',
    rubrics: [
      { name: 'Role expertise', score: '4.8 / 5' },
      { name: 'Problem solving', score: '4.6 / 5' },
      { name: 'Communication', score: '4.7 / 5' }
    ],
    feedback: 'The candidate showed strong product judgment, explained trade-offs with clarity, and connected design decisions to measurable user outcomes.'
  };

  const getDecisionColor = (dec) => {
    switch (dec) {
      case 'Strong Yes':
      case 'Yes':
        return 'text-[#00A76F]';
      case 'Pending':
        return 'text-[#b78103] dark:text-[#f59e0b]';
      case 'No':
      case 'Strong No':
        return 'text-[#FF5630]';
      default:
        return 'text-[#212b36] dark:text-white';
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close scorecard"
        >
          <X size={18} />
        </button>

        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 pr-8">
          <div>
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              INTERVIEW SCORECARD
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#212b36] dark:text-white mt-1">
              {scorecard.name}
            </h3>
            <p className="text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 font-medium mt-1">
              {scorecard.role} · {scorecard.stage}
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="px-3.5 py-1.5 rounded-xl bg-[#1890FF]/10 text-[#1890FF] font-black text-base sm:text-lg shrink-0">
            {scorecard.overallScore}
          </div>
        </div>

        {/* Row 1: Interviewer, Interview Completed, Decision */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 mb-6">
          <div className="bg-[#F9FAFB] dark:bg-[#1e2732] border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-4">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              INTERVIEWER
            </span>
            <span className="text-sm font-bold text-[#212b36] dark:text-white mt-1.5 block truncate">
              {scorecard.interviewer}
            </span>
          </div>

          <div className="bg-[#F9FAFB] dark:bg-[#1e2732] border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-4">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              INTERVIEW COMPLETED
            </span>
            <span className="text-sm font-bold text-[#212b36] dark:text-white mt-1.5 block truncate">
              {scorecard.completedAt}
            </span>
          </div>

          <div className="bg-[#F9FAFB] dark:bg-[#1e2732] border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-4">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              DECISION
            </span>
            <span className={`text-sm font-bold mt-1.5 block truncate ${getDecisionColor(scorecard.decision)}`}>
              {scorecard.decision}
            </span>
          </div>
        </div>

        {/* Section 2: Interview Rubric */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#212b36] dark:text-white mb-3">
            Interview rubric
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {scorecard.rubrics.map((rubric) => (
              <div 
                key={rubric.name}
                className="bg-[#F9FAFB] dark:bg-[#1e2732] border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-4"
              >
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                  {rubric.name}
                </span>
                <span className="text-lg font-bold text-[#1890FF] mt-2 block">
                  {rubric.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Interviewer Feedback */}
        <div className="bg-[#F9FAFB] dark:bg-[#1e2732] border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-bold text-[#212b36] dark:text-white mb-2">
            Interviewer feedback
          </h4>
          <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {scorecard.feedback}
          </p>
        </div>

        {/* Footer Back Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-2xs cursor-pointer"
          >
            Back to attention list
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
