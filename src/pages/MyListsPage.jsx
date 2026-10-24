import React, { useState, useMemo, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import {
  CANDIDATES_POOL,
  INITIAL_LISTS,
  getStoredLists,
  saveStoredLists
} from '../data/candidateListsData';

export default function MyListsPage() {
  const navigate = useNavigate();

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
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set();
    lists.forEach(l => {
      if (l.category) set.add(l.category);
    });
    return ['All', ...Array.from(set)];
  }, [lists]);

  const filteredLists = useMemo(() => {
    return lists.filter(list => {
      const matchesSearch =
        list.name.toLowerCase().includes(searchListQuery.toLowerCase()) ||
        (list.description && list.description.toLowerCase().includes(searchListQuery.toLowerCase())) ||
        (list.tags && list.tags.some(t => t.toLowerCase().includes(searchListQuery.toLowerCase())));
      const matchesCategory = selectedCategory === 'All' || list.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [lists, searchListQuery, selectedCategory]);

  // Right Panel: Filter Candidates within active list
  const [searchCandidateQuery, setSearchCandidateQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('All');
  const [selectedNoticeFilter, setSelectedNoticeFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const filteredCandidates = useMemo(() => {
    return activeCandidates.filter(candidate => {
      const q = searchCandidateQuery.toLowerCase();
      const matchesSearch =
        candidate.name.toLowerCase().includes(q) ||
        candidate.role.toLowerCase().includes(q) ||
        candidate.company.toLowerCase().includes(q) ||
        (candidate.skills && candidate.skills.some(s => s.toLowerCase().includes(q)));

      const matchesStage = selectedStageFilter === 'All' || candidate.stage === selectedStageFilter;
      const matchesNotice = selectedNoticeFilter === 'All' || candidate.noticePeriod === selectedNoticeFilter;

      return matchesSearch && matchesStage && matchesNotice;
    });
  }, [activeCandidates, searchCandidateQuery, selectedStageFilter, selectedNoticeFilter]);

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

  const getNoticeBadgeStyle = (notice) => {
    if (notice === 'Immediate') {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    }
    if (notice === '15 Days') {
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
    }
    return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
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
    <div className="p-6 space-y-6 relative w-full text-[#212b36] dark:text-gray-100 animate-fade-in font-sans">

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] rounded-xl shadow-xl text-sm font-semibold animate-fade-in border border-gray-700 dark:border-gray-200">
          <CheckCircle2 size={18} className="text-[#00A76F] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. TOP HEADER & KPI STATS BANNER                               */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
            <Link to="/dashboard" className="hover:text-[#1890FF] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <Link to="/dashboard/candidates" className="hover:text-[#1890FF] transition-colors">Candidates</Link>
            <ChevronRight size={12} />
            <span className="text-[#212b36] dark:text-white font-semibold">My List</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#212b36] dark:text-white flex items-center gap-2.5">
            <span>My Candidate Lists</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/20">
              {lists.length} Lists
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium mt-1 max-w-3xl">
            Curate, organize, and track candidate talent pools created for target roles, pipelines, and upcoming hiring rounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            to="/dashboard/candidates"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors shadow-2xs"
          >
            <Users size={14} className="text-gray-500" />
            <span>Browse All Candidates</span>
          </Link>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1890FF] hover:bg-[#0077e6] rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            <span>Create New List</span>
          </button>
        </div>
      </div>

      {/* QUICK SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#161c24] p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
            <Bookmark size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Recruiter Lists</p>
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
        {/* LEFT COLUMN: LIST OF LISTS RECRUITER HAS CREATED (4 COLS)     */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-4 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs flex flex-col overflow-hidden">

          {/* Left Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark size={18} className="text-[#1890FF]" />
                <h2 className="text-base font-bold text-[#212b36] dark:text-white">
                  Recruiter Lists
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {filteredLists.length}
                </span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                title="Create a new candidate list"
                className="p-1.5 rounded-lg text-[#1890FF] hover:bg-[#1890FF]/10 transition-colors cursor-pointer"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Search Lists */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search lists, tags, notes..."
                value={searchListQuery}
                onChange={(e) => setSearchListQuery(e.target.value)}
                className="w-full pl-8.5 pr-8 py-2 text-xs bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:border-[#1890FF] text-[#212b36] dark:text-white transition-colors"
              />
              {searchListQuery && (
                <button
                  onClick={() => setSearchListQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1890FF] text-white shadow-2xs'
                      : 'bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Cards Container */}
          <div className="p-3 space-y-2.5 max-h-[720px] overflow-y-auto custom-scrollbar">
            {filteredLists.length === 0 ? (
              <div className="p-8 text-center">
                <Bookmark size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">No lists found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or category filter</p>
                <button
                  onClick={() => { setSearchListQuery(''); setSelectedCategory('All'); }}
                  className="mt-3 text-xs font-bold text-[#1890FF] hover:underline"
                >
                  Reset filters
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
                    className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-[#1890FF] shadow-sm'
                        : 'bg-white dark:bg-[#161c24] border-gray-100 dark:border-gray-800/90 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#1890FF] rounded-r-full" />
                    )}

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: list.color || '#1890FF' }}
                        />
                        <h3 className={`text-sm font-bold truncate ${
                          isSelected ? 'text-[#1890FF]' : 'text-[#212b36] dark:text-white'
                        }`}>
                          {list.name}
                        </h3>
                      </div>

                      {/* Candidate count badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                        isSelected
                          ? 'bg-[#1890FF] text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}>
                        {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2.5 font-normal">
                      {list.description || 'No description added.'}
                    </p>

                    {/* Tags & Meta Row */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/60 text-[11px]">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400 font-semibold truncate max-w-[120px]">
                          {list.category || 'General'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400 font-medium truncate">
                          {list.updatedAt || 'Recent'}
                        </span>
                      </div>

                      {/* Quick Edit/Delete buttons on hover/select */}
                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(list);
                          }}
                          title="Edit List"
                          className="p-1 text-gray-400 hover:text-[#1890FF] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
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
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Bottom Create Button inside Card */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full mt-2 py-2.5 px-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-[#1890FF] hover:border-[#1890FF] dark:hover:border-[#1890FF] hover:bg-[#1890FF]/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FolderPlus size={15} />
              <span>Create Another List</span>
            </button>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: SHOWING CANDIDATES LISTED FOR PARTICULAR LIST  */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-8 space-y-4">

          {activeList ? (
            <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs overflow-hidden">

              {/* ACTIVE LIST BANNER HEADER */}
              <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800/80 bg-gradient-to-r from-gray-50/80 via-white to-white dark:from-gray-900/40 dark:via-[#161c24] dark:to-[#161c24]">
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
                      {activeList.tags && activeList.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          #{tag}
                        </span>
                      ))}
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

                {/* Quick Stage Breakdown Pills */}
                {activeCandidates.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-gray-400 font-semibold mr-1">Stage distribution:</span>
                    {Array.from(new Set(activeCandidates.map(c => c.stage))).map(stg => {
                      const count = activeCandidates.filter(c => c.stage === stg).length;
                      return (
                        <button
                          key={stg}
                          onClick={() => setSelectedStageFilter(selectedStageFilter === stg ? 'All' : stg)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            selectedStageFilter === stg
                              ? 'bg-[#1890FF] text-white border-[#1890FF] shadow-2xs'
                              : `${getStageBadgeStyle(stg)} hover:opacity-80`
                          }`}
                        >
                          {stg}: <span className="underline ml-0.5">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SEARCH & FILTERS BAR FOR ACTIVE LIST */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#161c24] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 flex-wrap">
                  {/* Search Candidate */}
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter by candidate, role, skills..."
                      value={searchCandidateQuery}
                      onChange={(e) => setSearchCandidateQuery(e.target.value)}
                      className="w-full pl-8.5 pr-8 py-2 text-xs bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-[#212b36] dark:text-white"
                    />
                    {searchCandidateQuery && (
                      <button
                        onClick={() => setSearchCandidateQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Stage Filter */}
                  <select
                    value={selectedStageFilter}
                    onChange={(e) => setSelectedStageFilter(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-[#212b36] dark:text-white cursor-pointer"
                  >
                    <option value="All">All Pipeline Stages</option>
                    {stageOptions.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>

                  {/* Notice Period Filter */}
                  <select
                    value={selectedNoticeFilter}
                    onChange={(e) => setSelectedNoticeFilter(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] text-[#212b36] dark:text-white cursor-pointer"
                  >
                    <option value="All">All Notice Periods</option>
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">&lt;= 15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60+ Days</option>
                  </select>

                  {(searchCandidateQuery || selectedStageFilter !== 'All' || selectedNoticeFilter !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchCandidateQuery('');
                        setSelectedStageFilter('All');
                        setSelectedNoticeFilter('All');
                      }}
                      className="text-xs font-bold text-[#1890FF] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <span className="text-xs font-semibold text-gray-400 mr-1">
                    Showing {filteredCandidates.length} of {activeCandidates.length}
                  </span>
                  <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode('table')}
                      title="Table View"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'table'
                          ? 'bg-white dark:bg-gray-700 text-[#1890FF] shadow-2xs'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <TableIcon size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      title="Card Grid View"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-gray-700 text-[#1890FF] shadow-2xs'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <LayoutGrid size={14} />
                    </button>
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
                    No candidates match your filters
                  </p>
                  <p className="text-xs text-gray-400">
                    Try searching for different keywords, stage, or notice period.
                  </p>
                  <button
                    onClick={() => {
                      setSearchCandidateQuery('');
                      setSelectedStageFilter('All');
                      setSelectedNoticeFilter('All');
                    }}
                    className="text-xs font-bold text-[#1890FF] hover:underline pt-1 cursor-pointer"
                  >
                    Reset Candidate Filters
                  </button>
                </div>
              ) : viewMode === 'table' ? (
                /* TABLE VIEW OF CANDIDATES */
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/75 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Role Applied</th>
                        <th className="py-3 px-4">Experience & Company</th>
                        <th className="py-3 px-4">Pipeline Stage</th>
                        <th className="py-3 px-4">Notice Period</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                      {filteredCandidates.map((candidate) => (
                        <tr
                          key={candidate.id}
                          className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors group"
                        >
                          {/* Candidate Name & Avatar */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1890FF] to-[#8E33FF] text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  to={`/dashboard/candidates/${candidate.id}`}
                                  className="font-bold text-[#212b36] dark:text-white hover:text-[#1890FF] dark:hover:text-[#1890FF] transition-colors block truncate"
                                >
                                  {candidate.name}
                                </Link>
                                <span className="text-[11px] text-gray-400 truncate block">
                                  {candidate.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Role Applied */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 block truncate">
                              {candidate.role}
                            </span>
                            <span className="text-[11px] text-gray-400 block truncate">
                              {candidate.department || 'Engineering'}
                            </span>
                          </td>

                          {/* Experience & Company */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                              <Building2 size={13} className="text-gray-400 shrink-0" />
                              <span className="truncate">{candidate.company}</span>
                            </div>
                            <span className="text-[11px] text-gray-400 block ml-4.5">
                              {candidate.experience}
                            </span>
                          </td>

                          {/* Pipeline Stage */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block ${getStageBadgeStyle(candidate.stage)}`}>
                              {candidate.stage}
                            </span>
                          </td>

                          {/* Notice Period */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${getNoticeBadgeStyle(candidate.noticePeriod)}`}>
                              {candidate.noticePeriod || '30 Days'}
                            </span>
                          </td>

                          {/* Source */}
                          <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium text-[11px]">
                            {candidate.source || 'Direct Careers'}
                          </td>

                          {/* Actions: Quick View, View Details, and Remove from List */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick View (Icon only) */}
                              <button
                                onClick={() => setQuickViewCandidate(candidate)}
                                title="Quick View"
                                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1890FF] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                              >
                                <Eye size={15} />
                              </button>

                              {/* View Details Profile Page */}
                              <Link
                                to={`/dashboard/candidates/${candidate.id}`}
                                title="View Full Profile"
                                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1890FF] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                <ExternalLink size={15} />
                              </Link>

                              {/* Remove from List (Reddish trash) */}
                              <button
                                onClick={() => handleRemoveCandidateFromList(candidate.id, candidate.name)}
                                title="Remove from this list"
                                className="p-1.5 rounded-lg text-[#FF5630] hover:bg-[#FF5630]/10 transition-colors cursor-pointer"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* GRID / CARD VIEW OF CANDIDATES */
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#161c24] hover:shadow-md transition-all space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1890FF] to-[#8E33FF] text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/dashboard/candidates/${candidate.id}`}
                              className="font-bold text-sm text-[#212b36] dark:text-white hover:text-[#1890FF] transition-colors block truncate"
                            >
                              {candidate.name}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {candidate.role}
                            </p>
                          </div>
                        </div>

                        {/* Remove from List button */}
                        <button
                          onClick={() => handleRemoveCandidateFromList(candidate.id, candidate.name)}
                          title="Remove candidate from this list"
                          className="p-1 text-gray-400 hover:text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Company:</span>
                          <span className="font-semibold text-[#212b36] dark:text-white">{candidate.company}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Experience:</span>
                          <span className="font-semibold">{candidate.experience}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Notice Period:</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getNoticeBadgeStyle(candidate.noticePeriod)}`}>
                            {candidate.noticePeriod}
                          </span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {candidate.skills.slice(0, 3).map((sk, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                              {sk}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="text-[10px] text-gray-400 font-semibold">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStageBadgeStyle(candidate.stage)}`}>
                          {candidate.stage}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setQuickViewCandidate(candidate)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-[#1890FF] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Quick View</span>
                          </button>
                          <Link
                            to={`/dashboard/candidates/${candidate.id}`}
                            className="p-1 text-gray-500 hover:text-[#1890FF] rounded-lg transition-colors"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
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
      {/* 3. MODAL: CREATE NEW LIST                                      */}
      {/* ============================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                  <FolderPlus size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                    Create New Candidate List
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
                <select
                  value={newListData.category}
                  onChange={(e) => setNewListData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] font-semibold text-[#212b36] dark:text-white cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Leadership">Leadership & Architecture</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="Fast-Track">Fast-Track Hiring</option>
                  <option value="Executive">Executive / VP</option>
                  <option value="Marketing">Growth & Marketing</option>
                  <option value="General">General Talent Pool</option>
                </select>
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        newListData.color === c.value ? 'ring-2 ring-offset-2 ring-[#1890FF] scale-110' : 'opacity-80 hover:opacity-100'
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
                  <span>Create List</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL: EDIT LIST DETAILS                                    */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
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
                <select
                  value={editListData.category}
                  onChange={(e) => setEditListData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#1890FF] font-semibold text-[#212b36] dark:text-white cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Leadership">Leadership & Architecture</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="Fast-Track">Fast-Track Hiring</option>
                  <option value="Executive">Executive / VP</option>
                  <option value="Marketing">Growth & Marketing</option>
                  <option value="General">General Talent Pool</option>
                </select>
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        editListData.color === c.value ? 'ring-2 ring-offset-2 ring-[#1890FF] scale-110' : 'opacity-80 hover:opacity-100'
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
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL: ADD CANDIDATES TO ACTIVE LIST                        */}
      {/* ============================================================== */}
      {isAddCandidatesModalOpen && activeList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
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
                      className={`p-3 flex items-center justify-between gap-3 rounded-lg transition-colors cursor-pointer ${
                        isChecked ? 'bg-blue-50/60 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
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
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getNoticeBadgeStyle(c.noticePeriod)}`}>
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
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. MODAL: DELETE LIST CONFIRMATION                             */}
      {/* ============================================================== */}
      {deleteListModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
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
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. MODAL: QUICK VIEW CANDIDATE DOSSIER                         */}
      {/* ============================================================== */}
      {quickViewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
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
        </div>
      )}

    </div>
  );
}
