import React, { useState } from 'react';
import { Share2, ArrowUpRight, MoreHorizontal, ChevronDown } from 'lucide-react';
import SourceCandidatesModal from './SourceCandidatesModal';

const SOURCE_CHANNELS = [
  {
    id: 'agencies',
    name: 'Agencies',
    codeType: 'text',
    code: 'A',
    badgeClass: 'bg-blue-50 dark:bg-blue-900/30 text-[#1890FF]',
    totalVolume: 51,
    totalQualified: 16,
    totalRate: 31,
    recentVolume: 17,
    recentQualified: 6,
    recentRate: 35,
    children: [
      {
        name: 'Northstar Talent',
        subtitle: 'Since Aug 26, 2026 · 45d',
        totalVolume: 24,
        totalQualified: 8,
        totalRate: 33,
        recentVolume: 8,
        recentQualified: 3,
        recentRate: 38
      },
      {
        name: 'Summit Search',
        subtitle: 'Since Sep 11, 2026 · 29d',
        totalVolume: 15,
        totalQualified: 5,
        totalRate: 33,
        recentVolume: 5,
        recentQualified: 2,
        recentRate: 40
      },
      {
        name: 'Ledger Recruitment',
        subtitle: 'Since Sep 25, 2026 · 15d',
        totalVolume: 12,
        totalQualified: 3,
        totalRate: 25,
        recentVolume: 4,
        recentQualified: 1,
        recentRate: 25
      }
    ]
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
    recentRate: 39,
    children: [
      {
        name: 'Careers website',
        subtitle: 'Posted Aug 5, 2026',
        totalVolume: 34,
        totalQualified: 14,
        totalRate: 41,
        recentVolume: 12,
        recentQualified: 5,
        recentRate: 42
      },
      {
        name: 'LinkedIn',
        subtitle: 'Posted Aug 12, 2026',
        totalVolume: 22,
        totalQualified: 9,
        totalRate: 41,
        recentVolume: 7,
        recentQualified: 3,
        recentRate: 43
      },
      {
        name: 'Indeed',
        subtitle: 'Posted Aug 19, 2026',
        totalVolume: 13,
        totalQualified: 3,
        totalRate: 23,
        recentVolume: 4,
        recentQualified: 1,
        recentRate: 25
      }
    ]
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
    recentRate: 50,
    children: [
      {
        name: 'Internal Referral',
        subtitle: '',
        totalVolume: 18,
        totalQualified: 9,
        totalRate: 50,
        recentVolume: 6,
        recentQualified: 3,
        recentRate: 50
      }
    ]
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
    recentRate: 0,
    children: [
      {
        name: 'Unattributed',
        subtitle: '',
        totalVolume: 6,
        totalQualified: 1,
        totalRate: 17,
        recentVolume: 1,
        recentQualified: 0,
        recentRate: 0
      }
    ]
  }
];

export default function SourceStatsCard({ onChannelClick }) {
  const [expandedChannels, setExpandedChannels] = useState({});
  const [selectedSubSource, setSelectedSubSource] = useState(null);

  const toggleChannel = (id) => {
    setExpandedChannels(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    if (onChannelClick) {
      onChannelClick(id);
    }
  };

  return (
    <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all duration-200">
      

      {/* 2. Card Header: Icon + Title + Subtitle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shrink-0 shadow-2xs">
            <Share2 size={17} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-none uppercase tracking-wide">
              SOURCE STATS
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mt-1">
              Candidate volume and qualification rates by source.
            </p>
          </div>
        </div>
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

      {/* 5. Sources Breakdown Rows with Accordion */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800/40">
        {SOURCE_CHANNELS.map((item) => {
          const isExpanded = !!expandedChannels[item.id];
          return (
            <div key={item.id} className="transition-all">
              {/* Parent Row Button */}
              <button
                type="button"
                onClick={() => toggleChannel(item.id)}
                className="w-full py-2.5 flex items-center justify-between gap-2 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 rounded-xl px-1.5 -mx-1.5 transition-colors cursor-pointer group text-left"
                aria-expanded={isExpanded}
              >
                {/* Left: Code badge + Name */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${item.badgeClass}`}>
                    {item.codeType === 'text' && item.code}
                    {item.codeType === 'arrow' && <ArrowUpRight size={13} strokeWidth={2.5} />}
                    {item.codeType === 'dots' && <MoreHorizontal size={13} strokeWidth={2.5} />}
                  </div>
                  <span className={`text-[12px] sm:text-[13px] font-bold ${item.nameColor || 'text-[#212b36] dark:text-gray-200'} group-hover:text-[#1890FF] transition-colors truncate`}>
                    {item.name}
                  </span>
                </div>

                {/* Middle: vertically aligned chevron column */}
                <div className="w-8 flex items-center justify-center shrink-0">
                  <ChevronDown
                    size={13}
                    className={`text-gray-400 dark:text-gray-500 group-hover:text-[#1890FF] transition-transform duration-200 ${
                      isExpanded ? 'rotate-0 text-[#1890FF]' : '-rotate-90'
                    }`}
                  />
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
              </button>

              {/* Sub-rows: Expanded items with card styling & smooth animation */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isExpanded ? 'grid-rows-[1fr] opacity-100 my-2' : 'grid-rows-[0fr] opacity-0 my-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="bg-gray-50/80 dark:bg-[#121820] rounded-xl border border-gray-200/70 dark:border-gray-800 shadow-2xs px-3 py-1">
                    <div className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
                      {item.children && item.children.map((child, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubSource({
                              parent: item,
                              child: child
                            });
                          }}
                          className="py-2.5 sm:py-3 flex items-center justify-between gap-2 hover:bg-white/90 dark:hover:bg-gray-800/80 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group/child"
                        >
                          {/* Left: Sub-source name + subtitle */}
                          <div className="min-w-0 flex-1">
                            <div className="text-[12.5px] sm:text-[13px] font-bold text-[#212b36] dark:text-gray-200 group-hover/child:text-[#1890FF] leading-tight transition-colors">
                              {child.name}
                            </div>
                            {child.subtitle && (
                              <div className="text-[10.5px] text-gray-400 dark:text-gray-500 font-normal leading-tight mt-0.5">
                                {child.subtitle}
                              </div>
                            )}
                          </div>

                          {/* Middle: spacer matching parent's chevron column */}
                          <div className="w-8 shrink-0" />

                          {/* Right: Metrics columns aligned with header */}
                          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            {/* Total */}
                            <div className="text-right w-20">
                              <div className="text-[13px] sm:text-sm font-bold text-black dark:text-white leading-tight">
                                {child.totalVolume}
                              </div>
                              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal leading-tight mt-0.5">
                                {child.totalRate}% ({child.totalQualified}/{child.totalVolume})
                              </div>
                            </div>

                            {/* 30D */}
                            <div className="text-right w-16">
                              <div className="text-[13px] sm:text-sm font-bold text-black dark:text-white leading-tight">
                                {child.recentVolume}
                              </div>
                              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal leading-tight mt-0.5">
                                {child.recentRate}% ({child.recentQualified}/{child.recentVolume})
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>



      {/* 7. Modal displaying candidates for clicked source item */}
      <SourceCandidatesModal
        open={!!selectedSubSource}
        onClose={() => setSelectedSubSource(null)}
        parentChannel={selectedSubSource?.parent}
        childSource={selectedSubSource?.child}
      />

    </div>
  );
}
