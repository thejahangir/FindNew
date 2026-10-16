import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  GitBranch, FileText, Clock, ClipboardEdit, 
  UserCheck, Video, Check 
} from 'lucide-react';
import CandidateScorecardModal from './CandidateScorecardModal';

const PIPELINE_STAGES_LIST = [
  'Applied',
  'Screening',
  'Technical interview',
  'Panel interview',
  'HR interview',
  'Reference check',
  'Offer',
  'Reject'
];

export default function JobPipelineOverview({ 
  onNavigateToBoard: _onNavigateToBoard, 
  onNavigateToCandidates: _onNavigateToCandidates, 
  onSelectCandidate,
  jobTitle = 'Senior AI Research Scientist' 
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending_decision');
  const [actionToast, setActionToast] = useState(null);
  const [scorecardCandidate, setScorecardCandidate] = useState(null);
  const [activeStageMenuId, setActiveStageMenuId] = useState(null);
  const [stageMenuPosition, setStageMenuPosition] = useState(null);
  const [candidateStages, setCandidateStages] = useState({});

  const triggerActionFeedback = (msg) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3200);
  };

  const handleViewProfile = (cand) => {
    if (onSelectCandidate) onSelectCandidate(cand);
    navigate(`/dashboard/candidates/${cand.id}`, {
      state: {
        candidate: {
          id: cand.id,
          name: cand.name,
          role: cand.role || cand.currentDesignation || 'Product Designer',
          company: cand.company || cand.currentCompany || 'Juniper Labs',
          stage: candidateStages[cand.id]?.stage || cand.currentStage || 'Technical interview',
          score: cand.scorecardScore ? `${cand.scorecardScore}/10` : '9.2/10',
          date: cand.stageAge ? `In stage · ${cand.stageAge}` : 'In stage · 4d',
          location: 'Bangalore, India',
          experience: '5 YOE',
          skills: ['Product Design', 'Figma', 'Design Systems', 'Prototyping'],
          agency: 'Direct'
        },
        from: { 
          name: 'Job Hiring Pipeline', 
          path: '/dashboard/agencies', 
          tab: 'Overview' 
        }
      }
    });
  };

  // Close stage dropdown on outside click, scroll, or resize
  useEffect(() => {
    const handleClose = () => {
      setActiveStageMenuId(null);
      setStageMenuPosition(null);
    };
    window.addEventListener('click', handleClose);
    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('resize', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('resize', handleClose);
    };
  }, []);

  const handleToggleStageMenu = (e, cand, currentCandStage) => {
    e.stopPropagation();
    if (activeStageMenuId === cand.id) {
      setActiveStageMenuId(null);
      setStageMenuPosition(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownHeight = 270;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    setStageMenuPosition({
      top: openUpward ? rect.top - 6 : rect.bottom + 6,
      right: Math.max(16, window.innerWidth - rect.right),
      openUpward,
      candId: cand.id,
      candName: cand.name,
      currentCandStage
    });
    setActiveStageMenuId(cand.id);
  };

  const handleChangeStage = (candId, newStage, candName) => {
    setCandidateStages(prev => ({
      ...prev,
      [candId]: {
        stage: newStage,
        age: '<1d'
      }
    }));
    setActiveStageMenuId(null);
    setStageMenuPosition(null);
    triggerActionFeedback(`Stage changed to "${newStage}" for ${candName}`);
  };

  // 5 Pipeline Queues
  const initialStages = [
    {
      id: 'pending_decision',
      name: 'Pending Decision',
      count: 3,
      icon: Clock,
      color: '#FFAB00',
      description: 'Completed interview loops awaiting final hiring decision',
      candidates: [
        {
          id: 201,
          name: 'Harper Cole',
          role: 'Product Designer · Juniper Labs',
          currentDesignation: 'Product Designer',
          currentCompany: 'Juniper Labs',
          currentStage: 'Technical interview',
          stageAge: '4d',
          lastInterviewer: 'Mina Shah',
          decision: 'Strong Yes',
          scorecardScore: '9.4'
        },
        {
          id: 202,
          name: 'Alex Rivera',
          role: 'Senior UX Designer · Bluebird',
          currentDesignation: 'Senior UX Designer',
          currentCompany: 'Bluebird',
          currentStage: 'Panel interview',
          stageAge: '3d',
          lastInterviewer: 'Chris Nguyen',
          decision: 'Pending',
          scorecardScore: '8.8'
        },
        {
          id: 203,
          name: 'Quinn Davis',
          role: 'Product Design Lead · Atlas Works',
          currentDesignation: 'Product Design Lead',
          currentCompany: 'Atlas Works',
          currentStage: 'HR interview',
          stageAge: '1d',
          lastInterviewer: 'Taylor Brooks',
          decision: 'Yes',
          scorecardScore: '9.0'
        }
      ]
    },
    {
      id: 'new_applications',
      name: 'New Applications',
      count: 45,
      icon: FileText,
      color: '#1890FF',
      description: 'Unscreened inbound applications & sourced candidate profiles',
      candidates: [
        {
          id: 101,
          name: 'Ravi Desai',
          role: 'Senior Software Engineer · Infosys',
          currentDesignation: 'Senior Software Engineer',
          currentCompany: 'Infosys',
          currentStage: 'Screening',
          stageAge: '2d',
          lastInterviewer: 'Vikram Rao',
          decision: 'Strong Yes',
          scorecardScore: '9.2'
        },
        {
          id: 102,
          name: 'Sneha Patil',
          role: 'Frontend Systems Engineer · TCS Digital',
          currentDesignation: 'Frontend Systems Engineer',
          currentCompany: 'TCS Digital',
          currentStage: 'Screening',
          stageAge: '3d',
          lastInterviewer: 'Amit Sharma',
          decision: 'Pending',
          scorecardScore: '8.8'
        },
        {
          id: 103,
          name: 'Karan Mehra',
          role: 'Lead UI Developer · Wipro Technologies',
          currentDesignation: 'Lead UI Developer',
          currentCompany: 'Wipro Technologies',
          currentStage: 'Applied',
          stageAge: '1d',
          lastInterviewer: 'Priya Patel',
          decision: 'Yes',
          scorecardScore: '8.5'
        },
        {
          id: 104,
          name: 'Ankita Rao',
          role: 'Full Stack React Engineer · Startup Inc',
          currentDesignation: 'Full Stack React Engineer',
          currentCompany: 'Startup Inc',
          currentStage: 'Applied',
          stageAge: '4d',
          lastInterviewer: 'Vikram Rao',
          decision: 'Strong Yes',
          scorecardScore: '8.1'
        }
      ]
    },
    {
      id: 'scorecard_due',
      name: 'Scorecard Due',
      count: 8,
      icon: ClipboardEdit,
      color: '#FF5630',
      description: 'Completed candidate interviews awaiting reviewer evaluation',
      candidates: [
        {
          id: 301,
          name: 'Divya Singh',
          role: 'Senior React Developer · Paytm',
          currentDesignation: 'Senior React Developer',
          currentCompany: 'Paytm',
          currentStage: 'Technical interview',
          stageAge: '2d',
          lastInterviewer: 'Vikram Rao',
          decision: 'Pending',
          scorecardScore: '8.9'
        },
        {
          id: 302,
          name: 'Ankita Rao',
          role: 'React Developer · Swiggy',
          currentDesignation: 'React Developer',
          currentCompany: 'Swiggy',
          currentStage: 'HR interview',
          stageAge: '1d',
          lastInterviewer: 'Amit Sharma',
          decision: 'Strong Yes',
          scorecardScore: '9.1'
        }
      ]
    },
    {
      id: 'reference_checks',
      name: 'Reference Checks',
      count: 6,
      icon: UserCheck,
      color: '#00A76F',
      description: 'Offer-stage background & employment verification in progress',
      candidates: [
        {
          id: 401,
          name: 'Rohan Mehra',
          role: 'Lead Cloud Architect · IBM Labs',
          currentDesignation: 'Lead Cloud Architect',
          currentCompany: 'IBM Labs',
          currentStage: 'Reference check',
          stageAge: '3d',
          lastInterviewer: 'Priya Sharma',
          decision: 'Strong Yes',
          scorecardScore: '9.6'
        }
      ]
    },
    {
      id: 'upcoming_interviews',
      name: 'Upcoming Interviews',
      count: 12,
      icon: Video,
      color: '#8E33FF',
      description: 'Scheduled live video rounds for next 48 hours',
      candidates: [
        {
          id: 501,
          name: 'Maya Chen',
          role: 'Senior Product Designer · Juniper Labs',
          currentDesignation: 'Senior Product Designer',
          currentCompany: 'Juniper Labs',
          currentStage: 'Panel interview',
          stageAge: '1d',
          lastInterviewer: 'Mina Shah',
          decision: 'Pending',
          scorecardScore: '9.2'
        }
      ]
    }
  ];

  const currentStage = initialStages.find(s => s.id === activeTab) || initialStages[0];

  return (
    <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all duration-200 space-y-4">
      {/* HEADER SECTION */}
      <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
              <GitBranch size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-none uppercase tracking-wide">
              Need Your Attention
            </h3>
          </div>

          {/* FEEDBACK TOAST */}
          {actionToast && (
            <div className="px-3 py-1.5 rounded-xl bg-[#00A76F]/10 border border-[#00A76F]/30 text-xs font-bold text-[#00A76F] flex items-center gap-1.5 animate-fade-in shadow-xs">
              <Check size={14} />
              <span>{actionToast}</span>
            </div>
          )}
        </div>

        {/* Subtitle below the title */}
        <p className="text-xs text-gray-500 dark:text-gray-400 pl-[52px] mt-1">
          Tasks and candidates that need your next step for <span className="font-semibold text-gray-700 dark:text-gray-300">{jobTitle}</span>
        </p>
      </div>

      {/* PIPELINE TABS NAVIGATION */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-0 scrollbar-hide">
        {initialStages.map((stage) => {
          const isActive = activeTab === stage.id;
          const Icon = stage.icon;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveTab(stage.id)}
              className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                isActive
                  ? 'border-[#1890FF] text-[#1890FF] dark:text-[#1890FF]'
                  : 'border-transparent text-gray-500 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-[#1890FF]' : 'text-gray-400'} />
              <span>{stage.name}</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                isActive 
                  ? 'bg-[#1890FF]/10 text-[#1890FF]' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {stage.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* QUEUE SUBTITLE / SORT ORDER */}
      <div className="pt-0.5 pb-0.5">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          {currentStage.candidates.length} applications · longest waiting first
        </p>
      </div>

      {/* CANDIDATES GRID VIEW (TABLE) */}
      <div className="overflow-x-auto -mx-1 px-1">
        {/* Table Header */}
        <div className="border-t border-b border-gray-100 dark:border-gray-800 py-2.5 flex items-center justify-between text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider min-w-[700px]">
          <div className="w-[30%] min-w-[190px]">CANDIDATE</div>
          <div className="w-[20%] min-w-[140px]">CURRENT STAGE</div>
          <div className="w-[36%] min-w-[250px]">ATTENTION DETAILS</div>
          <div className="w-[14%] min-w-[110px] text-right">ACTION</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800/80 min-w-[700px]">
          {currentStage.candidates.map((cand) => {
            const currentCandStage = candidateStages[cand.id]?.stage || cand.currentStage;
            const currentCandAge = candidateStages[cand.id]?.age || cand.stageAge || '4d';

            return (
              <div 
                key={cand.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 px-1 -mx-1 rounded-lg transition-colors"
              >
                {/* 1. CANDIDATE: Name & Role */}
                <div className="w-[30%] min-w-[190px]">
                  <div 
                    onClick={() => handleViewProfile(cand)}
                    className="text-[13px] font-bold text-[#212b36] dark:text-white hover:text-[#1890FF] transition-colors cursor-pointer truncate"
                  >
                    {cand.name}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {cand.role || `${cand.currentDesignation} · ${cand.currentCompany}`}
                  </div>
                </div>

                {/* 2. CURRENT STAGE: Stage & In stage duration */}
                <div className="w-[20%] min-w-[140px]">
                  <div className="text-[11px] font-semibold text-[#212b36] dark:text-gray-200 truncate">
                    {currentCandStage}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    In stage · {currentCandAge}
                  </div>
                </div>

                {/* 3. ATTENTION DETAILS: LAST INTERVIEWER, DECISION, SCORECARD */}
                <div className="w-[36%] min-w-[250px] grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      LAST INTERVIEWER
                    </span>
                    <span className="text-[11px] font-medium text-[#212b36] dark:text-gray-200 block mt-0.5 truncate">
                      {cand.lastInterviewer || 'Mina Shah'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      DECISION
                    </span>
                    <span className={`text-[11px] font-bold block mt-0.5 ${
                      cand.decision === 'Strong Yes' ? 'text-[#00A76F]' :
                      cand.decision === 'Yes' ? 'text-[#00A76F]' :
                      cand.decision === 'Pending' ? 'text-[#b78103] dark:text-[#f59e0b]' : 'text-[#FF5630]'
                    }`}>
                      {cand.decision || 'Pending'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      SCORECARD
                    </span>
                    <button 
                      type="button"
                      onClick={() => setScorecardCandidate(cand)}
                      className="text-[11px] font-bold text-[#1890FF] hover:underline cursor-pointer block mt-0.5 text-left"
                    >
                      View scorecard
                    </button>
                  </div>
                </div>

                {/* 4. ACTION: Move Stage Button */}
                <div className="w-[14%] min-w-[110px] text-right">
                  <button
                    type="button"
                    onClick={(e) => handleToggleStageMenu(e, cand, currentCandStage)}
                    className="h-7 px-3 bg-[#1890FF] hover:bg-[#0077e6] active:scale-98 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap inline-flex items-center justify-center"
                  >
                    Move Stage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER SECTION AS IN ATTACHMENT */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 dark:text-gray-500">
        <span>Counts are per application and may overlap across categories.</span>
        <span>
          <strong className="text-gray-600 dark:text-gray-300 font-semibold">Illustrative data</strong> · Actions are preview-only.
        </span>
      </div>

      {/* Floating Stage Change Dropdown (Portal overlay on top of everything) */}
      {activeStageMenuId && stageMenuPosition && createPortal(
        <>
          <div 
            className="fixed inset-0 z-[9998] bg-transparent"
            onClick={() => {
              setActiveStageMenuId(null);
              setStageMenuPosition(null);
            }}
          />
          <div 
            style={{
              position: 'fixed',
              top: stageMenuPosition.openUpward ? undefined : `${stageMenuPosition.top}px`,
              bottom: stageMenuPosition.openUpward ? `${window.innerHeight - stageMenuPosition.top}px` : undefined,
              right: `${stageMenuPosition.right}px`,
              zIndex: 9999
            }}
            className="w-48 bg-white dark:bg-[#161c24] rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl py-1.5 text-xs animate-fade-in text-left will-change-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800">
              Move to Stage:
            </div>
            <div className="py-1 max-h-60 overflow-y-auto">
              {PIPELINE_STAGES_LIST.map((stageItem) => {
                const isCurrent = stageMenuPosition.currentCandStage === stageItem;
                return (
                  <button
                    key={stageItem}
                    type="button"
                    onClick={() => {
                      handleChangeStage(stageMenuPosition.candId, stageItem, stageMenuPosition.candName);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isCurrent 
                        ? 'bg-[#1890FF]/10 text-[#1890FF] font-bold' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="truncate">{stageItem}</span>
                    {isCurrent && <Check size={13} className="text-[#1890FF] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* CANDIDATE SCORECARD MODAL */}
      <CandidateScorecardModal
        open={Boolean(scorecardCandidate)}
        onClose={() => setScorecardCandidate(null)}
        candidate={scorecardCandidate}
        jobTitle={jobTitle}
      />
    </div>
  );
}
