import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X, Check, LayoutGrid, Table, RotateCcw, SlidersHorizontal } from 'lucide-react';
import SearchableSelect from '../ui/SearchableSelect';

// Quick parameter options data
export const QUICK_PARAMETERS_DATA = {
  status: [
    { id: 'Open', label: 'Open', count: 14 },
    { id: 'Closed', label: 'Closed', count: 5 },
    { id: 'Draft', label: 'Draft', count: 5 },
    { id: 'On Hold', label: 'On Hold', count: 4 }
  ],
  skills: [
    { id: 'react', label: 'React.js', count: 42 },
    { id: 'node', label: 'Node.js', count: 36 },
    { id: 'python', label: 'Python / AI', count: 38 },
    { id: 'ts', label: 'TypeScript', count: 29 },
    { id: 'aws', label: 'AWS Cloud', count: 31 },
    { id: 'figma', label: 'Figma UI/UX', count: 18 },
    { id: 'docker', label: 'Docker & K8s', count: 24 },
    { id: 'sql', label: 'PostgreSQL / SQL', count: 26 },
    { id: 'java', label: 'Java / Spring', count: 20 },
    { id: 'graphql', label: 'GraphQL', count: 15 }
  ],
  priority: [
    { id: 'p-urgent', label: 'Urgent / Immediate', count: 8 },
    { id: 'p-high', label: 'High Priority', count: 24 },
    { id: 'p-medium', label: 'Medium Priority', count: 35 },
    { id: 'p-low', label: 'Low Priority', count: 12 }
  ],
  hiringManager: [
    { id: 'hm-amit', label: 'Amit Sharma', count: 28 },
    { id: 'hm-sarah', label: 'Sarah Jenkins', count: 22 },
    { id: 'hm-david', label: 'David Chen', count: 19 },
    { id: 'hm-priya', label: 'Priya Patel', count: 16 },
    { id: 'hm-john', label: 'John Doe', count: 12 }
  ],
  recruiter: [
    { id: 'rec-lisa', label: 'Lisa Ray', count: 32 },
    { id: 'rec-vikram', label: 'Vikram Singh', count: 26 },
    { id: 'rec-rachel', label: 'Rachel Green', count: 21 },
    { id: 'rec-mark', label: 'Mark Taylor', count: 17 }
  ],
  openings: [
    { id: 'op-1', label: '1 - 2 Positions', count: 45 },
    { id: 'op-3', label: '3 - 5 Positions', count: 28 },
    { id: 'op-5', label: '5 - 10 Positions', count: 14 },
    { id: 'op-10', label: '10+ Bulk Hiring', count: 6 }
  ],
  shift: [
    { id: 'sh-day', label: 'General / Day Shift', count: 65 },
    { id: 'sh-night', label: 'Night Shift', count: 12 },
    { id: 'sh-rotational', label: 'Rotational Shift', count: 16 },
    { id: 'sh-flex', label: 'Flexible Shift', count: 34 }
  ],
  topSource: [
    { id: 'src-career', label: 'Direct Career Page', count: 54 },
    { id: 'src-linkedin', label: 'LinkedIn Recruiter', count: 48 },
    { id: 'src-agency', label: 'Agency Partner', count: 32 },
    { id: 'src-referral', label: 'Internal Referral', count: 24 },
    { id: 'src-boards', label: 'Job Boards (Indeed/Glassdoor)', count: 29 }
  ],
  education: [
    { id: 'edu-bachelor', label: "Bachelor's Degree", count: 68 },
    { id: 'edu-master', label: "Master's Degree", count: 42 },
    { id: 'edu-phd', label: 'Doctorate / PhD', count: 8 },
    { id: 'edu-any', label: 'Any Degree / Equivalent', count: 55 }
  ],
  noticePeriod: [
    { id: 'np-imm', label: 'Immediate Joiner (< 15 days)', count: 22 },
    { id: 'np-30', label: '15 - 30 Days', count: 48 },
    { id: 'np-60', label: '30 - 60 Days', count: 34 },
    { id: 'np-90', label: '60 - 90 Days', count: 16 }
  ],
  visaSponsorship: [
    { id: 'vs-avail', label: 'Sponsorship Available', count: 38 },
    { id: 'vs-trans', label: 'Transfer Only', count: 24 },
    { id: 'vs-none', label: 'Citizen / PR Only', count: 56 }
  ],
  industry: [
    { id: 'ind-ai', label: 'AI & Data Science', count: 44 },
    { id: 'ind-fin', label: 'FinTech & Banking', count: 36 },
    { id: 'ind-saas', label: 'Enterprise SaaS', count: 52 },
    { id: 'ind-ecom', label: 'E-Commerce', count: 28 }
  ]
};

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended (AI)' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'applicants_desc', label: 'Most Applicants' },
  { value: 'score_desc', label: 'Highest AI Score' },
  { value: 'title_asc', label: 'Job Title (A – Z)' }
];

export default function JobQuickFilterBar({
  quickFilters = {},
  onQuickFilterChange,
  onClearAll,
  parameterOptions,
  sortBy = 'recommended',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  sortOptions = SORT_OPTIONS,
  extraActions = null,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...'
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const barRef = useRef(null);

  // Overlapping Search Bar State
  const [isSearchOpen, setIsSearchOpen] = useState(Boolean(searchQuery));
  const [internalSearch, setInternalSearch] = useState('');
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const activeSearchQuery = onSearchChange !== undefined ? searchQuery : internalSearch;
  const handleSearchChange = (val) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  // Auto-focus input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Keep search open if external query becomes non-empty
  useEffect(() => {
    if (searchQuery && !isSearchOpen) {
      setIsSearchOpen(true);
    }
  }, [searchQuery]);

  // Close search overlay on click outside if input is empty
  useEffect(() => {
    function handleClickOutsideSearch(event) {
      if (
        isSearchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        if (!activeSearchQuery || !activeSearchQuery.trim()) {
          setIsSearchOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutsideSearch);
    return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
  }, [isSearchOpen, activeSearchQuery]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (key) => {
    if (activeDropdown === key) {
      setActiveDropdown(null);
      setSearchTerm('');
    } else {
      setActiveDropdown(key);
      setSearchTerm('');
    }
  };

  const handleToggleItem = (key, itemId) => {
    const currentList = quickFilters[key] || [];
    const updated = currentList.includes(itemId)
      ? currentList.filter(id => id !== itemId)
      : [...currentList, itemId];
    onQuickFilterChange(key, updated);
  };

  const handleClearCategory = (key) => {
    onQuickFilterChange(key, []);
  };

  // Primary parameter buttons list (always visible on left - exactly 5 filter parameters)
  const primaryParams = [
    { id: 'status', label: 'Status' },
    { id: 'skills', label: 'Skills' },
    { id: 'priority', label: 'Priority' },
    { id: 'hiringManager', label: 'Hiring manager' },
    { id: 'recruiter', label: 'Recruiter' }
  ];

  // Extra parameters that expand on the right side on "+5 More" (exactly 5 parameters)
  const extraParams = [
    { id: 'openings', label: 'Openings' },
    { id: 'shift', label: 'Shift' },
    { id: 'topSource', label: 'Top source' },
    { id: 'education', label: 'Education' },
    { id: 'noticePeriod', label: 'Notice period' }
  ];

  // Count active selections in extra parameters
  const extraActiveCount = extraParams.reduce(
    (acc, param) => acc + (quickFilters[param.id]?.length || 0),
    0
  );

  // Parameter label mapping for active chips (includes all potential quick parameter keys)
  const allParams = useMemo(() => [
    ...primaryParams,
    ...extraParams,
    { id: 'visaSponsorship', label: 'Visa status' },
    { id: 'industry', label: 'Industry' }
  ], []);
  const paramLabelMap = useMemo(() => {
    return allParams.reduce((acc, p) => ({ ...acc, [p.id]: p.label }), {});
  }, [allParams]);

  // Selected parameter chips list for bottom panel row
  const selectedChips = useMemo(() => {
    const chips = [];
    Object.entries(quickFilters).forEach(([catKey, ids]) => {
      if (Array.isArray(ids) && ids.length > 0) {
        const catLabel = paramLabelMap[catKey] || (catKey.charAt(0).toUpperCase() + catKey.slice(1));
        const items = (parameterOptions && parameterOptions[catKey]) || QUICK_PARAMETERS_DATA[catKey] || [];
        ids.forEach(id => {
          const item = items.find(it => it.id === id);
          chips.push({
            categoryKey: catKey,
            categoryLabel: catLabel,
            id: id,
            label: item ? item.label : id,
            colorDot: item ? item.colorDot : null
          });
        });
      }
    });
    return chips;
  }, [quickFilters, parameterOptions, paramLabelMap]);

  const handleClearAll = () => {
    handleSearchChange('');
    if (onClearAll) {
      onClearAll();
    } else {
      Object.keys(quickFilters).forEach(k => {
        onQuickFilterChange(k, []);
      });
    }
  };

  // Render individual dropdown menu
  const renderDropdownMenu = (paramId, title) => {
    const items = (parameterOptions && parameterOptions[paramId]) || QUICK_PARAMETERS_DATA[paramId] || [];
    const selectedIds = quickFilters[paramId] || [];
    const filteredItems = searchTerm.trim()
      ? items.filter(it => it.label.toLowerCase().includes(searchTerm.toLowerCase()))
      : items;

    return (
      <div className="absolute z-[150] left-0 top-full mt-2 w-64 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-2.5 animate-fade-in text-left">
        {/* Dropdown Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">
            {title}
          </span>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => handleClearCategory(paramId)}
              className="text-[11px] font-semibold text-[#1890FF] hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Input for lists with many items */}
        {items.length > 5 && (
          <div className="relative mb-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-2.5 py-1 text-xs bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-[#1890FF] text-[#212b36] dark:text-white"
              autoFocus
            />
          </div>
        )}

        {/* Items List */}
        <div className="max-h-52 overflow-y-auto space-y-1 scrollbar-thin">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => {
              const isChecked = selectedIds.includes(item.id);
              return (
                <label
                  key={item.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer text-xs select-none transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleItem(paramId, item.id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-[#1890FF] focus:ring-[#1890FF] w-3.5 h-3.5 cursor-pointer accent-[#1890FF]"
                    />
                    {paramId === 'status' && (
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        item.colorDot ? item.colorDot :
                        item.id === 'Open' || item.id === 'Active' ? 'bg-[#00A76F]' :
                        item.id === 'Closed' || item.id === 'Archived' ? 'bg-[#FF5630]' :
                        item.id === 'Draft' || item.id === 'On Hold' ? 'bg-[#FFAB00]' :
                        item.id === 'In Interviews' ? 'bg-[#8E33FF]' :
                        item.id === 'Needs Review' ? 'bg-[#1890FF]' :
                        item.id === 'Offer Pending' ? 'bg-emerald-500' :
                        item.id === 'Hired' ? 'bg-green-600' : 'bg-gray-400'
                      }`} />
                    )}
                    <span className={`text-[12px] truncate ${
                      isChecked ? 'font-bold text-[#1890FF]' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 shrink-0">
                    {item.count}
                  </span>
                </label>
              );
            })
          ) : (
            <div className="py-2 text-center text-xs text-gray-400">
              No matching options
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render parameter button
  const renderParamButton = (param) => {
    const selectedCount = (quickFilters[param.id] || []).length;
    const isOpen = activeDropdown === param.id;

    return (
      <div key={param.id} className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown(param.id)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all select-none whitespace-nowrap ${
            selectedCount > 0
              ? 'bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/30 font-bold'
              : isOpen
              ? 'bg-gray-100 dark:bg-gray-800 text-[#1890FF]'
              : 'text-gray-700 dark:text-gray-300 hover:text-[#1890FF] hover:bg-gray-50 dark:hover:bg-gray-800/60'
          }`}
        >
          <span>{param.label}</span>
          {selectedCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#1890FF] text-white text-[10px] font-extrabold flex items-center justify-center">
              {selectedCount}
            </span>
          )}
          <ChevronDown 
            size={13} 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1890FF]' : ''}`} 
          />
        </button>

        {isOpen && renderDropdownMenu(param.id, param.label)}
      </div>
    );
  };

  return (
    <div 
      ref={barRef}
      className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-xs transition-all duration-200"
    >
      {/* Top Filter Buttons & Controls Row */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 relative">
        {/* LEFT: Search Icon + Quick Parameter Filters with Overlapping Search Bar */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0 relative">
          {/* SEARCH ICON BUTTON (Positioned before all filter parameters) */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              title={activeSearchQuery ? `Active Search: "${activeSearchQuery}" (Click to edit)` : "Search (Click to expand)"}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer select-none h-[32px] w-[32px] shrink-0 ${
                activeSearchQuery
                  ? 'bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/40 shadow-xs font-bold'
                  : 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 hover:text-[#1890FF] hover:border-[#1890FF]/40 hover:bg-[#1890FF]/5'
              }`}
            >
              <Search size={14} className={activeSearchQuery ? 'text-[#1890FF]' : 'text-gray-500 dark:text-gray-400'} />
              {activeSearchQuery && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#1890FF] rounded-full ring-2 ring-white dark:ring-[#161c24]" />
              )}
            </button>
          </div>

          {/* Primary Parameters (Underneath the search overlay when open) */}
          {primaryParams.map(param => renderParamButton(param))}

          {/* Inline Expanded Extra Parameters (Visible when +5 More is expanded and not searching) */}
          {isMoreExpanded && !isSearchOpen && extraParams.map(param => renderParamButton(param))}

          {/* "+5 More" / "– Show less" Toggle Button (Hidden while search overlay is active) */}
          {!isSearchOpen && (
            <button
              type="button"
              onClick={() => setIsMoreExpanded(!isMoreExpanded)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all select-none whitespace-nowrap ${
                isMoreExpanded
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-[#1890FF]'
                  : extraActiveCount > 0
                  ? 'bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/30'
                  : 'text-[#1890FF] hover:text-[#096dd9] hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
              }`}
              title={isMoreExpanded ? 'Collapse extra filters' : 'Expand 5 more quick filters'}
            >
              <span>{isMoreExpanded ? '– Show less' : `+${extraParams.length} More`}</span>
              {(!isMoreExpanded && extraActiveCount > 0) && (
                <span className="w-4 h-4 rounded-full bg-[#1890FF] text-white text-[10px] font-extrabold flex items-center justify-center">
                  {extraActiveCount}
                </span>
              )}
              <ChevronDown 
                size={13} 
                className={`transition-transform duration-200 ${isMoreExpanded ? 'rotate-180' : ''}`} 
              />
            </button>
          )}

          {/* FULL-WIDTH OVERLAPPING SEARCH BAR (Spans full width, overlapping all 5 parameters and the +5 More button) */}
          {isSearchOpen && (
            <div 
              ref={searchContainerRef}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 w-full bg-white dark:bg-[#161c24] border border-[#1890FF]/60 dark:border-[#1890FF]/60 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30 ring-2 ring-[#1890FF]/15 flex items-center justify-between gap-3 px-3.5 py-1.5 h-[36px] animate-fade-in"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Search size={15} className="text-[#1890FF] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={activeSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs text-[#212b36] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none font-medium h-full"
                />
              </div>

              {/* Actions on right of search input */}
              <div className="flex items-center gap-2 shrink-0">
                {activeSearchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    title="Clear search text"
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}

                <div className="h-3.5 w-px bg-gray-200 dark:bg-gray-700" />

                {/* Direct action: Open All Filters (+5) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsMoreExpanded(true);
                  }}
                  title="Close search and show all 10 filter parameters"
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold text-[#1890FF] hover:bg-[#1890FF]/10 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal size={12} />
                  <span className="hidden sm:inline">All Filters (+5)</span>
                </button>

                {/* Close Search Button */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  title="Close search (Esc)"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                >
                  <X size={13} />
                  <span>Close</span>
                  <span className="hidden md:inline text-[10px] uppercase font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700">Esc</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Sort by Customized Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
              Sort by :
            </span>
            <div className="w-40 sm:w-44">
              <SearchableSelect
                options={sortOptions || SORT_OPTIONS}
                value={sortBy}
                onChange={(val) => onSortChange(val)}
                size="xs"
                showSearch={false}
                placeholder="Recommended (AI)"
              />
            </div>
          </div>

          {/* View Mode Toggle: Grid View (Table) / Card View */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-xl border border-gray-200/70 dark:border-gray-700/60 shadow-xs">
            <button
              type="button"
              onClick={() => onViewModeChange && onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' || viewMode === 'table'
                  ? 'bg-white dark:bg-[#161c24] text-[#1890FF] shadow-xs font-bold'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <Table size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange && onViewModeChange('card')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-[#161c24] text-[#1890FF] shadow-xs font-bold'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title="Card View"
              aria-label="Card View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          {extraActions}
        </div>
      </div>

      {/* Selected Parameters Chips Row (Below the panel in the same card) */}
      {(selectedChips.length > 0 || (activeSearchQuery && activeSearchQuery.trim())) && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/30 flex flex-wrap items-center gap-2 rounded-b-2xl animate-fade-in">
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
            Active:
          </span>

          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            {/* Search Query Chip if active */}
            {activeSearchQuery && activeSearchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-semibold bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/25 dark:bg-[#1890FF]/15 transition-all shadow-2xs">
                <Search size={11} className="text-[#1890FF] shrink-0" />
                <span className="font-bold text-[#1890FF]">Search:</span>
                <span className="font-medium text-[#1890FF] max-w-[140px] truncate" title={activeSearchQuery}>"{activeSearchQuery}"</span>
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[#1890FF] hover:text-white hover:bg-[#1890FF] transition-colors ml-0.5 cursor-pointer"
                  title="Clear search"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            {selectedChips.map((chip) => (
              <span
                key={`${chip.categoryKey}-${chip.id}`}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-semibold bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/25 dark:bg-[#1890FF]/15 transition-all shadow-2xs"
              >
                {chip.categoryKey === 'status' && (
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    chip.colorDot ? chip.colorDot :
                    chip.id === 'Open' || chip.id === 'Active' ? 'bg-[#00A76F]' :
                    chip.id === 'Closed' || chip.id === 'Archived' ? 'bg-[#FF5630]' :
                    chip.id === 'Draft' || chip.id === 'On Hold' ? 'bg-[#FFAB00]' :
                    chip.id === 'In Interviews' ? 'bg-[#8E33FF]' :
                    chip.id === 'Needs Review' ? 'bg-[#1890FF]' :
                    chip.id === 'Offer Pending' ? 'bg-emerald-500' :
                    chip.id === 'Hired' ? 'bg-green-600' : 'bg-gray-400'
                  }`} />
                )}
                <span className="font-medium text-[#1890FF]">{chip.label}</span>
                <button
                  type="button"
                  onClick={() => handleToggleItem(chip.categoryKey, chip.id)}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[#1890FF] hover:text-white hover:bg-[#1890FF] transition-colors ml-0.5 cursor-pointer"
                  title={`Remove ${chip.label}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}

            {/* Next to it: "Clear All" button */}
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-bold text-[#FF5630] hover:text-[#de350b] hover:bg-[#FF5630]/10 px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-1 shrink-0"
              title="Clear all active parameters"
            >
              <RotateCcw size={11} /> Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
