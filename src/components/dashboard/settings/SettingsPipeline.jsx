import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  GitBranch, ArrowRight, Plus, Zap, Trash2, GripVertical, 
  Mail, Calendar, CheckCircle2, ChevronDown, Check, Edit2, 
  Layers, ShieldCheck, Clock, Sparkles, UserCheck, Bell,
  FileCheck, HelpCircle, FileText, Bot, Video, Users, User,
  Globe, PhoneCall, AlertTriangle, MessageSquare, Sliders,
  X, Mic, Volume2, Settings2, Play, Pause, ChevronRight,
  ArrowLeft, Shield, AlertCircle, AudioLines, Copy
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchableSelect from '../../ui/SearchableSelect';

const INITIAL_AI_AGENTS = [
  {
    id: 'screening-agent',
    title: 'Screening Agent',
    subtitle: 'English · Indian English · Normal',
    description: 'Conducts initial candidate screening, verifies basic qualifications, resume claims, availability, and communication skills.',
    enabled: false,
    role: 'Screening',
    voice: 'Indian English (Aditi - Female)',
    tone: 'Normal',
    speed: '1.0x',
    duration: '15 Mins',
    instructions: 'You are an intelligent screening interviewer. Greet the candidate warmly, verify their current experience, availability, notice period, and key skills relevant to the job.',
    questions: [
      'Can you briefly summarize your recent experience relevant to this role?',
      'What is your notice period and current work location preference?',
      'What are your compensation expectations for this position?'
    ]
  },
  {
    id: 'hr-interview-agent',
    title: 'HR Interview Agent',
    subtitle: 'English · Indian English · Normal',
    description: 'Evaluates cultural fit, behavioral responses, work preferences, salary expectations, and company alignment.',
    enabled: false,
    role: 'HR Interview',
    voice: 'Indian English (Priya - Female)',
    tone: 'Normal',
    speed: '1.0x',
    duration: '30 Mins',
    instructions: 'Evaluate behavioral competencies using the STAR method. Inquire about teamwork, conflict resolution, work style, and long-term career goals.',
    questions: [
      'Tell me about a time you handled a tight deadline or conflicting priorities.',
      'How do you collaborate with cross-functional team members?',
      'What motivates you in your day-to-day work environment?'
    ]
  },
  {
    id: 'technical-interview-agent',
    title: 'Technical Interview Agent',
    subtitle: 'English · Indian English · Normal',
    description: 'Assesses core technical competencies, problem-solving abilities, coding paradigms, and domain knowledge.',
    enabled: false,
    role: 'Technical Interview',
    voice: 'Indian English (Rohan - Male)',
    tone: 'Normal',
    speed: '1.0x',
    duration: '45 Mins',
    instructions: 'Conduct in-depth technical evaluation. Pose scenario-based architecture and system design questions, and assess algorithmic depth.',
    questions: [
      'Explain how you would design a scalable distributed processing pipeline.',
      'How do you manage state and memory efficiency in high-load services?',
      'Describe your approach to debugging performance bottlenecks in production.'
    ]
  },
  {
    id: 'managerial-interview-agent',
    title: 'Managerial Interview Agent',
    subtitle: 'English · Indian English · Normal',
    description: 'Assesses leadership capabilities, conflict resolution, project management, and strategic thinking.',
    enabled: false,
    role: 'Managerial Interview',
    voice: 'Indian English (Vikram - Male)',
    tone: 'Normal',
    speed: '1.0x',
    duration: '45 Mins',
    instructions: 'Evaluate leadership mindset, project ownership, team mentorship, stakeholder management, and trade-off decisions.',
    questions: [
      'How do you align technical priorities with business objectives?',
      'Describe how you coach and elevate junior team members.',
      'Share an example of a difficult technical trade-off decision you made.'
    ]
  }
];

const SYSTEM_STAGES = [
  'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'
];

const getStageColor = (systemStage) => {
  switch (systemStage) {
    case 'Applied': return 'text-[#1890FF] bg-[#1890FF]/10 border-[#1890FF]/20';
    case 'Screening': return 'text-[#FFC107] bg-[#FFC107]/10 border-[#FFC107]/20';
    case 'Interview': return 'text-[#1890FF] bg-[#1890FF]/10 border-[#1890FF]/20';
    case 'Offer': return 'text-[#00A76F] bg-[#00A76F]/10 border-[#00A76F]/20';
    case 'Hired': return 'text-[#00A76F] bg-[#00A76F]/10 border-[#00A76F]/20';
    case 'Rejected': return 'text-[#FF5630] bg-[#FF5630]/10 border-[#FF5630]/20';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

const NOTIF_ICONS = {
  sendEmail: Mail,
  notifyTeam: Bell,
  autoSchedule: Calendar,
  triggerOnboarding: Zap,
  notifReminder: Clock,
  notifFeedback: MessageSquare,
  notifNoShow: AlertTriangle,
  alertOfferAcceptance: CheckCircle2,
  alertOfferDelayed: AlertTriangle,
  notifHiringTeam: Users,
  notifAgency: Globe,
  notifCandidate: User,
  notifRejectCandidate: User,
  notifRejectAgency: Globe,
  notifRejectHiringTeam: Users
};

const HIRED_TEMPLATE_OPTIONS = {
  notifHiringTeam: [
    { label: 'Hiring Team - New Hire Confirmation Template', value: 'Hiring Team - New Hire Confirmation Template' },
    { label: 'Internal Team - Onboarding Handover Notice', value: 'Internal Team - Onboarding Handover Notice' }
  ],
  notifAgency: [
    { label: 'Agency - Candidate Placement & Commission Confirmation', value: 'Agency - Candidate Placement & Commission Confirmation' },
    { label: 'Agency - Placement Status Completed', value: 'Agency - Placement Status Completed' }
  ],
  notifCandidate: [
    { label: 'Candidate - Formal Welcome & Next Steps Packet', value: 'Candidate - Formal Welcome & Next Steps Packet' },
    { label: 'Candidate - Onboarding Portal Access & Welcome Email', value: 'Candidate - Onboarding Portal Access & Welcome Email' }
  ]
};

const REJECT_TEMPLATE_OPTIONS = {
  notifRejectCandidate: [
    { label: 'Standard Polite Rejection Template', value: 'Standard Polite Rejection Template' },
    { label: 'Post-Interview Feedback & Rejection', value: 'Post-Interview Feedback & Rejection' },
    { label: 'General Talent Pool Future Opportunity Notice', value: 'General Talent Pool Future Opportunity Notice' }
  ],
  notifRejectAgency: [
    { label: 'Agency - Candidate Non-Selection Notice', value: 'Agency - Candidate Non-Selection Notice' },
    { label: 'Agency - Feedback & Candidate Archival Notice', value: 'Agency - Feedback & Candidate Archival Notice' }
  ]
};

const EMAIL_TEMPLATE_OPTIONS = [
  { label: 'Standard Reference Check Request Template', value: 'Standard Reference Check Request Template' },
  { label: 'Technical Reference Evaluation Form', value: 'Technical Reference Evaluation Form' },
  { label: 'Executive Leadership Reference Form', value: 'Executive Leadership Reference Form' },
  { label: 'Employment & Education Verification Notice', value: 'Employment & Education Verification Notice' }
];

const DEFAULT_STAGE_CONFIGS = {
  'Applied': {
    description: 'Candidates enter this stage when they submit an application through an agency, referral, or direct application.',
    actions: [
      {
        id: 'resumeRanking',
        title: 'Resume Ranking',
        desc: 'If enabled, automatically trigger resume ranking when the candidate enters the Applied stage.',
        active: true
      }
    ],
    notifications: [
      { id: 'sendEmail', title: 'Send Confirmation Email', desc: 'Send confirmation email acknowledging receipt of application', active: true },
      { id: 'notifyTeam', title: 'Notify Hiring Team', desc: 'Alert hiring team & recruiters of new candidate submission', active: true }
    ],
    validations: [
      { id: 'resumeParsed', title: 'Resume Parsed', desc: 'Candidate resume parsed & parsed data populated', required: true },
      { id: 'knockoutQuestions', title: 'Knockout Questions Passed', desc: 'All mandatory screening knockout questions passed', required: true }
    ],
    validationSubtitle: 'The candidate cannot move to the next stage unless:',
    guideline: 'Candidates in this stage should be reviewed within 24 hours to maintain engagement.',
    sla: '24 Hours'
  },
  'Screening': {
    description: 'Candidates enter this stage when they submit an application through an agency, referral, or direct application.',
    actions: [
      {
        id: 'autoScreening',
        title: 'Automatic Screening',
        scheduleLabel: 'Schedule Screening Automatically',
        active: true,
        sendAssessmentActive: true,
        hasAiConfig: true
      }
    ],
    notifications: [],
    validations: [
      { id: 'assessmentCompleted', title: 'Assessment Completed', desc: 'Pre-screen evaluation test completed', required: true },
      { id: 'screeningCompleted', title: 'Screening Completed', desc: 'Initial recruiter screening call recorded', required: true }
    ],
    validationSubtitle: 'The candidate cannot move to the next stage unless:',
    guideline: 'Keep screening calls brief (15-20 mins) to assess basic qualifications and communication skills.',
    sla: '48 Hours'
  },
  'Interview': {
    description: 'Candidates advance to this stage to complete structured domain evaluations, portfolio reviews, and interviewer panel sessions.',
    isCustomInterviewStage: true,
    interviewConfig: {
      interviewMode: 'Online', // 'Face to face' | 'Online'
      scheduleAutomatically: true,
      aiConducted: 'Yes', // 'Yes' | 'No'
      interviewers: ['Priya Sharma (Tech Lead)', 'Amit Verma (Senior Architect)'],
      duration: '45 Minutes',
      interviewLink: 'https://meet.google.com/talentflow-interview',
      sendInterviewLink: true
    },
    notificationsSectionTitle: 'Notifications / Reminders',
    notifications: [
      { id: 'notifReminder', title: 'Interview Reminder: 24 hours before', active: true },
      { id: 'notifFeedback', title: 'Collect feedback from candidate/interviewee after interview', active: true },
      { id: 'notifNoShow', title: 'Alert on No-Show', active: true }
    ],
    validations: [
      { id: 'interviewCompleted', title: 'Interview Completed', required: true },
      { id: 'scorecardCompleted', title: 'Scorecard Completed', required: true }
    ],
    backgroundCheck: {
      required: true,
      passed: true,
      sendEmailReferences: true,
      emailTemplate: 'Standard Reference Check Request Template'
    },
    validationSubtitle: 'The candidate cannot move to the next stage unless:',
    guideline: 'Scorecards should be filled out within 2 hours post-interview for accurate evaluation.',
    sla: '3 Days'
  },
  'Offer': {
    description: 'Candidates enter this stage when selected for hiring to review compensation, equity terms, and the formal employment package.',
    actions: [],
    notificationsSectionTitle: 'Notifications',
    notifications: [
      { id: 'alertOfferAcceptance', title: 'Alert on Offer Acceptance', active: true },
      { id: 'alertOfferDelayed', title: 'Alert when Offer Acceptance is Delayed', active: true }
    ],
    validations: [
      { id: 'offerLetterGenerated', title: 'Offer Letter Generated', required: true },
      { id: 'offerLetterSigned', title: 'Offer Letter Signed', required: true },
      { id: 'referencesChecked', title: 'References Checked', required: true },
      { id: 'backgroundCheckCleared', title: 'Background Check Cleared', required: true }
    ],
    validationSubtitle: 'The candidate cannot move to the next stage unless:',
    guideline: 'Extend formal offers within 24 hours of decision to maximize acceptance rate.',
    sla: '24 Hours'
  },
  'Hired': {
    description: 'Hired is a terminal stage. Once an application reaches Hired, the hiring workflow for that application is completed.',
    actionsSectionTitle: 'Actions',
    actions: [
      {
        id: 'markHired',
        title: 'Mark candidate/application as Hired',
        active: true
      },
      {
        id: 'triggerOnboardingProcess',
        title: 'Trigger relevant downstream hiring/onboarding process, if configured',
        active: true
      }
    ],
    notificationsSectionTitle: 'Notifications',
    notificationsSubtitle: 'Send notification to:',
    notifications: [
      { id: 'notifHiringTeam', title: 'Hiring Team', active: true, template: 'Hiring Team - New Hire Confirmation Template' },
      { id: 'notifAgency', title: 'Agency involved, if applicable', active: true, template: 'Agency - Candidate Placement & Commission Confirmation' },
      { id: 'notifCandidate', title: 'Candidate', active: true, template: 'Candidate - Formal Welcome & Next Steps Packet' }
    ],
    validations: [],
    validationSubtitle: 'The candidate cannot move to the next stage unless:',
    guideline: 'Ensure all onboarding workflows and team announcements are scheduled.',
    sla: 'Immediate'
  },
  'Rejected': {
    description: 'Rejected is a terminal stage.',
    actions: [],
    notificationsSectionTitle: 'Notifications',
    notifications: [
      { 
        id: 'notifRejectCandidate', 
        title: 'Candidate', 
        desc: 'Send rejection email', 
        active: true, 
        template: 'Standard Polite Rejection Template' 
      },
      { 
        id: 'notifRejectAgency', 
        title: 'Agency', 
        desc: 'If an agency is associated with the application: Send rejection email to agency', 
        active: true, 
        template: 'Agency - Candidate Non-Selection Notice' 
      },
      { 
        id: 'notifRejectHiringTeam', 
        title: 'Hiring Team', 
        desc: 'Notify Hiring Team', 
        active: true 
      }
    ],
    validationsSectionTitle: 'Validations Before Rejection',
    validations: [
      { id: 'scorecardCompleted', title: 'Scorecard Completed', required: true },
      { id: 'hiringManagerApproval', title: 'Hiring Manager Approval', required: true }
    ],
    validationSubtitle: 'Before the candidate can be rejected:',
    guideline: 'Keep candidate in talent pool for future relevant opportunities.',
    sla: 'Immediate'
  }
};

const getInitialConfig = (systemStage) => {
  const base = DEFAULT_STAGE_CONFIGS[systemStage] || DEFAULT_STAGE_CONFIGS['Interview'];
  return {
    ...base,
    description: base.description || '',
    actions: (base.actions || []).map(a => ({ ...a })),
    notifications: (base.notifications || []).map(n => ({ ...n })),
    validations: (base.validations || []).map(v => ({ ...v })),
    interviewConfig: base.interviewConfig ? { ...base.interviewConfig } : undefined,
    backgroundCheck: base.backgroundCheck ? { ...base.backgroundCheck } : undefined
  };
};

function MiniToggle({ checked, onChange, activeColor = 'bg-[#1890FF]', label }) {
  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="cursor-pointer select-none group/toggle shrink-0"
      title={label ? `${label}: ${checked ? 'Enabled' : 'Disabled'}` : undefined}
    >
      <div
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex w-7 h-4 items-center rounded-full transition-colors duration-200 ease-in-out p-0.5 shadow-inner ${
          checked ? activeColor : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <div 
          className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-xs ${
            checked ? 'translate-x-3' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
}

function SortableAccordionStageItem({ 
  stage, 
  index, 
  totalStages, 
  updateStage, 
  updateInterviewConfig,
  updateBackgroundCheck,
  removeStage, 
  isExpanded, 
  onToggle, 
  onToggleAction,
  onToggleActionSubOption,
  onToggleNotification,
  onUpdateNotificationTemplate,
  onToggleValidation,
  isEditing,
  onOpenAiAgentModal,
  aiAgents
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : (isExpanded ? 60 : 50 - index),
  };

  const stageConfig = stage.config || getInitialConfig(stage.systemStage);
  const isInterview = stage.systemStage === 'Interview' || stageConfig.isCustomInterviewStage;
  
  const activeActionsCount = isInterview
    ? (stageConfig.interviewConfig?.scheduleAutomatically ? 1 : 0)
    : (stageConfig.actions || []).filter(a => a.active).length;
    
  const activeNotifsCount = (stageConfig.notifications || []).filter(n => n.active).length;
  const activeValidationsCount = (stageConfig.validations || []).filter(v => v.required).length;
  const hasActions = isInterview || (stageConfig.actions || []).length > 0;
  const hasNotifications = (stageConfig.notifications || []).length > 0;
  const hasValidations = isInterview || (stageConfig.validations || []).length > 0;

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <div 
        className={`bg-white dark:bg-[#161c24] rounded-xl border transition-all ${
          isDragging
            ? 'opacity-60 border-[#1890FF] shadow-lg scale-[1.01] overflow-hidden'
            : isExpanded
              ? 'border-[#1890FF]/60 shadow-xs ring-1 ring-[#1890FF]/20 overflow-visible'
              : 'border-gray-200/90 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 overflow-hidden'
        }`}
      >
        {/* Horizontal Accordion Header (Compact) */}
        <div 
          onClick={onToggle}
          className={`flex items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-2.5 cursor-pointer select-none transition-colors ${
            isExpanded 
              ? 'bg-blue-50/30 dark:bg-[#1890FF]/5 border-b border-gray-100 dark:border-gray-800/60' 
              : 'hover:bg-gray-50/70 dark:hover:bg-gray-800/30'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {isEditing && (
              <div 
                {...attributes} 
                {...listeners} 
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5 shrink-0 -ml-1" 
                onClick={e => e.stopPropagation()}
                title="Drag to reorder stage"
              >
                <GripVertical size={14} />
              </div>
            )}

            {/* Step Number */}
            <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
              isExpanded 
                ? 'bg-[#1890FF] text-white shadow-xs' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}>
              {index + 1}
            </div>

            {/* Stage Title & Subtitle */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 flex-wrap">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={stage.customName}
                    onClick={e => e.stopPropagation()}
                    onChange={(e) => updateStage(index, 'customName', e.target.value)}
                    className="px-2.5 py-1 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-bold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF] max-w-xs"
                  />
                ) : (
                  <h3 className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">
                    {stage.customName}
                  </h3>
                )}

                {/* System Mapping Badge */}
                <span className={`text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border w-fit ${getStageColor(stage.systemStage)}`}>
                  {stage.systemStage}
                </span>

                {/* Terminal Badge (Redish brand color) */}
                {stage.isTerminal && (
                  <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#FF5630]/10 dark:bg-[#FF5630]/20 text-[#FF5630] border border-[#FF5630]/20">
                    Terminal
                  </span>
                )}
              </div>
              {stageConfig.description && (
                <p className="text-[12px] text-[#000000] dark:text-gray-300 mt-0.5 max-w-2xl leading-snug font-medium">
                  {stageConfig.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Summary Chips (Horizontal) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-[12px] text-[#000000] dark:text-white font-semibold">
              {hasActions && (
                <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-200/80 dark:border-gray-700 text-[#000000] dark:text-white">
                  <Zap size={11} className="text-[#1890FF]" />
                  <span>{activeActionsCount} {activeActionsCount === 1 ? 'Action' : 'Actions'}</span>
                </span>
              )}
              
              {hasNotifications && (
                <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-200/80 dark:border-gray-700 text-[#000000] dark:text-white">
                  <Mail size={11} className="text-[#1890FF]" />
                  <span>{activeNotifsCount} {activeNotifsCount === 1 ? 'Alert' : 'Alerts'}</span>
                </span>
              )}

              {hasValidations && (
                <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-200/80 dark:border-gray-700 text-[#000000] dark:text-white">
                  <CheckCircle2 size={11} className="text-[#00A76F]" />
                  <span>{activeValidationsCount} Validations</span>
                </span>
              )}

              {!stage.isTerminal && stageConfig.sla && (
                <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-200/80 dark:border-gray-700 text-[#000000] dark:text-white">
                  <Clock size={11} className="text-[#FFC107]" />
                  <span>SLA: {stageConfig.sla}</span>
                </span>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                <div className="w-26">
                  <SearchableSelect 
                    options={SYSTEM_STAGES.map(sys => ({ label: sys, value: sys }))}
                    value={stage.systemStage}
                    onChange={(value) => updateStage(index, 'systemStage', value)}
                    showSearch={false}
                    size="xs"
                  />
                </div>
                {totalStages > 2 && (
                  <button 
                    onClick={() => removeStage(index)}
                    className="p-1 text-gray-400 hover:text-[#FF5630] rounded-lg transition-colors cursor-pointer"
                    title="Delete stage"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Accordion Expand Icon */}
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-gray-400 transition-all ${isExpanded ? 'rotate-180 text-[#1890FF] bg-blue-50/80 dark:bg-[#1890FF]/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Accordion Expanded Body */}
        {isExpanded && (
          <div className="p-4 sm:p-5 bg-white dark:bg-[#161c24] space-y-4.5 animate-fade-in">
            <div className={`grid grid-cols-1 ${
              (hasActions && hasNotifications && hasValidations) ? 'lg:grid-cols-3' : 
              ((hasActions ? 1 : 0) + (hasNotifications ? 1 : 0) + (hasValidations ? 1 : 0) === 2) ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
            } gap-4 items-start`}>
              
              {/* Section 1: Actions on Entry / Offer Actions */}
              {hasActions && (
                <div className="space-y-3 bg-gray-50/50 dark:bg-gray-800/20 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800/80">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200/50 dark:border-gray-800">
                    <h4 className="text-[12px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap size={13} className="text-[#1890FF]" /> {stageConfig.actionsSectionTitle || 'Actions on Entry'}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] border border-[#1890FF]/20">
                      {activeActionsCount} Active
                    </span>
                  </div>

                {/* Specific Layout for Technical Interview Stage */}
                {isInterview ? (
                  <div className="p-3 rounded-lg bg-white dark:bg-[#161c24] border border-gray-200/70 dark:border-gray-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6.5 h-6.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                        <Video size={13} />
                      </div>
                      <span className="text-[13px] font-bold text-[#212b36] dark:text-white">
                        Interview Configuration
                      </span>
                    </div>

                    {/* Interview Mode: Face to face / Online */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">
                        Interview Mode
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Face to face', 'Online'].map(mode => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => updateInterviewConfig(stage.id, 'interviewMode', mode)}
                            className={`py-1.5 px-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer text-center ${
                              stageConfig.interviewConfig?.interviewMode === mode
                                ? 'bg-[#1890FF] text-white shadow-2xs'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* If Online is selected: show next controls */}
                    {stageConfig.interviewConfig?.interviewMode === 'Online' && (
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2.5 animate-fade-in">
                        
                        {/* Schedule Interview Automatically */}
                        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800">
                          <span className="text-[13px] font-medium text-[#212b36] dark:text-white">
                            Schedule Interview Automatically
                          </span>
                          <MiniToggle 
                            checked={stageConfig.interviewConfig?.scheduleAutomatically ?? true} 
                            onChange={() => updateInterviewConfig(stage.id, 'scheduleAutomatically', !stageConfig.interviewConfig?.scheduleAutomatically)}
                            label="Schedule Interview Automatically"
                          />
                        </div>

                        {/* If Yes: nested AI vs Interviewer options */}
                        {stageConfig.interviewConfig?.scheduleAutomatically && (
                          <div className="pl-2 space-y-2 border-l-2 border-[#1890FF]/30 ml-1">
                            {/* Will the AI Agent conduct the interview? */}
                            <div className="space-y-1.5">
                              <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 block">
                                Will the AI Agent conduct the interview?
                              </label>
                              <div className="grid grid-cols-2 gap-1.5">
                                {['Yes', 'No'].map(opt => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => updateInterviewConfig(stage.id, 'aiConducted', opt)}
                                    className={`py-1 px-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer text-center ${
                                      stageConfig.interviewConfig?.aiConducted === opt
                                        ? 'bg-[#1890FF] text-white shadow-2xs'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* If AI Agent Yes: Configure AI Interview Agent */}
                            {stageConfig.interviewConfig?.aiConducted === 'Yes' ? (
                              <button
                                type="button"
                                onClick={() => onOpenAiAgentModal && onOpenAiAgentModal(stage.id, stage.customName || 'Interview')}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-50/60 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all cursor-pointer text-left"
                              >
                                <span className="text-[13px] font-medium text-[#1890FF] flex items-center gap-1.5">
                                  <Bot size={13} />
                                  Configure AI Interview Agent
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1890FF] text-white">
                                  {aiAgents?.filter(a => a.enabled).length > 0 ? `${aiAgents.filter(a => a.enabled).length} Enabled` : 'Configure'}
                                </span>
                              </button>
                            ) : (
                              /* If No: Assign Interviewer(s) */
                              <div className="space-y-1">
                                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400">
                                  Assign Interviewer(s)
                                </label>
                                <div className="p-2 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 text-[13px] font-semibold text-[#212b36] dark:text-white flex items-center gap-1.5">
                                  <Users size={12} className="text-[#1890FF] shrink-0" />
                                  <span>Priya Sharma (Tech Lead), Amit Verma (Architect)</span>
                                </div>
                              </div>
                            )}

                            {/* Interview Duration */}
                            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800">
                              <span className="text-[13px] font-medium text-[#212b36] dark:text-white">
                                Interview Duration
                              </span>
                              <span className="text-[13px] font-bold text-[#1890FF] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                                {stageConfig.interviewConfig?.duration || '45 Minutes'}
                              </span>
                            </div>

                            {/* Interview Link */}
                            <div className="space-y-1">
                              <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400">
                                Interview Link
                              </label>
                              <div className="p-2 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 text-[13px] font-semibold text-[#1890FF] truncate">
                                {stageConfig.interviewConfig?.interviewLink || 'https://meet.google.com/talentflow-interview'}
                              </div>
                            </div>

                            {/* Send Interview Link Toggle */}
                            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800">
                              <span className="text-[13px] font-medium text-[#212b36] dark:text-white">
                                Send Interview Link
                              </span>
                              <MiniToggle 
                                checked={stageConfig.interviewConfig?.sendInterviewLink ?? true} 
                                onChange={() => updateInterviewConfig(stage.id, 'sendInterviewLink', !stageConfig.interviewConfig?.sendInterviewLink)}
                                label="Send Interview Link"
                              />
                            </div>

                          </div>
                        )}

                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Actions Rendering for other stages */
                  <div className="space-y-2.5">
                    {(stageConfig.actions || []).map((action) => (
                      <div 
                        key={action.id}
                        className="p-3 rounded-lg bg-white dark:bg-[#161c24] border border-gray-200/70 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6.5 h-6.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                              <Sparkles size={13} />
                            </div>
                            <span className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">
                              {action.title}
                            </span>
                          </div>

                          {!action.scheduleLabel && (
                            <MiniToggle 
                              checked={action.active} 
                              onChange={() => onToggleAction(stage.id, action.id)} 
                              label={action.title}
                            />
                          )}
                        </div>

                        {action.scheduleLabel && (
                          <div className="pt-1 space-y-2">
                            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800">
                              <span className="text-[13px] font-medium text-[#212b36] dark:text-white">
                                {action.scheduleLabel}
                              </span>
                              <MiniToggle 
                                checked={action.active} 
                                onChange={() => onToggleAction(stage.id, action.id)} 
                                label={action.scheduleLabel}
                              />
                            </div>

                            {action.active && (
                              <div className="pl-2 space-y-1.5 animate-fade-in border-l-2 border-[#1890FF]/30 ml-1 mt-2">
                                <div 
                                  onClick={() => onOpenAiAgentModal && onOpenAiAgentModal(stage.id, stage.customName || 'Screening')}
                                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 hover:border-[#1890FF]/60 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 cursor-pointer transition-all group/ai"
                                >
                                  <span className="text-[13px] font-medium text-[#212b36] dark:text-white flex items-center gap-1.5 group-hover/ai:text-[#1890FF] transition-colors">
                                    <Bot size={13} className="text-[#1890FF]" />
                                    Configure AI Agent
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] border border-[#1890FF]/20 group-hover/ai:bg-[#1890FF] group-hover/ai:text-white transition-all">
                                    {aiAgents?.filter(a => a.enabled).length > 0 ? `${aiAgents.filter(a => a.enabled).length} Enabled` : 'Configure'}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800">
                                  <span className="text-[13px] font-medium text-[#212b36] dark:text-white">
                                    Send Assessment Link
                                  </span>
                                  <MiniToggle 
                                    checked={action.sendAssessmentActive ?? true} 
                                    onChange={() => onToggleActionSubOption(stage.id, action.id, 'sendAssessmentActive')} 
                                    label="Send Assessment Link"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {action.desc && !action.scheduleLabel && (
                          <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed pl-1">
                            {action.desc}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Notifications / Reminders */}
              {hasNotifications && (
                <div className="space-y-3 bg-gray-50/50 dark:bg-gray-800/20 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800/80">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200/50 dark:border-gray-800">
                    <h4 className="text-[12px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={13} className="text-[#1890FF]" /> 
                      {stageConfig.notificationsSectionTitle || 'Notifications on Entry'}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] border border-[#1890FF]/20">
                      {activeNotifsCount} Active
                    </span>
                  </div>

                  {stageConfig.notificationsSubtitle && (
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
                      {stageConfig.notificationsSubtitle}
                    </p>
                  )}

                  <div className="space-y-2">
                    {(stageConfig.notifications || []).map((notif, notifIdx) => {
                      const Icon = NOTIF_ICONS[notif.id] || Mail;
                      const hasTemplate = notif.template !== undefined;
                      return (
                        <div 
                          key={notif.id}
                          style={{ zIndex: (stageConfig.notifications.length - notifIdx) * 10 }}
                          className="relative p-2.5 rounded-lg bg-white dark:bg-[#161c24] border border-gray-200/70 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all flex flex-col gap-1.5 focus-within:z-50"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="w-6.5 h-6.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                                <Icon size={13} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">
                                  {notif.title}
                                </p>
                                {notif.desc && (
                                  <p className="text-[12px] text-gray-400 truncate">
                                    {notif.desc}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Smaller Compact Mini Platform Toggle Switch */}
                            <MiniToggle 
                              checked={notif.active} 
                              onChange={() => onToggleNotification(stage.id, notif.id)} 
                              label={notif.title}
                            />
                          </div>

                          {/* Email Template Selector for Notifications that support it */}
                          {notif.active && hasTemplate && (
                            <div className="mt-1 pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1 animate-fade-in">
                              <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400">
                                Select email template
                              </label>
                              <SearchableSelect
                                options={HIRED_TEMPLATE_OPTIONS[notif.id] || REJECT_TEMPLATE_OPTIONS[notif.id] || EMAIL_TEMPLATE_OPTIONS}
                                value={notif.template}
                                onChange={(val) => onUpdateNotificationTemplate && onUpdateNotificationTemplate(stage.id, notif.id, val)}
                                showSearch={false}
                                size="xs"
                                placement="bottom"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 3: Validations Before Next Stage */}
              {hasValidations && (
                <div className="space-y-3 bg-gray-50/50 dark:bg-gray-800/20 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800/80">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200/50 dark:border-gray-800">
                    <h4 className="text-[12px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-[#00A76F]" /> {stageConfig.validationsSectionTitle || 'Validations Before Next Stage'}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-[#00A76F] border border-[#00A76F]/20">
                      {activeValidationsCount} Required
                    </span>
                  </div>

                  <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
                    {stageConfig.validationSubtitle || 'The candidate cannot move to the next stage unless:'}
                  </p>

                  <div className="space-y-2">
                    {/* Standard Validations */}
                    {(stageConfig.validations || []).map((val) => (
                      <div 
                        key={val.id}
                        className="p-2.5 rounded-lg bg-white dark:bg-[#161c24] border border-gray-200/70 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-6.5 h-6.5 rounded-md flex items-center justify-center shrink-0 ${
                            val.required 
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-[#00A76F]' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                          }`}>
                            <CheckCircle2 size={13} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">
                              {val.title}
                            </p>
                          </div>
                        </div>

                        {/* Smaller Compact Mini Platform Toggle Switch */}
                        <MiniToggle 
                          checked={val.required} 
                          onChange={() => onToggleValidation(stage.id, val.id)} 
                          activeColor="bg-[#00A76F]"
                          label={val.title}
                        />
                      </div>
                    ))}

                    {/* Interview Stage Specific Background Check & References Section */}
                    {isInterview && (
                      <div className="p-3 rounded-lg bg-white dark:bg-[#161c24] border border-gray-200/70 dark:border-gray-800 space-y-3 pt-3 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-[#00A76F] flex items-center justify-center shrink-0">
                            <ShieldCheck size={13} />
                          </div>
                          <span className="text-[13px] font-bold text-[#212b36] dark:text-white">
                            Background Check
                          </span>
                        </div>

                        {/* Is Background Check Required to Move Forward? */}
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 block">
                            Is Background Check Required to Move Forward?
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {['Yes', 'No'].map(ans => {
                              const isSelected = ans === 'Yes' 
                                ? (stageConfig.backgroundCheck?.required ?? true)
                                : !(stageConfig.backgroundCheck?.required ?? true);
                              return (
                                <button
                                  key={ans}
                                  type="button"
                                  onClick={() => updateBackgroundCheck(stage.id, 'required', ans === 'Yes')}
                                  className={`py-1 px-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer text-center ${
                                    isSelected
                                      ? 'bg-[#00A76F] text-white shadow-2xs'
                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {ans}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* If Yes / No status */}
                        {(stageConfig.backgroundCheck?.required ?? true) ? (
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/40">
                            <span className="text-[13px] font-medium text-[#212b36] dark:text-white">
                              Background Check Passed
                            </span>
                            <MiniToggle 
                              checked={stageConfig.backgroundCheck?.passed ?? true} 
                              onChange={() => updateBackgroundCheck(stage.id, 'passed', !stageConfig.backgroundCheck?.passed)}
                              activeColor="bg-[#00A76F]"
                              label="Background Check Passed"
                            />
                          </div>
                        ) : (
                          <div className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 text-[13px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-gray-400" />
                            <span>Background Check Not Required</span>
                          </div>
                        )}

                        {/* Send email to references */}
                        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800">
                          <span className="text-[13px] font-medium text-[#212b36] dark:text-white">
                            Send email to references
                          </span>
                          <MiniToggle 
                            checked={stageConfig.backgroundCheck?.sendEmailReferences ?? true} 
                            onChange={() => updateBackgroundCheck(stage.id, 'sendEmailReferences', !stageConfig.backgroundCheck?.sendEmailReferences)}
                            activeColor="bg-[#00A76F]"
                            label="Send email to references"
                          />
                        </div>

                        {/* Select email template */}
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400">
                            Select email template
                          </label>
                          <SearchableSelect
                            options={EMAIL_TEMPLATE_OPTIONS}
                            value={stageConfig.backgroundCheck?.emailTemplate || 'Standard Reference Check Request Template'}
                            onChange={(val) => updateBackgroundCheck(stage.id, 'emailTemplate', val)}
                            showSearch={false}
                            size="xs"
                            placement="bottom"
                          />
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* SLA & Stage Guidelines Footer / Terminal Stage Banner */}
            {stage.isTerminal ? (
              <div className="px-3.5 py-2.5 rounded-xl bg-[#FF5630]/5 dark:bg-[#FF5630]/10 border border-[#FF5630]/20 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[#FF5630]/15 text-[#FF5630] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={13} className="text-[#FF5630]" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[12px] font-bold text-[#FF5630]">Terminal:</span>
                    <span className="text-[12px] text-gray-700 dark:text-gray-300 font-medium">
                      Applications reaching this stage complete the recruitment workflow. No additional progression gate validations apply.
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF5630] text-white shrink-0">
                  Workflow Complete
                </span>
              </div>
            ) : (
              <div className="px-3.5 py-2.5 rounded-xl bg-blue-50/40 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <Clock size={14} className="text-[#1890FF] shrink-0" />
                  <span className="text-[12px] font-bold text-[#1890FF]">Stage SLA: {stageConfig.sla}</span>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <p className="text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed truncate">{stageConfig.guideline}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPipeline({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [stages, setStages] = useState([
    { 
      id: '1', 
      customName: 'Applied', 
      systemStage: 'Applied', 
      isTerminal: false,
      config: getInitialConfig('Applied')
    },
    { 
      id: '2', 
      customName: 'Screening', 
      systemStage: 'Screening', 
      isTerminal: false,
      config: getInitialConfig('Screening')
    },
    { 
      id: '3', 
      customName: 'Technical Interview', 
      systemStage: 'Interview', 
      isTerminal: false,
      config: getInitialConfig('Interview')
    },
    { 
      id: '4', 
      customName: 'Offer', 
      systemStage: 'Offer', 
      isTerminal: false,
      config: getInitialConfig('Offer')
    },
    { 
      id: '5', 
      customName: 'Hired', 
      systemStage: 'Hired', 
      isTerminal: true,
      config: getInitialConfig('Hired')
    },
    { 
      id: '6', 
      customName: 'Rejected', 
      systemStage: 'Rejected', 
      isTerminal: true,
      config: getInitialConfig('Rejected')
    }
  ]);

  // Track expanded accordion items - expanded by default for stage 1, 2, and 3
  const [expandedIds, setExpandedIds] = useState(['1', '2', '3']);

  const toggleAccordion = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const expandAll = () => setExpandedIds(stages.map(s => s.id));
  const collapseAll = () => setExpandedIds([]);

  const updateStage = (index, field, value) => {
    const newStages = [...stages];
    if (field === 'systemStage') {
      newStages[index] = { 
        ...newStages[index], 
        [field]: value,
        config: getInitialConfig(value)
      };
    } else {
      newStages[index] = { ...newStages[index], [field]: value };
    }
    setStages(newStages);
  };

  const updateInterviewConfig = (stageId, key, value) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        const currentConfig = stage.config || getInitialConfig(stage.systemStage);
        return {
          ...stage,
          config: {
            ...currentConfig,
            interviewConfig: {
              ...(currentConfig.interviewConfig || {}),
              [key]: value
            }
          }
        };
      })
    );
  };

  const updateBackgroundCheck = (stageId, key, value) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        const currentConfig = stage.config || getInitialConfig(stage.systemStage);
        return {
          ...stage,
          config: {
            ...currentConfig,
            backgroundCheck: {
              ...(currentConfig.backgroundCheck || {}),
              [key]: value
            }
          }
        };
      })
    );
  };

  const toggleAction = (stageId, actionId) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        const currentConfig = stage.config || getInitialConfig(stage.systemStage);
        const updatedActions = (currentConfig.actions || []).map(a => 
          a.id === actionId ? { ...a, active: !a.active } : a
        );
        return {
          ...stage,
          config: {
            ...currentConfig,
            actions: updatedActions
          }
        };
      })
    );
  };

  const toggleActionSubOption = (stageId, actionId, subOptionKey) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        const currentConfig = stage.config || getInitialConfig(stage.systemStage);
        const updatedActions = (currentConfig.actions || []).map(a => 
          a.id === actionId ? { ...a, [subOptionKey]: !a[subOptionKey] } : a
        );
        return {
          ...stage,
          config: {
            ...currentConfig,
            actions: updatedActions
          }
        };
      })
    );
  };

  const toggleNotification = (stageId, notifId) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        const currentConfig = stage.config || getInitialConfig(stage.systemStage);
        const updatedNotifs = (currentConfig.notifications || []).map(n => 
          n.id === notifId ? { ...n, active: !n.active } : n
        );
        return {
          ...stage,
          config: {
            ...currentConfig,
            notifications: updatedNotifs
          }
        };
      })
    );
  };

  const updateNotificationTemplate = (stageId, notifId, template) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        const currentConfig = stage.config || getInitialConfig(stage.systemStage);
        const updatedNotifs = (currentConfig.notifications || []).map(n => 
          n.id === notifId ? { ...n, template } : n
        );
        return {
          ...stage,
          config: {
            ...currentConfig,
            notifications: updatedNotifs
          }
        };
      })
    );
  };

  const toggleValidation = (stageId, valId) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        const currentConfig = stage.config || getInitialConfig(stage.systemStage);
        const updatedValidations = (currentConfig.validations || []).map(v => 
          v.id === valId ? { ...v, required: !v.required } : v
        );
        return {
          ...stage,
          config: {
            ...currentConfig,
            validations: updatedValidations
          }
        };
      })
    );
  };

  const removeStage = (index) => {
    const removedId = stages[index]?.id;
    setStages(stages.filter((_, i) => i !== index));
    setExpandedIds(prev => prev.filter(id => id !== removedId));
  };

  const addStage = () => {
    const newId = (Math.max(...stages.map(s => parseInt(s.id) || 0), 0) + 1).toString();
    const newStage = { 
      id: newId, 
      customName: 'New Round', 
      systemStage: 'Interview', 
      isTerminal: false,
      config: getInitialConfig('Interview')
    };
    setStages([...stages, newStage]);
    setExpandedIds(prev => [...prev, newId]);
  };

  const [aiAgents, setAiAgents] = useState(INITIAL_AI_AGENTS);
  const [isAiAgentModalOpen, setIsAiAgentModalOpen] = useState(false);
  const [activeModalStageId, setActiveModalStageId] = useState(null);
  const [activeModalStageName, setActiveModalStageName] = useState('Screening');
  const [configuringAgent, setConfiguringAgent] = useState(null);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [newAgentForm, setNewAgentForm] = useState({
    title: '',
    role: 'Screening',
    subtitle: 'English · Indian English · Normal',
    description: '',
    voice: 'Indian English (Aditi - Female)',
    tone: 'Normal',
    speed: '1.0x',
    instructions: '',
    questions: ['']
  });

  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const handleToggleAiAgent = (agentId) => {
    setAiAgents(prev => prev.map(a => a.id === agentId ? { ...a, enabled: !a.enabled } : a));
  };

  const handleCopyFromCompany = () => {
    setAiAgents(INITIAL_AI_AGENTS.map(agent => ({ ...agent })));
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleOpenAiAgentModal = (stageId, stageName = 'Screening') => {
    setActiveModalStageId(stageId);
    setActiveModalStageName(stageName);
    setConfiguringAgent(null);
    setIsCreatingAgent(false);
    setCopiedSuccess(false);
    setIsAiAgentModalOpen(true);
  };

  const handleSaveConfiguredAgent = (updatedAgent) => {
    setAiAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
    setConfiguringAgent(null);
  };

  const handleCreateAgent = () => {
    if (!newAgentForm.title.trim()) return;
    const newId = `custom-agent-${Date.now()}`;
    const created = {
      id: newId,
      title: newAgentForm.title.trim(),
      subtitle: newAgentForm.subtitle || 'English · Indian English · Normal',
      description: newAgentForm.description.trim() || 'Custom AI Agent for automated candidate evaluation.',
      enabled: false,
      role: newAgentForm.role || 'Screening',
      voice: newAgentForm.voice || 'Indian English (Aditi - Female)',
      tone: newAgentForm.tone || 'Normal',
      speed: '1.0x',
      duration: '30 Mins',
      instructions: newAgentForm.instructions.trim() || 'Conduct structured candidate conversation and assess evaluation criteria.',
      questions: (newAgentForm.questions || []).filter(q => q && q.trim().length > 0)
    };
    setAiAgents(prev => [...prev, created]);
    setNewAgentForm({
      title: '',
      role: 'Screening',
      subtitle: 'English · Indian English · Normal',
      description: '',
      voice: 'Indian English (Aditi - Female)',
      tone: 'Normal',
      speed: '1.0x',
      instructions: '',
      questions: ['']
    });
    setIsCreatingAgent(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex flex-col animate-fade-in space-y-6">
      <div className="w-full flex-1">
        
        {/* Main Pipeline Card */}
        <div className="bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all">
          
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-7.5 h-7.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <GitBranch size={15} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Recruitment Pipeline Stages</h2>
                <p className="text-[12px] text-gray-500">Configure hiring stages, automated candidate notifications, entry actions, and stage progression rules.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold text-gray-500">
                <button 
                  onClick={expandAll}
                  className="hover:text-[#1890FF] transition-colors cursor-pointer"
                >
                  Expand All
                </button>
                <span>•</span>
                <button 
                  onClick={collapseAll}
                  className="hover:text-[#1890FF] transition-colors cursor-pointer"
                >
                  Collapse All
                </button>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={addStage}
                    className="px-2.5 py-1 bg-[#1890FF]/10 text-[#1890FF] hover:bg-[#1890FF]/20 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Stage
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[13px] font-bold cursor-pointer shrink-0"
                    title="Done"
                  >
                    <Check size={11} className="text-white stroke-[2.5]" />
                    <span>Done</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                  title="Edit Pipeline"
                >
                  <Edit2 size={11} className="text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Top Visual Horizontal Stepper Track (Compact) */}
          <div className="mb-4 p-2.5 bg-gray-50/70 dark:bg-gray-800/40 rounded-xl border border-gray-200/60 dark:border-gray-800 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              {stages.map((stage, idx) => {
                const isExpanded = expandedIds.includes(stage.id);
                return (
                  <React.Fragment key={stage.id}>
                    <button
                      onClick={() => toggleAccordion(stage.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                        isExpanded 
                          ? 'bg-[#1890FF] text-white shadow-xs' 
                          : 'bg-white dark:bg-[#161c24] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#1890FF]/50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isExpanded ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{stage.customName}</span>
                      {stage.isTerminal && (
                        <span className={`text-[10px] font-extrabold uppercase px-1 py-0.2 rounded ${
                          isExpanded 
                            ? 'bg-white/25 text-white' 
                            : 'bg-[#FF5630]/15 text-[#FF5630]'
                        }`}>
                          Terminal
                        </span>
                      )}
                    </button>
                    {idx < stages.length - 1 && (
                      <ArrowRight size={12} className="text-gray-400 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Horizontal Accordion Stage Items List (Compact Spacing) */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {stages.map((stage, idx) => (
                  <SortableAccordionStageItem 
                    key={stage.id}
                    stage={stage}
                    index={idx}
                    totalStages={stages.length}
                    updateStage={updateStage}
                    updateInterviewConfig={updateInterviewConfig}
                    updateBackgroundCheck={updateBackgroundCheck}
                    removeStage={removeStage}
                    isExpanded={expandedIds.includes(stage.id)}
                    onToggle={() => toggleAccordion(stage.id)}
                    onToggleAction={toggleAction}
                    onToggleActionSubOption={toggleActionSubOption}
                    onToggleNotification={toggleNotification}
                    onUpdateNotificationTemplate={updateNotificationTemplate}
                    onToggleValidation={toggleValidation}
                    isEditing={isEditing}
                    onOpenAiAgentModal={handleOpenAiAgentModal}
                    aiAgents={aiAgents}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {isEditing && (
            <button 
              onClick={addStage}
              className="mt-4 w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#1890FF] rounded-xl text-[13px] font-bold text-gray-500 hover:text-[#1890FF] transition-all flex items-center justify-center gap-2 cursor-pointer bg-gray-50/40 dark:bg-gray-800/20"
            >
              <Plus size={15} /> Add New Pipeline Stage
            </button>
          )}

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
        <button 
          onClick={() => setSettingsActiveNav('Hiring Team')}
          className="px-6 py-2.5 text-[13px] font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Hiring Team
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-3 text-[13px] text-gray-600 hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => setSettingsActiveNav('Scorecards')}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl text-[13px] font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >
            Save and Continue to 'Scorecards'
          </button>
        </div>
      </div>

      {/* Configure AI Agent Modal */}
      {isAiAgentModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-100 dark:border-gray-800 overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-800 shrink-0 gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                    {configuringAgent 
                      ? `Configure ${configuringAgent.title}` 
                      : isCreatingAgent 
                        ? 'Create New AI Agent' 
                        : 'Configure AI Agents'}
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">
                    {configuringAgent 
                      ? 'Customize voice parameters, assessment prompts, and interview questions.'
                      : isCreatingAgent 
                        ? 'Build a specialized AI voice agent tailored to your recruitment stage.' 
                        : 'Enable and customize AI agents specifically for this job. Organization-wide defaults are managed under AI Platform → AI Agents.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!configuringAgent && !isCreatingAgent && (
                  <button
                    type="button"
                    onClick={handleCopyFromCompany}
                    className="px-3 py-1.5 rounded-lg border border-gray-200/90 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-[13px] font-bold text-gray-700 dark:text-gray-200 transition-all flex items-center gap-1.5 shadow-2xs hover:border-[#1890FF] hover:text-[#1890FF] cursor-pointer"
                    title="Copy settings from company-wide defaults"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check size={14} className="text-[#00A76F]" />
                        <span className="text-[#00A76F]">Copied from Company!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-[#1890FF]" />
                        <span>Copy from Company</span>
                      </>
                    )}
                  </button>
                )}

                <button 
                  onClick={() => {
                    setIsAiAgentModalOpen(false);
                    setConfiguringAgent(null);
                    setIsCreatingAgent(false);
                  }} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              {/* SUB-VIEW 1: Configure a Specific Agent */}
              {configuringAgent ? (
                <div className="space-y-4 animate-fade-in">
                  <button
                    onClick={() => setConfiguringAgent(null)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1890FF] hover:underline cursor-pointer mb-1"
                  >
                    <ArrowLeft size={14} /> Back to all agents
                  </button>

                  <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 space-y-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h4 className="text-[14px] font-bold text-[#212b36] dark:text-white">{configuringAgent.title}</h4>
                        <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{configuringAgent.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-600 dark:text-gray-400">Agent Status:</span>
                        <MiniToggle
                          checked={configuringAgent.enabled}
                          onChange={() => setConfiguringAgent(prev => ({ ...prev, enabled: !prev.enabled }))}
                          label="Agent Status"
                        />
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          configuringAgent.enabled ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {configuringAgent.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    {/* Grid Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                          Voice & Accent
                        </label>
                        <select
                          value={configuringAgent.voice}
                          onChange={(e) => setConfiguringAgent(prev => ({ ...prev, voice: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                        >
                          <option value="Indian English (Aditi - Female)">Indian English (Aditi - Female)</option>
                          <option value="Indian English (Priya - Female)">Indian English (Priya - Female)</option>
                          <option value="Indian English (Rohan - Male)">Indian English (Rohan - Male)</option>
                          <option value="Indian English (Vikram - Male)">Indian English (Vikram - Male)</option>
                          <option value="US English (Alex - Neutral)">US English (Alex - Neutral)</option>
                          <option value="UK English (Oliver - Professional)">UK English (Oliver - Professional)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                          Conversation Tone & Pace
                        </label>
                        <select
                          value={configuringAgent.tone}
                          onChange={(e) => setConfiguringAgent(prev => ({ ...prev, tone: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                        >
                          <option value="Normal">Normal (Standard Interviewer Pace)</option>
                          <option value="Empathetic">Empathetic & Supportive</option>
                          <option value="Analytical">Analytical & Thorough</option>
                          <option value="Professional">Formal & Professional</option>
                        </select>
                      </div>
                    </div>

                    {/* Instructions / Prompt */}
                    <div>
                      <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                        AI Instructions & Context
                      </label>
                      <textarea
                        rows={3}
                        value={configuringAgent.instructions}
                        onChange={(e) => setConfiguringAgent(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="System instructions for the AI Agent..."
                        className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF] resize-y"
                      />
                    </div>

                    {/* Screening Questions List */}
                    <div>
                      <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                        Core Evaluation Questions ({configuringAgent.questions?.length || 0})
                      </label>
                      <div className="space-y-2 mb-2">
                        {(configuringAgent.questions || []).map((q, qIdx) => (
                          <div key={qIdx} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#1890FF]/10 text-[#1890FF] text-[10.5px] font-bold flex items-center justify-center shrink-0">
                              {qIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={q}
                              onChange={(e) => {
                                const updated = [...configuringAgent.questions];
                                updated[qIdx] = e.target.value;
                                setConfiguringAgent(prev => ({ ...prev, questions: updated }));
                              }}
                              className="flex-1 px-3 py-1.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = configuringAgent.questions.filter((_, idx) => idx !== qIdx);
                                setConfiguringAgent(prev => ({ ...prev, questions: updated }));
                              }}
                              className="p-1 text-gray-400 hover:text-[#FF5630] transition-colors cursor-pointer"
                              title="Remove question"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newQuestionInput}
                          onChange={(e) => setNewQuestionInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newQuestionInput.trim()) {
                              setConfiguringAgent(prev => ({
                                ...prev,
                                questions: [...(prev.questions || []), newQuestionInput.trim()]
                              }));
                              setNewQuestionInput('');
                            }
                          }}
                          placeholder="Add a new question..."
                          className="flex-1 px-3 py-1.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newQuestionInput.trim()) {
                              setConfiguringAgent(prev => ({
                                ...prev,
                                questions: [...(prev.questions || []), newQuestionInput.trim()]
                              }));
                              setNewQuestionInput('');
                            }
                          }}
                          className="px-3 py-1.5 bg-[#1890FF] text-white text-[13px] font-bold rounded-lg hover:bg-[#0077e6] transition-colors cursor-pointer shrink-0"
                        >
                          Add Question
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                      <button
                        type="button"
                        onClick={() => setConfiguringAgent(null)}
                        className="px-4 py-2 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveConfiguredAgent(configuringAgent)}
                        className="px-5 py-2 bg-[#1890FF] text-white text-[13px] font-bold rounded-lg hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer"
                      >
                        Save Configuration
                      </button>
                    </div>

                  </div>
                </div>
              ) : isCreatingAgent ? (
                /* SUB-VIEW 2: Create a New Agent */
                <div className="space-y-4 animate-fade-in">
                  <button
                    onClick={() => setIsCreatingAgent(false)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1890FF] hover:underline cursor-pointer mb-1"
                  >
                    <ArrowLeft size={14} /> Back to all agents
                  </button>

                  <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800 space-y-3.5">
                    <h4 className="text-[14px] font-bold text-[#212b36] dark:text-white">Create Custom AI Voice Agent</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                          Agent Name *
                        </label>
                        <input
                          type="text"
                          value={newAgentForm.title}
                          onChange={(e) => setNewAgentForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Senior Tech Screener"
                          className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                          Agent Role / Stage
                        </label>
                        <select
                          value={newAgentForm.role}
                          onChange={(e) => setNewAgentForm(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                        >
                          <option value="Screening">Screening Call</option>
                          <option value="HR Interview">HR Interview</option>
                          <option value="Technical Interview">Technical Interview</option>
                          <option value="Managerial Interview">Managerial Interview</option>
                          <option value="Custom">Custom Assessment</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                          Voice & Accent
                        </label>
                        <select
                          value={newAgentForm.voice}
                          onChange={(e) => setNewAgentForm(prev => ({ ...prev, voice: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                        >
                          <option value="Indian English (Aditi - Female)">Indian English (Aditi - Female)</option>
                          <option value="Indian English (Priya - Female)">Indian English (Priya - Female)</option>
                          <option value="Indian English (Rohan - Male)">Indian English (Rohan - Male)</option>
                          <option value="Indian English (Vikram - Male)">Indian English (Vikram - Male)</option>
                          <option value="US English (Alex - Neutral)">US English (Alex - Neutral)</option>
                          <option value="UK English (Oliver - Professional)">UK English (Oliver - Professional)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                          Tone & Persona
                        </label>
                        <select
                          value={newAgentForm.tone}
                          onChange={(e) => setNewAgentForm(prev => ({ ...prev, tone: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                        >
                          <option value="Normal">Normal (English · Indian English · Normal)</option>
                          <option value="Empathetic">Empathetic</option>
                          <option value="Analytical">Analytical</option>
                          <option value="Professional">Professional</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                        Brief Description
                      </label>
                      <textarea
                        rows={2}
                        value={newAgentForm.description}
                        onChange={(e) => setNewAgentForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Short description of what this agent evaluates..."
                        className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                        System Instructions Prompt
                      </label>
                      <textarea
                        rows={2}
                        value={newAgentForm.instructions}
                        onChange={(e) => setNewAgentForm(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Instructions for the agent..."
                        className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF] resize-y"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                      <button
                        type="button"
                        onClick={() => setIsCreatingAgent(false)}
                        className="px-4 py-2 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!newAgentForm.title.trim()}
                        onClick={handleCreateAgent}
                        className="px-5 py-2 bg-[#1890FF] text-white text-[13px] font-bold rounded-lg hover:bg-[#0077e6] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        Create Agent
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                /* SUB-VIEW 3: Standard 4 AI Agent Cards + Create Custom Agent CTA Card */
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiAgents.map(agent => (
                      <div
                        key={agent.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          agent.enabled
                            ? 'border-[#1890FF] bg-blue-50/20 dark:bg-[#1890FF]/5 shadow-xs ring-1 ring-[#1890FF]/30'
                            : 'border-gray-200/80 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/20 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                      >
                        <div>
                          {/* Card Header: Title & Subtitle on left, Status Badge & Toggle on right */}
                          <div className="flex items-start justify-between gap-2.5 mb-2">
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                agent.enabled 
                                  ? 'bg-[#1890FF] text-white shadow-2xs' 
                                  : 'bg-gray-200/80 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                              }`}>
                                <Bot size={15} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white leading-snug">
                                  {agent.title}
                                </h4>
                                <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                                  {agent.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pt-0.5">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                agent.enabled
                                  ? 'bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                              }`}>
                                {agent.enabled ? 'Active' : 'Disabled'}
                              </span>
                              <MiniToggle
                                checked={agent.enabled}
                                onChange={() => handleToggleAiAgent(agent.id)}
                                label={agent.title}
                              />
                            </div>
                          </div>

                          {/* Brief Description - 13px body text */}
                          <p className="text-[13px] text-gray-600 dark:text-gray-300 mt-2.5 leading-relaxed">
                            {agent.description}
                          </p>
                        </div>

                        {/* Card Bottom: Voice details & Option to Configure */}
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
                          <span className="text-[12px] font-semibold text-gray-400 truncate flex items-center gap-1.5">
                            <AudioLines size={13} className="text-[#1890FF]" />
                            {agent.voice}
                          </span>

                          <button
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-bold text-[#1890FF] hover:bg-[#1890FF]/10 active:scale-95 transition-all cursor-pointer border border-[#1890FF]/30 shrink-0"
                          >
                            <Settings2 size={13} />
                            <span>Configure</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* "Create Agent" CTA Banner Card */}
                  <div 
                    className="p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700/80 hover:border-[#1890FF] dark:hover:border-[#1890FF] bg-gradient-to-r from-gray-50/60 via-white to-blue-50/20 dark:from-gray-800/20 dark:via-[#161c24] dark:to-blue-900/10 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#1890FF] group-hover:text-white transition-all shadow-2xs">
                        <Plus size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">
                            Create Custom Agent
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] border border-[#1890FF]/20 uppercase">
                            Custom
                          </span>
                        </div>
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Need a specialized interview stage or screening round? Build and configure a custom AI voice agent.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[13px] font-bold text-[#1890FF] group-hover:border-[#1890FF] group-hover:bg-[#1890FF] group-hover:text-white hover:bg-[#1890FF] hover:text-white active:scale-95 transition-all shrink-0 self-start sm:self-auto shadow-2xs cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>+ Create Agent</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
              <div className="text-[13px] text-gray-500">
                <span className="font-bold text-[#212b36] dark:text-white">
                  {aiAgents.filter(a => a.enabled).length}
                </span> of {aiAgents.length} Agents Enabled
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAiAgentModalOpen(false);
                    setConfiguringAgent(null);
                    setIsCreatingAgent(false);
                  }}
                  className="px-4 py-2 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAiAgentModalOpen(false);
                    setConfiguringAgent(null);
                    setIsCreatingAgent(false);
                  }}
                  className="px-5 py-2 bg-[#1890FF] text-white rounded-lg text-[13px] font-bold hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
