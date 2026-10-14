import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  CheckCircle2,
  MessageSquare,
  Bold,
  Italic,
  List,
  Code,
  Lock,
  Users,
  Save,
  ChevronRight,
  ChevronDown,
  Target,
  Award,
  FileText,
  Lightbulb,
  Edit3,
  Video,
  Sparkles
} from 'lucide-react';

const SCORECARD_CATEGORIES = [
  {
    name: 'Personality Traits',
    attributes: [
      { name: 'Self-motivated & Ownership' },
      { name: 'Team Player & Empathy' },
      { name: 'Clear Communication' },
      { name: 'Disciplined & Adaptable' },
    ]
  },
  {
    name: 'Technical Competencies',
    attributes: [
      { name: 'Distributed Systems Architecture' },
      { name: 'System Design & Concurrency' },
      { name: 'API Design & Scalability' },
      { name: 'Java & Kafka Ecosystem' },
    ]
  },
  {
    name: 'Research & Problem Solving',
    attributes: [
      { name: 'Algorithmic Rigor & Optimization' },
      { name: 'Product Strategy & Tradeoffs' },
      { name: 'Creative Problem Solving' },
      { name: 'Analytical Thinking' },
    ]
  }
];

const SCORECARD_RECOMMENDATIONS = [
  {
    id: 'Strong Hire',
    label: 'Strong Hire',
    emoji: '🌟',
    badgeText: 'text-[#00A76F]',
    badgeBg: 'bg-[#00A76F]/10 dark:bg-[#00A76F]/20',
    border: 'border-[#00A76F]/30',
    hoverBorder: 'hover:border-[#00A76F]',
    activeRing: 'ring-2 ring-[#00A76F] bg-[#00A76F]/5 border-[#00A76F]',
    description: 'Candidate exceeds bar across high-signal requirements. Highly recommended for offer.'
  },
  {
    id: 'Leaning Yes',
    label: 'Leaning Yes',
    emoji: '👍',
    badgeText: 'text-[#1890FF]',
    badgeBg: 'bg-[#1890FF]/10 dark:bg-[#1890FF]/20',
    border: 'border-[#1890FF]/30',
    hoverBorder: 'hover:border-[#1890FF]',
    activeRing: 'ring-2 ring-[#1890FF] bg-[#1890FF]/5 border-[#1890FF]',
    description: 'Candidate meets bar with strong fundamentals and clear positive hiring potential.'
  },
  {
    id: 'Leaning No',
    label: 'Leaning No',
    emoji: '👎',
    badgeText: 'text-[#FFAB00]',
    badgeBg: 'bg-[#FFAB00]/10 dark:bg-[#FFAB00]/20',
    border: 'border-[#FFAB00]/30',
    hoverBorder: 'hover:border-[#FFAB00]',
    activeRing: 'ring-2 ring-[#FFAB00] bg-[#FFAB00]/5 border-[#FFAB00]',
    description: 'Candidate showed notable gaps in core competencies or concerns needing resolution.'
  },
  {
    id: 'Strong Reject',
    label: 'Strong Reject',
    emoji: '⛔',
    badgeText: 'text-[#FF5630]',
    badgeBg: 'bg-[#FF5630]/10 dark:bg-[#FF5630]/20',
    border: 'border-[#FF5630]/30',
    hoverBorder: 'hover:border-[#FF5630]',
    activeRing: 'ring-2 ring-[#FF5630] bg-[#FF5630]/5 border-[#FF5630]',
    description: 'Candidate does not meet minimum technical depth or role requirements.'
  }
];

const RATING_OPTIONS = [
  {
    id: 'Strong Yes',
    label: 'Strong Yes',
    colorClass: 'bg-[#00A76F]',
    activeRing: 'ring-2 ring-[#00A76F] ring-offset-2 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'Yes',
    label: 'Yes',
    colorClass: 'bg-[#1890FF]',
    activeRing: 'ring-2 ring-[#1890FF] ring-offset-2 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'No',
    label: 'No',
    colorClass: 'bg-[#FFAB00]',
    activeRing: 'ring-2 ring-[#FFAB00] ring-offset-2 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'Strong No',
    label: 'Strong No',
    colorClass: 'bg-[#FF5630]',
    activeRing: 'ring-2 ring-[#FF5630] ring-offset-2 ring-offset-white dark:ring-offset-[#161c24]'
  }
];

export default function FeedScorecardModal({
  open,
  onClose,
  onSubmit,
  candidateName = 'Neha Kulkarni',
  roundName = 'Technical Round 2: System Architecture',
  roleName = 'Senior Backend Engineer',
  interviewerName = 'Jahangir Alam (You)',
  interviewerRole = 'Principal Architect'
}) {
  const [scorecardSubmitted, setScorecardSubmitted] = useState(false);
  const [scorecardFeedback, setScorecardFeedback] = useState(
    `Neha demonstrated strong architectural intuition regarding distributed transactional ledgers. She immediately identified edge cases around out-of-order Kafka message ingestion and correctly designed an idempotent payment reconciliation pipeline using PostgreSQL advisory locks and Redis token-buckets.\n\n• Excellent depth in Java 21 concurrency primitives & memory model\n• Good tradeoff analysis on eventual consistency vs ACID ledger balance\n• Clear, confident communication with strong architectural articulation.`
  );
  const [isFeedbackFocused, setIsFeedbackFocused] = useState(false);
  const [noteForOthers, setNoteForOthers] = useState(
    `Solid on high-level architecture and ledger design. In Round 3 (Executive / Bar Raiser), recommend probing her experience managing cross-geo stakeholder alignment and scaling engineering teams through rapid growth.`
  );
  const [isNoteSaved, setIsNoteSaved] = useState(true);

  // Confidential Private Note State
  const [privateNote, setPrivateNote] = useState(
    `Candidate indicated competing offer discussions with Atlassian concluding in 10 days. If extending an offer, comp expectations are ₹60L but she prioritizes technical ownership of the ledger architecture over absolute base salary.`
  );
  const [privateNoteVisibility, setPrivateNoteVisibility] = useState('Hiring Manager');
  const [isPrivateNoteSaved, setIsPrivateNoteSaved] = useState(true);
  const [isHandoverOpen, setIsHandoverOpen] = useState(false);
  const [isPrivateNoteOpen, setIsPrivateNoteOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState('Strong Hire');
  const [saveToast, setSaveToast] = useState(null);

  const [attributeRatings, setAttributeRatings] = useState({
    'Self-motivated & Ownership': 'Strong Yes',
    'Team Player & Empathy': 'Yes',
    'Clear Communication': 'Strong Yes',
    'Disciplined & Adaptable': 'Yes',
    'Distributed Systems Architecture': 'Strong Yes',
    'System Design & Concurrency': 'Strong Yes',
    'API Design & Scalability': 'Strong Yes',
    'Java & Kafka Ecosystem': 'Strong Yes',
    'Algorithmic Rigor & Optimization': 'Strong Yes',
    'Product Strategy & Tradeoffs': 'Yes',
    'Creative Problem Solving': 'Strong Yes',
    'Analytical Thinking': 'Strong Yes',
  });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleFormatText = (prefix, suffix = '') => {
    const textarea = document.getElementById('modal-scorecard-rich-textarea');
    if (!textarea) {
      setScorecardFeedback(prev => prev + `${prefix}text${suffix}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'text';
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + prefix + selected + suffix + after;
    setScorecardFeedback(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleSaveDraft = () => {
    setSaveToast('Draft saved successfully');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleSubmitScorecard = () => {
    setScorecardSubmitted(true);
    setSaveToast('Scorecard submitted successfully');
    onSubmit?.({
      feedback: scorecardFeedback,
      recommendation: selectedRecommendation,
      attributeRatings,
      noteForOthers,
      privateNote,
      privateNoteVisibility
    });
    setTimeout(() => setSaveToast(null), 3000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-gray-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-full max-w-[1400px] max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-[#161c24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white">
                  Feed Scorecard
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] border border-blue-200/60 dark:border-blue-800/40">
                  {roundName.split(':')[0] || 'Technical Round 2'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {candidateName} · {roleName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status Toast / Alert */}
        {saveToast && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-[#00A76F]/10 border border-[#00A76F]/30 text-[#00A76F] flex items-center justify-between animate-fade-in shadow-2xs shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00A76F]" />
              <span className="text-xs font-bold">{saveToast}</span>
            </div>
            <button 
              onClick={() => setSaveToast(null)}
              className="text-xs font-bold text-[#00A76F] hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {!scorecardSubmitted ? (
            /* ========================================================= */
            /* STATE 1: ACTIVE SCORING / FILL SCORECARD                  */
            /* ========================================================= */
            <div className="space-y-6">
              {/* CARD 1: INTERVIEWER FEEDBACK / COMMENTS & NOTES */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Interviewer Feedback & Observations</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Share qualitative evaluation, candidate strengths, code structure insights, and potential risks.</p>
                    </div>
                  </div>
                </div>

                {/* Rich Text Editor Wrapper */}
                <div className={`border ${
                  isFeedbackFocused
                    ? 'border-[#1890FF]'
                    : 'border-gray-300 dark:border-gray-600'
                } rounded-lg overflow-hidden transition-colors bg-white dark:bg-[#161c24]`}>
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700/70 text-gray-600 dark:text-gray-300">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleFormatText('**', '**')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-xs font-bold focus:outline-none cursor-pointer"
                      title="Bold (**text**)"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleFormatText('*', '*')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-xs font-bold focus:outline-none cursor-pointer"
                      title="Italic (*text*)"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleFormatText('\n• ')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-xs font-bold focus:outline-none cursor-pointer"
                      title="Bullet list (• Item)"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => handleFormatText('`', '`')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-xs font-bold focus:outline-none cursor-pointer"
                      title="Inline Code (`code`)"
                    >
                      <Code size={14} />
                    </button>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium ml-1">
                      Markdown supported
                    </span>
                  </div>

                  {/* Textarea */}
                  <textarea
                    id="modal-scorecard-rich-textarea"
                    value={scorecardFeedback}
                    onChange={(e) => setScorecardFeedback(e.target.value)}
                    onFocus={() => setIsFeedbackFocused(true)}
                    onBlur={() => setIsFeedbackFocused(false)}
                    rows={5}
                    placeholder="Enter detailed qualitative feedback about the candidate's technical design, problem solving process, code maintainability, and communication..."
                    className="w-full p-3.5 text-xs text-[#212b36] dark:text-gray-200 bg-white dark:bg-[#161c24] focus:outline-none leading-relaxed resize-y min-h-[120px]"
                  />
                </div>

                {/* ADDITIONAL NOTES (SEPARATE COLLAPSIBLE SECTIONS: HANDOVER NOTE & PRIVATE NOTE) */}
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Additional Notes
                    </span>
                  </div>

                  {/* Section 1: Handover Note */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-[#161c24] overflow-hidden transition-all duration-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsHandoverOpen(!isHandoverOpen)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50/70 hover:bg-gray-100/70 dark:bg-gray-800/40 dark:hover:bg-gray-800/70 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] shrink-0 border border-blue-200/60 dark:border-blue-800/50">
                          <Users size={14} />
                        </div>
                        <div className="min-w-0 flex items-baseline gap-2">
                          <span className="text-xs font-bold text-[#212b36] dark:text-white">Handover Note</span>
                          <span className="text-[11px] text-gray-400 hidden sm:inline">(For next interviewers)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {noteForOthers.trim().length > 0 && isNoteSaved && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20 flex items-center gap-1">
                            <Check size={10} /> Saved
                          </span>
                        )}
                        <div className={`p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-transform duration-300 ease-in-out ${isHandoverOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isHandoverOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-3.5 border-t border-gray-100 dark:border-gray-800 space-y-3">
                          <div className="space-y-1.5">
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              Provide handover guidance and context for interviewers in subsequent evaluation rounds.
                            </p>
                            <textarea
                              value={noteForOthers}
                              onChange={(e) => setNoteForOthers(e.target.value)}
                              rows={3}
                              placeholder="Write private notes for subsequent interviewers (e.g. 'Strong in distributed locks. In Round 3, probe deeper into Kafka consumer group rebalances...')"
                              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-[#212b36] dark:text-gray-200 focus:outline-none focus:border-[#1890FF] leading-relaxed resize-none transition-colors"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800/60">
                            <span className="text-[11px] text-gray-400">
                              Shared across all interviewers in subsequent rounds
                            </span>
                            <div className="flex items-center gap-2">
                              {noteForOthers.trim().length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setNoteForOthers('')}
                                  className="px-2.5 py-1 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                                >
                                  Clear
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setIsNoteSaved(true);
                                  setSaveToast('Handover note saved for other interviewers');
                                  setTimeout(() => setSaveToast(null), 2500);
                                }}
                                className="px-3 py-1 text-xs font-bold bg-[#1890FF] hover:bg-[#0077e6] text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <Save size={12} />
                                <span>Save Note</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Private Note */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-[#161c24] overflow-hidden transition-all duration-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsPrivateNoteOpen(!isPrivateNoteOpen)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50/70 hover:bg-gray-100/70 dark:bg-gray-800/40 dark:hover:bg-gray-800/70 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0 border border-amber-200/60 dark:border-amber-800/50">
                          <Lock size={14} />
                        </div>
                        <div className="min-w-0 flex items-baseline gap-2">
                          <span className="text-xs font-bold text-[#212b36] dark:text-white">Private Note</span>
                          <span className="text-[11px] text-gray-400 hidden sm:inline">(Confidential · Visible to {privateNoteVisibility})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {privateNote.trim().length > 0 && isPrivateNoteSaved && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20 flex items-center gap-1">
                            <Check size={10} /> Saved
                          </span>
                        )}
                        <div className={`p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-transform duration-300 ease-in-out ${isPrivateNoteOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isPrivateNoteOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-3.5 border-t border-gray-100 dark:border-gray-800 space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                Confidential observations visible only to selected roles:
                              </span>
                              <div className="flex items-center gap-1">
                                {[
                                  { id: 'Only Me', label: 'Only Me' },
                                  { id: 'Hiring Manager', label: 'Hiring Manager' },
                                  { id: 'Admins', label: 'Admins' }
                                ].map((vis) => (
                                  <button
                                    key={vis.id}
                                    type="button"
                                    onClick={() => setPrivateNoteVisibility(vis.id)}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                      privateNoteVisibility === vis.id
                                        ? 'bg-[#1890FF] text-white shadow-2xs'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                    }`}
                                  >
                                    {vis.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <textarea
                              value={privateNote}
                              onChange={(e) => setPrivateNote(e.target.value)}
                              rows={3}
                              placeholder="Write confidential observations (e.g. compensation expectations, offer timeline sensitivity, or private feedback)..."
                              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-[#212b36] dark:text-gray-200 focus:outline-none focus:border-[#1890FF] leading-relaxed resize-none transition-colors"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800/60">
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Lock size={11} className="text-[#1890FF]" />
                              Visible to: <strong className="text-gray-600 dark:text-gray-300 font-semibold">{privateNoteVisibility}</strong>
                            </span>
                            <div className="flex items-center gap-2">
                              {privateNote.trim().length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setPrivateNote('')}
                                  className="px-2.5 py-1 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                                >
                                  Clear
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setIsPrivateNoteSaved(true);
                                  setSaveToast(`Private note saved (Visible to ${privateNoteVisibility})`);
                                  setTimeout(() => setSaveToast(null), 2500);
                                }}
                                className="px-3 py-1 text-xs font-bold bg-[#1890FF] hover:bg-[#0077e6] text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <Save size={12} />
                                <span>Save Note</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: COMPETENCY ATTRIBUTES & RATINGS */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                      <Target size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Skills & Qualities Checklist</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Rate candidate across competencies. Click a circle to set the evaluation.</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <span className="text-[#00A76F]">
                      {Object.values(attributeRatings).filter(r => r !== 'Unassessed').length} of {SCORECARD_CATEGORIES.reduce((acc, c) => acc + c.attributes.length, 0)} Assessed
                    </span>
                  </div>
                </div>

                {/* Categorized Attributes Grid */}
                <div className="space-y-4">
                  {SCORECARD_CATEGORIES.map((cat) => (
                    <div key={cat.name} className="bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-3.5 border border-gray-100/80 dark:border-gray-800">
                      <h6 className="text-[11px] font-bold uppercase tracking-wider text-[#1890FF] mb-2.5 flex items-center justify-between">
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">({cat.attributes.length} attributes)</span>
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {cat.attributes.map((attr) => {
                          const currentRating = attributeRatings[attr.name] || 'Unassessed';
                          return (
                            <div
                              key={attr.name}
                              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
                            >
                              <span className="text-[12px] font-medium text-[#454f5b] dark:text-gray-300 pr-2 truncate" title={attr.name}>
                                {attr.name}
                              </span>

                              {/* Interactive Circle Color Selector */}
                              <div className="shrink-0 flex items-center gap-[14px] bg-gray-50 dark:bg-gray-800/60 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700/50">
                                {RATING_OPTIONS.map((opt) => {
                                  const isSelected = currentRating === opt.id;
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => setAttributeRatings(prev => ({
                                        ...prev,
                                        [attr.name]: prev[attr.name] === opt.id ? 'Unassessed' : opt.id
                                      }))}
                                      title={`${opt.label}: Click to set`}
                                      className={`p-1 rounded-full transition-all cursor-pointer hover:scale-110 ${
                                        isSelected ? `${opt.activeRing} opacity-100 z-10 scale-105` : 'opacity-35 hover:opacity-85'
                                      }`}
                                    >
                                      <span className={`w-4 h-4 rounded-full ${opt.colorClass} block shadow-xs`} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rating Scale Legend */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50/40 dark:bg-gray-800/20 p-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700/60">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Legend:</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00A76F] shrink-0" />
                      <span>Strong Yes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1890FF] shrink-0" />
                      <span>Yes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFAB00] shrink-0" />
                      <span>No</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5630] shrink-0" />
                      <span>Strong No</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: OVERALL RECOMMENDATION */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                      <Award size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Overall Recommendation</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Select your hiring recommendation verdict for this round.</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation 4-Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SCORECARD_RECOMMENDATIONS.map((rec) => {
                    const isSelected = selectedRecommendation === rec.id;
                    return (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => setSelectedRecommendation(rec.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? `${rec.activeRing}`
                            : `bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 ${rec.hoverBorder}`
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#1890FF] text-white flex items-center justify-center shadow-xs">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-lg">{rec.emoji}</span>
                            <span className={`text-[12px] font-bold ${rec.badgeText}`}>{rec.label}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* STATE 2: POST-SUBMISSION VIEW                             */
            /* ========================================================= */
            <div className="space-y-6">
              {/* Top Success Panel */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#00A76F]/10 via-[#00A76F]/5 to-transparent border border-[#00A76F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-fade-in">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#00A76F]/15 text-[#00A76F] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <CheckCircle2 size={22} className="text-[#00A76F]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#212b36] dark:text-white">
                      Scorecard submitted successfully!
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Submitted for {roundName} · Amendable until loop closes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScorecardSubmitted(false)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-white hover:border-[#1890FF] hover:text-[#1890FF] shadow-2xs text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  <Edit3 size={13} />
                  <span>Amend Scorecard</span>
                </button>
              </div>

              {/* Summary of Scorecard */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-[#1890FF] font-bold text-xs flex items-center justify-center shrink-0">
                      JA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#212b36] dark:text-white">{interviewerName}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-[#1890FF]">
                          {interviewerRole}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {roundName}
                      </p>
                    </div>
                  </div>

                  {/* Recommendation Badge */}
                  {(() => {
                    const rec = SCORECARD_RECOMMENDATIONS.find(r => r.id === selectedRecommendation) || SCORECARD_RECOMMENDATIONS[0];
                    return (
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Your Recommendation</div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${rec.badgeBg} ${rec.badgeText} ${rec.border}`}>
                          <span>{rec.emoji}</span>
                          <span>{rec.label}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={13} className="text-[#1890FF]" />
                    <span className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">
                      Interviewer Notes
                    </span>
                  </div>
                  <div className="bg-gray-50/70 dark:bg-gray-800/30 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800/60">
                    <p className="text-xs text-[#454f5b] dark:text-gray-200 leading-relaxed whitespace-pre-line font-sans">
                      {scorecardFeedback}
                    </p>
                  </div>
                </div>

                {/* Evaluated Competencies */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={13} className="text-[#1890FF]" />
                      <span className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">
                        Skills & Qualities Evaluated
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#00A76F]">
                      {Object.values(attributeRatings).filter(r => r !== 'Unassessed').length} of {SCORECARD_CATEGORIES.reduce((acc, c) => acc + c.attributes.length, 0)} Assessed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {SCORECARD_CATEGORIES.map((cat) => (
                      <div key={cat.name} className="bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-3 border border-gray-100/80 dark:border-gray-800">
                        <h6 className="text-[10px] font-bold uppercase tracking-wider text-[#1890FF] mb-2">
                          {cat.name}
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {cat.attributes.map((attr) => {
                            const currentRating = attributeRatings[attr.name] || 'Unassessed';
                            const opt = RATING_OPTIONS.find(o => o.id === currentRating) || {
                              id: 'Unassessed',
                              label: 'Unassessed',
                              colorClass: 'bg-gray-300 dark:bg-gray-600'
                            };
                            return (
                              <div
                                key={attr.name}
                                className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800"
                              >
                                <span className="text-[11px] font-medium text-[#454f5b] dark:text-gray-300 pr-2 truncate">
                                  {attr.name}
                                </span>
                                <div className="shrink-0 flex items-center gap-1.5">
                                  <span className={`w-3 h-3 rounded-full ${opt.colorClass} block shadow-2xs`} title={opt.label} />
                                  <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{opt.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/70 dark:bg-gray-800/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <CheckCircle2 size={14} className="text-[#00A76F]" />
            <span>Evaluation status: {scorecardSubmitted ? 'Submitted' : 'Draft in progress'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {scorecardSubmitted ? 'Close' : 'Cancel'}
            </button>

            {!scorecardSubmitted ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleSubmitScorecard}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#1890FF] hover:bg-[#0077e6] text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Submit Scorecard</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#1890FF] hover:bg-[#0077e6] text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Done</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
