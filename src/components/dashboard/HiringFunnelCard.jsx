import React from 'react';
import { Filter, Check, X } from 'lucide-react';

const FUNNEL_STAGES = [
  { id: '01', name: 'APPLIED', count: 248, percentage: 50, avgDays: '4.6d', maxDays: '18d' },
  { id: '02', name: 'SCREENING', count: 86, percentage: 35, avgDays: '5.1d', maxDays: '12d' },
  { id: '03', name: 'TECHNICAL INTERVIEW', count: 42, percentage: 17, avgDays: '4.3d', maxDays: '9d' },
  { id: '04', name: 'HR INTERVIEW', count: 18, percentage: 7, avgDays: '3.2d', maxDays: '6d' },
  { id: '05', name: 'REFERENCE CHECK', count: 7, percentage: 3, avgDays: '2.7d', maxDays: '4d' },
  { id: '06', name: 'OFFER', count: 3, percentage: 1.5, avgDays: '5.8d', maxDays: '11d' }
];

const COMPLETED_OUTCOMES = [
  { 
    id: 'hired', 
    name: 'HIRED', 
    count: 8, 
    percentage: 3, 
    avgDays: '—', 
    maxDays: '—', 
    color: 'text-[#00A76F]', 
    barColor: 'bg-[#00A76F]', 
    iconBg: 'bg-[#00A76F]/10 text-[#00A76F]',
    isCheck: true 
  },
  { 
    id: 'rejected', 
    name: 'REJECTED', 
    count: 86, 
    percentage: 35, 
    avgDays: '—', 
    maxDays: '—', 
    color: 'text-[#FF5630]', 
    barColor: 'bg-[#FF5630]', 
    iconBg: 'bg-[#FF5630]/10 text-[#FF5630]',
    isCheck: false 
  }
];

export default function HiringFunnelCard({ onStageClick }) {
  const totalApplications = 498;

  return (
    <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all duration-200">
      


      {/* 2. Card Header: Icon + Title + Subtitle + Total Applications */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] flex items-center justify-center border border-blue-100/60 dark:border-blue-800/40 shrink-0 shadow-2xs">
            <Filter size={17} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-none uppercase tracking-wide">
              HIRING FUNNEL
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mt-1">
              Candidates by current stage
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-extrabold text-black dark:text-white leading-none">
            {totalApplications}
          </div>
          <div className="text-[10.5px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
            applications
          </div>
        </div>
      </div>

      {/* 3. Table Header Columns */}
      <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-3 mb-1.5 flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        <span>STAGE</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-12 text-right">APPS</span>
          <span className="w-10 text-right">AVG</span>
          <span className="w-10 text-right">MAX</span>
        </div>
      </div>

      {/* 4. Active Stages */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800/40">
        {FUNNEL_STAGES.map((item) => (
          <div
            key={item.id}
            onClick={() => onStageClick && onStageClick(item.name)}
            className="py-2 flex items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 rounded-xl px-1.5 -mx-1.5 transition-colors cursor-pointer group"
          >
            {/* Stage info + bar */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#1890FF] bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-mono shrink-0">
                {item.id}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[11.5px] font-bold text-[#212b36] dark:text-gray-200 group-hover:text-[#1890FF] transition-colors truncate block">
                  {item.name}
                </span>
                <div className="w-full max-w-[130px] sm:max-w-[150px] bg-gray-100 dark:bg-gray-800 h-1 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-[#1890FF] h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Counts: Apps highlighted in black, Avg & Max in grey */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-12 text-right text-[13px] sm:text-sm font-bold text-black dark:text-white">
                {item.count}
              </span>
              <span className="w-10 text-right text-xs text-gray-400 dark:text-gray-500 font-normal">
                {item.avgDays}
              </span>
              <span className="w-10 text-right text-xs text-gray-400 dark:text-gray-500 font-normal">
                {item.maxDays}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Completed Outcomes Section */}
      <div className="border-t border-gray-100 dark:border-gray-800 mt-2.5 pt-2.5">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
          COMPLETED OUTCOMES
        </span>

        <div className="divide-y divide-gray-50 dark:divide-gray-800/40">
          {COMPLETED_OUTCOMES.map((item) => (
            <div
              key={item.id}
              onClick={() => onStageClick && onStageClick(item.name)}
              className="py-2 flex items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 rounded-xl px-1.5 -mx-1.5 transition-colors cursor-pointer group"
            >
              {/* Outcome info + bar */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`w-4 h-4 rounded ${item.iconBg} flex items-center justify-center shrink-0`}>
                  {item.isCheck ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11.5px] font-bold text-[#212b36] dark:text-gray-200 group-hover:text-[#1890FF] transition-colors truncate block">
                    {item.name}
                  </span>
                  <div className="w-full max-w-[130px] sm:max-w-[150px] bg-gray-100 dark:bg-gray-800 h-1 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`${item.barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Counts: Outcome count colored, Avg & Max dashes in grey */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-12 text-right text-[13px] sm:text-sm font-bold ${item.color}`}>
                  {item.count}
                </span>
                <span className="w-10 text-right text-xs text-gray-400 dark:text-gray-500 font-normal">
                  {item.avgDays}
                </span>
                <span className="w-10 text-right text-xs text-gray-400 dark:text-gray-500 font-normal">
                  {item.maxDays}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Card Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 mt-3 pt-3 text-center">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
          Average / max days in stage • terminal outcomes shown separately
        </p>
        <div className="inline-flex items-center gap-1.5 text-[10.5px] text-gray-500 dark:text-gray-400 font-medium mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1890FF]" />
          <span>Updated daily • Oct 10</span>
        </div>
      </div>

    </div>
  );
}
