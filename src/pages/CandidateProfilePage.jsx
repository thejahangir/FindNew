import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
 ArrowLeft, Briefcase, MapPin, Clock, FileText, MessageSquare,
 Mail, Copy, ArrowRightLeft, GitBranch, MoreVertical, ChevronDown, Send,
 ChevronsRight, ChevronsLeft, Calendar, User, Star, Sparkles, UserPlus,
 CheckCircle, Video, StickyNote
} from 'lucide-react';
import RejectAgencyModal from '../components/dashboard/RejectAgencyModal';

const getInitials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const STAGE_HISTORY = [
 {
 id: 'application-review',
 name: 'Application Review',
 status: 'completed',
 entered: '2 Mar 2026',
 exited: '4 Mar 2026',
 days: 2,
 owner: 'Priya · Recruiter',
 outcome: 'Moved forward',
 summary: 'Resume and AI screen cleared the JD bar. Sourced via agency; compensation range in band.',
 notes: 'Strong React/Node baseline. Flagged limited AI research publications for interviewers to probe.'
 },
 {
 id: 'to-be-rejected',
 name: 'To Be Rejected',
 status: 'completed',
 entered: '4 Mar 2026',
 exited: '4 Mar 2026',
 days: 1,
 owner: 'Priya · Recruiter',
 outcome: 'Kept in process',
 summary: 'Ran against rejection criteria (skills gap, location, notice). Did not meet reject rules.',
 notes: 'Industry-knowledge gap is real but not a hard reject at this seniority. Probe in interviews.'
 },
 {
 id: 'interview-tech',
 name: 'Interview · Technical (Round 1)',
 status: 'completed',
 entered: '10 Mar 2026',
 exited: '10 Mar 2026',
 days: 1,
 owner: 'Rahul · Interviewer',
 outcome: 'Advance · 4.5/5',
 summary: 'Live coding and debugging. Clear communication; solid on frontend systems.',
 notes: 'Recommend a system-design round. Ask about training/serving ML systems next.'
 },
 {
 id: 'interview-design',
 name: 'Interview · System Design (Round 2)',
 status: 'completed',
 entered: '14 Mar 2026',
 exited: '14 Mar 2026',
 days: 1,
 owner: 'Amit · Hiring Manager',
 outcome: 'Advance · 4/5',
 summary: 'Designed a retrieval + ranking flow. Good product sense; thinner on research methodology.',
 notes: 'HM round should confirm whether we can coach the research gap or need a stronger scientist profile.'
 },
 {
 id: 'interview-hm',
 name: 'Interview · Hiring Manager (Round 3)',
 status: 'current',
 entered: '18 Mar 2026',
 exited: null,
 days: 2,
 owner: 'Amit · Hiring Manager',
 outcome: 'In progress',
 summary: 'Scheduled. Scorecard not submitted yet.',
 notes: 'Focus: research ownership, publication bar, and whether this person can lead model work vs. applied ML engineering.'
 },
 {
 id: 'reference-check',
 name: 'Reference Check',
 status: 'upcoming',
 entered: null,
 exited: null,
 days: null,
 owner: 'Priya · Recruiter',
 outcome: 'Not started',
 summary: 'Opens after a hire recommendation.',
 notes: null
 },
 {
 id: 'offer',
 name: 'Offer',
 status: 'upcoming',
 entered: null,
 exited: null,
 days: null,
 owner: 'Amit · Hiring Manager',
 outcome: 'Not started',
 summary: 'Compensation and approvals after references.',
 notes: null
 },
 {
 id: 'hired',
 name: 'Hired',
 status: 'upcoming',
 entered: null,
 exited: null,
 days: null,
 owner: 'People Ops',
 outcome: 'Not started',
 summary: 'Joining formalities after offer acceptance.',
 notes: null
 }
];

const TEAM_CHAT = [
 { id: 1, name: 'Priya', role: 'Recruiter', time: '10:12 AM', text: 'Agency confirmed 30-day notice. Compensation expectation is inside our band.' },
 { id: 2, name: 'Rahul', role: 'Interviewer', time: '10:40 AM', text: 'Tech round was strong. I would not block — but I would not staff them as the principal scientist either.' },
 { id: 3, name: 'Amit', role: 'Hiring Manager', time: '11:05 AM', text: 'Noted. I will use the HM round to test research depth. If it is applied-ML only, we should keep looking.' },
 { id: 4, name: 'Priya', role: 'Recruiter', time: '11:18 AM', text: 'I can hold two backup scientist profiles from Vanguard until Friday.' }
];

const MOVE_STAGES = ['Application Review', 'Interview · Technical', 'Interview · Hiring Manager', 'Reference Check', 'Offer', 'To Be Rejected'];
const TRANSFER_JOBS = ['Senior ML Engineer', 'Applied Scientist', 'Staff Frontend Engineer'];
const KEBAB_ACTIONS = ['Add private note', 'Download resume', 'Share with hiring team', 'Put on hold', 'Reject profile'];

const ACTIVITY_FILTERS = ['All', 'Stages', 'Interviews', 'Communications', 'Notes'];

const buildActivityFeed = (name) => [
 {
 id: 1,
 date: 'Today',
 time: '11:18 AM',
 type: 'Notes',
 actor: 'Priya',
 role: 'Recruiter',
 title: 'Added a hiring-team note',
 detail: 'Holding two backup scientist profiles from Vanguard until Friday in case the research-depth gap does not close in the HM round.',
 icon: StickyNote,
 tone: 'blue'
 },
 {
 id: 2,
 date: 'Today',
 time: '11:05 AM',
 type: 'Notes',
 actor: 'Amit',
 role: 'Hiring Manager',
 title: 'Commented on interview plan',
 detail: `HM round should test research ownership. If ${name} is applied-ML only, we keep looking.`,
 icon: MessageSquare,
 tone: 'blue'
 },
 {
 id: 3,
 date: 'Today',
 time: '10:40 AM',
 type: 'Interviews',
 actor: 'Rahul',
 role: 'Interviewer',
 title: 'Followed up on Technical round',
 detail: 'Would not block. Would not staff as principal scientist either. System-design already supports advancing.',
 icon: Star,
 tone: 'amber'
 },
 {
 id: 4,
 date: '18 Mar 2026',
 time: '9:22 AM',
 type: 'Communications',
 actor: 'Priya',
 role: 'Recruiter',
 title: 'Sent interview details to the agency',
 detail: 'Calendar hold and Zoom link emailed to TechTalent Partners for candidate confirmation.',
 icon: Mail,
 tone: 'blue'
 },
 {
 id: 5,
 date: '18 Mar 2026',
 time: '9:20 AM',
 type: 'Interviews',
 actor: 'Priya',
 role: 'Recruiter',
 title: 'Scheduled Hiring Manager interview · Round 3',
 detail: 'Amit · 18 Mar, 4:00 PM IST · 45 min · Zoom. Scorecard not submitted yet.',
 icon: Video,
 tone: 'blue'
 },
 {
 id: 6,
 date: '18 Mar 2026',
 time: '9:18 AM',
 type: 'Stages',
 actor: 'Priya',
 role: 'Recruiter',
 title: 'Moved stage to Interview · Hiring Manager (Round 3)',
 detail: 'Current stage. Waiting on HM scorecard before reference check.',
 icon: GitBranch,
 tone: 'blue'
 },
 {
 id: 7,
 date: '14 Mar 2026',
 time: '5:40 PM',
 type: 'Interviews',
 actor: 'Amit',
 role: 'Hiring Manager',
 title: 'Submitted System Design scorecard · 4/5',
 detail: 'Advance. Strong product sense on retrieval + ranking; thinner on research methodology.',
 icon: Star,
 tone: 'green'
 },
 {
 id: 8,
 date: '14 Mar 2026',
 time: '5:42 PM',
 type: 'Stages',
 actor: 'Amit',
 role: 'Hiring Manager',
 title: 'Completed Interview · System Design (Round 2)',
 detail: '1 day in stage. Decision: Advance.',
 icon: CheckCircle,
 tone: 'green'
 },
 {
 id: 9,
 date: '10 Mar 2026',
 time: '3:15 PM',
 type: 'Interviews',
 actor: 'Rahul',
 role: 'Interviewer',
 title: 'Submitted Technical scorecard · 4.5/5',
 detail: 'Advance. Clear live coding and debugging. Recommended a system-design round next.',
 icon: Star,
 tone: 'green'
 },
 {
 id: 10,
 date: '10 Mar 2026',
 time: '11:00 AM',
 type: 'Interviews',
 actor: 'Priya',
 role: 'Recruiter',
 title: 'Completed Interview · Technical (Round 1)',
 detail: 'Rahul · 45 min · live coding. Candidate joined on time via agency-coordinated link.',
 icon: Video,
 tone: 'green'
 },
 {
 id: 11,
 date: '4 Mar 2026',
 time: '4:10 PM',
 type: 'Stages',
 actor: 'Priya',
 role: 'Recruiter',
 title: 'Checked against rejection criteria · Kept in process',
 detail: 'Skills, location, and notice did not meet hard-reject rules. Industry-knowledge gap flagged for interviews.',
 icon: CheckCircle,
 tone: 'green'
 },
 {
 id: 12,
 date: '4 Mar 2026',
 time: '2:05 PM',
 type: 'Stages',
 actor: 'Priya',
 role: 'Recruiter',
 title: 'Completed Application Review',
 detail: '2 days in stage. Resume and AI screen cleared the JD bar. Compensation in band.',
 icon: GitBranch,
 tone: 'green'
 },
 {
 id: 13,
 date: '3 Mar 2026',
 time: '11:30 AM',
 type: 'Communications',
 actor: 'Priya',
 role: 'Recruiter',
 title: 'Emailed TechTalent Partners',
 detail: 'Acknowledged submission. Asked the desk to keep notice period and current CTC handy for later rounds.',
 icon: Mail,
 tone: 'blue'
 },
 {
 id: 14,
 date: '2 Mar 2026',
 time: '6:12 PM',
 type: 'Notes',
 actor: 'FindNew AI',
 role: 'Screening',
 title: 'AI screening completed · 9.8/10 match',
 detail: 'Strong React/Node baseline. Limited AI research publications — probe in interview.',
 icon: Sparkles,
 tone: 'purple'
 },
 {
 id: 15,
 date: '2 Mar 2026',
 time: '5:48 PM',
 type: 'Notes',
 actor: 'System',
 role: 'ATS',
 title: 'Resume parsed and attached',
 detail: 'Source file: Ananya_Sharma_Resume.pdf. Assigned owner: Priya.',
 icon: FileText,
 tone: 'gray'
 },
 {
 id: 16,
 date: '2 Mar 2026',
 time: '5:46 PM',
 type: 'Stages',
 actor: 'TechTalent Partners',
 role: 'Agency',
 title: `Submitted ${name} for Senior AI Research Scientist`,
 detail: 'Entered Application Review. Agency desk: desk@techtalentpartners.com.',
 icon: UserPlus,
 tone: 'blue'
 }
];

const TONE_STYLES = {
 blue: 'bg-[#1890FF]/10 text-[#1890FF]',
 green: 'bg-[#00A76F]/10 text-[#00A76F]',
 amber: 'bg-[#FFC107]/10 text-[#FFC107]',
 purple: 'bg-[#8E33FF]/10 text-[#8E33FF]',
 gray: 'bg-gray-100 dark:bg-gray-800 text-gray-500'
};

const AGENCY_EMAILS = {
 'TechTalent Partners': 'desk@techtalentpartners.com',
 'Elite Hiring Solutions': 'submissions@elitehiring.com',
 'Vanguard Recruitment': 'jobs@vanguardrecruit.com',
 'Global Recruiters Inc.': 'india@globalrecruiters.com',
 'NextGen Staffing': 'profiles@nextgenstaffing.com'
};

export default function CandidateProfilePage() {
 const navigate = useNavigate();
 const { id } = useParams();
 const location = useLocation();
 const from = location.state?.from || { name: 'Applications', path: '/dashboard/agencies', tab: 'Applications' };
 const candidate = location.state?.candidate || {
 id,
 name: 'Ananya Sharma',
 stage: 'Technical Interview',
 score: '9.8/10',
 date: '2 days ago',
 agency: 'TechTalent Partners'
 };

 const [activeTab, setActiveTab] = useState('Stage');
 const [openStages, setOpenStages] = useState(['interview-hm']);
 const [isChatCollapsed, setIsChatCollapsed] = useState(false);
 const [chatInput, setChatInput] = useState('');
 const [messages, setMessages] = useState(TEAM_CHAT);
 const [openMenu, setOpenMenu] = useState(null);
 const [toast, setToast] = useState(null);
 const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
 const [profileStage, setProfileStage] = useState(candidate.stage);
 const [activityFilter, setActivityFilter] = useState('All');

 const tabs = ['Stage', 'Scorecards', 'Activity Feed'];

 useEffect(() => {
 const close = () => setOpenMenu(null);
 document.addEventListener('click', close);
 return () => document.removeEventListener('click', close);
 }, []);

 const showToast = (text) => {
 setToast(text);
 setTimeout(() => setToast(null), 2200);
 };

 const toggleStage = (stageId, status) => {
 if (status === 'upcoming') return;
 setOpenStages(prev => prev.includes(stageId) ? prev.filter(id => id !== stageId) : [...prev, stageId]);
 };

 const sendChat = () => {
 if (!chatInput.trim()) return;
 setMessages(prev => [...prev, { id: Date.now(), name: 'Amit', role: 'Hiring Manager', time: 'Now', text: chatInput.trim() }]);
 setChatInput('');
 };

 const statusStyles = {
 completed: { dot: 'bg-[#00A76F]', ring: 'ring-[#00A76F]/20', line: 'bg-[#00A76F]', badge: 'bg-[#00A76F]/10 text-[#00A76F]', label: 'Completed' },
 current: { dot: 'bg-[#1890FF]', ring: 'ring-[#1890FF]/25', line: 'bg-[#1890FF]/30', badge: 'bg-[#1890FF]/10 text-[#1890FF]', label: 'In progress' },
 upcoming: { dot: 'bg-gray-300 dark:bg-gray-600', ring: 'ring-transparent', line: 'bg-gray-200 dark:bg-gray-700', badge: 'bg-gray-100 dark:bg-gray-800 text-gray-400', label: 'Not started' }
 };

 const iconBtn = 'w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-[#212b36] dark:text-white hover:border-[#1890FF]/40 hover:text-[#1890FF] flex items-center justify-center cursor-pointer transition-colors';

 const activityFeed = buildActivityFeed(candidate.name).filter(item => activityFilter === 'All' || item.type === activityFilter);
 const activityGroups = activityFeed.reduce((acc, item) => {
 if (!acc[item.date]) acc[item.date] = [];
 acc[item.date].push(item);
 return acc;
 }, {});

 return (
 <div className="p-6 space-y-5 relative">
 <button
 onClick={() => navigate(from.path, { state: { tab: from.tab || 'Applications', selectedCandidateId: candidate.id } })}
 className="text-sm font-bold text-black dark:text-gray-400 hover:text-[#1890FF] flex items-center gap-1.5 transition-colors w-fit cursor-pointer"
 >
 <ArrowLeft size={16} /> Back to Applications
 </button>

 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col lg:flex-row lg:items-center gap-4">
 <div className="flex items-center gap-4 flex-1 min-w-0">
 <div className="w-14 h-14 rounded-full bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center text-lg font-bold shrink-0">
 {getInitials(candidate.name)}
 </div>
 <div className="min-w-0">
 <div className="flex flex-wrap items-center gap-2">
 <h1 className="text-xl font-bold text-[#212b36] dark:text-white truncate">{candidate.name}</h1>
 <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#00A76F]/10 text-[#00A76F]">{candidate.score} match</span>
 <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#1890FF]/10 text-[#1890FF]">{profileStage}</span>
 </div>
 <p className="text-[13px] text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
 <span className="flex items-center gap-1"><Briefcase size={13} /> Senior AI Research Scientist</span>
 <span className="flex items-center gap-1"><MapPin size={13} /> Bangalore</span>
 <span className="flex items-center gap-1"><Clock size={13} /> Applied {candidate.date}</span>
 {candidate.agency && <span>Sourced by {candidate.agency}</span>}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-1.5 shrink-0 relative">
 <button type="button" title="Mail the profile" onClick={() => showToast('Profile emailed to your inbox')} className={iconBtn}>
 <Mail size={16} />
 </button>
 <button type="button" title="Copy the profile" onClick={() => { navigator.clipboard?.writeText(`${candidate.name} · Senior AI Research Scientist · ${candidate.stage}`); showToast('Profile link copied'); }} className={iconBtn}>
 <Copy size={16} />
 </button>
 <div className="relative">
 <button type="button" title="Transfer to other requirement" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'transfer' ? null : 'transfer'); }} className={iconBtn}>
 <ArrowRightLeft size={16} />
 </button>
 {openMenu === 'transfer' && (
 <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50" onClick={(e) => e.stopPropagation()}>
 <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transfer to</p>
 {TRANSFER_JOBS.map(job => (
 <button key={job} type="button" onClick={() => { setOpenMenu(null); showToast(`Transfer queued to ${job}`); }} className="w-full text-left px-3 py-2 text-[13px] font-bold text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
 {job}
 </button>
 ))}
 </div>
 )}
 </div>
 <div className="relative">
 <button type="button" title="Move stage" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'move' ? null : 'move'); }} className={iconBtn}>
 <GitBranch size={16} />
 </button>
 {openMenu === 'move' && (
 <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50" onClick={(e) => e.stopPropagation()}>
 <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Move stage</p>
 {MOVE_STAGES.map(stage => (
 <button key={stage} type="button" onClick={() => { setOpenMenu(null); showToast(`Stage move: ${stage}`); }} className={`w-full text-left px-3 py-2 text-[13px] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${stage === 'To Be Rejected' ? 'text-[#FF5630]' : 'text-[#212b36] dark:text-white'}`}>
 {stage}
 </button>
 ))}
 </div>
 )}
 </div>
 <div className="relative">
 <button type="button" title="More actions" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'kebab' ? null : 'kebab'); }} className={iconBtn}>
 <MoreVertical size={16} />
 </button>
 {openMenu === 'kebab' && (
 <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50" onClick={(e) => e.stopPropagation()}>
 {KEBAB_ACTIONS.map(action => (
 <button
 key={action}
 type="button"
 onClick={() => {
 setOpenMenu(null);
 if (action === 'Reject profile') {
 setIsRejectModalOpen(true);
 return;
 }
 showToast(action);
 }}
 className={`w-full text-left px-3 py-2 text-[13px] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${action === 'Reject profile' ? 'text-[#FF5630]' : 'text-[#212b36] dark:text-white'}`}
 >
 {action}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800/50">
 {tabs.map(tab => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`pb-3 text-sm font-bold relative cursor-pointer transition-colors ${
 activeTab === tab ? 'text-[#1890FF]' : 'text-black dark:text-gray-400 hover:text-[#212b36] dark:hover:text-white'
 }`}
 >
 {tab}
 {activeTab === tab && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#1890FF] rounded-full" />}
 </button>
 ))}
 </div>

 {activeTab === 'Stage' && (
 <div className="flex gap-5 items-stretch min-h-[640px] relative">
 <div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5">
 <div className="flex items-center justify-between mb-5">
 <div>
 <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Hiring journey</h2>
 <p className="text-[12px] text-gray-500 mt-0.5">Completed stages can be opened for dates, duration, and decision notes.</p>
 </div>
 <span className="text-[11px] font-bold text-[#1890FF] bg-[#1890FF]/10 px-2 py-1 rounded-md">Round 3 in progress</span>
 </div>

 <div className="space-y-0">
 {STAGE_HISTORY.map((stage, index) => {
 const styles = statusStyles[stage.status];
 const isOpen = openStages.includes(stage.id);
 const isUpcoming = stage.status === 'upcoming';
 const isLast = index === STAGE_HISTORY.length - 1;
 return (
 <div key={stage.id} className="flex gap-4">
 <div className="flex flex-col items-center w-5 shrink-0">
 <div className={`w-3.5 h-3.5 rounded-full ring-4 ${styles.dot} ${styles.ring} mt-3.5`} />
 {!isLast && <div className={`w-0.5 flex-1 min-h-[16px] ${styles.line}`} />}
 </div>
 <div className={`flex-1 min-w-0 pb-3 ${isUpcoming ? 'opacity-50 pointer-events-none' : ''}`}>
 <button
 type="button"
 disabled={isUpcoming}
 onClick={() => toggleStage(stage.id, stage.status)}
 className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
 isUpcoming
 ? 'border-gray-100 dark:border-gray-800/50 bg-gray-50/60 dark:bg-gray-800/20 cursor-not-allowed'
 : isOpen
 ? 'border-[#1890FF]/25 bg-[#1890FF]/5 cursor-pointer'
 : 'border-gray-100 dark:border-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer'
 }`}
 >
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <div className="flex flex-wrap items-center gap-2">
 <h3 className={`text-[13px] font-bold ${isUpcoming ? 'text-gray-400' : 'text-[#212b36] dark:text-white'}`}>{stage.name}</h3>
 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${styles.badge}`}>{styles.label}</span>
 </div>
 <p className="text-[11px] text-gray-500 mt-1 flex flex-wrap gap-x-3">
 {stage.entered ? (
 <>
 <span className="inline-flex items-center gap-1"><Calendar size={11} /> {stage.entered}{stage.exited ? ` – ${stage.exited}` : ' – present'}</span>
 <span>{stage.days} {stage.days === 1 ? 'day' : 'days'}</span>
 </>
 ) : (
 <span>Waiting on earlier stages</span>
 )}
 <span className="inline-flex items-center gap-1"><User size={11} /> {stage.owner}</span>
 </p>
 </div>
 {!isUpcoming && (
 <ChevronDown size={18} strokeWidth={2.25} className={`shrink-0 mt-0.5 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180 text-[#1890FF]' : 'text-[#1890FF]/70'}`} />
 )}
 </div>
 </button>

 {!isUpcoming && (
 <div
 className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
 isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
 }`}
 aria-hidden={!isOpen}
 >
 <div className="overflow-hidden min-h-0">
 <div className="rounded-xl border border-gray-100 dark:border-gray-800/50 bg-gray-50/70 dark:bg-gray-800/30 p-4 space-y-3">
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entered</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white mt-0.5">{stage.entered}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Exited</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white mt-0.5">{stage.exited || '—'}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time in stage</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white mt-0.5">{stage.days} {stage.days === 1 ? 'day' : 'days'}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Decision</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white mt-0.5">{stage.outcome}</p>
 </div>
 </div>
 <p className="text-[13px] text-[#454f5b] dark:text-gray-300 leading-relaxed">{stage.summary}</p>
 {stage.notes && (
 <div className="text-[12px] text-gray-500 bg-white dark:bg-[#161c24] rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-800/50">
 <span className="font-bold text-[#212b36] dark:text-white">HM note · </span>{stage.notes}
 </div>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {isChatCollapsed ? (
 <button
 type="button"
 onClick={() => setIsChatCollapsed(false)}
 className="flex self-start items-center gap-1.5 pl-2 pr-3 py-2 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/50 rounded-xl shadow-sm text-[#1890FF] hover:bg-[#1890FF]/5 transition-colors cursor-pointer shrink-0"
 aria-label="Expand team chat"
 >
 <ChevronsLeft size={16} />
 <MessageSquare size={16} />
 </button>
 ) : (
 <div className="w-full xl:w-[340px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 flex flex-col overflow-hidden min-h-[640px]">
 <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
 <div>
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Hiring team</h3>
 <p className="text-[11px] text-gray-500">Private to this requisition</p>
 </div>
 <button type="button" onClick={() => setIsChatCollapsed(true)} className="p-1.5 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer" aria-label="Collapse team chat">
 <ChevronsRight size={16} />
 </button>
 </div>
 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
 {messages.map(msg => (
 <div key={msg.id} className={`flex flex-col ${msg.role === 'Hiring Manager' ? 'items-end' : 'items-start'}`}>
 <div className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 ${msg.role === 'Hiring Manager' ? 'bg-[#1890FF] text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-800 text-[#212b36] dark:text-white rounded-tl-sm'}`}>
 <p className={`text-[10px] font-bold mb-1 ${msg.role === 'Hiring Manager' ? 'text-white/80' : 'text-gray-500'}`}>{msg.name} · {msg.role}</p>
 <p className="text-[13px] leading-relaxed">{msg.text}</p>
 </div>
 <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
 </div>
 ))}
 </div>
 <div className="p-3 border-t border-gray-100 dark:border-gray-800/50">
 <div className="relative">
 <input
 type="text"
 value={chatInput}
 onChange={(e) => setChatInput(e.target.value)}
 onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }}
 placeholder="Message the hiring team..."
 className="w-full pl-3 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm text-[#212b36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20"
 />
 <button type="button" onClick={sendChat} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg cursor-pointer">
 <Send size={16} />
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 {activeTab === 'Scorecards' && (
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-8 text-center">
 <FileText size={28} className="text-[#1890FF] mx-auto mb-3" />
 <h2 className="text-base font-bold text-[#212b36] dark:text-white">Scorecards</h2>
 <p className="text-sm text-gray-500 mt-1">Interview scorecards for this profile will live here.</p>
 </div>
 )}

 {activeTab === 'Activity Feed' && (
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
 <div>
 <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Activity on this profile</h2>
 <p className="text-[12px] text-gray-500 mt-0.5">Stage moves, interviews, agency emails, and hiring-team notes — newest first.</p>
 </div>
 <span className="text-[11px] font-bold text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md w-fit">{activityFeed.length} events</span>
 </div>

 <div className="flex flex-wrap gap-1.5 mb-6">
 {ACTIVITY_FILTERS.map(filter => (
 <button
 key={filter}
 type="button"
 onClick={() => setActivityFilter(filter)}
 className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors cursor-pointer ${
 activityFilter === filter
 ? 'bg-[#1890FF] text-white'
 : 'bg-gray-50 dark:bg-gray-800 text-[#212b36] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
 }`}
 >
 {filter}
 </button>
 ))}
 </div>

 {activityFeed.length === 0 ? (
 <p className="text-sm text-gray-500 py-8 text-center">No activity in this filter yet.</p>
 ) : (
 <div className="space-y-6">
 {Object.entries(activityGroups).map(([date, items]) => (
 <div key={date}>
 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">{date}</p>
 <div className="relative space-y-4">
 <div className="absolute top-2 bottom-2 left-[15px] w-px bg-gray-100 dark:bg-gray-800/50" />
 {items.map(item => {
 const Icon = item.icon;
 return (
 <div key={item.id} className="relative flex gap-3">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#161c24] z-[1] ${TONE_STYLES[item.tone]}`}>
 <Icon size={14} />
 </div>
 <div className="flex-1 min-w-0 rounded-xl border border-gray-100 dark:border-gray-800/50 bg-gray-50/60 dark:bg-gray-800/20 px-3.5 py-3">
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white leading-snug">{item.title}</p>
 <p className="text-[11px] text-gray-500 mt-0.5">{item.actor} · {item.role}</p>
 </div>
 <span className="text-[11px] text-gray-400 shrink-0">{item.time}</span>
 </div>
 {item.detail && (
 <p className="text-[13px] text-[#454f5b] dark:text-gray-300 leading-relaxed mt-2">{item.detail}</p>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {toast && (
 <div className="fixed bottom-6 right-6 z-[120] bg-[#212b36] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
 {toast}
 </div>
 )}

 <RejectAgencyModal
 open={isRejectModalOpen}
 candidates={[{
 ...candidate,
 agency: candidate.agency || 'TechTalent Partners',
 agencyEmail: candidate.agencyEmail || AGENCY_EMAILS[candidate.agency] || 'desk@techtalentpartners.com'
 }]}
 onClose={() => setIsRejectModalOpen(false)}
 onSent={() => setProfileStage('Reject')}
 />
 </div>
 );
}
