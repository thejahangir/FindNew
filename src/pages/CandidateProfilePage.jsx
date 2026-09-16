import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
 ArrowLeft, Briefcase, MapPin, Clock, FileText, MessageSquare,
 Mail, Copy, ArrowRightLeft, GitBranch, MoreVertical, ChevronDown, Send,
 ChevronsRight, ChevronsLeft, Calendar, User, Star, Sparkles, UserPlus,
 CheckCircle, Check, Video, StickyNote, Phone, Globe, BookOpen, Bookmark, Bell, Bot, Cpu
} from 'lucide-react';
import RejectAgencyModal from '../components/dashboard/RejectAgencyModal';

const getInitials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const MOCK_SCORECARDS = [
  {
  id: 'sc-1',
  interviewer: 'Amit Sharma',
  stage: 'Technical Interview',
  date: '10 Mar 2026',
  score: '9.0/10',
  takeaways: 'Strong technical foundation. Cleared the system design question easily. Communication was clear.',
  notes: 'I asked about handling race conditions in distributed systems. Candidate mapped out a robust distributed lock mechanism using Redis.',
  softSkills: 8.0,
  hardSkills: 9.6,
  attributes: [
  { name: 'System Design', rating: 'positive' },
  { name: 'React/Node', rating: 'positive' },
  { name: 'Communication', rating: 'neutral' },
  ]
  },
  {
  id: 'sc-2',
  interviewer: 'Priya Patel',
  stage: 'Culture Fit',
  date: '12 Mar 2026',
  score: '9.2/10',
  takeaways: 'Great alignment with our core values. Shows high ownership and bias for action.',
  notes: 'Candidate discussed their experience leading a cross-functional team under a tight deadline. Exhibited strong empathy and pragmatism.',
  softSkills: 9.8,
  hardSkills: 8.4,
  attributes: [
  { name: 'Ownership', rating: 'positive' },
  { name: 'Empathy', rating: 'positive' },
  { name: 'Conflict Resolution', rating: 'positive' },
  ]
  },
  {
  id: 'sc-3',
  interviewer: 'David Chen',
  stage: 'Product Sense',
  date: '14 Mar 2026',
  score: '7.5/10',
  takeaways: 'Good overall grasp of product lifecycle but struggled slightly to prioritize features under resource constraints.',
  notes: 'Asked about launching a hypothetical feature in an emerging market. Candidate identified key user pain points but over-indexed on engineering complexity rather than time-to-market.',
  softSkills: 7.0,
  hardSkills: 8.0,
  attributes: [
  { name: 'Product Strategy', rating: 'positive' },
  { name: 'Prioritization', rating: 'neutral' },
  { name: 'User Empathy', rating: 'positive' },
  ]
  },
  {
  id: 'sc-4',
  interviewer: 'Sarah Jenkins',
  stage: 'Executive Review',
  date: '15 Mar 2026',
  score: '8.8/10',
  takeaways: 'Very mature candidate with strong leadership potential. Highly articulate and strategic.',
  notes: 'Discussed long-term technical vision. The candidate has a clear framework for balancing technical debt against product velocity. Confident hire.',
  softSkills: 9.6,
  hardSkills: 9.0,
  attributes: [
  { name: 'Leadership', rating: 'positive' },
  { name: 'Strategic Vision', rating: 'positive' },
  { name: 'Executive Presence', rating: 'positive' },
  ]
  }
];

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
const KEBAB_ACTIONS = ['Copy profile', 'Mail profile', 'Download resume', 'Reject profile'];

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

 const [activeTab, setActiveTab] = useState('Overview');
 const [openStages, setOpenStages] = useState(['interview-hm']);
 const [isChatCollapsed, setIsChatCollapsed] = useState(false);
 const [chatInput, setChatInput] = useState('');
 const [messages, setMessages] = useState(TEAM_CHAT);
 const [openMenu, setOpenMenu] = useState(null);
 const [toast, setToast] = useState(null);
 const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
 const [profileStage, setProfileStage] = useState(candidate.stage);
 const [activityFilter, setActivityFilter] = useState('All');
 const [openScorecards, setOpenScorecards] = useState(['sc-1']);

 const tabs = ['Overview', 'Stage', 'Scorecards', 'Activity Log'];

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
 className="text-[13px] font-bold text-black dark:text-gray-400 hover:text-[#1890FF] flex items-center gap-1.5 transition-colors w-fit cursor-pointer"
 >
 <ArrowLeft size={16} /> Back to Applications
 </button>

 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col lg:flex-row lg:items-center gap-4">
 <div className="flex items-center gap-4 flex-1 min-w-0">
 <div className="min-w-0">
 <div className="flex flex-wrap items-baseline gap-3">
 <h1 className="text-3xl font-black text-[#212b36] dark:text-white truncate tracking-tight leading-none">{candidate.name}</h1>
 <span className="text-[13px] font-medium text-gray-500">{candidate.pronouns || 'He/Him'}</span>
 {candidate.agency && (
 <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#00A76F]/10 text-[#00A76F] ml-1">Agency: {candidate.agency}</span>
 )}
 </div>
 <p className="text-[13px] text-gray-500 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
 <span className="flex items-center gap-1"><Briefcase size={13} /> Senior AI Research Scientist</span>
 <span className="flex items-center gap-1"><MapPin size={13} /> Bangalore</span>
 <span className="flex items-center gap-1"><Clock size={13} /> Applied {candidate.date}</span>
 </p>
 <p className="text-[12px] text-gray-400 mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
 <span className="flex items-center gap-1.5"><Mail size={13} /> {candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com</span>
 <span className="flex items-center gap-1.5"><Phone size={13} /> +1 (555) 123-4567</span>
 <span className="flex items-center gap-1.5"><Globe size={13} /> EST (UTC-5)</span>
 </p>
 </div>
 </div>

 <div className="flex flex-wrap items-center gap-2 shrink-0 relative mt-4 lg:mt-0">
  
 <button onClick={() => showToast('Followed')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-[12px] font-bold text-[#212b36] dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm group cursor-pointer">
 <Bookmark size={14} className="text-gray-400 group-hover:text-[#1890FF] transition-colors" />
 <span>Follow</span>
 </button>
 
 <button onClick={() => showToast('Prep Kit')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-[12px] font-bold text-[#212b36] dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm group cursor-pointer">
 <BookOpen size={14} className="text-gray-400 group-hover:text-[#00A76F] transition-colors" />
 <span>Prep Kit</span>
 </button>

 <div className="relative">
 <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'transfer' ? null : 'transfer'); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-[12px] font-bold text-[#212b36] dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm group cursor-pointer">
 <ArrowRightLeft size={14} className="text-gray-400 group-hover:text-[#FF5630] transition-colors" />
 <span>Transfer</span>
 </button>
 {openMenu === 'transfer' && (
 <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50" onClick={(e) => e.stopPropagation()}>
 <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 tracking-wider">Transfer to</p>
 {TRANSFER_JOBS.map(job => (
 <button key={job} type="button" onClick={() => { setOpenMenu(null); showToast(`Transfer queued to ${job}`); }} className="w-full text-left px-3 py-2 text-[13px] font-bold text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
 {job}
 </button>
 ))}
 </div>
 )}
 </div>

 <div className="relative">
 <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'move' ? null : 'move'); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#1890FF]/30 bg-[#1890FF]/5 text-[12px] font-bold text-[#1890FF] hover:bg-[#1890FF]/10 transition-all shadow-sm cursor-pointer">
 <GitBranch size={14} />
 <span>Move Stage</span>
 </button>
 {openMenu === 'move' && (
 <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1 z-50" onClick={(e) => e.stopPropagation()}>
 <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 tracking-wider">Move stage</p>
 {MOVE_STAGES.map(stage => (
 <button key={stage} type="button" onClick={() => { setOpenMenu(null); showToast(`Stage move: ${stage}`); }} className={`w-full text-left px-3 py-2 text-[13px] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${stage === 'To Be Rejected' ? 'text-[#FF5630]' : 'text-[#212b36] dark:text-white'}`}>
 {stage}
 </button>
 ))}
 </div>
 )}
 </div>

 <button onClick={() => showToast('Schedule Interview')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1890FF] text-white text-[12px] font-bold hover:bg-[#1890FF]/90 transition-all shadow-md shadow-[#1890FF]/20 cursor-pointer">
 <Calendar size={14} />
 <span>Schedule</span>
 </button>

 <div className="relative">
 <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'kebab' ? null : 'kebab'); }} className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-gray-500 hover:border-gray-300 transition-all shadow-sm cursor-pointer">
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
 if (action === 'Copy profile') {
 navigator.clipboard?.writeText(`${candidate.name} · Senior AI Research Scientist · ${candidate.stage}`);
 showToast('Profile link copied');
 return;
 }
 if (action === 'Mail profile') {
 showToast('Profile emailed to your inbox');
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

 
<div className="flex flex-col xl:flex-row gap-5 items-start">
 
<div className="w-[380px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col gap-4">
 <div className="flex items-center justify-between mb-2">
 <h2 className="text-sm font-bold text-[#212b36] dark:text-white tracking-wider">Application Details</h2>
 <button onClick={() => showToast('Downloading Resume...')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-[11px] font-bold text-[#212b36] dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm group cursor-pointer">
 <FileText size={12} className="text-gray-400 group-hover:text-[#1890FF] transition-colors" />
 <span>Resume</span>
 </button>
 </div>

 <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-2 tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700/50">Candidate Info</h3>
 <div className="grid grid-cols-2 gap-y-3 gap-x-2">
 <div className="col-span-2">
 <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Name</p>
 <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300 truncate">{candidate.name}</p>
 </div>
 <div className="col-span-2">
 <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Email</p>
 <p className="text-[13px] leading-relaxed font-semibold text-[#1890FF] break-all">{candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com</p>
 </div>
 <div>
 <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Phone</p>
 <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">+91 98765 43210</p>
 </div>
 <div>
 <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Location</p>
 <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">{candidate.location || 'Bangalore, KA'}</p>
 </div>
 <div className="col-span-2">
 <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Time Zone</p>
 <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">IST (UTC +5:30)</p>
 </div>
 </div>
 </div>

 <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-2 tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700/50">Professional Summary</h3>
  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Total Experience</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">8 Years</p>
  </div>
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Relevant Experience</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">5.5 Years</p>
  </div>
  <div className="col-span-2">
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Current Company</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">Google India</p>
  </div>
  <div className="col-span-2">
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Current Title</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">Senior Staff Engineer</p>
  </div>
  </div>
  </div>

 <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-2 tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700/50">Skills & Expertise</h3>
  <div className="grid grid-cols-1 gap-y-3 gap-x-2">
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">Primary Skills</p>
  <div className="flex flex-wrap gap-1.5">
  <span className="px-2 py-0.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-gray-300 rounded text-[11px] font-semibold">React</span>
  <span className="px-2 py-0.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-gray-300 rounded text-[11px] font-semibold">Node.js</span>
  <span className="px-2 py-0.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-gray-300 rounded text-[11px] font-semibold">AWS</span>
  <span className="px-2 py-0.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-gray-300 rounded text-[11px] font-semibold">System Design</span>
  </div>
  </div>
  </div>
  </div>

 <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-2 tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700/50">Availability & Logistics</h3>
  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Notice Period</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">30 Days</p>
  </div>
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Available From</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">Oct 01, 2026</p>
  </div>
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Work Mode</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">Hybrid</p>
  </div>
  <div></div>
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Current CTC</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">₹45,00,000</p>
  </div>
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Expected CTC</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">₹60,00,000</p>
  </div>
  </div>
  </div>

 <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-2 tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700/50">Experience</h3>
  <div className="grid grid-cols-1 gap-y-3 gap-x-2">
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">Career Timeline</p>
  <div className="flex flex-col gap-3">
  <div className="flex flex-col relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
  <span className="absolute -left-[5px] top-[5px] w-2 h-2 rounded-full bg-[#1890FF]"></span>
  <p className="text-[12px] font-semibold text-[#212b36] dark:text-gray-300 leading-tight mb-0.5">Senior Staff Engineer</p>
  <p className="text-[11px] text-gray-500">Google India • 2020 - Present</p>
  </div>
  <div className="flex flex-col relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
  <span className="absolute -left-[5px] top-[5px] w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
  <p className="text-[12px] font-semibold text-[#212b36] dark:text-gray-300 leading-tight mb-0.5">SDE II</p>
  <p className="text-[11px] text-gray-500">Amazon • 2017 - 2020</p>
  </div>
  </div>
  </div>
  </div>
  </div>

 <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-2 tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700/50">Education</h3>
  <div className="grid grid-cols-1 gap-y-3 gap-x-2">
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Degree</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">B.Tech in Computer Science</p>
  </div>
  <div>
  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Institution</p>
  <p className="text-[13px] leading-relaxed font-semibold text-[#212b36] dark:text-gray-300">IIT Bombay (2013-2017)</p>
  </div>
  </div>
  </div>

 <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-2 tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700/50">Profiles</h3>
  <div className="flex flex-col gap-2">
  <a href="#" className="flex items-center gap-2 text-[13px] leading-relaxed font-semibold text-[#1890FF] hover:underline">
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
  linkedin.com/in/{candidate.name.toLowerCase().replace(/\s+/g, '')}
  </a>
  <a href="#" className="flex items-center gap-2 text-[13px] leading-relaxed font-semibold text-[#1890FF] hover:underline">
  <svg className="w-3.5 h-3.5 fill-current text-black dark:text-white" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
  github.com/{candidate.name.toLowerCase().replace(/\s+/g, '')}
  </a>
  <a href="#" className="flex items-center gap-2 text-[13px] leading-relaxed font-semibold text-[#1890FF] hover:underline">
  <svg className="w-3.5 h-3.5 fill-current text-gray-500 dark:text-gray-400" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.849 19h-1.604l-2.094-5.783v5.783h-1.536v-8.898h2.091l1.83 5.093 1.831-5.093h2.091v8.898h-1.535v-5.783l-2.074 5.783zm7.849-5.116h-4v1.547h4v1.464h-4v2.105h-1.535v-8.898h5.535v1.464h-4v2.318h4v-8.898h1.535v8.898h-1.535z"/></svg>
  {candidate.name.toLowerCase().replace(/\s+/g, '')}.dev
  </a>
  </div>
  </div>
</div>

 
<div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 flex flex-col overflow-hidden">
 <div className="px-5 pt-3 border-b border-gray-200 dark:border-gray-800/50">
 <div className="flex items-center gap-6">
 {tabs.map(tab => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`pb-3 text-[13px] font-bold relative cursor-pointer transition-colors ${
 activeTab === tab ? 'text-[#1890FF]' : 'text-black dark:text-gray-400 hover:text-[#212b36] dark:hover:text-white'
 }`}
 >
 {tab}
 {activeTab === tab && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#1890FF] rounded-full" />}
 </button>
 ))}
 </div>
 </div>
 <div className="p-0">
 {activeTab === 'Overview' && (
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-6 space-y-8 animate-fade-in">
 
  {/* Executive Summary */}
  <div>
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-3 tracking-wider">Executive Summary</h3>
  <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
  Highly motivated and experienced AI Research Scientist with over 5 years of experience in developing state-of-the-art machine learning models. Proven track record in natural language processing and generative AI, with multiple publications in top-tier conferences. Passionate about applying AI to solve complex real-world problems.
  </p>
  </div>
  
  <hr className="border-gray-100 dark:border-gray-800/50" />

  {/* Progress & Status */}
  <div>
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-bold text-[#212b36] dark:text-white tracking-wider flex items-center gap-2"><GitBranch size={16} className="text-[#1890FF]" /> Current Progress</h3>
    <button onClick={() => showToast('Opening scheduler...')} className="text-[11px] font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95">
      <Calendar size={12} /> Schedule Interview
    </button>
  </div>
  
  <div className="bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50 rounded-xl p-6 overflow-x-auto">
  <div className="min-w-[600px] flex items-center justify-between relative px-4">
  
  {/* Background Track */}
  <div className="absolute top-4 left-8 right-8 h-[2px] bg-gray-200 dark:bg-gray-700 -z-0"></div>
  
  {/* Active Progress Track (up to HM Interview) */}
  <div className="absolute top-4 left-8 w-[60%] h-[2px] bg-[#00A76F] -z-0"></div>

  {/* Steps */}
  {[
  { label: 'Applied', status: 'completed' },
  { label: 'AI Screening', status: 'completed' },
  { label: 'AI Interview', status: 'completed' },
  { label: 'HM Interview', status: 'active' },
  { label: 'Ref Check', status: 'pending' },
  { label: 'Offer', status: 'pending' },
  ].map((step, i) => (
  <div key={i} className="flex flex-col items-center gap-3 z-10 w-24">
  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-sm
  ${step.status === 'completed' ? 'bg-[#00A76F] border-[#00A76F] text-white' : 
  step.status === 'active' ? 'bg-white dark:bg-[#161c24] border-[#1890FF] text-[#1890FF] ring-4 ring-[#1890FF]/20' : 
  'bg-white dark:bg-[#161c24] border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'}
  `}>
  {step.status === 'completed' ? <Check size={14} strokeWidth={3} /> : <span className="text-[11px] font-bold">{i + 1}</span>}
  </div>
  <span className={`text-[11px] font-bold text-center ${
  step.status === 'completed' ? 'text-[#212b36] dark:text-gray-300' :
  step.status === 'active' ? 'text-[#1890FF]' :
  'text-gray-400'
  }`}>{step.label}</span>
  </div>
  ))}
  
  </div>
  </div>
  </div>

  {/* Feedback Summaries */}
  <div>
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-4 tracking-wider flex items-center gap-2"><Star size={16} className="text-[#FFC107]" /> Feedback Summaries</h3>
  <div className="grid grid-cols-1 space-y-4">
  <div className="p-4 rounded-xl border border-[#00A76F]/20 bg-[#00A76F]/5 flex gap-4 items-start transition-all hover:bg-[#00A76F]/10">
  <div className="w-11 h-11 shrink-0 rounded-full bg-[#00A76F] text-white flex items-center justify-center font-black text-[14px] shadow-sm mt-0.5">
  9.8
  </div>
  <div className="flex-1 space-y-1.5">
  <div className="flex items-center gap-2 text-[#00A76F] font-bold text-[11px] uppercase tracking-wider"><Bot size={14} /> AI Screening</div>
  <p className="text-[13px] leading-relaxed text-[#212b36] dark:text-gray-300 leading-relaxed">Candidate strongly matches the technical requirements. Excellent overlap in React, Node, and AWS architecture. Note: slight gap in people management experience.</p>
  </div>
  </div>

  <div className="p-4 rounded-xl border border-[#FFAB00]/20 bg-[#FFAB00]/5 flex gap-4 items-start transition-all hover:bg-[#FFAB00]/10">
  <div className="w-11 h-11 shrink-0 rounded-full bg-[#FFAB00] text-white flex items-center justify-center font-black text-[14px] shadow-sm mt-0.5">
  6.5
  </div>
  <div className="flex-1 space-y-1.5">
  <div className="flex items-center gap-2 text-[#FFAB00] font-bold text-[11px] uppercase tracking-wider"><Cpu size={14} /> AI Interview</div>
  <p className="text-[13px] leading-relaxed text-[#212b36] dark:text-gray-300 leading-relaxed">Candidate communicated clearly. AI agent noted acceptable problem-solving skills but hesitated slightly on complex behavioral questions.</p>
  </div>
  </div>

  <div className="p-4 rounded-xl border border-[#FF5630]/20 bg-[#FF5630]/5 flex gap-4 items-start transition-all hover:bg-[#FF5630]/10">
  <div className="w-11 h-11 shrink-0 rounded-full bg-[#FF5630] text-white flex items-center justify-center font-black text-[14px] shadow-sm mt-0.5">
  4.2
  </div>
  <div className="flex-1 space-y-1.5">
  <div className="flex items-center gap-2 text-[#FF5630] font-bold text-[11px] uppercase tracking-wider"><User size={14} /> Human Interviews</div>
  <p className="text-[13px] leading-relaxed text-[#212b36] dark:text-gray-300 leading-relaxed">Struggled in Round 1 (Tech) and Round 2 (Design). Failed to clear live coding easily. Lacks fundamental system design sense.</p>
  </div>
  </div>
  </div>
  </div>

  {/* Reminders */}
  <div>
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-4 tracking-wider flex items-center gap-2"><Bell size={16} className="text-[#FF5630]" /> Upcoming Reminders</h3>
  <div className="space-y-3">
  <div className="flex items-center justify-between p-3 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/50 rounded-xl hover:border-[#1890FF]/30 transition-colors">
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-full bg-[#FF5630]/10 flex items-center justify-center text-[#FF5630]">
  <Video size={16} />
  </div>
  <div>
  <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">HM Interview with Amit</h4>
  <p className="text-[13px] leading-relaxed text-gray-500">Scheduled for today, 4:00 PM</p>
  </div>
  </div>
  <span className="text-[11px] font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-[#212b36] dark:text-white">Owner: Amit</span>
  </div>
  
  <div className="flex items-center justify-between p-3 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/50 rounded-xl hover:border-[#1890FF]/30 transition-colors">
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-full bg-[#1890FF]/10 flex items-center justify-center text-[#1890FF]">
  <MessageSquare size={16} />
  </div>
  <div>
  <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">Collect Scorecard (System Design)</h4>
  <p className="text-[13px] leading-relaxed text-[#FF5630]">Overdue by 2 hours</p>
  </div>
  </div>
  <span className="text-[11px] font-bold bg-[#FF5630]/10 text-[#FF5630] px-3 py-1 rounded">Owner: Amit</span>
  </div>

  <div className="flex items-center justify-between p-3 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/50 rounded-xl hover:border-[#1890FF]/30 transition-colors">
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-full bg-[#00A76F]/10 flex items-center justify-center text-[#00A76F]">
  <FileText size={16} />
  </div>
  <div>
  <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">Review Background Check</h4>
  <p className="text-[13px] leading-relaxed text-gray-500">Due tomorrow, 10:00 AM</p>
  </div>
  </div>
  <span className="text-[11px] font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-[#212b36] dark:text-white">Owner: Priya</span>
  </div>
  </div>
  </div>
  
  </div>
 )}
 {activeTab === 'Stage' && (
 
 <div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5">
 <div className="flex items-center justify-between mb-5">
 <div>
 <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Hiring journey</h2>
 <p className="text-[13px] leading-relaxed text-gray-500 mt-0.5">Completed stages can be opened for dates, duration, and decision notes.</p>
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
 <p className="text-[13px] leading-relaxed text-gray-500 mt-1 flex flex-wrap gap-x-3">
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
 <p className="text-[10px] font-bold text-gray-400 tracking-wider">Entered</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white mt-0.5">{stage.entered}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-gray-400 tracking-wider">Exited</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white mt-0.5">{stage.exited || '—'}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-gray-400 tracking-wider">Time in stage</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white mt-0.5">{stage.days} {stage.days === 1 ? 'day' : 'days'}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-gray-400 tracking-wider">Decision</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white mt-0.5">{stage.outcome}</p>
 </div>
 </div>
 <p className="text-[13px] text-[#454f5b] dark:text-gray-300 leading-relaxed">{stage.summary}</p>
 {stage.notes && (
 <div className="text-[13px] leading-relaxed text-gray-500 bg-white dark:bg-[#161c24] rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-800/50">
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
 )}
 {activeTab === 'Scorecards' && (
  <div className="space-y-6 animate-fade-in">
   {/* Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="bg-white dark:bg-[#161c24] p-5 rounded-xl border border-gray-200 shadow-sm dark:border-gray-700/80 flex flex-col gap-2 hover:border-[#1890FF]/40 transition-colors min-h-[120px] h-full">
  <div className="flex justify-between items-start">
  <h3 className="text-[11px] font-bold text-[#212b36] dark:text-white flex items-center gap-2 uppercase tracking-wider"><Bot size={14} className="text-[#00A76F]" /> AI Screening</h3>
  <span className="bg-[#00A76F]/10 text-[#00A76F] px-2 py-0.5 rounded text-[11px] font-bold">9.8/10</span>
  </div>
  <p className="text-[13px] leading-relaxed text-gray-500 leading-relaxed mt-1">Excellent alignment on technical stack. Profile demonstrates high agency.</p>
  </div>
  
  <div className="bg-white dark:bg-[#161c24] p-5 rounded-xl border border-gray-200 shadow-sm dark:border-gray-700/80 flex flex-col gap-2 hover:border-[#1890FF]/40 transition-colors min-h-[120px] h-full">
  <div className="flex justify-between items-start">
  <h3 className="text-[11px] font-bold text-[#212b36] dark:text-white flex items-center gap-2 uppercase tracking-wider"><Cpu size={14} className="text-[#00A76F]" /> AI Interview</h3>
  <span className="bg-[#00A76F]/10 text-[#00A76F] px-2 py-0.5 rounded text-[11px] font-bold">8.5/10</span>
  </div>
  <p className="text-[13px] leading-relaxed text-gray-500 leading-relaxed mt-1">Clear communication. Handled ambiguity well but hesitated on some behavioral prompts.</p>
  </div>

  <div className="bg-gray-50/50 dark:bg-[#161c24]/30 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700/80 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-colors group min-h-[120px] h-full">
  <h3 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
  <User size={14} /> Human Interviews
  </h3>
  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-200/40 dark:bg-gray-800/50 px-2.5 py-0.5 rounded-full mb-1">
  Yet to be done
  </span>
  <button onClick={() => showToast('Opening scheduler...')} className="text-[11px] font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 mt-1">
    <Calendar size={12} /> Schedule Now
  </button>
  </div>
  </div>

  {/* Expandable Scorecards */}
  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden">
  <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
  <h2 className="text-sm font-bold text-[#212b36] dark:text-white flex items-center gap-2 tracking-wider">
  <FileText size={16} className="text-[#1890FF]" /> Interview Scorecards
  </h2>
  <button 
  onClick={() => setOpenScorecards(openScorecards.length > 0 ? [] : MOCK_SCORECARDS.map(s => s.id))}
  className="text-[12px] font-bold text-[#1890FF] hover:bg-[#1890FF]/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
  >
  {openScorecards.length > 0 ? 'Collapse All' : 'Expand All'}
  </button>
  </div>

  <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
  {MOCK_SCORECARDS.map(scorecard => {
  const isOpen = openScorecards.includes(scorecard.id);
  return (
  <div key={scorecard.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
  <button 
  onClick={() => setOpenScorecards(prev => isOpen ? prev.filter(id => id !== scorecard.id) : [...prev, scorecard.id])}
  className="w-full flex items-center justify-between p-5 cursor-pointer"
  >
  <div className="flex items-center gap-4">
  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[12px] font-bold text-[#212b36] dark:text-white">
  {getInitials(scorecard.interviewer)}
  </div>
  <div className="text-left">
  <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">{scorecard.interviewer}</h4>
  <p className="text-[13px] leading-relaxed text-gray-500 mt-0.5">{scorecard.stage} • {scorecard.date}</p>
  </div>
  </div>
  <div className="flex items-center gap-6">
  <div className="text-right hidden sm:block">
  <div className="text-[14px] font-bold text-[#00A76F]">{scorecard.score}</div>
  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Overall</div>
  </div>
  <ChevronDown size={18} className={`text-[#1890FF] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
  </div>
  </button>
  
  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
  <div className="overflow-hidden">
  <div className="p-5 pt-0 grid grid-cols-1 xl:grid-cols-3 gap-6">
  {/* Left Col: Takeaways & Notes */}
  <div className="xl:col-span-2 space-y-5">
  <div>
  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Key Takeaways</h5>
  <p className="text-[13px] text-[#212b36] dark:text-gray-300 leading-relaxed bg-white dark:bg-[#161c24] p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 shadow-sm">
  {scorecard.takeaways}
  </p>
  </div>
  <div>
  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Public Notes</h5>
  <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed pl-1">
  {scorecard.notes}
  </p>
  </div>
  </div>
  
  {/* Right Col: Metrics */}
  <div className="space-y-5">
  <div>
  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Weighting</h5>
  <div className="space-y-4">
  <div>
  <div className="flex justify-between text-[12px] mb-1.5">
  <span className="text-[#212b36] dark:text-gray-300 font-bold">Hard Skills</span>
  <span className={`font-bold ${scorecard.hardSkills >= 8.0 ? 'text-[#00A76F]' : scorecard.hardSkills >= 5.0 ? 'text-[#FFC107]' : 'text-[#FF5630]'}`}>{Number(scorecard.hardSkills).toFixed(1)}/10.0</span>
  </div>
  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
  <div className={`h-2 rounded-full ${scorecard.hardSkills >= 8.0 ? 'bg-[#00A76F]' : scorecard.hardSkills >= 5.0 ? 'bg-[#FFC107]' : 'bg-[#FF5630]'}`} style={{ width: `${(scorecard.hardSkills / 10) * 100}%` }}></div>
  </div>
  </div>
  <div>
  <div className="flex justify-between text-[12px] mb-1.5">
  <span className="text-[#212b36] dark:text-gray-300 font-bold">Soft Skills</span>
  <span className={`font-bold ${scorecard.softSkills >= 8.0 ? 'text-[#00A76F]' : scorecard.softSkills >= 5.0 ? 'text-[#FFC107]' : 'text-[#FF5630]'}`}>{Number(scorecard.softSkills).toFixed(1)}/10.0</span>
  </div>
  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
  <div className={`h-2 rounded-full ${scorecard.softSkills >= 8.0 ? 'bg-[#00A76F]' : scorecard.softSkills >= 5.0 ? 'bg-[#FFC107]' : 'bg-[#FF5630]'}`} style={{ width: `${(scorecard.softSkills / 10) * 100}%` }}></div>
  </div>
  </div>
  </div>
  </div>

  <div>
  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Attributes</h5>
  <div className="flex flex-wrap gap-2">
  {scorecard.attributes.map((attr, idx) => {
  let emoji = '➖';
  if (attr.rating === 'positive') emoji = '👍';
  else if (attr.rating === 'negative') emoji = '👎';
  
  return (
  <span key={idx} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
  attr.rating === 'positive' 
  ? 'bg-[#00A76F]/10 text-[#00A76F] border-[#00A76F]/20'
  : attr.rating === 'negative'
  ? 'bg-[#FF5630]/10 text-[#FF5630] border-[#FF5630]/20'
  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
  }`}>
  <span className="text-[12px]">{emoji}</span>
  {attr.name}
  </span>
  );
  })}
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  );
  })}
  </div>
  </div>
 </div>
 )}

 {activeTab === 'Activity Log' && (
 <div className="space-y-6 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 mb-6">
 <div className="mb-4">
 <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Stage Transitions</h2>
 <p className="text-[13px] leading-relaxed text-gray-500 mt-0.5">Time spent and outcomes for each step of the pipeline.</p>
 </div>
 <div className="overflow-x-auto border border-gray-100 dark:border-gray-800/50 rounded-xl">
 <table className="w-full text-left border-collapse">
 <thead className="bg-gray-50/50 dark:bg-gray-800/20">
 <tr className="border-b border-gray-100 dark:border-gray-800/50">
 <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stage</th>
 <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date Entered</th>
 <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Days Spent</th>
 <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Decision Maker</th>
 <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Outcome</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
 {STAGE_HISTORY.map((stage) => (
 <tr key={stage.id} className="hover:bg-[#1890FF]/5 transition-colors group">
 <td className="py-3 px-4">
 <span className="text-[12px] font-bold text-[#212b36] dark:text-white">{stage.name}</span>
 </td>
 <td className="py-3 px-4">
 <span className="text-[13px] leading-relaxed text-gray-500 whitespace-nowrap">{stage.entered || '-'}</span>
 </td>
 <td className="py-3 px-4">
 <span className={`text-[12px] font-bold ${stage.days > 3 ? 'text-[#FF5630]' : 'text-[#212b36] dark:text-gray-300'}`}>
 {stage.days != null ? `${stage.days} ${stage.days === 1 ? 'day' : 'days'}` : '-'}
 </span>
 </td>
 <td className="py-3 px-4">
 <div className="flex items-center gap-2">
 {stage.owner && (
 <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-300 shrink-0">
 {stage.owner.charAt(0)}
 </div>
 )}
 <span className="text-[12px] text-gray-600 dark:text-gray-400">{stage.owner || 'Unassigned'}</span>
 </div>
 </td>
 <td className="py-3 px-4">
 <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
 stage.outcome.includes('Advance') || stage.outcome.includes('Moved') ? 'bg-[#00A76F]/10 text-[#00A76F]' :
 stage.outcome.includes('progress') || stage.outcome.includes('Kept') ? 'bg-[#1890FF]/10 text-[#1890FF]' :
 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
 }`}>
 {stage.outcome}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
 <div>
 <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Activity on this profile</h2>
 <p className="text-[13px] leading-relaxed text-gray-500 mt-0.5">Stage moves, interviews, agency emails, and hiring-team notes — newest first.</p>
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
 <p className="text-[13px] text-gray-500 py-8 text-center">No activity in this filter yet.</p>
 ) : (
 <div className="space-y-6">
 {Object.entries(activityGroups).map(([date, items]) => (
 <div key={date}>
 <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-3">{date}</p>
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
 <p className="text-[13px] leading-relaxed text-gray-500 mt-0.5">{item.actor} · {item.role}</p>
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
 </div>
 )}
 </div>
</div>

 {isChatCollapsed ? (
 <button
 type="button"
 onClick={() => setIsChatCollapsed(false)}
 className="fixed bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 bg-[#1890FF] text-white rounded-full shadow-2xl hover:bg-[#1890FF]/90 transition-all hover:scale-105 cursor-pointer"
 aria-label="Expand team chat"
 >
 <MessageSquare size={24} />
 </button>
 ) : (
 <div className="w-full xl:w-[340px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 flex flex-col overflow-hidden min-h-[640px]">
 <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
 <div>
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Hiring team</h3>
 <p className="text-[13px] leading-relaxed text-gray-500">Private to this requisition</p>
 </div>
 <button type="button" onClick={() => setIsChatCollapsed(true)} className="p-1.5 text-[#1890FF] bg-[#1890FF]/10 hover:bg-[#1890FF]/20 rounded-lg cursor-pointer transition-colors" aria-label="Collapse team chat">
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
 className="w-full pl-3 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-[13px] text-[#212b36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20"
 />
 <button type="button" onClick={sendChat} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg cursor-pointer">
 <Send size={16} />
 </button>
 </div>
 </div>
 </div>
 )}
</div>

{toast && (
 <div className="fixed bottom-6 right-6 z-[120] bg-[#212b36] text-white px-5 py-3 rounded-xl shadow-lg text-[13px] font-medium">
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
