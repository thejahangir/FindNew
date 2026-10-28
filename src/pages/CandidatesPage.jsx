import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Bookmark,
  Search,
  Plus,
  Download,
  Sparkles,
  RotateCcw,
  Table,
  LayoutGrid,
  Star,
  CheckCircle2,
  Clock,
  UserX,
  X,
  AlertCircle,
  Briefcase,
  ListPlus,
  SquareMinus,
  ChevronDown, ChevronRight,
  ChevronUp,
  Eye,
  Trash2,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  SlidersHorizontal,
  CalendarClock,
  MoreVertical,
  User
} from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';
import CustomCheckbox from '../components/ui/CustomCheckbox';
import { useChatbot } from '../contexts/ChatbotContext';
import { getStoredLists, saveStoredLists } from '../data/candidateListsData';
import JobFilterPanel, { FILTER_DATA } from '../components/dashboard/JobFilterPanel';
import JobQuickFilterBar, { QUICK_PARAMETERS_DATA } from '../components/dashboard/JobQuickFilterBar';
import FollowUpModal from '../components/dashboard/FollowUpModal';
import MyListsPage from './MyListsPage';
import { isItemFavorited, toggleFavorite } from '../data/favoritesData';
import { isItemFollowedUp, isItemFollowed, toggleFollowItem } from '../data/followupsData';

const INITIAL_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'Senior AI Research Scientist',
    department: 'Engineering',
    company: 'Anthropic Labs',
    experience: '7 yrs exp',
    location: 'Bangalore, India',
    score: '9.8/10',
    numericScore: 9.8,
    stage: 'Technical Interview',
    date: '2 days ago',
    updated: 'Just now',
    source: 'TechTalent Partners',
    agency: 'TechTalent Partners',
    noticePeriod: '30 Days',
    skills: ['PyTorch', 'Transformers', 'LLMs', 'Python', 'NLP'],
    status: 'Active'
  },
  {
    id: 'cand-2',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98111 22334',
    role: 'Cloud Infrastructure Architect',
    department: 'Engineering',
    company: 'Databricks',
    experience: '8 yrs exp',
    location: 'San Francisco, CA',
    score: '9.6/10',
    numericScore: 9.6,
    stage: 'Culture Fit',
    date: '1 day ago',
    updated: '3 hours ago',
    source: 'LinkedIn Recruiter',
    agency: 'Direct Application',
    noticePeriod: 'Immediate',
    skills: ['AWS Cloud', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker'],
    status: 'Active'
  },
  {
    id: 'cand-3',
    name: 'Sneha Patil',
    email: 'sneha.patil@example.com',
    phone: '+91 99200 44556',
    role: 'Frontend Developer',
    department: 'Engineering',
    company: 'TCS Innovation Lab',
    experience: '4 yrs exp',
    location: 'Pune, India',
    score: '9.2/10',
    numericScore: 9.2,
    stage: 'Screening',
    date: '5 hours ago',
    updated: '1 hour ago',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: '15 Days',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Next.js'],
    status: 'Active'
  },
  {
    id: 'cand-4',
    name: 'Maya Chen',
    email: 'maya.chen@example.com',
    phone: '+1 415 555 0192',
    role: 'Product Design Lead',
    department: 'Design',
    company: 'Figma',
    experience: '7 yrs exp',
    location: 'San Francisco, CA',
    score: '9.4/10',
    numericScore: 9.4,
    stage: 'Technical Interview',
    date: '3 days ago',
    updated: 'Today',
    source: 'Vanguard Recruitment',
    agency: 'Vanguard Recruitment',
    noticePeriod: '30 Days',
    skills: ['Design Systems', 'Figma', 'UI/UX Design', 'Prototyping', 'User Research'],
    status: 'Active'
  },
  {
    id: 'cand-5',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@example.com',
    phone: '+91 98444 33221',
    role: 'Data Engineer',
    department: 'Engineering',
    company: 'Snowflake',
    experience: '5 yrs exp',
    location: 'Bangalore, India',
    score: '8.8/10',
    numericScore: 8.8,
    stage: 'Reference Check',
    date: '4 days ago',
    updated: '1 day ago',
    source: 'Employee Referral',
    agency: 'Direct Application',
    noticePeriod: '30 Days',
    skills: ['Apache Spark', 'Python', 'PostgreSQL', 'Airflow', 'Kafka'],
    status: 'Active'
  },
  {
    id: 'cand-6',
    name: 'Ankita Rao',
    email: 'ankita.rao@example.com',
    phone: '+91 97333 11223',
    role: 'Frontend Developer',
    department: 'Engineering',
    company: 'Flipkart',
    experience: '3 yrs exp',
    location: 'Hyderabad, India',
    score: '8.6/10',
    numericScore: 8.6,
    stage: 'Offer',
    date: '1 day ago',
    updated: '2 hours ago',
    source: 'Elite Hiring Solutions',
    agency: 'Elite Hiring Solutions',
    noticePeriod: 'Immediate',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Zustand', 'GraphQL'],
    status: 'Offer Pending'
  },
  {
    id: 'cand-7',
    name: 'Jordan Rivera',
    email: 'jordan.rivera@example.com',
    phone: '+1 650 555 0148',
    role: 'Product Design Lead',
    department: 'Design',
    company: 'Airbnb',
    experience: '5 yrs exp',
    location: 'New York, NY',
    score: '8.8/10',
    numericScore: 8.8,
    stage: 'Screening',
    date: '1 week ago',
    updated: '2 days ago',
    source: 'LinkedIn Recruiter',
    agency: 'Direct Application',
    noticePeriod: '30 Days',
    skills: ['B2B SaaS', 'Figma', 'User Testing', 'Wireframing'],
    status: 'Active'
  },
  {
    id: 'cand-8',
    name: 'Karan Mehra',
    email: 'karan.mehra@example.com',
    phone: '+91 98888 77665',
    role: 'DevOps Engineer',
    department: 'Engineering',
    company: 'Amazon AWS',
    experience: '6 yrs exp',
    location: 'Bangalore, India',
    score: '8.5/10',
    numericScore: 8.5,
    stage: 'Technical Interview',
    date: '1 day ago',
    updated: 'Today',
    source: 'TechTalent Partners',
    agency: 'TechTalent Partners',
    noticePeriod: '15 Days',
    skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'AWS', 'Prometheus'],
    status: 'Active'
  },
  {
    id: 'cand-9',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 91234 56789',
    role: 'Growth Marketing Manager',
    department: 'Marketing',
    company: 'Stripe',
    experience: '5 yrs exp',
    location: 'London, UK',
    score: '8.4/10',
    numericScore: 8.4,
    stage: 'Application Review',
    date: '5 hours ago',
    updated: '4 hours ago',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: '30 Days',
    skills: ['Growth Loops', 'SEO/SEM', 'A/B Testing', 'Meta Ads', 'SQL'],
    status: 'Active'
  },
  {
    id: 'cand-10',
    name: 'Ravi Desai',
    email: 'ravi.desai@example.com',
    phone: '+91 94555 66778',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    company: 'Infosys',
    experience: '5 yrs exp',
    location: 'Bangalore, India',
    score: '8.2/10',
    numericScore: 8.2,
    stage: 'Applied',
    date: '2 hours ago',
    updated: '30 mins ago',
    source: 'Global Recruiters Inc.',
    agency: 'Global Recruiters Inc.',
    noticePeriod: '30 Days',
    skills: ['Node.js', 'React', 'MongoDB', 'Express', 'TypeScript'],
    status: 'Active'
  },
  {
    id: 'cand-11',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@example.com',
    phone: '+91 98777 22110',
    role: 'Senior AI Research Scientist',
    department: 'Engineering',
    company: 'Google DeepMind',
    experience: '6 yrs exp',
    location: 'Bangalore, India',
    score: '9.5/10',
    numericScore: 9.5,
    stage: 'Culture Fit',
    date: '1 day ago',
    updated: '5 hours ago',
    source: 'Employee Referral',
    agency: 'Direct Application',
    noticePeriod: 'Immediate',
    skills: ['Deep Learning', 'PyTorch', 'Reinforcement Learning', 'JAX', 'C++'],
    status: 'Active'
  },
  {
    id: 'cand-12',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1 212 555 0184',
    role: 'VP of Marketing',
    department: 'Marketing',
    company: 'Uber',
    experience: '11 yrs exp',
    location: 'New York, NY',
    score: '9.1/10',
    numericScore: 9.1,
    stage: 'Offer',
    date: '3 days ago',
    updated: '1 day ago',
    source: 'Executive Sourcing',
    agency: 'Direct Application',
    noticePeriod: '60 Days',
    skills: ['Brand Strategy', 'Demand Gen', 'P&L Management', 'Global Teams'],
    status: 'Offer Pending'
  },
  {
    id: 'cand-13',
    name: 'Divya Singh',
    email: 'divya.singh@example.com',
    phone: '+91 99111 88223',
    role: 'Data Engineer',
    department: 'Engineering',
    company: 'Swiggy',
    experience: '4 yrs exp',
    location: 'Bangalore, India',
    score: '8.3/10',
    numericScore: 8.3,
    stage: 'Technical Interview',
    date: '3 days ago',
    updated: '2 days ago',
    source: 'LinkedIn Recruiter',
    agency: 'Direct Application',
    noticePeriod: '15 Days',
    skills: ['Python', 'SQL', 'Snowflake', 'dbt', 'Airflow'],
    status: 'Active'
  },
  {
    id: 'cand-14',
    name: 'Rohit Joshi',
    email: 'rohit.joshi@example.com',
    phone: '+91 98222 33445',
    role: 'Cloud Infrastructure Architect',
    department: 'Engineering',
    company: 'Microsoft',
    experience: '9 yrs exp',
    location: 'Seattle, WA',
    score: '8.9/10',
    numericScore: 8.9,
    stage: 'Hired',
    date: '1 week ago',
    updated: '3 days ago',
    source: 'NextGen Staffing',
    agency: 'NextGen Staffing',
    noticePeriod: 'Immediate',
    skills: ['Azure Cloud', 'Terraform', 'Kubernetes', 'Security', 'Enterprise Architecture'],
    status: 'Hired'
  },
  {
    id: 'cand-15',
    name: 'Varun Khanna',
    email: 'varun.khanna@example.com',
    phone: '+91 93333 44556',
    role: 'Frontend Developer',
    department: 'Engineering',
    company: 'Freelance / Startup',
    experience: '2 yrs exp',
    location: 'Remote',
    score: '7.8/10',
    numericScore: 7.8,
    stage: 'Applied',
    date: '2 days ago',
    updated: 'Today',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: 'Immediate',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind'],
    status: 'Active'
  },
  {
    id: 'cand-16',
    name: 'Kavita Das',
    email: 'kavita.das@example.com',
    phone: '+91 97777 66554',
    role: 'Product Design Lead',
    department: 'Design',
    company: 'Razorpay',
    experience: '6 yrs exp',
    location: 'Bangalore, India',
    score: '8.7/10',
    numericScore: 8.7,
    stage: 'Reference Check',
    date: '2 weeks ago',
    updated: '4 days ago',
    source: 'Vanguard Recruitment',
    agency: 'Vanguard Recruitment',
    noticePeriod: '30 Days',
    skills: ['Fintech UX', 'Figma', 'Design Ops', 'User Journeys'],
    status: 'Active'
  },
  {
    id: 'cand-17',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 98333 44556',
    role: 'DevOps Engineer',
    department: 'Engineering',
    company: 'Zomato',
    experience: '5 yrs exp',
    location: 'Bangalore, India',
    score: '8.1/10',
    numericScore: 8.1,
    stage: 'Technical Interview',
    date: '3 days ago',
    updated: 'Yesterday',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: '30 Days',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
    status: 'On Hold'
  },
  {
    id: 'cand-18',
    name: 'Tanya Sengupta',
    email: 'tanya.s@example.com',
    phone: '+91 97111 22334',
    role: 'Frontend Developer',
    department: 'Engineering',
    company: 'Freshworks',
    experience: '2 yrs exp',
    location: 'Pune, India',
    score: '7.4/10',
    numericScore: 7.4,
    stage: 'Rejected',
    date: '4 days ago',
    updated: '2 days ago',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: 'Immediate',
    skills: ['React', 'JavaScript', 'CSS', 'Redux'],
    status: 'Archived'
  }
];

export default function CandidatesPage({ defaultTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeViewParam = searchParams.get('view') || 'all';
  const { compareCandidates } = useChatbot();

  // Tab switching between 'candidates' and 'my-lists'
  const isMyListsRoute = location.pathname.includes('/dashboard/my-lists');
  const [activeTab, setActiveTab] = useState(() => {
    if (defaultTab) return defaultTab;
    return isMyListsRoute ? 'my-lists' : 'candidates';
  });

  const [externalOpenCreateList, setExternalOpenCreateList] = useState(false);
  const [storedListsCount, setStoredListsCount] = useState(() => getStoredLists().length);

  // Sync list count in real-time
  useEffect(() => {
    const syncLists = () => {
      setStoredListsCount(getStoredLists().length);
    };
    window.addEventListener('storage', syncLists);
    window.addEventListener('candidate-lists-updated', syncLists);
    return () => {
      window.removeEventListener('storage', syncLists);
      window.removeEventListener('candidate-lists-updated', syncLists);
    };
  }, []);

  // Sync activeTab if location.pathname changes externally
  useEffect(() => {
    if (location.pathname.includes('/dashboard/my-lists')) {
      setActiveTab('my-lists');
    } else if (location.pathname.includes('/dashboard/candidates')) {
      setActiveTab('candidates');
    }
  }, [location.pathname]);

  const handleSwitchView = (targetTab) => {
    if (targetTab === activeTab) return;
    setActiveTab(targetTab);
    const targetPath = targetTab === 'my-lists' ? '/dashboard/my-lists' : '/dashboard/candidates';
    navigate(targetPath, { replace: true });
  };

  // Candidates state
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [isPanelDismissed, setIsPanelDismissed] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  // Favorites & Follow-Up states & sync
  const [followUpTarget, setFollowUpTarget] = useState(null);
  const [favRefreshKey, setFavRefreshKey] = useState(0);

  const favoritedCandidatesCount = useMemo(() => candidates.filter(c => isItemFavorited('Candidate', c.id)).length, [candidates, favRefreshKey]);
  const followedCandidatesCount = useMemo(() => candidates.filter(c => isItemFollowedUp('Candidate', c.id)).length, [candidates, favRefreshKey]);

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

  const [unfavConfirmCand, setUnfavConfirmCand] = useState(null);

  const handleToggleFav = (cand, e) => {
    if (e) e.stopPropagation();
    if (isItemFavorited('Candidate', cand.id)) {
      setUnfavConfirmCand(cand);
      return;
    }
    handleOpenAddToListModal([cand.id], cand.name);
  };

  const handleConfirmUnfavCand = () => {
    if (!unfavConfirmCand) return;
    const cand = unfavConfirmCand;
    if (isItemFavorited('Candidate', cand.id)) {
      toggleFavorite({
        relatedId: cand.id,
        title: cand.name,
        type: 'Candidate'
      });
      setFavRefreshKey(k => k + 1);
      showToast(`Removed "${cand.name}" from Favourites.`);
    }
    setUnfavConfirmCand(null);
  };

  const [followConfirmation, setFollowConfirmation] = useState(null);
  const followConfirmTimerRef = useRef(null);

  const handleToggleFollow = (cand, e) => {
    if (e) e.stopPropagation();
    const res = toggleFollowItem({
      relatedId: cand.id,
      type: 'Candidate',
      title: cand.name,
      subject: `Candidate: ${cand.name} (${cand.role})`,
      meta: `${cand.role} • ${cand.company || cand.department}`
    });

    if (followConfirmTimerRef.current) clearTimeout(followConfirmTimerRef.current);

    setFollowConfirmation({
      name: cand.name,
      isUnfollow: !res.isFollowed,
      message: res.isFollowed
        ? 'You will be getting all notification of all activity.'
        : 'You will no longer receive activity notifications.'
    });

    followConfirmTimerRef.current = setTimeout(() => {
      setFollowConfirmation(null);
    }, 4500);
  };

  const handleOpenFollowup = (cand, e) => {
    handleToggleFollow(cand, e);
  };

  // Floating Action Panel batch actions & display
  const displayCount = selectedCandidateIds.length;

  const handleBatchAddToFavorites = () => {
    let addedCount = 0;
    selectedCandidateIds.forEach(id => {
      const cand = candidates.find(c => c.id === id);
      if (cand && !isItemFavorited('Candidate', cand.id)) {
        toggleFavorite({
          relatedId: cand.id,
          title: cand.name,
          type: 'Candidate',
          meta: `${cand.role} • ${cand.company || cand.department}`,
          path: `/dashboard/candidates/${cand.id}`,
          tag: cand.stage || 'Shortlisted'
        });
        addedCount++;
      }
    });
    setFavRefreshKey(k => k + 1);
    showToast(
      addedCount > 0
        ? `Added ${addedCount} candidate${addedCount > 1 ? 's' : ''} to Favourites!`
        : `Selected candidate(s) are already in Favourites!`
    );
  };

  const rightPanelRef = useRef(null);
  const base10CandidatesHeightRef = useRef({ grid: 980, table: 980 });
  const [filterPanelHeight, setFilterPanelHeight] = useState(980);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenActionMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Always reset panel dismissal when candidate selection changes
  useEffect(() => {
    setIsPanelDismissed(false);
  }, [selectedCandidateIds]);

  // Selected filters for left JobFilterPanel
  const [selectedFilters, setSelectedFilters] = useState({
    department: [],
    favouriteList: [],
    position: [],
    location: [],
    experience: [],
    company: [],
    employmentType: [],
    workMode: [],
    aiHealth: [],
    posted: []
  });

  const allCandidateLists = useMemo(() => getStoredLists(), [favRefreshKey, storedListsCount]);

  const favouriteListItems = useMemo(() => {
    return allCandidateLists.map(list => ({
      id: list.id,
      label: list.name,
      count: (list.candidateIds || []).length
    }));
  }, [allCandidateLists]);

  // When user lands via filter drawer on right side (activeViewParam === 'favorites'),
  // select ALL favourite lists so all favourite items are shown with all checkboxes checked.
  useEffect(() => {
    if (activeViewParam === 'favorites') {
      const allListIds = allCandidateLists.map(l => l.id);
      setSelectedFilters(prev => ({
        ...prev,
        favouriteList: allListIds
      }));
    }
  }, [activeViewParam, allCandidateLists]);

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
      favouriteList: [],
      position: [],
      location: [],
      experience: [],
      company: [],
      employmentType: [],
      workMode: [],
      aiHealth: [],
      posted: []
    });
    if (activeViewParam === 'favorites') {
      handleViewFilterChange('all');
    }
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
    setSortBy('recommended');
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCandidateData, setNewCandidateData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Senior AI Research Scientist',
    company: '',
    experience: '3 yrs exp',
    location: 'Bangalore, India',
    source: 'Direct Careers',
    stage: 'Applied',
    skills: ''
  });

  const [rejectModalData, setRejectModalData] = useState({
    isOpen: false,
    candidateIds: [],
    candidateName: '',
    reason: 'Skills mismatch'
  });

  const [addToJobModal, setAddToJobModal] = useState({
    isOpen: false,
    candidateIds: [],
    candidateName: '',
    targetJob: 'Senior AI Research Scientist',
    targetStage: 'Screening',
    notes: ''
  });

  // Candidate Lists State & Modal
  const [candidateLists, setCandidateLists] = useState(() => {
    const stored = getStoredLists();
    return stored.map(l => l.name);
  });

  const [addToListModal, setAddToListModal] = useState({
    isOpen: false,
    candidateIds: [],
    candidateName: '',
    targetList: 'Shortlisted Talent (Q4)',
    isCreatingNew: false,
    newListName: ''
  });

  // Quick View Modal State
  const [quickViewCandidate, setQuickViewCandidate] = useState(null);

  // Delete Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    candidateId: null,
    candidateName: ''
  });

  // Table Column Visibility State: Location, Notice Period, Match Score, Status, and Profile Updated removed by default
  const DEFAULT_COLUMN_VISIBILITY = useMemo(() => ({
    candidate: true,
    role: true,
    location: false,
    experience: true,
    noticePeriod: false,
    status: false,
    applied: true,
    matchScore: false,
    stage: true,
    source: true,
    updated: false,
    action: true
  }), []);

  const [columnVisibility, setColumnVisibility] = useState(DEFAULT_COLUMN_VISIBILITY);
  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
  const columnPickerRef = useRef(null);

  // Close column picker on outside click
  useEffect(() => {
    function handleClickOutsidePicker(event) {
      if (columnPickerRef.current && !columnPickerRef.current.contains(event.target)) {
        setIsColumnPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutsidePicker);
    return () => document.removeEventListener('mousedown', handleClickOutsidePicker);
  }, []);

  const columnOptions = [
    { key: 'candidate', label: 'Candidate', description: 'Name, avatar & email', required: true },
    { key: 'role', label: 'Role Applied', description: 'Role & department' },
    { key: 'experience', label: 'Experience & Company', description: 'Company & tenure' },
    { key: 'applied', label: 'Applied', description: 'Application date' },
    { key: 'stage', label: 'Pipeline Stage', description: 'Interview & hiring stage' },
    { key: 'source', label: 'Source', description: 'Source channel / agency' },
    { key: 'updated', label: 'Profile Updated', description: 'Last profile activity' },
    { key: 'location', label: 'Location', description: 'City & location' },
    { key: 'noticePeriod', label: 'Notice Period', description: 'Availability timeframe' },
    { key: 'status', label: 'Status', description: 'Active / Offer / On Hold' },
    { key: 'matchScore', label: 'Match Score', description: 'AI candidate match score' }
  ];

  const stageOptions = [
    { label: 'Screening', value: 'Screening' },
    { label: 'Applied', value: 'Applied' },
    { label: 'Technical Interview', value: 'Technical Interview' },
    { label: 'Culture Fit', value: 'Culture Fit' },
    { label: 'Reference Check', value: 'Reference Check' },
    { label: 'Offer', value: 'Offer' },
    { label: 'Hired', value: 'Hired' }
  ];

  const appliedJobFilterOptions = useMemo(() => {
    const roles = Array.from(new Set(candidates.map(c => c.role).filter(Boolean)));
    return [
      { label: 'All Roles', value: 'All' },
      ...roles.map(r => ({ label: r, value: r }))
    ];
  }, [candidates]);

  const sourceFilterOptions = useMemo(() => {
    const sources = Array.from(new Set(candidates.map(c => c.source).filter(Boolean)));
    return [
      { label: 'All Sources', value: 'All' },
      ...sources.map(s => ({ label: s, value: s }))
    ];
  }, [candidates]);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Candidate Sort Options matching JobQuickFilterBar
  const CANDIDATE_SORT_OPTIONS = [
    { value: 'recommended', label: 'Recommended (AI Score)' },
    { value: 'score_desc', label: 'Highest AI Score' },
    { value: 'score_asc', label: 'Lowest AI Score' },
    { value: 'name_asc', label: 'Candidate Name (A – Z)' },
    { value: 'name_desc', label: 'Candidate Name (Z – A)' },
    { value: 'newest', label: 'Recently Added' },
    { value: 'experience_desc', label: 'Most Experienced' }
  ];

  // Dynamic Horizontal Filter Parameters Data with Real Counts (matching List of Jobs style)
  const dynamicQuickParameters = useMemo(() => {
    const activeCount = candidates.filter(c => c.status === 'Active').length;
    const needsReviewCount = candidates.filter(c => ['Applied', 'Application Review'].includes(c.stage) || c.status === 'Needs Review').length;
    const interviewCount = candidates.filter(c => ['Screening', 'Technical Interview', 'Culture Fit', 'Reference Check'].includes(c.stage)).length;
    const offerCount = candidates.filter(c => c.status === 'Offer Pending' || c.stage === 'Offer').length;
    const hiredCount = candidates.filter(c => c.status === 'Hired' || c.stage === 'Hired').length;
    const onHoldCount = candidates.filter(c => c.status === 'On Hold').length;
    const archivedCount = candidates.filter(c => c.status === 'Archived' || c.stage === 'Rejected').length;

    // Dynamic skills from candidates
    const skillFreq = {};
    candidates.forEach(c => {
      (c.skills || []).forEach(s => {
        skillFreq[s] = (skillFreq[s] || 0) + 1;
      });
    });
    const dynamicSkills = Object.entries(skillFreq)
      .sort((a, b) => b[1] - a[1])
      .map(([s, count]) => ({ id: s, label: s, count }));

    // Dynamic sources from candidates
    const sourceFreq = {};
    candidates.forEach(c => {
      if (c.source) {
        sourceFreq[c.source] = (sourceFreq[c.source] || 0) + 1;
      }
    });
    const dynamicSources = Object.entries(sourceFreq)
      .sort((a, b) => b[1] - a[1])
      .map(([src, count]) => ({ id: src, label: src, count }));

    // Notice Period counts
    const immCount = candidates.filter(c => (c.noticePeriod || '').toLowerCase().includes('imm')).length;
    const np15Count = candidates.filter(c => (c.noticePeriod || '').includes('15')).length;
    const np30Count = candidates.filter(c => (c.noticePeriod || '').includes('30')).length;
    const np60Count = candidates.filter(c => (c.noticePeriod || '').includes('60')).length;

    return {
      ...QUICK_PARAMETERS_DATA,
      status: [
        { id: 'Active', label: 'Active', count: activeCount, colorDot: 'bg-[#00A76F]' },
        { id: 'Needs Review', label: 'Needs Review', count: needsReviewCount, colorDot: 'bg-[#1890FF]' },
        { id: 'In Interviews', label: 'In Interviews', count: interviewCount, colorDot: 'bg-[#8E33FF]' },
        { id: 'Offer Pending', label: 'Offer Pending', count: offerCount, colorDot: 'bg-emerald-500' },
        { id: 'Hired', label: 'Hired', count: hiredCount, colorDot: 'bg-green-600' },
        { id: 'On Hold', label: 'On Hold', count: onHoldCount, colorDot: 'bg-[#FFAB00]' },
        { id: 'Archived', label: 'Archived / Rejected', count: archivedCount, colorDot: 'bg-[#FF5630]' }
      ],
      skills: dynamicSkills.length > 0 ? dynamicSkills : QUICK_PARAMETERS_DATA.skills,
      topSource: dynamicSources.length > 0 ? dynamicSources : QUICK_PARAMETERS_DATA.topSource,
      noticePeriod: [
        { id: 'Immediate', label: 'Immediate Joiner (< 15 days)', count: immCount },
        { id: '15 Days', label: '15 Days Notice', count: np15Count },
        { id: '30 Days', label: '30 Days Notice', count: np30Count },
        { id: '60 Days', label: '60 Days Notice', count: np60Count }
      ]
    };
  }, [candidates]);

  // Filtering Logic
  const filteredCandidates = useMemo(() => {
    const list = candidates.filter(cand => {
      // View Mode Filter (all | favorites | followups)
      if (activeViewParam === 'favorites' && !isItemFavorited('Candidate', cand.id)) {
        return false;
      }
      if (activeViewParam === 'followups' && !isItemFollowedUp('Candidate', cand.id)) {
        return false;
      }

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = cand.name?.toLowerCase().includes(q);
        const matchesEmail = cand.email?.toLowerCase().includes(q);
        const matchesRole = cand.role?.toLowerCase().includes(q);
        const matchesCompany = cand.company?.toLowerCase().includes(q);
        const matchesLocation = cand.location?.toLowerCase().includes(q);
        const matchesSkills = cand.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesRole && !matchesCompany && !matchesLocation && !matchesSkills) {
          return false;
        }
      }

      // 2. Quick Filters - Status
      if (quickFilters.status && quickFilters.status.length > 0) {
        const matchesStatus = quickFilters.status.some(st => {
          if (st === 'Active' || st === 'Open') return cand.status === 'Active';
          if (st === 'Needs Review' || st === 'Draft') return ['Applied', 'Application Review'].includes(cand.stage) || cand.status === 'Needs Review';
          if (st === 'In Interviews') return ['Screening', 'Technical Interview', 'Culture Fit', 'Reference Check'].includes(cand.stage);
          if (st === 'Offer Pending') return cand.status === 'Offer Pending' || cand.stage === 'Offer';
          if (st === 'Hired') return cand.status === 'Hired' || cand.stage === 'Hired';
          if (st === 'On Hold') return cand.status === 'On Hold';
          if (st === 'Archived' || st === 'Closed') return cand.status === 'Archived' || cand.stage === 'Rejected';
          return cand.status === st;
        });
        if (!matchesStatus) return false;
      }

      // 3. Quick Filters - Skills
      if (quickFilters.skills && quickFilters.skills.length > 0) {
        const activeSkillLabels = quickFilters.skills.map(s => {
          const found = dynamicQuickParameters.skills?.find(sk => sk.id === s);
          return (found ? found.label : s).toLowerCase();
        });
        const matchesSkills = activeSkillLabels.some(sLbl =>
          cand.skills && cand.skills.some(cs => cs.toLowerCase().includes(sLbl) || sLbl.includes(cs.toLowerCase()))
        );
        if (!matchesSkills) return false;
      }

      // 4. Quick Filters - Top Source
      if (quickFilters.topSource && quickFilters.topSource.length > 0) {
        const activeSources = quickFilters.topSource.map(s => {
          const found = dynamicQuickParameters.topSource?.find(src => src.id === s);
          return (found ? found.label : s).toLowerCase();
        });
        const matchesSource = activeSources.some(src =>
          cand.source && (cand.source.toLowerCase().includes(src) || src.includes(cand.source.toLowerCase()))
        );
        if (!matchesSource) return false;
      }

      // 5. Quick Filters - Notice Period
      if (quickFilters.noticePeriod && quickFilters.noticePeriod.length > 0) {
        const matchesNotice = quickFilters.noticePeriod.some(np => {
          const cNotice = (cand.noticePeriod || '').toLowerCase();
          if (np === 'Immediate' || np === 'np-imm') return cNotice.includes('imm');
          if (np === '15 Days' || np === 'np-30') return cNotice.includes('15') || cNotice.includes('30');
          if (np === '30 Days') return cNotice.includes('30');
          if (np === '60 Days' || np === 'np-60') return cNotice.includes('60');
          if (np === '90 Days' || np === 'np-90') return cNotice.includes('90');
          return cNotice.includes(np.toLowerCase());
        });
        if (!matchesNotice) return false;
      }

      // 6. Quick Filters - Priority
      if (quickFilters.priority && quickFilters.priority.length > 0) {
        const matchesPriority = quickFilters.priority.some(p => {
          if (p === 'p-urgent') return cand.numericScore >= 9.5;
          if (p === 'p-high') return cand.numericScore >= 9.0;
          if (p === 'p-medium') return cand.numericScore >= 8.0 && cand.numericScore < 9.0;
          if (p === 'p-low') return cand.numericScore < 8.0;
          return true;
        });
        if (!matchesPriority) return false;
      }

      // 7. Left Filter Panel - Department
      if (selectedFilters.department && selectedFilters.department.length > 0) {
        const activeDepts = FILTER_DATA.department
          .filter(d => selectedFilters.department.includes(d.id))
          .map(d => d.label.toLowerCase());
        const matchesDept = activeDepts.some(lbl =>
          cand.department && (lbl.includes(cand.department.toLowerCase()) || cand.department.toLowerCase().includes(lbl.split(' ')[0]))
        );
        if (!matchesDept) return false;
      }

      // 7.5 Left Filter Panel - Favourite List
      if (selectedFilters.favouriteList && selectedFilters.favouriteList.length > 0) {
        const matchesFavList = selectedFilters.favouriteList.some(listId => {
          const list = allCandidateLists.find(l => l.id === listId || l.name === listId);
          return list && list.candidateIds && list.candidateIds.some(cid => 
            String(cid) === String(cand.id) || String(cid) === `cand-${cand.id}` || String(cand.id) === `cand-${cid}`
          );
        });
        if (!matchesFavList) return false;
      }

      // 8. Left Filter Panel - Position
      if (selectedFilters.position && selectedFilters.position.length > 0) {
        const activePositions = FILTER_DATA.position
          .filter(p => selectedFilters.position.includes(p.id))
          .map(p => p.label.toLowerCase());
        const matchesPos = activePositions.some(lbl =>
          cand.role && (lbl.includes(cand.role.toLowerCase()) || cand.role.toLowerCase().includes(lbl.split(' ')[0]))
        );
        if (!matchesPos) return false;
      }

      // 9. Left Filter Panel - Location
      if (selectedFilters.location && selectedFilters.location.length > 0) {
        const activeLocs = FILTER_DATA.location
          .filter(l => selectedFilters.location.includes(l.id))
          .map(l => l.label.toLowerCase());
        const matchesLoc = activeLocs.some(lbl =>
          cand.location && (lbl.includes(cand.location.toLowerCase()) || cand.location.toLowerCase().includes(lbl.split(',')[0].toLowerCase()))
        );
        if (!matchesLoc) return false;
      }

      // 10. Left Filter Panel - Experience
      if (selectedFilters.experience && selectedFilters.experience.length > 0) {
        const match = cand.experience?.match(/\d+/);
        const years = match ? parseInt(match[0], 10) : 0;
        const matchesExp = selectedFilters.experience.some(expId => {
          if (expId === 'exp-entry' || expId === 'exp-grad' || expId === 'exp-intern') return years <= 1;
          if (expId === 'exp-jr' || expId === 'exp-assoc') return years >= 1 && years <= 3;
          if (expId === 'exp-mid' || expId === 'exp-spec') return years >= 3 && years <= 5;
          if (expId === 'exp-sr' || expId === 'exp-srspec') return years >= 5 && years <= 8;
          if (expId === 'exp-lead' || expId === 'exp-srstaff') return years >= 8 && years <= 10;
          if (expId === 'exp-prin' || expId === 'exp-dir' || expId === 'exp-vp' || expId === 'exp-head' || expId === 'exp-cxo' || expId === 'exp-fellow') return years >= 10;
          return true;
        });
        if (!matchesExp) return false;
      }

      // 11. Left Filter Panel - Company
      if (selectedFilters.company && selectedFilters.company.length > 0) {
        const activeCompanies = FILTER_DATA.company
          .filter(c => selectedFilters.company.includes(c.id))
          .map(c => c.label.toLowerCase());
        const matchesComp = activeCompanies.some(lbl =>
          cand.company && (lbl.includes(cand.company.toLowerCase()) || cand.company.toLowerCase().includes(lbl.split(' ')[0].toLowerCase()))
        );
        if (!matchesComp) return false;
      }

      // 12. Left Filter Panel - Work Mode
      if (selectedFilters.workMode && selectedFilters.workMode.length > 0) {
        const matchesWork = selectedFilters.workMode.some(wm => {
          if (wm === 'wm-remote') return (cand.location || '').toLowerCase().includes('remote');
          if (wm === 'wm-hybrid') return (cand.location || '').toLowerCase().includes('hybrid') || !(cand.location || '').toLowerCase().includes('remote');
          if (wm === 'wm-onsite') return !(cand.location || '').toLowerCase().includes('remote');
          return true;
        });
        if (!matchesWork) return false;
      }

      // 13. Left Filter Panel - AI Health
      if (selectedFilters.aiHealth && selectedFilters.aiHealth.length > 0) {
        const matchesHealth = selectedFilters.aiHealth.some(h => {
          if (h === 'aih-fast' || h === 'aih-qual' || h === 'aih-top') return cand.numericScore >= 9.0;
          if (h === 'aih-sla' || h === 'aih-triage') return cand.numericScore >= 8.0;
          if (h === 'aih-risk' || h === 'aih-drop') return cand.numericScore < 8.0;
          return true;
        });
        if (!matchesHealth) return false;
      }

      return true;
    });

    // Apply Sorting
    return list.sort((a, b) => {
      switch (sortBy) {
        case 'score_desc':
          return (b.numericScore || 0) - (a.numericScore || 0);
        case 'score_asc':
          return (a.numericScore || 0) - (b.numericScore || 0);
        case 'name_asc':
        case 'title_asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name_desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'newest':
          return (b.id || '').localeCompare(a.id || '');
        case 'oldest':
          return (a.id || '').localeCompare(b.id || '');
        case 'experience_desc': {
          const yA = parseInt(a.experience?.match(/\d+/)?.[0] || '0', 10);
          const yB = parseInt(b.experience?.match(/\d+/)?.[0] || '0', 10);
          return yB - yA;
        }
        case 'recommended':
        default:
          return (b.numericScore || 0) - (a.numericScore || 0);
      }
    });
  }, [candidates, searchQuery, quickFilters, selectedFilters, sortBy, dynamicQuickParameters, activeViewParam, favRefreshKey, allCandidateLists]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / itemsPerPage));
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Maintain Left Filter Panel height fixed to the benchmark height of the candidate list with 10 candidates.
  // When applying filters and the candidate list gets smaller, height of the filter is NOT reduced.
  useEffect(() => {
    if (!rightPanelRef.current) return;

    const measureHeight = () => {
      if (window.innerWidth >= 1024 && rightPanelRef.current) {
        const currentH = rightPanelRef.current.offsetHeight;

        if (paginatedCandidates.length >= 10 || !base10CandidatesHeightRef.current[viewMode]) {
          if (currentH > 400) {
            base10CandidatesHeightRef.current[viewMode] = Math.max(
              base10CandidatesHeightRef.current[viewMode] || 0,
              currentH
            );
          }
        }

        const benchmarkHeight = base10CandidatesHeightRef.current[viewMode] || 980;
        setFilterPanelHeight(Math.max(benchmarkHeight, currentH));
      } else {
        setFilterPanelHeight(null);
      }
    };

    const timer = setTimeout(measureHeight, 60);

    const observer = new ResizeObserver(() => {
      measureHeight();
    });

    observer.observe(rightPanelRef.current);
    window.addEventListener('resize', measureHeight);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', measureHeight);
    };
  }, [paginatedCandidates.length, viewMode]);

  // Checkbox selection
  const isAllSelected = paginatedCandidates.length > 0 && paginatedCandidates.every(c => selectedCandidateIds.includes(c.id));
  const isIndeterminate = paginatedCandidates.some(c => selectedCandidateIds.includes(c.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    setIsPanelDismissed(false);
    if (isAllSelected) {
      setSelectedCandidateIds(prev => prev.filter(id => !paginatedCandidates.some(c => c.id === id)));
    } else {
      const pageIds = paginatedCandidates.map(c => c.id);
      setSelectedCandidateIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectCandidate = (id) => {
    setIsPanelDismissed(false);
    setSelectedCandidateIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Active filters check
  const hasActiveFilters = searchQuery.trim() !== '' ||
    Object.values(selectedFilters).some(arr => Array.isArray(arr) && arr.length > 0) ||
    Object.values(quickFilters).some(arr => Array.isArray(arr) && arr.length > 0);

  const handleClearFilters = handleResetFilters;

  // Compare with AI
  const handleCompareWithAI = () => {
    const selectedObjs = candidates.filter(c => selectedCandidateIds.includes(c.id));
    if (selectedObjs.length < 2) {
      showToast('Select at least 2 candidates to compare');
      return;
    }
    compareCandidates(selectedObjs);
    showToast(`Comparing ${selectedObjs.length} candidates in FindNeo AI Assistant`);
  };

  // Navigate to profile
  const handleViewProfile = (candidate) => {
    navigate(`/dashboard/candidates/${candidate.id}`, {
      state: {
        candidate,
        from: { name: 'Candidates', path: '/dashboard/candidates' }
      }
    });
  };

  // Add Candidate
  const handleAddCandidateSubmit = (e) => {
    e.preventDefault();
    if (!newCandidateData.name.trim()) return;

    const newCand = {
      id: `cand-${Date.now()}`,
      name: newCandidateData.name,
      email: newCandidateData.email || `${newCandidateData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newCandidateData.phone || '+91 98000 00000',
      role: newCandidateData.role,
      department: 'Engineering',
      company: newCandidateData.company || 'Independent',
      experience: newCandidateData.experience,
      location: newCandidateData.location,
      score: '8.5/10',
      numericScore: 8.5,
      stage: newCandidateData.stage,
      date: 'Just now',
      updated: 'Just now',
      source: newCandidateData.source,
      agency: newCandidateData.source.includes('Partners') ? newCandidateData.source : 'Direct Application',
      noticePeriod: '30 Days',
      skills: newCandidateData.skills ? newCandidateData.skills.split(',').map(s => s.trim()) : ['React', 'TypeScript', 'Node.js'],
      status: 'Active'
    };

    setCandidates(prev => [newCand, ...prev]);
    setIsAddModalOpen(false);
    setNewCandidateData({
      name: '',
      email: '',
      phone: '',
      role: 'Senior AI Research Scientist',
      company: '',
      experience: '3 yrs exp',
      location: 'Bangalore, India',
      source: 'Direct Careers',
      stage: 'Applied',
      skills: ''
    });
    showToast(`Candidate "${newCand.name}" added successfully!`);
  };

  // Reject Candidate
  const handleOpenRejectModal = (candidateIds, name) => {
    setRejectModalData({
      isOpen: true,
      candidateIds,
      candidateName: name,
      reason: 'Skills mismatch'
    });
  };

  const handleConfirmReject = () => {
    setCandidates(prev => prev.map(c => {
      if (rejectModalData.candidateIds.includes(c.id)) {
        return { ...c, stage: 'Rejected', status: 'Archived' };
      }
      return c;
    }));
    setSelectedCandidateIds(prev => prev.filter(id => !rejectModalData.candidateIds.includes(id)));
    setRejectModalData({ isOpen: false, candidateIds: [], candidateName: '', reason: '' });
    showToast('Candidate(s) moved to Rejected');
  };

  // Add to Job
  const handleOpenAddToJobModal = (candidateIds = [], name = '') => {
    let resolvedName = name;
    if (!resolvedName && candidateIds.length === 1) {
      const found = candidates.find(c => c.id === candidateIds[0]);
      if (found) resolvedName = found.name;
    }
    setAddToJobModal({
      isOpen: true,
      candidateIds,
      candidateName: resolvedName || (candidateIds.length > 1 ? `${candidateIds.length} Candidates` : ''),
      targetJob: 'Senior AI Research Scientist',
      targetStage: 'Screening',
      notes: ''
    });
  };

  const handleConfirmAddToJob = (e) => {
    e?.preventDefault?.();
    if (!addToJobModal.targetJob) {
      showToast('Please select a target job');
      return;
    }

    if (!addToJobModal.candidateIds || addToJobModal.candidateIds.length === 0) {
      showToast('Please select at least one candidate to add');
      return;
    }

    setCandidates(prev => prev.map(c => {
      if (addToJobModal.candidateIds.includes(c.id)) {
        return {
          ...c,
          role: addToJobModal.targetJob,
          stage: addToJobModal.targetStage || 'Screening',
          status: 'Active',
          date: 'Just now'
        };
      }
      return c;
    }));

    showToast(`Added ${addToJobModal.candidateName} to "${addToJobModal.targetJob}"`);
    setSelectedCandidateIds(prev => prev.filter(id => !addToJobModal.candidateIds.includes(id)));
    setAddToJobModal({ isOpen: false, candidateIds: [], candidateName: '', targetJob: '', targetStage: '', notes: '' });
  };

  // Add to List
  const handleOpenAddToListModal = (candidateIds = [], name = '') => {
    let resolvedName = name;
    if (!resolvedName && candidateIds.length === 1) {
      const found = candidates.find(c => c.id === candidateIds[0]);
      if (found) resolvedName = found.name;
    }
    setAddToListModal({
      isOpen: true,
      candidateIds,
      candidateName: resolvedName || (candidateIds.length > 1 ? `${candidateIds.length} Candidates` : ''),
      targetList: candidateLists[0] || 'Shortlisted Talent (Q4)',
      isCreatingNew: false,
      newListName: ''
    });
  };

  const handleConfirmAddToList = (e) => {
    e?.preventDefault?.();
    const finalListName = addToListModal.isCreatingNew ? addToListModal.newListName.trim() : addToListModal.targetList;
    if (!finalListName) {
      showToast('Please select or enter a list name');
      return;
    }

    if (addToListModal.isCreatingNew && !candidateLists.includes(finalListName)) {
      setCandidateLists(prev => [...prev, finalListName]);
    }

    // Persist to shared candidate lists store
    try {
      const currentLists = getStoredLists();
      const existingList = currentLists.find(l => l.name === finalListName);
      let updatedLists;
      if (existingList) {
        const mergedIds = Array.from(new Set([...(existingList.candidateIds || []), ...addToListModal.candidateIds]));
        updatedLists = currentLists.map(l => l.name === finalListName ? { ...l, candidateIds: mergedIds, updatedAt: 'Just now' } : l);
      } else {
        const newListObj = {
          id: `list-${Date.now()}`,
          name: finalListName,
          description: 'Created from Candidate Directory.',
          category: 'Custom Pool',
          tags: ['Custom'],
          color: '#1890FF',
          candidateIds: [...addToListModal.candidateIds],
          createdAt: 'Just now',
          updatedAt: 'Just now'
        };
        updatedLists = [newListObj, ...currentLists];
      }
      saveStoredLists(updatedLists);
    } catch {
      // ignore
    }

    // Also persist candidates to favoritesData store
    try {
      addToListModal.candidateIds.forEach(id => {
        const cand = candidates.find(c => c.id === id);
        if (cand && !isItemFavorited('Candidate', cand.id)) {
          toggleFavorite({
            relatedId: cand.id,
            title: cand.name,
            type: 'Candidate',
            meta: `${cand.role} • ${cand.company || cand.department}`,
            path: `/dashboard/candidates/${cand.id}`,
            tag: cand.stage || 'Shortlisted'
          });
        }
      });
      setFavRefreshKey(k => k + 1);
    } catch {
      // ignore
    }

    const count = addToListModal.candidateIds.length;
    showToast(`Added ${count} candidate${count > 1 ? 's' : ''} to "${finalListName}"`);
    setSelectedCandidateIds(prev => prev.filter(id => !addToListModal.candidateIds.includes(id)));
    setAddToListModal({ isOpen: false, candidateIds: [], candidateName: '', targetList: '', isCreatingNew: false, newListName: '' });
  };

  // Stage Badge Colors
  const getStageBadgeStyle = (stage) => {
    switch (stage) {
      case 'Applied':
      case 'Application Review':
        return 'bg-[#1890FF]/10 text-[#1890FF] border-[#1890FF]/20';
      case 'Screening':
        return 'bg-[#8E33FF]/10 text-[#8E33FF] border-[#8E33FF]/20';
      case 'Technical Interview':
      case 'Culture Fit':
        return 'bg-[#00A76F]/10 text-[#00A76F] border-[#00A76F]/20';
      case 'Reference Check':
        return 'bg-[#FFAB00]/10 text-[#b78103] dark:text-[#FFAB00] border-[#FFAB00]/20';
      case 'Offer':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Hired':
        return 'bg-green-600/10 text-green-700 dark:text-green-300 border-green-600/30';
      case 'Rejected':
        return 'bg-[#FF5630]/10 text-[#FF5630] border-[#FF5630]/20';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
    }
  };

  // Match score styles
  const getScoreBadge = (numeric) => {
    if (numeric >= 9.0) {
      return {
        badge: 'bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/30',
        dot: 'bg-[#00A76F]',
        label: 'Top Match'
      };
    }
    if (numeric >= 8.0) {
      return {
        badge: 'bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/30',
        dot: 'bg-[#1890FF]',
        label: 'Strong'
      };
    }
    return {
      badge: 'bg-[#FFAB00]/10 text-[#b78103] dark:text-[#FFAB00] border border-[#FFAB00]/30',
      dot: 'bg-[#FFAB00]',
      label: 'Moderate'
    };
  };

  // Notice Period Badge Styles
  const getNoticePeriodBadgeStyle = (notice) => {
    switch (notice) {
      case 'Immediate':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/60';
      case '15 Days':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/60';
      case '30 Days':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      case '60 Days':
      case '90 Days':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/60';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  // Status Badge Styles
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active':
        return {
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
          dot: 'bg-emerald-500'
        };
      case 'Offer Pending':
        return {
          badge: 'bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border-teal-200 dark:border-teal-900/50',
          dot: 'bg-teal-500'
        };
      case 'Needs Review':
        return {
          badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
          dot: 'bg-blue-500'
        };
      case 'Hired':
        return {
          badge: 'bg-green-600/10 text-green-700 dark:text-green-300 border-green-600/30',
          dot: 'bg-green-600'
        };
      case 'On Hold':
        return {
          badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
          dot: 'bg-amber-500'
        };
      case 'Archived':
      case 'Rejected':
        return {
          badge: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900/50',
          dot: 'bg-red-500'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
          dot: 'bg-gray-400'
        };
    }
  };

  // Delete Candidate Handlers
  const handleOpenDeleteModal = (candidateId, candidateName) => {
    setDeleteConfirmModal({
      isOpen: true,
      candidateId,
      candidateName
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmModal.candidateId) return;
    const name = deleteConfirmModal.candidateName;
    setCandidates(prev => prev.filter(c => c.id !== deleteConfirmModal.candidateId));
    setSelectedCandidateIds(prev => prev.filter(id => id !== deleteConfirmModal.candidateId));
    if (quickViewCandidate?.id === deleteConfirmModal.candidateId) {
      setQuickViewCandidate(null);
    }
    setDeleteConfirmModal({ isOpen: false, candidateId: null, candidateName: '' });
    showToast(`Candidate "${name}" deleted successfully`);
  };

  // KPI calculations
  const totalCount = candidates.length;
  const activePipelineCount = candidates.filter(c => ['Screening', 'Technical Interview', 'Culture Fit', 'Reference Check'].includes(c.stage)).length;
  const topMatchesCount = candidates.filter(c => c.numericScore >= 9.0).length;
  const offerCount = candidates.filter(c => c.stage === 'Offer').length;
  const reviewCount = candidates.filter(c => ['Applied', 'Application Review'].includes(c.stage) || c.status === 'Needs Review').length;

  const kpiCards = [
    {
      id: 'all',
      title: 'Total Candidates',
      count: totalCount,
      subtext: 'Across all requisitions',
      icon: Users,
      color: 'text-[#1890FF]',
      bgColor: 'bg-[#1890FF]/10',
      borderColor: 'border-[#1890FF]/20'
    },
    {
      id: 'pipeline',
      title: 'Active Pipeline',
      count: activePipelineCount,
      subtext: 'In active interview stages',
      icon: Clock,
      color: 'text-[#00A76F] dark:text-[#22c55e]',
      bgColor: 'bg-[#00A76F]/10',
      borderColor: 'border-[#00A76F]/20'
    },
    {
      id: 'top-matches',
      title: 'Top Matches (9.0+)',
      count: topMatchesCount,
      subtext: 'High-confidence AI matches',
      icon: Star,
      color: 'text-[#b78103] dark:text-[#FFAB00]',
      bgColor: 'bg-[#FFAB00]/10',
      borderColor: 'border-[#FFAB00]/20'
    },
    {
      id: 'offers',
      title: 'Offers Extended',
      count: offerCount,
      subtext: 'Pending signature',
      icon: CheckCircle2,
      color: 'text-[#8E33FF]',
      bgColor: 'bg-[#8E33FF]/10',
      borderColor: 'border-[#8E33FF]/20'
    },
    {
      id: 'needs-review',
      title: 'Needs Review',
      count: reviewCount,
      subtext: 'New unreviewed submissions',
      icon: AlertCircle,
      color: 'text-[#FF5630]',
      bgColor: 'bg-[#FF5630]/10',
      borderColor: 'border-[#FF5630]/20'
    }
  ];

  return (
    <div className="p-6 space-y-5 relative w-full max-w-full min-w-0 overflow-x-clip text-[#212b36] dark:text-gray-100 animate-fade-in font-sans">
      {/* TOP BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1">
        <Link to="/dashboard" className="hover:text-[#1890FF] transition-colors cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={14} className="text-gray-400 shrink-0" />
        <span className="text-[#212b36] dark:text-white">
          {activeTab === 'candidates' ? 'All Candidates' : 'Favourites'}
        </span>
      </nav>

      {/* CANDIDATES / MY LISTS HEADER CARD */}
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/70 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#212b36] dark:text-white tracking-tight leading-none">
                {activeTab === 'candidates' ? 'All Candidates' : 'Favourites'}
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1890FF]/10 text-[#1890FF]">
                {activeTab === 'candidates' ? `${candidates.length} Total` : `${storedListsCount} Lists`}
              </span>
            </div>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              {activeTab === 'candidates'
                ? 'Search, evaluate, and track candidate profiles across all active requisitions and pipelines.'
                : 'Curate, organize, and track candidate talent pools created for target roles, pipelines, and upcoming hiring rounds.'}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SWITCHABLE BODY PART WITH SMOOTH TRANSITION                    */}
      {/* ============================================================== */}
      <div key={activeTab} className="transition-all duration-300 animate-fade-in">
        {activeTab === 'candidates' ? (
          <div className="space-y-5">
          {/* 2. 5 KPI OVERVIEW CARDS (Matching List of Jobs style)          */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.id}
              className="bg-white dark:bg-[#161c24] p-4 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between transition-all duration-200"
            >
              {/* Top Row: Icon badge + Title on left, Fixed/Total Count on right */}
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
      {/* MAIN CONTENT ROW: Left Filter Panel + Main Candidates Content  */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row gap-6 relative items-start w-full max-w-full min-w-0">
        {/* LEFT FILTER PANEL (Same as List of Jobs JobFilterPanel) */}
        <JobFilterPanel
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onResetAll={handleResetFilters}
          totalResultsCount={filteredCandidates.length}
          panelHeight={filterPanelHeight}
          favouriteListItems={favouriteListItems}
          showFavouriteList={true}
        />

        {/* MAIN CONTENT AREA: Candidates Horizontal Filter, Table / Cards & Pagination */}
        <div ref={rightPanelRef} className="flex-1 min-w-0 max-w-full space-y-4 w-full">
          {/* Horizontal Filter Bar with Search, Quick Parameters & Custom Sort By (Same as List of Jobs) */}
          <JobQuickFilterBar
            searchQuery={searchQuery}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            searchPlaceholder="Search candidates, skills, role, company..."
            quickFilters={quickFilters}
            onQuickFilterChange={handleQuickFilterChange}
            onClearAll={handleClearAllQuickFilters}
            parameterOptions={dynamicQuickParameters}
            sortBy={sortBy}
            sortOptions={CANDIDATE_SORT_OPTIONS}
            viewMode={viewMode === 'table' ? 'grid' : 'card'}
            onViewModeChange={(mode) => setViewMode(mode === 'grid' ? 'table' : 'grid')}
            onSortChange={setSortBy}
            showPresetFilters={false}
            showFavoritesFilter={false}
            showFollowingFilter={false}
            activeView={activeViewParam}
            onViewChange={handleViewFilterChange}
            favoritesCount={favoritedCandidatesCount}
            followupsCount={followedCandidatesCount}
            extraActions={
              viewMode === 'table' && (
                <div ref={columnPickerRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsColumnPickerOpen(prev => !prev)}
                    title="Customize Columns"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer h-[36px] ${
                      isColumnPickerOpen
                        ? 'bg-[#1890FF]/10 text-[#1890FF] border-[#1890FF]/30 font-bold'
                        : 'bg-white dark:bg-[#161c24] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-[#1890FF] hover:border-[#1890FF]/40'
                    }`}
                  >
                    <SlidersHorizontal size={13} />
                    <span className="hidden sm:inline">Columns</span>
                  </button>

                  {/* Column Visibility Popover */}
                  {isColumnPickerOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-3 z-[150] animate-fade-in text-left">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">
                          Table Columns
                        </span>
                        <button
                          type="button"
                          onClick={() => setColumnVisibility(DEFAULT_COLUMN_VISIBILITY)}
                          className="text-[11px] font-semibold text-[#1890FF] hover:underline cursor-pointer"
                        >
                          Reset Defaults
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                        {columnOptions.map((col) => {
                          const isChecked = !!columnVisibility[col.key];
                          return (
                            <label
                              key={col.key}
                              className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors select-none ${
                                col.required ? 'opacity-60 cursor-not-allowed' : ''
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <span className="font-semibold text-[#212b36] dark:text-gray-200 block truncate">
                                  {col.label}
                                </span>
                                <span className="text-[10px] text-gray-400 block truncate">
                                  {col.description}
                                </span>
                              </div>
                              <CustomCheckbox
                                checked={isChecked}
                                disabled={col.required}
                                size="sm"
                                onChange={(e) => {
                                  if (col.required) return;
                                  setColumnVisibility(prev => ({
                                    ...prev,
                                    [col.key]: e.target.checked
                                  }));
                                }}
                                aria-label={`Toggle ${col.label} column`}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            }
          />

      {/* ============================================================== */}
      
                    {/* 4. MAIN CANDIDATES CONTENT (Table / Grid View)                 */}
      {/* ============================================================== */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mb-3">
            <Users size={24} />
          </div>
          <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-1">
            No candidates found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-4">
            We couldn't find any candidate matching your active search and filter criteria. Try resetting your filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (

        /* =================== TABLE VIEW =================== */
        <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden max-w-full w-full">
          <div className="overflow-x-auto max-w-full w-full scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase font-bold text-[11px] border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                <tr>
                  <th className="py-3 pl-3 pr-1 w-10">
                    <CustomCheckbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={toggleSelectAll}
                      aria-label="Select all candidates"
                    />
                  </th>
                  {columnVisibility.candidate && (
                    <th className="py-3 px-2.5 min-w-[130px]">Candidate</th>
                  )}
                  {columnVisibility.role && (
                    <th className="py-3 px-2.5 min-w-[130px]">Role Applied</th>
                  )}
                  {columnVisibility.location && (
                    <th className="py-3 px-2 min-w-[110px]">Location</th>
                  )}
                  {columnVisibility.experience && (
                    <th className="py-3 px-2.5 min-w-[130px]">Experience & Company</th>
                  )}
                  {columnVisibility.noticePeriod && (
                    <th className="py-3 px-2 min-w-[95px]">Notice Period</th>
                  )}
                  {columnVisibility.status && (
                    <th className="py-3 px-2 min-w-[95px]">Status</th>
                  )}
                  {columnVisibility.applied && (
                    <th className="py-3 px-2 min-w-[85px]">Applied</th>
                  )}
                  {columnVisibility.matchScore && (
                    <th className="py-3 px-2 min-w-[90px] text-center">Match Score</th>
                  )}
                  {columnVisibility.stage && (
                    <th className="py-3 px-2 min-w-[110px]">Pipeline Stage</th>
                  )}
                  {columnVisibility.source && (
                    <th className="py-3 px-2 min-w-[105px]">Source</th>
                  )}
                  {columnVisibility.updated && (
                    <th className="py-3 px-2 min-w-[95px]">Profile Updated</th>
                  )}
                  {columnVisibility.action && (
                    <th className="py-3 pl-2 pr-4 min-w-[105px] w-28 text-right sticky right-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xs shadow-[-6px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[-6px_0_12px_rgba(0,0,0,0.2)]">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs whitespace-nowrap">
                {paginatedCandidates.map((cand, index) => {
                  const isChecked = selectedCandidateIds.includes(cand.id);
                  const scoreConfig = getScoreBadge(cand.numericScore);
                  const initials = cand.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                  const statusStyle = getStatusBadgeStyle(cand.status);

                  return (
                    <tr
                      key={cand.id}
                      className={`transition-colors group hover:bg-gray-50/60 dark:hover:bg-gray-800/40 ${openActionMenuId === cand.id ? 'relative z-40' : ''} ${isChecked ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''}
                        }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 pl-3 pr-1">
                        <CustomCheckbox
                          checked={isChecked}
                          onChange={() => toggleSelectCandidate(cand.id)}
                          aria-label={`Select ${cand.name}`}
                        />
                      </td>

                      {/* 1. Candidate: Streamlined name link without bulky avatar & email */}
                      {columnVisibility.candidate && (
                        <td className="py-3 px-2.5">
                          <button
                            type="button"
                            onClick={() => handleViewProfile(cand)}
                            className="font-bold text-xs text-[#212b36] dark:text-white hover:text-[#1890FF] transition-colors truncate block text-left max-w-[160px] cursor-pointer"
                            title={`View ${cand.name}'s profile`}
                          >
                            {cand.name}
                          </button>
                        </td>
                      )}

                      {/* 2. Role Applied */}
                      {columnVisibility.role && (
                        <td className="py-3 px-2.5">
                          <div className="font-semibold text-[#212b36] dark:text-gray-200 truncate max-w-[150px]" title={cand.role}>
                            {cand.role}
                          </div>
                          <div className="text-[11px] text-gray-400 truncate max-w-[150px]">
                            {cand.department}
                          </div>
                        </td>
                      )}

                      {/* 3. Location */}
                      {columnVisibility.location && (
                        <td className="py-3 px-2">
                          <div className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 font-medium truncate max-w-[120px]" title={cand.location}>
                            <MapPin size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate">{cand.location}</span>
                          </div>
                        </td>
                      )}

                      {/* 4. Experience & Company */}
                      {columnVisibility.experience && (
                        <td className="py-3 px-2.5">
                          <div className="font-medium text-[#212b36] dark:text-gray-200 truncate max-w-[140px]" title={cand.company}>
                            {cand.company}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {cand.experience}
                          </div>
                        </td>
                      )}

                      {/* 5. Notice Period */}
                      {columnVisibility.noticePeriod && (
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getNoticePeriodBadgeStyle(cand.noticePeriod)}`}>
                            {cand.noticePeriod || '30 Days'}
                          </span>
                        </td>
                      )}

                      {/* 6. Status */}
                      {columnVisibility.status && (
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            <span>{cand.status || 'Active'}</span>
                          </span>
                        </td>
                      )}

                      {/* 7. Applied */}
                      {columnVisibility.applied && (
                        <td className="py-3 px-2 text-gray-600 dark:text-gray-300 font-medium text-xs">
                          {cand.date}
                        </td>
                      )}

                      {/* 8. Match Score */}
                      {columnVisibility.matchScore && (
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${scoreConfig.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${scoreConfig.dot}`} />
                            {cand.score}
                          </span>
                        </td>
                      )}

                      {/* 9. Pipeline Stage */}
                      {columnVisibility.stage && (
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStageBadgeStyle(cand.stage)}`}>
                            {cand.stage}
                          </span>
                        </td>
                      )}

                      {/* 10. Source */}
                      {columnVisibility.source && (
                        <td className="py-3 px-2 text-gray-600 dark:text-gray-300 font-medium truncate max-w-[120px]" title={cand.source}>
                          {cand.source}
                        </td>
                      )}

                      {/* 11. Profile Updated */}
                      {columnVisibility.updated && (
                        <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs">
                          {cand.updated || cand.date || 'Recent'}
                        </td>
                      )}

                      {/* 12. Action: Favorite, Follow Up, Quick View, Delete */}
                      {columnVisibility.action && (
                        <td className={`py-3 pl-2 pr-4 text-right sticky right-0 bg-white dark:bg-[#161c24] group-hover:bg-gray-50 dark:group-hover:bg-gray-800 backdrop-blur-xs shadow-[-6px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[-6px_0_12px_rgba(0,0,0,0.2)] ${openActionMenuId === cand.id ? 'z-40' : 'z-10'}`}>
                          <div className="flex items-center justify-end gap-1.5 relative">
                            {/* Favorite Button */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleFav(cand, e)}
                              title={isItemFavorited('Candidate', cand.id) ? 'Favorited (Click to remove)' : 'Add to Favorites'}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs border ${
                                isItemFavorited('Candidate', cand.id)
                                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
                                  : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 border-transparent hover:border-amber-200/50'
                              }`}
                            >
                              <Star size={14} className={isItemFavorited('Candidate', cand.id) ? 'fill-amber-400 text-amber-500' : ''} />
                            </button>


                            {/* Kebab Menu Button */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenuId(openActionMenuId === cand.id ? null : cand.id);
                                }}
                                title="More Actions"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-2xs border border-transparent"
                              >
                                <MoreVertical size={14} />
                              </button>

                              {/* Kebab Dropdown Menu */}
                              {openActionMenuId === cand.id && (
                                <div className={`absolute right-0 ${index >= paginatedCandidates.length - 2 && paginatedCandidates.length > 2 ? 'bottom-full mb-1' : 'top-8 mt-1'} w-44 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1 animate-fade-in text-left`}>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuickViewCandidate(cand);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                                  >
                                    <Eye size={14} className="text-[#1890FF]" />
                                    <span>Quick View</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewProfile(cand);
                                      setOpenActionMenuId(null);
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
                                      handleOpenDeleteModal(cand.id, cand.name);
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
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (

        /* =================== GRID / CARD VIEW =================== */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedCandidates.map((cand) => {
            const isChecked = selectedCandidateIds.includes(cand.id);
            const scoreConfig = getScoreBadge(cand.numericScore);
            const initials = cand.name.split(' ').map(n => n[0]).join('').slice(0, 2);

            return (
              <div
                key={cand.id}
                className={`p-5 rounded-2xl border transition-all bg-white dark:bg-[#161c24] flex flex-col justify-between shadow-xs hover:shadow-md ${isChecked
                    ? 'border-[#1890FF] ring-2 ring-[#1890FF]/20'
                    : 'border-gray-100 dark:border-gray-800'
                  }`}
              >
                <div>
                  {/* Card Top: Checkbox, Avatar, Name & Score */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <CustomCheckbox
                        checked={isChecked}
                        onChange={() => toggleSelectCandidate(cand.id)}
                        aria-label={`Select ${cand.name}`}
                      />
                      <div
                        onClick={() => handleViewProfile(cand)}
                        className="w-10 h-10 rounded-full bg-[#1890FF]/15 dark:bg-[#1890FF]/25 text-[#1890FF] border border-[#1890FF]/25 dark:border-[#1890FF]/35 font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                      >
                        {initials}
                      </div>
                      <div>
                        <h4
                          onClick={() => handleViewProfile(cand)}
                          className="font-bold text-sm text-[#212b36] dark:text-white hover:text-[#1890FF] transition-colors cursor-pointer"
                        >
                          {cand.name}
                        </h4>
                        <div className="text-xs text-gray-400 font-medium truncate max-w-[170px]">
                          {cand.company} · {cand.experience}
                        </div>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${scoreConfig.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${scoreConfig.dot}`} />
                      {cand.score}
                    </span>
                  </div>

                  {/* Role & Stage */}
                  <div className="space-y-1.5 my-3">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      {cand.role}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStageBadgeStyle(cand.stage)}`}>
                        {cand.stage}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${getNoticePeriodBadgeStyle(cand.noticePeriod)}`}>
                        {cand.noticePeriod || '30 Days'}
                      </span>
                      {(() => {
                        const statusStyle = getStatusBadgeStyle(cand.status);
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${statusStyle.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            <span>{cand.status || 'Active'}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 my-3">
                    {cand.skills?.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-[10.5px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {(cand.skills?.length || 0) > 4 && (
                      <span className="px-1.5 py-0.5 text-gray-400 text-[10px] font-bold">
                        +{cand.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Source & Actions */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 mt-2">
                  <div className="text-[11px] text-gray-400 truncate max-w-[120px]">
                    Via <span className="font-semibold text-gray-600 dark:text-gray-300">{cand.source}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFav(cand, e)}
                      title={isItemFavorited('Candidate', cand.id) ? 'Favorited (Click to remove)' : 'Add to Favorites'}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs border ${
                        isItemFavorited('Candidate', cand.id)
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
                          : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-gray-200/60 dark:border-gray-700/60'
                      }`}
                    >
                      <Star size={14} className={isItemFavorited('Candidate', cand.id) ? 'fill-amber-400 text-amber-500' : ''} />
                    </button>


                    {/* Kebab Menu Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionMenuId(openActionMenuId === cand.id ? null : cand.id);
                        }}
                        title="More Actions"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-2xs border border-gray-200/60 dark:border-gray-700/60"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {/* Kebab Dropdown Menu */}
                      {openActionMenuId === cand.id && (
                        <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1 animate-fade-in text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewCandidate(cand);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Eye size={14} className="text-[#1890FF]" />
                            <span>Quick View</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(cand);
                              setOpenActionMenuId(null);
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
                              handleOpenDeleteModal(cand.id, cand.name);
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. PAGINATION CONTROLS (Card style matching All Jobs)          */}
      {/* ============================================================== */}
      {filteredCandidates.length > 0 && (
        <div className="bg-white dark:bg-[#161c24] px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-black dark:text-gray-400 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} candidates
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2.5 py-1 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-[#212b36] dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex gap-1 items-center">
            <span className="text-sm text-black dark:text-gray-400 font-medium mr-2">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium transition-colors ${currentPage === 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
            >
              Previous
            </button>
            <button 
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium transition-colors ${currentPage === totalPages ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

        </div>{/* Closes rightPanelRef */}
      </div>{/* Closes flex flex-col lg:flex-row gap-6 relative items-start */}

      {/* ============================================================== */}
      {/* 6. FLOATING BULK ACTIONS BAR (When candidates checked)         */}
      {/* ============================================================== */}
      {selectedCandidateIds.length > 0 && createPortal(
        <>
          {/* Main Floating Bulk Actions Bar */}
          {!isPanelDismissed ? (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#161c24] text-white px-5 py-3 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 border border-gray-700/80 backdrop-blur-md transition-all duration-300 ease-out animate-fade-in group"
            >
              {/* Close Panel Icon on top-right, slightly outside the panel (Visible only on panel hover, constant background) */}
              <button
                type="button"
                onClick={() => setIsPanelDismissed(true)}
                title="Minimize panel"
                aria-label="Minimize panel"
                className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#212b36] text-gray-300 hover:text-white border border-gray-600 shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer z-50 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <X size={12} className="stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2 min-w-[125px]">
                <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#1890FF] text-white text-[11px] font-bold tabular-nums">
                  {selectedCandidateIds.length}
                </span>
                <span className="text-xs font-bold text-gray-200 whitespace-nowrap tabular-nums">
                  {selectedCandidateIds.length} selected
                </span>
              </div>

              <div className="h-4 w-px bg-gray-700" />

              {/* Add to Favourite */}
              <button
                type="button"
                onClick={() => handleOpenAddToListModal(selectedCandidateIds, `${selectedCandidateIds.length} candidate${selectedCandidateIds.length > 1 ? 's' : ''}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-amber-500/25 shrink-0 hover:scale-105 active:scale-95"
                title="Add selected candidates to Favourites"
              >
                <Star size={13} className="fill-white text-white" />
                <span>Add to Favourite</span>
              </button>

              {/* Add to Job */}
              <button
                type="button"
                onClick={() => handleOpenAddToJobModal(selectedCandidateIds, `${selectedCandidateIds.length} candidate${selectedCandidateIds.length > 1 ? 's' : ''}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#1890FF] hover:bg-[#0077e6] text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-[#1890FF]/25 shrink-0 hover:scale-105 active:scale-95"
              >
                <Briefcase size={13} />
                <span>Add to Job</span>
              </button>

              {/* Compare - Strictly Brand Theme Color, No Purple, Stable Width */}
              <button
                type="button"
                onClick={handleCompareWithAI}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#1890FF] hover:bg-[#0077e6] text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-[#1890FF]/25 shrink-0 hover:scale-105 active:scale-95"
                title={selectedCandidateIds.length < 2 ? "Select at least 2 candidates to compare" : "Compare candidates with AI"}
              >
                <Sparkles size={13} />
                <span>Compare</span>
              </button>

              {/* Reject Selected */}
              <button
                type="button"
                onClick={() => handleOpenRejectModal(selectedCandidateIds, `${selectedCandidateIds.length} candidates`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#FF5630] hover:bg-[#e04825] text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-[#FF5630]/25 hover:scale-105 active:scale-95"
              >
                <UserX size={13} className="text-white" />
                <span>Reject Selected</span>
              </button>

              <div className="h-4 w-px bg-gray-700/80 mx-0.5" />

              {/* Deselect All (Uncheck all candidates) - Clearly Visible by Default */}
              <button
                type="button"
                onClick={() => setSelectedCandidateIds([])}
                title="Deselect All (Clear Selection)"
                aria-label="Deselect All"
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-xs shrink-0 hover:scale-105 active:scale-95"
              >
                <SquareMinus size={15} className="text-white" />
              </button>
            </div>
          ) : (
            /* Minimized Pill to reopen panel when dismissed */
            <button
              type="button"
              onClick={() => setIsPanelDismissed(false)}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#161c24] text-white px-4 py-2 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.4)] flex items-center gap-2 border border-gray-700/80 hover:bg-gray-800 text-xs font-bold cursor-pointer backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 active:scale-95 group animate-fade-in"
              title="Reopen bulk actions panel"
            >
              <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-[#1890FF] text-white text-[10px] font-bold">
                {selectedCandidateIds.length}
              </span>
              <span>Show Actions Panel</span>
              <ChevronUp size={13} className="text-gray-400 group-hover:text-white transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          )}
        </>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 7. ADD CANDIDATE MODAL                                         */}
      {/* ============================================================== */}
      {isAddModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white">
                Add New Candidate
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCandidateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Patel"
                  value={newCandidateData.name}
                  onChange={(e) => setNewCandidateData({ ...newCandidateData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="candidate@example.com"
                    value={newCandidateData.email}
                    onChange={(e) => setNewCandidateData({ ...newCandidateData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newCandidateData.phone}
                    onChange={(e) => setNewCandidateData({ ...newCandidateData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Target Role
                  </label>
                  <select
                    value={newCandidateData.role}
                    onChange={(e) => setNewCandidateData({ ...newCandidateData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF]"
                  >
                    {appliedJobFilterOptions.filter(r => r.value !== 'All').map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Current Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Swiggy, TCS"
                    value={newCandidateData.company}
                    onChange={(e) => setNewCandidateData({ ...newCandidateData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={newCandidateData.stage}
                    onChange={(e) => setNewCandidateData({ ...newCandidateData, stage: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF]"
                  >
                    {stageOptions.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Sourcing Channel
                  </label>
                  <select
                    value={newCandidateData.source}
                    onChange={(e) => setNewCandidateData({ ...newCandidateData, source: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF]"
                  >
                    {sourceFilterOptions.filter(s => s.value !== 'All').map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Redux, Node.js"
                  value={newCandidateData.skills}
                  onChange={(e) => setNewCandidateData({ ...newCandidateData, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#1890FF]/90 transition-all shadow-sm"
                >
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 8. REJECT CANDIDATE MODAL                                      */}
      {/* ============================================================== */}
      {rejectModalData.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 text-[#FF5630] flex items-center justify-center mx-auto">
              <UserX size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white">
                Reject Candidate
              </h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to mark <strong className="text-[#212b36] dark:text-white">{rejectModalData.candidateName}</strong> as rejected?
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Rejection Reason
              </label>
              <select
                value={rejectModalData.reason}
                onChange={(e) => setRejectModalData({ ...rejectModalData, reason: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#FF5630]"
              >
                <option value="Skills mismatch">Skills mismatch</option>
                <option value="Compensation expectation">Compensation expectation</option>
                <option value="Culture alignment">Culture alignment</option>
                <option value="Position filled">Position filled</option>
                <option value="Failed technical interview">Failed technical interview</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectModalData({ isOpen: false, candidateIds: [], candidateName: '', reason: '' })}
                className="flex-1 py-2 rounded-xl text-gray-700 dark:text-gray-300 font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2 rounded-xl text-white font-bold bg-[#FF5630] hover:bg-[#FF5630]/90 text-xs transition-colors shadow-sm"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 9. ADD CANDIDATE TO JOB MODAL                                  */}
      {/* ============================================================== */}
      {addToJobModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">

            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                    Add Candidate to Job
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Assign candidate to an active job opening
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAddToJobModal({ isOpen: false, candidateIds: [], candidateName: '', targetJob: '', targetStage: '', notes: '' })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAddToJob} className="space-y-3.5 text-xs">

              {/* Candidate Selection (if none pre-selected) or Pre-selected badge */}
              {addToJobModal.candidateIds.length === 0 ? (
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Select Candidate <span className="text-[#FF5630]">*</span>
                  </label>
                  <SearchableSelect
                    options={candidates.map(c => ({
                      label: c.name,
                      value: c.id,
                      description: `${c.role} • ${c.company || c.department || 'Candidate'}`
                    }))}
                    value={addToJobModal.candidateIds[0] || ''}
                    onChange={(selectedId) => {
                      const candObj = candidates.find(c => c.id === selectedId);
                      setAddToJobModal(prev => ({
                        ...prev,
                        candidateIds: [selectedId],
                        candidateName: candObj ? candObj.name : ''
                      }));
                    }}
                    placeholder="Choose a candidate..."
                    searchPlaceholder="Search candidates..."
                    showSearch={true}
                    size="default"
                  />
                </div>
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Target Candidate(s)
                  </span>
                  <div className="font-bold text-sm text-[#212b36] dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1890FF]" />
                    <span>{addToJobModal.candidateName}</span>
                  </div>
                </div>
              )}

              {/* Target Job Opening */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Target Job Opening <span className="text-[#FF5630]">*</span>
                </label>
                <SearchableSelect
                  options={appliedJobFilterOptions.filter(j => j.value !== 'All').map(j => ({
                    label: j.label,
                    value: j.value,
                    description: 'Active requisition'
                  }))}
                  value={addToJobModal.targetJob}
                  onChange={(val) => setAddToJobModal(prev => ({ ...prev, targetJob: val }))}
                  placeholder="Select Target Job Opening..."
                  searchPlaceholder="Search job openings..."
                  showSearch={true}
                  size="default"
                />
              </div>

              {/* Initial Pipeline Stage */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Initial Pipeline Stage
                </label>
                <SearchableSelect
                  options={stageOptions.map(s => ({
                    label: s.label,
                    value: s.value,
                    description: s.value === 'Screening' ? 'Initial recruiter screening & resume review'
                      : s.value === 'Technical Interview' ? 'Coding & architecture deep-dive'
                      : s.value === 'Culture Fit' ? 'Values & behavioral alignment'
                      : s.value === 'Offer' ? 'Offer extended / under discussion'
                      : s.value === 'Hired' ? 'Signed offer & onboarding'
                      : 'Pipeline stage'
                  }))}
                  value={addToJobModal.targetStage}
                  onChange={(val) => setAddToJobModal(prev => ({ ...prev, targetStage: val }))}
                  placeholder="Select Pipeline Stage..."
                  searchPlaceholder="Search stages..."
                  showSearch={false}
                  size="default"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Recruiter Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sourced from candidate pool, strong fit for Q4 expansion..."
                  value={addToJobModal.notes}
                  onChange={(e) => setAddToJobModal({ ...addToJobModal, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] resize-none text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setAddToJobModal({ isOpen: false, candidateIds: [], candidateName: '', targetJob: '', targetStage: '', notes: '' })}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#1890FF]/90 transition-all shadow-sm text-xs cursor-pointer"
                >
                  <Briefcase size={13} />
                  <span>Add to Job</span>
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 10. ADD CANDIDATE TO FAVOURITE MODAL                           */}
      {/* ============================================================== */}
      {addToListModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">

            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                  <Star size={20} className="fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                    Add to Favourite
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Save candidates to your favourites list or talent group
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAddToListModal({ isOpen: false, candidateIds: [], candidateName: '', targetList: '', isCreatingNew: false, newListName: '' })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAddToList} className="space-y-4 text-xs">

              {/* Selected Candidates Summary */}
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Candidates</p>
                  <p className="text-sm font-bold text-[#212b36] dark:text-white mt-0.5">{addToListModal.candidateName}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                  {addToListModal.candidateIds.length} selected
                </span>
              </div>

              {/* Choose List Mode */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                  Select Favourites List <span className="text-[#FF5630]">*</span>
                </label>

                {!addToListModal.isCreatingNew ? (
                  <div className="space-y-2">
                    <SearchableSelect
                      options={candidateLists.map(list => ({
                        label: list,
                        value: list,
                        description: list === 'Shortlisted Talent (Q4)'
                          ? 'High-priority vetted engineering finalist pool'
                          : list === 'Senior Tech Leads Pipeline'
                            ? 'Candidates for architecture & engineering leadership'
                            : list === 'Design System Specialists'
                              ? 'Frontend & product design talent'
                              : list === 'Immediate Available Bench'
                                ? 'Notice period < 15 days, ready to hire'
                                : 'Curated favourites candidate pool'
                      }))}
                      value={addToListModal.targetList}
                      onChange={(val) => setAddToListModal(prev => ({ ...prev, targetList: val }))}
                      placeholder="Select a Favourites List..."
                      searchPlaceholder="Search favourites lists..."
                      showSearch={true}
                      size="default"
                    />

                    <button
                      type="button"
                      onClick={() => setAddToListModal(prev => ({ ...prev, isCreatingNew: true, newListName: '' }))}
                      className="text-xs font-bold text-[#1890FF] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Plus size={13} />
                      <span>Create a new list instead</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. Q4 Executive Sourcing Pool"
                      value={addToListModal.newListName}
                      onChange={(e) => setAddToListModal(prev => ({ ...prev, newListName: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-xs font-semibold text-[#212b36] dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setAddToListModal(prev => ({ ...prev, isCreatingNew: false }))}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline cursor-pointer"
                    >
                      Select an existing list instead
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setAddToListModal({ isOpen: false, candidateIds: [], candidateName: '', targetList: '', isCreatingNew: false, newListName: '' })}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addToListModal.isCreatingNew && !addToListModal.newListName.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#0077e6] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm text-xs cursor-pointer"
                >
                  <Star size={13} className="fill-white text-white" />
                  <span>Add to Favourite</span>
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* CONFIRM UN-FAVOURITE CANDIDATE CUSTOMIZED ALERT                */}
      {/* ============================================================== */}
      {unfavConfirmCand && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
                  <Star size={18} className="fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                    Remove from Favourite
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnfavConfirmCand(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-[#212b36] dark:text-white">"{unfavConfirmCand.name}"</strong> from your favourites?
            </p>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setUnfavConfirmCand(null)}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUnfavCand}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-amber-500 hover:bg-amber-600 text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Star size={13} />
                <span>Remove from Favourite</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 11. CANDIDATE QUICK VIEW MODAL                                 */}
      {/* ============================================================== */}
      {quickViewCandidate && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 dark:border-gray-800 overflow-hidden my-8 animate-scale-up text-left">
            
            {/* Header with gradient banner / top accent */}
            <div className="relative bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 dark:from-[#1e293b]/60 dark:via-[#161c24] dark:to-[#1e293b]/40 p-6 border-b border-gray-100 dark:border-gray-800">
              
              {/* Close Button top-right */}
              <button
                onClick={() => setQuickViewCandidate(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title="Close Quick View"
              >
                <X size={18} />
              </button>

              {/* Candidate Profile summary */}
              <div className="flex items-start gap-4 pr-8">
                <div className="w-14 h-14 rounded-2xl bg-[#1890FF] text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md shadow-[#1890FF]/25">
                  {quickViewCandidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl font-bold text-[#212b36] dark:text-white truncate">
                      {quickViewCandidate.name}
                    </h2>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(quickViewCandidate.status).badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeStyle(quickViewCandidate.status).dot}`} />
                      {quickViewCandidate.status || 'Active'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#1890FF] mt-0.5">
                    {quickViewCandidate.role}
                    <span className="text-gray-400 font-normal"> · {quickViewCandidate.department || 'Engineering'}</span>
                  </p>

                  {/* Contact quick links */}
                  <div className="flex items-center gap-4 mt-2.5 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                    <a
                      href={`mailto:${quickViewCandidate.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-[#1890FF] transition-colors"
                    >
                      <Mail size={13} className="text-[#1890FF]" />
                      <span>{quickViewCandidate.email}</span>
                    </a>
                    {quickViewCandidate.phone && (
                      <a
                        href={`tel:${quickViewCandidate.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-[#1890FF] transition-colors"
                      >
                        <Phone size={13} className="text-[#00A76F]" />
                        <span>{quickViewCandidate.phone}</span>
                      </a>
                    )}
                    <div className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                      <MapPin size={13} className="text-gray-400" />
                      <span>{quickViewCandidate.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs max-h-[calc(85vh-200px)] overflow-y-auto">
              
              {/* 4 Metric Highlights Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Match Score */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60">
                  <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    AI Match Score
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold ${getScoreBadge(quickViewCandidate.numericScore).badge}`}>
                      <Sparkles size={11} />
                      {quickViewCandidate.score}
                    </span>
                  </div>
                </div>

                {/* Pipeline Stage */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60">
                  <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Pipeline Stage
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getStageBadgeStyle(quickViewCandidate.stage)}`}>
                    {quickViewCandidate.stage}
                  </span>
                </div>

                {/* Notice Period */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60">
                  <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Notice Period
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${getNoticePeriodBadgeStyle(quickViewCandidate.noticePeriod)}`}>
                    {quickViewCandidate.noticePeriod || '30 Days'}
                  </span>
                </div>

                {/* Sourcing Channel */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60">
                  <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Source
                  </span>
                  <span className="font-bold text-[#212b36] dark:text-gray-200 truncate block">
                    {quickViewCandidate.source}
                  </span>
                </div>
              </div>

              {/* Comprehensive Recruitment Details */}
              <div className="bg-gray-50/70 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100 dark:border-gray-800/80 space-y-3">
                <h4 className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">
                  Candidate Profile Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">Current / Past Company:</span>
                    <span className="font-bold text-[#212b36] dark:text-white">{quickViewCandidate.company}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">Experience:</span>
                    <span className="font-bold text-[#212b36] dark:text-white">{quickViewCandidate.experience}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">Date Applied:</span>
                    <span className="font-bold text-[#212b36] dark:text-white">{quickViewCandidate.date}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">Profile Updated:</span>
                    <span className="font-bold text-[#212b36] dark:text-white">{quickViewCandidate.updated || quickViewCandidate.date}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">Agency / Recruiter:</span>
                    <span className="font-bold text-[#212b36] dark:text-white">{quickViewCandidate.agency || quickViewCandidate.source}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="font-bold text-[#212b36] dark:text-white">{quickViewCandidate.location}</span>
                  </div>
                </div>
              </div>

              {/* Verified Skills & Tech Stack */}
              <div>
                <h4 className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider mb-2">
                  Key Skills & Competencies ({quickViewCandidate.skills?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {quickViewCandidate.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/20 rounded-lg text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Recruiter Insight Box */}
              <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#1890FF] mb-1">
                  <Sparkles size={13} />
                  <span>FindNeo AI Recruiter Insight</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Candidate exhibits exceptional alignment with the <strong>{quickViewCandidate.role}</strong> criteria.
                  Strong background at {quickViewCandidate.company} with demonstrated expertise in {quickViewCandidate.skills?.slice(0, 3).join(', ')}.
                  Availability notice period is <strong>{quickViewCandidate.noticePeriod}</strong>. Recommended to proceed through active pipeline.
                </p>
              </div>

            </div>

            {/* Modal Footer with "View Details" (redirects to Profile) and "Close" */}
            <div className="p-4 bg-gray-50/90 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  const cand = quickViewCandidate;
                  setQuickViewCandidate(null);
                  handleOpenDeleteModal(cand.id, cand.name);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Candidate</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setQuickViewCandidate(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200/60 dark:hover:bg-gray-700 transition-colors text-xs cursor-pointer"
                >
                  Close
                </button>
                
                <button
                  onClick={() => {
                    const cand = quickViewCandidate;
                    setQuickViewCandidate(null);
                    handleViewProfile(cand);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#0077e6] transition-all shadow-sm text-xs cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 12. DELETE CANDIDATE CONFIRMATION MODAL                        */}
      {/* ============================================================== */}
      {deleteConfirmModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#FF5630] flex items-center justify-center shrink-0">
                  <Trash2 size={18} />
                </div>
                <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                  Delete Candidate
                </h3>
              </div>
              <button
                onClick={() => setDeleteConfirmModal({ isOpen: false, candidateId: null, candidateName: '' })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-[#212b36] dark:text-white">{deleteConfirmModal.candidateName}</strong>? This action cannot be undone and will permanently remove this candidate from all job pipelines and lists.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmModal({ isOpen: false, candidateId: null, candidateName: '' })}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#FF5630] hover:bg-[#e04825] text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Candidate</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Follow-Up Schedule Modal */}
      <FollowUpModal
        isOpen={Boolean(followUpTarget)}
        onClose={() => setFollowUpTarget(null)}
        targetItem={followUpTarget}
        onFollowupAdded={() => {
          setToastMessage('Follow reminder scheduled!');
          setTimeout(() => setToastMessage(''), 3000);
        }}
      />

      {/* CUSTOMIZED FOLLOW CONFIRMATION NOTIFICATION */}
      {followConfirmation && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3.5 px-4 py-3.5 bg-white dark:bg-[#161c24] text-[#212b36] dark:text-white rounded-2xl shadow-2xl border border-[#1890FF]/30 dark:border-gray-800 animate-fade-in max-w-md">
          <div className="w-10 h-10 rounded-xl bg-[#1890FF]/15 text-[#1890FF] flex items-center justify-center shrink-0">
            <Bookmark size={20} className={followConfirmation.isUnfollow ? '' : 'fill-[#1890FF]'} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#212b36] dark:text-white">
              {followConfirmation.isUnfollow ? `Unfollowed ${followConfirmation.name}` : `Following ${followConfirmation.name}`}
            </h4>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
              {followConfirmation.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFollowConfirmation(null)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  ) : (
    <MyListsPage
      isEmbedded={true}
      externalOpenCreateModal={externalOpenCreateList}
      onResetCreateModal={() => setExternalOpenCreateList(false)}
    />
  )}
      </div>
    </div>
  );
}
