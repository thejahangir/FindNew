import React from 'react';
import { Eye, Users } from 'lucide-react';

// Reusable SVG Donut Chart (No % symbol)
const DonutRing = ({ percent = 18.6, size = 48, strokeWidth = 5, color = '#1890FF', trackColor, children }) => {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(percent, 0), 100);
  const strokeDashoffset = c - (c * clamped) / 100;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackColor || "text-blue-100 dark:text-blue-950/60"}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default function KpiCardWithThreeOptions({
  metric,
  renderCardIcon,
  onOpenStats,
  isHovered,
  onMouseEnter,
  onMouseLeave
}) {
  // Metrics from customize modal config
  const centerLabelWithDonut = (metric.topLabel || 'Percentage of new application').replace(/:\s*$/, '').trim();
  const centerValueWithDonut = parseFloat(String(metric.topValue || metric.badgeValue || metric.changePercent || 18.6).replace(/%/g, ''));

  // Solid number metric for Card 2 (Applications received in the last month: 42)
  const centerLabelSolid = 'Applications received in the last month';
  const centerValueSolid = 42;

  // Third metric (Bottom): Total active applications 186
  const bottomLabel = (metric.footerLabel || 'Total active applications').replace(/:\s*$/, '').trim();
  const bottomValue = parseInt(String(metric.footerValue || 186).replace(/[^0-9]/g, ''), 10) || 186;

  // Title & Total Row (identical in both cards)
  const renderCardHeader = () => (
    <div className="flex items-center justify-between gap-2 min-h-[32px]">
      <div
        onClick={onOpenStats}
        className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
        title="Click to view all metrics"
      >
        <div className={`w-8 h-8 rounded-xl ${metric.bgColor || 'bg-[#1890FF]/10'} flex items-center justify-center shrink-0 border ${metric.borderColor || 'border-[#1890FF]/20'}`}>
          {renderCardIcon ? renderCardIcon(metric.icon) : <Users size={17} className="text-[#1890FF]" />}
        </div>
        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase tracking-wider" title={metric.title}>
          {metric.title}
        </h4>
      </div>

      {/* Fixed Total Number on top right */}
      <div
        onClick={onOpenStats}
        className="text-xl sm:text-2xl font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
        title={`Total ${metric.title}: ${metric.totalFormatted || metric.total.toLocaleString()}`}
      >
        {metric.totalFormatted || metric.total.toLocaleString()}
      </div>
    </div>
  );

  // Third Metric Bottom Row (Identical in both cards: Value next to label on left, View eye icon on right by default)
  const renderCardBottom = () => (
    <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] min-h-[26px]">
      {/* Value next to label only */}
      <div className="flex items-center gap-2 min-w-0 pr-1">
        <span className="text-gray-500 dark:text-gray-400 truncate" title={bottomLabel}>
          {bottomLabel}
        </span>
        <span className="font-extrabold text-sm sm:text-[15px] text-[#212b36] dark:text-white shrink-0">
          {bottomValue}
        </span>
      </div>

      {/* View icon shown by default on the right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenStats && onOpenStats();
        }}
        className="p-1 rounded-lg text-[#1890FF] hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer shrink-0"
        title="View Metrics"
      >
        <Eye size={14} />
      </button>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* =============================================================== */}
      {/* CARD 1: With Donut Chart                                        */}
      {/* =============================================================== */}
      <div
        data-kpi={`${metric.id}-opt1`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="bg-white dark:bg-[#161c24] p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative border border-gray-100 dark:border-gray-800 hover:border-[#1890FF]/40"
      >
        {/* Title & Total Number Row */}
        {renderCardHeader()}

        {/* Center Section: With Donut Chart */}
        <div className="mt-3.5 flex items-center gap-3 min-h-[48px]">
          <DonutRing
            percent={centerValueWithDonut}
            size={48}
            strokeWidth={5}
            color="#1890FF"
            trackColor="text-blue-100 dark:text-blue-950/60"
          >
            <span className="text-[11px] font-black text-[#212b36] dark:text-white leading-none">
              {centerValueWithDonut}
            </span>
          </DonutRing>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-snug" title={centerLabelWithDonut}>
              {centerLabelWithDonut}
            </div>
          </div>
        </div>

        {/* Third Metric Bottom: Value next to label + View icon on right by default */}
        {renderCardBottom()}
      </div>

      {/* =============================================================== */}
      {/* CARD 2: Without Donut Chart (Solid Number: 42)                  */}
      {/* =============================================================== */}
      <div
        data-kpi={`${metric.id}-opt2`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="bg-white dark:bg-[#161c24] p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative border border-gray-100 dark:border-gray-800 hover:border-[#1890FF]/40"
      >
        {/* Title & Total Number Row */}
        {renderCardHeader()}

        {/* Center Section: Without Donut Chart (Solid Number + Label) */}
        <div className="mt-3.5 flex items-center gap-3.5 min-h-[48px]">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none shrink-0">
            {centerValueSolid}
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-snug" title={centerLabelSolid}>
              {centerLabelSolid}
            </div>
          </div>
        </div>

        {/* Third Metric Bottom: Value next to label + View icon on right by default */}
        {renderCardBottom()}
      </div>
    </div>
  );
}
