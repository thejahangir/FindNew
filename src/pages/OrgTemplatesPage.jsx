import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  Bot,
  X,
  Check,
  Copy,
  Briefcase,
  Layers,
  ArrowRight,
  Users,
  FileText,
  Globe,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

// Areas: All, General, Job, Candidate, Application
const AREA_OPTIONS = ['General', 'Job', 'Candidate', 'Application'];

// Categories: All, Screening, Interviews, Pipelines
const CATEGORY_OPTIONS = ['Screening', 'Interviews', 'Pipelines'];

// Default initial templates for Trinity AI prompts with Area & Category
const INITIAL_TRINITY_TEMPLATES = [
  {
    id: 'trin-1',
    title: 'Candidate Scorecard Synthesis',
    subtitle: 'Synthesizes scores, team consensus, and flags red flags across rounds.',
    prompt: 'Synthesize all interviewer scorecards, highlight unanimous strengths, and flag any discrepancies between ratings.',
    area: 'Candidate',
    category: 'Interviews',
    enabled: true,
    updatedAt: '2 hours ago'
  },
  {
    id: 'trin-2',
    title: 'Executive Summary for Hiring Manager',
    subtitle: 'High-impact 1-minute leadership briefing on final-round candidates.',
    prompt: 'Generate a 3-bullet executive briefing highlighting candidate career trajectory, leadership impact, and compensation alignment.',
    area: 'Candidate',
    category: 'Interviews',
    enabled: true,
    updatedAt: 'Yesterday'
  },
  {
    id: 'trin-3',
    title: 'Technical Assessment Deep-Dive',
    subtitle: 'Evaluates architecture, code readability, and scalability tradeoffs.',
    prompt: 'Analyze candidate take-home challenge submission against level rubrics and benchmark against enterprise standards.',
    area: 'Application',
    category: 'Screening',
    enabled: true,
    updatedAt: '3 days ago'
  },
  {
    id: 'trin-4',
    title: 'Job Requisition Scope & Competencies',
    subtitle: 'Validates role requirements, leveling criteria, and pipeline stages.',
    prompt: 'Review job description requirements and formulate stage-by-stage evaluation criteria for the hiring pipeline.',
    area: 'Job',
    category: 'Pipelines',
    enabled: true,
    updatedAt: 'Oct 12'
  },
  {
    id: 'trin-5',
    title: 'Stage Progression & Bottleneck Analyzer',
    subtitle: 'Identifies delayed applicants and recommends pipeline acceleration.',
    prompt: 'Analyze time-in-stage metrics for this requisition pipeline and highlight candidate bottlenecks.',
    area: 'Application',
    category: 'Pipelines',
    enabled: false,
    updatedAt: 'Oct 08'
  },
  {
    id: 'trin-6',
    title: 'Initial Resume Screening Fit Check',
    subtitle: 'Quick parsing of core qualifications and role alignment.',
    prompt: 'Evaluate candidate background against key job prerequisites and summarize top 3 match points.',
    area: 'Candidate',
    category: 'Screening',
    enabled: true,
    updatedAt: 'Oct 05'
  },
  {
    id: 'trin-7',
    title: 'Interview Bias & Evaluation Guardrails',
    subtitle: 'Standard prompts on interview bias prevention and rubric adherence.',
    prompt: 'Provide interview guidelines to ensure unbiased evaluation and structured questioning.',
    area: 'General',
    category: 'Interviews',
    enabled: false,
    updatedAt: 'Sep 28'
  },
  {
    id: 'trin-8',
    title: 'Job Description Inclusivity & Clarity',
    subtitle: 'Optimizes JD language for inclusivity and top-tier candidate conversion.',
    prompt: 'Scan job posting for biased terminology, suggest inclusive phrasing, and enhance role clarity.',
    area: 'Job',
    category: 'Screening',
    enabled: true,
    updatedAt: 'Sep 22'
  }
];

// Area icon helper
const getAreaIcon = (area, size = 12) => {
  switch (area) {
    case 'Job':
      return <Briefcase size={size} />;
    case 'Candidate':
      return <Users size={size} />;
    case 'Application':
      return <FileText size={size} />;
    case 'General':
    default:
      return <Globe size={size} />;
  }
};

// Custom Dropdown Component for Area & Category filters
function FilterDropdown({ label, value, onChange, options, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
          value !== 'All'
            ? 'bg-blue-50/70 dark:bg-blue-950/30 border-[#1890FF] text-[#1890FF] ring-2 ring-[#1890FF]/15'
            : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        {Icon && <Icon size={14} className={value !== 'All' ? 'text-[#1890FF]' : 'text-gray-400'} />}
        <span className="text-gray-400 font-normal">{label}:</span>
        <span className="font-bold">{selectedOpt.label || selectedOpt.value}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1890FF]' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[170px] bg-white dark:bg-[#1e2732] rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-40 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                value === opt.value
                  ? 'bg-[#1890FF]/10 text-[#1890FF] font-bold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <span>{opt.label || opt.value}</span>
              </div>
              {opt.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    value === opt.value
                      ? 'bg-[#1890FF] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {opt.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Compact, smaller Switch Component in Primary Blue (#1890FF)
function Switch({ checked, onChange, disabled = false, ariaLabel = 'Toggle switch' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex items-center h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1890FF]/30 ${
        checked ? 'bg-[#1890FF]' : 'bg-gray-300 dark:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
          checked ? 'translate-x-3.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function OrgTemplatesPage() {
  const { setIsChatbotCollapsed, setChatbotWidth, sendMessage } = useChatbot();

  // Active top tab: 'trinity' | 'jobs'
  const [activeTab, setActiveTab] = useState('trinity');

  // Templates state with local storage cache fallback
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('talentflow_trinity_templates_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          area: item.area || 'General',
          category: item.category || 'Screening'
        }));
      }
      return INITIAL_TRINITY_TEMPLATES;
    } catch {
      return INITIAL_TRINITY_TEMPLATES;
    }
  });

  // Sync with local storage
  useEffect(() => {
    try {
      localStorage.setItem('talentflow_trinity_templates_v4', JSON.stringify(templates));
    } catch {
      // ignore storage quota issues
    }
  }, [templates]);

  // View mode: 'cards' (default) or 'grid' (table / data grid view)
  const [viewMode, setViewMode] = useState('cards');

  // Search & Filters for Area, Category, and Status (Dropdowns)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    prompt: '',
    area: 'General',
    category: 'Screening',
    enabled: true
  });

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedPromptId, setCopiedPromptId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPI calculations
  const totalCount = templates.length;
  const enabledCount = useMemo(() => templates.filter((t) => t.enabled).length, [templates]);
  const disabledCount = useMemo(() => templates.filter((t) => !t.enabled).length, [templates]);

  // Dropdown options with real-time counts
  const areaDropdownOptions = useMemo(
    () => [
      { value: 'All', label: 'All Areas', count: templates.length },
      {
        value: 'General',
        label: 'General',
        icon: <Globe size={13} />,
        count: templates.filter((t) => t.area === 'General').length
      },
      {
        value: 'Job',
        label: 'Job',
        icon: <Briefcase size={13} />,
        count: templates.filter((t) => t.area === 'Job').length
      },
      {
        value: 'Candidate',
        label: 'Candidate',
        icon: <Users size={13} />,
        count: templates.filter((t) => t.area === 'Candidate').length
      },
      {
        value: 'Application',
        label: 'Application',
        icon: <FileText size={13} />,
        count: templates.filter((t) => t.area === 'Application').length
      }
    ],
    [templates]
  );

  const categoryDropdownOptions = useMemo(
    () => [
      { value: 'All', label: 'All Categories', count: templates.length },
      {
        value: 'Screening',
        label: 'Screening',
        count: templates.filter((t) => t.category === 'Screening').length
      },
      {
        value: 'Interviews',
        label: 'Interviews',
        count: templates.filter((t) => t.category === 'Interviews').length
      },
      {
        value: 'Pipelines',
        label: 'Pipelines',
        count: templates.filter((t) => t.category === 'Pipelines').length
      }
    ],
    [templates]
  );

  // Filtered Templates based on Area, Category, Status, and Search
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.prompt.toLowerCase().includes(q) ||
        (t.area && t.area.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q));

      // Area filter
      const matchesArea = selectedArea === 'All' || t.area === selectedArea;

      // Category filter
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

      return matchesSearch && matchesArea && matchesCategory;
    });
  }, [templates, searchQuery, selectedArea, selectedCategory]);

  // Handlers
  const handleToggleEnable = (id, newStatus) => {
    setTemplates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: newStatus } : item))
    );
    showToast(newStatus ? 'Template enabled' : 'Template disabled');
  };

  const handleAskTrinity = (template) => {
    if (setIsChatbotCollapsed) {
      setIsChatbotCollapsed(false);
    }
    if (setChatbotWidth) {
      setChatbotWidth((prev) => Math.max(prev, 460));
    }
    if (sendMessage) {
      sendMessage(template.prompt);
    }
    showToast(`Trinity opened with prompt: "${template.title}"`);
  };

  const handleCopyPrompt = (template) => {
    navigator.clipboard.writeText(template.prompt);
    setCopiedPromptId(template.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
    showToast('Prompt copied to clipboard');
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      subtitle: '',
      prompt: '',
      area: selectedArea !== 'All' ? selectedArea : 'General',
      category: selectedCategory !== 'All' ? selectedCategory : 'Screening',
      enabled: true
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      subtitle: template.subtitle,
      prompt: template.prompt,
      area: template.area || 'General',
      category: template.category || 'Screening',
      enabled: template.enabled
    });
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.prompt.trim()) {
      alert('Please provide both a Template Title and Prompt Text.');
      return;
    }

    if (editingTemplate) {
      // Edit mode
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                title: formData.title.trim(),
                subtitle: formData.subtitle.trim() || 'Prompt template for Trinity AI.',
                prompt: formData.prompt.trim(),
                area: formData.area || 'General',
                category: formData.category || 'Screening',
                enabled: formData.enabled,
                updatedAt: 'Just now'
              }
            : t
        )
      );
      showToast('Template updated successfully');
      setEditingTemplate(null);
    } else {
      // Add mode
      const newTemplate = {
        id: `trin-${Date.now()}`,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || 'Custom prompt template for Trinity AI.',
        prompt: formData.prompt.trim(),
        area: formData.area || 'General',
        category: formData.category || 'Screening',
        enabled: formData.enabled,
        updatedAt: 'Just now'
      };
      setTemplates((prev) => [newTemplate, ...prev]);
      showToast('New Trinity template created');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingTemplate) return;
    setTemplates((prev) => prev.filter((t) => t.id !== deletingTemplate.id));
    showToast(`Deleted "${deletingTemplate.title}"`);
    setDeletingTemplate(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in w-full min-w-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] rounded-xl shadow-xl text-sm font-medium animate-fade-in border border-gray-700 dark:border-gray-200">
          <CheckCircle2 size={16} className="text-[#00A76F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-0">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          {/* Tab 1: Trinity templates */}
          <button
            onClick={() => setActiveTab('trinity')}
            className={`relative pb-3 text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'trinity'
                ? 'text-[#1890FF] dark:text-[#1890FF]'
                : 'text-gray-500 dark:text-gray-400 hover:text-[#212b36] dark:hover:text-white'
            }`}
          >
            <Sparkles size={16} />
            <span>Trinity templates</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                activeTab === 'trinity'
                  ? 'bg-[#1890FF]/10 text-[#1890FF]'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {templates.length}
            </span>
            {activeTab === 'trinity' && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1890FF] rounded-t-full shadow-xs transition-all duration-200" />
            )}
          </button>

          {/* Tab 2: Job templates */}
          <button
            onClick={() => setActiveTab('jobs')}
            className={`relative pb-3 text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'text-[#1890FF] dark:text-[#1890FF]'
                : 'text-gray-500 dark:text-gray-400 hover:text-[#212b36] dark:hover:text-white'
            }`}
          >
            <Briefcase size={16} />
            <span>Job templates</span>
            
            {activeTab === 'jobs' && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1890FF] rounded-t-full shadow-xs transition-all duration-200" />
            )}
          </button>
        </div>

        {/* Global status indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pb-2">
          <span className="w-2 h-2 rounded-full bg-[#00A76F] inline-block animate-pulse" />
          <span>Organization Library Active</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: TRINITY TEMPLATES */}
      {/* ========================================================= */}
      {activeTab === 'trinity' && (
        <div className="space-y-5 w-full">
          {/* Header Section: Matches standard page headers */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#212b36] dark:text-white">
                Trinity Templates
              </h1>
              <p className="text-sm text-black dark:text-gray-400 mt-1 max-w-3xl">
                Manage your company’s prompts for Trinity. Enabled ones appear for everyone in the Trinity panel.
              </p>
            </div>

            {/* CTA "Add New Template" */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1890FF] hover:bg-[#0077e6] text-white text-sm font-bold rounded-xl shadow-[0_4px_12px_rgba(24,144,255,0.24)] transition-all transform active:scale-95 cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add New Template</span>
              </button>
            </div>
          </div>

          {/* Three Compact KPI Cards: Total, Enabled, Disabled */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* KPI 1: Total */}
            <div className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/70 shadow-2xs hover:border-gray-200 dark:hover:border-gray-700 transition-all flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
                <Layers size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#212b36] dark:text-white leading-none">
                    {totalCount}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  All prompt templates in library
                </p>
              </div>
            </div>

            {/* KPI 2: Enabled */}
            <div className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/70 shadow-2xs hover:border-gray-200 dark:hover:border-gray-700 transition-all flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#1890FF] leading-none">
                    {enabledCount}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1890FF]">
                    Enabled
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  Active & visible in Trinity panel
                </p>
              </div>
            </div>

            {/* KPI 3: Disabled */}
            <div className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/70 shadow-2xs hover:border-gray-200 dark:hover:border-gray-700 transition-all flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0">
                <XCircle size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#212b36] dark:text-white leading-none">
                    {disabledCount}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Disabled
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  Hidden from Trinity panel
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CONTROLS BAR: SEARCH, AREA DROPDOWN, CATEGORY DROPDOWN, VIEW TOGGLE */}
          {/* ========================================================= */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#161c24] p-3 rounded-2xl border border-gray-100 dark:border-gray-800/70 shadow-2xs w-full">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by title, prompt, or keyword..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 text-[#212b36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1890FF] focus:ring-1 focus:ring-[#1890FF]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & View Mode Controls */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Area Dropdown (Dropdown Only) */}
              <FilterDropdown
                label="Area"
                value={selectedArea}
                onChange={setSelectedArea}
                icon={Globe}
                options={areaDropdownOptions}
              />

              {/* Category Dropdown (Dropdown Only) */}
              <FilterDropdown
                label="Category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                icon={SlidersHorizontal}
                options={categoryDropdownOptions}
              />

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shrink-0 border border-gray-200 dark:border-gray-700/60">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  title="Card View (Default)"
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-[#212b36] text-[#1890FF] shadow-xs'
                      : 'text-gray-500 hover:text-[#212b36] dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid size={16} />
                  <span className="hidden md:inline">Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Grid / Table View"
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-[#212b36] text-[#1890FF] shadow-xs'
                      : 'text-gray-500 hover:text-[#212b36] dark:hover:text-white'
                  }`}
                >
                  <TableIcon size={16} />
                  <span className="hidden md:inline">Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active filter badge if filtering */}
          {(searchQuery || selectedArea !== 'All' || selectedCategory !== 'All') && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Showing {filteredTemplates.length} of {templates.length} templates
                {selectedArea !== 'All' && <b> • Area: {selectedArea}</b>}
                {selectedCategory !== 'All' && <b> • Category: {selectedCategory}</b>}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedArea('All');
                  setSelectedCategory('All');
                                  }}
                className="text-[#1890FF] hover:underline font-semibold cursor-pointer ml-1"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center w-full">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Search size={24} />
              </div>
              <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-1">
                No templates found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                We couldn't find any templates in "{selectedArea}" area and "{selectedCategory}" category matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedArea('All');
                  setSelectedCategory('All');
                                  }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1890FF] rounded-xl hover:bg-[#0077e6] transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW MODE 1: CARD VIEW (DEFAULT & FLUID GRID) */}
          {/* ========================================================= */}
          {viewMode === 'cards' && filteredTemplates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
              {filteredTemplates.map((template) => {
                const isCopied = copiedPromptId === template.id;

                return (
                  <div
                    key={template.id}
                    className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-[0_4px_24px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-[#1890FF]/40"
                  >
                    {/* Card Top & Body */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Top Badges: Area & Category */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                        {/* Area Badge */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/20">
                          {getAreaIcon(template.area, 10)}
                          <span>{template.area || 'General'}</span>
                        </span>

                        {/* Category Badge */}
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300">
                          {template.category || 'Screening'}
                        </span>
                      </div>

                      {/* Title of Template: Matches standard text-sm font-bold size */}
                      <h3
                        className="text-sm font-bold text-[#212b36] dark:text-white line-clamp-1 mb-1 group-hover:text-[#1890FF] transition-colors"
                        title={template.title}
                      >
                        {template.title}
                      </h3>

                      {/* One line of sub title */}
                      <p
                        className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3.5"
                        title={template.subtitle}
                      >
                        {template.subtitle}
                      </p>

                      {/* One or two line for prompt text */}
                      <div className="mt-auto relative rounded-xl bg-gray-50 dark:bg-[#1c242f] p-3 border border-gray-100 dark:border-gray-800/60 group/prompt">
                        <div className="flex items-start gap-2">
                          <Bot size={14} className="text-[#1890FF] shrink-0 mt-0.5" />
                          <p
                            className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed italic pr-6"
                            title={template.prompt}
                          >
                            "{template.prompt}"
                          </p>
                        </div>

                        {/* Copy Prompt Quick Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(template)}
                          title="Copy prompt text"
                          className="absolute right-2 top-2 p-1 text-gray-400 hover:text-[#1890FF] rounded-md transition-colors opacity-0 group-hover/prompt:opacity-100"
                        >
                          {isCopied ? <Check size={13} className="text-[#1890FF]" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Card Footer: "Ask Trinity", Smaller Switch (Blue), Edit and Redish Delete */}
                    <div className="px-5 py-3 bg-gray-50/70 dark:bg-[#13181f] border-t border-gray-100 dark:border-gray-800/70 flex items-center justify-between gap-2">
                      {/* CTA: "Ask Trinity" */}
                      <button
                        type="button"
                        onClick={() => handleAskTrinity(template)}
                        title="Run this prompt in Trinity"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1890FF]/10 hover:bg-[#1890FF] text-[#1890FF] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Sparkles size={13} />
                        <span>Ask Trinity</span>
                      </button>

                      {/* Right Footer Controls: Smaller Switch, Edit, Redish Delete */}
                      <div className="flex items-center gap-2">
                        {/* Smaller Switch button in Primary Blue */}
                        <div className="flex items-center" title={template.enabled ? 'Click to Disable' : 'Click to Enable'}>
                          <Switch
                            checked={template.enabled}
                            onChange={(val) => handleToggleEnable(template.id, val)}
                            ariaLabel={`Toggle ${template.title}`}
                          />
                        </div>

                        <div className="h-3.5 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(template)}
                          title="Edit Template"
                          className="p-1.5 text-gray-500 hover:text-[#1890FF] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* Delete Button: Redish */}
                        <button
                          type="button"
                          onClick={() => setDeletingTemplate(template)}
                          title="Delete Template"
                          className="p-1.5 text-[#FF5630] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
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

          {/* ========================================================= */}
          {/* VIEW MODE 2: GRID / TABLE VIEW (FLUID FULL WIDTH) */}
          {/* ========================================================= */}
          {viewMode === 'grid' && filteredTemplates.length > 0 && (
            <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3.5">Template</th>
                      <th className="px-4 py-3.5">Area</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Prompt Preview</th>
                      <th className="px-4 py-3.5 text-center">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {filteredTemplates.map((template) => (
                      <tr
                        key={template.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group"
                      >
                        {/* Title and Subtitle: Matches standard text-sm font-bold */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">
                              {template.title}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                              {template.subtitle}
                            </span>
                          </div>
                        </td>

                        {/* Area */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/20">
                            {getAreaIcon(template.area)}
                            <span>{template.area || 'General'}</span>
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {template.category || 'Screening'}
                          </span>
                        </td>

                        {/* Prompt Preview */}
                        <td className="px-6 py-4 max-w-lg">
                          <div className="flex items-start gap-2">
                            <Bot size={14} className="text-[#1890FF] shrink-0 mt-0.5" />
                            <span
                              className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 italic"
                              title={template.prompt}
                            >
                              "{template.prompt}"
                            </span>
                          </div>
                        </td>

                        {/* Smaller Switch in Blue */}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="inline-flex items-center gap-2">
                            <Switch
                              checked={template.enabled}
                              onChange={(val) => handleToggleEnable(template.id, val)}
                              ariaLabel={`Toggle ${template.title}`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                template.enabled ? 'text-[#1890FF]' : 'text-gray-400'
                              }`}
                            >
                              {template.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </td>

                        {/* Actions: Ask Trinity, Edit, Redish Delete */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleAskTrinity(template)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1890FF]/10 hover:bg-[#1890FF] text-[#1890FF] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                              title="Ask Trinity"
                            >
                              <Sparkles size={12} />
                              <span>Ask Trinity</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(template)}
                              className="p-1.5 text-gray-500 hover:text-[#1890FF] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                              title="Edit Template"
                            >
                              <Edit3 size={15} />
                            </button>

                            {/* Redish Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeletingTemplate(template)}
                              className="p-1.5 text-[#FF5630] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                              title="Delete Template"
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
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: JOB TEMPLATES (BLANK WITH STANDARD MESSAGE) */}
      {/* ========================================================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-6 w-full">
          <div>
            <h1 className="text-2xl font-bold text-[#212b36] dark:text-white">
              Job Templates
            </h1>
            <p className="text-sm text-black dark:text-gray-400 mt-1 max-w-2xl">
              Manage and configure organization-wide job templates.
            </p>
          </div>

          {/* Standard blank placeholder container */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/70 p-12 flex flex-col items-center justify-center text-center min-h-[380px] shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center mb-4 shadow-sm">
              <Briefcase size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-2">
              Job Templates
            </h3>
            <p className="text-black dark:text-gray-400 max-w-md text-sm leading-relaxed">
              This page is under construction. Content will be added later.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT TRINITY TEMPLATE */}
      {/* ========================================================= */}
      {(isAddModalOpen || editingTemplate) &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div
              className="bg-white dark:bg-[#1e2732] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-xl overflow-hidden animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                      {editingTemplate ? 'Edit Trinity Template' : 'Add New Trinity Template'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Configure Area, Category, and Prompt parameters for Trinity
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingTemplate(null);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveModal}>
                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  {/* Title of Template */}
                  <div>
                    <label className="block text-xs font-bold text-[#212b36] dark:text-gray-200 mb-1.5">
                      Title of Template <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Candidate Scorecard Synthesis"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-[#212b36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1890FF] focus:ring-1 focus:ring-[#1890FF]"
                    />
                  </div>

                  {/* One line of sub title */}
                  <div>
                    <label className="block text-xs font-bold text-[#212b36] dark:text-gray-200 mb-1.5">
                      Sub title (One line description)
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Synthesizes scores, strengths & red flags across rounds"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-[#212b36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1890FF] focus:ring-1 focus:ring-[#1890FF]"
                    />
                  </div>

                  {/* Prompt Text (One or two line for prompt text) */}
                  <div>
                    <label className="block text-xs font-bold text-[#212b36] dark:text-gray-200 mb-1.5">
                      Prompt Text <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.prompt}
                      onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                      placeholder="e.g. Synthesize all scorecard evaluations, highlight unanimous strengths, and flag any discrepancies..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-[#212b36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1890FF] focus:ring-1 focus:ring-[#1890FF] resize-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      This is the prompt executed when anyone clicks "Ask Trinity" with this template.
                    </p>
                  </div>

                  {/* Area and Category Dropdowns (Modal Form) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Area Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-[#212b36] dark:text-gray-200 mb-1.5">
                        Area <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-[#212b36] dark:text-white focus:outline-none focus:border-[#1890FF]"
                      >
                        {AREA_OPTIONS.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-[#212b36] dark:text-gray-200 mb-1.5">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm text-[#212b36] dark:text-white focus:outline-none focus:border-[#1890FF]"
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Enable Switch */}
                  <div>
                    <label className="block text-xs font-bold text-[#212b36] dark:text-gray-200 mb-1.5">
                      Visibility in Trinity
                    </label>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <Switch
                        checked={formData.enabled}
                        onChange={(val) => setFormData({ ...formData, enabled: val })}
                        ariaLabel="Toggle enabled"
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {formData.enabled ? 'Enabled (Visible to all)' : 'Disabled (Hidden)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50/60 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingTemplate(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-[#1890FF] hover:bg-[#0077e6] text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Check size={14} />
                    <span>{editingTemplate ? 'Save Changes' : 'Create Template'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {deletingTemplate &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div
              className="bg-white dark:bg-[#1e2732] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6 text-center animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-[#FF5630] flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} />
              </div>

              <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-2">
                Delete Trinity Template?
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-gray-800 dark:text-gray-200">"{deletingTemplate.title}"</span>? This prompt will no longer appear in the Trinity panel.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingTemplate(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-xs font-bold bg-[#FF5630] hover:bg-red-600 text-white rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Delete Template
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
