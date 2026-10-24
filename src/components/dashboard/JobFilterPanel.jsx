import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, Search, X, ChevronDown, ChevronUp, 
  Briefcase, MapPin, Award, Building2, Clock, Laptop, 
  Sparkles, Calendar, Check, RotateCcw, SlidersHorizontal 
} from 'lucide-react';

// ============================================================================
// FILTER CATEGORIES DATA (Over 10 items in each category)
// ============================================================================
export const FILTER_DATA = {
  department: [
    { id: 'eng', label: 'Engineering', count: 42 },
    { id: 'prod', label: 'Product Management', count: 28 },
    { id: 'design', label: 'Design & UX', count: 19 },
    { id: 'data', label: 'Data Science & AI', count: 24 },
    { id: 'mktg', label: 'Marketing & Growth', count: 16 },
    { id: 'sales', label: 'Sales & Business Dev', count: 21 },
    { id: 'hr', label: 'Human Resources & Talent', count: 12 },
    { id: 'cs', label: 'Customer Success', count: 14 },
    { id: 'fin', label: 'Finance & Accounting', count: 9 },
    { id: 'ops', label: 'Operations & Legal', count: 11 },
    // +12 More items (> 10)
    { id: 'qa', label: 'Quality Assurance', count: 8 },
    { id: 'sec', label: 'Information Security', count: 7 },
    { id: 'it', label: 'IT & Infrastructure', count: 10 },
    { id: 'rd', label: 'Research & Development', count: 6 },
    { id: 'strat', label: 'Corporate Strategy', count: 5 },
    { id: 'ta', label: 'Talent Acquisition', count: 9 },
    { id: 'content', label: 'Content & Communications', count: 6 },
    { id: 'arch', label: 'Solutions Architecture', count: 8 },
    { id: 'devops-dep', label: 'DevOps & Cloud Engineering', count: 15 },
    { id: 'legal', label: 'Legal & Compliance', count: 7 },
    { id: 'support', label: 'Technical Customer Support', count: 11 },
    { id: 'partner', label: 'Strategic Partnerships', count: 6 }
  ],

  position: [
    { id: 'swe', label: 'Software Engineer', count: 34 },
    { id: 'fe', label: 'Senior Frontend Developer', count: 19 },
    { id: 'be', label: 'Backend Engineer', count: 26 },
    { id: 'fs', label: 'Full Stack Developer', count: 22 },
    { id: 'pm', label: 'Product Manager', count: 18 },
    { id: 'ux', label: 'UI/UX Designer', count: 15 },
    { id: 'de', label: 'Data Engineer', count: 14 },
    { id: 'devops', label: 'DevOps & SRE Engineer', count: 16 },
    { id: 'aiml', label: 'AI/ML Research Scientist', count: 12 },
    { id: 'em', label: 'Engineering Manager', count: 9 },
    // +14 More items (> 10)
    { id: 'qae', label: 'QA Automation Engineer', count: 11 },
    { id: 'techlead', label: 'Technical Lead', count: 10 },
    { id: 'solarch', label: 'Solutions Architect', count: 8 },
    { id: 'pmm', label: 'Product Marketing Manager', count: 9 },
    { id: 'cloudsec', label: 'Cloud Security Architect', count: 7 },
    { id: 'scrum', label: 'Scrum Master / Agile Coach', count: 8 },
    { id: 'mobile', label: 'Mobile Developer (iOS/Android)', count: 13 },
    { id: 'ba', label: 'Business Analyst', count: 10 },
    { id: 'tpm', label: 'Technical Program Manager', count: 8 },
    { id: 'datanalyst', label: 'Senior Data Analyst', count: 11 },
    { id: 'growthlead', label: 'Growth Marketing Lead', count: 7 },
    { id: 'seceng', label: 'Security Operations Engineer', count: 9 },
    { id: 'infraeng', label: 'Site Reliability Architect', count: 6 },
    { id: 'staffswe', label: 'Staff Systems Engineer', count: 8 }
  ],

  location: [
    { id: 'blr', label: 'Bangalore, India', count: 48 },
    { id: 'sf', label: 'San Francisco, CA', count: 36 },
    { id: 'nyc', label: 'New York, NY', count: 29 },
    { id: 'lon', label: 'London, UK', count: 24 },
    { id: 'rem-glb', label: 'Remote - Global', count: 42 },
    { id: 'rem-us', label: 'Remote - US', count: 31 },
    { id: 'ber', label: 'Berlin, Germany', count: 18 },
    { id: 'sin', label: 'Singapore', count: 15 },
    { id: 'tor', label: 'Toronto, Canada', count: 17 },
    { id: 'hyd', label: 'Hyderabad, India', count: 22 },
    // +14 More items (> 10)
    { id: 'sea', label: 'Seattle, WA', count: 16 },
    { id: 'atx', label: 'Austin, TX', count: 14 },
    { id: 'mum', label: 'Mumbai, India', count: 19 },
    { id: 'dub', label: 'Dublin, Ireland', count: 11 },
    { id: 'ams', label: 'Amsterdam, Netherlands', count: 13 },
    { id: 'pune', label: 'Pune, India', count: 15 },
    { id: 'syd', label: 'Sydney, Australia', count: 10 },
    { id: 'par', label: 'Paris, France', count: 12 },
    { id: 'tokyo', label: 'Tokyo, Japan', count: 9 },
    { id: 'dubai', label: 'Dubai, UAE', count: 14 },
    { id: 'boston', label: 'Boston, MA', count: 11 },
    { id: 'chicago', label: 'Chicago, IL', count: 10 },
    { id: 'delhi', label: 'Delhi NCR, India', count: 17 },
    { id: 'zurich', label: 'Zurich, Switzerland', count: 8 }
  ],

  experience: [
    { id: 'exp-entry', label: 'Entry Level (0-1 yrs)', count: 14 },
    { id: 'exp-jr', label: 'Junior (1-3 yrs)', count: 26 },
    { id: 'exp-mid', label: 'Mid-Level (3-5 yrs)', count: 45 },
    { id: 'exp-sr', label: 'Senior (5-8 yrs)', count: 58 },
    { id: 'exp-lead', label: 'Lead / Staff (8-10 yrs)', count: 32 },
    { id: 'exp-prin', label: 'Principal (10-12 yrs)', count: 18 },
    { id: 'exp-dir', label: 'Director (12-15 yrs)', count: 12 },
    { id: 'exp-vp', label: 'Executive / VP (15+ yrs)', count: 7 },
    { id: 'exp-intern', label: 'Internship', count: 8 },
    { id: 'exp-grad', label: 'Fresh Graduate', count: 11 },
    // +8 More items (> 10)
    { id: 'exp-assoc', label: 'Associate (2-4 yrs)', count: 16 },
    { id: 'exp-spec', label: 'Specialist (4-6 yrs)', count: 19 },
    { id: 'exp-srspec', label: 'Senior Specialist (6-8 yrs)', count: 14 },
    { id: 'exp-srstaff', label: 'Senior Staff (10-14 yrs)', count: 9 },
    { id: 'exp-head', label: 'Head of Department (12+ yrs)', count: 8 },
    { id: 'exp-fellow', label: 'Fellow / Distinguished (15+ yrs)', count: 4 },
    { id: 'exp-cxo', label: 'C-Level Executive', count: 5 },
    { id: 'exp-any', label: 'Any Experience Level', count: 35 }
  ],

  company: [
    { id: 'cmp-google', label: 'Google / Alphabet', count: 18 },
    { id: 'cmp-msft', label: 'Microsoft', count: 15 },
    { id: 'cmp-amzn', label: 'Amazon AWS', count: 22 },
    { id: 'cmp-meta', label: 'Meta', count: 12 },
    { id: 'cmp-aapl', label: 'Apple', count: 10 },
    { id: 'cmp-stripe', label: 'Stripe', count: 9 },
    { id: 'cmp-snow', label: 'Snowflake', count: 8 },
    { id: 'cmp-uber', label: 'Uber Technologies', count: 11 },
    { id: 'cmp-abnb', label: 'Airbnb', count: 7 },
    { id: 'cmp-crm', label: 'Salesforce', count: 14 },
    // +12 More items (> 10)
    { id: 'cmp-dbrx', label: 'Databricks', count: 8 },
    { id: 'cmp-nflx', label: 'Netflix', count: 6 },
    { id: 'cmp-adbe', label: 'Adobe', count: 9 },
    { id: 'cmp-atls', label: 'Atlassian', count: 10 },
    { id: 'cmp-spot', label: 'Spotify', count: 7 },
    { id: 'cmp-figma', label: 'Figma', count: 5 },
    { id: 'cmp-openai', label: 'OpenAI', count: 12 },
    { id: 'cmp-anthropic', label: 'Anthropic', count: 10 },
    { id: 'cmp-nvda', label: 'NVIDIA', count: 16 },
    { id: 'cmp-cisco', label: 'Cisco Systems', count: 8 },
    { id: 'cmp-orcl', label: 'Oracle Cloud', count: 9 },
    { id: 'cmp-intel', label: 'Intel Corp', count: 7 }
  ],

  employmentType: [
    { id: 'emp-ft', label: 'Full-time Permanent', count: 124 },
    { id: 'emp-pt', label: 'Part-time', count: 18 },
    { id: 'emp-contract', label: 'Contract (Fixed Term)', count: 36 },
    { id: 'emp-c2h', label: 'Contract to Hire', count: 14 },
    { id: 'emp-freelance', label: 'Freelance / Consultant', count: 12 },
    { id: 'emp-intern', label: 'Paid Internship', count: 16 },
    { id: 'emp-temp', label: 'Temporary Placement', count: 8 },
    { id: 'emp-seasonal', label: 'Seasonal', count: 4 },
    { id: 'emp-volunteer', label: 'Volunteer', count: 3 },
    { id: 'emp-appr', label: 'Apprenticeship', count: 6 },
    // +6 More items (> 10)
    { id: 'emp-retainer', label: 'Retainer Basis', count: 11 },
    { id: 'emp-coop', label: 'University Co-op', count: 5 },
    { id: 'emp-pt20', label: 'Part-time (20h / week)', count: 8 },
    { id: 'emp-pt30', label: 'Part-time (30h / week)', count: 7 },
    { id: 'emp-proj', label: 'Project-Based Contractor', count: 13 },
    { id: 'emp-visiting', label: 'Visiting Expert / Advisor', count: 4 }
  ],

  workMode: [
    { id: 'wm-remote', label: 'Remote', count: 85 },
    { id: 'wm-hybrid', label: 'Hybrid', count: 68 },
    { id: 'wm-onsite', label: 'On-site Office', count: 42 },
    { id: 'wm-anywhere', label: 'Work from Anywhere (Global)', count: 24 },
    { id: 'wm-country', label: 'Remote (Same Country)', count: 31 },
    { id: 'wm-flex', label: 'Flexible Hours', count: 29 },
    { id: 'wm-hyb2', label: 'Hybrid (2 days in office)', count: 21 },
    { id: 'wm-hyb3', label: 'Hybrid (3 days in office)', count: 28 },
    { id: 'wm-client', label: 'Client Site Required', count: 12 },
    { id: 'wm-rotational', label: 'Rotational Shifts', count: 8 },
    // +6 More items (> 10)
    { id: 'wm-field', label: 'Field / Travel Required', count: 6 },
    { id: 'wm-hub', label: 'Regional Hub Only', count: 14 },
    { id: 'wm-hyb1', label: 'Hybrid (1 day in office)', count: 15 },
    { id: 'wm-hyb4', label: 'Hybrid (4 days in office)', count: 10 },
    { id: 'wm-emea', label: 'Remote (EMEA Timezone)', count: 18 },
    { id: 'wm-us-tz', label: 'Remote (US Timezone)', count: 25 }
  ],

  aiHealth: [
    { id: 'aih-fast', label: 'High Pipeline Velocity', count: 45 },
    { id: 'aih-sla', label: 'On Track for SLA Target', count: 62 },
    { id: 'aih-risk', label: 'At Risk - Low Sourcing', count: 18 },
    { id: 'aih-screen', label: 'Needs Screening Action', count: 24 },
    { id: 'aih-qual', label: 'High Candidate Quality Match', count: 38 },
    { id: 'aih-triage', label: 'Fast Triage (< 24h turnaround)', count: 29 },
    { id: 'aih-bottle', label: 'Interview Bottleneck Flag', count: 14 },
    { id: 'aih-drop', label: 'High Drop-off Rate Warning', count: 9 },
    { id: 'aih-over', label: 'Over-applied (> 300 candidates)', count: 16 },
    { id: 'aih-div', label: 'Strong Diversity Metric', count: 31 },
    // +6 More items (> 10)
    { id: 'aih-aging', label: 'Aging Requisition (> 45 days)', count: 12 },
    { id: 'aih-top', label: 'Top Performer Requisition', count: 22 },
    { id: 'aih-fasttrack', label: 'Fast-Track Hiring Active', count: 19 },
    { id: 'aih-lowdrop', label: 'Low Offer Rejection Risk', count: 27 },
    { id: 'aih-nps', label: 'Candidate Experience NPS > 90', count: 15 },
    { id: 'aih-reengage', label: 'Active Talent Pool Re-engagement', count: 17 }
  ],

  posted: [
    { id: 'post-24h', label: 'Past 24 Hours', count: 12 },
    { id: 'post-3d', label: 'Past 3 Days', count: 28 },
    { id: 'post-week', label: 'Past Week (7 Days)', count: 45 },
    { id: 'post-2w', label: 'Past 2 Weeks', count: 72 },
    { id: 'post-month', label: 'Past Month (30 Days)', count: 118 },
    { id: 'post-qtr', label: 'Past Quarter (90 Days)', count: 165 },
    { id: 'post-6m', label: 'Last 6 Months', count: 198 },
    { id: 'post-year', label: 'This Year (2026)', count: 220 },
    { id: 'post-reprom', label: 'Actively Re-promoted', count: 16 },
    { id: 'post-custom', label: 'Custom Date Range', count: 34 },
    // +6 More items (> 10)
    { id: 'post-today', label: 'Posted Today', count: 5 },
    { id: 'post-yesterday', label: 'Posted Yesterday', count: 7 },
    { id: 'post-48h', label: 'Past 48 Hours', count: 18 },
    { id: 'post-14d', label: 'Past 14 Days', count: 54 },
    { id: 'post-60d', label: 'Past 60 Days', count: 142 },
    { id: 'post-all', label: 'All Historical Postings', count: 245 }
  ]
};

// ============================================================================
// SINGLE CATEGORY ACCORDION WITH INLINE SEARCH AND "+ X MORE"
// ============================================================================
function FilterCategoryItem({
  title,
  icon: Icon,
  items,
  selectedIds = [],
  onToggle,
  defaultExpanded = true
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Filter items matching the category-specific search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // Default display: 10 items unless expanded
  const visibleItems = showAll || searchQuery.trim() ? filteredItems : filteredItems.slice(0, 10);
  const remainingCount = items.length - 10;
  const selectedCount = selectedIds.length;

  return (
    <div className="border-b border-gray-100 dark:border-gray-800/80 py-3 last:border-b-0">
      {/* Category Header */}
      <div className="flex items-center justify-between gap-1 group">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer select-none"
        >
          {Icon && <Icon size={14} className="text-gray-400 group-hover:text-[#1890FF] transition-colors shrink-0" />}
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase tracking-wider">
            {title}
          </span>
          {selectedCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#1890FF] text-white shrink-0">
              {selectedCount}
            </span>
          )}
        </button>

        {/* Search icon next to the title */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSearching(!isSearching);
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              isSearching || searchQuery
                ? 'bg-[#1890FF]/10 text-[#1890FF]' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={`Search in ${title}`}
          >
            <Search size={13} />
          </button>

          {/* Accordion Chevron */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Inline Search Input next to/below title */}
      {isExpanded && isSearching && (
        <div className="mt-2 relative animate-fade-in">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-7 py-1 text-[11px] bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-1 focus:ring-[#1890FF] focus:border-[#1890FF] outline-none text-[#212b36] dark:text-white"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* Category Items List */}
      {isExpanded && (
        <div className="mt-2 space-y-1">
          {visibleItems.length > 0 ? (
            visibleItems.map(item => {
              const isChecked = selectedIds.includes(item.id);

              return (
                <label
                  key={item.id}
                  className="flex items-center justify-between px-1.5 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group/item text-xs select-none"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(item.id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-[#1890FF] focus:ring-[#1890FF] w-3.5 h-3.5 cursor-pointer accent-[#1890FF]"
                    />
                    <span className={`text-[12px] truncate ${
                      isChecked ? 'font-bold text-[#1890FF]' : 'text-gray-700 dark:text-gray-300 group-hover/item:text-[#212b36] dark:group-hover/item:text-white'
                    }`} title={item.label}>
                      {item.label}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 shrink-0 tabular-nums">
                    {item.count}
                  </span>
                </label>
              );
            })
          ) : (
            <div className="py-2 text-center text-[11px] text-gray-400">
              No matching items
            </div>
          )}

          {/* Show More / Show Less Button */}
          {!searchQuery && remainingCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-1.5 py-1 text-[11px] font-bold text-[#1890FF] hover:text-[#096dd9] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              {showAll ? (
                <>
                  <ChevronUp size={12} /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={12} /> + {remainingCount} More
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN JOB FILTER PANEL COMPONENT
// ============================================================================
export default function JobFilterPanel({
  selectedFilters = {},
  onFilterChange,
  onResetAll,
  totalResultsCount,
  currency = '$',
  panelHeight,
  filterData = FILTER_DATA
}) {
  const activeFilterData = filterData || FILTER_DATA;

  // Generic multi-select toggle
  const handleToggleOption = (categoryKey, id) => {
    const currentList = selectedFilters[categoryKey] || [];
    const updated = currentList.includes(id)
      ? currentList.filter(item => item !== id)
      : [...currentList, id];

    if (onFilterChange) {
      onFilterChange(categoryKey, updated);
    }
  };

  // Total active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    Object.entries(selectedFilters).forEach(([k, v]) => {
      if (Array.isArray(v)) count += v.length;
    });
    return count;
  }, [selectedFilters]);

  return (
    <aside 
      className="w-full lg:w-[280px] xl:w-[295px] shrink-0"
      style={panelHeight ? { height: `${panelHeight}px`, minHeight: `${panelHeight}px` } : undefined}
    >
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs p-4 h-full filter-panel-hover-scroll flex flex-col">
        {/* Scoped CSS: Scrollbar hidden by default, visible on hover, zero layout shift */}
        <style>{`
          .filter-panel-hover-scroll {
            overflow-y: auto;
            scrollbar-gutter: stable;
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
          }
          .filter-panel-hover-scroll::-webkit-scrollbar {
            width: 5px;
          }
          .filter-panel-hover-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .filter-panel-hover-scroll::-webkit-scrollbar-thumb {
            background-color: transparent;
            border-radius: 9999px;
            transition: background-color 0.2s ease;
          }
          .filter-panel-hover-scroll:hover {
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          }
          .filter-panel-hover-scroll:hover::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
          }
          .filter-panel-hover-scroll:hover::-webkit-scrollbar-thumb:hover {
            background-color: rgba(107, 114, 128, 0.8);
          }
        `}</style>
        
        {/* PANEL HEADER */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
              <Filter size={15} />
            </div>
            <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Filters</h3>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#1890FF] text-white">
                {activeCount}
              </span>
            )}
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onResetAll}
              className="text-xs font-semibold text-[#1890FF] hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={11} /> Reset All
            </button>
          )}
        </div>

        {/* =================================================================== */}
        {/* 2. DEPARTMENT                                                       */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="Department"
          icon={Briefcase}
          items={activeFilterData.department || FILTER_DATA.department}
          selectedIds={selectedFilters.department || []}
          onToggle={(id) => handleToggleOption('department', id)}
          defaultExpanded={true}
        />

        {/* =================================================================== */}
        {/* 3. POSITION                                                         */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="Position"
          icon={Award}
          items={activeFilterData.position || FILTER_DATA.position}
          selectedIds={selectedFilters.position || []}
          onToggle={(id) => handleToggleOption('position', id)}
          defaultExpanded={true}
        />

        {/* =================================================================== */}
        {/* 4. LOCATION                                                         */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="Location"
          icon={MapPin}
          items={activeFilterData.location || FILTER_DATA.location}
          selectedIds={selectedFilters.location || []}
          onToggle={(id) => handleToggleOption('location', id)}
          defaultExpanded={true}
        />

        {/* =================================================================== */}
        {/* 5. EXPERIENCE                                                       */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="Experience"
          icon={Clock}
          items={activeFilterData.experience || FILTER_DATA.experience}
          selectedIds={selectedFilters.experience || []}
          onToggle={(id) => handleToggleOption('experience', id)}
          defaultExpanded={false}
        />

        {/* =================================================================== */}
        {/* 6. COMPANY                                                          */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="Company"
          icon={Building2}
          items={activeFilterData.company || FILTER_DATA.company}
          selectedIds={selectedFilters.company || []}
          onToggle={(id) => handleToggleOption('company', id)}
          defaultExpanded={false}
        />

        {/* =================================================================== */}
        {/* 7. EMPLOYMENT TYPE                                                  */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="Employment Type"
          icon={Briefcase}
          items={activeFilterData.employmentType || FILTER_DATA.employmentType}
          selectedIds={selectedFilters.employmentType || []}
          onToggle={(id) => handleToggleOption('employmentType', id)}
          defaultExpanded={false}
        />

        {/* =================================================================== */}
        {/* 8. WORK MODE                                                        */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="Work Mode"
          icon={Laptop}
          items={activeFilterData.workMode || FILTER_DATA.workMode}
          selectedIds={selectedFilters.workMode || []}
          onToggle={(id) => handleToggleOption('workMode', id)}
          defaultExpanded={false}
        />

        {/* =================================================================== */}
        {/* 9. AI JOB HEALTH                                                    */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="AI Job Health"
          icon={Sparkles}
          items={activeFilterData.aiHealth || FILTER_DATA.aiHealth}
          selectedIds={selectedFilters.aiHealth || []}
          onToggle={(id) => handleToggleOption('aiHealth', id)}
          defaultExpanded={false}
        />

        {/* =================================================================== */}
        {/* 10. POSTED                                                          */}
        {/* =================================================================== */}
        <FilterCategoryItem
          title="Posted"
          icon={Calendar}
          items={activeFilterData.posted || FILTER_DATA.posted}
          selectedIds={selectedFilters.posted || []}
          onToggle={(id) => handleToggleOption('posted', id)}
          defaultExpanded={false}
        />

      </div>
    </aside>
  );
}
