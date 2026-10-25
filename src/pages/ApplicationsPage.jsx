import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  FileCheck,
  Bookmark,
  BookmarkPlus,
  FolderInput,
  Trash2,
  Table as TableIcon,
  LayoutGrid,
  Search,
  Check,
  CheckCircle2,
  X,
  Briefcase,
  User,
  Calendar,
  ArrowUpRight,
  ChevronDown, ChevronRight,
  Filter,
  Clock,
  Building2,
  Tag,
  Plus,
  RotateCcw,
  Sparkles,
  Layers,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
  Download,
  Star,
  Users,
  Eye,
  ArrowRight,
  ListPlus,
  CalendarClock,
  MoreVertical
} from 'lucide-react';
import CustomCheckbox from '../components/ui/CustomCheckbox';
import SearchableSelect from '../components/ui/SearchableSelect';
import JobFilterPanel, { FILTER_DATA } from '../components/dashboard/JobFilterPanel';
import JobQuickFilterBar from '../components/dashboard/JobQuickFilterBar';
import FollowUpModal from '../components/dashboard/FollowUpModal';
import { isItemFavorited, toggleFavorite } from '../data/favoritesData';
import { isItemFollowedUp } from '../data/followupsData';
import {
  CANDIDATES_POOL,
  getStoredLists,
  saveStoredLists,
  addCandidatesToList,
  moveCandidatesToList
} from '../data/candidateListsData';

// Initial Mock Applications linked to candidates pool
const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    candidateId: 'cand-1',
    candidateName: 'Ananya Sharma',
    candidateEmail: 'ananya.sharma@example.com',
    candidateLocation: 'Bangalore, India',
    candidatePhone: '+91 98765 43210',
    jobTitle: 'Senior AI Research Scientist',
    department: 'Engineering',
    company: 'Anthropic Labs',
    experience: '7 yrs exp',
    stage: 'Technical Interview',
    source: 'TechTalent Partners',
    appliedOn: '24 Oct 2026',
    status: 'Active',
    matchScore: 98,
    skills: ['PyTorch', 'Transformers', 'LLMs', 'Python', 'NLP']
  },
  {
    id: 'app-2',
    candidateId: 'cand-2',
    candidateName: 'Rahul Verma',
    candidateEmail: 'rahul.verma@example.com',
    candidateLocation: 'San Francisco, CA',
    candidatePhone: '+91 98111 22334',
    jobTitle: 'Principal Cloud Infrastructure Architect',
    department: 'Engineering',
    company: 'Databricks',
    experience: '8 yrs exp',
    stage: 'Culture Fit',
    source: 'LinkedIn Recruiter',
    appliedOn: '23 Oct 2026',
    status: 'Active',
    matchScore: 96,
    skills: ['AWS Cloud', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker']
  },
  {
    id: 'app-3',
    candidateId: 'cand-3',
    candidateName: 'Sneha Patil',
    candidateEmail: 'sneha.patil@example.com',
    candidateLocation: 'Pune, India',
    candidatePhone: '+91 99200 44556',
    jobTitle: 'Frontend Developer',
    department: 'Engineering',
    company: 'TCS Innovation Lab',
    experience: '4 yrs exp',
    stage: 'Screening',
    source: 'Direct Careers',
    appliedOn: '24 Oct 2026',
    status: 'Active',
    matchScore: 92,
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Next.js']
  },
  {
    id: 'app-4',
    candidateId: 'cand-4',
    candidateName: 'Maya Chen',
    candidateEmail: 'maya.chen@example.com',
    candidateLocation: 'San Francisco, CA',
    candidatePhone: '+1 415 555 0192',
    jobTitle: 'Product Design Lead',
    department: 'Design',
    company: 'Figma',
    experience: '7 yrs exp',
    stage: 'Technical Interview',
    source: 'Vanguard Recruitment',
    appliedOn: '22 Oct 2026',
    status: 'Active',
    matchScore: 94,
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping']
  },
  {
    id: 'app-5',
    candidateId: 'cand-5',
    candidateName: 'Karthik Raja',
    candidateEmail: 'karthik.raja@example.com',
    candidateLocation: 'Chennai, India',
    candidatePhone: '+91 94440 12345',
    jobTitle: 'Backend Engineer (Go/Distributed)',
    department: 'Engineering',
    company: 'Freshworks',
    experience: '5 yrs exp',
    stage: 'Culture Fit',
    source: 'TechTalent Partners',
    appliedOn: '21 Oct 2026',
    status: 'Active',
    matchScore: 91,
    skills: ['Go', 'PostgreSQL', 'Kafka', 'gRPC', 'Distributed Systems']
  },
  {
    id: 'app-6',
    candidateId: 'cand-6',
    candidateName: 'Emily Watson',
    candidateEmail: 'emily.watson@example.com',
    candidateLocation: 'New York, NY',
    candidatePhone: '+1 212 555 0148',
    jobTitle: 'VP of Product Management',
    department: 'Product Management',
    company: 'Stripe',
    experience: '10 yrs exp',
    stage: 'Offer',
    source: 'LinkedIn Recruiter',
    appliedOn: '20 Oct 2026',
    status: 'Shortlisted',
    matchScore: 97,
    skills: ['Product Strategy', 'FinTech', 'Roadmapping', 'Growth']
  },
  {
    id: 'app-7',
    candidateId: 'cand-7',
    candidateName: 'Vikram Seth',
    candidateEmail: 'vikram.seth@example.com',
    candidateLocation: 'Delhi NCR, India',
    candidatePhone: '+91 98100 88776',
    jobTitle: 'Principal Data Engineer',
    department: 'Data Science & AI',
    company: 'Flipkart',
    experience: '9 yrs exp',
    stage: 'Technical Interview',
    source: 'Direct Careers',
    appliedOn: '24 Oct 2026',
    status: 'Under Review',
    matchScore: 95,
    skills: ['Apache Spark', 'Databricks', 'Snowflake', 'Python', 'ETL']
  },
  {
    id: 'app-8',
    candidateId: 'cand-8',
    candidateName: 'Priya Iyer',
    candidateEmail: 'priya.iyer@example.com',
    candidateLocation: 'Hyderabad, India',
    candidatePhone: '+91 98490 11223',
    jobTitle: 'DevOps & Site Reliability Lead',
    department: 'Engineering',
    company: 'Microsoft IDC',
    experience: '6 yrs exp',
    stage: 'Culture Fit',
    source: 'Nexus Tech Staffing',
    appliedOn: '19 Oct 2026',
    status: 'Active',
    matchScore: 93,
    skills: ['Kubernetes', 'Azure Cloud', 'Terraform', 'Prometheus', 'ArgoCD']
  },
  {
    id: 'app-9',
    candidateId: 'cand-9',
    candidateName: 'Marcus Miller',
    candidateEmail: 'marcus.m@example.com',
    candidateLocation: 'Austin, TX',
    candidatePhone: '+1 512 555 0177',
    jobTitle: 'Full Stack Engineer (Node/React)',
    department: 'Engineering',
    company: 'Dell Technologies',
    experience: '5 yrs exp',
    stage: 'Screening',
    source: 'Direct Careers',
    appliedOn: '25 Oct 2026',
    status: 'Under Review',
    matchScore: 89,
    skills: ['Node.js', 'React', 'MongoDB', 'AWS', 'GraphQL']
  },
  {
    id: 'app-10',
    candidateId: 'cand-10',
    candidateName: 'Tanvi Nair',
    candidateEmail: 'tanvi.nair@example.com',
    candidateLocation: 'Kochi, India',
    candidatePhone: '+91 97450 33445',
    jobTitle: 'Growth & Performance Marketing Lead',
    department: 'Marketing & Growth',
    company: 'Byju\'s',
    experience: '6 yrs exp',
    stage: 'Technical Interview',
    source: 'LinkedIn Recruiter',
    appliedOn: '18 Oct 2026',
    status: 'Active',
    matchScore: 90,
    skills: ['SEO/SEM', 'Google Ads', 'Data Analytics', 'HubSpot']
  },
  {
    id: 'app-11',
    candidateId: 'cand-11',
    candidateName: 'David Kim',
    candidateEmail: 'david.kim@example.com',
    candidateLocation: 'Seattle, WA',
    candidatePhone: '+1 206 555 0184',
    jobTitle: 'Applied Machine Learning Engineer',
    department: 'Data Science & AI',
    company: 'Amazon AWS',
    experience: '6 yrs exp',
    stage: 'Offer',
    source: 'Internal Referral',
    appliedOn: '17 Oct 2026',
    status: 'Offer Pending',
    matchScore: 96,
    skills: ['TensorFlow', 'SageMaker', 'MLOps', 'Python', 'C++']
  },
  {
    id: 'app-12',
    candidateId: 'cand-12',
    candidateName: 'Rohan Mehta',
    candidateEmail: 'rohan.mehta@example.com',
    candidateLocation: 'Mumbai, India',
    candidatePhone: '+91 98200 77889',
    jobTitle: 'Senior Product Manager - Core Platform',
    department: 'Product Management',
    company: 'Paytm Payments',
    experience: '8 yrs exp',
    stage: 'Culture Fit',
    source: 'Apex Search Partners',
    appliedOn: '16 Oct 2026',
    status: 'Active',
    matchScore: 93,
    skills: ['Payment Gateways', 'API Design', 'Microservices', 'Scrum']
  },
  {
    id: 'app-13',
    candidateId: 'cand-13',
    candidateName: 'Sofia Rossi',
    candidateEmail: 'sofia.rossi@example.com',
    candidateLocation: 'London, UK',
    candidatePhone: '+44 20 7946 0912',
    jobTitle: 'Security & Compliance Architect',
    department: 'Engineering',
    company: 'Revolut',
    experience: '9 yrs exp',
    stage: 'Technical Interview',
    source: 'LinkedIn Recruiter',
    appliedOn: '23 Oct 2026',
    status: 'Active',
    matchScore: 94,
    skills: ['SOC2', 'ISO 27001', 'Cloud Security', 'Penetration Testing']
  },
  {
    id: 'app-14',
    candidateId: 'cand-14',
    candidateName: 'Aditya Joshi',
    candidateEmail: 'aditya.joshi@example.com',
    candidateLocation: 'Bangalore, India',
    candidatePhone: '+91 99000 55667',
    jobTitle: 'Staff Mobile Engineer (React Native / iOS)',
    department: 'Engineering',
    company: 'Swiggy',
    experience: '7 yrs exp',
    stage: 'Hired',
    source: 'TechTalent Partners',
    appliedOn: '15 Oct 2026',
    status: 'Shortlisted',
    matchScore: 95,
    skills: ['React Native', 'Swift', 'Redux', 'Mobile Performance']
  },
  {
    id: 'app-15',
    candidateId: 'cand-15',
    candidateName: 'Claire Dupont',
    candidateEmail: 'claire.d@example.com',
    candidateLocation: 'Paris, France',
    candidatePhone: '+33 1 42 68 55 00',
    jobTitle: 'Customer Success & Operations Lead',
    department: 'Customer Success',
    company: 'Dataiku',
    experience: '6 yrs exp',
    stage: 'Screening',
    source: 'Direct Careers',
    appliedOn: '25 Oct 2026',
    status: 'Under Review',
    matchScore: 88,
    skills: ['Enterprise SaaS', 'Onboarding', 'Churn Reduction', 'Salesforce']
  },
  {
    id: 'app-16',
    candidateId: 'cand-16',
    candidateName: 'Deepak Rao',
    candidateEmail: 'deepak.rao@example.com',
    candidateLocation: 'Bangalore, India',
    candidatePhone: '+91 98860 99887',
    jobTitle: 'Senior Frontend Developer',
    department: 'Engineering',
    company: 'Infosys Wings',
    experience: '5 yrs exp',
    stage: 'Screening',
    source: 'Direct Careers',
    appliedOn: '25 Oct 2026',
    status: 'Rejected',
    matchScore: 78,
    skills: ['HTML/CSS', 'Vue.js', 'JavaScript', 'Bootstrap']
  }
];

const APPLICATION_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Applied' },
  { value: 'oldest', label: 'Oldest Applied' },
  { value: 'name_asc', label: 'Candidate Name (A – Z)' },
  { value: 'name_desc', label: 'Candidate Name (Z – A)' },
  { value: 'job_asc', label: 'Job Title (A – Z)' },
  { value: 'score_desc', label: 'Highest AI Match' }
];

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeViewParam = searchParams.get('view') || 'all';

  // Primary Applications State
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [availableLists, setAvailableLists] = useState(() => getStoredLists());
  const [bulkTargetListId, setBulkTargetListId] = useState('');

  // View Mode: 'grid' (Table view) or 'card' (Card view)
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected filters for left JobFilterPanel
  const [selectedFilters, setSelectedFilters] = useState({
    department: [],
    position: [],
    location: [],
    experience: [],
    company: [],
    employmentType: [],
    workMode: [],
    aiHealth: [],
    posted: []
  });

  // Quick filters for horizontal JobQuickFilterBar
  const [quickFilters, setQuickFilters] = useState({
    status: [],
    skills: [],
    priority: [],
    hiringManager: [],
    recruiter: [],
    openings: [],
    shift: [],
    topSource: [],
    education: [],
    noticePeriod: [],
    visaSponsorship: [],
    industry: []
  });

  // Modal & Toast states
  const [singleCandidateModal, setSingleCandidateModal] = useState(null); // { app, targetListId }
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null); // app
  const [toastMessage, setToastMessage] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Layout Height Synchronization for Left Filter Panel
  const rightPanelRef = useRef(null);
  const [filterPanelHeight, setFilterPanelHeight] = useState(null);
  const baseHeightRef = useRef({});

  // Sync available lists from storage on mount
  useEffect(() => {
    setAvailableLists(getStoredLists());
  }, []);

  // Customized Dropdown Options for Lists (My List)
  const listSelectOptions = useMemo(() => {
    return availableLists.map(list => ({
      value: list.id,
      label: `${list.name} (${list.candidateIds?.length || 0})`
    }));
  }, [availableLists]);

  // Customized Dropdown Options for Page Size
  const pageSizeOptions = useMemo(() => [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 50, label: '50 / page' }
  ], []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3800);
  };

  // Favorite & Follow-Up states & sync
  const [followUpTarget, setFollowUpTarget] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenActionMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const [favRefreshKey, setFavRefreshKey] = useState(0);

  const favoritedApplicationsCount = useMemo(() => applications.filter(a => isItemFavorited('Application', a.id)).length, [applications, favRefreshKey]);
  const followedApplicationsCount = useMemo(() => applications.filter(a => isItemFollowedUp('Application', a.id)).length, [applications, favRefreshKey]);

  const handleViewFilterChange = (mode) => {
    const newParams = new URLSearchParams(searchParams);
    if (mode === 'all') {
      newParams.delete('view');
    } else {
      newParams.set('view', mode);
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleUpdate = () => setFavRefreshKey(k => k + 1);
    window.addEventListener('favorites-updated', handleUpdate);
    window.addEventListener('followups-updated', handleUpdate);
    return () => {
      window.removeEventListener('favorites-updated', handleUpdate);
      window.removeEventListener('followups-updated', handleUpdate);
    };
  }, []);

  const handleToggleFav = (app, e) => {
    if (e) e.stopPropagation();
    const res = toggleFavorite({
      relatedId: app.id,
      title: `${app.candidateName} - ${app.jobTitle}`,
      type: 'Application',
      meta: `${app.stage} • Applied ${app.appliedOn}`,
      path: '/dashboard/applications',
      tag: app.status
    });
    showToast(res.isFavorited ? `Added application to Favorites!` : `Removed from Favorites.`);
  };

  const handleOpenFollowup = (app, e) => {
    if (e) e.stopPropagation();
    setFollowUpTarget({
      type: 'Application',
      relatedId: app.id,
      title: `${app.candidateName} (${app.jobTitle})`,
      subject: `Application: ${app.candidateName} • ${app.jobTitle}`,
      meta: `Stage: ${app.stage} • Applied: ${app.appliedOn}`
    });
  };

  // Filter handlers
  const handleFilterChange = (categoryKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [categoryKey]: value
    }));
    setCurrentPage(1);
  };

  const handleQuickFilterChange = (key, value) => {
    setQuickFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      department: [],
      position: [],
      location: [],
      experience: [],
      company: [],
      employmentType: [],
      workMode: [],
      aiHealth: [],
      posted: []
    });
    setQuickFilters({
      status: [],
      skills: [],
      priority: [],
      hiringManager: [],
      recruiter: [],
      openings: [],
      shift: [],
      topSource: [],
      education: [],
      noticePeriod: [],
      visaSponsorship: [],
      industry: []
    });
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleClearAllQuickFilters = () => {
    setQuickFilters({
      status: [],
      skills: [],
      priority: [],
      hiringManager: [],
      recruiter: [],
      openings: [],
      shift: [],
      topSource: [],
      education: [],
      noticePeriod: [],
      visaSponsorship: [],
      industry: []
    });
    setCurrentPage(1);
  };

  // Dynamic parameters for horizontal quick filter bar
  const dynamicQuickParameters = useMemo(() => {
    return {
      status: [
        { id: 'Active', label: 'Active', count: applications.filter(a => a.status === 'Active').length },
        { id: 'Under Review', label: 'Under Review', count: applications.filter(a => a.status === 'Under Review').length },
        { id: 'Shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'Shortlisted').length },
        { id: 'Offer Pending', label: 'Offer Pending', count: applications.filter(a => a.status === 'Offer Pending').length },
        { id: 'Rejected', label: 'Rejected', count: applications.filter(a => a.status === 'Rejected').length }
      ],
      topSource: [
        { id: 'Direct Careers', label: 'Direct Careers', count: applications.filter(a => a.source.includes('Direct Careers')).length },
        { id: 'LinkedIn Recruiter', label: 'LinkedIn Recruiter', count: applications.filter(a => a.source.includes('LinkedIn')).length },
        { id: 'TechTalent Partners', label: 'TechTalent Partners', count: applications.filter(a => a.source.includes('TechTalent')).length },
        { id: 'Vanguard Recruitment', label: 'Vanguard Recruitment', count: applications.filter(a => a.source.includes('Vanguard')).length },
        { id: 'Internal Referral', label: 'Internal Referral', count: applications.filter(a => a.source.includes('Referral')).length }
      ]
    };
  }, [applications]);

  // Filtered & Sorted Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // View Mode Filter (all | favorites | followups)
      if (activeViewParam === 'favorites' && !isItemFavorited('Application', app.id)) {
        return false;
      }
      if (activeViewParam === 'followups' && !isItemFollowedUp('Application', app.id)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = app.candidateName.toLowerCase().includes(q);
        const matchesJob = app.jobTitle.toLowerCase().includes(q);
        const matchesDept = app.department.toLowerCase().includes(q);
        const matchesLocation = app.candidateLocation.toLowerCase().includes(q);
        const matchesEmail = app.candidateEmail.toLowerCase().includes(q);
        const matchesSource = app.source.toLowerCase().includes(q);
        const matchesSkills = app.skills?.some(s => s.toLowerCase().includes(q));

        if (!matchesName && !matchesJob && !matchesDept && !matchesLocation && !matchesEmail && !matchesSource && !matchesSkills) {
          return false;
        }
      }

      // Left Panel: Department
      if (selectedFilters.department?.length > 0) {
        const matchesDept = selectedFilters.department.some(deptId => {
          const item = FILTER_DATA.department?.find(d => d.id === deptId);
          return item && app.department.toLowerCase().includes(item.label.toLowerCase().split(' ')[0]);
        });
        if (!matchesDept) return false;
      }

      // Left Panel: Location
      if (selectedFilters.location?.length > 0) {
        const matchesLoc = selectedFilters.location.some(locId => {
          const item = FILTER_DATA.location?.find(l => l.id === locId);
          return item && app.candidateLocation.toLowerCase().includes(item.label.toLowerCase().split(',')[0]);
        });
        if (!matchesLoc) return false;
      }

      // Quick Filters: Status
      if (quickFilters.status?.length > 0) {
        if (!quickFilters.status.includes(app.status)) return false;
      }

      // Quick Filters: Top Source
      if (quickFilters.topSource?.length > 0) {
        const matches = quickFilters.topSource.some(src => app.source.toLowerCase().includes(src.toLowerCase()));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'oldest') return a.id.localeCompare(b.id);
      if (sortBy === 'name_asc') return a.candidateName.localeCompare(b.candidateName);
      if (sortBy === 'name_desc') return b.candidateName.localeCompare(a.candidateName);
      if (sortBy === 'job_asc') return a.jobTitle.localeCompare(b.jobTitle);
      if (sortBy === 'score_desc') return b.matchScore - a.matchScore;
      return 0;
    });
  }, [applications, searchQuery, selectedFilters, quickFilters, sortBy, activeViewParam, favRefreshKey]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredApplications.length / pageSize) || 1;
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  // Keep height synced with right panel
  useEffect(() => {
    if (!rightPanelRef.current) return;

    const measureHeight = () => {
      if (window.innerWidth >= 1024 && rightPanelRef.current) {
        const currentH = rightPanelRef.current.offsetHeight;
        if (!baseHeightRef.current[viewMode]) {
          if (currentH > 400) {
            baseHeightRef.current[viewMode] = currentH;
          }
        }
        const benchmarkHeight = baseHeightRef.current[viewMode] || 900;
        setFilterPanelHeight(Math.max(benchmarkHeight, currentH));
      } else {
        setFilterPanelHeight(null);
      }
    };

    const timer = setTimeout(measureHeight, 60);
    const observer = new ResizeObserver(() => measureHeight());
    observer.observe(rightPanelRef.current);
    window.addEventListener('resize', measureHeight);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', measureHeight);
    };
  }, [viewMode, paginatedApplications.length]);

  // Bulk Selection Handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      const pageCandidateIds = paginatedApplications.map(a => a.candidateId);
      setSelectedCandidateIds(Array.from(new Set([...selectedCandidateIds, ...pageCandidateIds])));
    } else {
      const pageCandidateIds = paginatedApplications.map(a => a.candidateId);
      setSelectedCandidateIds(selectedCandidateIds.filter(id => !pageCandidateIds.includes(id)));
    }
  };

  const handleSelectRow = (candidateId) => {
    setSelectedCandidateIds(prev =>
      prev.includes(candidateId) ? prev.filter(id => id !== candidateId) : [...prev, candidateId]
    );
  };

  const isAllPageSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every(a => selectedCandidateIds.includes(a.candidateId));

  // Bulk Actions to "My List"
  const handleBulkAddToList = () => {
    if (!bulkTargetListId) {
      showToast('Please choose a target list from "My List" first.');
      return;
    }
    if (selectedCandidateIds.length === 0) {
      showToast('Please select at least one candidate.');
      return;
    }

    const updated = addCandidatesToList(bulkTargetListId, selectedCandidateIds);
    setAvailableLists(updated);
    const listName = updated.find(l => l.id === bulkTargetListId)?.name || 'the list';
    showToast(`Added ${selectedCandidateIds.length} candidate(s) to "${listName}"!`);
  };

  const handleBulkMoveToList = () => {
    if (!bulkTargetListId) {
      showToast('Please choose a target list from "My List" first.');
      return;
    }
    if (selectedCandidateIds.length === 0) {
      showToast('Please select at least one candidate.');
      return;
    }

    const updated = moveCandidatesToList(bulkTargetListId, selectedCandidateIds);
    setAvailableLists(updated);
    const listName = updated.find(l => l.id === bulkTargetListId)?.name || 'the list';
    showToast(`Moved ${selectedCandidateIds.length} candidate(s) to "${listName}"!`);
    setSelectedCandidateIds([]);
  };

  // Single candidate Add to List modal submit
  const handleSingleAddToList = () => {
    if (!singleCandidateModal || !singleCandidateModal.targetListId) {
      showToast('Please choose a target list.');
      return;
    }
    const { app, targetListId } = singleCandidateModal;
    const updated = addCandidatesToList(targetListId, [app.candidateId]);
    setAvailableLists(updated);
    const listName = updated.find(l => l.id === targetListId)?.name || 'the list';
    showToast(`Added ${app.candidateName} to "${listName}"!`);
    setSingleCandidateModal(null);
  };

  // Delete Application
  const handleDeleteApplication = () => {
    if (!deleteConfirmModal) return;
    const appId = deleteConfirmModal.id;
    const candidateName = deleteConfirmModal.candidateName;

    setApplications(prev => prev.filter(a => a.id !== appId));
    setSelectedCandidateIds(prev => prev.filter(id => id !== deleteConfirmModal.candidateId));
    showToast(`Application for ${candidateName} has been deleted.`);
    setDeleteConfirmModal(null);
  };

  // Stage Badge Colors
  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Screening':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Technical Interview':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Culture Fit':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Offer':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Hired':
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  // Status Badge Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Under Review':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Offer Pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Rejected':
        return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  // Top KPI Overview Cards (5 cards matching candidate/job page design)
  const kpiCards = [
    {
      id: 'all',
      title: 'Total Applications',
      count: applications.length,
      subtext: 'Across all active job openings',
      icon: Users,
      color: 'text-[#1890FF]',
      bgColor: 'bg-[#1890FF]/10',
      borderColor: 'border-[#1890FF]/20'
    },
    {
      id: 'screening',
      title: 'In Screening',
      count: applications.filter(a => a.stage === 'Screening').length,
      subtext: 'Awaiting initial resume evaluation',
      icon: Clock,
      color: 'text-[#00A76F] dark:text-[#22c55e]',
      bgColor: 'bg-[#00A76F]/10',
      borderColor: 'border-[#00A76F]/20'
    },
    {
      id: 'interviewing',
      title: 'In Interview',
      count: applications.filter(a => a.stage === 'Technical Interview' || a.stage === 'Culture Fit').length,
      subtext: 'Active in interview loops',
      icon: Star,
      color: 'text-[#8E33FF]',
      bgColor: 'bg-[#8E33FF]/10',
      borderColor: 'border-[#8E33FF]/20'
    },
    {
      id: 'offers',
      title: 'Offers & Hired',
      count: applications.filter(a => a.stage === 'Offer' || a.stage === 'Hired').length,
      subtext: 'Extended proposals & commitments',
      icon: CheckCircle2,
      color: 'text-[#b78103] dark:text-[#FFAB00]',
      bgColor: 'bg-[#FFAB00]/10',
      borderColor: 'border-[#FFAB00]/20'
    },
    {
      id: 'needs-review',
      title: 'Needs Review',
      count: applications.filter(a => a.status === 'Under Review').length,
      subtext: 'Action required by recruiter',
      icon: AlertCircle,
      color: 'text-[#FF5630]',
      bgColor: 'bg-[#FF5630]/10',
      borderColor: 'border-[#FF5630]/20'
    }
  ];

  return (
    <div className="p-6 space-y-5 relative w-full text-[#212b36] dark:text-gray-100 animate-fade-in font-sans">
      {/* TOP BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1">
        <Link to="/dashboard" className="hover:text-[#1890FF] transition-colors cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={14} className="text-gray-400 shrink-0" />
        <span className="text-[#212b36] dark:text-white">Applications</span>
      </nav>

      {/* APPLICATIONS HEADER CARD */}
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/70 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#212b36] dark:text-white tracking-tight leading-none">
                Applications
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1890FF]/10 text-[#1890FF]">
                {applications.length} Total
              </span>
            </div>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              Review, evaluate, and manage candidate applications across all active jobs and pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => showToast('Exporting applications as CSV...')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors shadow-2xs cursor-pointer h-[38px]"
            >
              <Download size={15} className="text-gray-500" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5 KPI OVERVIEW CARDS (Matching Candidates & Jobs page style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.id}
              className="bg-white dark:bg-[#161c24] p-4 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between transition-all duration-200"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between gap-2 min-h-[32px]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${kpi.bgColor} flex items-center justify-center shrink-0 border ${kpi.borderColor}`}>
                    <Icon size={17} className={kpi.color} />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase tracking-wider">
                    {kpi.title}
                  </h4>
                </div>

                <span className="text-xl sm:text-2xl font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none shrink-0">
                  {kpi.count}
                </span>
              </div>

              {/* Bottom Subtext Row */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="truncate">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN CONTENT ROW: Left Filter Panel + Right Content Area   */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row gap-6 relative items-start">
        {/* LEFT FILTER PANEL (Same as List of Jobs / Candidates) */}
        <JobFilterPanel
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onResetAll={handleResetFilters}
          totalResultsCount={filteredApplications.length}
          panelHeight={filterPanelHeight}
        />

        {/* RIGHT MAIN CONTENT AREA: Horizontal Filter Bar, Pre-Grid Panel, Grid / Card View & Pagination */}
        <div ref={rightPanelRef} className="flex-1 min-w-0 space-y-4 w-full">
          {/* HORIZONTAL QUICK FILTER BAR */}
          <JobQuickFilterBar
            searchQuery={searchQuery}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            searchPlaceholder="Search candidate, job, source, skills, email..."
            quickFilters={quickFilters}
            onQuickFilterChange={handleQuickFilterChange}
            onClearAll={handleClearAllQuickFilters}
            parameterOptions={dynamicQuickParameters}
            sortBy={sortBy}
            sortOptions={APPLICATION_SORT_OPTIONS}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onSortChange={setSortBy}
            showPresetFilters={true}
            activeView={activeViewParam}
            onViewChange={handleViewFilterChange}
            favoritesCount={favoritedApplicationsCount}
            followupsCount={followedApplicationsCount}
          />

          {/* ============================================================== */}
          
                    {/* PRE-GRID PANEL: Add / Move Candidates to My List              */}
          {/* ============================================================== */}
          <div className={`p-4 rounded-2xl border transition-all duration-200 ${
            selectedCandidateIds.length > 0
              ? 'bg-[#1890FF]/5 dark:bg-[#1890FF]/10 border-[#1890FF]/40 shadow-xs'
              : 'bg-white dark:bg-[#161c24] border-gray-100 dark:border-gray-800/80 shadow-xs'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Info & Selection Indicator */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  selectedCandidateIds.length > 0
                    ? 'bg-[#1890FF] text-white border-[#1890FF]'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200/60 dark:border-gray-700/60'
                }`}>
                  <Bookmark size={17} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">
                      My List Actions
                    </span>
                    {selectedCandidateIds.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-[#1890FF] text-white shadow-xs">
                        {selectedCandidateIds.length} candidate{selectedCandidateIds.length > 1 ? 's' : ''} selected
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                        (0 selected)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {selectedCandidateIds.length > 0
                      ? 'Add or move the selected candidates to any custom list available in "My List"'
                      : 'Select candidates from the grid below to add or move them directly to any list in "My List"'}
                  </p>
                </div>
              </div>

              {/* Right Controls: List Selector Dropdown + Add to List + Move to List */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Customized Target List Dropdown from "My List" */}
                <div className="w-56 sm:w-64">
                  <SearchableSelect
                    options={listSelectOptions}
                    value={bulkTargetListId}
                    onChange={(val) => setBulkTargetListId(val)}
                    placeholder="Select list from My List..."
                    searchPlaceholder="Search lists..."
                    size="sm"
                    showSearch={true}
                  />
                </div>

                {/* Add to List Button */}
                <button
                  type="button"
                  disabled={selectedCandidateIds.length === 0 || !bulkTargetListId}
                  onClick={handleBulkAddToList}
                  title={selectedCandidateIds.length === 0 ? "Select candidate(s) from table first" : !bulkTargetListId ? "Select target list" : "Add to selected list"}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    selectedCandidateIds.length > 0 && bulkTargetListId
                      ? 'bg-[#1890FF] text-white hover:bg-[#096dd9]'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200/50 dark:border-gray-700/50'
                  }`}
                >
                  <BookmarkPlus size={14} />
                  <span>Add to List</span>
                </button>

                {/* Move to List Button */}
                <button
                  type="button"
                  disabled={selectedCandidateIds.length === 0 || !bulkTargetListId}
                  onClick={handleBulkMoveToList}
                  title={selectedCandidateIds.length === 0 ? "Select candidate(s) from table first" : !bulkTargetListId ? "Select target list" : "Move to selected list"}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    selectedCandidateIds.length > 0 && bulkTargetListId
                      ? 'bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] hover:bg-[#161c24] dark:hover:bg-gray-100'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200/50 dark:border-gray-700/50'
                  }`}
                >
                  <FolderInput size={14} />
                  <span>Move to List</span>
                </button>

                {/* Clear Selection Button */}
                {selectedCandidateIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCandidateIds([])}
                    className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 px-2 py-1.5 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 4. APPLICATIONS DISPLAY: GRID (TABLE) VIEW OR CARD VIEW        */}
          {/* ============================================================== */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-12 text-center shadow-xs">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <FileCheck size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-1">
                No applications found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-4">
                We couldn't find any candidate applications matching your active filters or search keyword.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#1890FF] text-white rounded-xl text-xs font-bold hover:bg-[#096dd9] transition-colors cursor-pointer shadow-xs"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'card' ? (
            /* ============================================================ */
            /* CARD VIEW                                                    */
            /* ============================================================ */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedApplications.map((app, index) => {
                const isSelected = selectedCandidateIds.includes(app.candidateId);

                return (
                  <div
                    key={app.id}
                    className={`bg-white dark:bg-[#161c24] rounded-2xl border p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between relative ${openActionMenuId === app.id ? 'z-30' : ''} ${
                      isSelected
                        ? 'border-[#1890FF] shadow-xs ring-1 ring-[#1890FF]/30'
                        : 'border-gray-100 dark:border-gray-800/80'
                    }`}
                  >
                    <div>
                      {/* Card Header: Checkbox + Candidate Info (without initial avatar) + Actions */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div className="pt-0.5">
                            <CustomCheckbox
                              checked={isSelected}
                              onChange={() => handleSelectRow(app.candidateId)}
                              aria-label={`Select ${app.candidateName}`}
                            />
                          </div>
                          <div>
                            <Link
                              to={`/dashboard/candidates/${app.candidateId}`}
                              className="font-bold text-sm text-[#212b36] dark:text-white hover:text-[#1890FF] transition-colors line-clamp-1"
                            >
                              {app.candidateName}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                              <MapPin size={11} className="shrink-0" />
                              <span className="truncate">{app.candidateLocation}</span>
                            </p>
                          </div>
                        </div>

                        {/* Row Actions: Favorite, Follow Up, Add to List, Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Favorite {Icon} */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFav(app, e)}
                            title={isItemFavorited('Application', app.id) ? 'Favorited (Click to remove)' : 'Add to Favorites'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isItemFavorited('Application', app.id)
                                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                                : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                            }`}
                          >
                            <Star size={15} className={isItemFavorited('Application', app.id) ? 'fill-amber-400 text-amber-500' : ''} />
                          </button>

                          {/* Follow Up {Icon} */}
                          <button
                            type="button"
                            onClick={(e) => handleOpenFollowup(app, e)}
                            title={isItemFollowedUp('Application', app.id) ? 'Follow-up scheduled (Click to manage)' : 'Set Follow Up'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isItemFollowedUp('Application', app.id)
                                ? 'text-[#1890FF] bg-blue-50 dark:bg-blue-950/40'
                                : 'text-gray-400 hover:text-[#1890FF] hover:bg-blue-50 dark:hover:bg-blue-950/30'
                            }`}
                          >
                            <CalendarClock size={15} />
                          </button>

                          {/* Kebab Menu Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(openActionMenuId === app.id ? null : app.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                            title="Actions"
                          >
                            <MoreVertical size={15} />
                          </button>

                          {/* Kebab Dropdown Menu */}
                          {openActionMenuId === app.id && (
                            <div className="absolute right-0 top-9 w-44 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1 animate-fade-in text-left">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSingleCandidateModal({ app, targetListId: availableLists[0]?.id || '' });
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <BookmarkPlus size={14} className="text-[#1890FF]" />
                                <span>Add To List</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenuId(null);
                                  navigate(`/dashboard/candidates/${app.candidateId}`);
                                }}
                                className="w-full px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <User size={14} className="text-gray-500 dark:text-gray-400" />
                                <span>View Profile</span>
                              </button>

                              <div className="my-1 border-t border-gray-100 dark:border-gray-800/60" />

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmModal(app);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-left text-xs font-semibold text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} className="text-[#FF5630]" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Body: Job Title & Department */}
                      <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl mb-3 border border-gray-100 dark:border-gray-800/60">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-[#212b36] dark:text-white line-clamp-1">
                            {app.jobTitle}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shrink-0">
                            {app.department}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="text-[11px]">Score Match:</span>
                          <span className="font-bold text-[#1890FF]">{app.matchScore}%</span>
                        </div>
                      </div>

                      {/* Badges: Stage & Status */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getStageBadge(app.stage)}`}>
                          {app.stage}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer: Source & Applied on Date */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
                        <Tag size={12} className="text-[#1890FF] shrink-0" />
                        {app.source}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <Calendar size={12} />
                        {app.appliedOn}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ============================================================ */
            /* GRID (TABLE) VIEW                                            */
            /* Columns: Candidate, Job, Stage, Source, Applied on, Status, Action */
            /* ============================================================ */
            <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  {/* Table Header */}
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/75 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 pl-3 pr-1 w-9">
                        <CustomCheckbox
                          checked={isAllPageSelected}
                          onChange={handleSelectAll}
                          aria-label="Select all applications on this page"
                        />
                      </th>
                      <th className="py-3 px-2.5 min-w-[120px]">Candidate</th>
                      <th className="py-3 px-2.5 min-w-[140px]">Job</th>
                      <th className="py-3 px-2 min-w-[110px]">Stage</th>
                      <th className="py-3 px-2 min-w-[105px]">Source</th>
                      <th className="py-3 px-2 min-w-[90px]">Applied on</th>
                      <th className="py-3 px-2 min-w-[95px]">Status</th>
                      <th className="py-3 pl-2 pr-3 text-center min-w-[105px] w-28">Action</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {paginatedApplications.map((app, index) => {
                      const isSelected = selectedCandidateIds.includes(app.candidateId);

                      return (
                        <tr
                          key={app.id}
                          className={`hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors ${openActionMenuId === app.id ? 'relative z-30' : ''} ${
                            isSelected ? 'bg-[#1890FF]/5 dark:bg-[#1890FF]/10' : ''
                          }`}
                        >
                          {/* Row Checkbox */}
                          <td className="py-3 pl-3 pr-1">
                            <CustomCheckbox
                              checked={isSelected}
                              onChange={() => handleSelectRow(app.candidateId)}
                              aria-label={`Select ${app.candidateName}`}
                            />
                          </td>

                          {/* 1. Candidate Column: Name only */}
                          <td className="py-3 px-2.5">
                            <Link
                              to={`/dashboard/candidates/${app.candidateId}`}
                              className="font-bold text-xs text-[#212b36] dark:text-white hover:text-[#1890FF] transition-colors truncate block"
                              title={app.candidateName}
                            >
                              {app.candidateName}
                            </Link>
                          </td>

                          {/* 2. Job Column: Title only */}
                          <td className="py-3 px-2.5">
                            <span
                              className="font-semibold text-gray-900 dark:text-gray-100 truncate block text-xs"
                              title={app.jobTitle}
                            >
                              {app.jobTitle}
                            </span>
                          </td>

                          {/* 3. Stage Column */}
                          <td className="py-3 px-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${getStageBadge(app.stage)}`}>
                              {app.stage}
                            </span>
                          </td>

                          {/* 4. Source Column */}
                          <td className="py-3 px-2 whitespace-nowrap">
                            <span
                              className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate block max-w-[130px]"
                              title={app.source}
                            >
                              {app.source}
                            </span>
                          </td>

                          {/* 5. Applied on Column */}
                          <td className="py-3 px-2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                            {app.appliedOn}
                          </td>

                          {/* 6. Status Column */}
                          <td className="py-3 px-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10.5px] font-semibold border ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </td>

                          {/* 7. Action Column: Favorite, Follow Up, Add to List, Delete */}
                          <td className={`py-3 pl-2 pr-3 text-center whitespace-nowrap relative ${openActionMenuId === app.id ? 'z-40' : ''}`}>
                            <div className="flex items-center justify-center gap-1">
                              {/* Favorite {Icon} */}
                              <button
                                type="button"
                                onClick={(e) => handleToggleFav(app, e)}
                                title={isItemFavorited('Application', app.id) ? 'Favorited (Click to remove)' : 'Add to Favorites'}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isItemFavorited('Application', app.id)
                                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                                    : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                }`}
                              >
                                <Star size={15} className={isItemFavorited('Application', app.id) ? 'fill-amber-400 text-amber-500' : ''} />
                              </button>

                              {/* Follow Up {Icon} */}
                              <button
                                type="button"
                                onClick={(e) => handleOpenFollowup(app, e)}
                                title={isItemFollowedUp('Application', app.id) ? 'Follow-up scheduled (Click to manage)' : 'Set Follow Up'}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isItemFollowedUp('Application', app.id)
                                    ? 'text-[#1890FF] bg-blue-50 dark:bg-blue-950/40'
                                    : 'text-gray-400 hover:text-[#1890FF] hover:bg-blue-50 dark:hover:bg-blue-950/30'
                                }`}
                              >
                                <CalendarClock size={15} />
                              </button>

                              {/* Kebab Menu Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenuId(openActionMenuId === app.id ? null : app.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                title="Actions"
                              >
                                <MoreVertical size={15} />
                              </button>

                              {/* Kebab Dropdown Menu */}
                              {openActionMenuId === app.id && (
                                <div className={`absolute right-0 ${index >= paginatedApplications.length - 2 && paginatedApplications.length > 2 ? 'bottom-full mb-1' : 'top-10 mt-1'} w-44 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1 animate-fade-in text-left`}>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSingleCandidateModal({ app, targetListId: availableLists[0]?.id || '' });
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                                  >
                                    <BookmarkPlus size={14} className="text-[#1890FF]" />
                                    <span>Add To List</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionMenuId(null);
                                      navigate(`/dashboard/candidates/${app.candidateId}`);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                                  >
                                    <User size={14} className="text-gray-500 dark:text-gray-400" />
                                    <span>View Profile</span>
                                  </button>

                                  <div className="my-1 border-t border-gray-100 dark:border-gray-800/60" />

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmModal(app);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={14} className="text-[#FF5630]" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 5. PAGINATION FOOTER                                           */}
          {/* ============================================================== */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span>
                Showing{' '}
                <span className="font-bold text-[#212b36] dark:text-white">
                  {filteredApplications.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                </span>{' '}
                to{' '}
                <span className="font-bold text-[#212b36] dark:text-white">
                  {Math.min(currentPage * pageSize, filteredApplications.length)}
                </span>{' '}
                of{' '}
                <span className="font-bold text-[#212b36] dark:text-white">
                  {filteredApplications.length}
                </span>{' '}
                applications
              </span>

              {/* Customized Dropdown for Per Page */}
              <div className="flex items-center gap-1.5 ml-2">
                <span>Per page:</span>
                <div className="w-28">
                  <SearchableSelect
                    options={pageSizeOptions}
                    value={pageSize}
                    onChange={(val) => {
                      setPageSize(Number(val));
                      setCurrentPage(1);
                    }}
                    size="xs"
                    showSearch={false}
                    placement="top"
                  />
                </div>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#1890FF] text-white shadow-xs'
                      : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161c24] font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. MODALS                                                      */}
      {/* ============================================================== */}

      {/* Single Candidate "Add to List" Modal with Customized Dropdown */}
      {singleCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center font-bold">
                  <BookmarkPlus size={17} />
                </div>
                <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                  Add to My List
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSingleCandidateModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Candidate:</span>
                <p className="text-sm font-bold text-[#212b36] dark:text-white mt-0.5">
                  {singleCandidateModal.app.candidateName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {singleCandidateModal.app.jobTitle} • {singleCandidateModal.app.department}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Select Target List
                </label>
                {/* Customized Searchable Select Dropdown */}
                <SearchableSelect
                  options={listSelectOptions}
                  value={singleCandidateModal.targetListId}
                  onChange={(val) =>
                    setSingleCandidateModal({ ...singleCandidateModal, targetListId: val })
                  }
                  placeholder="Select list from My List..."
                  searchPlaceholder="Search lists..."
                  size="default"
                  showSearch={true}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSingleCandidateModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSingleAddToList}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1890FF] text-white hover:bg-[#096dd9] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <BookmarkPlus size={14} />
                <span>Add to List</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Application Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                  Delete Application
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  This action will permanently delete this job application record.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl mb-5 text-xs text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 space-y-1">
              <p>
                <span className="font-semibold text-gray-500 dark:text-gray-400">Candidate:</span>{' '}
                <span className="font-bold text-[#212b36] dark:text-white">{deleteConfirmModal.candidateName}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-500 dark:text-gray-400">Job:</span>{' '}
                <span className="font-semibold">{deleteConfirmModal.jobTitle}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-500 dark:text-gray-400">Applied on:</span>{' '}
                <span>{deleteConfirmModal.appliedOn}</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteApplication}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Delete Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-Up Schedule Modal */}
      <FollowUpModal
        isOpen={Boolean(followUpTarget)}
        onClose={() => setFollowUpTarget(null)}
        targetItem={followUpTarget}
        onFollowupAdded={() => showToast('Follow-up reminder scheduled!')}
      />
    </div>
  );
}
