import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, MoreVertical, Briefcase, MapPin, 
 Users, Clock, CheckCircle, AlertCircle, Calendar, 
 ChevronDown, ArrowUpRight, Copy, Edit, Trash2, X, UploadCloud, Send, BrainCircuit, FileText, Upload, Type, ArrowRight, Loader2, ChevronsRight, ChevronsLeft, GripVertical } from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';
import findNewIco from '../assets/findnew-ico.png';

const MOCK_JOBS = [
 { id: 1, title: 'Senior AI Research Scientist', department: 'Engineering', location: 'Bangalore, India', type: 'Full-time', status: 'Published', applicants: 450, newApplicants: 184, postedDate: '2026-08-10', hiringManager: 'Amit Sharma', score: 98 },
 { id: 2, title: 'Product Design Lead', department: 'Design', location: 'San Francisco, CA', type: 'Hybrid', status: 'Draft', applicants: 0, newApplicants: 0, postedDate: '2026-08-20', hiringManager: 'Sarah Jenkins', score: 0 },
 { id: 3, title: 'VP of Marketing', department: 'Marketing', location: 'New York, NY', type: 'Full-time', status: 'Closed', applicants: 89, newApplicants: 0, postedDate: '2026-07-01', hiringManager: 'David Chen', score: 100 },
 { id: 4, title: 'Data Engineer', department: 'Data Science', location: 'London, UK', type: 'Full-time', status: 'Internal', applicants: 12, newApplicants: 2, postedDate: '2026-08-18', hiringManager: 'Amit Sharma', score: 85 },
 { id: 5, title: 'Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Published', applicants: 210, newApplicants: 15, postedDate: '2026-08-21', hiringManager: 'Amit Sharma', score: 92 },
 { id: 6, title: 'DevOps Engineer', department: 'Engineering', location: 'Bangalore, India', type: 'Contract', status: 'Published', applicants: 85, newApplicants: 8, postedDate: '2026-08-22', hiringManager: 'Sarah Jenkins', score: 88 },
 { id: 7, title: 'HR Business Partner', department: 'HR', location: 'New York, NY', type: 'Hybrid', status: 'Internal', applicants: 5, newApplicants: 1, postedDate: '2026-08-15', hiringManager: 'David Chen', score: 75 },
 { id: 8, title: 'Sales Executive', department: 'Sales', location: 'London, UK', type: 'Full-time', status: 'Closed', applicants: 120, newApplicants: 0, postedDate: '2026-07-10', hiringManager: 'Amit Sharma', score: 90 }
];

const DEFAULT_CHATBOT_WIDTH = 320;
const MAX_CHATBOT_WIDTH = 600;

export default function JobsPage() {
 const navigate = useNavigate();
 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState('All');
 
 const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
 const [successMessage, setSuccessMessage] = useState(null);
 const [errors, setErrors] = useState({});

 const [isSendAgencyModalOpen, setIsSendAgencyModalOpen] = useState(false);
 const [selectedJobForAgency, setSelectedJobForAgency] = useState(null);
 const [sendAgencyData, setSendAgencyData] = useState({ agency: '', message: '' });
 const [customAlert, setCustomAlert] = useState(null);
 const [openActionMenuId, setOpenActionMenuId] = useState(null);
 const [jobs, setJobs] = useState(MOCK_JOBS);
 const [editingJobId, setEditingJobId] = useState(null);

 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5;

 const [chatbotWidth, setChatbotWidth] = useState(DEFAULT_CHATBOT_WIDTH);
 const [isChatbotCollapsed, setIsChatbotCollapsed] = useState(false);
 const [isChatbotResizing, setIsChatbotResizing] = useState(false);
 const [isViewJobModalOpen, setIsViewJobModalOpen] = useState(false);
 const [selectedJobToView, setSelectedJobToView] = useState(null);

 useEffect(() => {
 const handleMouseMove = (e) => {
 if (!isChatbotResizing || isChatbotCollapsed) return;
 e.preventDefault();
 const newWidth = document.body.clientWidth - e.clientX;
 if (newWidth < DEFAULT_CHATBOT_WIDTH) {
 setChatbotWidth(DEFAULT_CHATBOT_WIDTH);
 return;
 }
 setChatbotWidth(Math.min(MAX_CHATBOT_WIDTH, newWidth));
 };
 const handleMouseUp = () => setIsChatbotResizing(false);
 if (isChatbotResizing) {
 document.body.style.cursor = 'w-resize';
 document.body.style.userSelect = 'none';
 document.documentElement.style.cursor = 'w-resize';
 document.addEventListener('mousemove', handleMouseMove);
 document.addEventListener('mouseup', handleMouseUp);
 }
 return () => {
 document.body.style.cursor = '';
 document.body.style.userSelect = '';
 document.documentElement.style.cursor = '';
 document.removeEventListener('mousemove', handleMouseMove);
 document.removeEventListener('mouseup', handleMouseUp);
 };
 }, [isChatbotResizing, isChatbotCollapsed]);

 useEffect(() => {
 const handleClickOutside = () => setOpenActionMenuId(null);
 document.addEventListener('click', handleClickOutside);
 return () => document.removeEventListener('click', handleClickOutside);
 }, []);
 
 const [modalStep, setModalStep] = useState(1);
 const [skippedJdUpload, setSkippedJdUpload] = useState(false);
 const [isExtracting, setIsExtracting] = useState(false);
 const [isDragging, setIsDragging] = useState(false);

 const [newJobData, setNewJobData] = useState({
 title: '',
 department: '',
 location: '',
 type: 'Full-time',
 workMode: 'On-site',
 hiringManager: '',
 jdText: '',
 jdFile: null
 });

 const validate = () => {
 const newErrors = {};
 if (!newJobData.title.trim()) newErrors.title = 'Job Title is required';
 if (!newJobData.department.trim()) newErrors.department = 'Department is required';
 if (!newJobData.location.trim()) newErrors.location = 'Location is required';
 
 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 };

 const handleCloseModal = () => {
 setIsCreateModalOpen(false);
 setEditingJobId(null);
 setNewJobData({title: '', department: '', location: '', type: 'Full-time', hiringManager: '', jdText: '', jdFile: null});
 setErrors({});
 setModalStep(1);
 setSkippedJdUpload(false);
 setIsExtracting(false);
 };

 const simulateExtraction = () => {
 setIsExtracting(true);
 setTimeout(() => {
 setIsExtracting(false);
 setNewJobData(prev => ({
 ...prev,
 title: 'Senior Frontend Engineer',
 department: 'Engineering',
 location: 'Remote',
 hiringManager: 'Amit Sharma'
 }));
 setModalStep(2);
 }, 1500);
 };
 
 const handleFileUpload = (file) => {
 if (file) {
 setNewJobData(prev => ({...prev, jdFile: file}));
 if (modalStep === 1) {
 simulateExtraction();
 }
 }
 };
 
 const handleDragOver = (e) => {
 e.preventDefault();
 setIsDragging(true);
 };
 
 const handleDragLeave = () => {
 setIsDragging(false);
 };
 
 const handleDrop = (e) => {
 e.preventDefault();
 setIsDragging(false);
 if (e.dataTransfer.files && e.dataTransfer.files[0]) {
 handleFileUpload(e.dataTransfer.files[0]);
 }
 };
 
 
 const filteredJobs = jobs.filter(job => {
 const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
 job.department.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
 return matchesSearch && matchesStatus;
 });

 // Reset to page 1 when filters change
 useEffect(() => {
 setCurrentPage(1);
 }, [searchQuery, statusFilter]);

 const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
 const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 const getStatusColor = (status) => {
 switch(status) {
 case 'Published': return 'bg-[#00A76F]/10 text-[#00A76F]';
 case 'Draft': return 'bg-[#FFC107]/10 text-[#b78103] dark:text-[#FFC107]';
 case 'Closed': return 'bg-[#FF5630]/10 text-[#FF5630]';
 case 'Internal': return 'bg-[#1890FF]/10 text-[#1890FF]';
 default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
 }
 };

 return (
 <>
 {isChatbotResizing && (
 <div className="fixed inset-0 z-[200] cursor-w-resize" />
 )}
 <div className="p-6 space-y-6 relative">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold text-[#212b36] dark:text-white">List of Jobs</h1>
 <p className="text-sm text-black dark:text-gray-400 mt-1">Manage and track all open requisitions.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="px-4 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800/50 text-[#212b36] dark:text-white rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
 <ArrowUpRight size={16} /> Export
 </button>
 <button 
 onClick={() => setIsCreateModalOpen(true)}
 className="px-4 py-2 bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] rounded-lg text-sm font-bold shadow-sm hover:bg-[#161c24] dark:hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer"
 >
 <Plus size={16} /> Create Job
 </button>
 </div>
 </div>

 {/* Stats Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'Total Active Jobs', value: '34', icon: Briefcase, color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },
 { label: 'Total Candidates', value: '12,450', icon: Users, color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10' },
 { label: 'Pending Reviews', value: '84', icon: Clock, color: 'text-[#FFC107]', bg: 'bg-[#FFC107]/10' },
 { label: 'Interviews This Week', value: '12', icon: Calendar, color: 'text-[#8E33FF]', bg: 'bg-[#8E33FF]/10' }
 ].map((stat, i) => (
 <div key={i} className="bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
 <stat.icon size={24} className={stat.color} />
 </div>
 <div>
 <h3 className="text-2xl font-bold text-[#212b36] dark:text-white">{stat.value}</h3>
 <p className="text-sm font-medium text-black dark:text-gray-400">{stat.label}</p>
 </div>
 </div>
 ))}
 </div>

 <div className="flex flex-col xl:flex-row gap-6 relative items-start overflow-x-hidden">
 <div className="flex-1 min-w-0 space-y-6">
 {/* Filters & Search */}
 <div className="bg-white dark:bg-[#161c24] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center">
 <div className="flex flex-wrap gap-2 w-full xl:w-auto">
 {['All', 'Published', 'Draft', 'Internal', 'Closed'].map(status => (
 <button
 key={status}
 onClick={() => setStatusFilter(status)}
 className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
 statusFilter === status 
 ? 'bg-[#212b36] dark:bg-white text-white dark:text-[#212b36]' 
 : 'bg-gray-50 dark:bg-gray-800/50 text-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
 }`}
 >
 {status}
 </button>
 ))}
 </div>
 
 <div className="flex gap-3 w-full md:w-auto">
 <div className="relative md:w-64">
 <input 
 type="text" 
 placeholder="Search jobs..." 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full px-4 py-2 text-xs bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none text-[#212b36] dark:text-white transition-all"
 />
 </div>
 </div>
 </div>

 {/* Jobs List */}
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800/50">
 <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Job Details</th>
 <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Active Candidates</th>
 <th className="px-6 py-4 text-center text-xs font-bold text-black dark:text-gray-400 ">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
 {paginatedJobs.length > 0 ? paginatedJobs.map((job, index) => (
 <tr 
 key={job.id} 
 onClick={() => navigate('/dashboard/agencies', { state: { jobData: job } })}
 className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group cursor-pointer"
 >
 <td className="px-6 py-4">
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#1890FF] shrink-0">
 <Briefcase size={20} />
 </div>
 <div>
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors cursor-pointer">{job.title}</h4>
 <div className="flex items-center gap-2 mt-1 mb-1">
 <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(job.status)} inline-flex items-center gap-1`}>
 <span className="w-1 h-1 rounded-full bg-current"></span>
 {job.status}
 </span>
 <span className="text-[10px] text-gray-500 font-medium border-l border-gray-300 dark:border-gray-600 pl-2">Posted: {job.postedDate}</span>
 </div>
 <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-black dark:text-gray-400">
 <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
 <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
 <span>{job.department}</span>
 <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
 <span>{job.type}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 {job.applicants === 0 ? (
 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-[#161c24] flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
 N/A
 </div>
 ) : (
 <div className="flex -space-x-2">
 <img src={`https://i.pravatar.cc/150?u=${job.id + 1}`} alt="Candidate" className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#161c24] z-30 relative object-cover" />
 {job.applicants > 1 && (
 <img src={`https://i.pravatar.cc/150?u=${job.id + 2}`} alt="Candidate" className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#161c24] z-20 relative object-cover" />
 )}
 {job.applicants > 2 && (
 <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-[#161c24] flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 z-10 relative">
 +{job.applicants - 2 > 99 ? '99' : job.applicants - 2}
 </div>
 )}
 </div>
 )}
 <div>
 <div className="text-sm font-bold text-[#212b36] dark:text-white">{job.applicants.toLocaleString()}</div>
 {job.newApplicants > 0 && (
 <div className="text-[11px] font-bold text-[#00A76F]">+{job.newApplicants} new</div>
 )}
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-center gap-2 relative">
 <button 
 onClick={(e) => {
 e.stopPropagation();
 setOpenActionMenuId(openActionMenuId === job.id ? null : job.id);
 }}
 className="p-2 text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 title="Actions"
 >
 <MoreVertical size={16} />
 </button>

 {openActionMenuId === job.id && (
 <div className={`absolute right-0 ${index >= paginatedJobs.length - 2 && paginatedJobs.length > 2 ? 'bottom-full mb-1' : 'top-10 mt-1'} w-48 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1 animate-fade-in`}>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 setSelectedJobForAgency(job);
 setIsSendAgencyModalOpen(true);
 setOpenActionMenuId(null);
 }}
 className="w-full px-4 py-2 text-left text-sm font-medium text-[#00A76F] hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
 >
 <Send size={14} />
 Send to Agency
 </button>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 setSelectedJobToView(job);
 setIsViewJobModalOpen(true);
 setOpenActionMenuId(null);
 }}
 className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
 >
 <FileText size={14} />
 View Job
 </button>
 <button 
 onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
 className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
 >
 <Copy size={14} />
 Copy Link
 </button>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 setOpenActionMenuId(null);
 navigate('/dashboard/job-setup/overview', { state: { jobData: job, from: { name: 'Job List', path: '/dashboard/jobs' } } });
 }}
 className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
 >
 <Edit size={14} />
 Edit Job
 </button>
 <div className="my-1 border-t border-gray-100 dark:border-gray-800/50"></div>
 <button 
 onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
 className="w-full px-4 py-2 text-left text-sm font-medium text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors cursor-pointer"
 >
 <Trash2 size={14} />
 Delete
 </button>
 </div>
 )}
 </div>
 </td>
 </tr>
 )) : (
 <tr>
 <td colSpan="5" className="px-6 py-16 text-center">
 <div className="flex flex-col items-center justify-center">
 <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
 <Briefcase size={32} className="text-gray-400" />
 </div>
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-1">No jobs found</h3>
 <p className="text-black dark:text-gray-400 text-sm max-w-sm">
 We couldn't find any jobs matching your current search and filter criteria.
 </p>
 <button className="mt-4 text-[#1890FF] font-bold text-sm hover:underline" onClick={() => {setSearchQuery(''); setStatusFilter('All');}}>
 Clear filters
 </button>
 </div>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 
 {filteredJobs.length > 0 && (
 <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
 <span className="text-sm text-black dark:text-gray-400 font-medium">
 Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
 </span>
 <div className="flex gap-1 items-center">
 <span className="text-sm text-black dark:text-gray-400 font-medium mr-2">
 Page {currentPage} of {totalPages}
 </span>
 <button 
 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
 disabled={currentPage === 1}
 className={`px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
 >
 Previous
 </button>
 <button 
 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
 disabled={currentPage === totalPages}
 className={`px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
 >
 Next
 </button>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Right Sidebar */}
 <div className="w-full xl:w-[320px] shrink-0 space-y-6">
 {/* Recent Activity */}
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">
 <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3">Recent Activity</h3>
 <div className="space-y-3">
 {[
 { time: '2h ago', action: 'New applicant', target: 'Frontend Engineer', icon: Users, color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },
 { time: '4h ago', action: 'Offer accepted', target: 'UX Researcher', icon: CheckCircle, color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10' },
 { time: '1d ago', action: 'Job published', target: 'DevOps Engineer', icon: Briefcase, color: 'text-[#8E33FF]', bg: 'bg-[#8E33FF]/10' },
 { time: '2d ago', action: 'Interview scheduled', target: 'Product Manager', icon: Calendar, color: 'text-[#FFC107]', bg: 'bg-[#FFC107]/10' },
 ].map((activity, i) => (
 <div key={i} className="flex gap-2.5">
 <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${activity.bg}`}>
 <activity.icon size={12} className={activity.color} />
 </div>
 <div>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white">{activity.action}</p>
 <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{activity.target} • {activity.time}</p>
 </div>
 </div>
 ))}
 </div>
 <button className="w-full mt-3 py-1.5 text-xs font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors cursor-pointer">View All Activity</button>
 </div>

 {/* Upcoming Interviews */}
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">
 <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3">Upcoming Interviews</h3>
 <div className="space-y-2.5">
 {[
 { candidate: 'Sarah Jenkins', role: 'UX', time: 'Today, 2:00 PM', type: 'Tech', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
 { candidate: 'Michael Lee', role: 'Frontend', time: 'Tmrw, 10:30 AM', type: 'Culture', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
 ].map((interview, i) => (
 <div key={i} className="flex items-center gap-2.5 p-2 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
 <img src={interview.avatar} alt={interview.candidate} className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800" />
 <div className="flex-1 min-w-0">
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">{interview.candidate}</p>
 <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{interview.role} • {interview.type}</p>
 </div>
 </div>
 ))}
 </div>
 <button className="w-full mt-3 py-1.5 text-xs font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors cursor-pointer">View Schedule</button>
 </div>

 {/* Action Items */}
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">
 <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3 flex items-center gap-2">
 <AlertCircle size={16} className="text-[#FF5630]" /> Needs Attention
 </h3>
 <div className="space-y-2">
 {[
 { title: 'Review candidates', desc: '5 new applicants', action: 'Review', color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },
 { title: 'Draft expires soon', desc: 'Expires in 2 days', action: 'Publish', color: 'text-[#FFC107]', bg: 'bg-[#FFC107]/10' }
 ].map((item, i) => (
 <div key={i} className="flex flex-col gap-1.5 p-2.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
 <div>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white">{item.title}</p>
 <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
 </div>
 <button className={`self-start mt-0.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${item.color} ${item.bg} hover:opacity-80 transition-opacity cursor-pointer`}>
 {item.action}
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div
 className="hidden xl:block shrink-0"
 style={{
 width: isChatbotCollapsed ? 0 : DEFAULT_CHATBOT_WIDTH,
 transition: isChatbotResizing ? 'none' : 'width 300ms cubic-bezier(0.22, 1, 0.36, 1)'
 }}
 />

 <button
 type="button"
 onClick={() => {
 setChatbotWidth(DEFAULT_CHATBOT_WIDTH);
 setIsChatbotCollapsed(false);
 }}
 className={`hidden xl:flex absolute right-0 top-4 z-40 items-center gap-1.5 pl-2 pr-3 py-2 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/50 rounded-l-xl shadow-sm text-[#1890FF] hover:bg-[#1890FF]/5 cursor-pointer ${
 isChatbotResizing ? '' : 'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
 } ${isChatbotCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}
 aria-label="Expand FindNew AI"
 >
 <ChevronsLeft size={16} />
 <img src={findNewIco} alt="" className="w-4 h-4 object-contain" />
 </button>

 <div
 style={{
 width: chatbotWidth,
 transform: isChatbotCollapsed ? 'translateX(100%)' : 'translateX(0)',
 transition: isChatbotResizing ? 'none' : 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
 }}
 className={`absolute right-0 top-0 bottom-0 z-40 hidden xl:flex flex-col bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden ${
 chatbotWidth > DEFAULT_CHATBOT_WIDTH && !isChatbotCollapsed ? 'shadow-[-12px_0_32px_rgba(22,28,36,0.12)]' : 'shadow-sm'
 } ${isChatbotResizing ? 'select-none pointer-events-none' : ''} ${isChatbotCollapsed ? 'pointer-events-none' : ''}`}
 >
 <div
 onMouseDown={(e) => {
 e.preventDefault();
 if (!isChatbotCollapsed) setIsChatbotResizing(true);
 }}
 className={`absolute left-0 top-0 bottom-0 w-4 z-10 flex items-center justify-center cursor-w-resize group ${
 isChatbotResizing ? 'bg-[#1890FF]/15' : 'hover:bg-[#1890FF]/10'
 }`}
 title="Drag left to widen"
 >
 <span
 className={`flex items-center justify-center w-[18px] h-11 rounded-full border shadow-sm transition-colors ${
 isChatbotResizing
 ? 'bg-[#1890FF] border-[#1890FF] text-white'
 : 'bg-white dark:bg-[#161c24] border-gray-200 dark:border-gray-600 text-[#454f5b] dark:text-gray-300 group-hover:border-[#1890FF] group-hover:text-[#1890FF]'
 }`}
 >
 <GripVertical size={14} />
 </span>
 </div>
 <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/20">
 <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
 <img src={findNewIco} alt="FindNew AI" className="w-8 h-8 object-contain" />
 </div>
 <div className="flex-1 min-w-0"><h3 className="text-sm font-bold text-[#212b36] dark:text-white">FindNew AI</h3><p className="text-[11px] text-gray-500">Always here to help</p></div>
 <button
 type="button"
 onClick={() => setIsChatbotCollapsed(true)}
 className="p-1.5 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer shrink-0"
 aria-label="Collapse FindNew AI"
 >
 <ChevronsRight size={16} />
 </button>
 </div>
 <div className="flex-1 p-4 overflow-y-auto space-y-4">
 <div className="flex flex-col gap-1 items-start max-w-[85%]">
 <div className="bg-gray-100 dark:bg-gray-800 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white leading-relaxed">
 Hi! I can help you analyze your hiring pipeline, find jobs, or summarize candidates.
 </div>
 </div>
 
 <div className="flex flex-col gap-1 items-end ml-auto max-w-[85%]">
 <div className="bg-[#1890FF] text-white px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-[13px] font-medium shadow-sm">
 Which jobs need attention today?
 </div>
 </div>

 <div className="flex flex-col gap-1 items-start max-w-[90%]">
 <div className="bg-gray-100 dark:bg-gray-800 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white leading-relaxed">
 <p className="mb-2">Three areas need attention:</p>
 <ul className="list-disc pl-4 space-y-1">
 <li><span className="font-bold">Product Design Lead</span> — still in Draft</li>
 <li><span className="font-bold">Backend Developer</span> — no candidates yet</li>
 <li><span className="font-bold">Data Engineer</span> — 12 active candidates</li>
 </ul>
 </div>
 </div>

 <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-4">
 <p className="text-[10px] font-bold text-gray-400 mb-2 tracking-wider">Suggested Questions</p>
 <div className="space-y-2">
 {["Who are my top candidates?", "Which jobs are overdue?", "Summarize this week"].map((q, i) => (
 <button key={i} className="w-full text-left px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-[12px] font-medium text-[#212b36] dark:text-white transition-colors cursor-pointer shadow-sm">
 {q}
 </button>
 ))}
 </div>
 </div>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24]">
 <div className="relative">
 <input type="text" placeholder="Ask me anything..." className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-[#212b36] dark:text-white"/>
 <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg"><Send size={16} /></button>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Send to Agency Modal */}
 {isSendAgencyModalOpen && (
 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#212b36] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col scale-in-center">
 
 <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
 <h2 className="text-xl font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Send size={24} className="text-[#00A76F]" />
 Send to Agency
 </h2>
 <button 
 onClick={() => setIsSendAgencyModalOpen(false)}
 className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors cursor-pointer"
 >
 <X size={20} />
 </button>
 </div>
 
 <div className="p-6 overflow-visible space-y-4">
 <p className="text-sm text-black dark:text-gray-400">
 You are sending <span className="font-bold text-[#212b36] dark:text-white">{selectedJobForAgency?.title}</span> to an agency partner.
 </p>
 
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Select Agency</label>
 <SearchableSelect 
 options={[
 { label: 'Adecco', value: 'Adecco' },
 { label: 'Randstad', value: 'Randstad' },
 { label: 'ManpowerGroup', value: 'ManpowerGroup' },
 { label: 'Kelly Services', value: 'Kelly Services' }
 ]}
 value={sendAgencyData.agency}
 onChange={(val) => setSendAgencyData({...sendAgencyData, agency: val})}
 placeholder="Select an agency..."
 />
 </div>

 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Message / Instructions</label>
 <textarea 
 value={sendAgencyData.message}
 onChange={(e) => setSendAgencyData({...sendAgencyData, message: e.target.value})}
 rows="4"
 className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-0 focus:border-[#1890FF] transition-colors resize-y text-[#212b36] dark:text-white"
 placeholder="Enter any specific requirements, priority notes, or guidelines..."
 ></textarea>
 </div>
 </div>

 </div>
 <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10 rounded-b-2xl">
 <button 
 onClick={() => setModalStep(1)}
 className="px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 >
 Back
 </button>
 <div className="flex gap-3">

 <button 
 onClick={() => setIsSendAgencyModalOpen(false)}
 className="px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 disabled={!sendAgencyData.agency}
 onClick={() => {
 setCustomAlert({
 title: 'Request Sent Successfully',
 message: `Job "${selectedJobForAgency?.title}" has been sent to ${sendAgencyData.agency}!`
 });
 setIsSendAgencyModalOpen(false);
 setSendAgencyData({ agency: '', message: '' });
 }}
 className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm transition-colors cursor-pointer ${sendAgencyData.agency ? 'bg-[#00A76F] hover:bg-[#00A76F]/90' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`}
 >
 Send Request
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Custom Alert Modal */}
 {customAlert && (
 <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#212b36] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col scale-in-center items-center text-center p-8 border border-gray-100 dark:border-gray-800/50">
 <div className="w-20 h-20 bg-[#00A76F]/10 text-[#00A76F] rounded-full flex items-center justify-center mb-6">
 <CheckCircle size={40} />
 </div>
 <h3 className="text-2xl font-bold text-[#212b36] dark:text-white mb-3">{customAlert.title}</h3>
 <p className="text-black dark:text-gray-400 mb-8 text-[15px] leading-relaxed">
 {customAlert.message}
 </p>
 <button 
 onClick={() => setCustomAlert(null)}
 className="w-full py-3.5 text-[15px] font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 rounded-xl shadow-[0_8px_16px_rgba(0,167,111,0.24)] transition-all cursor-pointer"
 >
 Done
 </button>
 </div>
 </div>
 )}

 {/* Create Job Modal */}
 {isCreateModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800/50 flex flex-col max-h-[90vh]">
 <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white">{editingJobId ? 'Edit Job' : 'Create New Job'}</h2>
 <button 
 onClick={handleCloseModal}
 className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
 >
 <X size={20} />
 </button>
 </div>
 
 
 {modalStep === 1 ? (
 <div className="p-8 overflow-y-auto flex flex-col items-center justify-center min-h-[400px]">
 {isExtracting ? (
 <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
 <div className="relative">
 <div className="w-20 h-20 border-4 border-[#1890FF]/20 rounded-full"></div>
 <div className="w-20 h-20 border-4 border-[#1890FF] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
 <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1890FF]" size={32} />
 </div>
 <div className="text-center">
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white mb-2">Analyzing Job Description</h3>
 <p className="text-black text-sm">Our AI is extracting key details to pre-fill your form...</p>
 </div>
 </div>
 ) : (
 <div className="w-full max-w-md space-y-8 animate-fade-in">
 <div className="text-center">
 <h3 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">Let's create a new job</h3>
 <p className="text-black text-sm">Provide a job description to automatically populate the details.</p>
 </div>
 
 <div className="space-y-5">
 <div 
 onClick={() => document.getElementById('jd-upload').click()}
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 className={`relative flex flex-col items-center justify-center py-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isDragging ? 'border-[#1890FF] bg-[#1890FF]/5' : 'border-gray-200 dark:border-gray-700 hover:border-[#1890FF] hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
 >
 <input 
 id="jd-upload" 
 type="file" 
 className="hidden" 
 accept=".pdf,.doc,.docx,.txt"
 onChange={(e) => handleFileUpload(e.target.files[0])}
 />
 <div className="w-10 h-10 bg-[#1890FF]/10 text-[#1890FF] rounded-full flex items-center justify-center mb-2">
 <UploadCloud size={20} />
 </div>
 <h4 className="font-bold text-[#212b36] dark:text-white text-sm mb-1">Upload Job Description</h4>
 <p className="text-[11px] text-black text-center">Drag & drop or click (PDF, DOCX, TXT)</p>
 </div>
 
 <div className="relative flex items-center">
 <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
 <span className="flex-shrink-0 mx-4 text-xs font-bold text-[#212b36] dark:text-gray-300">OR PASTE TEXT</span>
 <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
 </div>
 
 <div className="space-y-3">
 <textarea 
 value={newJobData.jdText}
 onChange={(e) => setNewJobData({...newJobData, jdText: e.target.value})}
 className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-0 focus:border-[#1890FF] transition-colors resize-none text-[#212b36] dark:text-white"
 placeholder="Paste your job description text here..."
 ></textarea>
 <button 
 disabled={!newJobData.jdText.trim()}
 onClick={() => {
 setSkippedJdUpload(false);
 simulateExtraction();
 }}
 className={`w-full flex justify-center items-center gap-2 py-3 text-sm font-bold text-white rounded-xl transition-colors ${newJobData.jdText.trim() ? 'bg-[#1890FF] hover:bg-[#1890FF]/90 cursor-pointer shadow-[0_4px_12px_rgba(24,144,255,0.24)]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed shadow-none'}`}
 >
 <BrainCircuit size={16} />
 Extract & Continue
 </button>
 </div>
 
 <div className="pt-2 text-center">
 <button 
 onClick={() => {
 setSkippedJdUpload(true);
 setNewJobData({
 title: '',
 department: '',
 location: '',
 type: 'Full-time',
 workMode: 'On-site',
 hiringManager: '',
 jdText: '',
 jdFile: null
 });
 setModalStep(2);
 }}
 className="text-sm font-bold text-[#212b36] dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
 >
 Skip and fill manually <ArrowRight size={14} />
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 ) : (

 <>
<div className="p-6 overflow-y-auto space-y-4 flex-1">
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Job Title</label>
 <input 
 type="text" 
 value={newJobData.title}
 onChange={(e) => {
 setNewJobData({...newJobData, title: e.target.value});
 if (errors.title) setErrors({...errors, title: null});
 }}
 className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.title ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
 placeholder="e.g. Senior Frontend Engineer"
 />
 <div className="min-h-[20px] mt-1 flex items-start">
 {errors.title && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.title}</p>}
 </div>
 </div>
 
 <div className="grid grid-cols-2 gap-4">
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Department</label>
 <input 
 type="text" 
 value={newJobData.department}
 onChange={(e) => {
 setNewJobData({...newJobData, department: e.target.value});
 if (errors.department) setErrors({...errors, department: null});
 }}
 className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.department ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
 placeholder="e.g. Engineering"
 />
 <div className="min-h-[20px] mt-1 flex items-start">
 {errors.department && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.department}</p>}
 </div>
 </div>
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Employment Type</label>
 <SearchableSelect 
 options={[
 { label: 'Full-time', value: 'Full-time' },
 { label: 'Part-time', value: 'Part-time' },
 { label: 'Contract', value: 'Contract' },
 { label: 'Hybrid', value: 'Hybrid' }
 ]}
 value={newJobData.type}
 onChange={(value) => setNewJobData({...newJobData, type: value})}
 placeholder="Select employment type..."
 />
 <div className="min-h-[20px] mt-1"></div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Work Mode</label>
 <SearchableSelect 
 options={[
 { label: 'On-site', value: 'On-site' },
 { label: 'Hybrid', value: 'Hybrid' },
 { label: 'Remote', value: 'Remote' }
 ]}
 value={newJobData.workMode}
 onChange={(value) => setNewJobData({...newJobData, workMode: value})}
 placeholder="Select work mode..."
 />
 <div className="min-h-[20px] mt-1"></div>
 </div>

 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Location (City, Country)</label>
 <input 
 type="text" 
 value={newJobData.location}
 onChange={(e) => {
 setNewJobData({...newJobData, location: e.target.value});
 if (errors.location) setErrors({...errors, location: null});
 }}
 className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.location ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
 placeholder="e.g. San Francisco, CA or Remote"
 />
 <div className="min-h-[20px] mt-1 flex items-start">
 {errors.location && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.location}</p>}
 </div>
 </div>
 </div>

 {skippedJdUpload && (
 <div className="flex flex-col mt-4">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Job Description File (Optional)</label>
 <div 
 onClick={() => document.getElementById('jd-upload-manual').click()}
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 className={`relative flex flex-col items-center justify-center py-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isDragging ? 'border-[#1890FF] bg-[#1890FF]/5' : 'border-gray-200 dark:border-gray-700 hover:border-[#1890FF] hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
 >
 <input 
 id="jd-upload-manual" 
 type="file" 
 className="hidden" 
 accept=".pdf,.doc,.docx,.txt"
 onChange={(e) => {
 if (e.target.files && e.target.files[0]) {
 handleFileUpload(e.target.files[0]);
 }
 }}
 />
 <div className="flex flex-col items-center gap-1">
 <UploadCloud size={20} className="text-[#1890FF] mb-1" />
 <span className="text-sm font-medium text-[#212b36] dark:text-white">
 {newJobData.jdFile ? newJobData.jdFile.name : 'Upload Document (PDF, DOC, TXT)'}
 </span>
 {!newJobData.jdFile && (
 <span className="text-xs text-black">Drag & drop or click to upload</span>
 )}
 </div>
 </div>
 </div>
 )}
 </div>

 <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10 rounded-b-2xl">
 <button 
 onClick={() => setModalStep(1)}
 className="px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 >
 Back
 </button>
 <div className="flex gap-3">
 <button 
 onClick={handleCloseModal}
 className="px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 if (validate()) {
 if (editingJobId) {
 setJobs(jobs.map(j => j.id === editingJobId ? { ...j, ...newJobData } : j));
 setSuccessMessage(`Job "${newJobData.title}" updated successfully!`);
 } else {
 const newJob = {
 id: Math.max(...jobs.map(j => j.id), 0) + 1,
 ...newJobData,
 status: 'Draft',
 applicants: 0,
 newApplicants: 0,
 postedDate: new Date().toISOString().split('T')[0],
 score: 0
 };
 setJobs([...jobs, newJob]);
 setSuccessMessage(`Job "${newJobData.title}" created successfully!`);
 navigate('/dashboard/agencies', { state: { tab: 'Job Setup', jobData: newJob, from: { name: 'Job List', path: '/dashboard/jobs' } } });
 }
 setTimeout(() => setSuccessMessage(null), 4000);
 handleCloseModal();
 }
 }}
 className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer"
 >
 {editingJobId ? 'Update Job' : 'Create & Continue Setup'}
 </button>
 </div>
 </div>
 </>
 )}
 
 </div>
 </div>
 )}

 {/* View Job Modal */}
 {isViewJobModalOpen && selectedJobToView && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
 <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
 <div>
 <h2 className="text-xl font-bold text-[#212b36] dark:text-white">{selectedJobToView.title}</h2>
 <p className="text-sm text-gray-500 mt-1">{selectedJobToView.department} • {selectedJobToView.type} • {selectedJobToView.location}</p>
 </div>
 <button onClick={() => setIsViewJobModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
 <X size={20} />
 </button>
 </div>
 <div className="p-6 space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div><p className="text-xs text-gray-500">Status</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.status}</p></div>
 <div><p className="text-xs text-gray-500">Posted Date</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.postedDate}</p></div>
 <div><p className="text-xs text-gray-500">Hiring Manager</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.hiringManager}</p></div>
 <div><p className="text-xs text-gray-500">Active Candidates</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.applicants}</p></div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Toast Notification */}
 {successMessage && (
 <div className="fixed top-6 right-6 z-[60] bg-white dark:bg-[#161c24] border border-[#00A76F]/20 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 flex items-center gap-4 animate-fade-in transform transition-all">
 <div className="w-10 h-10 rounded-full bg-[#00A76F]/10 flex items-center justify-center text-[#00A76F] shrink-0">
 <CheckCircle size={20} />
 </div>
 <div className="pr-2">
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white">Success</h4>
 <p className="text-xs font-medium text-black dark:text-gray-400 mt-0.5">{successMessage}</p>
 </div>
 <button onClick={() => setSuccessMessage(null)} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
 <X size={16} />
 </button>
 </div>
 )}
 </>
 );
}
