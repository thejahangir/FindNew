import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bookmark,
  Users,
  Search,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Download,
  Tag,
  FolderPlus,
  Edit3,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ChevronRight,
  Layers,
  ArrowRight,
  Check,
  Building2,
  Star,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  UserPlus,
  UserMinus,
  Calendar,
  AlertCircle,
  SquareMinus,
  ChevronUp,
  ChevronDown,
  ListPlus
} from 'lucide-react';
import CustomCheckbox from '../components/ui/CustomCheckbox';
import SearchableSelect from '../components/ui/SearchableSelect';
import { useChatbot } from '../contexts/ChatbotContext';
import {
  CANDIDATES_POOL,
  INITIAL_LISTS,
  getStoredLists,
  saveStoredLists
} from '../data/candidateListsData';

const CATEGORY_OPTIONS = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Leadership', label: 'Leadership & Architecture' },
  { value: 'Design & UX', label: 'Design & UX' },
  { value: 'Fast-Track', label: 'Fast-Track Hiring' },
  { value: 'Executive', label: 'Executive / VP' },
  { value: 'Marketing', label: 'Growth & Marketing' },
  { value: 'General', label: 'General Talent Pool' }
];

export default function MyListsPage({ isEmbedded = false, externalOpenCreateModal = false, onResetCreateModal }) {
  const navigate = useNavigate();
  const { compareCandidates } = useChatbot();

  // -------------------------------------------------------------
  // 1. STATE & PERSISTENCE
  // -------------------------------------------------------------
  const [lists, setLists] = useState(() => getStoredLists());
  const [selectedListId, setSelectedListId] = useState(() => {
    const stored = getStoredLists();
    return stored.length > 0 ? stored[0].id : 'list-1';
  });

  // Keep localStorage in sync whenever lists change
  useEffect(() => {
    saveStoredLists(lists);
  }, [lists]);

  // Active selected list
  const activeList = useMemo(() => {
    return lists.find(l => l.id === selectedListId) || lists[0] || null;
  }, [lists, selectedListId]);

  // Resolve candidate objects for active list
  const activeCandidates = useMemo(() => {
    if (!activeList || !activeList.candidateIds) return [];
    return activeList.candidateIds
      .map(id => CANDIDATES_POOL.find(c => c.id === id))
      .filter(Boolean);
  }, [activeList]);

  // -------------------------------------------------------------
  // 2. SEARCH & FILTER CONTROLS
  // -------------------------------------------------------------
  // Left Panel: Filter Lists
  const [searchListQuery, setSearchListQuery] = useState('');

  const filteredLists = useMemo(() => {
    return lists.filter(list => {
      if (!searchListQuery.trim()) return true;
      const q = searchListQuery.toLowerCase();
      return (
        list.name.toLowerCase().includes(q) ||
        (list.description && list.description.toLowerCase().includes(q)) ||
        (list.tags && list.tags.some(t => t.toLowerCase().includes(q)))
      );
    });
  }, [lists, searchListQuery]);

  // Right Panel: Column Visibility State matching Candidate List page
  const DEFAULT_COLUMN_VISIBILITY = useMemo(() => ({
    candidate: true,
    role: true,
    location: false,
    experience: true,
    noticePeriod: false,
    status: false,
    applied: false,
    matchScore: false,
    stage: true,
    source: false,
    updated: false,
    action: true
  }), []);

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

  const [columnVisibility, setColumnVisibility] = useState(DEFAULT_COLUMN_VISIBILITY);
  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
  const columnPickerRef = useRef(null);

  // Close column picker on outside click
  useEffect(() => {
    const handleClickOutsidePicker = (e) => {
      if (columnPickerRef.current && !columnPickerRef.current.contains(e.target)) {
        setIsColumnPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsidePicker);
    return () => document.removeEventListener('mousedown', handleClickOutsidePicker);
  }, []);

  // Candidate Search & View Mode
  const [searchCandidateQuery, setSearchCandidateQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const filteredCandidates = useMemo(() => {
    return activeCandidates.filter(candidate => {
      if (!searchCandidateQuery.trim()) return true;
      const q = searchCandidateQuery.toLowerCase();
      return (
        candidate.name.toLowerCase().includes(q) ||
        candidate.role.toLowerCase().includes(q) ||
        candidate.company.toLowerCase().includes(q) ||
        (candidate.email && candidate.email.toLowerCase().includes(q)) ||
        (candidate.location && candidate.location.toLowerCase().includes(q)) ||
        (candidate.skills && candidate.skills.some(s => s.toLowerCase().includes(q)))
      );
    });
  }, [activeCandidates, searchCandidateQuery]);

  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [isPanelDismissed, setIsPanelDismissed] = useState(false);
  const displayCount = selectedCandidateIds.length;

  useEffect(() => {
    setSelectedCandidateIds([]);
    setIsPanelDismissed(false);
  }, [selectedListId]);

  const isAllSelected = filteredCandidates.length > 0 && filteredCandidates.every(c => selectedCandidateIds.includes(c.id));
  const isIndeterminate = filteredCandidates.some(c => selectedCandidateIds.includes(c.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    setIsPanelDismissed(false);
    if (isAllSelected) {
      setSelectedCandidateIds(prev => prev.filter(id => !filteredCandidates.some(c => c.id === id)));
    } else {
      const pageIds = filteredCandidates.map(c => c.id);
      setSelectedCandidateIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectCandidate = (id) => {
    setIsPanelDismissed(false);
    setSelectedCandidateIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // -------------------------------------------------------------
  // 3. TOAST NOTIFICATIONS
  // -------------------------------------------------------------
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // -------------------------------------------------------------
  // 4. MODALS STATE
  // -------------------------------------------------------------
  // Create New List Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListData, setNewListData] = useState({
    name: '',
    description: '',
    category: 'Engineering',
    color: '#1890FF',
    tags: ''
  });

  useEffect(() => {
    if (externalOpenCreateModal) {
      setIsCreateModalOpen(true);
      if (onResetCreateModal) {
        onResetCreateModal();
      }
    }
  }, [externalOpenCreateModal, onResetCreateModal]);

  // Edit List Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editListData, setEditListData] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    color: '#1890FF'
  });

  // Delete List Confirmation Modal
  const [deleteListModal, setDeleteListModal] = useState({
    isOpen: false,
    listId: null,
    listName: ''
  });

  // Add Candidates to List Modal
  const [isAddCandidatesModalOpen, setIsAddCandidatesModalOpen] = useState(false);
  const [selectedCandidatePoolIds, setSelectedCandidatePoolIds] = useState([]);
  const [poolSearchQuery, setPoolSearchQuery] = useState('');
  const [poolStageFilter, setPoolStageFilter] = useState('All');

  // Add Selected Candidates to Another List Modal
  const [isAddAnotherListModalOpen, setIsAddAnotherListModalOpen] = useState(false);
  const [targetBatchListId, setTargetBatchListId] = useState('');
  const [isCreatingNewBatchList, setIsCreatingNewBatchList] = useState(false);
  const [newBatchListName, setNewBatchListName] = useState('');

  // Quick View Modal
  const [quickViewCandidate, setQuickViewCandidate] = useState(null);

  // -------------------------------------------------------------
  // 5. LIST ACTIONS HANDLERS
  // -------------------------------------------------------------
  // Create New List
  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListData.name.trim()) {
      showToast('Please enter a list name');
      return;
    }

    const tagArray = newListData.tags
      ? newListData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [newListData.category];

    const newList = {
      id: `list-${Date.now()}`,
      name: newListData.name.trim(),
      description: newListData.description.trim() || 'Curated candidate talent list.',
      category: newListData.category || 'General',
      tags: tagArray,
      color: newListData.color || '#1890FF',
      candidateIds: [],
      createdAt: 'Just now',
      updatedAt: 'Just now'
    };

    setLists(prev => [newList, ...prev]);
    setSelectedListId(newList.id);
    setIsCreateModalOpen(false);
    setNewListData({
      name: '',
      description: '',
      category: 'Engineering',
      color: '#1890FF',
      tags: ''
    });
    showToast(`Created candidate list "${newList.name}"`);
  };

  // Edit List Details
  const handleOpenEditModal = (list) => {
    setEditListData({
      id: list.id,
      name: list.name,
      description: list.description || '',
      category: list.category || 'General',
      color: list.color || '#1890FF'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditList = (e) => {
    e.preventDefault();
    if (!editListData.name.trim()) {
      showToast('List name cannot be empty');
      return;
    }

    setLists(prev =>
      prev.map(l => {
        if (l.id === editListData.id) {
          return {
            ...l,
            name: editListData.name.trim(),
            description: editListData.description.trim(),
            category: editListData.category,
            color: editListData.color,
            updatedAt: 'Just now'
          };
        }
        return l;
      })
    );
    setIsEditModalOpen(false);
    showToast(`Updated list "${editListData.name}"`);
  };

  // Delete List
  const handleConfirmDeleteList = () => {
    const targetId = deleteListModal.listId;
    const targetName = deleteListModal.listName;

    setLists(prev => {
      const remaining = prev.filter(l => l.id !== targetId);
      if (selectedListId === targetId) {
        setSelectedListId(remaining[0]?.id || null);
      }
      return remaining;
    });

    setDeleteListModal({ isOpen: false, listId: null, listName: '' });
    showToast(`Deleted list "${targetName}"`);
  };

  // -------------------------------------------------------------
  // 6. CANDIDATE MEMBERSHIP HANDLERS
  // -------------------------------------------------------------
  // Remove Candidate from List
  const handleRemoveCandidateFromList = (candidateId, candidateName) => {
    if (!activeList) return;
    setLists(prev =>
      prev.map(l => {
        if (l.id === activeList.id) {
          return {
            ...l,
            candidateIds: l.candidateIds.filter(id => id !== candidateId),
            updatedAt: 'Just now'
          };
        }
        return l;
      })
    );
    showToast(`Removed ${candidateName} from "${activeList.name}"`);
  };

  // Remove Selected Candidates from List
  const handleRemoveSelectedCandidatesFromList = () => {
    if (!activeList || selectedCandidateIds.length === 0) return;
    const count = selectedCandidateIds.length;
    setLists(prev =>
      prev.map(l => {
        if (l.id === activeList.id) {
          return {
            ...l,
            candidateIds: l.candidateIds.filter(id => !selectedCandidateIds.includes(id)),
            updatedAt: 'Just now'
          };
        }
        return l;
      })
    );
    setSelectedCandidateIds([]);
    showToast(`Removed ${count} candidate${count > 1 ? 's' : ''} from "${activeList.name}"`);
  };

  // Add Selected Candidates to Another List
  const handleConfirmAddSelectedToAnotherList = (e) => {
    e.preventDefault();
    if (selectedCandidateIds.length === 0) return;

    if (isCreatingNewBatchList) {
      if (!newBatchListName.trim()) {
        showToast('Please enter a list name');
        return;
      }
      const newList = {
        id: `list-${Date.now()}`,
        name: newBatchListName.trim(),
        description: 'Created from bulk candidate selection.',
        category: 'General',
        tags: ['Talent Pool'],
        color: '#1890FF',
        candidateIds: [...selectedCandidateIds],
        createdAt: 'Just now',
        updatedAt: 'Just now'
      };
      setLists(prev => [newList, ...prev]);
      showToast(`Created "${newList.name}" and added ${selectedCandidateIds.length} candidate${selectedCandidateIds.length > 1 ? 's' : ''}`);
    } else {
      if (!targetBatchListId) {
        showToast('Please select a candidate list');
        return;
      }
      const targetListObj = lists.find(l => l.id === targetBatchListId);
      if (!targetListObj) return;

      setLists(prev =>
        prev.map(l => {
          if (l.id === targetBatchListId) {
            const currentIds = new Set(l.candidateIds || []);
            selectedCandidateIds.forEach(id => currentIds.add(id));
            return {
              ...l,
              candidateIds: Array.from(currentIds),
              updatedAt: 'Just now'
            };
          }
          return l;
        })
      );
      showToast(`Added ${selectedCandidateIds.length} candidate${selectedCandidateIds.length > 1 ? 's' : ''} to "${targetListObj.name}"`);
    }

    setIsAddAnotherListModalOpen(false);
    setTargetBatchListId('');
    setIsCreatingNewBatchList(false);
    setNewBatchListName('');
    setSelectedCandidateIds([]);
  };

  // Compare candidates with AI
  const handleCompareWithAI = () => {
    const selectedObjs = activeCandidates.filter(c => selectedCandidateIds.includes(c.id));
    if (selectedObjs.length < 2) {
      showToast('Select at least 2 candidates to compare');
      return;
    }
    compareCandidates(selectedObjs);
    showToast(`Comparing ${selectedObjs.length} candidates in FindNeo AI Assistant`);
  };

  // Available Candidates to Add (those in CANDIDATES_POOL not yet in this list)
  const availablePoolCandidates = useMemo(() => {
    if (!activeList) return [];
    return CANDIDATES_POOL.filter(cand => !activeList.candidateIds.includes(cand.id));
  }, [activeList]);

  const filteredPoolCandidates = useMemo(() => {
    return availablePoolCandidates.filter(c => {
      const q = poolSearchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(q)));
      const matchesStage = poolStageFilter === 'All' || c.stage === poolStageFilter;
      return matchesSearch && matchesStage;
    });
  }, [availablePoolCandidates, poolSearchQuery, poolStageFilter]);

  // Open Add Candidates Modal
  const handleOpenAddCandidatesModal = () => {
    setSelectedCandidatePoolIds([]);
    setPoolSearchQuery('');
    setPoolStageFilter('All');
    setIsAddCandidatesModalOpen(true);
  };

  // Confirm Adding Candidates
  const handleConfirmAddCandidates = () => {
    if (selectedCandidatePoolIds.length === 0 || !activeList) return;

    setLists(prev =>
      prev.map(l => {
        if (l.id === activeList.id) {
          const merged = Array.from(new Set([...l.candidateIds, ...selectedCandidatePoolIds]));
          return {
            ...l,
            candidateIds: merged,
            updatedAt: 'Just now'
          };
        }
        return l;
      })
    );

    const count = selectedCandidatePoolIds.length;
    showToast(`Added ${count} candidate${count > 1 ? 's' : ''} to "${activeList.name}"`);
    setIsAddCandidatesModalOpen(false);
    setSelectedCandidatePoolIds([]);
  };

  // Export List as CSV simulation
  const handleExportList = () => {
    if (!activeList || activeCandidates.length === 0) {
      showToast('No candidates in this list to export');
      return;
    }
    showToast(`Exporting ${activeCandidates.length} candidates from "${activeList.name}"...`);
  };

  // -------------------------------------------------------------
  // 7. COLOR & STAGE UTILITIES
  // -------------------------------------------------------------
  const getStageBadgeStyle = (stage) => {
    switch (stage) {
      case 'Applied':
      case 'Application Review':
        return 'bg-[#1890FF]/10 text-[#1890FF] border-[#1890FF]/20';
      case 'Screening':
        return 'bg-[#8E33FF]/10 text-[#8E33FF] border-[#8E33FF]/20';
      case 'Technical Interview':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Culture Fit':
      case 'Reference Check':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Offer':
        return 'bg-[#00A76F]/10 text-[#00A76F] border-[#00A76F]/20';
      case 'Hired':
        return 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/30 font-bold';
      case 'Rejected':
        return 'bg-[#FF5630]/10 text-[#FF5630] border-[#FF5630]/20';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

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
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
          dot: 'bg-gray-400'
        };
    }
  };

  // Color options for list themes
  const colorOptions = [
    { value: '#1890FF', label: 'Neo Blue' },
    { value: '#8E33FF', label: 'Purple' },
    { value: '#00A76F', label: 'Emerald' },
    { value: '#FFAB00', label: 'Amber' },
    { value: '#FF5630', label: 'Rose' },
    { value: '#00B8D9', label: 'Cyan' }
  ];

  // Global KPI counts
  const totalSavedCandidatesCount = useMemo(() => {
    const uniqueIds = new Set();
    lists.forEach(l => l.candidateIds?.forEach(id => uniqueIds.add(id)));
    return uniqueIds.size;
  }, [lists]);

  // Stage options for filtering
  const stageOptions = [
    'Screening',
    'Applied',
    'Technical Interview',
    'Culture Fit',
    'Reference Check',
    'Offer',
    'Hired'
  ];

  // -------------------------------------------------------------
  // 8. RENDER VIEW
  // -------------------------------------------------------------
  return (
    <div className={isEmbedded ? "space-y-5 relative w-full text-[#212b36] dark:text-gray-100 animate-fade-in font-sans" : "p-6 space-y-5 relative w-full text-[#212b36] dark:text-gray-100 animate-fade-in font-sans"}>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] rounded-xl shadow-xl text-sm font-semibold animate-fade-in border border-gray-700 dark:border-gray-200">
          <CheckCircle2 size={18} className="text-[#00A76F] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BREADCRUMBS (Only when not embedded) */}
      {!isEmbedded && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1">
          <Link to="/dashboard" className="hover:text-[#1890FF] transition-colors cursor-pointer">
            Dashboard
          </Link>
          <ChevronRight size={14} className="text-gray-400 shrink-0" />
          <Link to="/dashboard/candidates" className="hover:text-[#1890FF] transition-colors cursor-pointer">
            Candidates
          </Link>
          <ChevronRight size={14} className="text-gray-400 shrink-0" />
          <span className="text-[#212b36] dark:text-white">Favourites</span>
        </nav>
      )}

      {/* FAVOURITES HEADER CARD (Only when not embedded) */}
      {!isEmbedded && (
        <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/70 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#212b36] dark:text-white tracking-tight leading-none">
                  Favourites
                </h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1890FF]/10 text-[#1890FF]">
                  {lists.length} Lists
                </span>
              </div>
              <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                Curate, organize, and track candidate talent pools created for target roles, pipelines, and upcoming hiring rounds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#161c24] p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Recruiter Favourites</p>
            <p className="text-xl font-bold text-[#212b36] dark:text-white mt-0.5">{lists.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161c24] p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#8E33FF]/10 text-[#8E33FF] flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Unique Candidates</p>
            <p className="text-xl font-bold text-[#212b36] dark:text-white mt-0.5">{totalSavedCandidatesCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161c24] p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#00A76F]/10 text-[#00A76F] flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Active Talent Pool</p>
            <p className="text-xl font-bold text-[#212b36] dark:text-white mt-0.5">{activeCandidates.length} in Active List</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161c24] p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFAB00]/10 text-[#FFAB00] flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Selected List</p>
            <p className="text-sm font-bold text-[#212b36] dark:text-white truncate max-w-[130px] mt-0.5">
              {activeList ? activeList.name : 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MASTER-DETAIL LAYOUT: LIST OF LISTS + CANDIDATES IN LIST   */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: LIST OF LISTS RECRUITER HAS CREATED (3 COLS)     */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs flex flex-col overflow-hidden">

          {/* Left Header */}
          <div className="p-3.5 border-b border-gray-100 dark:border-gray-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#1890FF]" />
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">
                  Recruiter Favourites
                </h2>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {filteredLists.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                title="Create a new favourite list"
                aria-label="Create a new favourite list"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1890FF] hover:bg-[#0077e6] text-white shadow-sm shadow-[#1890FF]/35 hover:scale-110 active:scale-95 transition-all cursor-pointer ring-2 ring-[#1890FF]/25"
              >
                <Plus size={16} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Search Lists */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search lists, tags, notes..."
                value={searchListQuery}
                onChange={(e) => setSearchListQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:border-[#1890FF] text-[#212b36] dark:text-white transition-colors"
              />
              {searchListQuery && (
                <button
                  onClick={() => setSearchListQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* List Cards Container - Compact cards for maximum visibility */}
          <div className="p-2 space-y-1.5 max-h-[720px] overflow-y-auto custom-scrollbar">
            {filteredLists.length === 0 ? (
              <div className="p-6 text-center">
                <Bookmark size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300">No lists found</p>
                <button
                  onClick={() => setSearchListQuery('')}
                  className="mt-2 text-xs font-bold text-[#1890FF] hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredLists.map((list) => {
                const isSelected = list.id === selectedListId;
                const candidateCount = list.candidateIds ? list.candidateIds.length : 0;

                return (
                  <div
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)}
                    className={`group relative p-2.5 px-3 rounded-xl border transition-all cursor-pointer ${isSelected
                      ? 'bg-[#1890FF]/10 dark:bg-[#1890FF]/15 border-[#1890FF]/40 shadow-2xs'
                      : 'bg-white dark:bg-[#161c24] border-gray-100 dark:border-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50/70 dark:hover:bg-gray-800/40'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: list.color || '#1890FF' }}
                        />
                        <h3 className={`text-xs sm:text-[13px] font-bold truncate ${isSelected ? 'text-[#1890FF]' : 'text-[#212b36] dark:text-white group-hover:text-[#1890FF]'
                          }`}>
                          {list.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Quick Edit/Delete buttons on hover */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(list);
                            }}
                            title="Edit List"
                            className="p-1 text-gray-400 hover:text-[#1890FF] hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteListModal({
                                isOpen: true,
                                listId: list.id,
                                listName: list.name
                              });
                            }}
                            title="Delete List"
                            className="p-1 text-gray-400 hover:text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Candidate count badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold shrink-0 ${isSelected
                          ? 'bg-[#1890FF] text-white shadow-2xs'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                          }`}>
                          {candidateCount}
                        </span>
                      </div>
                    </div>

                    {list.description && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-1 pl-4.5 font-normal">
                        {list.description}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: SHOWING CANDIDATES LISTED FOR PARTICULAR LIST (9 COLS) */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-9 space-y-4">

          {activeList ? (
            <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs relative min-h-[440px]">

              {/* ACTIVE LIST BANNER HEADER */}
              <div className="p-5 sm:p-6 rounded-t-2xl border-b border-gray-100 dark:border-gray-800/80 bg-gradient-to-r from-gray-50/80 via-white to-white dark:from-gray-900/40 dark:via-[#161c24] dark:to-[#161c24]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: activeList.color || '#1890FF' }}
                      />
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1890FF]/10 text-[#1890FF]">
                        {activeList.category || 'Recruiter Talent Pool'}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                      <span>{activeList.name}</span>
                      <button
                        onClick={() => handleOpenEditModal(activeList)}
                        className="text-gray-400 hover:text-[#1890FF] p-1 rounded-md transition-colors cursor-pointer"
                        title="Edit List Details"
                      >
                        <Edit3 size={15} />
                      </button>
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl font-normal leading-relaxed">
                      {activeList.description || 'Curated candidate talent list.'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-1 font-medium flex-wrap">
                      <span>Created: {activeList.createdAt || 'Recent'}</span>
                      <span>•</span>
                      <span>Updated: {activeList.updatedAt || 'Recent'}</span>
                      <span>•</span>
                      <span className="font-bold text-[#1890FF]">
                        {activeCandidates.length} candidate{activeCandidates.length === 1 ? '' : 's'} listed
                      </span>
                    </div>
                  </div>

                  {/* Actions in Header */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={handleExportList}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download size={13} className="text-gray-500" />
                      <span>Export</span>
                    </button>

                    <button
                      onClick={handleOpenAddCandidatesModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1890FF] hover:bg-[#0077e6] rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <UserPlus size={14} />
                      <span>Add Candidates</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SEARCH & CONTROLS BAR (No Horizontal Filter Panel, with Search, Columns, Grid/Card View) */}
              <div className="p-3.5 sm:p-4 border-b border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#161c24] flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-20">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search candidates, skills, role, company..."
                    value={searchCandidateQuery}
                    onChange={(e) => setSearchCandidateQuery(e.target.value)}
                    className="w-full pl-8.5 pr-8 py-2 text-xs bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-[#212b36] dark:text-white transition-colors"
                  />
                  {searchCandidateQuery && (
                    <button
                      onClick={() => setSearchCandidateQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Right controls: Results count, View mode toggle, Columns popover */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-between sm:justify-end">
                  <span className="text-xs font-semibold text-gray-400 hidden md:inline">
                    Showing {filteredCandidates.length} of {activeCandidates.length}
                  </span>

                  {/* View Mode Toggle: Table / Grid */}
                  <div className="flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode('table')}
                      title="Table View"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table'
                        ? 'bg-white dark:bg-gray-700 text-[#1890FF] shadow-2xs'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      <TableIcon size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      title="Card Grid View"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 text-[#1890FF] shadow-2xs'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      <LayoutGrid size={14} />
                    </button>
                  </div>

                  {/* Columns Picker Popover (After Grid/Card View Icon) */}
                  <div ref={columnPickerRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsColumnPickerOpen(prev => !prev)}
                      title="Customize Columns"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer h-[34px] ${isColumnPickerOpen
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
                                className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors select-none ${col.required ? 'opacity-60 cursor-not-allowed' : ''
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
                </div>
              </div>

              {/* CANDIDATES LIST VIEW */}
              {activeCandidates.length === 0 ? (
                /* EMPTY LIST STATE */
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-[#1890FF] flex items-center justify-center mx-auto shadow-inner">
                    <Users size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#212b36] dark:text-white">
                      No candidates listed in "{activeList.name}" yet
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      Add vetted candidates from your candidate pool or import new applicants to start building this pipeline.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={handleOpenAddCandidatesModal}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#1890FF] hover:bg-[#0077e6] rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <UserPlus size={15} />
                      <span>Add Candidates to this List</span>
                    </button>
                    <Link
                      to="/dashboard/candidates"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <span>Explore Candidate Directory</span>
                    </Link>
                  </div>
                </div>
              ) : filteredCandidates.length === 0 ? (
                /* EMPTY FILTER RESULTS */
                <div className="p-12 text-center space-y-3">
                  <Search size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
                  <p className="text-base font-bold text-gray-700 dark:text-gray-200">
                    No candidates match your search
                  </p>
                  <p className="text-xs text-gray-400">
                    Try searching for different keywords or clear the search query.
                  </p>
                  <button
                    onClick={() => setSearchCandidateQuery('')}
                    className="text-xs font-bold text-[#1890FF] hover:underline pt-1 cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              ) : viewMode === 'table' ? (
                /* TABLE VIEW OF CANDIDATES (Same as Candidate List page) */
                <div className="overflow-x-auto rounded-b-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase font-bold text-[11px] border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                      <tr>
                        <th className="p-3.5 pl-5 w-10">
                          <CustomCheckbox
                            checked={isAllSelected}
                            indeterminate={isIndeterminate}
                            onChange={toggleSelectAll}
                            aria-label="Select all candidates"
                          />
                        </th>
                        {columnVisibility.candidate && (
                          <th className="p-3.5 min-w-[210px]">Candidate</th>
                        )}
                        {columnVisibility.role && (
                          <th className="p-3.5 min-w-[170px]">Role Applied</th>
                        )}
                        {columnVisibility.location && (
                          <th className="p-3.5 min-w-[140px]">Location</th>
                        )}
                        {columnVisibility.experience && (
                          <th className="p-3.5 min-w-[170px]">Experience & Company</th>
                        )}
                        {columnVisibility.noticePeriod && (
                          <th className="p-3.5 min-w-[120px]">Notice Period</th>
                        )}
                        {columnVisibility.status && (
                          <th className="p-3.5 min-w-[120px]">Status</th>
                        )}
                        {columnVisibility.applied && (
                          <th className="p-3.5 min-w-[100px]">Applied</th>
                        )}
                        {columnVisibility.matchScore && (
                          <th className="p-3.5 min-w-[110px] text-center">Match Score</th>
                        )}
                        {columnVisibility.stage && (
                          <th className="p-3.5 min-w-[150px]">Pipeline Stage</th>
                        )}
                        {columnVisibility.source && (
                          <th className="p-3.5 min-w-[140px]">Source</th>
                        )}
                        {columnVisibility.updated && (
                          <th className="p-3.5 min-w-[120px]">Profile Updated</th>
                        )}
                        {columnVisibility.action && (
                          <th className="p-3.5 pr-5 min-w-[100px] text-right sticky right-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xs shadow-[-6px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[-6px_0_12px_rgba(0,0,0,0.2)]">
                            Action
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs whitespace-nowrap">
                      {filteredCandidates.map((cand) => {
                        const isChecked = selectedCandidateIds.includes(cand.id);
                        const scoreConfig = getScoreBadge(cand.numericScore || 9.0);
                        const statusStyle = getStatusBadgeStyle(cand.status || 'Active');

                        return (
                          <tr
                            key={cand.id}
                            className={`transition-colors group hover:bg-gray-50/60 dark:hover:bg-gray-800/40 ${isChecked ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                              }`}
                          >
                            {/* Checkbox */}
                            <td className="p-3.5 pl-5">
                              <CustomCheckbox
                                checked={isChecked}
                                onChange={() => toggleSelectCandidate(cand.id)}
                                aria-label={`Select ${cand.name}`}
                              />
                            </td>

                            {/* 1. Candidate */}
                            {columnVisibility.candidate && (
                              <td className="p-3.5">
                                <div
                                  onClick={() => setQuickViewCandidate(cand)}
                                  className="cursor-pointer group/cand min-w-0"
                                  title="Click to view candidate profile"
                                >
                                  <div className="font-bold text-[#212b36] dark:text-white group-hover/cand:text-[#1890FF] transition-colors truncate">
                                    {cand.name}
                                  </div>
                                  <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                    <Mail size={11} className="shrink-0 text-gray-400" />
                                    <span className="truncate">{cand.email}</span>
                                  </div>
                                </div>
                              </td>
                            )}

                            {/* 2. Role Applied */}
                            {columnVisibility.role && (
                              <td className="p-3.5">
                                <div className="font-semibold text-[#212b36] dark:text-gray-200">
                                  {cand.role}
                                </div>
                                <div className="text-[11px] text-gray-400">
                                  {cand.department || 'Engineering'}
                                </div>
                              </td>
                            )}

                            {/* 3. Location */}
                            {columnVisibility.location && (
                              <td className="p-3.5">
                                <div className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                                  <MapPin size={13} className="text-gray-400 shrink-0" />
                                  <span>{cand.location || 'Bangalore, India'}</span>
                                </div>
                              </td>
                            )}

                            {/* 4. Experience & Company */}
                            {columnVisibility.experience && (
                              <td className="p-3.5">
                                <div className="font-medium text-[#212b36] dark:text-gray-200">
                                  {cand.company}
                                </div>
                                <div className="text-[11px] text-gray-400">
                                  {cand.experience}
                                </div>
                              </td>
                            )}

                            {/* 5. Notice Period */}
                            {columnVisibility.noticePeriod && (
                              <td className="p-3.5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getNoticePeriodBadgeStyle(cand.noticePeriod)}`}>
                                  {cand.noticePeriod || '30 Days'}
                                </span>
                              </td>
                            )}

                            {/* 6. Status */}
                            {columnVisibility.status && (
                              <td className="p-3.5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusStyle.badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                  <span>{cand.status || 'Active'}</span>
                                </span>
                              </td>
                            )}

                            {/* 7. Applied */}
                            {columnVisibility.applied && (
                              <td className="p-3.5 text-gray-600 dark:text-gray-300 font-medium">
                                {cand.date || 'Recent'}
                              </td>
                            )}

                            {/* 8. Match Score */}
                            {columnVisibility.matchScore && (
                              <td className="p-3.5 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${scoreConfig.badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${scoreConfig.dot}`} />
                                  {cand.score || '9.0/10'}
                                </span>
                              </td>
                            )}

                            {/* 9. Pipeline Stage */}
                            {columnVisibility.stage && (
                              <td className="p-3.5">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStageBadgeStyle(cand.stage)}`}>
                                  {cand.stage}
                                </span>
                              </td>
                            )}

                            {/* 10. Source */}
                            {columnVisibility.source && (
                              <td className="p-3.5 text-gray-600 dark:text-gray-300 font-medium">
                                {cand.source || 'Direct Careers'}
                              </td>
                            )}

                            {/* 11. Profile Updated */}
                            {columnVisibility.updated && (
                              <td className="p-3.5 text-gray-500 dark:text-gray-400">
                                {cand.updated || cand.date || 'Recent'}
                              </td>
                            )}

                            {/* 12. Actions: Quick View, View Full Profile, and Remove from this list */}
                            {columnVisibility.action && (
                              <td className="p-3.5 pr-5 text-right sticky right-0 bg-white/95 dark:bg-[#161c24]/95 group-hover:bg-gray-50/95 dark:group-hover:bg-gray-800/95 backdrop-blur-xs shadow-[-6px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[-6px_0_12px_rgba(0,0,0,0.2)]">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setQuickViewCandidate(cand)}
                                    title="Quick View"
                                    aria-label="Quick View"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#1890FF] hover:bg-[#1890FF]/10 dark:text-gray-400 dark:hover:text-[#1890FF] transition-all cursor-pointer shadow-2xs border border-transparent hover:border-[#1890FF]/25"
                                  >
                                    <Eye size={15} />
                                  </button>
                                  <Link
                                    to={`/dashboard/candidates/${cand.id}`}
                                    title="View Full Profile"
                                    aria-label="View Full Profile"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#1890FF] hover:bg-[#1890FF]/10 dark:text-gray-400 dark:hover:text-[#1890FF] transition-all shadow-2xs border border-transparent hover:border-[#1890FF]/25"
                                  >
                                    <ExternalLink size={14} />
                                  </Link>
                                  <button
                                    onClick={() => handleRemoveCandidateFromList(cand.id, cand.name)}
                                    title="Remove from this list"
                                    aria-label="Remove from this list"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#FF5630] hover:text-[#d33a18] bg-red-50/80 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200/70 dark:border-red-900/40 transition-all cursor-pointer shadow-2xs"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* GRID / CARD VIEW OF CANDIDATES (Same as Candidate List page) */
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-b-2xl">
                  {filteredCandidates.map((cand) => {
                    const isChecked = selectedCandidateIds.includes(cand.id);
                    const scoreConfig = getScoreBadge(cand.numericScore || 9.0);
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
                                onClick={() => setQuickViewCandidate(cand)}
                                className="w-10 h-10 rounded-full bg-[#1890FF]/15 dark:bg-[#1890FF]/25 text-[#1890FF] border border-[#1890FF]/25 dark:border-[#1890FF]/35 font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                              >
                                {initials}
                              </div>
                              <div>
                                <h4
                                  onClick={() => setQuickViewCandidate(cand)}
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
                              {cand.score || '9.0/10'}
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
                                const statusStyle = getStatusBadgeStyle(cand.status || 'Active');
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
                            Via <span className="font-semibold text-gray-600 dark:text-gray-300">{cand.source || 'Direct'}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setQuickViewCandidate(cand)}
                              title="Quick View"
                              aria-label="Quick View"
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#1890FF] hover:bg-[#1890FF]/10 dark:text-gray-400 dark:hover:text-[#1890FF] border border-gray-200/60 dark:border-gray-700/60 hover:border-[#1890FF]/30 transition-all cursor-pointer shadow-2xs"
                            >
                              <Eye size={15} />
                            </button>
                            <Link
                              to={`/dashboard/candidates/${cand.id}`}
                              title="View Full Profile"
                              aria-label="View Full Profile"
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#1890FF] hover:bg-[#1890FF]/10 dark:text-gray-400 dark:hover:text-[#1890FF] border border-gray-200/60 dark:border-gray-700/60 hover:border-[#1890FF]/30 transition-all shadow-2xs"
                            >
                              <ExternalLink size={14} />
                            </Link>
                            <button
                              onClick={() => handleRemoveCandidateFromList(cand.id, cand.name)}
                              title="Remove from list"
                              aria-label="Remove from list"
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#FF5630] hover:text-[#d33a18] bg-red-50/80 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200/70 dark:border-red-900/40 transition-all cursor-pointer shadow-2xs"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}


            </div>
          ) : (
            /* NO LIST SELECTED STATE */
            <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-12 text-center space-y-3">
              <Bookmark size={40} className="mx-auto text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-bold text-[#212b36] dark:text-white">
                Select a list to view candidates
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Pick any list from the left panel to examine candidate profiles, track interview stages, and manage list entries.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* ============================================================== */}
      {/* FLOATING BULK ACTIONS BAR (When candidates are selected)        */}
      {/* ============================================================== */}
      {selectedCandidateIds.length > 0 && createPortal(
        <>
          {!isPanelDismissed ? (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#161c24] text-white px-5 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 border border-gray-700/80 backdrop-blur-xl transition-all duration-300 ease-out animate-fade-in group"
            >
              {/* Close / Dismiss panel pill button */}
              <button
                type="button"
                onClick={() => setIsPanelDismissed(true)}
                title="Close panel"
                aria-label="Close panel"
                className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#212b36] text-gray-300 hover:text-white border border-gray-600 shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer z-50 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <X size={12} className="stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2 min-w-[125px]">
                <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#1890FF] text-white text-[11px] font-bold tabular-nums">
                  {displayCount}
                </span>
                <span className="text-xs font-bold text-gray-200 whitespace-nowrap tabular-nums">
                  {displayCount} selected
                </span>
              </div>

              <div className="h-4 w-px bg-gray-700" />

              {/* Add to another List */}
              <button
                type="button"
                onClick={() => {
                  const otherLists = lists.filter(l => l.id !== selectedListId);
                  setTargetBatchListId(otherLists.length > 0 ? otherLists[0].id : '');
                  setIsCreatingNewBatchList(false);
                  setNewBatchListName('');
                  setIsAddAnotherListModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#1890FF] hover:bg-[#0077e6] text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-[#1890FF]/25 hover:scale-105 active:scale-95 shrink-0"
              >
                <ListPlus size={13} className="text-white" />
                <span>Add to another List</span>
              </button>

              {/* Compare - Always visible like in Candidate List page */}
              <button
                type="button"
                onClick={handleCompareWithAI}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#1890FF] hover:bg-[#0077e6] text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-[#1890FF]/25 shrink-0 hover:scale-105 active:scale-95"
                title={selectedCandidateIds.length < 2 ? "Select at least 2 candidates to compare" : "Compare candidates with AI"}
              >
                <Sparkles size={13} className="text-white" />
                <span>Compare</span>
              </button>

              {/* Remove from List */}
              <button
                type="button"
                onClick={handleRemoveSelectedCandidatesFromList}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#FF5630] hover:bg-[#e04825] text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-[#FF5630]/25 hover:scale-105 active:scale-95 shrink-0"
              >
                <Trash2 size={13} className="text-white" />
                <span>Remove from List</span>
              </button>

              <div className="h-4 w-px bg-gray-700/80 mx-0.5" />

              {/* Deselect All (Uncheck all candidates) */}
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
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#161c24] text-white px-4 py-2 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] flex items-center gap-2 border border-gray-700/80 hover:bg-gray-800 text-xs font-bold cursor-pointer backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 active:scale-95 group animate-fade-in"
              title="Reopen bulk actions panel"
            >
              <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-[#1890FF] text-white text-[10px] font-bold">
                {displayCount}
              </span>
              <span>Show Actions Panel</span>
              <ChevronUp size={13} className="text-gray-400 group-hover:text-white transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          )}
        </>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 2.5. MODAL: ADD CANDIDATES TO ANOTHER LIST                     */}
      {/* ============================================================== */}
      {isAddAnotherListModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                  <ListPlus size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                    Add to Another Candidate List
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Assign selected candidates to an existing or new list
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddAnotherListModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAddSelectedToAnotherList} className="space-y-4 text-xs">
              {/* Selected Candidates Summary */}
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Selected Candidates
                  </p>
                  <p className="text-xs font-bold text-[#212b36] dark:text-white mt-0.5">
                    {selectedCandidateIds.length} candidate{selectedCandidateIds.length > 1 ? 's' : ''} from "{activeList?.name}"
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1890FF] text-white">
                  {selectedCandidateIds.length} selected
                </span>
              </div>

              {/* Target List Selection */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                  Target Candidate List <span className="text-[#FF5630]">*</span>
                </label>

                {!isCreatingNewBatchList ? (
                  <div className="space-y-2">
                    <SearchableSelect
                      options={lists
                        .filter(l => l.id !== selectedListId)
                        .map(list => ({
                          label: list.name,
                          value: list.id,
                          description: `${list.candidateIds?.length || 0} candidates • ${list.category || 'General'}`
                        }))}
                      value={targetBatchListId}
                      onChange={(val) => setTargetBatchListId(val)}
                      placeholder="Select target candidate list..."
                      searchPlaceholder="Search lists..."
                      showSearch={true}
                      size="default"
                    />

                    <button
                      type="button"
                      onClick={() => setIsCreatingNewBatchList(true)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#1890FF] font-bold hover:underline cursor-pointer pt-1"
                    >
                      <Plus size={13} />
                      <span>Create a brand new list instead</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder="e.g. Q4 Executive Sourcing"
                      value={newBatchListName}
                      onChange={(e) => setNewBatchListName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewBatchList(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline cursor-pointer"
                    >
                      Cancel and choose existing list
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddAnotherListModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isCreatingNewBatchList && !targetBatchListId}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#0077e6] disabled:opacity-50 transition-all shadow-sm text-xs cursor-pointer"
                >
                  <ListPlus size={13} />
                  <span>Add to List</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 3. MODAL: CREATE NEW LIST                                      */}
      {/* ============================================================== */}
      {isCreateModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                  <FolderPlus size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                    Create New Favourite List
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Organize target profiles for custom talent pipelines
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  List Name <span className="text-[#FF5630]">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Q4 Cloud Architects Finalist Pool"
                  value={newListData.name}
                  onChange={(e) => setNewListData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] font-semibold text-[#212b36] dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Category
                </label>
                <SearchableSelect
                  options={CATEGORY_OPTIONS}
                  value={newListData.category}
                  onChange={(val) => setNewListData(prev => ({ ...prev, category: val }))}
                  placeholder="Select Category..."
                  searchPlaceholder="Search category..."
                  showSearch={false}
                  size="default"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Candidates vetted for high-scalability and cloud modernization projects..."
                  value={newListData.description}
                  onChange={(e) => setNewListData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-xs resize-none text-[#212b36] dark:text-white"
                />
              </div>

              {/* Theme Color Picker */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNewListData(prev => ({ ...prev, color: c.value }))}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${newListData.color === c.value ? 'ring-2 ring-offset-2 ring-[#1890FF] scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    >
                      {newListData.color === c.value && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListData.name.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#0077e6] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Create Favourite List</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 4. MODAL: EDIT LIST DETAILS                                    */}
      {/* ============================================================== */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                    Edit List Details
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Update list title, category, and description
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditList} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  List Name <span className="text-[#FF5630]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editListData.name}
                  onChange={(e) => setEditListData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] font-semibold text-[#212b36] dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Category
                </label>
                <SearchableSelect
                  options={CATEGORY_OPTIONS}
                  value={editListData.category}
                  onChange={(val) => setEditListData(prev => ({ ...prev, category: val }))}
                  placeholder="Select Category..."
                  searchPlaceholder="Search category..."
                  showSearch={false}
                  size="default"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editListData.description}
                  onChange={(e) => setEditListData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-xs resize-none text-[#212b36] dark:text-white"
                />
              </div>

              {/* Theme Color Picker */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setEditListData(prev => ({ ...prev, color: c.value }))}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${editListData.color === c.value ? 'ring-2 ring-offset-2 ring-[#1890FF] scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    >
                      {editListData.color === c.value && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editListData.name.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#0077e6] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                >
                  <Check size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 5. MODAL: ADD CANDIDATES TO ACTIVE LIST                        */}
      {/* ============================================================== */}
      {isAddCandidatesModalOpen && activeList && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4 max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                    Add Candidates to "{activeList.name}"
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Select candidates from your pool to add to this talent list
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCandidatesModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-2.5 shrink-0 text-xs flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search available candidates..."
                  value={poolSearchQuery}
                  onChange={(e) => setPoolSearchQuery(e.target.value)}
                  className="w-full pl-8.5 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-[#212b36] dark:text-white"
                />
              </div>

              <select
                value={poolStageFilter}
                onChange={(e) => setPoolStageFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-[#212b36] dark:text-white font-semibold cursor-pointer"
              >
                <option value="All">All Stages</option>
                {stageOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  if (selectedCandidatePoolIds.length === filteredPoolCandidates.length) {
                    setSelectedCandidatePoolIds([]);
                  } else {
                    setSelectedCandidatePoolIds(filteredPoolCandidates.map(c => c.id));
                  }
                }}
                className="text-xs font-bold text-[#1890FF] hover:underline cursor-pointer ml-auto"
              >
                {selectedCandidatePoolIds.length === filteredPoolCandidates.length && filteredPoolCandidates.length > 0
                  ? 'Deselect All'
                  : 'Select All Filtered'}
              </button>
            </div>

            {/* Candidate List Pool */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 custom-scrollbar border border-gray-100 dark:border-gray-800 rounded-xl p-1">
              {filteredPoolCandidates.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  {availablePoolCandidates.length === 0
                    ? 'All candidates in your pool are already members of this list!'
                    : 'No candidates matched your search criteria.'}
                </div>
              ) : (
                filteredPoolCandidates.map(c => {
                  const isChecked = selectedCandidatePoolIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCandidatePoolIds(prev =>
                          prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]
                        );
                      }}
                      className={`p-3 flex items-center justify-between gap-3 rounded-lg transition-colors cursor-pointer ${isChecked ? 'bg-blue-50/60 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => { }} // handled by parent div
                          className="w-4 h-4 text-[#1890FF] rounded border-gray-300 focus:ring-[#1890FF] cursor-pointer"
                        />
                        <div className="w-8 h-8 rounded-full bg-[#1890FF]/15 text-[#1890FF] font-bold flex items-center justify-center text-xs shrink-0">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#212b36] dark:text-white truncate">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {c.role} • {c.company} ({c.experience})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadgeStyle(c.stage)}`}>
                          {c.stage}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getNoticePeriodBadgeStyle(c.noticePeriod)}`}>
                          {c.noticePeriod}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with Selected count and Confirm button */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 text-xs">
              <span className="font-semibold text-gray-600 dark:text-gray-400">
                {selectedCandidatePoolIds.length} candidate{selectedCandidatePoolIds.length === 1 ? '' : 's'} selected
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddCandidatesModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddCandidates}
                  disabled={selectedCandidatePoolIds.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#0077e6] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                >
                  <UserPlus size={14} />
                  <span>Add to List</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 6. MODAL: DELETE LIST CONFIRMATION                             */}
      {/* ============================================================== */}
      {deleteListModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 text-[#FF5630] flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                Delete Candidate List?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-[#212b36] dark:text-white">"{deleteListModal.listName}"</strong>? This will remove this curated list from your dashboard. Candidate profiles will remain untouched in the global candidate pool.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteListModal({ isOpen: false, listId: null, listName: '' })}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteList}
                className="px-4 py-2 rounded-xl text-white font-bold bg-[#FF5630] hover:bg-red-600 transition-all shadow-sm text-xs cursor-pointer"
              >
                Yes, Delete List
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================== */}
      {/* 7. MODAL: QUICK VIEW CANDIDATE DOSSIER                         */}
      {/* ============================================================== */}
      {quickViewCandidate && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-gray-100 dark:border-gray-800 space-y-5">

            {/* Quick View Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1890FF] to-[#8E33FF] text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                  {quickViewCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-[#212b36] dark:text-white">
                      {quickViewCandidate.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1890FF]/10 text-[#1890FF]">
                      Match: {quickViewCandidate.score || '9.2/10'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {quickViewCandidate.role} • {quickViewCandidate.department || 'Engineering'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setQuickViewCandidate(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Key Candidate Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Current Company</span>
                <span className="font-bold text-[#212b36] dark:text-white truncate block">{quickViewCandidate.company}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Experience</span>
                <span className="font-bold text-[#212b36] dark:text-white truncate block">{quickViewCandidate.experience}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Notice Period</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">{quickViewCandidate.noticePeriod}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Location</span>
                <span className="font-bold text-[#212b36] dark:text-white truncate block">{quickViewCandidate.location}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Pipeline Stage</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getStageBadgeStyle(quickViewCandidate.stage)}`}>
                  {quickViewCandidate.stage}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Source</span>
                <span className="font-bold text-[#212b36] dark:text-white truncate block">{quickViewCandidate.source}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Mail size={13} className="text-gray-400 shrink-0" />
                <span className="font-semibold">{quickViewCandidate.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Phone size={13} className="text-gray-400 shrink-0" />
                <span className="font-semibold">{quickViewCandidate.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin size={13} className="text-gray-400 shrink-0" />
                <span className="font-semibold">{quickViewCandidate.location}</span>
              </div>
            </div>

            {/* Skills */}
            {quickViewCandidate.skills && quickViewCandidate.skills.length > 0 && (
              <div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">
                  Top Skills & Competencies
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {quickViewCandidate.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick View Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setQuickViewCandidate(null)}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetId = quickViewCandidate.id;
                  setQuickViewCandidate(null);
                  navigate(`/dashboard/candidates/${targetId}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold bg-[#1890FF] hover:bg-[#0077e6] transition-all shadow-sm text-xs cursor-pointer"
              >
                <span>View Full Details</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
