import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserX, UserCheck, ChevronRight, ChevronDown, Search, Star, FileText, CheckSquare, Clock, MapPin, Plus, ClipboardEdit, FileCheck, AlertCircle, UserPlus, Activity, X, Video, Filter, MoreHorizontal, Settings, Settings2, Copy, Users as UsersIcon, CheckCircle, Calendar, Briefcase, CalendarDays, ArrowLeft, Check, ArrowUpRight, Download, ExternalLink, Columns, FileSignature, ClipboardList, Bell, Mail, Phone, Globe, BookOpen, Bookmark } from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';
import DualRangeSlider from '../components/ui/DualRangeSlider';
import RejectAgencyModal from '../components/dashboard/RejectAgencyModal';
import SettingsDescriptionSkills from '../components/dashboard/settings/SettingsDescriptionSkills';
import SettingsHiringTeam from '../components/dashboard/settings/SettingsHiringTeam';
import SettingsPipeline from '../components/dashboard/settings/SettingsPipeline';
import SettingsApplications from '../components/dashboard/settings/SettingsApplications';
import SettingsScorecards from '../components/dashboard/settings/SettingsScorecards';
import SettingsRankingRules from '../components/dashboard/settings/SettingsRankingRules';
import SettingsAgencies from '../components/dashboard/settings/SettingsAgencies';
import SettingsNotifications from '../components/dashboard/settings/SettingsNotifications';
import JobSetupHeader from '../components/dashboard/JobSetupHeader';

// --- MOCK DATA ---
const pipelineData = [
 { stage: 'Application Review', count: 124, avgTime: '2d' },
 { stage: 'To be rejected', count: 45, avgTime: null },
 { stage: 'To be rejected - After interview', count: 12, avgTime: null },
 { stage: 'Reference Check', count: 8, avgTime: '14d', warning: true },
 { stage: 'Put on hold', count: 3, avgTime: '21d', warning: true },
 { stage: 'Offer', count: 2, avgTime: '3d' },
 { stage: 'Hired', count: 1, avgTime: null },
];

const initialPipelineBoardData = [
 {
 title: 'Applied (45)',
 candidates: [
 { id: 101, name: 'Ravi Desai', role: 'Software Engineer', score: 92, time: '2h', experience: '5 YOE', company: 'Infosys', location: 'Bangalore', skills: ['React', 'Node.js', 'AWS'], noticePeriod: '30 Days' },
 { id: 102, name: 'Sneha Patil', role: 'Frontend Engineer', score: 88, time: '5h', experience: '3 YOE', company: 'TCS', location: 'Pune', skills: ['Vue', 'JS', 'CSS'], noticePeriod: '15 Days' },
 { id: 103, name: 'Karan Mehra', role: 'UI Developer', score: 85, time: '1d', experience: '4 YOE', company: 'Wipro', location: 'Delhi', skills: ['React', 'Figma', 'HTML'], noticePeriod: 'Immediate' },
 { id: 104, name: 'Ankita Rao', role: 'React Developer', score: 81, time: '1d', experience: '2 YOE', company: 'Startup Inc', location: 'Hyderabad', skills: ['React', 'Redux', 'Tailwind'], noticePeriod: '60 Days' },
 { id: 105, name: 'Varun Khanna', role: 'Web Developer', score: 79, time: '2d', experience: '1 YOE', company: 'Freelance', location: 'Remote', skills: ['HTML', 'CSS', 'JS'], noticePeriod: 'Immediate' },
 ]
 },
 {
 title: 'Screening (12)',
 candidates: [
 { id: 201, name: 'Pooja Iyer', role: 'Software Engineer', score: 94, time: '1d', experience: '6 YOE', company: 'Amazon', location: 'Chennai', skills: ['Java', 'Spring', 'AWS'], noticePeriod: '90 Days' },
 { id: 202, name: 'Rahul Verma', role: 'Frontend Engineer', score: 91, time: '2d', experience: '4 YOE', company: 'Flipkart', location: 'Bangalore', skills: ['React', 'Next.js', 'TS'], noticePeriod: '30 Days' },
 { id: 203, name: 'Divya Singh', role: 'Senior React', score: 89, time: '3d', experience: '7 YOE', company: 'Paytm', location: 'Noida', skills: ['React', 'GraphQL', 'Jest'], noticePeriod: '45 Days' },
 ]
 },
 {
 title: 'Interviewing (5)',
 candidates: [
 { id: 301, name: 'Ananya Sharma', role: 'Senior React', score: 98, time: '1d', experience: '8 YOE', company: 'Google', location: 'Bangalore', skills: ['React', 'Performance', 'Architecture'], noticePeriod: '30 Days' },
 { id: 302, name: 'Arjun Kumar', role: 'UI Developer', score: 95, time: '2d', experience: '5 YOE', company: 'Microsoft', location: 'Hyderabad', skills: ['React', 'FluentUI', 'C#'], noticePeriod: '60 Days' },
 ]
 },
 {
 title: 'Put On Hold (3)',
 candidates: [
 { id: 401, name: 'Nitin Gupta', role: 'Frontend Engineer', score: 90, time: '5d', experience: '3 YOE', company: 'Swiggy', location: 'Bangalore', skills: ['React', 'Redux', 'Webpack'], noticePeriod: '15 Days' },
 ]
 },
 {
 title: 'Offer (2)',
 candidates: [
 { id: 501, name: 'Priya Patel', role: 'Software Engineer', score: 96, time: '1d', experience: '6 YOE', company: 'Zomato', location: 'Gurgaon', skills: ['React', 'Node', 'System Design'], noticePeriod: '30 Days' },
 ]
 }
];

const rediscoveryCandidates = [
 { id: 1, name: 'Ananya Sharma', role: 'Senior React Developer', match: '98%', lastContact: '2 months ago' },
 { id: 2, name: 'Rahul Verma', role: 'Frontend Engineer', match: '95%', lastContact: '6 months ago' },
 { id: 3, name: 'Priya Patel', role: 'UI Developer', match: '92%', lastContact: '1 year ago' },
];

const hiringTeam = [
 { id: 1, name: 'Priya (Recruiter)', initials: 'PR', color: 'bg-[#1890FF]/20 text-[#1890FF]' },
 { id: 2, name: 'Amit (Manager)', initials: 'AM', color: 'bg-[#00A76F]/20 text-[#00A76F]' },
 { id: 3, name: 'Rahul (Interviewer)', initials: 'RA', color: 'bg-[#FFC107]/20 text-[#b78103]' },
];

const actionItems = [
 { id: 1, title: 'Interview Scorecard: Sneha Patil', subtitle: 'Technical Interview - Pending your review', type: 'review' },
 { id: 2, title: 'Approve Offer: Rahul Verma', subtitle: 'Due tomorrow', type: 'offer' },
 { id: 3, title: 'Review 5 new top applicants', subtitle: 'High Priority', type: 'review' },
];

const upcomingInterviews = [
 { id: 1, candidate: 'Ananya Sharma', role: 'Senior React Developer', time: 'Today, 2:00 PM', duration: '45 mins', platform: 'Zoom', score: 98, type: 'Technical Interview', interviewer: 'Amit', status: 'Accepted' },
 { id: 2, candidate: 'Rahul Verma', role: 'Frontend Engineer', time: 'Tomorrow, 10:30 AM', duration: '30 mins', platform: 'Google Meet', score: 95, type: 'Culture Fit', interviewer: 'Priya', status: 'Pending' },
 { id: 3, candidate: 'Sneha Patil', role: 'Software Engineer', time: 'Tomorrow, 3:00 PM', duration: '60 mins', platform: 'Teams', score: 88, type: 'System Design', interviewer: 'Vikram', status: 'Accepted' },
 { id: 4, candidate: 'Karan Mehra', role: 'UI Developer', time: 'Thursday, 1:00 PM', duration: '45 mins', platform: 'Zoom', score: 85, type: 'Culture Fit', interviewer: 'Priya', status: 'Pending' },
 { id: 5, candidate: 'Pooja Desai', role: 'Product Manager', time: 'Friday, 11:00 AM', duration: '60 mins', platform: 'Google Meet', score: 92, type: 'Leadership Round', interviewer: 'Sanjay', status: 'Accepted' },
 { id: 6, candidate: 'Rohan Gupta', role: 'Data Scientist', time: 'Friday, 4:00 PM', duration: '90 mins', platform: 'Teams', score: 99, type: 'Technical Assessment', interviewer: 'Neha', status: 'Declined' },
 { id: 7, candidate: 'Meera Reddy', role: 'UX Designer', time: 'Next Mon, 10:00 AM', duration: '30 mins', platform: 'Zoom', score: 81, type: 'Portfolio Review', interviewer: 'Amit', status: 'Pending' },
];

const AGENCY_BENCH = [
 { agency: 'TechTalent Partners', agencyEmail: 'desk@techtalentpartners.com' },
 { agency: 'Elite Hiring Solutions', agencyEmail: 'submissions@elitehiring.com' },
 { agency: 'Vanguard Recruitment', agencyEmail: 'jobs@vanguardrecruit.com' },
 { agency: 'Global Recruiters Inc.', agencyEmail: 'india@globalrecruiters.com' },
 { agency: 'NextGen Staffing', agencyEmail: 'profiles@nextgenstaffing.com' },
];

const MOCK_CANDIDATES = [
 { id: 1, name: 'Ananya Sharma', stage: 'Technical Interview', score: '9.8/10', date: '2 days ago' },
 { id: 2, name: 'Rahul Verma', stage: 'Culture Fit', score: '6.0/10', date: '1 day ago' },
 { id: 3, name: 'Priya Patel', stage: 'Application Review', score: '3.2/10', date: '5 hours ago' },
 { id: 4, name: 'Arjun Kumar', stage: 'Reference Check', score: '8.4/10', date: '4 days ago' },
 { id: 5, name: 'Ravi Desai', stage: 'Applied', score: '4.5/10', date: '2 hours ago' },
 { id: 6, name: 'Sneha Patil', stage: 'Screening', score: '4.2/10', date: '5 hours ago' },
 { id: 7, name: 'Karan Mehra', stage: 'Interviewing', score: '7.1/10', date: '1 day ago' },
 { id: 8, name: 'Ankita Rao', stage: 'Offer', score: '8.1/10', date: '1 day ago' },
 { id: 9, name: 'Varun Khanna', stage: 'Applied', score: '2.8/10', date: '2 days ago' },
 { id: 10, name: 'Pooja Iyer', stage: 'Screening', score: '9.4/10', date: '1 day ago' },
 { id: 11, name: 'Divya Singh', stage: 'Technical Interview', score: '6.8/10', date: '3 days ago' },
 { id: 12, name: 'Nitin Gupta', stage: 'Put On Hold', score: '4.9/10', date: '5 days ago' },
 { id: 13, name: 'Neha Sharma', stage: 'Applied', score: '7.9/10', date: '1 week ago' },
 { id: 14, name: 'Amit Singh', stage: 'Screening', score: '3.1/10', date: '1 week ago' },
 { id: 15, name: 'Kavita Das', stage: 'Reference Check', score: '8.6/10', date: '2 weeks ago' },
 { id: 16, name: 'Rohit Joshi', stage: 'Offer', score: '5.2/10', date: '2 days ago' },
 ].map((c, i) => ({ ...c, ...AGENCY_BENCH[i % AGENCY_BENCH.length] }));

const roleOptions = [
 { value: 'interviewer', label: 'Interviewer', description: 'Can score candidates' },
 { value: 'hiring_manager', label: 'Hiring Manager', description: 'Full access to pipeline and offers' },
 { value: 'recruiter', label: 'Recruiter', description: 'Can manage pipeline and screen candidates' },
 { value: 'observer', label: 'Observer', description: 'Read-only access' }
];

const recentActivity = [
 { id: 1, action: 'Sneha Patil applied for the role via LinkedIn', time: '2 hours ago', icon: UserPlus, color: 'text-[#1890FF] bg-[#1890FF]/10' },
 { id: 2, action: 'Priya left a 4-star scorecard for Rahul Verma', time: '4 hours ago', icon: Star, color: 'text-[#FFC107] bg-[#FFC107]/10' },
 { id: 3, action: 'Amit moved Ananya Sharma to Tech Interview', time: 'Yesterday, 3:30 PM', icon: Activity, color: 'text-[#00A76F] bg-[#00A76F]/10' },
 { id: 4, action: 'Automated screening rejected 12 candidates', time: 'Yesterday, 9:00 AM', icon: UserX, color: 'text-[#FF5630] bg-[#FF5630]/10' },
];

const SAMPLE_RESUME_URL = `${import.meta.env.BASE_URL}resumes/sample-resume.pdf`;

const getInitials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const parseScore = (score) => {
 if (typeof score === 'number') return score > 10 ? score / 10 : score;
 const match = String(score ?? '').match(/(\d+(\.\d+)?)/);
 return match ? Number(match[1]) : 0;
};

const getScoreStyles = (score) => {
 const n = parseScore(score);
 if (n >= 8) {
 return {
 label: 'Strong match',
 text: 'text-[#00A76F]',
 muted: 'text-[#00A76F]/70',
 badge: 'text-[#008a5b] bg-[#00A76F]/10',
 fill: 'bg-[#00A76F] text-white',
 card: 'bg-[#00A76F]/10 border-[#00A76F]/20'
 };
 }
 if (n >= 5) {
 return {
 label: 'Moderate match',
 text: 'text-[#b78103]',
 muted: 'text-[#b78103]/70',
 badge: 'text-[#966b02] bg-[#FFC107]/10',
 fill: 'bg-[#FFC107] text-white',
 card: 'bg-[#FFC107]/10 border-[#FFC107]/20'
 };
 }
 return {
 label: 'Weak match',
 text: 'text-[#FF5630]',
 muted: 'text-[#FF5630]/70',
 badge: 'text-[#d43c15] bg-[#FF5630]/10',
 fill: 'bg-[#FF5630] text-white',
 card: 'bg-[#FF5630]/10 border-[#FF5630]/20'
 };
};

const SCREENING_CRITERIA = [
 { label: 'Technical skills', score: 9.2, text: 'React, Node.js, AWS and architecture are a strong match. Demonstrates deep proficiency in modern frontend frameworks, backend services, and cloud infrastructure.' },
 { label: 'Relevant experience', score: 6.5, text: 'Useful delivery history, but not fully at the seniority this mandate needs. Has led projects with measurable impact; people-management depth is still developing.' },
 { label: 'Industry knowledge', score: 3.2, text: 'Limited exposure to the specific domain. Lacks direct experience in AI research or adjacent scientific fields, which may require additional onboarding and ramp-up time.' },
 { label: 'Role alignment', score: 8.2, text: 'Experience and seniority closely match this role. Career progression shows consistent growth into senior technical leadership positions.' },
 { label: 'Communication', score: 5.4, text: 'Clear enough in written screening, but weaker stakeholder storytelling. Can present to engineers; less proven with non-technical audiences.' }
];

function MiniCheckbox({ checked, indeterminate = false, visible, onChange, label, revealGroup = 'cand' }) {
 return (
 <button
 type="button"
 role="checkbox"
 aria-checked={indeterminate ? 'mixed' : checked}
 aria-label={label}
 onClick={(e) => { e.stopPropagation(); onChange(); }}
 className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group/mini"
 >
 <span
 className={`flex items-center justify-center w-4 h-4 rounded-[4px] border-[1.5px] shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-150 ${
 checked || indeterminate
 ? 'bg-[#1890FF] border-[#1890FF] scale-100 opacity-100'
 : 'bg-white dark:bg-[#161c24] border-gray-400 dark:border-gray-500 opacity-50 group-hover/mini:opacity-100 group-hover/mini:border-gray-800 dark:group-hover/mini:border-gray-300'
 }`}
 >
 {checked && !indeterminate && <Check size={10} strokeWidth={3.5} className="text-white" />}
 {indeterminate && <span className="block w-2 h-[2px] rounded-full bg-white" />}
 </span>
 </button>
 );
}

export default function JobDashboardPage() {
 const navigate = useNavigate();
 const location = useLocation();
 const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
 const [inviteRole, setInviteRole] = useState('');
 const [showInviteSuccess, setShowInviteSuccess] = useState(false);
 const [showCopyToast, setShowCopyToast] = useState(false);
 const jobData = location.state?.jobData || null;
 const isDraft = jobData?.status === 'Draft';
 const [activeTab, setActiveTab] = useState(location.state?.tab || (isDraft ? 'Job Setup' : 'Overview'));
 const [settingsActiveNav, setSettingsActiveNav] = useState('Overview');
 const [setupJobData, setSetupJobData] = useState({
 title: jobData?.title || 'Senior AI Research Scientist',
 department: jobData?.department || 'Research',
 location: jobData?.location || 'Bangalore, India',
 type: jobData?.type || 'Full-time',
 workMode: jobData?.workMode || 'Hybrid',
 headcount: jobData?.headcount || '1',
 salaryMin: jobData?.salaryMin || '400000',
 salaryMax: jobData?.salaryMax || '600000',
 currency: jobData?.currency || 'INR',
 internalNotes: jobData?.internalNotes || '',
 requisitionRef: jobData?.requisitionRef || 'REQ-2024-001',
 status: jobData?.status || 'Published',
 isConfidential: jobData?.isConfidential || false
 });
 const [pipelineBoard, setPipelineBoard] = useState(initialPipelineBoardData);
 const [selectedCandidate, setSelectedCandidate] = useState(null);
 const [moveDropdownId, setMoveDropdownId] = useState(null);

 const [candidateList, setCandidateList] = useState(MOCK_CANDIDATES);
 const [selectedAppCandidate, setSelectedAppCandidate] = useState(
 MOCK_CANDIDATES.find(c => String(c.id) === String(location.state?.selectedCandidateId)) || MOCK_CANDIDATES[0]
 );
 const [isUploadingResume, setIsUploadingResume] = useState(false);
 const [isAIScreening, setIsAIScreening] = useState(false);
 const [isEditRankingModalOpen, setIsEditRankingModalOpen] = useState(false);

 // Applications Tab State
 const [selectedAppCandidates, setSelectedAppCandidates] = useState([]);
 const [currentPageApp, setCurrentPageApp] = useState(1);
 const [openStageMenuId, setOpenStageMenuId] = useState(null);
 const [isBulkStageMenuOpen, setIsBulkStageMenuOpen] = useState(false);
 const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
 const [rejectCards, setRejectCards] = useState([]);
 const [appSearchQuery, setAppSearchQuery] = useState('');
 const [appFilterStage, setAppFilterStage] = useState('All');
 const [appSortBy, setAppSortBy] = useState('Rating');
 const [isFilterStageOpen, setIsFilterStageOpen] = useState(false);
 const [isSortByOpen, setIsSortByOpen] = useState(false);

 useEffect(() => {
 const handleGlobalClick = () => {
 setIsFilterStageOpen(false);
 setIsSortByOpen(false);
 setIsBulkStageMenuOpen(false);
 setOpenStageMenuId(null);
 };
 window.addEventListener('click', handleGlobalClick);
 return () => window.removeEventListener('click', handleGlobalClick);
 }, []);

 const itemsPerPageApp = 5;
 const appSearch = appSearchQuery.trim().toLowerCase();
 const liveCandidates = candidateList.map(c => {
 const mock = MOCK_CANDIDATES.find(m => m.id === c.id);
 return mock ? { ...c, score: mock.score } : c;
 });
 const previewCandidate = liveCandidates.find(c => c.id === selectedAppCandidate?.id) || selectedAppCandidate;
 const previewScore = parseScore(previewCandidate?.score);
 const showRejectCta = previewScore < 5;
 let filteredAppCandidates = liveCandidates.filter(c => {
 if (appFilterStage !== 'All' && c.stage !== appFilterStage) return false;
 if (!appSearch) return true;
 return (
 c.name.toLowerCase().includes(appSearch) ||
 c.stage.toLowerCase().includes(appSearch) ||
 (c.agency && c.agency.toLowerCase().includes(appSearch))
 );
 });

 filteredAppCandidates.sort((a, b) => {
 if (appSortBy === 'Rating') return parseScore(b.score) - parseScore(a.score);
 if (appSortBy === 'Name') return a.name.localeCompare(b.name);
 if (appSortBy === 'Stage') return a.stage.localeCompare(b.stage);
 if (appSortBy === 'Age in Stage') return (a.date || '').localeCompare(b.date || '');
 return 0;
 });
 const totalPagesApp = Math.max(1, Math.ceil(filteredAppCandidates.length / itemsPerPageApp));
 const currentAppCandidates = filteredAppCandidates.slice((currentPageApp - 1) * itemsPerPageApp, currentPageApp * itemsPerPageApp);

 const toggleAppCandidateSelect = (id) => {
 if (selectedAppCandidates.includes(id)) {
 setSelectedAppCandidates(prev => prev.filter(x => x !== id));
 return;
 }
 setSelectedAppCandidates(prev => [...prev, id]);
 };

 const openRejectModal = (ids) => {
 const uniqueIds = [...new Set(ids)];
 setRejectCards(candidateList.filter(c => uniqueIds.includes(c.id)));
 setIsRejectModalOpen(true);
 setOpenStageMenuId(null);
 setIsBulkStageMenuOpen(false);
 };

 const handleCandidateStageChange = (candidateId, stage) => {
 if (stage === 'Reject') {
 openRejectModal([candidateId]);
 return;
 }
 setCandidateList(prev => prev.map(c => c.id === candidateId ? { ...c, stage } : c));
 setSelectedAppCandidate(prev => prev?.id === candidateId ? { ...prev, stage } : prev);
 setOpenStageMenuId(null);
 };

 const handleBulkStageChange = (stage) => {
 if (stage === 'Reject') {
 openRejectModal(selectedAppCandidates);
 return;
 }
 setCandidateList(prev => prev.map(c => selectedAppCandidates.includes(c.id) ? { ...c, stage } : c));
 setSelectedAppCandidate(prev => prev && selectedAppCandidates.includes(prev.id) ? { ...prev, stage } : prev);
 setIsBulkStageMenuOpen(false);
 setSelectedAppCandidates([]);
 };

 const closeRejectModal = () => {
 setIsRejectModalOpen(false);
 setRejectCards([]);
 };

 const handleSendRejectEmails = (cards) => {
 const ids = cards.map(card => card.id);
 setCandidateList(prev => prev.map(c => ids.includes(c.id) ? { ...c, stage: 'Reject' } : c));
 setSelectedAppCandidate(prev => prev && ids.includes(prev.id) ? { ...prev, stage: 'Reject' } : prev);
 setSelectedAppCandidates(prev => prev.filter(id => !ids.includes(id)));
 closeRejectModal();
 };

 const [interviewsList, setInterviewsList] = useState(upcomingInterviews);
 const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
 const [scheduleData, setScheduleData] = useState({ candidate: '', type: 'Technical Interview', interviewer: 'Amit', date: '', time: '' });
 const [scheduleErrors, setScheduleErrors] = useState({});

 // Hot reload sync for mock data
 const candidateMockKey = MOCK_CANDIDATES.map(c => `${c.id}:${c.score}`).join('|');
 useEffect(() => {
 setInterviewsList(upcomingInterviews);
 setCandidateList(MOCK_CANDIDATES);
 setSelectedAppCandidate(prev => MOCK_CANDIDATES.find(c => c.id === prev?.id) || MOCK_CANDIDATES[0]);
 }, [candidateMockKey]);

 useEffect(() => {
 const closeMenus = () => {
 setOpenStageMenuId(null);
 setIsBulkStageMenuOpen(false);
 };
 document.addEventListener('click', closeMenus);
 return () => document.removeEventListener('click', closeMenus);
 }, []);

 // Candidate Tab State
 const [searchQuery, setSearchQuery] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 8;

 const filteredCandidates = candidateList.filter(c => 
 c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 c.stage.toLowerCase().includes(searchQuery.toLowerCase())
 );
 
 const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
 const currentCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 const tabs = ['Overview', 'Applications Review', 'Job Description', 'Pipeline', 'Candidates', 'Interviews', 'Team & Scorecards', 'Job Setup'];

 const handleMoveCandidate = (candidate, fromStage, toStage) => {
 setPipelineBoard(prev => {
 const newData = [...prev];
 const fromIndex = newData.findIndex(col => col.title === fromStage);
 
 if (fromIndex !== -1) {
 // If Rejecting, just remove from current column
 if (toStage === 'Reject') {
 newData[fromIndex] = { ...newData[fromIndex], candidates: newData[fromIndex].candidates.filter(c => c.id !== candidate.id) };
 } else {
 const toIndex = newData.findIndex(col => col.title === toStage);
 if (toIndex !== -1) {
 newData[fromIndex] = { ...newData[fromIndex], candidates: newData[fromIndex].candidates.filter(c => c.id !== candidate.id) };
 newData[toIndex] = { ...newData[toIndex], candidates: [candidate, ...newData[toIndex].candidates] };
 }
 }
 }
 return newData;
 });
 setMoveDropdownId(null);
 };

 const handleSendInvite = () => {
 setIsInviteModalOpen(false);
 setInviteRole('');
 setShowInviteSuccess(true);
 setTimeout(() => {
 setShowInviteSuccess(false);
 }, 3000);
 };

 const handleScheduleSubmit = (e) => {
 e.preventDefault();
 
 // Validate
 const errors = {};
 if (!scheduleData.candidate) errors.candidate = 'Please select a candidate';
 if (!scheduleData.interviewer) errors.interviewer = 'Please select an interviewer';
 if (!scheduleData.date) errors.date = 'Date is required';
 if (!scheduleData.time) errors.time = 'Time is required';
 
 if (Object.keys(errors).length > 0) {
 setScheduleErrors(errors);
 return;
 }
 
 // Convert date string to a friendlier format for mock
 const dateObj = new Date(scheduleData.date);
 const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 
 const newInt = {
 id: Date.now(),
 candidate: scheduleData.candidate,
 role: 'Senior AI Research Scientist',
 time: `${dateStr}, ${scheduleData.time}`,
 duration: '45 mins',
 platform: 'Google Meet',
 score: 92,
 status: 'Pending',
 type: scheduleData.type,
 interviewer: scheduleData.interviewer
 };
 
 setInterviewsList([newInt, ...interviewsList]);
 setIsScheduleModalOpen(false);
 setScheduleData({ candidate: '', type: 'Technical Interview', interviewer: 'Amit', date: '', time: '' });
 setScheduleErrors({});
 };

 return (
 <div className="p-6 space-y-6 relative">
 
 {/* HEADER */}
 <div className="mb-2">
 <button onClick={() => navigate('/dashboard/jobs')} className="text-[13px] font-bold text-black dark:text-gray-400 hover:text-[#1890FF] flex items-center gap-1.5 transition-colors w-fit mb-4 cursor-pointer">
 <ArrowLeft size={16} /> Back to Job List
 </button>
 <div className="flex items-center justify-between">
 <div>
 <div className="flex items-center gap-3">
 <h1 className="text-2xl font-bold text-[#212b36] dark:text-white ">{setupJobData.title}</h1>
 <span className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${setupJobData.status === 'Draft' ? 'bg-[#FFC107]/10 text-[#b78103] dark:text-[#FFC107]' : setupJobData.status === 'Closed' ? 'bg-[#FF5630]/10 text-[#FF5630]' : setupJobData.status === 'Internal' ? 'bg-[#1890FF]/10 text-[#1890FF]' : 'bg-[#00A76F]/10 text-[#00A76F]'}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${setupJobData.status === 'Draft' ? 'bg-[#FFC107]' : setupJobData.status === 'Closed' ? 'bg-[#FF5630]' : setupJobData.status === 'Internal' ? 'bg-[#1890FF]' : 'bg-[#00A76F]'}`}></span>
 {setupJobData.status}
 </span>
 </div>
 <p className="text-[13px] text-black dark:text-white mt-1 flex items-center gap-1.5 font-medium">
 <MapPin size={16} className="text-[#00A76F]" />
 {setupJobData.location} • {setupJobData.workMode}
 </p>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex -space-x-2">
 {hiringTeam.map(member => (
 <div key={member.id} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#161c24] cursor-pointer ${member.color}`} title={member.name}>
 {member.initials}
 </div>
 ))}
 </div>
 <button 
 onClick={() => setIsInviteModalOpen(true)}
 className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700/50 flex items-center justify-center text-gray-400 dark:text-white hover:text-[#1890FF] hover:border-[#1890FF] transition-colors cursor-pointer" 
 title="Invite Team Member"
 >
 <Plus size={14} />
 </button>
 </div>
 </div>
 </div>

 {/* JOB NAVIGATION TABS */}
 <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 dark:border-gray-800/50 mt-4 pb-px">
 {tabs.map((tab) => {
 const isDisabled = isDraft && tab !== 'Job Setup';
 return (
 <button
 key={tab}
 onClick={() => !isDisabled && setActiveTab(tab)}
 disabled={isDisabled}
 className={`pb-3 text-[13px] font-bold transition-colors whitespace-nowrap relative ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${
 activeTab === tab 
 ? 'text-[#1890FF] dark:text-[#1890FF]' 
 : (isDisabled ? 'text-gray-400 dark:text-gray-500' : 'text-black hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white')
 }`}
 >
 {tab}
 {activeTab === tab && (
 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1890FF] rounded-t-full"></span>
 )}
 </button>
 );
 })}
 </div>

 {/* OVERVIEW TAB */}
 {activeTab === 'Overview' && (
 <div className="space-y-6 animate-fade-in">
 {/* METRICS ROW */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-[#1890FF]/10 flex items-center justify-center shrink-0">
 <Users size={24} className="text-[#1890FF]" />
 </div>
 <div>
 <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Total Applications</p>
 <h3 className="text-3xl font-bold text-[#212b36] dark:text-white ">2,450</h3>
 </div>
 </div>
 
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-[#00A76F]/10 flex items-center justify-center shrink-0">
 <UserCheck size={24} className="text-[#00A76F]" />
 </div>
 <div>
 <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Active Candidates</p>
 <h3 className="text-3xl font-bold text-[#212b36] dark:text-white ">184</h3>
 </div>
 </div>

 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-[#FF5630]/10 flex items-center justify-center shrink-0">
 <UserX size={24} className="text-[#FF5630]" />
 </div>
 <div>
 <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Rejected</p>
 <h3 className="text-3xl font-bold text-[#212b36] dark:text-white ">2,266</h3>
 </div>
 </div>
 </div>

 {/* MAIN GRID */}
 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
 
 {/* LEFT COLUMN (Manager Activity) */}
 <div className="xl:col-span-2 space-y-6">
 
 {/* Upcoming Interviews */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Video size={20} className="text-[#1890FF]" />
 Upcoming Interviews
 </h3>
 <button onClick={() => setActiveTab('Interviews')} className="text-[13px] font-bold text-[#1890FF] hover:bg-[#1890FF]/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
 View Calendar
 </button>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {interviewsList.map(interview => (
 <div key={interview.id} className="border border-gray-100 dark:border-gray-800/50 p-4 rounded-xl hover:border-[#1890FF]/30 hover: transition-all group cursor-pointer">
 <div className="flex items-start justify-between mb-2">
 <div>
 <div className="flex items-center gap-2">
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">{interview.candidate}</h4>
 <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(interview.score || 90) >= 90 ? 'bg-[#00A76F]/20 text-[#00A76F] dark:text-[#22c55e]' : 'bg-[#FFC107]/20 text-[#b78103] dark:text-[#FFC107]'}`}>
 {interview.score || 90}% Match
 </span>
 </div>
 <p className="text-xs text-black dark:text-gray-400 mt-0.5">{interview.role}</p>
 </div>
 <span className="bg-[#1890FF]/10 text-[#1890FF] text-[11px] font-bold px-2 py-1 rounded-md text-right">
 {interview.time}<br/><span className="text-[10px] opacity-90">{interview.platform || 'Zoom'}</span>
 </span>
 </div>
 <div className="flex items-center gap-2 mt-4 text-xs font-medium text-black dark:text-gray-400">
 <span className="flex items-center gap-1.5"><UserCheck size={14} className="text-[#1890FF]/70 shrink-0" /> {interview.type}</span>
 <span className="mx-1">•</span>
 <span>{interview.duration || '45 mins'}</span>
 </div>
 <div className="mt-4 flex gap-2">
 <button className="flex-1 py-1.5 text-xs font-bold text-[#1890FF] bg-[#1890FF]/10 hover:bg-[#1890FF]/20 rounded-lg transition-colors cursor-pointer">
 Join Call
 </button>
 <button onClick={(e) => { e.stopPropagation(); setActiveTab('Candidates'); }} className="flex-1 py-1.5 text-xs font-bold text-black bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
 View Profile
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Pending Reviews / Action Items */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-4 flex items-center gap-2">
 <ClipboardEdit size={20} className="text-[#FFC107]" />
 Pending Reviews & Approvals
 </h3>
 <div className="space-y-3">
 {actionItems.map(item => (
 <div key={item.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:border-[#FFC107]/30 hover: transition-all cursor-pointer group">
 <div className="flex gap-4">
 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
 item.type === 'offer' ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-[#FFC107]/10 text-[#FFC107]'
 }`}>
 {item.type === 'offer' ? <FileCheck size={18} /> : <FileText size={18} />}
 </div>
 <div>
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#FFC107] transition-colors mb-1">{item.title}</h4>
 <p className="text-xs font-medium text-black dark:text-gray-400">{item.subtitle}</p>
 </div>
 </div>
 <button className="px-3 py-1.5 text-xs font-bold text-white bg-[#212b36] dark:bg-gray-700 hover:bg-[#161c24] dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
 Review
 </button>
 </div>
 ))}
 </div>
 </div>

 {/* Recent Activity Feed */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">
 <Activity size={20} className="text-[#1890FF]" />
 Recent Activity
 </h3>
 <div className="space-y-6 relative">
 <div className="absolute top-2 bottom-2 left-[15px] w-px bg-gray-100 dark:bg-gray-800/50 z-0"></div>
 {recentActivity.map(activity => (
 <div key={activity.id} className="relative z-10 flex gap-4">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#161c24] ${activity.color}`}>
 <activity.icon size={14} />
 </div>
 <div className="pt-1.5">
 <p className="text-[13px] font-medium text-[#212b36] dark:text-white leading-snug">{activity.action}</p>
 <p className="text-xs text-[#919eab] mt-0.5">{activity.time}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* RIGHT COLUMN */}
 <div className="space-y-6">
 
 {/* Pipeline summary */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white">Pipeline</h3>
 <button onClick={() => setActiveTab('Pipeline')} className="text-[13px] font-bold text-[#1890FF] hover:bg-[#1890FF]/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
 Board
 </button>
 </div>
 <div className="space-y-1 relative">
 {/* Vertical line connecting the steps */}
 <div className="absolute top-4 bottom-4 left-[11px] w-0.5 bg-gray-100 dark:bg-gray-800/50 z-0"></div>
 
 {pipelineData.map((item, index) => {
 const isFinal = index >= pipelineData.length - 2; // Offer, Hired
 const isRejected = item.stage.toLowerCase().includes('reject');
 const isReview = item.stage === 'Application Review';
 const isRefCheck = item.stage === 'Reference Check';
 const isHold = item.stage === 'Put on hold';
 
 let dotColor = "border-gray-300 dark:border-gray-700/50 bg-white dark:bg-[#161c24]";
 if (isFinal) dotColor = "border-[#00A76F] bg-[#00A76F]";
 else if (isRejected) dotColor = "border-[#FF5630] bg-[#FF5630]";
 else if (isHold) dotColor = "border-[#FFC107] bg-[#FFC107]";
 else dotColor = "border-[#1890FF] bg-[#1890FF]";

 return (
 <div key={item.stage} className="relative z-10 flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group">
 <div className="flex items-center gap-4">
 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${dotColor}`}>
 {isFinal && <UserCheck size={12} className="text-white" />}
 {isRejected && <UserX size={12} className="text-white" />}
 {isReview && <FileText size={12} className="text-white" />}
 {isRefCheck && <CheckSquare size={12} className="text-white" />}
 {isHold && <Clock size={12} className="text-white" />}
 </div>
 <span className="text-[13px] font-medium text-[#454f5b] dark:text-white group-hover:text-[#1890FF] transition-colors">{item.stage}</span>
 </div>
 <div className="flex items-center gap-2">
 {item.avgTime && (
 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.warning ? 'bg-[#FF5630]/10 text-[#FF5630]' : 'bg-gray-100 dark:bg-gray-800/50 text-black dark:text-white '}`} title="Average time in stage">
 Avg {item.avgTime}
 </span>
 )}
 <span className="text-[13px] font-bold bg-gray-100 dark:bg-gray-800/50 px-2.5 py-0.5 rounded-full text-[#212b36] dark:text-white ">
 {item.count}
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Top Recommendations / Talent Rediscovery */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Search size={20} className="text-[#1890FF]" />
 Top Recommendations
 </h3>
 </div>
 <p className="text-[13px] text-black dark:text-white mb-3 leading-relaxed">
 AI found past candidates perfectly matching this role.
 </p>
 
 <div className="space-y-3">
 {rediscoveryCandidates.slice(0, 3).map(candidate => (
 <div key={candidate.id} className="border border-gray-100 dark:border-gray-800/50 p-3 rounded-xl hover:border-[#1890FF]/30 hover: transition-all cursor-pointer group">
 <div className="flex justify-between items-center mb-1">
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">{candidate.name}</h4>
 <span className="text-[10px] font-bold text-[#00A76F] bg-[#00A76F]/10 px-1.5 py-0.5 rounded-full">
 {candidate.match} Match
 </span>
 </div>
 <p className="text-xs font-medium text-black dark:text-gray-400 mb-2">
 {candidate.role}
 </p>
 <button onClick={(e) => { e.stopPropagation(); setActiveTab('Candidates'); }} className="w-full py-1 text-xs font-bold text-[#1890FF] bg-[#1890FF]/5 hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer">
 Review Profile
 </button>
 </div>
 ))}
 </div>
 
 <button className="w-full mt-4 py-1.5 text-[13px] font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer">
 View All Matches <ChevronRight size={16} />
 </button>
 </div>

 </div>
 </div>
 </div>
 )}

 {/* JOB DESCRIPTION TAB */}
 {activeTab === 'Job Description' && (
 <div className="bg-white dark:bg-[#161c24] p-8 rounded-2xl border border-gray-100 dark:border-gray-800/50 animate-fade-in text-[#454f5b] dark:text-gray-300">
 <h2 className="text-xl font-bold text-[#212b36] dark:text-white mb-6">Job Description: Senior AI Research Scientist</h2>
 
 <div className="space-y-6 text-[13px]">
 <section>
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-3">About the Role</h3>
 <p className="leading-relaxed">
 We are looking for a Senior AI Research Scientist to join our cutting-edge AI labs team. In this role, you will be responsible for leading research and development of novel deep learning architectures, particularly focusing on large language models and multimodal AI systems. You will work closely with a cross-functional team of researchers, engineers, and product managers to push the boundaries of what's possible with artificial intelligence.
 </p>
 </section>
 
 <section>
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-3">Key Responsibilities</h3>
 <ul className="list-disc pl-5 space-y-2">
 <li>Design, develop, and train state-of-the-art machine learning models for natural language processing and computer vision tasks.</li>
 <li>Conduct independent research leading to publications in top-tier AI conferences (e.g., NeurIPS, ICML, ICLR).</li>
 <li>Collaborate with the engineering team to optimize models for efficient deployment in production environments.</li>
 <li>Provide technical leadership and mentor junior researchers on the team.</li>
 <li>Stay up-to-date with the latest advancements in AI research and identify new opportunities for innovation.</li>
 </ul>
 </section>

 <section>
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-3">Requirements</h3>
 <ul className="list-disc pl-5 space-y-2">
 <li>Ph.D. or Master's degree in Computer Science, Artificial Intelligence, Machine Learning, or a related field.</li>
 <li>5+ years of industry or academic experience in developing and training deep learning models.</li>
 <li>Strong programming skills in Python and proficiency with frameworks like PyTorch or TensorFlow.</li>
 <li>A solid track record of publications in top-tier AI conferences or journals.</li>
 <li>Excellent problem-solving skills and the ability to work collaboratively in a fast-paced environment.</li>
 <li>Experience with distributed training and model optimization techniques is a strong plus.</li>
 </ul>
 </section>
 </div>
 </div>
 )}

 {/* PIPELINE TAB */}
 {activeTab === 'Pipeline' && (
 <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x scrollbar-hide">
 {pipelineBoard.map((col) => {
 const titleParts = col.title.split(' ');
 const stageName = titleParts.slice(0, titleParts.length - 1).join(' ');
 const stageCount = titleParts[titleParts.length - 1].replace(/[\(\)]/g, '');
 
 const sortedCandidates = [...col.candidates].sort((a, b) => b.score - a.score);
 const topCandidates = sortedCandidates.slice(0, 4);
 const hiddenCount = sortedCandidates.length - 4;
 
 return (
 <div key={col.title} className="flex flex-col w-[calc(25%-1.125rem)] min-w-[320px] shrink-0 snap-start">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-bold text-black dark:text-gray-400">
 {stageName} 
 <span className="text-[10px] font-black bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-[#212b36] dark:text-white px-2 py-0.5 rounded-full ml-2 ">
 {stageCount}
 </span>
 </h3>
 </div>
 <div className="flex-1 space-y-4">
 {topCandidates.map((card) => (
 <div 
 key={card.id} 
 onMouseLeave={() => { if (moveDropdownId === card.id) setMoveDropdownId(null); }}
 className="bg-white dark:bg-[#161c24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 hover:border-[#1890FF]/40 cursor-pointer transition-all duration-300 group flex flex-col gap-3 relative overflow-visible"
 >
 
 {/* Top Section */}
 <div className="flex justify-between items-start">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1890FF]/20 to-[#1890FF]/5 flex items-center justify-center text-[#1890FF] font-bold text-[13px] ring-2 ring-white dark:ring-[#161c24] shrink-0">
 {card.name.split(' ').map(n => n[0]).join('')}
 </div>
 <div>
 <h4 className="text-sm font-bold tracking-wider text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors leading-tight">{card.name}</h4>
 <p className="text-[10px] font-semibold text-black dark:text-gray-400 mt-0.5">{card.role}</p>
 </div>
 </div>
 <div className="flex flex-col items-end">
 <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${card.score >= 90 ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-[#FFC107]/10 text-[#FFC107]'}`}>
 {card.score}%
 </span>
 <span className="text-[9px] font-medium text-gray-400 mt-1 flex items-center gap-0.5"><Clock size={9} /> {card.time}</span>
 </div>
 </div>

 {/* Info grid */}
 <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-medium bg-gray-50/50 dark:bg-gray-800/20 p-2.5 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
 <div className="flex items-center gap-1.5 text-[#454f5b] dark:text-gray-300">
 <Briefcase size={11} className="text-[#1890FF]/70 shrink-0" />
 <span className="truncate">{card.company} • {card.experience}</span>
 </div>
 <div className="flex items-center gap-1.5 text-[#454f5b] dark:text-gray-300">
 <MapPin size={11} className="text-[#1890FF]/70 shrink-0" />
 <span className="truncate">{card.location}</span>
 </div>
 <div className="col-span-2 flex items-center gap-1.5 text-[#454f5b] dark:text-gray-300">
 <CalendarDays size={11} className="text-[#1890FF]/70 shrink-0" />
 <span className="truncate">Notice: <span className="font-bold">{card.noticePeriod}</span></span>
 </div>
 </div>

 {/* Skills Tags */}
 <div className="flex flex-wrap gap-1">
 {card.skills.map(skill => (
 <span key={skill} className="text-[9px] font-bold bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded text-black dark:text-gray-400">
 {skill}
 </span>
 ))}
 </div>

 {/* Hover Actions - Slide up on hover */}
 <div className="absolute -bottom-14 left-0 w-full p-2.5 bg-white/95 dark:bg-[#161c24]/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex gap-2 group-hover:bottom-0 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 pointer-events-none group-hover:pointer-events-auto">
 <button onClick={(e) => { e.stopPropagation(); setSelectedCandidate(card); }} className="flex-1 py-1.5 bg-[#1890FF] text-white text-[11px] font-bold rounded-lg hover:bg-[#1890FF]/90 transition-colors cursor-pointer">
 Review
 </button>
 <div className="flex-1 relative">
 <button onClick={(e) => { e.stopPropagation(); setMoveDropdownId(moveDropdownId === card.id ? null : card.id); }} className="w-full py-1.5 bg-gray-100 dark:bg-gray-800 text-[#212b36] dark:text-white text-[11px] font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
 Move
 </button>
 {moveDropdownId === card.id && (
 <div className="absolute bottom-full left-0 mb-2 w-36 bg-white dark:bg-[#212b36] shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 py-1 z-50">
 {pipelineBoard.map(stage => stage.title !== col.title && (
 <button 
 key={stage.title} 
 onClick={(e) => { e.stopPropagation(); handleMoveCandidate(card, col.title, stage.title); }}
 className="w-full text-left px-4 py-1.5 text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 To {stage.title.split(' ').slice(0, -1).join(' ')}
 </button>
 ))}
 <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
 <button 
 onClick={(e) => { e.stopPropagation(); handleMoveCandidate(card, col.title, 'Reject'); }}
 className="w-full text-left px-4 py-1.5 text-[10px] font-bold text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
 >
 Reject Candidate
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 ))}
 
 {hiddenCount > 0 && (
 <div className="mt-3 p-3 text-center border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl flex items-center justify-center cursor-help" title={`There are ${hiddenCount} more candidates with lower match scores.`}>
 <span className="text-[11px] font-bold text-black dark:text-gray-400 flex items-center gap-1.5">
 <UsersIcon size={14} className="opacity-70" /> 
 + {hiddenCount} candidates queued
 </span>
 </div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 )}

 {/* CANDIDATES TAB */}
 {activeTab === 'Candidates' && (
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden animate-fade-in flex flex-col min-h-[500px]">
 <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
 <div className="relative w-64">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <input 
 type="text" 
 value={searchQuery}
 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
 placeholder="Search candidates by name or stage..." 
 className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-none rounded-lg text-[13px] focus:ring-2 focus:ring-[#1890FF]/20 outline-none text-[#212b36] dark:text-white" 
 />
 </div>
 </div>
 
 <div className="flex-1 overflow-x-auto">
 <table className="w-full text-left text-[13px] text-black dark:text-gray-400">
 <thead className="text-xs bg-gray-50 dark:bg-gray-800/50 text-black font-bold">
 <tr>
 <th className="px-6 py-4">Name</th>
 <th className="px-6 py-4">Stage</th>
 <th className="px-6 py-4">Match Score</th>
 <th className="px-6 py-4">Applied</th>
 <th className="px-6 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody>
 {currentCandidates.length > 0 ? (
 currentCandidates.map(cand => (
 <tr key={cand.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors group">
 <td className="px-6 py-4 font-bold text-[#212b36] dark:text-white">{cand.name}</td>
 <td className="px-6 py-4">
 <span className="bg-[#1890FF]/10 text-[#1890FF] px-2.5 py-1 rounded-md text-xs font-bold">{cand.stage}</span>
 </td>
 <td className="px-6 py-4">
 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${getScoreStyles(cand.score).badge}`}>{cand.score}</span>
 </td>
 <td className="px-6 py-4 font-medium">{cand.date}</td>
 <td className="px-6 py-4 text-right">
 <div className="flex items-center justify-end gap-2">
 <button title="View Resume" className="text-[#1890FF] hover:bg-[#1890FF]/10 p-1.5 rounded-md cursor-pointer transition-colors"><FileText size={16} /></button>
 <button title="Schedule Interview" className="text-[#00A76F] hover:bg-[#00A76F]/10 p-1.5 rounded-md cursor-pointer transition-colors"><Calendar size={16} /></button>
 <button title="Reject Candidate" className="text-[#FF5630] hover:bg-[#FF5630]/10 p-1.5 rounded-md cursor-pointer transition-colors"><UserX size={16} /></button>
 </div>
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
 No candidates found matching "{searchQuery}"
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 {totalPages > 1 && (
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between bg-white dark:bg-[#161c24]">
 <span className="text-[13px] text-gray-500 font-medium">
 Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length}
 </span>
 <div className="flex items-center gap-1">
 <button 
 disabled={currentPage === 1}
 onClick={() => setCurrentPage(p => p - 1)}
 className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
 >
 <ChevronRight size={18} className="rotate-180" />
 </button>
 
 {Array.from({ length: totalPages }).map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrentPage(i + 1)}
 className={`w-7 h-7 flex items-center justify-center rounded-md text-[13px] font-bold cursor-pointer transition-colors ${
 currentPage === i + 1 
 ? 'bg-[#1890FF] text-white' 
 : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
 }`}
 >
 {i + 1}
 </button>
 ))}

 <button 
 disabled={currentPage === totalPages}
 onClick={() => setCurrentPage(p => p + 1)}
 className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
 >
 <ChevronRight size={18} />
 </button>
 </div>
 </div>
 )}
 </div>
 )}
 {/* APPLICATIONS TAB - Immersive Redesign */}
 {activeTab === 'Applications Review' && (
 <div className="flex flex-col h-[800px] bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden animate-fade-in">
 {/* Top Toolbar / Smart Metrics Ribbon */}
 <div className="flex flex-wrap lg:flex-nowrap items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24] gap-4">
 {/* Stats Group */}
 <div className="flex items-center gap-4 flex-1 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
 
 {/* Top Talent */}
 <div className="flex items-center gap-3 px-4 py-2.5 bg-[#00A76F]/5 rounded-xl border border-[#00A76F]/20 shrink-0 ">
 <div className="w-8 h-8 rounded-lg bg-[#00A76F]/15 flex items-center justify-center relative">
 <Star size={16} className="text-[#00A76F] fill-[#00A76F]/20" />
 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00A76F] rounded-full ring-2 ring-white dark:ring-[#161c24]"></span>
 </div>
 <div>
 <div className="text-xs font-bold text-[#00A76F]/80">Top Talent (8.5+)</div>
 <div className="text-[13px] font-black text-[#00A76F]">{candidateList.filter(c => parseScore(c.score) >= 8.5).length}</div>
 </div>
 </div>
 
 {/* Total Apps */}
 <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 shrink-0 ">
 <div className="w-8 h-8 rounded-lg bg-[#212b36]/10 dark:bg-white/10 flex items-center justify-center">
 <Users size={16} className="text-[#212b36] dark:text-white" />
 </div>
 <div>
 <div className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Candidate</div>
 <div className="text-[13px] font-black text-[#212b36] dark:text-white">{candidateList.length}</div>
 </div>
 </div>

 {/* Newly Applied */}
 <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1890FF]/5 rounded-xl border border-[#1890FF]/20 shrink-0 ">
 <div className="w-8 h-8 rounded-lg bg-[#1890FF]/15 flex items-center justify-center">
 <UserPlus size={16} className="text-[#1890FF]" />
 </div>
 <div>
 <div className="text-xs font-bold text-[#1890FF]/80">Needs Review (Applied)</div>
 <div className="text-[13px] font-black text-[#1890FF]">{candidateList.filter(c => c.stage === 'Applied').length}</div>
 </div>
 </div>

 {/* Active Pipeline */}
 <div className="ml-auto flex items-center gap-3 px-4 py-2.5 bg-[#212b36]/5 dark:bg-white/5 rounded-xl border border-[#212b36]/15 dark:border-white/15 shrink-0 max-w-[350px]">
 <div className="w-8 h-8 rounded-lg bg-[#212b36]/10 dark:bg-white/10 flex items-center justify-center shrink-0">
 <Calendar size={16} className="text-[#212b36] dark:text-white" />
 </div>
 <div className="flex items-center gap-3 flex-1">
 <div>
 <div className="text-xs font-bold text-[#212b36]/80 dark:text-gray-400 whitespace-nowrap">Active Pipeline</div>
 <div className="text-[13px] font-black text-[#212b36] dark:text-white">{candidateList.filter(c => ['Screening', 'Technical Interview', 'Culture Fit', 'Reference Check'].includes(c.stage)).length}</div>
 </div>
 <div className="w-px h-6 bg-[#212b36]/10 dark:bg-white/10 shrink-0"></div>
 <p className="text-[10px] font-medium text-[#212b36]/60 dark:text-gray-400 flex-1 leading-tight line-clamp-2">
 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
 </p>
 </div>
 </div>
 
 </div>

 <input type="file" id="new-applicant-upload" accept=".pdf" className="hidden" onChange={() => { setIsUploadingResume(true); setTimeout(() => setIsUploadingResume(false), 1500); }} />
 </div>

 <div className="flex flex-1 overflow-hidden relative">
 {/* Left Panel: Candidates List */}
 <div className="w-[320px] lg:w-[380px] border-r border-gray-100 dark:border-gray-800/50 flex flex-col bg-gray-50/30 dark:bg-[#161c24] shrink-0 relative p-3 gap-3">
 
 <div className="flex items-center justify-between px-1 shrink-0">
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Application List</h3>
 </div>

 {/* Search & Filter Card */}
 <div className="bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 rounded-xl p-3 shrink-0 relative overflow-visible z-30 space-y-3">
 
 <div className="relative h-[38px]">
 {/* Search Textbox */}
 <div className="absolute inset-0 transition-all duration-300">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <input
 type="text"
 value={appSearchQuery}
 onChange={(e) => { setAppSearchQuery(e.target.value); setCurrentPageApp(1); }}
 placeholder="Search by name, stage, or agency..."
 className="w-full h-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-lg text-[13px] focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none text-[#212b36] dark:text-white transition-all"
 />
 </div>
 </div>

 {/* Stage Change Block (replaces search when bulk selected) */}
 <div className={`absolute inset-0 bg-[#1890FF] shadow-md z-20 flex flex-col justify-center px-4 rounded-xl transition-all duration-300 ${selectedAppCandidates.length > 0 ? 'opacity-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 translate-y-2 invisible pointer-events-none'}`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="text-[12px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-md">{selectedAppCandidates.length} Selected</span>
 </div>
 <div className="flex items-center gap-3 relative">
 <button
 onClick={(e) => { e.stopPropagation(); setIsBulkStageMenuOpen(!isBulkStageMenuOpen); }}
 className="text-[12px] font-bold text-white hover:text-white/80 flex items-center gap-1 transition-colors cursor-pointer"
 >
 Stage <ChevronDown size={14} />
 </button>
 {isBulkStageMenuOpen && (
 <div
 className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 z-[100]"
 onClick={(e) => e.stopPropagation()}
 >
 {['Applied', 'Screening', 'Technical Interview', 'Culture Fit', 'Offer', 'Reject'].map(stage => (
 <button
 key={stage}
 onClick={() => handleBulkStageChange(stage)}
 className={`w-full text-left px-3 py-1.5 text-[11px] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${stage === 'Reject' ? 'text-[#FF5630]' : 'text-[#212b36] dark:text-white'}`}
 >
 {stage}
 </button>
 ))}
 </div>
 )}
 <div className="w-px h-4 bg-white/30"></div>
 <button onClick={() => setSelectedAppCandidates([])} className="text-white/70 hover:text-white transition-colors cursor-pointer p-0.5"><X size={16} /></button>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <div className="flex-1 flex flex-col gap-1 relative">
 <span className="text-[10px] font-bold text-gray-400 tracking-wider">Filter Stage</span>
 <div 
 onClick={(e) => { e.stopPropagation(); setIsFilterStageOpen(!isFilterStageOpen); setIsSortByOpen(false); }}
 className="w-full flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-[#1890FF]/20 outline-none text-[#212b36] dark:text-white cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
 >
 <span className="truncate">{appFilterStage === 'All' ? 'All Stages' : appFilterStage}</span>
 <ChevronDown size={14} className="text-gray-400 shrink-0" />
 </div>
 {isFilterStageOpen && (
 <div 
 className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 z-[60] max-h-48 overflow-y-auto custom-scrollbar"
 onClick={(e) => e.stopPropagation()}
 >
 {['All', 'Applied', 'Screening', 'Technical Interview', 'Culture Fit', 'Reference Check', 'Offer', 'Put On Hold'].map(opt => (
 <button
 key={opt}
 onClick={() => { setAppFilterStage(opt); setCurrentPageApp(1); setIsFilterStageOpen(false); }}
 className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[#212b36] dark:text-white flex items-center justify-between"
 >
 <span>{opt === 'All' ? 'All Stages' : opt}</span>
 {appFilterStage === opt && <Check size={14} className="text-[#1890FF]" />}
 </button>
 ))}
 </div>
 )}
 </div>
 <div className="flex-1 flex flex-col gap-1 relative">
 <span className="text-[10px] font-bold text-gray-400 tracking-wider">Sort By</span>
 <div 
 onClick={(e) => { e.stopPropagation(); setIsSortByOpen(!isSortByOpen); setIsFilterStageOpen(false); }}
 className="w-full flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-[#1890FF]/20 outline-none text-[#212b36] dark:text-white cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
 >
 <span className="truncate">{appSortBy}</span>
 <ChevronDown size={14} className="text-gray-400 shrink-0" />
 </div>
 {isSortByOpen && (
 <div 
 className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 z-[60]"
 onClick={(e) => e.stopPropagation()}
 >
 {['Rating', 'Name', 'Stage', 'Age in Stage'].map(opt => (
 <button
 key={opt}
 onClick={() => { setAppSortBy(opt); setCurrentPageApp(1); setIsSortByOpen(false); }}
 className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[#212b36] dark:text-white flex items-center justify-between"
 >
 <span>{opt}</span>
 {appSortBy === opt && <Check size={14} className="text-[#1890FF]" />}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* List Card */}
 <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 rounded-xl relative">
 <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin relative">
 {currentAppCandidates.length > 0 && (
 <div className="flex gap-3 px-3 py-1 mb-1 border-b border-gray-100 dark:border-gray-800/50 sticky top-0 z-20 bg-white/90 dark:bg-[#161c24]/90 backdrop-blur-sm -mx-2 -mt-2">
 <div className="w-8 h-8 shrink-0 flex items-center justify-center">
 <div className="relative w-4 h-4 rounded cursor-pointer group/list" onClick={(e) => {
 e.stopPropagation();
 if (selectedAppCandidates.length === currentAppCandidates.length) {
 setSelectedAppCandidates([]);
 } else {
 setSelectedAppCandidates(currentAppCandidates.map(c => c.id));
 }
 }}>
 <MiniCheckbox
 checked={selectedAppCandidates.length > 0 && selectedAppCandidates.length === currentAppCandidates.length}
 indeterminate={selectedAppCandidates.length > 0 && selectedAppCandidates.length < currentAppCandidates.length}
 visible={true}
 onChange={() => {
 if (selectedAppCandidates.length === currentAppCandidates.length) {
 setSelectedAppCandidates([]);
 } else {
 setSelectedAppCandidates(currentAppCandidates.map(c => c.id));
 }
 }}
 label="Select All"
 revealGroup="list"
 />
 </div>
 </div>
 <div className="flex-1 min-w-0 flex items-center pr-2">
 <span 
 className="text-[11px] font-bold text-gray-500 hover:text-[#212b36] dark:hover:text-white cursor-pointer transition-colors"
 onClick={(e) => {
 e.stopPropagation();
 if (selectedAppCandidates.length === currentAppCandidates.length) {
 setSelectedAppCandidates([]);
 } else {
 setSelectedAppCandidates(currentAppCandidates.map(c => c.id));
 }
 }}
 >
 Select All
 </span>
 </div>
 </div>
 )}
 {currentAppCandidates.length === 0 ? (
 <div className="px-3 py-10 text-center">
 <p className="text-[13px] font-bold tracking-wider text-[#212b36] dark:text-white">No applicants found</p>
 <p className="text-[13px] leading-relaxed text-gray-500 mt-1">
 {appSearchQuery.trim() ? `No matches for “${appSearchQuery.trim()}”` : 'No applicants in this list yet.'}
 </p>
 </div>
 ) : currentAppCandidates.map(cand => {
 const isChecked = selectedAppCandidates.includes(cand.id);
 const showChecks = selectedAppCandidates.length > 0;
 return (
 <div 
 key={cand.id} 
 onClick={() => setSelectedAppCandidate(cand)}
 className={`group/cand p-3 rounded-xl cursor-pointer transition-all border flex gap-3 ${selectedAppCandidate?.id === cand.id ? 'bg-[#1890FF]/5 border-[#1890FF]/30' : 'border-gray-200 dark:border-gray-700/50 hover:border-gray-300'}`}
 >
 <div className={`relative w-8 h-8 shrink-0 flex items-center justify-center mt-0.5 transition-all duration-150`}>
 <MiniCheckbox
 checked={isChecked}
 visible={true}
 onChange={() => toggleAppCandidateSelect(cand.id)}
 label={isChecked ? `Deselect ${cand.name}` : `Select ${cand.name}`}
 />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex justify-between items-start mb-1">
 <div className="flex items-center gap-1 min-w-0 flex-1 pr-2">
 <h4 className={`text-[13px] font-bold truncate ${selectedAppCandidate?.id === cand.id ? 'text-[#1890FF]' : 'text-[#212b36] dark:text-white group-hover/cand:text-[#1890FF]'}`}>{cand.name}</h4>
 <button
 type="button"
 title="Open full profile"
 onClick={(e) => {
 e.stopPropagation();
 navigate(`/dashboard/candidates/${cand.id}`, {
 state: {
 candidate: cand,
 from: { name: 'Applications Review', path: '/dashboard/agencies', tab: 'Applications Review' }
 }
 });
 }}
 className="opacity-0 group-hover/cand:opacity-100 p-0.5 rounded-md text-[#1890FF] hover:bg-[#1890FF]/10 shrink-0 cursor-pointer transition-opacity"
 >
 <ArrowUpRight size={14} />
 </button>
 </div>
 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${getScoreStyles(cand.score).badge}`}>{cand.score}</span>
 </div>
 <div className="flex justify-between items-center mt-2 relative">
 <div className="relative">
 <button 
 onClick={(e) => { e.stopPropagation(); setOpenStageMenuId(openStageMenuId === cand.id ? null : cand.id); }}
 className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${cand.stage === 'Reject' ? 'bg-[#FF5630]/10 text-[#FF5630]' : 'bg-gray-100 dark:bg-gray-800 text-[#212b36] dark:text-gray-300'}`}
 >
 {cand.stage} <ChevronDown size={10} />
 </button>
 {openStageMenuId === cand.id && (
 <div
 className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden py-1"
 onClick={(e) => e.stopPropagation()}
 >
 {['Applied', 'Screening', 'Technical Interview', 'Culture Fit', 'Offer', 'Reject'].map(stage => {
 const isSelected = cand.stage === stage;
 return (
 <button 
 key={stage} 
 onClick={(e) => { e.stopPropagation(); handleCandidateStageChange(cand.id, stage); }}
 className={`w-full text-left px-3 py-1.5 text-[10px] font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
 isSelected
 ? stage === 'Reject' ? 'bg-[#FF5630]/10 text-[#FF5630]' : 'bg-[#1890FF]/10 text-[#1890FF]'
 : stage === 'Reject' ? 'text-[#FF5630] hover:bg-gray-50 dark:hover:bg-gray-800' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
 }`}
 >
 <span>{stage}</span>
 {isSelected && <Check size={12} strokeWidth={3} />}
 </button>
 );
 })}
 </div>
 )}
 </div>
 <span className="text-[10px] text-gray-400">{cand.date}</span>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 {filteredAppCandidates.length > itemsPerPageApp && (
 <div className="p-3 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
 <button 
 disabled={currentPageApp === 1}
 onClick={() => setCurrentPageApp(p => p - 1)}
 className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
 >
 <ChevronRight size={16} className="rotate-180" />
 </button>
 <span className="text-[11px] font-bold text-gray-500">Page {currentPageApp} of {totalPagesApp}</span>
 <button 
 disabled={currentPageApp === totalPagesApp}
 onClick={() => setCurrentPageApp(p => p + 1)}
 className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
 >
 <ChevronRight size={16} />
 </button>
 </div>
 )}

 </div>

 {/* Middle Panel: AI Screening Results */}
 <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-black/20 border-r border-gray-100 dark:border-gray-800/50 relative min-w-0">
 <div className="p-3 border-b border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24] flex items-center justify-between">
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white px-1">AI Review Comments</h3>
 <button onClick={() => setIsEditRankingModalOpen(true)} className="flex items-center gap-1.5 text-[11px] font-bold text-[#1890FF] hover:bg-[#1890FF]/10 px-2 py-1 rounded transition-colors cursor-pointer">
 <Settings2 size={12} />
 Edit AI Ranking Rules
 </button>
 </div>
 {selectedAppCandidate ? (
 <>
 <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-white dark:bg-[#161c24]">
 {(() => {
 const scoreTone = getScoreStyles(previewScore);
 const scoreValue = String(previewCandidate.score).replace('/10', '');
 return (
 <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
 <div>
 <h4 className="text-[16px] font-bold text-[#212b36] dark:text-white mb-1.5">{previewCandidate.name}</h4>
 <div className="flex items-center gap-1.5 text-[13px] leading-relaxed text-gray-500">
 <Briefcase size={12} className="text-gray-400" />
 <span>Agency: <span className="font-semibold text-[#212b36] dark:text-gray-300">{previewCandidate.agency || 'Direct Application'}</span></span>
 </div>
 </div>
 
 <div className="text-right">
 <p className="text-[9px] font-bold tracking-wider text-gray-400 mb-0.5">AI Match</p>
 <div className="flex items-end justify-end gap-0.5">
 <span className={`text-[19px] font-semibold leading-none ${scoreTone.text}`}>{scoreValue}</span>
 <span className="text-[10px] font-medium text-gray-400 pb-[3px]">/10</span>
 </div>
 </div>
 </div>
 );
 })()}

 <div>
 <h4 className="text-sm font-bold tracking-wider text-[#212b36] dark:text-white mb-3">AI Screening Summary</h4>
 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-[13px] text-[#454f5b] dark:text-gray-300 space-y-2 leading-relaxed">
 <p>Excellent fit for the technical requirements.</p>
 <p>Strong React, Node.js and architecture experience.</p>
 {showRejectCta ? (
 <p className="font-bold text-[#212b36] dark:text-white mt-1">Recommended: Reject and notify the agency.</p>
 ) : null}
 </div>
 </div>

 <div>
 <h4 className="text-sm font-bold tracking-wider text-[#212b36] dark:text-white mb-4">Key Screening Criteria</h4>
 <div className="space-y-4">
 {SCREENING_CRITERIA.map((item) => {
 const tone = getScoreStyles(item.score);
 return (
 <div key={item.label} className="flex flex-col gap-1">
 <div className="flex items-center justify-between">
 <h5 className="text-[12px] font-bold text-[#212b36] dark:text-white">{item.label}</h5>
 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${tone.badge}`}>{item.score}/10</span>
 </div>
 <p className="text-[13px] leading-relaxed text-[#454f5b] dark:text-gray-400 leading-relaxed">{item.text}</p>
 </div>
 );
 })}
 </div>
 </div>

 <div>
 <h4 className="text-sm font-bold tracking-wider text-[#212b36] dark:text-white mb-3">Gap Analysis</h4>
 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-[13px] leading-relaxed text-[#454f5b] dark:text-gray-300 leading-relaxed mb-6">
 Minor gaps: limited exposure to enterprise-scale delivery and formal people management.
 </div>
 
 <hr className="border-gray-100 dark:border-gray-800/50 mb-6" />
 
 <div className="flex items-center justify-between mb-3">
 <h4 className="text-sm font-bold tracking-wider text-[#212b36] dark:text-white">Feedback to Agency</h4>
 <button 
 onClick={() => {
 navigator.clipboard.writeText("We reviewed this candidate. While they are a strong fit technically, there are minor gaps in enterprise-scale delivery. We've decided to proceed to the next stage but will focus on this during the interview.");
 setShowCopyToast(true);
 setTimeout(() => setShowCopyToast(false), 3000);
 }}
 className="text-[11px] font-bold text-[#1890FF] hover:bg-[#1890FF]/10 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
 >
 <Copy size={12} /> Copy Text
 </button>
 </div>
 <div className="bg-[#1890FF]/5 border border-[#1890FF]/20 rounded-xl p-4 text-[13px] leading-relaxed text-[#212b36] dark:text-gray-300 leading-relaxed">

 We reviewed this candidate. While they are a strong fit technically, there are minor gaps in enterprise-scale delivery. We've decided to proceed to the next stage but will focus on this during the interview.<br/><br/>

 </div>
 
 </div>
 </div>


 </>
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center text-center p-5 bg-white dark:bg-[#161c24]">
 <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
 <Activity size={24} className="text-gray-400" />
 </div>
 <p className="text-xs text-gray-500 font-medium">Select a candidate to view AI screening insights.</p>
 </div>
 )}
 </div>

 {/* Right Panel: Smart Profile (Resume) */}
 <div className="ml-4 w-[550px] xl:w-[650px] border-l border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-black/20 flex flex-col shrink-0 min-h-0 relative">
 {isUploadingResume && (
 <div className="absolute inset-0 bg-white/80 dark:bg-[#161c24]/80 backdrop-blur-sm z-50 flex items-center justify-center">
 <div className="text-center">
 <div className="w-12 h-12 border-4 border-[#1890FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white">Uploading new applicant resume...</p>
 </div>
 </div>
 )}
 <div className="p-3 border-b border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24]">
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white px-1">Resume Viewer</h3>
 </div>

 {selectedAppCandidate ? (
 <div className="h-full flex flex-col min-h-0 animate-fade-in">
 <div className="shrink-0 bg-white dark:bg-[#161c24] px-4 py-2.5 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between gap-3">
 <div className="flex items-center gap-2 min-w-0">
 <FileText size={16} className="text-[#1890FF] shrink-0" />
 <div className="min-w-0">
 <p className="text-[13px] font-bold tracking-wider text-[#212b36] dark:text-white truncate">
 {selectedAppCandidate.name.replace(/\s+/g, '_')}_Resume.pdf
 </p>
 <p className="text-[13px] leading-relaxed text-gray-400">PDF resume</p>
 </div>
 </div>
 <div className="flex items-center gap-1 shrink-0">
 <a
 href={SAMPLE_RESUME_URL}
 target="_blank"
 rel="noreferrer"
 className="p-2 text-gray-400 hover:text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors"
 title="Open in new tab"
 >
 <ExternalLink size={16} />
 </a>
 <a
 href={SAMPLE_RESUME_URL}
 download={`${selectedAppCandidate.name.replace(/\s+/g, '_')}_Resume.pdf`}
 className="p-2 text-gray-400 hover:text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors"
 title="Download resume"
 >
 <Download size={16} />
 </a>
 </div>
 </div>
 <div className="flex-1 min-h-0 bg-[#525659]">
 <iframe
 key={selectedAppCandidate.id}
 title={`${selectedAppCandidate.name} resume`}
 src={`${SAMPLE_RESUME_URL}#toolbar=1&navpanes=0`}
 className="w-full h-full border-0 bg-white"
 />
 </div>
 </div>
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-[#161c24]">
 <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
 <Users size={32} className="text-gray-400" />
 </div>
 <p className="font-medium text-[13px]">Select a candidate to view their resume</p>
 </div>
 )}
 </div>


 </div>
 </div>
 )}

 {/* INTERVIEWS TAB */}
 {activeTab === 'Interviews' && (
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 animate-fade-in">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white">Upcoming Interviews for this Role</h3>
 <button onClick={() => setIsScheduleModalOpen(true)} className="text-[13px] font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 px-4 py-2 rounded-lg transition-colors cursor-pointer ">
 Schedule Interview
 </button>
 </div>
 <div className="space-y-4">
 {interviewsList.map(interview => (
 <div key={interview.id} className="flex items-center justify-between border border-gray-100 dark:border-gray-800/50 p-4 rounded-xl hover:border-[#1890FF]/30 hover: transition-all group cursor-pointer">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
 <Video size={20} />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h4 className="text-sm font-bold tracking-wider text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">{interview.candidate}</h4>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${(interview.score || 90) >= 90 ? 'bg-[#00A76F]/20 text-[#00A76F] dark:text-[#22c55e]' : 'bg-[#FFC107]/20 text-[#b78103] dark:text-[#FFC107]'}`}>
 {interview.score || 90}% Match
 </span>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
 (interview.status || 'Pending') === 'Accepted' ? 'bg-[#1890FF]/20 text-[#1890FF] dark:text-[#60a5fa]' : 
 ((interview.status === 'Declined') ? 'bg-[#FF5630]/20 text-[#FF5630] dark:text-[#FF5630]' : 
 'bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-400 border border-gray-200 dark:border-gray-700')
 }`}>
 {interview.status || 'Pending'}
 </span>
 </div>
 <p className="text-[13px] font-medium text-[#212b36] dark:text-gray-300 mt-1">{interview.type}</p>
 <p className="text-xs text-black dark:text-gray-400 flex items-center gap-2 mt-1.5">
 <Calendar size={13} className="text-[#1890FF]/70 shrink-0" /> {interview.time} ({interview.duration || '45 mins'}) <span className="mx-1">•</span> 
 <Video size={13} className="text-[#1890FF]/70 shrink-0" /> {interview.platform || 'Zoom'} <span className="mx-1">•</span>
 <UsersIcon size={13} className="text-[#1890FF]/70 shrink-0" /> {interview.interviewer}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <button className="p-2 text-gray-400 hover:text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer" title="View Resume">
 <FileText size={16} />
 </button>
 <button className="px-4 py-2 text-xs font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg transition-colors cursor-pointer" onClick={(e) => e.stopPropagation()}>
 Join Call
 </button>
 </div>
 </div>
 ))}
 <div className="text-center py-8 text-black text-[13px]">No more upcoming interviews this week.</div>
 </div>
 </div>
 )}

 {/* TEAM & SCORECARDS TAB */}
 {activeTab === 'Team & Scorecards' && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white">Hiring Team</h3>
 <button onClick={() => setIsInviteModalOpen(true)} className="text-[13px] font-bold text-[#1890FF] hover:bg-[#1890FF]/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
 <Plus size={16} /> Add Member
 </button>
 </div>
 <div className="space-y-4">
 {hiringTeam.map(member => (
 <div key={member.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800/50 rounded-xl">
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold ${member.color}`}>
 {member.initials}
 </div>
 <span className="font-medium text-[13px] text-[#212b36] dark:text-white">{member.name}</span>
 </div>
 <button className="text-gray-400 hover:text-red-500 cursor-pointer p-1"><X size={16} /></button>
 </div>
 ))}
 </div>
 </div>
 
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">Pending Scorecards</h3>
 <div className="space-y-3">
 <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 flex justify-between items-center cursor-pointer hover:border-[#FFC107]/30 hover: transition-all group">
 <div>
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#FFC107] transition-colors">Sneha Patil</h4>
 <p className="text-xs text-black mt-1">Technical Interview (Completed 2h ago)</p>
 </div>
 <button className="text-xs font-bold text-white bg-[#FFC107] hover:bg-[#e0a800] px-3 py-1.5 rounded-lg cursor-pointer">Fill Scorecard</button>
 </div>
 <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 flex justify-between items-center opacity-60">
 <div>
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white line-through">Rahul Verma</h4>
 <p className="text-xs text-black mt-1">Culture Fit (Completed)</p>
 </div>
 <CheckCircle size={20} className="text-[#00A76F]" />
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Reject & notify agencies */}
 <RejectAgencyModal
 open={isRejectModalOpen}
 candidates={rejectCards}
 onClose={closeRejectModal}
 onSent={handleSendRejectEmails}
 />

 {/* Schedule Interview Modal */}
 {isScheduleModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
 <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800/50">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2"><Calendar size={20} className="text-[#1890FF]" /> Schedule Interview</h2>
 <button onClick={() => { setIsScheduleModalOpen(false); setScheduleErrors({}); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"><X size={20} /></button>
 </div>
 <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
 <div>
 <label className={`block text-xs font-bold mb-2 ${scheduleErrors.candidate ? 'text-[#FF5630]' : 'text-gray-500'}`}>Select Candidate</label>
 <SearchableSelect 
 options={candidateList.map(c => ({ value: c.name, label: c.name, description: `Stage: ${c.stage}` }))}
 value={scheduleData.candidate}
 onChange={(val) => { setScheduleData({...scheduleData, candidate: val}); if (scheduleErrors.candidate) setScheduleErrors({...scheduleErrors, candidate: null}); }}
 placeholder="Search and select candidate..."
 hasError={!!scheduleErrors.candidate}
 />
 <div className="min-h-[16px] mt-1"><p className="text-[#FF5630] text-xs animate-fade-in">{scheduleErrors.candidate}</p></div>
 </div>
 <div className="grid grid-cols-2 gap-5">
 <div>
 <label className="block text-xs font-bold text-gray-500 mb-2">Interview Type</label>
 <select value={scheduleData.type} onChange={e => setScheduleData({...scheduleData, type: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-[13px] dark:text-white cursor-pointer">
 <option>Technical Interview</option>
 <option>Culture Fit</option>
 <option>HR Round</option>
 <option>System Design</option>
 </select>
 <div className="min-h-[16px] mt-1"></div>
 </div>
 <div>
 <label className={`block text-xs font-bold mb-2 ${scheduleErrors.interviewer ? 'text-[#FF5630]' : 'text-gray-500'}`}>Interviewer</label>
 <SearchableSelect 
 options={hiringTeam.map(m => ({ value: m.name.split(' ')[0], label: m.name }))}
 value={scheduleData.interviewer}
 onChange={(val) => { setScheduleData({...scheduleData, interviewer: val}); if (scheduleErrors.interviewer) setScheduleErrors({...scheduleErrors, interviewer: null}); }}
 placeholder="Search interviewer..."
 hasError={!!scheduleErrors.interviewer}
 />
 <div className="min-h-[16px] mt-1"><p className="text-[#FF5630] text-xs animate-fade-in">{scheduleErrors.interviewer}</p></div>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-5">
 <div>
 <label className={`block text-xs font-bold mb-2 ${scheduleErrors.date ? 'text-[#FF5630]' : 'text-gray-500'}`}>Date</label>
 <input type="date" value={scheduleData.date} onChange={e => { setScheduleData({...scheduleData, date: e.target.value}); if (scheduleErrors.date) setScheduleErrors({...scheduleErrors, date: null}); }} className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 text-[13px] dark:text-white cursor-pointer transition-colors ${scheduleErrors.date ? 'border-[#FF5630] bg-red-50 dark:bg-[#FF5630]/10 focus:ring-[#FF5630]/20' : 'border-gray-200 dark:border-gray-700/50 focus:ring-[#1890FF]/20'}`} />
 <div className="min-h-[16px] mt-1"><p className="text-[#FF5630] text-xs animate-fade-in">{scheduleErrors.date}</p></div>
 </div>
 <div>
 <label className={`block text-xs font-bold mb-2 ${scheduleErrors.time ? 'text-[#FF5630]' : 'text-gray-500'}`}>Time</label>
 <input type="time" value={scheduleData.time} onChange={e => { setScheduleData({...scheduleData, time: e.target.value}); if (scheduleErrors.time) setScheduleErrors({...scheduleErrors, time: null}); }} className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 text-[13px] dark:text-white cursor-pointer transition-colors ${scheduleErrors.time ? 'border-[#FF5630] bg-red-50 dark:bg-[#FF5630]/10 focus:ring-[#FF5630]/20' : 'border-gray-200 dark:border-gray-700/50 focus:ring-[#1890FF]/20'}`} />
 <div className="min-h-[16px] mt-1"><p className="text-[#FF5630] text-xs animate-fade-in">{scheduleErrors.time}</p></div>
 </div>
 </div>
 <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800/50">
 <button type="button" onClick={() => { setIsScheduleModalOpen(false); setScheduleErrors({}); }} className="px-5 py-2.5 text-[13px] font-bold text-black bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">Cancel</button>
 <button type="submit" className="px-5 py-2.5 text-[13px] font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl transition-colors shadow-md shadow-[#1890FF]/20 cursor-pointer">Send Invite</button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* Invite Modal */}
 {isInviteModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
 <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800/50">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white ">Invite Team Member</h2>
 <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 dark:text-white hover:text-gray-600 transition-colors cursor-pointer">
 <X size={20} />
 </button>
 </div>
 <div className="p-5 space-y-4">
 <div>
 <label className="block text-[13px] font-medium text-[#212b36] dark:text-white mb-1.5">Email Address</label>
 <input type="email" placeholder="colleague@company.com" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-[13px] transition-all" />
 </div>
 <div>
 <label className="block text-[13px] font-medium text-[#212b36] dark:text-white mb-1.5">Role / Purpose</label>
 <SearchableSelect 
 options={roleOptions}
 value={inviteRole}
 onChange={setInviteRole}
 placeholder="Select a role..."
 />
 </div>
 <div>
 <label className="block text-[13px] font-medium text-[#212b36] dark:text-white mb-1.5">Personal Message (Optional)</label>
 <textarea rows="3" placeholder="Please join this job to help interview candidates..." className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-[13px] transition-all resize-none"></textarea>
 </div>
 </div>
 
 <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50 dark:bg-[#161c24]">
 <button onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 text-[13px] font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
 Cancel
 </button>
 <button onClick={handleSendInvite} className="px-4 py-2 text-[13px] font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg transition-colors cursor-pointer">
 Send Invite
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Success Toast */}
 {showInviteSuccess && (
 <div className="fixed bottom-6 right-6 z-50 bg-[#212b36] text-white px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 animate-fade-in border border-gray-700">
 <div className="w-6 h-6 bg-[#00A76F]/20 text-[#00A76F] rounded-full flex items-center justify-center shrink-0">
 ✓
 </div>
 <div className="font-medium text-[13px]">
 Invitation sent successfully!
 </div>
 </div>
 )}

 {/* Side Panel: Candidate Review */}
 {selectedCandidate && (
 <div className="fixed inset-0 z-[100] flex justify-end bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCandidate(null)}>
 <div className="w-full max-w-[450px] h-full bg-white dark:bg-[#161c24] shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 translate-x-0" onClick={e => e.stopPropagation()}>
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-bold dark:text-white">Candidate Review</h2>
 <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors"><X size={20}/></button>
 </div>
 
 {/* Profile Header */}
 <div className="flex gap-4 items-center mb-6">
 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1890FF]/20 to-[#1890FF]/5 flex items-center justify-center text-[#1890FF] font-bold text-2xl ring-4 ring-white dark:ring-[#161c24]">
 {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
 </div>
 <div>
 <h3 className="text-lg font-bold dark:text-white">{selectedCandidate.name}</h3>
 <p className="text-[13px] font-medium text-gray-500">{selectedCandidate.role}</p>
 </div>
 <div className="ml-auto text-center bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl">
 <div className={`text-xl font-black ${selectedCandidate.score >= 90 ? 'text-[#00A76F]' : 'text-[#FFC107]'}`}>{selectedCandidate.score}%</div>
 <div className="text-[9px] text-gray-400 font-bold mt-0.5">AI Match</div>
 </div>
 </div>

 {/* Details */}
 <div className="space-y-6">
 <div>
 <h4 className="text-xs font-bold text-gray-400 mb-3">AI Insights</h4>
 <div className="bg-[#1890FF]/5 border border-[#1890FF]/20 rounded-xl p-4 text-[13px] text-[#212b36] dark:text-gray-300 leading-relaxed ">
 <p className="flex gap-2.5 mb-2.5"><CheckCircle size={16} className="text-[#00A76F] mt-0.5 shrink-0" /> <span><strong>Strong fit:</strong> Extensive experience in <span className="font-semibold">{selectedCandidate.skills[0]}</span> and <span className="font-semibold">{selectedCandidate.skills[1]}</span>.</span></p>
 <p className="flex gap-2.5"><AlertCircle size={16} className="text-[#FFC107] mt-0.5 shrink-0" /> <span><strong>Note:</strong> Notice period is <span className="font-semibold">{selectedCandidate.noticePeriod}</span>. Evaluate timeline constraints.</span></p>
 </div>
 </div>

 <div>
 <h4 className="text-xs font-bold text-gray-400 mb-3">Experience & Details</h4>
 <div className="grid grid-cols-2 gap-3">
 <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
 <div className="text-[10px] font-semibold text-gray-400 mb-1">Company</div>
 <div className="text-[13px] font-bold text-[#212b36] dark:text-white">{selectedCandidate.company}</div>
 </div>
 <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
 <div className="text-[10px] font-semibold text-gray-400 mb-1">Experience</div>
 <div className="text-[13px] font-bold text-[#212b36] dark:text-white">{selectedCandidate.experience}</div>
 </div>
 <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
 <div className="text-[10px] font-semibold text-gray-400 mb-1">Location</div>
 <div className="text-[13px] font-bold text-[#212b36] dark:text-white">{selectedCandidate.location}</div>
 </div>
 <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
 <div className="text-[10px] font-semibold text-gray-400 mb-1">Applied</div>
 <div className="text-[13px] font-bold text-[#212b36] dark:text-white">{selectedCandidate.time}</div>
 </div>
 </div>
 </div>

 <div>
 <h4 className="text-xs font-bold text-gray-400 mb-3">Resume</h4>
 <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-center p-8 text-gray-400 flex-col gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
 <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
 <FileText size={24} className="text-[#1890FF]" />
 </div>
 <p className="text-[13px] font-medium text-[#212b36] dark:text-gray-300">resume_{selectedCandidate.name.split(' ')[0].toLowerCase()}.pdf</p>
 <span className="text-[11px] font-bold text-[#1890FF]">View Full Document</span>
 </div>
 </div>
 </div>
 
 <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
 <button onClick={() => {
 setPipelineBoard(prev => prev.map(c => ({...c, candidates: c.candidates.filter(cand => cand.id !== selectedCandidate.id)})));
 setSelectedCandidate(null);
 }} className="flex-1 py-2 bg-[#FF5630]/10 text-[#FF5630] text-[13px] font-bold rounded-lg hover:bg-[#FF5630]/20 transition-colors cursor-pointer">Reject</button>
 <button onClick={() => setSelectedCandidate(null)} className="flex-1 py-2 bg-[#1890FF] text-white text-[13px] font-bold rounded-lg hover:bg-[#1890FF]/90 shadow-md shadow-[#1890FF]/20 transition-all cursor-pointer">Advance Candidate</button>
 </div>
 </div>
 </div>
 )}

 {/* SETTINGS TAB */}
 {activeTab === 'Job Setup' && (
 <div className="flex min-h-[600px] bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 mt-4">
 {/* Sidebar */}
 <div className="w-64 border-r border-gray-100 dark:border-gray-800/50 bg-gray-50/30 dark:bg-[#161c24]/50 py-6 shrink-0">
 <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4 px-6">Job Setup</h3>
 <div className="space-y-1 px-3">
 {[
 { name: 'Overview', icon: FileText },
 { name: 'Description & Skills', icon: ClipboardList },
 { name: 'Hiring Team', icon: Users },
 { name: 'Pipeline', icon: Columns },
 { name: 'Scorecards', icon: CheckSquare },
 { name: 'Ranking Rules', icon: Star },
 { name: 'Agencies', icon: Briefcase },
 { name: 'Notifications', icon: Bell }
 ].map(subItem => {
 const isSubActive = settingsActiveNav === subItem.name;
 const SubIcon = subItem.icon;
 return (
 <div
 key={subItem.name}
 onClick={() => setSettingsActiveNav(subItem.name)}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors cursor-pointer ${
 isSubActive
 ? 'bg-[#00A76F]/10 text-[#00A76F] font-bold'
 : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-[#212b36] dark:hover:text-white'
 }`}
 >
 <SubIcon size={18} className={`shrink-0 ${isSubActive ? 'text-[#00A76F]' : 'text-gray-400'}`} />
 <span className="truncate">{subItem.name}</span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Content Area */}
 <div className="flex-1 bg-white dark:bg-[#161c24]">
 <div className="p-8 pb-0">
 <JobSetupHeader 
 title={settingsActiveNav} 
 subtitle={`Configure ${settingsActiveNav.toLowerCase()} settings for this job`} 
 isConfidential={setupJobData.isConfidential} 
 onConfidentialChange={(val) => setSetupJobData(prev => ({...prev, isConfidential: val}))} 
 />
 </div>
 {settingsActiveNav === 'Overview' && (
 <div className="p-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
 {/* Left Column */}
 <div className="space-y-8">
 {/* Basic Information Card */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 transition-all ">
 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
 <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
 </div>
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white">Basic Information</h2>
 </div>
 
 <div className="space-y-5">
 <div>
 <div className="flex items-center justify-between mb-2">
 <label className="block text-xs font-bold text-gray-500 tracking-wider">Job Title</label>
 <div className="flex items-center gap-3">
 <span className="bg-[#00A76F]/10 text-[#00A76F] text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
 <span className="w-1.5 h-1.5 rounded-full bg-[#00A76F]"></span>
 Published
 </span>
 <span className="text-xs font-medium text-gray-400">
 Posted: 2026-08-10
 </span>
 </div>
 </div>
 <input 
 type="text" 
 value={setupJobData.title}
 onChange={(e) => setSetupJobData(prev => ({...prev, title: e.target.value}))}
 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border border-transparent dark:border-gray-700/50 rounded-xl text-[13px] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]/30 transition-all text-[#212b36] dark:text-white placeholder-gray-400 "
 placeholder="e.g. Senior Product Designer"
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">Department</label>
 <input 
 type="text" 
 value={setupJobData.department}
 onChange={(e) => setSetupJobData(prev => ({...prev, department: e.target.value}))}
 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border border-transparent dark:border-gray-700/50 rounded-xl text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]/30 transition-all text-[#212b36] dark:text-white placeholder-gray-400 "
 placeholder="e.g. Design"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">Requisition Ref</label>
 <input 
 type="text" 
 value={setupJobData.requisitionRef}
 onChange={(e) => setSetupJobData(prev => ({...prev, requisitionRef: e.target.value}))}
 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border border-transparent dark:border-gray-700/50 rounded-xl text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]/30 transition-all text-[#212b36] dark:text-white placeholder-gray-400 "
 placeholder="e.g. REQ-2024-001"
 />
 </div>
 </div>
 </div>
 </div>

 {/* Budget & Headcount Card */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 transition-all ">
 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
 <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
 </div>
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white">Budget & Headcount</h2>
 </div>

 <div className="space-y-6">
 <div>
 <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">Headcount Required</label>
 <div className="flex items-center">
 <button 
 onClick={() => setSetupJobData(prev => ({...prev, headcount: Math.max(1, Number(prev.headcount) - 1)}))}
 className="w-10 h-10 rounded-l-xl border-y border-l border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30 flex items-center justify-center text-[#212b36] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
 >
 -
 </button>
 <input 
 type="number" 
 min="1"
 value={setupJobData.headcount}
 onChange={(e) => setSetupJobData(prev => ({...prev, headcount: e.target.value}))}
 className="w-20 h-10 border-y border-x-0 border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#161c24] text-center text-[13px] font-bold focus:outline-none focus:ring-1 focus:ring-[#1890FF]/30 text-[#212b36] dark:text-white z-10"
 />
 <button 
 onClick={() => setSetupJobData(prev => ({...prev, headcount: Number(prev.headcount) + 1}))}
 className="w-10 h-10 rounded-r-xl border-y border-r border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30 flex items-center justify-center text-[#212b36] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
 >
 +
 </button>
 </div>
 </div>

 <div className="pt-2">
 <label className="block text-xs font-bold text-gray-500 tracking-wider mb-4 flex justify-between">
 <span>Approved Salary Range</span>
 <span className="text-[#1890FF] bg-[#1890FF]/10 px-2 py-0.5 rounded-md text-[10px] font-bold">{setupJobData.currency}</span>
 </label>
 <div className="w-full pb-4">
 <DualRangeSlider 
 min={0}
 max={1000000}
 value={[Number(setupJobData.salaryMin) || 50000, Number(setupJobData.salaryMax) || 150000]}
 onChange={(values) => {
 setSetupJobData(prev => ({ ...prev, salaryMin: values[0].toString(), salaryMax: values[1].toString() }));
 }}
 currency={setupJobData.currency}
 />
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Right Column */}
 <div className="space-y-8">
 {/* Logistics Card */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 transition-all ">
 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
 <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
 </div>
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white">Logistics</h2>
 </div>

 <div className="space-y-5">
 <div>
 <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">Location</label>
 <input 
 type="text" 
 value={setupJobData.location}
 onChange={(e) => setSetupJobData(prev => ({...prev, location: e.target.value}))}
 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border border-transparent dark:border-gray-700/50 rounded-xl text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]/30 transition-all text-[#212b36] dark:text-white placeholder-gray-400 "
 placeholder="e.g. San Francisco, CA"
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">Employment Type</label>
 <SearchableSelect 
 options={[
 { label: 'Full-time', value: 'Full-time' },
 { label: 'Part-time', value: 'Part-time' },
 { label: 'Contract', value: 'Contract' },
 { label: 'Internship', value: 'Internship' }
 ]}
 value={setupJobData.type}
 onChange={(value) => setSetupJobData(prev => ({...prev, type: value}))}
 placeholder="Select type..."
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">Work Mode</label>
 <SearchableSelect 
 options={[
 { label: 'On-site', value: 'On-site' },
 { label: 'Hybrid', value: 'Hybrid' },
 { label: 'Remote', value: 'Remote' }
 ]}
 value={setupJobData.workMode}
 onChange={(value) => setSetupJobData(prev => ({...prev, workMode: value}))}
 placeholder="Select mode..."
 />
 </div>
 </div>
 </div>
 </div>

 {/* Internal Notes Card */}
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 transition-all ">
 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
 <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
 </div>
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white">Internal Notes</h2>
 </div>
 
 <div>
 <textarea 
 rows="5"
 value={setupJobData.internalNotes}
 onChange={(e) => setSetupJobData(prev => ({...prev, internalNotes: e.target.value}))}
 className="w-full px-4 py-3 bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-xl text-[13px] focus:bg-white dark:focus:bg-[#161c24] focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400/50 transition-all resize-y text-[#212b36] dark:text-white placeholder-gray-400 "
 placeholder="Add any private notes, recruiter context, or approval chain details here. This will not be visible to candidates..."
 ></textarea>
 </div>
 </div>
 </div>
 </div>
 
 <div className="flex items-center justify-end pt-6 mt-12 border-t border-gray-100 dark:border-gray-800/50">
 <div className="flex gap-4">
 <button 
 onClick={() => navigate('/dashboard/jobs')}
 className="px-6 py-3 text-black hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <button 
 onClick={() => setSettingsActiveNav('Description & Skills')}
 className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
 >
 Save and Continue to 'Description & Skills'
 </button>
 </div>
 </div>
 
 </div>
 )}
 {settingsActiveNav === 'Description & Skills' && <SettingsDescriptionSkills setSettingsActiveNav={setSettingsActiveNav} />}
 {settingsActiveNav === 'Hiring Team' && <SettingsHiringTeam setSettingsActiveNav={setSettingsActiveNav} />}
 {settingsActiveNav === 'Pipeline' && <SettingsPipeline setSettingsActiveNav={setSettingsActiveNav} />}
 {settingsActiveNav === 'Scorecards' && <SettingsScorecards setSettingsActiveNav={setSettingsActiveNav} />}
 {settingsActiveNav === 'Ranking Rules' && <SettingsRankingRules setSettingsActiveNav={setSettingsActiveNav} />}
 {settingsActiveNav === 'Agencies' && <SettingsAgencies setSettingsActiveNav={setSettingsActiveNav} />}
 {settingsActiveNav === 'Notifications' && <SettingsNotifications setSettingsActiveNav={setSettingsActiveNav} />}
 </div>
 </div>
 )}

 {isEditRankingModalOpen && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 border border-gray-100 dark:border-gray-800 animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar">
 <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[#1890FF]/10 text-[#1890FF] rounded-xl flex items-center justify-center">
 <Settings2 size={20} />
 </div>
 <div>
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white">Edit AI Ranking Rules</h2>
 <p className="text-xs text-gray-500">Fine-tune how the AI evaluates applications for this job.</p>
 </div>
 </div>
 <button onClick={() => setIsEditRankingModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
 <X size={20} />
 </button>
 </div>
 
 <div className="space-y-3">
 {SCREENING_CRITERIA.map((item, idx) => (
 <div key={idx} className="bg-gray-50/50 dark:bg-gray-800/20 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
 <div className="flex flex-col md:flex-row gap-4">
 <div className="w-full md:w-1/3">
 <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-1">Rule Name</label>
 <input type="text" defaultValue={item.label} className="w-full px-3 py-1.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all" />
 </div>
 <div className="w-full md:w-2/3">
 <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-1">Rule Description</label>
 <textarea rows="2" defaultValue={item.text} className="w-full px-3 py-1.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all resize-none custom-scrollbar"></textarea>
 </div>
 </div>
 </div>
 ))}
 </div>
 
 <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/50">
 <button onClick={() => setIsEditRankingModalOpen(false)} className="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#212b36] dark:text-white rounded-xl font-bold text-[13px] transition-colors cursor-pointer">
 Cancel
 </button>
 <button onClick={() => { setIsEditRankingModalOpen(false); alert('AI Ranking Rules updated successfully.'); }} className="flex-1 px-5 py-2.5 bg-[#1890FF] hover:bg-[#1890FF]/90 text-white rounded-xl font-bold text-[13px] transition-colors cursor-pointer shadow-[#1890FF]/20">
 Save Rules
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Copy Toast */}
 <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl shadow-2xl transition-all duration-300 z-[100] ${showCopyToast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
 <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center shrink-0">
 <Check size={16} strokeWidth={3} className="text-white dark:text-gray-900" />
 </div>
 <div>
 <p className="text-[13px] font-bold">Feedback Copied!</p>
 <p className="text-xs opacity-80">Ready to paste in your email.</p>
 </div>
 </div>

 </div>
 );
}
