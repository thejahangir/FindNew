import React from 'react';
import { Eye, Users, UserX, Video, Award, CheckCircle2, BarChart2 } from 'lucide-react';

// Reusable SVG Donut Chart (No % symbol in center text)
export const DonutRing = ({ percent = 18.6, size = 48, strokeWidth = 5, color = '#1890FF', trackColor, children }) => {
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
          className={trackColor || "text-gray-100 dark:text-gray-800"}
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

export default function KpiCard({
  metric,
  renderCardIcon,
  onOpenStats,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  showViewIconOnHover = true
}) {

  // Center label and raw value
  const centerLabel = (metric.topLabel || metric.changeText || '').replace(/:\s*$/, '').trim();
  const rawTopValue = String(metric.topValue || metric.badgeValue || metric.changePercent || '');
  const topNumeric = parseFloat(rawTopValue.replace(/%/g, ''));

  // Detect whether to use Donut Chart or Solid Number
  // If the metric has % or has percent/rate/ratio in label or metric ID -> use Donut Chart
  const isPercentage = rawTopValue.includes('%') || 
                       String(metric.topLabel || '').toLowerCase().includes('percent') || 
                       String(metric.topLabel || '').toLowerCase().includes('rate') || 
                       String(metric.topLabel || '').toLowerCase().includes('ratio') ||
                       String(metric.topMetricId || '').includes('percent') ||
                       String(metric.topMetricId || '').includes('rate') ||
                       String(metric.topMetricId || '').includes('ratio');

  // Bottom label and value (third metric)
  const bottomLabel = (metric.footerLabel || '').replace(/:\s*$/, '').trim();
  const bottomValue = String(metric.footerValue || metric.lastMonthFormatted || metric.lastMonth || '').replace(/%/g, '').trim();

  // Card theme color (fallback to primary blue)
  const cardColor = metric.color || '#1890FF';

  // Default icon renderer if not provided
  const getIcon = () => {
    if (renderCardIcon) return renderCardIcon(metric.icon);
    switch (metric.icon) {
      case 'Users': return <Users size={17} className={metric.textColor || 'text-[#1890FF]'} />;
      case 'UserX': return <UserX size={17} className={metric.textColor || 'text-[#FF5630]'} />;
      case 'Video': return <Video size={17} className={metric.textColor || 'text-[#8E33FF]'} />;
      case 'Award': return <Award size={17} className={metric.textColor || 'text-[#FFAB00]'} />;
      case 'CheckCircle2': return <CheckCircle2 size={17} className={metric.textColor || 'text-[#00A76F]'} />;
      default: return <BarChart2 size={17} className={metric.textColor || 'text-[#1890FF]'} />;
    }
  };

  return (
    <div
      data-kpi={metric.id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="bg-white dark:bg-[#161c24] p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative border border-gray-100 dark:border-gray-800 hover:border-[#1890FF]/40 min-h-[148px]"
    >
      {/* 1. TITLE ROW: Icon + Title on left, Fixed Total Number on right */}
      <div className="flex items-center justify-between gap-2 min-h-[32px]">
        <div
          onClick={onOpenStats}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
          title="Click to view all metrics"
        >
          <div className={`w-8 h-8 rounded-xl ${metric.bgColor || 'bg-[#1890FF]/10'} flex items-center justify-center shrink-0 border ${metric.borderColor || 'border-[#1890FF]/20'}`}>
            {getIcon()}
          </div>
          <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase tracking-wider" title={metric.title}>
            {metric.title}
          </h4>
        </div>

        {/* Fixed Total Number on top right */}
        <div
          onClick={onOpenStats}
          className="text-xl sm:text-2xl font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
          title={`Total ${metric.title}: ${metric.totalFormatted || metric.total.toLocaleString()} (Fixed)`}
        >
          {metric.totalFormatted || metric.total.toLocaleString()}
        </div>
      </div>

      {/* 2. CENTER METRIC: Either with Donut Chart OR Simple Bold & Bigger Number */}
      {isPercentage ? (
        /* With Donut Chart (Option 1) */
        <div className="mt-3.5 flex items-center gap-3 min-h-[48px]">
          <DonutRing
            percent={topNumeric}
            size={48}
            strokeWidth={5}
            color={cardColor}
            trackColor="text-gray-100 dark:text-gray-800"
          >
            <span className="text-[11px] font-black text-[#212b36] dark:text-white leading-none">
              {topNumeric}
            </span>
          </DonutRing>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-snug truncate" title={centerLabel}>
              {centerLabel}
            </div>
          </div>
        </div>
      ) : (
        /* Without Donut Chart: Simple Bold and Bigger Number (Option 2) */
        <div className="mt-3.5 flex items-center gap-3.5 min-h-[48px]">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none shrink-0">
            {isNaN(topNumeric) ? rawTopValue : topNumeric}
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-snug truncate" title={centerLabel}>
              {centerLabel}
            </div>
          </div>
        </div>
      )}

      {/* 3. BOTTOM ROW (Third Metric): Value next to label only, View icon on right by default */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] min-h-[26px]">
        {/* Value placed directly next to label */}
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <span className="text-gray-500 dark:text-gray-400 truncate" title={bottomLabel}>
            {bottomLabel}
          </span>
          <span className="font-extrabold text-sm sm:text-[15px] text-[#212b36] dark:text-gray-100 shrink-0">
            {bottomValue}
          </span>
        </div>

        {/* View eye icon: visible by default OR on hover only */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenStats && onOpenStats();
          }}
          className={`p-1 rounded-lg text-[#1890FF] hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 cursor-pointer shrink-0 ${
            showViewIconOnHover
              ? 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
              : 'opacity-100'
          }`}
          title="View Metrics"
        >
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}
