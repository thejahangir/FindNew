import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
 UploadCloud, FileText, X, Search, MapPin, 
 Briefcase, Building, Check, UserPlus, Filter, Clock,
 Mail, ExternalLink, Users, Loader2, ChevronLeft, ChevronRight, Edit3, Save
} from 'lucide-react';

export default function JobSetupKnowledgeBasePage() {
 const navigate = useNavigate();
 const location = useLocation();
 const jobData = location.state?.jobData;

 const [uploadedFiles, setUploadedFiles] = useState([]);
 const [hasSearched, setHasSearched] = useState(false);
 const [isSearching, setIsSearching] = useState(false);
 const [isEditing, setIsEditing] = useState(jobData?.status !== 'Published');
 const [currentPage, setCurrentPage] = useState(1);
 const [searchParams, setSearchParams] = useState({
 location: '',
 minExp: '',
 maxExp: '',
 prefCompany: '',
 exclCompany: ''
 });
 const ITEMS_PER_PAGE = 5;
 
 const [candidates, setCandidates] = useState([
 {
 id: 1,
 name: 'Rahul Sharma',
 designation: 'Senior Frontend Engineer',
 company: 'TechCorp India',
 experience: '8 Years',
 location: 'Bengaluru, India',
 email: 'rahul.sharma@example.in',
 linkedin: 'linkedin.com/in/rahulsharma',
 skills: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
 brief: 'Highly motivated frontend engineer with a proven track record of delivering scalable web applications. Lead developer on multiple high-impact projects at TechCorp.',
 selected: false,
 },
 {
 id: 2,
 name: 'Priya Patel',
 designation: 'Full Stack Developer',
 company: 'Innovate Solutions',
 experience: '5 Years',
 location: 'Mumbai, India',
 email: 'priya.patel@example.in',
 linkedin: 'linkedin.com/in/priyapatel',
 skills: ['Vue.js', 'Python', 'Django', 'AWS'],
 brief: 'Full stack developer specializing in Python backends and modern JavaScript frameworks. Passionate about cloud architecture and CI/CD pipelines.',
 selected: false,
 },
 {
 id: 3,
 name: 'Aditya Gupta',
 designation: 'UI/UX Developer',
 company: 'Creative Digital',
 experience: '4 Years',
 location: 'Pune, India',
 email: 'aditya.gupta@example.in',
 linkedin: 'linkedin.com/in/adityagupta',
 skills: ['Figma', 'React', 'CSS/SCSS', 'Animation'],
 brief: 'Bridging the gap between design and engineering. Strong eye for aesthetics combined with deep technical knowledge of browser rendering and CSS.',
 selected: false,
 },
 {
 id: 4,
 name: 'Kavita Reddy',
 designation: 'Backend Software Engineer',
 company: 'Fintech Systems',
 experience: '6 Years',
 location: 'Hyderabad, India',
 email: 'kavita.reddy@example.in',
 linkedin: 'linkedin.com/in/kavitareddy',
 skills: ['Go', 'PostgreSQL', 'Docker', 'Kubernetes'],
 brief: 'Backend specialist with deep experience in designing high-throughput microservices for financial applications. Focuses heavily on reliability and scalability.',
 selected: false,
 },
 {
 id: 5,
 name: 'Vikram Singh',
 designation: 'React Developer',
 company: 'Startup Hub',
 experience: '3 Years',
 location: 'Delhi, India',
 email: 'vikram.singh@example.in',
 linkedin: 'linkedin.com/in/vikramsingh',
 skills: ['React', 'Redux', 'JavaScript', 'HTML5'],
 brief: 'Frontend focused developer passionate about building accessible and fast web applications. Experienced in working within fast-paced agile startup environments.',
 selected: false,
 },
 {
 id: 6,
 name: 'Sneha Desai',
 designation: 'Senior Staff Engineer',
 company: 'Global Enterprises',
 experience: '12 Years',
 location: 'Chennai, India',
 email: 'sneha.desai@example.in',
 linkedin: 'linkedin.com/in/snehadesai',
 skills: ['System Design', 'Java', 'Spring Boot', 'AWS'],
 brief: 'Engineering leader capable of driving complex technical initiatives across multiple teams. Mentors junior developers and establishes engineering best practices.',
 selected: false,
 },
 {
 id: 7,
 name: 'Rohan Joshi',
 designation: 'Frontend Web Developer',
 company: 'E-commerce Plus',
 experience: '2 Years',
 location: 'Ahmedabad, India',
 email: 'rohan.joshi@example.in',
 linkedin: 'linkedin.com/in/rohanjoshi',
 skills: ['Vue.js', 'Nuxt.js', 'Tailwind', 'REST APIs'],
 brief: 'Enthusiastic web developer with a keen eye for detail. Delivered multiple responsive and performant e-commerce storefronts increasing user engagement.',
 selected: false,
 }
 ]);

 const handleFileUpload = (e) => {
 const files = Array.from(e.target.files);
 const newFiles = files.map(file => ({
 name: file.name,
 size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
 type: file.type
 }));
 setUploadedFiles([...uploadedFiles, ...newFiles]);
 };

 const removeFile = (index) => {
 setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
 };

 const toggleCandidate = (id) => {
 setCandidates(candidates.map(c => 
 c.id === id ? { ...c, selected: !c.selected } : c
 ));
 };

 const handleSearch = () => {
 setIsSearching(true);
 setHasSearched(true);
 setCurrentPage(1);
 // Simulate a network request
 setTimeout(() => {
 setIsSearching(false);
 }, 1200);
 };

 const handleClearSearch = () => {
 setSearchParams({
 location: '',
 minExp: '',
 maxExp: '',
 prefCompany: '',
 exclCompany: ''
 });
 setHasSearched(false);
 setCurrentPage(1);
 };

 const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);
 const paginatedCandidates = candidates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

 return (
 <div className="p-6 space-y-8 animate-fade-in flex flex-col min-h-[calc(100vh-100px)] relative">
 <div className="flex-1 space-y-8">
 
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
 <div>
 <h2 className="text-[20px] font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 Knowledge Base (Candidate Sourcing)
 </h2>
 <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
 Upload documents or search the knowledge base to attach relevant candidates to this job.
 </p>
 </div>
 <div>
 {isEditing ? (
 <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm">
 <Save size={14} /> Save
 </button>
 ) : (
 <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm">
 <Edit3 size={14} /> Edit
 </button>
 )}
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
 {/* Left Column: Upload & Search Filters */}
 <div className="col-span-1 lg:col-span-4 space-y-6">
 
 {/* File Upload Section */}
 <div className="bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-4 flex items-center gap-2">
 <UploadCloud size={18} className="text-[#1890FF]" />
 Upload Documents
 </h3>
 
 {isEditing && (
 <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
 <input 
 type="file" 
 multiple 
 accept=".pdf,.doc,.docx,.txt"
 onChange={handleFileUpload}
 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
 />
 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
 <UploadCloud size={24} />
 </div>
 <p className="text-sm font-bold text-[#212b36] dark:text-white">Click or drag files to upload</p>
 <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOCX, TXT</p>
 </div>
 )}

 {uploadedFiles.length > 0 && (
 <div className="mt-4 space-y-2">
 {uploadedFiles.map((file, idx) => (
 <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a222c] border border-gray-100 dark:border-gray-800 rounded-lg">
 <div className="flex items-center gap-3 overflow-hidden">
 <FileText size={16} className="text-[#00A76F] shrink-0" />
 <div className="min-w-0">
 <p className="text-sm font-semibold text-[#212b36] dark:text-white truncate">{file.name}</p>
 <p className="text-xs text-gray-500">{file.size}</p>
 </div>
 </div>
 {isEditing && (
 <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
 <X size={16} />
 </button>
 )}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Search Panel */}
 <div className="bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
 <div className="flex items-center justify-between mb-5">
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Filter size={18} className="text-[#8E33FF]" />
 Search Parameters
 </h3>
 {isEditing && (
 <button 
 onClick={handleClearSearch}
 className="text-[11px] font-bold text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
 >
 Clear All
 </button>
 )}
 </div>

 <div className={`space-y-4 ${!isEditing ? 'pointer-events-none opacity-60' : ''}`}>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-gray-500">Location</label>
 <div className="relative">
 <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
 <input 
 type="text" 
 value={searchParams.location}
 onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
 placeholder="City, Country" 
 className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#1890FF] transition-colors" 
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-gray-500">Min Experience</label>
 <div className="relative">
 <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
 <input 
 type="number" 
 value={searchParams.minExp}
 onChange={(e) => setSearchParams({...searchParams, minExp: e.target.value})}
 placeholder="Years" 
 className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#1890FF] transition-colors" 
 />
 </div>
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-gray-500">Max Experience</label>
 <div className="relative">
 <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
 <input 
 type="number" 
 value={searchParams.maxExp}
 onChange={(e) => setSearchParams({...searchParams, maxExp: e.target.value})}
 placeholder="Years" 
 className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#1890FF] transition-colors" 
 />
 </div>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-bold text-gray-500">Preferred Company</label>
 <div className="relative">
 <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
 <input 
 type="text" 
 value={searchParams.prefCompany}
 onChange={(e) => setSearchParams({...searchParams, prefCompany: e.target.value})}
 placeholder="e.g. Google, Microsoft" 
 className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#1890FF] transition-colors" 
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-bold text-gray-500">Exclude Companies</label>
 <div className="relative">
 <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
 <input 
 type="text" 
 value={searchParams.exclCompany}
 onChange={(e) => setSearchParams({...searchParams, exclCompany: e.target.value})}
 placeholder="e.g. Amazon" 
 className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#1890FF] transition-colors" 
 />
 </div>
 </div>

 <button 
 onClick={handleSearch}
 className="w-full py-3 mt-2 bg-[#212b36] hover:bg-[#161c24] dark:bg-white dark:hover:bg-gray-100 dark:text-[#212b36] text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
 disabled={isSearching || !isEditing}
 >
 {isSearching ? (
 <Loader2 size={16} className="animate-spin" />
 ) : (
 <Search size={16} />
 )}
 {isSearching ? 'Searching...' : 'Search Candidates'}
 </button>
 </div>
 </div>
 </div>

 {/* Right Column: Search Results */}
 <div className="col-span-1 lg:col-span-8">
 <div className="bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
 
 {!hasSearched ? (
 // Blank State / Initial State
 <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
 <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
 <Users size={32} className="text-gray-300 dark:text-gray-600" />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white mb-2">Search the Knowledge Base</h3>
 <p className="text-sm text-gray-500 max-w-sm">
 Enter your criteria in the search panel and click "Search Candidates" to find potential matches for this role.
 </p>
 </div>
 ) : isSearching ? (
 // Loading Skeleton State
 <div className="flex-1 p-6 space-y-4">
 {[1, 2, 3].map((skeleton) => (
 <div key={skeleton} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse bg-gray-50 dark:bg-gray-800/30">
 <div className="flex items-start gap-4">
 <div className="w-6 h-6 shrink-0 rounded-md bg-gray-200 dark:bg-gray-700" />
 <div className="flex-1 min-w-0 space-y-4">
 <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
 <div className="flex gap-2">
 <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
 <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
 </div>
 <div className="space-y-2">
 <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
 <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 // Results State
 <>
 <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between bg-gray-50 dark:bg-[#1a222c]/50">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 Search Results
 <span className="bg-[#1890FF]/10 text-[#1890FF] text-xs px-2.5 py-0.5 rounded-full">{candidates.length} Found</span>
 </h3>
 {isEditing && (
 <div className="flex gap-2">
 <button className="px-4 py-2 text-sm font-bold text-[#00A76F] bg-[#00A76F]/10 hover:bg-[#00A76F]/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
 <UserPlus size={16} />
 Add Selected
 </button>
 </div>
 )}
 </div>

 <div className="p-6 space-y-4">
 {paginatedCandidates.map((candidate) => (
 <div 
 key={candidate.id} 
 className={`p-5 rounded-2xl border transition-all duration-300 ${candidate.selected ? 'border-[#1890FF] bg-blue-50/30 dark:bg-[#1890FF]/5 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
 >
 <div className="flex items-start gap-4">
 {/* Customized Checkbox */}
 <div 
 onClick={() => isEditing && toggleCandidate(candidate.id)}
 className={`w-6 h-6 shrink-0 rounded-md border flex items-center justify-center transition-colors mt-1 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} ${candidate.selected ? 'bg-[#1890FF] border-[#1890FF] text-white' : 'border-gray-300 dark:border-gray-600 hover:border-[#1890FF]'}`}
 >
 {candidate.selected && <Check size={14} strokeWidth={3} />}
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
 <h4 className="text-lg font-bold text-[#212b36] dark:text-white">{candidate.name}</h4>
 <div className="flex flex-wrap gap-1.5">
 {candidate.skills.map(skill => (
 <span key={skill} className="px-2 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md">
 {skill}
 </span>
 ))}
 </div>
 </div>

 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-sm">
 <div className="flex items-center gap-1.5 text-[#212b36] dark:text-gray-200 font-semibold">
 <Briefcase size={14} className="text-gray-400" />
 {candidate.designation}
 </div>
 <div className="flex items-center gap-1.5 text-gray-500">
 <Building size={14} className="text-gray-400" />
 {candidate.company}
 </div>
 <div className="flex items-center gap-1.5 text-gray-500">
 <Clock size={14} className="text-gray-400" />
 {candidate.experience}
 </div>
 <div className="flex items-center gap-1.5 text-gray-500">
 <MapPin size={14} className="text-gray-400" />
 {candidate.location}
 </div>
 </div>

 <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pb-4">
 {candidate.brief}
 </p>

 <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
 <a 
 href={`mailto:${candidate.email}`} 
 onClick={e => e.stopPropagation()}
 className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[#1890FF] transition-colors group/link"
 >
 <Mail size={15} className="text-gray-400 group-hover/link:text-[#1890FF] transition-colors" />
 {candidate.email}
 </a>
 <a 
 href={`https://${candidate.linkedin}`} 
 target="_blank" 
 rel="noreferrer" 
 onClick={e => e.stopPropagation()}
 className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[#0077B5] transition-colors group/link"
 >
 <ExternalLink size={15} className="text-gray-400 group-hover/link:text-[#0077B5] transition-colors" />
 LinkedIn Profile
 </a>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Pagination Footer */}
 {totalPages > 1 && (
 <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between bg-white dark:bg-[#161c24]">
 <span className="text-sm text-gray-500">
 Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, candidates.length)} of {candidates.length} candidates
 </span>
 <div className="flex items-center gap-1">
 <button 
 disabled={currentPage === 1}
 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
 className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
 >
 <ChevronLeft size={16} />
 </button>
 
 {[...Array(totalPages)].map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrentPage(i + 1)}
 className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors cursor-pointer ${currentPage === i + 1 ? 'bg-[#1890FF] text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
 >
 {i + 1}
 </button>
 ))}
 
 <button 
 disabled={currentPage === totalPages}
 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
 className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
 >
 <ChevronRight size={16} />
 </button>
 </div>
 </div>
 )}
 </>
 )}
 </div>
 </div>

 </div>
 </div>

 {/* Footer Navigation */}
 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto bg-white dark:bg-[#161c24]/80 backdrop-blur-md sticky bottom-0 z-20 pb-2">
 <button 
 onClick={() => navigate('/dashboard/job-setup/description-skills', { state: { jobData } })}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Description
 </button>
 <div className="flex items-center gap-4">
 <button 
 onClick={() => navigate('/dashboard/jobs')}
 className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Save as Draft
 </button>
 <button 
 onClick={() => navigate('/dashboard/job-setup/hiring-team', { state: { jobData } })}
 className="px-6 py-3 text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer bg-[#1890FF] hover:bg-[#1890FF]/90 shadow-[0_8px_16px_rgba(24,144,255,0.24)]"
 >
 Save and Continue to 'Hiring Team'
 </button>
 </div>
 </div>
 </div>
 );
}
