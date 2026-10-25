import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FolderTree, 
  Users, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  Search, ChevronRight, 
  SlidersHorizontal, 
  Database, 
  Bot,
  ArrowUpRight,
  X,
  RotateCcw
} from 'lucide-react';

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ----------------------------------------------------
  // SETTINGS CARDS CONFIGURATION
  // ----------------------------------------------------
  const settingsCards = [
    {
      id: 'company-preferences',
      title: 'Company Preferences',
      category: 'Organization',
      icon: Building2,
      description: 'Manage legal organization profile, corporate logo, addresses, currency, and brand display themes.',
      links: [
        'Company Profile',
        'Company Logo',
        'Address',
        'Currency',
        'Time zone',
        'Default Display Theme'
      ],
      colorTheme: 'from-blue-500/10 to-indigo-500/10',
      iconBg: 'bg-blue-50 text-[#1890FF] dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      id: 'departments',
      title: 'Departments',
      category: 'Organization',
      icon: FolderTree,
      description: 'Define corporate divisions, departmental cost centers, and team lead reporting hierarchy.',
      links: [
        'Departments'
      ],
      colorTheme: 'from-purple-500/10 to-pink-500/10',
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      id: 'users-permissions',
      title: 'Users and Permissions',
      category: 'Security & Access',
      icon: Users,
      description: 'Manage team member accounts, assign Role-Based Access Controls (RBAC), and allocate seat licenses.',
      links: [
        'Users',
        'Roles & Permissions'
      ],
      colorTheme: 'from-emerald-500/10 to-teal-500/10',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
    },
    {
      id: 'security-access',
      title: 'Security & Access',
      category: 'Security & Access',
      icon: ShieldCheck,
      description: 'Configure Single Sign-On (SSO) authentication and developer API key integrations.',
      links: [
        'SSO',
        'API Keys'
      ],
      colorTheme: 'from-indigo-500/10 to-blue-500/10',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
    },
    {
      id: 'communication',
      title: 'Communication',
      category: 'Hiring & Workflows',
      icon: Mail,
      description: 'Configure automated emails, Slack/Teams bots, WhatsApp, SMS dispatches, and hiring team chat.',
      links: [
        'Email',
        'Slack',
        'Teams',
        'WhatsApp',
        'SMS',
        'Hiring Team Chat',
        'Communications'
      ],
      colorTheme: 'from-rose-500/10 to-orange-500/10',
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
    },
    {
      id: 'calendar',
      title: 'Calendar',
      category: 'Hiring & Workflows',
      icon: Calendar,
      description: 'Synchronize interviewer calendar availability, meeting buffers, and automated video conferencing.',
      links: [
        'Calendar'
      ],
      colorTheme: 'from-sky-500/10 to-cyan-500/10',
      iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
    },
    {
      id: 'sourcing',
      title: 'Sourcing',
      category: 'Sourcing & AI',
      icon: Search,
      description: 'Manage the public career site, application form templates, candidate channels, and agency fields.',
      links: [
        'Career site',
        'Form Templates',
        'Candidate Sourcing',
        'Agency Fields'
      ],
      colorTheme: 'from-amber-500/10 to-yellow-500/10',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    },
    {
      id: 'screening',
      title: 'Screening',
      category: 'Hiring & Workflows',
      icon: SlidersHorizontal,
      description: 'Standardize AI resume matching criteria and structured interview scorecard catalogs.',
      links: [
        'AI Resume Matching Rules',
        'Scorecard Catalog'
      ],
      colorTheme: 'from-teal-500/10 to-emerald-500/10',
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
    },
    {
      id: 'candidate-data',
      title: 'Candidate Data',
      category: 'Security & Access',
      icon: Database,
      description: 'Manage candidate deduplication logic, resume retention, and applicant record integrity.',
      links: [
        'Duplicate rules'
      ],
      colorTheme: 'from-slate-500/10 to-zinc-500/10',
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    },
    {
      id: 'ai-settings',
      title: 'AI Settings',
      category: 'Sourcing & AI',
      icon: Bot,
      description: 'Tune autonomous AI agents, track token usage metrics, and manage organizational AI budgets.',
      links: [
        'AI Agents',
        'AI Budget',
        'AI Usage'
      ],
      colorTheme: 'from-violet-500/10 to-indigo-500/10',
      iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400'
    }
  ];

  const categories = useMemo(() => {
    return Array.from(new Set(settingsCards.map(c => c.category)));
  }, [settingsCards]);

  // Filtered Cards and Links based on Search Query and Category
  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return settingsCards
      .filter(card => {
        // Category Filter
        if (selectedCategory !== 'All' && card.category !== selectedCategory) {
          return false;
        }

        // Search Query Filter
        if (!q) return true;

        const titleMatches = card.title.toLowerCase().includes(q);
        const descMatches = card.description.toLowerCase().includes(q);
        const linkMatches = card.links.some(l => l.toLowerCase().includes(q));

        return titleMatches || descMatches || linkMatches;
      })
      .map(card => {
        if (!q) {
          return { ...card, displayLinks: card.links };
        }

        const matchingLinks = card.links.filter(l => l.toLowerCase().includes(q));
        return {
          ...card,
          // If individual links matched, display matching ones, otherwise show all if card title/description matched
          displayLinks: matchingLinks.length > 0 ? matchingLinks : card.links,
          hasDirectLinkMatch: matchingLinks.length > 0
        };
      });
  }, [settingsCards, searchQuery, selectedCategory]);

  const totalSettingsCount = useMemo(() => {
    return filteredCards.reduce((acc, card) => acc + card.displayLinks.length, 0);
  }, [filteredCards]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="p-6 space-y-5 relative w-full text-[#1E293B] dark:text-[#E2E8F0] font-sans">
      {/* TOP BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1">
        <Link to="/dashboard" className="hover:text-[#1890FF] transition-colors cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={14} className="text-gray-400 shrink-0" />
        <span className="text-[#212b36] dark:text-white">Settings</span>
      </nav>

      {/* SETTINGS HEADER CARD */}
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/70 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#212b36] dark:text-white tracking-tight leading-none">
                Settings
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1890FF]/10 text-[#1890FF]">
                {totalSettingsCount} Controls
              </span>
            </div>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              Manage company preferences, hiring workflows, security permissions, integrations, and AI controls.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors shadow-2xs cursor-pointer h-[38px]"
            >
              <RotateCcw size={14} className="text-gray-500" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EMPTY RESULTS STATE                                       */}
      {/* ======================================================== */}
      {filteredCards.length === 0 && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-12 text-center border border-gray-200/80 dark:border-gray-800 my-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <Search size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No settings found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            We couldn't find any setting links matching &ldquo;{searchQuery}&rdquo;. Try another search term or clear the category filter.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="cursor-pointer mt-4 px-4 py-2 text-xs font-bold text-[#1890FF] bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            Reset Search & Filters
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* SETTINGS CARDS GRID                                       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          const displayLinks = card.displayLinks;
          const isMultiCol = displayLinks.length >= 2;

          return (
            <div
              key={card.id}
              className="group relative bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 border border-gray-200/80 dark:border-gray-800 shadow-xs hover:shadow-lg hover:border-[#1890FF]/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Card Header: Icon + Title (SUBTITLE REMOVED) + Setting Count */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                      <Icon size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white normal-case leading-tight tracking-tight truncate">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-gray-700/60">
                    {displayLinks.length} {displayLinks.length === 1 ? 'setting' : 'settings'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {card.description}
                </p>

                {/* Card Links - Empty Links ready for future redirect/pages */}
                <div className="pt-3.5 border-t border-gray-100 dark:border-gray-800/80">
                  <div className={`grid ${isMultiCol ? 'grid-cols-1 sm:grid-cols-2 gap-2.5' : 'grid-cols-1 gap-2.5'}`}>
                    {displayLinks.map((link, idx) => {
                      const isMatch = searchQuery.trim() && link.toLowerCase().includes(searchQuery.trim().toLowerCase());

                      return (
                        <Link
                          key={idx}
                          to="#"
                          onClick={(e) => e.preventDefault()}
                          className={`cursor-pointer group/link w-full text-left px-3.5 py-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-2 ${
                            isMatch
                              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#1890FF] text-[#1890FF] shadow-xs'
                              : 'bg-gray-50/70 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-[#161c24] border-gray-200/70 dark:border-gray-750 hover:border-[#1890FF] hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full transition-transform shrink-0 ${
                              isMatch ? 'bg-[#1890FF] scale-125' : 'bg-[#1890FF] group-hover/link:scale-150'
                            }`} />
                            <span className={`text-xs font-semibold leading-tight truncate ${
                              isMatch 
                                ? 'text-[#1890FF] dark:text-[#1890FF]' 
                                : 'text-gray-700 dark:text-gray-300 group-hover/link:text-[#1890FF] transition-colors'
                            }`}>
                              {link}
                            </span>
                          </div>
                          <ArrowUpRight size={13} className="text-gray-400 dark:text-gray-500 group-hover/link:text-[#1890FF] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all shrink-0 ml-1" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
