import React, { useState } from 'react';
import { Share2, ArrowUpRight, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-react';

const SOURCE_CHANNELS = [
  {
    id: 'agencies',
    name: 'Agencies',
    codeType: 'text',
    code: 'A',
    badgeClass: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    totalVolume: 51,
    totalQualified: 16,
    totalRate: 31,
    recentVolume: 17,
    recentQualified: 6,
    recentRate: 35
  },
  {
    id: 'direct',
    name: 'Direct',
    codeType: 'text',
    code: 'D',
    badgeClass: 'bg-blue-50 dark:bg-blue-900/30 text-[#1890FF]',
    totalVolume: 69,
    totalQualified: 26,
    totalRate: 38,
    recentVolume: 23,
    recentQualified: 9,
    recentRate: 39
  },
  {
    id: 'referral',
    name: 'Internal Referral',
    codeType: 'arrow',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    totalVolume: 18,
    totalQualified: 9,
    totalRate: 50,
    recentVolume: 6,
    recentQualified: 3,
    recentRate: 50
  },
  {
    id: 'other',
    name: 'Other / Unattributed',
    codeType: 'dots',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    totalVolume: 6,
    totalQualified: 1,
    totalRate: 17,
    recentVolume: 1,
    recentQualified: 0,
    recentRate: 0
  }
];

export default function SourceStatsCard({ onChannelClick }) {
  const [selectedRange, setSelectedRange] = useState('Last 3 mo · Oct 10');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const ranges = ['Last 30 days', 'Last 3 mo · Oct 10', 'Year to Date', 'All Time'];

  return (
    <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all duration-200">
      

      {/* 2. Card Header: Icon + Title + Filter */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shrink-0 shadow-2xs">
              <Share2 size={17} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-none uppercase tracking-wide">
              SOURCE STATS
            </h3>
          </div>

          {/* Time Filter Pill */}
          <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-2.5 py-1 rounded-lg border border-gray-200/80 dark:border-gray-700/80 bg-gray-50/60 dark:bg-gray-800/40 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:border-[#1890FF] hover:text-[#1890FF] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>{selectedRange}</span>
            <ChevronDown size={11} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-30 w-40 bg-white dark:bg-[#161c24] rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl py-1 text-xs animate-fade-in">
              {ranges.map(range => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setSelectedRange(range);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    selectedRange === range
                      ? 'bg-[#1890FF]/10 text-[#1890FF] font-bold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{range}</span>
                  {selectedRange === range && <span className="w-1.5 h-1.5 rounded-full bg-[#1890FF]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subtitle below the title */}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium pl-12 mt-1">
        Candidate volume and qualification rates by source.
      </p>
    </div>

      {/* 3. Summary Metrics Bar: 3 Columns */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-1 pb-1">
        {/* Candidates */}
        <div>
          <div className="text-2xl font-extrabold text-black dark:text-white leading-none">
            144
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1.5">
            CANDIDATES
          </div>
        </div>

        {/* Qualified Rate */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#1890FF] leading-none">
              36%
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
              (52/144)
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1.5">
            QUALIFIED RATE
          </div>
        </div>

        {/* 30D Qualified Rate */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#1890FF] leading-none">
              38%
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
              (18/47)
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1.5">
            30D QUALIFIED RATE
          </div>
        </div>
      </div>

      {/* 4. Table Header Columns */}
      <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-3 mb-1.5 flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        <span>SOURCE</span>
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="w-8 shrink-0" />
          <div className="text-right w-20">
            <div>TOTAL</div>
            <div style={{ textTransform: 'none' }} className="text-[8.5px] font-normal tracking-normal text-gray-400 dark:text-gray-500">
              Volume • rate
            </div>
          </div>
          <div className="text-right w-16">
            <div>30D</div>
            <div style={{ textTransform: 'none' }} className="text-[8.5px] font-normal tracking-normal text-gray-400 dark:text-gray-500">
              Volume • rate
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sources Breakdown Rows */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800/40">
        {SOURCE_CHANNELS.map((item) => (
          <div
            key={item.id}
            onClick={() => onChannelClick && onChannelClick(item.name)}
            className="py-2.5 flex items-center justify-between gap-2 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 rounded-xl px-1.5 -mx-1.5 transition-colors cursor-pointer group"
          >
            {/* Left: Code badge + Name */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${item.badgeClass}`}>
                {item.codeType === 'text' && item.code}
                {item.codeType === 'arrow' && <ArrowUpRight size={13} strokeWidth={2.5} />}
                {item.codeType === 'dots' && <MoreHorizontal size={13} strokeWidth={2.5} />}
              </div>
              <span className="text-[12px] sm:text-[13px] font-bold text-[#212b36] dark:text-gray-200 group-hover:text-[#1890FF] transition-colors truncate">
                {item.name}
              </span>
            </div>

            {/* Middle: vertically aligned chevron column */}
            <div className="w-8 flex items-center justify-center shrink-0">
              <ChevronRight size={13} className="text-gray-300 dark:text-gray-600 group-hover:text-[#1890FF] group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Right: Metrics columns */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              {/* Total */}
              <div className="text-right w-20">
                <div className="text-[13px] sm:text-sm font-bold text-black dark:text-white leading-tight">
                  {item.totalVolume}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal leading-tight mt-0.5">
                  {item.totalRate}% ({item.totalQualified}/{item.totalVolume})
                </div>
              </div>

              {/* 30D */}
              <div className="text-right w-16">
                <div className="text-[13px] sm:text-sm font-bold text-black dark:text-white leading-tight">
                  {item.recentVolume}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal leading-tight mt-0.5">
                  {item.recentRate}% ({item.recentQualified}/{item.recentVolume})
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Card Footnote */}
      <div className="border-t border-gray-100 dark:border-gray-800 mt-3 pt-3">
        <p className="text-[10px] sm:text-[10.5px] text-gray-400 dark:text-gray-500 font-normal leading-relaxed">
          Illustrative data • 30d = applications received in the 30 days ending Oct 10, 2026. Pending candidates are included in both qualified-rate denominators.
        </p>
      </div>

    </div>
  );
}
