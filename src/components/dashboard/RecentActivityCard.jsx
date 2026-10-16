import React, { useState, useMemo } from 'react';
import {
  Activity,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Star,
  UserX,
  Calendar,
  FileSignature,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  CheckSquare,
  Clock,
  Award,
  FileCheck,
  Mail
} from 'lucide-react';

const ICON_MAP = {
  UserPlus,
  Star,
  Activity,
  UserX,
  Calendar,
  FileSignature,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  CheckSquare,
  Clock,
  Award,
  FileCheck,
  Mail
};

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    action: 'Sneha Patil applied for the role via LinkedIn',
    time: '2 hours ago',
    iconName: 'UserPlus',
    color: 'text-[#1890FF] bg-[#1890FF]/10'
  },
  {
    id: 2,
    action: 'Priya left a 4-star scorecard for Rahul Verma',
    time: '4 hours ago',
    iconName: 'Star',
    color: 'text-[#FFC107] bg-[#FFC107]/10'
  },
  {
    id: 3,
    action: 'Amit moved Ananya Sharma to Tech Interview',
    time: 'Yesterday, 3:30 PM',
    iconName: 'Activity',
    color: 'text-[#00A76F] bg-[#00A76F]/10'
  },
  {
    id: 4,
    action: 'Automated screening rejected 12 candidates',
    time: 'Yesterday, 9:00 AM',
    iconName: 'UserX',
    color: 'text-[#FF5630] bg-[#FF5630]/10'
  },
  {
    id: 5,
    action: 'System Design Interview scheduled with Vikram Malhotra for Ravi Desai',
    time: 'Yesterday, 5:15 PM',
    iconName: 'Calendar',
    color: 'text-[#8E33FF] bg-[#8E33FF]/10'
  },
  {
    id: 6,
    action: 'Offer letter signed & compensation approved for Pooja Desai',
    time: '2 days ago, 11:20 AM',
    iconName: 'FileSignature',
    color: 'text-[#00A76F] bg-[#00A76F]/10'
  },
  {
    id: 7,
    action: 'Agency TechTalent Partners submitted 3 new candidate profiles',
    time: '2 days ago, 3:45 PM',
    iconName: 'Briefcase',
    color: 'text-[#1890FF] bg-[#1890FF]/10'
  },
  {
    id: 8,
    action: 'Reference check completed: 2 peer evaluations verified for Arjun Kumar',
    time: '3 days ago, 10:00 AM',
    iconName: 'CheckCircle2',
    color: 'text-[#00A76F] bg-[#00A76F]/10'
  },
  {
    id: 9,
    action: 'Candidate debrief notes published by Lead Architect for Nitin Gupta',
    time: '3 days ago, 4:10 PM',
    iconName: 'ClipboardList',
    color: 'text-[#FFAB00] bg-[#FFAB00]/10'
  },
  {
    id: 10,
    action: 'Phone screen completed: 8.5/10 score submitted by Devina Roy',
    time: '4 days ago, 2:30 PM',
    iconName: 'CheckSquare',
    color: 'text-[#00B8D9] bg-[#00B8D9]/10'
  },
  {
    id: 11,
    action: 'Hiring committee marked Tanmay Joshi application as Put on Hold',
    time: '5 days ago, 1:15 PM',
    iconName: 'Clock',
    color: 'text-[#FFAB00] bg-[#FFAB00]/10'
  },
  {
    id: 12,
    action: 'Kavita Das completed technical assessment with 94% score',
    time: '6 days ago, 11:00 AM',
    iconName: 'Award',
    color: 'text-[#8E33FF] bg-[#8E33FF]/10'
  },
  {
    id: 13,
    action: 'Background check initiated via Sterling for Harper Cole',
    time: '6 days ago, 3:20 PM',
    iconName: 'FileCheck',
    color: 'text-[#00A76F] bg-[#00A76F]/10'
  },
  {
    id: 14,
    action: 'Candidate reminder email sent to Alex Rivera for upcoming interview',
    time: '1 week ago',
    iconName: 'Mail',
    color: 'text-[#1890FF] bg-[#1890FF]/10'
  },
  {
    id: 15,
    action: 'Recruiter screen scheduled with Mina Shah for Quinn Davis',
    time: '1 week ago',
    iconName: 'Calendar',
    color: 'text-[#8E33FF] bg-[#8E33FF]/10'
  }
];

export default function RecentActivityCard({
  activities = DEFAULT_ACTIVITIES,
  itemsPerPage = 5
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter activities by search query
  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activities;
    return activities.filter((item) =>
      item.action.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q)
    );
  }, [activities, searchQuery]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));

  // Current page items
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(start, start + itemsPerPage);
  }, [filteredActivities, currentPage, itemsPerPage]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new query
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const startIndex = filteredActivities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredActivities.length);

  return (
    <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Header with Title and Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800/80 mb-5">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-none">
              Recent Activity
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-1">
              Latest recruitment updates & audit log
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            id="recent-activity-search-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search activities..."
            className="w-full h-9 pl-9 pr-8 text-xs rounded-xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 text-[#212b36] dark:text-gray-200 placeholder-gray-400 focus:outline-hidden focus:border-[#1890FF] focus:bg-white dark:focus:bg-[#161c24] transition-all"
          />
          {searchQuery && (
            <button
              id="recent-activity-clear-search"
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-full transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Activity Timeline List */}
      {paginatedActivities.length > 0 ? (
        <div className="space-y-4 relative min-h-[260px]">
          {/* Vertical connecting line */}
          <div className="absolute top-2 bottom-2 left-[15px] w-px bg-gray-100 dark:bg-gray-800/60 z-0" />

          {paginatedActivities.map((activity) => {
            const IconComponent =
              typeof activity.icon === 'function'
                ? activity.icon
                : ICON_MAP[activity.iconName] || Activity;

            return (
              <div
                key={activity.id}
                className="relative z-10 flex items-start gap-3.5 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 p-1.5 -mx-1.5 rounded-xl transition-colors"
              >
                {/* Icon in colored circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#161c24] shadow-2xs ${activity.color}`}
                >
                  <IconComponent size={14} />
                </div>

                {/* Content */}
                <div className="pt-0.5 min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[#212b36] dark:text-gray-200 leading-snug">
                    {activity.action}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 font-normal mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 text-center flex flex-col items-center justify-center min-h-[240px]">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-3">
            <Search size={22} />
          </div>
          <p className="text-sm font-bold text-[#212b36] dark:text-white">
            No matching activities
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
            No activities matched &ldquo;{searchQuery}&rdquo;. Try another term.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="mt-3 text-xs font-semibold text-[#1890FF] hover:underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredActivities.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/80 mt-4 text-xs text-gray-500 dark:text-gray-400">
          {/* Item count summary */}
          <div>
            Showing{' '}
            <span className="font-bold text-[#212b36] dark:text-white">
              {startIndex}-{endIndex}
            </span>{' '}
            of{' '}
            <span className="font-bold text-[#212b36] dark:text-white">
              {filteredActivities.length}
            </span>{' '}
            activities
            {searchQuery && (
              <span className="text-gray-400 dark:text-gray-500 ml-1">
                (filtered from {activities.length})
              </span>
            )}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 self-end sm:self-auto">
              {/* Prev Button */}
              <button
                id="recent-activity-prev-page"
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700/80 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#1890FF] hover:border-[#1890FF] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    id={`recent-activity-page-${pageNum}`}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1890FF] text-white shadow-2xs font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                id="recent-activity-next-page"
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700/80 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#1890FF] hover:border-[#1890FF] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
