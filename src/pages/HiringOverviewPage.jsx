import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Bookmark, 
  Check, 
  Building2, 
  MapPin, 
  UserCheck, 
  ArrowRight, 
  ClipboardList, 
  Download,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';

export default function HiringOverviewPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Hiring', 'Analytics'];

  // --- FILTER STATES ---
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedRecruiter, setSelectedRecruiter] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('6m'); // '3m' | '6m' | '12m'

  // --- TOAST NOTIFICATION ---
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // --- FILTER OPTIONS ---
  const teamOptions = [
    { label: 'All Teams', value: 'All' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Product & Design', value: 'Product' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Sales & GTM', value: 'Sales' },
    { label: 'Data Science & AI', value: 'Data' },
    { label: 'People & HR', value: 'HR' }
  ];

  const roleOptions = [
    { label: 'All Roles', value: 'All' },
    { label: 'Senior AI Research Scientist', value: 'AI Scientist' },
    { label: 'Full Stack Engineer', value: 'Full Stack' },
    { label: 'Cloud Infrastructure Architect', value: 'Cloud Architect' },
    { label: 'Product Design Lead', value: 'Design Lead' },
    { label: 'DevOps Engineer', value: 'DevOps' }
  ];

  const locationOptions = [
    { label: 'All Locations', value: 'All' },
    { label: 'Bangalore, India', value: 'Bangalore' },
    { label: 'San Francisco, CA', value: 'San Francisco' },
    { label: 'New York, NY', value: 'New York' },
    { label: 'London, UK', value: 'London' },
    { label: 'Remote', value: 'Remote' }
  ];

  const recruiterOptions = [
    { label: 'All Recruiters', value: 'All' },
    { label: 'Priya Sharma', value: 'Priya' },
    { label: 'Amit Kumar', value: 'Amit' },
    { label: 'Sarah Jenkins', value: 'Sarah' },
    { label: 'David Chen', value: 'David' }
  ];

  // Check if any filter is active
  const hasActiveFilters = selectedTeam !== 'All' || selectedRole !== 'All' || selectedLocation !== 'All' || selectedRecruiter !== 'All' || selectedDuration !== '6m';

  const handleClearFilters = () => {
    setSelectedTeam('All');
    setSelectedRole('All');
    setSelectedLocation('All');
    setSelectedRecruiter('All');
    setSelectedDuration('6m');
    showToast('Filters reset to default view');
  };

  const handleSaveView = () => {
    showToast('Current filter configuration saved to your views!');
  };

  // --- RECOMMENDATIONS STATE ---
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Unblock 6 Stalled Candidates in System Design',
      role: 'Senior AI Research Scientist',
      impact: 'High Urgency',
      impactColor: 'text-[#FF5630] bg-[#FF5630]/10 border-[#FF5630]/20',
      description: 'Candidates have spent an average of 7.2 days in Technical Review. Hiring manager has pending rubric submissions.',
      actionLabel: 'Send HM Nudge',
      completed: false,
      owner: 'Amit Sharma'
    },
    {
      id: 2,
      title: 'Re-engage 3 Silver Medalists for Frontend Developer',
      role: 'Frontend Developer (React)',
      impact: 'Fast Track',
      impactColor: 'text-[#00A76F] bg-[#00A76F]/10 border-[#00A76F]/20',
      description: '3 archived finalists from Q2 match 94%+ required skills for the newly opened Frontend req. Zero sourcing fee.',
      actionLabel: 'Re-engage Profiles',
      completed: false,
      owner: 'Priya Sharma'
    },
    {
      id: 3,
      title: 'Counter-Offer Risk on Cloud Architect Finalist',
      role: 'Cloud Infrastructure Architect',
      impact: 'Retention Risk',
      impactColor: 'text-[#FFAB00] bg-[#FFAB00]/10 border-[#FFAB00]/20',
      description: 'Final candidate received competing offer with remote equity package. Suggest 15-min executive alignment call.',
      actionLabel: 'Schedule Call',
      completed: false,
      owner: 'Sarah Jenkins'
    }
  ]);

  const handleRecommendationAction = (id, label) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, completed: !rec.completed };
      }
      return rec;
    }));
    showToast(`Action executed: ${label}`);
  };

  // --- TASKS WORK QUEUE STATE ---
  const [taskFilter, setTaskFilter] = useState('All');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Submit Interview Scorecard',
      candidate: 'Sneha Patil',
      role: 'Frontend Developer',
      type: 'Scorecard',
      priority: 'Urgent',
      priorityColor: 'bg-[#FF5630]/10 text-[#FF5630]',
      due: 'Today, 4:00 PM',
      completed: false
    },
    {
      id: 2,
      title: 'Approve Job Requisition #REQ-409',
      candidate: 'Data Platform Architect',
      role: 'Engineering Team',
      type: 'Approvals',
      priority: 'High',
      priorityColor: 'bg-[#FFAB00]/10 text-[#b78103] dark:text-[#FFAB00]',
      due: 'Today, 6:00 PM',
      completed: false
    },
    {
      id: 3,
      title: 'Review & Sign Offer Letter',
      candidate: 'Ananya Sharma',
      role: 'Senior AI Research Scientist',
      type: 'Offers',
      priority: 'Urgent',
      priorityColor: 'bg-[#FF5630]/10 text-[#FF5630]',
      due: 'Tomorrow, 11:00 AM',
      completed: false
    },
    {
      id: 4,
      title: 'Review 8 New Agency Submissions',
      candidate: 'TechTalent Partners',
      role: 'DevOps & SRE Roles',
      type: 'Scorecard',
      priority: 'Normal',
      priorityColor: 'bg-[#1890FF]/10 text-[#1890FF]',
      due: 'Tomorrow, 2:00 PM',
      completed: false
    },
    {
      id: 5,
      title: 'Executive Counter-Offer Sign-off',
      candidate: 'Rahul Verma',
      role: 'Cloud Infrastructure Architect',
      type: 'Offers',
      priority: 'Urgent',
      priorityColor: 'bg-[#FF5630]/10 text-[#FF5630]',
      due: 'Oct 23, 10:00 AM',
      completed: false
    }
  ]);

  const toggleTaskCompleted = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const next = !t.completed;
        showToast(next ? 'Task marked as completed' : 'Task reopened');
        return { ...t, completed: next };
      }
      return t;
    }));
  };

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'All') return tasks;
    return tasks.filter(t => t.type === taskFilter);
  }, [tasks, taskFilter]);

  // --- DYNAMIC KPI METRICS ---
  const kpiMetrics = [
    {
      id: 'active_apps',
      title: 'Active applications',
      value: '248',
      change: '+14%',
      isPositive: true,
      comparison: 'vs last period',
      subtext: 'Across 18 open requisitions',
      icon: Users,
      color: 'text-[#1890FF]',
      bgColor: 'bg-[#1890FF]/10'
    },
    {
      id: 'open_roles',
      title: 'Open roles',
      value: '18',
      change: '4 Urgent',
      isWarning: true,
      comparison: 'priority requisitions',
      subtext: '5 Eng · 3 Prod · 2 Design',
      icon: Briefcase,
      color: 'text-[#00A76F]',
      bgColor: 'bg-[#00A76F]/10'
    },
    {
      id: 'time_to_hire',
      title: 'Time to hire',
      value: '26 days',
      change: '-4 days',
      isPositive: true,
      comparison: 'vs 30d benchmark',
      subtext: 'Fastest: Frontend (18d)',
      icon: Clock,
      color: 'text-[#8E33FF]',
      bgColor: 'bg-[#8E33FF]/10'
    },
    {
      id: 'offer_acceptance',
      title: 'Offer acceptance',
      value: '88%',
      change: '+5.2%',
      isPositive: true,
      comparison: 'vs target (85%)',
      subtext: '22 accepted of 25 offers',
      icon: CheckCircle2,
      color: 'text-[#00A76F]',
      bgColor: 'bg-[#00A76F]/10'
    },
    {
      id: 'stage_aging',
      title: 'Stage aging',
      value: '3.4 days',
      change: '6 Stalled',
      isNegative: true,
      comparison: '> 7 days in review',
      subtext: 'Bottleneck: System Design',
      icon: AlertCircle,
      color: 'text-[#FF5630]',
      bgColor: 'bg-[#FF5630]/10'
    }
  ];

  return (
    <div className="p-6 space-y-5 relative w-full text-[#212b36] dark:text-gray-100 font-sans">
      {/* TOP BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1">
        <Link to="/dashboard" className="hover:text-[#1890FF] transition-colors cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={14} className="text-gray-400 shrink-0" />
        <span className="text-[#212b36] dark:text-white">Hiring Overview</span>
      </nav>

      {/* HIRING OVERVIEW HEADER CARD */}
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/70 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#212b36] dark:text-white tracking-tight leading-none">
                Hiring Overview
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00A76F]/10 text-[#00A76F]">
                Live Overview
              </span>
            </div>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              A quick read on hiring health, what needs attention, and the next action for your team.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button 
              onClick={() => showToast('Refreshed latest hiring signals')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors shadow-2xs cursor-pointer h-[38px]"
            >
              <RefreshCw size={14} className="text-gray-500 dark:text-gray-400" />
              <span>Sync</span>
            </button>
            <button 
              onClick={() => showToast('Executive Brief exported as PDF')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl transition-all shadow-sm cursor-pointer h-[38px]"
            >
              <Download size={14} />
              <span>Export Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TABS BAR ("Overview", "Hiring", "Analytics")                 */}
      {/* ============================================================== */}
      <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[13px] font-bold relative cursor-pointer transition-colors ${
                isActive
                  ? 'text-[#1890FF] dark:text-[#1890FF]'
                  : 'text-gray-600 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1890FF] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: OVERVIEW CONTENT                                        */}
      {/* ============================================================== */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">

          {/* ---------------------------------------------------------- */}
          {/* A. HORIZONTAL FILTER PANEL (Custom Dropdowns)              */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white dark:bg-[#161c24] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
              
              {/* Custom SearchableSelect Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                
                {/* Team */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={12} className="text-gray-400" />
                    Team
                  </label>
                  <SearchableSelect
                    options={teamOptions}
                    value={selectedTeam}
                    onChange={(val) => setSelectedTeam(val)}
                    size="sm"
                    showSearch={false}
                    placeholder="All Teams"
                  />
                </div>

                {/* Roles */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase size={12} className="text-gray-400" />
                    Roles
                  </label>
                  <SearchableSelect
                    options={roleOptions}
                    value={selectedRole}
                    onChange={(val) => setSelectedRole(val)}
                    size="sm"
                    showSearch={true}
                    searchPlaceholder="Search roles..."
                    placeholder="All Roles"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400" />
                    Location
                  </label>
                  <SearchableSelect
                    options={locationOptions}
                    value={selectedLocation}
                    onChange={(val) => setSelectedLocation(val)}
                    size="sm"
                    showSearch={false}
                    placeholder="All Locations"
                  />
                </div>

                {/* Recruiter */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <UserCheck size={12} className="text-gray-400" />
                    Recruiter
                  </label>
                  <SearchableSelect
                    options={recruiterOptions}
                    value={selectedRecruiter}
                    onChange={(val) => setSelectedRecruiter(val)}
                    size="sm"
                    showSearch={false}
                    placeholder="All Recruiters"
                  />
                </div>
              </div>

              {/* Duration Segmented Control + Save / Clear Actions */}
              <div className="flex flex-wrap items-end gap-3 pt-2 xl:pt-0 xl:border-l border-gray-100 dark:border-gray-800 xl:pl-4 shrink-0">
                
                {/* Duration */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </span>
                  <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700/60 h-[38px]">
                    {['3m', '6m', '12m'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDuration(d)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          selectedDuration === d
                            ? 'bg-white dark:bg-[#161c24] text-[#1890FF] shadow-xs'
                            : 'text-gray-500 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions: Save View & Clear Filter */}
                <div className="flex items-center gap-2 pb-0.5">
                  <button
                    onClick={handleSaveView}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60 border border-gray-200 dark:border-gray-700/60 rounded-xl transition-colors cursor-pointer h-[38px]"
                    title="Save current filters as custom view"
                  >
                    <Bookmark size={13} className="text-[#1890FF]" />
                    <span>Save view</span>
                  </button>

                  <button
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer h-[38px] ${
                      hasActiveFilters 
                        ? 'text-[#FF5630] bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-900/40' 
                        : 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/40 border border-transparent cursor-not-allowed opacity-60'
                    }`}
                    title="Reset all filters"
                  >
                    <RotateCcw size={13} />
                    <span>Clear filter</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* B. HIRING HEALTH SECTION WITH AI HIRING BRIEF              */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sm:p-6 shadow-xs">
            
            {/* Top Row: AI Brief Badge (Brand Color #00A76F) & Score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20 flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-tight">
                      AI Hiring Brief
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20">
                      Updated 10m ago
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    Synthesized from 248 applications, 42 panel scorecards, and current pipeline velocity.
                  </p>
                </div>
              </div>

              {/* Health Score Pill */}
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#1a232d] px-4 py-2 rounded-xl border border-gray-200/80 dark:border-gray-800 self-start sm:self-auto">
                <div className="text-right">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Hiring Health Index
                  </div>
                  <div className="text-sm font-extrabold text-[#00A76F]">
                    Strong · 84/100
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full border-4 border-[#00A76F] border-t-gray-200 dark:border-t-gray-700 flex items-center justify-center text-xs font-black text-[#212b36] dark:text-white">
                  84%
                </div>
              </div>
            </div>

            {/* Middle Row: AI Brief Narrative */}
            <div className="py-4">
              <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                <span className="font-semibold text-[#212b36] dark:text-white">Executive Summary: </span>
                Overall hiring velocity improved by <strong className="text-[#00A76F] font-bold">14%</strong> this month, driven by fast-tracking Engineering technical screenings. However, stage stagnation is emerging in 2 senior requisitions (<span className="text-[#00A76F] font-semibold">Cloud Infrastructure Architect</span> & <span className="text-[#00A76F] font-semibold">Senior AI Researcher</span>) where candidates have been waiting &gt;6 days for panel consensus. Offer acceptance remains healthy at <strong className="text-[#00A76F] font-bold">88%</strong> with 4 offers pending candidate signature.
              </div>
            </div>

            {/* Bottom Row: 3 High-Impact Key Takeaways */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              
              <div className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-[#1a232d] border border-gray-100 dark:border-gray-800/80 flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00A76F] mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#212b36] dark:text-white">
                    Velocity Improvement
                  </div>
                  <p className="text-[11.5px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    Time from Screen to Final Round dropped from 18 days to 12 days in Engineering.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-[#1a232d] border border-gray-100 dark:border-gray-800/80 flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFAB00] mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#212b36] dark:text-white">
                    4 Pending Offer Signatures
                  </div>
                  <p className="text-[11.5px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    Offers for Senior Backend & Product Manager pending for &gt;48h; follow-up recommended.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-[#1a232d] border border-gray-100 dark:border-gray-800/80 flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00A76F] mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#212b36] dark:text-white">
                    Agency Bench Opportunity
                  </div>
                  <p className="text-[11.5px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    TechTalent Partners has 8 qualified DevOps candidates ready for immediate screening.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* ---------------------------------------------------------- */}
          {/* C. 5 KPI CARDS                                             */}
          {/* ---------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpiMetrics.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div 
                  key={kpi.id}
                  className="bg-white dark:bg-[#161c24] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Top: Icon + Title */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
                      {kpi.title}
                    </span>
                    <div className={`w-8 h-8 rounded-lg ${kpi.bgColor} ${kpi.color} flex items-center justify-center shrink-0`}>
                      <Icon size={16} />
                    </div>
                  </div>

                  {/* Middle: Number & Trend */}
                  <div className="space-y-1 my-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#212b36] dark:text-white tracking-tight">
                      {kpi.value}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        kpi.isPositive
                          ? 'bg-[#00A76F]/10 text-[#00A76F]'
                          : kpi.isWarning
                          ? 'bg-[#FFAB00]/10 text-[#b78103] dark:text-[#FFAB00]'
                          : 'bg-[#FF5630]/10 text-[#FF5630]'
                      }`}>
                        {kpi.change}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-400 truncate">
                        {kpi.comparison}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Subtext */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                    {kpi.subtext}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---------------------------------------------------------- */}
          {/* D. SPLIT SECTION: RECOMMENDATIONS & MY PENDING TASKS       */}
          {/* ---------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: AI Insights & Recommendations (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#00A76F]/10 text-[#00A76F] flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                      AI Recommendations
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      Prioritized interventions based on real-time pipeline bottlenecks.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#00A76F]/10 text-[#00A76F]">
                  {recommendations.filter(r => !r.completed).length} Active
                </span>
              </div>

              {/* Recommendations List */}
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div 
                    key={rec.id}
                    className={`p-4 rounded-xl border transition-all ${
                      rec.completed 
                        ? 'bg-gray-50/50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-800/50 opacity-60'
                        : 'bg-white dark:bg-[#1a232d] border-gray-200/80 dark:border-gray-700/60 hover:border-[#00A76F]/40 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${rec.impactColor}`}>
                            {rec.impact}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-400 font-medium">
                            Role: {rec.role}
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold text-[#212b36] dark:text-white ${rec.completed ? 'line-through' : ''}`}>
                          {rec.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <button
                          onClick={() => handleRecommendationAction(rec.id, rec.actionLabel)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                            rec.completed
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                              : 'bg-[#1890FF] text-white hover:bg-[#1890FF]/90 shadow-2xs'
                          }`}
                        >
                          {rec.completed ? <Check size={13} /> : <ArrowRight size={13} />}
                          <span>{rec.completed ? 'Executed' : rec.actionLabel}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT COLUMN: My Pending Tasks (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#00A76F]/10 text-[#00A76F] flex items-center justify-center shrink-0">
                    <ClipboardList size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                      My Pending Tasks
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      Personal recruitment queue and SLA alerts.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#00A76F]/10 text-[#00A76F]">
                  {tasks.filter(t => !t.completed).length} Pending
                </span>
              </div>

              {/* Task Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Scorecard', 'Offers', 'Approvals'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTaskFilter(tf)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                      taskFilter === tf
                        ? 'bg-[#1890FF] text-white'
                        : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Task Items */}
              <div className="space-y-2.5">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      task.completed
                        ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800/60 opacity-60'
                        : 'bg-white dark:bg-[#1a232d] border-gray-200/80 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-2xs'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompleted(task.id)}
                      className="w-4 h-4 mt-0.5 rounded text-[#1890FF] focus:ring-[#1890FF]/20 cursor-pointer shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold truncate ${task.completed ? 'line-through text-gray-400' : 'text-[#212b36] dark:text-white'}`}>
                          {task.title}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${task.priorityColor}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {task.candidate} · <span className="font-semibold">{task.role}</span>
                      </div>
                      <div className="text-[10.5px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={11} />
                        <span>{task.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: HIRING CONTENT (Complementary view)                     */}
      {/* ============================================================== */}
      {activeTab === 'Hiring' && (
        <div className="bg-white dark:bg-[#161c24] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#212b36] dark:text-white">
                Active Hiring Requisitions & Pipeline Velocity
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detailed requisition tracking by hiring manager, candidate stages, and SLAs.
              </p>
            </div>
            <button 
              onClick={() => showToast('Requisition export generated')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#1890FF] rounded-xl hover:bg-[#1890FF]/90 transition-colors shadow-2xs cursor-pointer"
            >
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Role Title</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Hiring Manager</th>
                  <th className="p-3.5 text-center">Applied</th>
                  <th className="p-3.5 text-center">Screen</th>
                  <th className="p-3.5 text-center">Interview</th>
                  <th className="p-3.5 text-center">Offer</th>
                  <th className="p-3.5 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {[
                  { role: 'Senior AI Research Scientist', dept: 'Engineering', hm: 'Amit Sharma', applied: 124, screen: 45, interview: 18, offer: 4, status: 'Active' },
                  { role: 'Product Design Lead', dept: 'Design', hm: 'Sarah Jenkins', applied: 68, screen: 22, interview: 8, offer: 2, status: 'Active' },
                  { role: 'Cloud Infrastructure Architect', dept: 'Engineering', hm: 'Amit Sharma', applied: 54, screen: 16, interview: 6, offer: 1, status: 'Stalled' },
                  { role: 'Frontend Developer', dept: 'Engineering', hm: 'Priya Sharma', applied: 190, screen: 60, interview: 24, offer: 8, status: 'Active' },
                  { role: 'Growth Marketing Manager', dept: 'Marketing', hm: 'David Chen', applied: 82, screen: 30, interview: 10, offer: 3, status: 'Active' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-[#212b36] dark:text-white">{row.role}</td>
                    <td className="p-3.5 text-gray-500">{row.dept}</td>
                    <td className="p-3.5 text-gray-600 dark:text-gray-300">{row.hm}</td>
                    <td className="p-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">{row.applied}</td>
                    <td className="p-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">{row.screen}</td>
                    <td className="p-3.5 text-center font-semibold text-[#1890FF]">{row.interview}</td>
                    <td className="p-3.5 text-center font-bold text-[#00A76F]">{row.offer}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.status === 'Active' 
                          ? 'bg-[#00A76F]/10 text-[#00A76F]' 
                          : 'bg-[#FF5630]/10 text-[#FF5630]'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ANALYTICS CONTENT (Complementary view)                  */}
      {/* ============================================================== */}
      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-[#212b36] dark:text-white">
              Sourcing Channel Efficiency
            </h3>
            <p className="text-xs text-gray-400">
              Conversion rates across active applicant sources over {selectedDuration}.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { channel: 'Direct / Inbound Careers', count: 142, rate: '28% to Screen', color: 'bg-[#1890FF]' },
                { channel: 'Recruitment Agencies (Bench)', count: 64, rate: '44% to Screen', color: 'bg-[#00A76F]' },
                { channel: 'Employee Referrals', count: 32, rate: '68% to Screen', color: 'bg-[#8E33FF]' },
                { channel: 'Executive Sourcing', count: 10, rate: '80% to Screen', color: 'bg-[#FFAB00]' }
              ].map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#212b36] dark:text-white">{c.channel}</span>
                    <span className="text-gray-500">{c.count} candidates · {c.rate}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${(c.count / 142) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-[#212b36] dark:text-white">
              Offer Acceptance Benchmark
            </h3>
            <p className="text-xs text-gray-400">
              Departmental acceptance ratios vs industry standard (85%).
            </p>
            <div className="space-y-3 pt-2">
              {[
                { dept: 'Engineering', rate: 92, status: 'Exceeding Target' },
                { dept: 'Product & Design', rate: 86, status: 'On Target' },
                { dept: 'Sales & GTM', rate: 82, status: 'Slightly Below' },
                { dept: 'Data Science & AI', rate: 89, status: 'On Target' }
              ].map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#212b36] dark:text-white block">{d.dept}</span>
                    <span className="text-[11px] text-gray-500">{d.status}</span>
                  </div>
                  <span className="text-base font-extrabold text-[#00A76F]">
                    {d.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
