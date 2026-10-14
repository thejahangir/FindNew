import React, { useState } from 'react';
import { 
  GitBranch, Users, UserCheck, Video, Clock, 
  Sparkles, ChevronRight, Briefcase, MapPin, 
  FileText, ClipboardEdit, AlertCircle, Calendar, 
  CheckCircle2, ArrowUpRight, Check, Send, PhoneCall,
  User, ExternalLink, Star, ShieldCheck, HelpCircle
} from 'lucide-react';

export default function JobPipelineOverview({ 
  onNavigateToBoard, 
  onNavigateToCandidates, 
  onSelectCandidate,
  jobTitle = 'Senior AI Research Scientist' 
}) {
  const [activeTab, setActiveTab] = useState('new_applications');
  const [actionToast, setActionToast] = useState(null);

  const triggerActionFeedback = (msg) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3000);
  };

  // 5 Pipeline Queues with rich candidate profiles in grid view
  const stages = [
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
          currentDesignation: 'Senior Software Engineer',
          currentCompany: 'Infosys',
          experience: '5 YOE',
          location: 'Bangalore, India',
          matchScore: 92,
          currentStage: 'Inbound Resume Screening',
          attentionDetails: 'Applied 2h ago with 92% AI match rating. Strong background in React, Node.js & AWS distributed cloud architectures.',
          attentionType: 'info',
          primaryAction: 'Review Application',
          secondaryAction: 'Fast-Track',
          skills: ['React', 'Node.js', 'AWS', 'Docker']
        },
        {
          id: 102,
          name: 'Sneha Patil',
          currentDesignation: 'Frontend Systems Engineer',
          currentCompany: 'TCS Digital',
          experience: '3 YOE',
          location: 'Pune, India',
          matchScore: 88,
          currentStage: 'Agency Submission Review',
          attentionDetails: 'Submitted via TechTalent Partners. Notice period: 15 days (Immediate joiner advantage). Portfolio verified.',
          attentionType: 'warning',
          primaryAction: 'Review Application',
          secondaryAction: 'View Resume',
          skills: ['Vue', 'JavaScript', 'CSS3', 'Figma']
        },
        {
          id: 103,
          name: 'Karan Mehra',
          currentDesignation: 'Lead UI Developer',
          currentCompany: 'Wipro Technologies',
          experience: '4 YOE',
          location: 'Delhi NCR, India',
          matchScore: 85,
          currentStage: 'Direct Careers Inbound',
          attentionDetails: 'Completed online AI coding assessment with 85% benchmark. Awaiting initial recruiter triage.',
          attentionType: 'info',
          primaryAction: 'Review Application',
          secondaryAction: 'Shortlist',
          skills: ['React', 'Figma', 'TypeScript', 'HTML5']
        },
        {
          id: 104,
          name: 'Ankita Rao',
          currentDesignation: 'Full Stack React Engineer',
          currentCompany: 'Startup Inc',
          experience: '2 YOE',
          location: 'Hyderabad, India',
          matchScore: 81,
          currentStage: 'Employee Referral',
          attentionDetails: 'Referred by Priya Patel (Staff Engineer). Verified contributions to production microfrontends.',
          attentionType: 'info',
          primaryAction: 'Review Application',
          secondaryAction: 'Contact Recruiter',
          skills: ['React', 'Redux', 'Tailwind CSS']
        }
      ]
    },
    {
      id: 'pending_decision',
      name: 'Pending Decision',
      count: 14,
      icon: Clock,
      color: '#FFAB00',
      description: 'Completed interview loops awaiting final hiring decision',
      candidates: [
        {
          id: 201,
          name: 'Rahul Verma',
          currentDesignation: 'Senior Frontend Engineer',
          currentCompany: 'Flipkart',
          experience: '4 YOE',
          location: 'Bangalore, India',
          matchScore: 95,
          currentStage: 'Hiring Manager & Culture Review',
          attentionDetails: 'All 3 panel rounds completed with unanimous "Strong Hire" recommendation (4.8/5 avg). Awaiting offer proposal approval.',
          attentionType: 'warning',
          primaryAction: 'Approve Offer',
          secondaryAction: 'View Feedback',
          skills: ['React', 'Next.js', 'TypeScript', 'Web Vitals']
        },
        {
          id: 202,
          name: 'Nitin Gupta',
          currentDesignation: 'Senior Frontend Architect',
          currentCompany: 'Swiggy',
          experience: '3 YOE',
          location: 'Bangalore, India',
          matchScore: 90,
          currentStage: 'Technical Bar Raiser',
          attentionDetails: 'Completed final technical round 24 hours ago. Hiring Manager Amit needs to record final hire/no-hire decision.',
          attentionType: 'warning',
          primaryAction: 'Submit Decision',
          secondaryAction: 'View Scorecards',
          skills: ['React', 'Redux', 'Webpack', 'CI/CD']
        },
        {
          id: 203,
          name: 'Pooja Desai',
          currentDesignation: 'Staff Product Engineer',
          currentCompany: 'Paytm',
          experience: '5 YOE',
          location: 'Mumbai, India',
          matchScore: 92,
          currentStage: 'Executive Compensation Sync',
          attentionDetails: 'Compensation expectations aligned with requisition budget band. Pending approval from Department Director.',
          attentionType: 'info',
          primaryAction: 'Approve Candidate',
          secondaryAction: 'View Dossier',
          skills: ['System Design', 'Leadership', 'React', 'GraphQL']
        },
        {
          id: 204,
          name: 'Varun Khanna',
          currentDesignation: 'ML Systems Developer',
          currentCompany: 'Cognizant Research',
          experience: '4 YOE',
          location: 'Remote',
          matchScore: 89,
          currentStage: 'Panel Deliberation',
          attentionDetails: 'Mixed scores: 2 Hire, 1 Neutral on distributed scaling. Quick 15-minute debrief needed with tech lead.',
          attentionType: 'urgent',
          primaryAction: 'Schedule Debrief',
          secondaryAction: 'Read Comments',
          skills: ['PyTorch', 'Python', 'FastAPI', 'Docker']
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
          currentDesignation: 'Senior React Developer',
          currentCompany: 'Paytm',
          experience: '7 YOE',
          location: 'Noida, India',
          matchScore: 89,
          currentStage: 'Technical Interview Round 1',
          attentionDetails: 'Interview finished 28 hours ago with Vikram (Senior Architect). Scorecard is overdue by 4 hours. Automated reminder queued.',
          attentionType: 'urgent',
          primaryAction: 'Send Reminder',
          secondaryAction: 'Fill Scorecard',
          skills: ['GraphQL', 'Architecture', 'React', 'Jest']
        },
        {
          id: 302,
          name: 'Ankita Rao',
          currentDesignation: 'React Developer',
          currentCompany: 'Startup Inc',
          experience: '2 YOE',
          location: 'Hyderabad, India',
          matchScore: 81,
          currentStage: 'Culture & Collaboration Fit',
          attentionDetails: 'Interview concluded yesterday at 4:30 PM with Amit (Hiring Manager). Rubric feedback pending submission.',
          attentionType: 'warning',
          primaryAction: 'Send Reminder',
          secondaryAction: 'Fill Scorecard',
          skills: ['Tailwind CSS', 'Redux', 'Git', 'Agile']
        },
        {
          id: 303,
          name: 'Rohan Gupta',
          currentDesignation: 'Senior Data Scientist',
          currentCompany: 'PhonePe',
          experience: '4 YOE',
          location: 'Bangalore, India',
          matchScore: 99,
          currentStage: 'Technical Assessment Review',
          attentionDetails: 'Interviewer Neha completed 90-min technical round today. Evaluation notes not yet submitted into ATS scorecard.',
          attentionType: 'urgent',
          primaryAction: 'Send Reminder',
          secondaryAction: 'Preview Notes',
          skills: ['Python', 'Transformers', 'PyTorch', 'MLOps']
        },
        {
          id: 304,
          name: 'Kavita Das',
          currentDesignation: 'Research Scientist',
          currentCompany: 'IBM Research',
          experience: '5 YOE',
          location: 'Bangalore, India',
          matchScore: 86,
          currentStage: 'System Design Deep Dive',
          attentionDetails: 'Call finished 6 hours ago with Sanjay. Missing scorecard prevents advancing candidate to offer stage.',
          attentionType: 'warning',
          primaryAction: 'Remind Interviewer',
          secondaryAction: 'View Meeting',
          skills: ['System Design', 'Algorithms', 'Distributed AI']
        }
      ]
    },
    {
      id: 'reference_checks',
      name: 'Reference Checks',
      count: 6,
      icon: UserCheck,
      color: '#00A76F',
      description: 'Professional reference validation and background checks in progress',
      candidates: [
        {
          id: 401,
          name: 'Arjun Kumar',
          currentDesignation: 'UI Systems Developer',
          currentCompany: 'Microsoft',
          experience: '5 YOE',
          location: 'Hyderabad, India',
          matchScore: 95,
          currentStage: 'Professional Reference Verification',
          attentionDetails: '2 of 3 references completed (Direct Manager & Tech Lead verified with 5/5 score). Awaiting response from Senior Peer.',
          attentionType: 'info',
          primaryAction: 'Check Status',
          secondaryAction: 'Contact Peer',
          skills: ['React', 'FluentUI', 'C#', 'TypeScript']
        },
        {
          id: 402,
          name: 'Priya Patel',
          currentDesignation: 'Senior Software Engineer',
          currentCompany: 'Zomato',
          experience: '6 YOE',
          location: 'Gurgaon, India',
          matchScore: 96,
          currentStage: 'Executive Reference Review',
          attentionDetails: 'Reference questionnaire submitted by former VP of Engineering at Swiggy. Recruiter sign-off required.',
          attentionType: 'warning',
          primaryAction: 'Review Responses',
          secondaryAction: 'Download PDF',
          skills: ['React', 'Node.js', 'System Design', 'Kafka']
        },
        {
          id: 403,
          name: 'Siddharth Rao',
          currentDesignation: 'Senior AI Research Scientist',
          currentCompany: 'Microsoft Research',
          experience: '9 YOE',
          location: 'Bangalore, India',
          matchScore: 99,
          currentStage: 'Background & Degree Verification',
          attentionDetails: 'All 3 professional references verified with exceptional ratings. Academic credentials validated. Ready for offer signing.',
          attentionType: 'info',
          primaryAction: 'Finalize Check',
          secondaryAction: 'Proceed to Offer',
          skills: ['PyTorch', 'Distributed Training', 'LLMs', 'CUDA']
        },
        {
          id: 404,
          name: 'Ananya Sharma',
          currentDesignation: 'Senior React Developer',
          currentCompany: 'Google',
          experience: '8 YOE',
          location: 'Bangalore, India',
          matchScore: 98,
          currentStage: 'Reference Verification',
          attentionDetails: 'Contact links sent to provided references. 1 reference scheduled callback for tomorrow at 11:00 AM.',
          attentionType: 'info',
          primaryAction: 'View Reference Log',
          secondaryAction: 'Follow Up',
          skills: ['React', 'Architecture', 'Web Performance']
        }
      ]
    },
    {
      id: 'upcoming_interviews',
      name: 'Upcoming Interviews',
      count: 12,
      icon: Video,
      color: '#8E33FF',
      description: 'Scheduled candidate interviews confirmed on the calendar',
      candidates: [
        {
          id: 501,
          name: 'Ananya Sharma',
          currentDesignation: 'Senior React Developer',
          currentCompany: 'Google',
          experience: '8 YOE',
          location: 'Bangalore, India',
          matchScore: 98,
          currentStage: 'Technical Architecture Round',
          attentionDetails: 'Scheduled for Today, 2:00 PM via Zoom (45 mins). Interviewer: Amit Sharma. Live coding workspace generated.',
          attentionType: 'scheduled',
          primaryAction: 'Join Call',
          secondaryAction: 'View Prep Kit',
          skills: ['Performance', 'Architecture', 'React', 'TypeScript']
        },
        {
          id: 502,
          name: 'Pooja Iyer',
          currentDesignation: 'Senior Software Engineer',
          currentCompany: 'Amazon',
          experience: '6 YOE',
          location: 'Chennai, India',
          matchScore: 94,
          currentStage: 'Culture & Behavioral Fit',
          attentionDetails: 'Scheduled for Tomorrow, 10:30 AM via Google Meet (30 mins). Interviewer: Priya (Lead Talent Partner).',
          attentionType: 'scheduled',
          primaryAction: 'Join Call',
          secondaryAction: 'Reschedule',
          skills: ['Java', 'Spring', 'AWS', 'Microservices']
        },
        {
          id: 503,
          name: 'Sneha Patil',
          currentDesignation: 'Frontend Engineer',
          currentCompany: 'TCS Digital',
          experience: '3 YOE',
          location: 'Pune, India',
          matchScore: 88,
          currentStage: 'System Design Interview',
          attentionDetails: 'Scheduled for Tomorrow, 3:00 PM via Microsoft Teams (60 mins). Interviewer: Vikram. Rubric assigned.',
          attentionType: 'scheduled',
          primaryAction: 'Join Call',
          secondaryAction: 'View Guide',
          skills: ['Vue', 'JavaScript', 'CSS3', 'System Design']
        },
        {
          id: 504,
          name: 'Karan Mehra',
          currentDesignation: 'UI/UX Developer',
          currentCompany: 'Wipro',
          experience: '4 YOE',
          location: 'Delhi NCR, India',
          matchScore: 85,
          currentStage: 'Technical Assessment Review',
          attentionDetails: 'Scheduled for Thursday, 1:00 PM via Zoom (45 mins). Interviewer: Priya. Candidate accepted calendar invitation.',
          attentionType: 'scheduled',
          primaryAction: 'Join Call',
          secondaryAction: 'Candidate Details',
          skills: ['React', 'Figma', 'UI Design', 'HTML5']
        }
      ]
    }
  ];

  const currentStage = stages.find(s => s.id === activeTab) || stages[0];

  return (
    <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-xs space-y-5">
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-100 dark:border-gray-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
            <GitBranch size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white">
                Job Hiring Pipeline
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1890FF]/10 text-[#1890FF]">
                {stages.reduce((acc, s) => acc + s.count, 0)} Total Candidates
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Candidate queues for <span className="font-semibold text-gray-700 dark:text-gray-300">{jobTitle}</span>
            </p>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {actionToast && (
          <div className="px-3 py-1.5 rounded-xl bg-[#00A76F]/10 border border-[#00A76F]/30 text-xs font-bold text-[#00A76F] flex items-center gap-1.5 animate-fade-in">
            <Check size={14} />
            <span>{actionToast}</span>
          </div>
        )}
      </div>

      {/* PIPELINE TABS NAVIGATION */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-0 scrollbar-hide">
        {stages.map((stage) => {
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

      {/* TAB QUEUE SUBTITLE & CONTEXT */}
      <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span>{currentStage.description}</span>
        <span className="font-semibold text-gray-600 dark:text-gray-300">
          Showing {currentStage.candidates.length} of {currentStage.count} candidates in {currentStage.name}
        </span>
      </div>

      {/* CANDIDATES GRID VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {currentStage.candidates.map((cand) => (
          <div 
            key={cand.id}
            className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-200/80 dark:border-gray-800 p-5 shadow-xs hover:shadow-md hover:border-[#1890FF]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* 1. NAME WITH CURRENT DESIGNATION WITH CURRENT COMPANY */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1890FF]/20 to-[#1890FF]/5 text-[#1890FF] font-bold text-sm flex items-center justify-center shrink-0 ring-2 ring-white dark:ring-[#161c24]">
                    {cand.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <h4 
                      onClick={() => onSelectCandidate && onSelectCandidate(cand)}
                      className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors cursor-pointer truncate"
                      title={cand.name}
                    >
                      {cand.name}
                    </h4>

                    {/* Current Designation with Current Company */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-medium mt-0.5 truncate">
                      <Briefcase size={12} className="text-[#1890FF] shrink-0" />
                      <span className="truncate">
                        {cand.currentDesignation} at <span className="font-bold text-[#212b36] dark:text-white">{cand.currentCompany}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  cand.matchScore >= 90 
                    ? 'bg-[#00A76F]/10 text-[#00A76F] dark:text-[#22c55e]' 
                    : 'bg-[#FFAB00]/10 text-[#b78103] dark:text-[#FFAB00]'
                }`}>
                  {cand.matchScore}% Match
                </span>
              </div>

              {/* Extra details: Location & Experience */}
              <div className="flex items-center gap-3 text-[11px] text-gray-400 pl-13 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="shrink-0" />
                  {cand.location}
                </span>
                <span>•</span>
                <span>{cand.experience}</span>
              </div>

              {/* 2. CURRENT STAGE */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Current Stage:
                </span>
                <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1890FF]" />
                  {cand.currentStage}
                </span>
              </div>

              {/* 3. ATTENTION DETAILS */}
              <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed ${
                cand.attentionType === 'urgent' 
                  ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200/80 dark:border-red-900/40 text-red-700 dark:text-red-300'
                  : cand.attentionType === 'warning'
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-300'
                  : cand.attentionType === 'scheduled'
                  ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-200/80 dark:border-purple-900/40 text-purple-700 dark:text-purple-300'
                  : 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/40 text-blue-700 dark:text-blue-300'
              }`}>
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] uppercase tracking-wide opacity-80 mb-0.5">
                      Attention Details
                    </span>
                    <span className="text-xs">{cand.attentionDetails}</span>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {cand.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. ACTION BUTTONS */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerActionFeedback(`${cand.primaryAction} triggered for ${cand.name}`)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#1890FF] hover:bg-[#1890FF]/90 active:scale-98 text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
              >
                {cand.primaryAction}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSelectCandidate) onSelectCandidate(cand);
                  if (onNavigateToCandidates) onNavigateToCandidates();
                }}
                className="py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-[#1890FF] hover:text-[#1890FF] transition-colors cursor-pointer"
              >
                {cand.secondaryAction || 'View Profile'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER CTA TO FULL BOARD / ALL CANDIDATES */}
      <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100 dark:border-gray-800/80">
        <span className="text-gray-400">
          Showing 4 highlighted action items for {currentStage.name}
        </span>
        <button
          onClick={onNavigateToBoard}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#1890FF] hover:underline cursor-pointer"
        >
          <span>View all {currentStage.count} candidates in full board</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
