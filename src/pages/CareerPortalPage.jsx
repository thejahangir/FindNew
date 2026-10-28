import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building, 
  Search, 
  X, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  Share2, 
  Check, 
  UploadCloud, 
  FileText, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Award, 
  Zap, 
  DollarSign, 
  SlidersHorizontal,
  RotateCcw,
  ArrowDown
} from 'lucide-react';
import { 
  COMPANY_INFO, 
  CAREER_JOBS, 
  DEPARTMENTS, 
  LOCATIONS, 
  EMPLOYMENT_TYPES, 
  WORK_MODES 
} from '../data/careerJobsData';
import CustomCheckbox from '../components/ui/CustomCheckbox';
import SearchableSelect from '../components/ui/SearchableSelect';

const ITEMS_PER_PAGE = 10;

// Department badge styling
const getDepartmentBadgeStyle = (dept) => {
  switch (dept) {
    case 'Engineering':
      return 'bg-blue-50 text-[#1890FF] dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'Product':
      return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    case 'Design':
      return 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800';
    case 'Data Science':
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    case 'Marketing':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'Sales':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'Customer Success':
      return 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800';
    case 'HR':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    case 'Finance':
      return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
};

export default function CareerPortalPage() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  // Navigation / View states
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [bookedJob, setBookedJob] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [copiedLinkToast, setCopiedLinkToast] = useState(false);

  // Search and Advanced Filters State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Application Form State
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    currentCompany: '',
    currentRole: '',
    totalExperience: '',
    noticePeriod: '30 Days',
    expectedSalary: '',
    workAuthorization: 'yes',
    requiresSponsorship: 'no',
    coverLetter: '',
    resumeFile: null,
    resumeFileName: '',
    resumeFileSize: '',
    agreedToPrivacy: false
  });
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Slot Booking State
  const [selectedSlotDate, setSelectedSlotDate] = useState('2026-10-27');
  const [selectedSlotTime, setSelectedSlotTime] = useState('11:00 AM');
  const [selectedTimezone, setSelectedTimezone] = useState('IST (UTC+5:30)');
  const [isSlotConfirmed, setIsSlotConfirmed] = useState(false);

  // Filter Dropdown Options for SearchableSelect
  const departmentOptions = useMemo(() => {
    return DEPARTMENTS.map(dept => ({
      value: dept,
      label: dept === 'All' ? 'All Departments' : dept
    }));
  }, []);

  const locationOptions = useMemo(() => {
    return LOCATIONS.map(loc => ({
      value: loc,
      label: loc === 'All' ? 'All Locations' : loc
    }));
  }, []);

  const employmentTypeOptions = useMemo(() => {
    return EMPLOYMENT_TYPES.map(type => ({
      value: type,
      label: type === 'All' ? 'All Employment Types' : type
    }));
  }, []);

  const workModeOptions = useMemo(() => {
    return WORK_MODES.map(mode => ({
      value: mode,
      label: mode === 'All' ? 'All Work Modes' : mode
    }));
  }, []);

  const noticePeriodOptions = useMemo(() => [
    { value: 'Immediate', label: 'Immediate (0 days)' },
    { value: '15 Days', label: '15 Days' },
    { value: '30 Days', label: '30 Days' },
    { value: '60 Days', label: '60 Days' },
    { value: '90 Days', label: '90 Days' }
  ], []);

  const timezoneOptions = useMemo(() => [
    { value: 'IST (UTC+5:30)', label: 'India (IST - UTC+5:30)' },
    { value: 'EST (UTC-5:00)', label: 'New York (EST - UTC-5:00)' },
    { value: 'PST (UTC-8:00)', label: 'San Francisco (PST - UTC-8:00)' },
    { value: 'GMT (UTC+0:00)', label: 'London (GMT - UTC+0:00)' },
    { value: 'CET (UTC+1:00)', label: 'Berlin (CET - UTC+1:00)' }
  ], []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedDepartment, selectedLocation, selectedEmploymentType, selectedWorkMode]);

  // Scroll to top on page or view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedJob]);

  // Filter Logic
  const filteredJobs = useMemo(() => {
    return CAREER_JOBS.filter(job => {
      // Keyword match (title, skills, overview, dept, loc)
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesOverview = job.overview.toLowerCase().includes(query);
        const matchesSkills = job.skills.some(skill => skill.toLowerCase().includes(query));
        const matchesDept = job.department.toLowerCase().includes(query);
        const matchesLoc = job.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOverview && !matchesSkills && !matchesDept && !matchesLoc) {
          return false;
        }
      }

      // Department filter
      if (selectedDepartment !== 'All' && job.department !== selectedDepartment) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All') {
        if (selectedLocation === 'Remote') {
          if (job.workMode !== 'Remote' && !job.location.toLowerCase().includes('remote')) {
            return false;
          }
        } else if (!job.location.includes(selectedLocation.split(',')[0])) {
          return false;
        }
      }

      // Employment Type filter
      if (selectedEmploymentType !== 'All' && job.employmentType !== selectedEmploymentType) {
        return false;
      }

      // Work Mode filter
      if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) {
        return false;
      }

      return true;
    });
  }, [searchKeyword, selectedDepartment, selectedLocation, selectedEmploymentType, selectedWorkMode]);

  // Pagination calculation
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const advancedFiltersCount = 
    (selectedDepartment !== 'All' ? 1 : 0) +
    (selectedLocation !== 'All' ? 1 : 0) +
    (selectedEmploymentType !== 'All' ? 1 : 0) +
    (selectedWorkMode !== 'All' ? 1 : 0);

  const activeFilterCount = (searchKeyword.trim() ? 1 : 0) + advancedFiltersCount;

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedDepartment('All');
    setSelectedLocation('All');
    setSelectedEmploymentType('All');
    setSelectedWorkMode('All');
    setCurrentPage(1);
  };

  const handleResetAdvancedFilters = () => {
    setSelectedDepartment('All');
    setSelectedLocation('All');
    setSelectedEmploymentType('All');
    setSelectedWorkMode('All');
    setCurrentPage(1);
  };

  // Open Apply modal
  const handleOpenApplyModal = (job) => {
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  // Handle Application submission (no validation)
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setIsSubmittingApp(true);
    setTimeout(() => {
      setIsSubmittingApp(false);
      setIsApplyModalOpen(false);
      setCandidateData({ ...applicationForm });
      setBookedJob(jobToApply);
      // Reset form
      setApplicationForm({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedIn: '',
        portfolio: '',
        currentCompany: '',
        currentRole: '',
        totalExperience: '',
        noticePeriod: '30 Days',
        expectedSalary: '',
        workAuthorization: 'yes',
        requiresSponsorship: 'no',
        coverLetter: '',
        resumeFile: null,
        resumeFileName: '',
        resumeFileSize: '',
        agreedToPrivacy: false
      });
      // Open interview slot booking modal
      setIsSlotConfirmed(false);
      setIsSlotModalOpen(true);
    }, 900);
  };

  // Mock Resume Upload
  const handleSimulateResumeUpload = (fileName = 'Alexander_Brooks_CV_2026.pdf') => {
    setApplicationForm(prev => ({
      ...prev,
      resumeFileName: fileName,
      resumeFileSize: '2.4 MB'
    }));
  };

  // Share link handler
  const handleShareJob = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLinkToast(true);
    setTimeout(() => setCopiedLinkToast(false), 2500);
  };

  // Available dates for interview slot picker
  const availableDates = [
    { id: '2026-10-27', dayName: 'Tue', dateNum: '27', month: 'Oct', label: 'Tomorrow' },
    { id: '2026-10-28', dayName: 'Wed', dateNum: '28', month: 'Oct', label: 'Fastest' },
    { id: '2026-10-29', dayName: 'Thu', dateNum: '29', month: 'Oct', label: 'Available' },
    { id: '2026-10-30', dayName: 'Fri', dateNum: '30', month: 'Oct', label: 'Available' },
    { id: '2026-11-02', dayName: 'Mon', dateNum: '02', month: 'Nov', label: 'Available' },
    { id: '2026-11-03', dayName: 'Tue', dateNum: '03', month: 'Nov', label: 'Available' },
    { id: '2026-11-04', dayName: 'Wed', dateNum: '04', month: 'Nov', label: 'Available' },
  ];

  const timeSlots = {
    morning: [
      '09:00 AM',
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
      '12:00 PM',
      '12:30 PM'
    ],
    afternoon: [
      '01:00 PM',
      '01:30 PM',
      '02:00 PM',
      '02:30 PM',
      '03:00 PM',
      '03:30 PM',
      '04:00 PM',
      '04:30 PM'
    ],
    evening: [
      '05:00 PM',
      '05:30 PM',
      '06:00 PM',
      '06:30 PM',
      '07:00 PM',
      '07:30 PM',
      '08:00 PM',
      '08:30 PM'
    ]
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#1E293B] dark:text-[#E2E8F0] font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {copiedLinkToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] dark:bg-white text-white dark:text-[#1E293B] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-bounce">
          <CheckCircle2 size={18} className="text-[#1890FF]" />
          Job link copied to clipboard!
        </div>
      )}

      {/* Fluid Website Navigation Header */}
      <header className={`sticky ${isDashboard ? 'top-16' : 'top-0'} z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 w-full`}>
        <div className="w-full px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedJob(null)}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1890FF] to-[#096dd9] flex items-center justify-center text-white font-bold shadow-lg shadow-[#1890FF]/25 group-hover:scale-105 transition-transform cursor-pointer">
                <Sparkles size={22} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white block">
                  {COMPANY_INFO.name}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1890FF] dark:text-[#40a9ff]">
                  Careers & Culture
                </span>
              </div>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <button 
              onClick={() => setSelectedJob(null)} 
              className={`cursor-pointer hover:text-[#1890FF] transition-colors ${!selectedJob ? 'text-[#1890FF] font-semibold' : ''}`}
            >
              Open Roles ({CAREER_JOBS.length})
            </button>
            <a href="#benefits" className="cursor-pointer hover:text-[#1890FF] transition-colors">Benefits & Perks</a>
            <a href="#values" className="cursor-pointer hover:text-[#1890FF] transition-colors">Our Culture</a>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-[#1890FF] animate-pulse"></span>
              Actively Hiring
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSelectedJob(null);
                handleResetFilters();
              }}
              className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-sm shadow-[#1890FF]/25 rounded-xl transition-all"
            >
              View All Openings
            </button>
          </div>
        </div>
      </header>

      {/* Main Fluid Content Area */}
      {!selectedJob ? (
        /* ==================== CAREER PORTAL LANDING & JOB LIST (FLUID) ==================== */
        <main className="w-full px-4 sm:px-6 lg:px-10 py-10">
          
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] text-white p-8 sm:p-12 lg:p-16 mb-10 border border-slate-800 shadow-xl">
            {/* Subtle Ambient Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-[#1890FF]/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Right-Side Hero Image merging seamlessly with the background on the left */}
            <div 
              className="absolute inset-y-0 right-0 w-full sm:w-3/5 lg:w-[56%] pointer-events-none select-none overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 28%, black 65%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 28%, black 65%)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1400"
                alt="Team working together"
                className="w-full h-full object-cover object-center opacity-70 sm:opacity-85 lg:opacity-95"
              />
              {/* Smooth horizontal blend: fully opaque on left before hero text, transparent on right */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/70 via-25% to-transparent"></div>
              {/* Subtle bottom edge blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-2xl lg:max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>We're Hiring • {CAREER_JOBS.length} Open Roles</span>
              </div>

              {/* Hero Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                Build the future of intelligence with us.
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed font-normal">
                {COMPANY_INFO.tagline} Join our team across San Francisco, London, and remote.
              </p>

              {/* Primary Action Button */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('search-and-jobs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 hover:-translate-y-0.5 transition-all"
                >
                  <span>View Open Roles</span>
                  <ArrowDown size={15} />
                </button>

                <a
                  href="#values"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <span>Our Culture</span>
                  <ChevronRight size={15} />
                </a>
              </div>

              {/* Minimum Company Data */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/10 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">650+</div>
                  <div className="text-xs text-slate-400 mt-1">Team Members</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">14 Hubs</div>
                  <div className="text-xs text-slate-400 mt-1">Global & Remote</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Series D</div>
                  <div className="text-xs text-slate-400 mt-1">$7.3B Raised</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#1890FF] tracking-tight">4.9 ★</div>
                  <div className="text-xs text-slate-400 mt-1">Glassdoor Rating</div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== SEARCH PANEL ==================== */}
          <section id="search-and-jobs" className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 mb-10 transition-all scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Search size={22} className="text-[#1890FF]" />
                  Search Open Positions
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Discover roles across Engineering, Product, Design, Sales, and Leadership.
                </p>
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1890FF] hover:bg-[#096dd9] px-3.5 py-1.5 rounded-xl shadow-sm shadow-[#1890FF]/25 transition-all w-fit"
                >
                  <X size={14} />
                  Reset search ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Single-line Search Bar with Search Button & Advance Search Toggle */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Job Title / Keywords
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Fluid Extended Search Input */}
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Search by job title, skills, keywords (e.g. AI, React, Kubernetes, Product, Senior)..."
                      className="w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all"
                    />
                    {searchKeyword && (
                      <button 
                        type="button"
                        onClick={() => setSearchKeyword('')}
                        className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                        title="Clear input"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Search Button */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className="cursor-pointer px-7 py-3 rounded-xl text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 hover:shadow-lg hover:shadow-[#1890FF]/30 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <Search size={16} />
                    Search
                  </button>

                  {/* Advance Search Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsAdvancedSearchOpen(prev => !prev)}
                    className={`cursor-pointer px-5 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 shrink-0 ${
                      isAdvancedSearchOpen || advancedFiltersCount > 0
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] dark:text-blue-300 border-[#1890FF] ring-2 ring-[#1890FF]/20'
                        : 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <SlidersHorizontal size={16} />
                    <span>Advance Search</span>
                    {advancedFiltersCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#1890FF] text-white text-[11px] font-bold flex items-center justify-center">
                        {advancedFiltersCount}
                      </span>
                    )}
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${isAdvancedSearchOpen ? 'rotate-180 text-[#1890FF]' : 'text-gray-400'}`} 
                    />
                  </button>
                </div>
              </div>

              {/* Expandable Advance Search Panel (Smooth Animation) */}
              <div 
                className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isAdvancedSearchOpen 
                    ? 'grid-rows-[1fr] opacity-100 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800' 
                    : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0 border-transparent pointer-events-none'
                }`}
              >
                <div className={isAdvancedSearchOpen ? 'overflow-visible' : 'overflow-hidden'}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <SlidersHorizontal size={14} className="text-[#1890FF]" />
                      Advanced Search Parameters
                    </span>
                    {advancedFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={handleResetAdvancedFilters}
                        className="cursor-pointer text-xs font-semibold text-[#1890FF] hover:underline flex items-center gap-1"
                      >
                        <RotateCcw size={12} />
                        Clear advanced filters
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Department */}
                    <div className="relative z-30">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Department
                      </label>
                      <SearchableSelect
                        options={departmentOptions}
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        placeholder="All Departments"
                        showSearch={true}
                        searchPlaceholder="Search departments..."
                        size="default"
                      />
                    </div>

                    {/* 2. Location */}
                    <div className="relative z-20">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Location
                      </label>
                      <SearchableSelect
                        options={locationOptions}
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                        placeholder="All Locations"
                        showSearch={true}
                        searchPlaceholder="Search locations..."
                        size="default"
                      />
                    </div>

                    {/* 3. Work Mode */}
                    <div className="relative z-10">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Work Mode
                      </label>
                      <SearchableSelect
                        options={workModeOptions}
                        value={selectedWorkMode}
                        onChange={setSelectedWorkMode}
                        placeholder="All Work Modes"
                        showSearch={false}
                        size="default"
                      />
                    </div>

                    {/* 4. Employment Type */}
                    <div className="relative z-10">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Employment Type
                      </label>
                      <SearchableSelect
                        options={employmentTypeOptions}
                        value={selectedEmploymentType}
                        onChange={setSelectedEmploymentType}
                        placeholder="All Employment Types"
                        showSearch={false}
                        size="default"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== JOB RESULTS HEADER ==================== */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Available Openings
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Showing {totalJobs > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, totalJobs)} of {totalJobs} positions
              </p>
            </div>
            
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800/50">
              {totalJobs} roles open
            </span>
          </div>

          {/* ==================== FLUID JOB CARDS LIST ==================== */}
          {displayedJobs.length > 0 ? (
            <div className="space-y-4 mb-10">
              {displayedJobs.map(job => (
                <div 
                  key={job.id}
                  className="group bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-7 border border-gray-200 dark:border-gray-800/80 hover:border-[#1890FF]/50 dark:hover:border-[#1890FF]/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    {/* Top Row: Department & Featured */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDepartmentBadgeStyle(job.department)}`}>
                        {job.department}
                      </span>
                      {job.featured && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <Sparkles size={12} className="text-amber-500" />
                          Featured Role
                        </span>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-400 ml-auto lg:ml-0">
                        {job.postedDate}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h4 
                      onClick={() => setSelectedJob(job)}
                      className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#1890FF] cursor-pointer transition-colors mb-2"
                    >
                      {job.title}
                    </h4>

                    {/* Quick Meta Pills */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={15} className="text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building size={15} className="text-gray-400" />
                        <span className="font-semibold text-[#1890FF] dark:text-[#40a9ff]">{job.workMode}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={15} className="text-gray-400" />
                        <span>{job.employmentType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award size={15} className="text-gray-400" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                        <DollarSign size={15} className="text-[#1890FF]" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {job.overview}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {job.skills.map(skill => (
                        <span 
                          key={skill} 
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center lg:flex-col lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-800 shrink-0">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="cursor-pointer px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1890FF] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 transition-all flex items-center gap-1.5"
                    >
                      View Details
                      <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenApplyModal(job)}
                      className="cursor-pointer px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 hover:shadow-lg hover:shadow-[#1890FF]/30 transition-all flex items-center gap-1.5"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800 mb-10">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={28} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No matching open positions found
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Try broadening your search keywords or clearing some of the filters to discover more open roles.
              </p>
              <button
                onClick={handleResetFilters}
                className="cursor-pointer px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* ==================== PAGINATION CONTROLS ==================== */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-sm mb-16">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Showing <strong className="text-gray-900 dark:text-white">{startIndex + 1}</strong> to <strong className="text-gray-900 dark:text-white">{Math.min(startIndex + ITEMS_PER_PAGE, totalJobs)}</strong> of <strong className="text-gray-900 dark:text-white">{totalJobs}</strong> jobs
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="cursor-pointer px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-[#1890FF] dark:hover:bg-gray-700 transition-all flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`cursor-pointer w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#1890FF] text-white shadow-md shadow-[#1890FF]/25'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-[#1890FF] dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="cursor-pointer px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-[#1890FF] dark:hover:bg-gray-700 transition-all flex items-center gap-1"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ==================== CULTURE & VALUES SECTION ==================== */}
          <section id="values" className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1890FF]">Life at {COMPANY_INFO.name}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
                Built on Craft, Transparency, and Empathy
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                We believe exceptional software is built by autonomous teams with deep ownership and high trust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] dark:text-blue-400 flex items-center justify-center mb-5">
                  <Zap size={24} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">First-Principles Thinking</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  We question conventional dogma and solve tough enterprise engineering problems from foundational fundamentals.
                </p>
              </div>

              <div className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <Heart size={24} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Global Inclusion & Wellness</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Our team spans 14 countries. We foster an environment where every voice is celebrated, with monthly global wellness disconnect days.
                </p>
              </div>

              <div className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                  <Award size={24} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Unbounded Ownership</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  From day one, you own outcomes, lead initiatives, and share directly in the company's long-term enterprise value through equity.
                </p>
              </div>
            </div>
          </section>

          {/* ==================== BENEFITS GRID ==================== */}
          <section id="benefits" className="bg-gradient-to-br from-gray-900 to-[#111827] text-white rounded-3xl p-8 sm:p-12 mb-16">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#40a9ff]">Total Rewards & Support</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                We invest deeply in our people
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Every role at {COMPANY_INFO.name} comes with comprehensive benefits designed to support you inside and outside work.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMPANY_INFO.benefitsSummary.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <CheckCircle2 size={18} className="text-[#1890FF] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-200 font-medium">{b}</span>
                </div>
              ))}
            </div>
          </section>

        </main>
      ) : (
        /* ==================== JOB DETAILS DOSSIER VIEW (FLUID) ==================== */
        <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
          
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <button
              onClick={() => setSelectedJob(null)}
              className="cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#1890FF] dark:hover:text-[#1890FF] px-4 py-2 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 transition-all shadow-sm"
            >
              <ArrowLeft size={16} />
              Back to all open positions
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleShareJob(selectedJob)}
                className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 hover:text-[#1890FF] hover:border-[#1890FF]/40 transition-all"
                title="Share this job link"
              >
                <Share2 size={14} />
                Share
              </button>
              
              <button
                onClick={() => handleOpenApplyModal(selectedJob)}
                className="cursor-pointer px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 hover:shadow-lg hover:shadow-[#1890FF]/30 transition-all"
              >
                Apply For this Job
              </button>
            </div>
          </div>

          {/* Job Details Header Banner */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDepartmentBadgeStyle(selectedJob.department)}`}>
                {selectedJob.department}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {selectedJob.workMode}
              </span>
              <span className="text-xs text-gray-400">
                Posted {selectedJob.postedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              {selectedJob.title}
            </h1>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-medium text-gray-400 block mb-1">Location</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#1890FF]" />
                  {selectedJob.location}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 block mb-1">Employment Type</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Clock size={15} className="text-[#1890FF]" />
                  {selectedJob.employmentType}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 block mb-1">Experience Required</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Award size={15} className="text-[#1890FF]" />
                  {selectedJob.experience}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 block mb-1">Salary & Equity</span>
                <span className="text-sm font-semibold text-[#1890FF] dark:text-blue-400 flex items-center gap-1.5">
                  <DollarSign size={15} className="text-[#1890FF]" />
                  {selectedJob.salary}
                </span>
              </div>
            </div>
          </div>

          {/* Two-Column Layout: Job Dossier vs Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 relative">
            
            {/* Left 2 Cols: Main Dossier Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Role Overview */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  The Mission & Overview
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedJob.overview}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  What You Will Do
                </h3>
                <ul className="space-y-3.5">
                  {selectedJob.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={13} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {resp}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Qualifications */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  What We Look For
                </h3>
                <ul className="space-y-3.5">
                  {selectedJob.qualifications.map((qual, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={13} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {qual}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nice to Have */}
              {selectedJob.niceToHave && selectedJob.niceToHave.length > 0 && (
                <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Bonus Points (Nice to Have)
                  </h3>
                  <ul className="space-y-3.5">
                    {selectedJob.niceToHave.map((bonus, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles size={12} />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {bonus}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hiring Timeline Process */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Our Transparent Interview Process
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
                  We respect your time. Here is the exact roadmap from application to offer:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-left">
                    <span className="text-xs font-bold text-[#1890FF] block mb-1">Stage 01</span>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Application Review</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Team reviews resume & profile within 48 hrs.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-left">
                    <span className="text-xs font-bold text-[#1890FF] block mb-1">Stage 02</span>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Recruiter Screen</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">30-min call on goals & culture alignment.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-left">
                    <span className="text-xs font-bold text-[#1890FF] block mb-1">Stage 03</span>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Technical Deep Dive</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Practical domain session with peers.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-left">
                    <span className="text-xs font-bold text-[#1890FF] block mb-1">Stage 04</span>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Executive Chat & Offer</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Meet department VP, offer presentation.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Quick Snapshot & Action Box (Fixed while scrolling) */}
            <div className="lg:col-span-1 relative">
              
              {/* Primary Sticky CTA Box */}
              <div className={`sticky ${isDashboard ? 'top-[152px]' : 'top-24'} z-20 bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[calc(100vh-10.5rem)] overflow-y-auto custom-scrollbar`}>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  Interested in this role?
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  Submit your application now. You'll be able to instantly select a screening interview slot directly on the next screen.
                </p>

                <button
                  onClick={() => handleOpenApplyModal(selectedJob)}
                  className="cursor-pointer w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-lg shadow-[#1890FF]/25 hover:shadow-xl hover:shadow-[#1890FF]/30 transition-all text-center mb-6"
                >
                  Apply For this Job
                </button>

                {/* Team Info */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Reporting Line</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedJob.hiringManager}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Team Size</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedJob.teamSize}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Target Tech Stack</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedJob.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Equal Opportunity Disclaimer */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 leading-relaxed flex items-start gap-2">
                  <ShieldCheck size={16} className="text-[#1890FF] shrink-0 mt-0.5" />
                  <span>
                    {COMPANY_INFO.name} is an Equal Opportunity Employer. We value diversity and do not discriminate based on race, religion, gender, sexual orientation, age, or disability.
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Floating Apply Bar on Dossier */}
          <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-[#111827] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl mb-12">
            <div>
              <h4 className="text-lg font-bold text-white">Ready to join our team?</h4>
              <p className="text-xs text-gray-400">Applications take only 3 minutes to complete.</p>
            </div>
            <button
              onClick={() => handleOpenApplyModal(selectedJob)}
              className="cursor-pointer px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 hover:shadow-lg hover:shadow-[#1890FF]/30 transition-all"
            >
              Apply For this Job
            </button>
          </div>

        </main>
      )}

      {/* ==================== APPLY FOR THIS JOB MODAL ==================== */}
      {isApplyModalOpen && jobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 my-8 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
              <div>
                <span className="text-xs font-bold text-[#1890FF] uppercase tracking-wider">Job Application</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Apply for {jobToApply.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {jobToApply.department} • {jobToApply.location} ({jobToApply.workMode})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="cursor-pointer w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitApplication} noValidate className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* Section 1: Candidate Basic Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">1. Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={applicationForm.fullName}
                      onChange={(e) => setApplicationForm({ ...applicationForm, fullName: e.target.value })}
                      placeholder="e.g. Alexander Brooks"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                      placeholder="alexander@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Current Location (City, Country)
                    </label>
                    <input
                      type="text"
                      value={applicationForm.location}
                      onChange={(e) => setApplicationForm({ ...applicationForm, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA or Bangalore, India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Resume / CV Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">2. Resume / Curriculum Vitae</h4>
                  <button
                    type="button"
                    onClick={() => handleSimulateResumeUpload()}
                    className="cursor-pointer text-[11px] font-semibold text-[#1890FF] hover:underline"
                  >
                    Quick Auto-Attach Sample CV
                  </button>
                </div>

                {!applicationForm.resumeFileName ? (
                  <div 
                    onClick={() => handleSimulateResumeUpload()}
                    className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all border-gray-300 dark:border-gray-700 hover:border-[#1890FF] bg-gray-50/50 dark:bg-gray-800/30"
                  >
                    <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Click to upload or drag and drop your Resume
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Supports PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#1890FF] dark:text-blue-400 flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {applicationForm.resumeFileName}
                          <CheckCircle2 size={14} className="text-[#1890FF]" />
                        </div>
                        <span className="text-[11px] text-gray-400">{applicationForm.resumeFileSize} • Uploaded successfully</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApplicationForm(prev => ({ ...prev, resumeFileName: '', resumeFileSize: '' }))}
                      className="cursor-pointer text-gray-400 hover:text-red-500 text-xs font-semibold px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Section 3: Professional Links & Experience */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">3. Professional Links & Background</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={applicationForm.linkedIn}
                      onChange={(e) => setApplicationForm({ ...applicationForm, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Portfolio / GitHub / Website URL
                    </label>
                    <input
                      type="url"
                      value={applicationForm.portfolio}
                      onChange={(e) => setApplicationForm({ ...applicationForm, portfolio: e.target.value })}
                      placeholder="https://github.com/username or portfolio"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Current Company
                    </label>
                    <input
                      type="text"
                      value={applicationForm.currentCompany}
                      onChange={(e) => setApplicationForm({ ...applicationForm, currentCompany: e.target.value })}
                      placeholder="e.g. Stripe, Snowflake, etc."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Total Years of Experience
                    </label>
                    <input
                      type="text"
                      value={applicationForm.totalExperience}
                      onChange={(e) => setApplicationForm({ ...applicationForm, totalExperience: e.target.value })}
                      placeholder="e.g. 6.5 years"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Availability & Compensation with Customized Notice Period Dropdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">4. Availability & Compensation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative z-20">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Notice Period / Earliest Start
                    </label>
                    <SearchableSelect
                      options={noticePeriodOptions}
                      value={applicationForm.noticePeriod}
                      onChange={(val) => setApplicationForm(prev => ({ ...prev, noticePeriod: val }))}
                      placeholder="Select notice period"
                      showSearch={false}
                      size="default"
                      placement="bottom"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Expected Annual Compensation
                    </label>
                    <input
                      type="text"
                      value={applicationForm.expectedSalary}
                      onChange={(e) => setApplicationForm({ ...applicationForm, expectedSalary: e.target.value })}
                      placeholder="e.g. $185,000 or ₹42,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Authorized to work in this location?
                    </span>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="workAuth"
                          checked={applicationForm.workAuthorization === 'yes'}
                          onChange={() => setApplicationForm({ ...applicationForm, workAuthorization: 'yes' })}
                          className="accent-[#1890FF] cursor-pointer"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="workAuth"
                          checked={applicationForm.workAuthorization === 'no'}
                          onChange={() => setApplicationForm({ ...applicationForm, workAuthorization: 'no' })}
                          className="accent-[#1890FF] cursor-pointer"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/30 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Require visa sponsorship?
                    </span>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="visa"
                          checked={applicationForm.requiresSponsorship === 'yes'}
                          onChange={() => setApplicationForm({ ...applicationForm, requiresSponsorship: 'yes' })}
                          className="accent-[#1890FF] cursor-pointer"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="visa"
                          checked={applicationForm.requiresSponsorship === 'no'}
                          onChange={() => setApplicationForm({ ...applicationForm, requiresSponsorship: 'no' })}
                          className="accent-[#1890FF] cursor-pointer"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Cover Note */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">5. Note to Hiring Team (Optional)</h4>
                <textarea
                  rows={3}
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  placeholder="Share a brief overview of relevant projects, achievements, or why you are excited to join Anthropic..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF]"
                ></textarea>
              </div>

              {/* Section 6: Privacy Consent */}
              <div className="pt-2">
                <div className="flex items-start gap-2.5">
                  <CustomCheckbox
                    checked={applicationForm.agreedToPrivacy}
                    onChange={(e) => setApplicationForm({ ...applicationForm, agreedToPrivacy: e.checked })}
                    id="privacy-check"
                  />
                  <label htmlFor="privacy-check" className="text-xs text-gray-600 dark:text-gray-300 leading-normal cursor-pointer select-none">
                    I acknowledge that my personal information will be processed for recruitment purposes at {COMPANY_INFO.name} in accordance with the <a href="#privacy" className="cursor-pointer text-[#1890FF] underline">Privacy Policy</a>.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="cursor-pointer px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApp}
                  className="cursor-pointer px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 hover:shadow-lg hover:shadow-[#1890FF]/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingApp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit & Book Interview Slot →</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================== INTERVIEW SLOT PICKER MODAL ==================== */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 my-8 overflow-hidden">
            
            {!isSlotConfirmed ? (
              /* Slot Selection Screen */
              <div className="p-6 sm:p-8">
                
                {/* Celebratory Banner */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1890FF] to-[#096dd9] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#1890FF]/25">
                    <Calendar size={28} />
                  </div>
                  <span className="text-xs font-bold text-[#1890FF] uppercase tracking-wider">Step 2: Instant Booking</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    Select Your Interview Slot
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                    Thanks for applying! Pick a 30-minute introductory recruiter screen for <strong className="text-gray-800 dark:text-gray-200">{bookedJob?.title}</strong>.
                  </p>
                </div>

                {/* Customized Timezone Selector using SearchableSelect */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl mb-6 border border-gray-100 dark:border-gray-700/50 relative z-20">
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Globe size={14} className="text-[#1890FF]" />
                    Select Timezone
                  </label>
                  <SearchableSelect
                    options={timezoneOptions}
                    value={selectedTimezone}
                    onChange={setSelectedTimezone}
                    placeholder="Select Timezone"
                    showSearch={false}
                    size="sm"
                    placement="bottom"
                  />
                </div>

                {/* Date Picker Grid */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Available Dates
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {availableDates.map(d => {
                      const isSelected = selectedSlotDate === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setSelectedSlotDate(d.id)}
                          className={`cursor-pointer p-2.5 rounded-2xl text-center border transition-all ${
                            isSelected
                              ? 'bg-[#1890FF] text-white border-[#1890FF] shadow-md shadow-[#1890FF]/25 scale-105'
                              : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#1890FF]/40'
                          }`}
                        >
                          <span className={`block text-[10px] font-semibold uppercase ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                            {d.dayName}
                          </span>
                          <span className="block text-base font-extrabold my-0.5">
                            {d.dateNum}
                          </span>
                          <span className={`block text-[9px] font-medium ${isSelected ? 'text-white/90' : 'text-[#1890FF] dark:text-[#40a9ff]'}`}>
                            {d.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots Section */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Available Slots ({selectedTimezone.split(' ')[0]})
                  </label>
                  
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Morning</span>
                        <span className="text-[10px] text-gray-400 font-medium">{timeSlots.morning.length} slots</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {timeSlots.morning.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlotTime(slot)}
                            className={`cursor-pointer py-1.5 px-1 rounded-lg text-[11px] font-semibold border transition-all text-center whitespace-nowrap ${
                              selectedSlotTime === slot
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] dark:text-blue-300 border-[#1890FF] ring-2 ring-[#1890FF]/20 shadow-sm font-bold'
                                : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:border-[#1890FF]/40'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Afternoon</span>
                        <span className="text-[10px] text-gray-400 font-medium">{timeSlots.afternoon.length} slots</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {timeSlots.afternoon.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlotTime(slot)}
                            className={`cursor-pointer py-1.5 px-1 rounded-lg text-[11px] font-semibold border transition-all text-center whitespace-nowrap ${
                              selectedSlotTime === slot
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] dark:text-blue-300 border-[#1890FF] ring-2 ring-[#1890FF]/20 shadow-sm font-bold'
                                : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:border-[#1890FF]/40'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Evening</span>
                        <span className="text-[10px] text-gray-400 font-medium">{timeSlots.evening.length} slots</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {timeSlots.evening.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlotTime(slot)}
                            className={`cursor-pointer py-1.5 px-1 rounded-lg text-[11px] font-semibold border transition-all text-center whitespace-nowrap ${
                              selectedSlotTime === slot
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1890FF] dark:text-blue-300 border-[#1890FF] ring-2 ring-[#1890FF]/20 shadow-sm font-bold'
                                : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:border-[#1890FF]/40'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recruiter Details Callout */}
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#1890FF] text-white font-bold flex items-center justify-center shrink-0">
                    SJ
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">Sarah Jenkins</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Senior Technical Talent Partner • 30-min Google Meet</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsSlotModalOpen(false)}
                    className="cursor-pointer px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Skip for Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSlotConfirmed(true)}
                    className="cursor-pointer px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 hover:shadow-lg hover:shadow-[#1890FF]/30 transition-all"
                  >
                    Confirm Interview Slot ({selectedSlotTime}) →
                  </button>
                </div>

              </div>
            ) : (
              /* Confirmation Screen */
              <div className="p-6 sm:p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#1890FF] dark:text-[#40a9ff] flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                
                <span className="text-xs font-bold text-[#1890FF] uppercase tracking-wider">Interview Confirmed!</span>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 mb-2">
                  You are all set for {bookedJob?.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                  A calendar invite and meeting link have been dispatched to {candidateData?.email || 'your email'}.
                </p>

                {/* Calendar Card Preview */}
                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-5 border border-gray-200 dark:border-gray-700/60 text-left mb-6 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 pb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Event</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{COMPANY_INFO.name} Screening</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 pb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Date & Time</span>
                    <span className="text-xs font-bold text-[#1890FF] dark:text-blue-400">
                      {selectedSlotDate} at {selectedSlotTime} ({selectedTimezone.split(' ')[0]})
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 pb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Platform</span>
                    <span className="text-xs font-semibold text-[#1890FF] dark:text-blue-400 flex items-center gap-1">
                      <ExternalLink size={12} /> Google Meet (`meet.google.com/anthropic-rec`)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Interviewer</span>
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Sarah Jenkins (Anthropic Talent)</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlotModalOpen(false);
                      setSelectedJob(null);
                    }}
                    className="cursor-pointer w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#096dd9] shadow-md shadow-[#1890FF]/25 hover:shadow-lg transition-all"
                  >
                    Browse More Open Roles
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSlotModalOpen(false)}
                    className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Done
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Fluid Footer */}
      <footer className="w-full bg-white dark:bg-[#0D1117] border-t border-gray-200 dark:border-gray-800/80 py-12 transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1890FF] to-[#096dd9] flex items-center justify-center text-white font-bold">
                <Sparkles size={16} />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {COMPANY_INFO.name}
              </span>
              <span className="text-xs text-gray-400">| Careers Portal</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
              <button onClick={() => setSelectedJob(null)} className="cursor-pointer hover:text-[#1890FF] transition-colors">Open Positions</button>
              <a href="#benefits" className="cursor-pointer hover:text-[#1890FF] transition-colors">Benefits</a>
              <a href="#values" className="cursor-pointer hover:text-[#1890FF] transition-colors">Culture</a>
              <a href="#privacy" className="cursor-pointer hover:text-[#1890FF] transition-colors">Privacy Policy</a>
              <a href="#terms" className="cursor-pointer hover:text-[#1890FF] transition-colors">Terms of Service</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-500 dark:text-gray-400">
            <div>
              © 2026 {COMPANY_INFO.name}. All rights reserved. Equal Opportunity Employer.
            </div>

            {/* MANDATORY FOOTER NOTE: "Powered by FindNeo | Privacy Policy" */}
            <div className="font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <span>Powered by FindNeo</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a href="#privacy" className="cursor-pointer hover:text-[#1890FF] transition-colors underline">Privacy Policy</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
