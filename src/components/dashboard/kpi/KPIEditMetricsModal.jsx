import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Check, RotateCcw, Users, UserX, Video, Award, CheckCircle2,
  Pencil, Eye, Clock, TrendingDown, TrendingUp, BarChart2
} from 'lucide-react';
import { METRIC_CONFIGS } from './kpiConfig';
import { DonutRing } from './KpiCard';

export default function KPIEditMetricsModal({ isOpen, onClose, metric, onSave }) {
  const [activePosition, setActivePosition] = useState('Center');

  const config = useMemo(() => {
    if (!metric) return METRIC_CONFIGS.applications;
    return METRIC_CONFIGS[metric.id] || {
      title: `Customize ${metric.title} Card`,
      note: "Qualification uses the job's documented criteria. First-review time runs from submission to the first meaningful recruiter review.",
      defaultCenter: 'total_applications',
      defaultTop: 'percent_change',
      defaultBottom: 'active_applications',
      options: METRIC_CONFIGS.applications.options
    };
  }, [metric]);

  // Draft assigned metrics state for the 2 customizable slots: Center, Bottom
  const [assignedMetrics, setAssignedMetrics] = useState({
    Center: config.defaultTop || config.defaultCenter,
    Bottom: config.defaultBottom
  });

  useEffect(() => {
    if (metric) {
      setAssignedMetrics({
        Center: metric.centerMetricId || metric.topMetricId || config.defaultTop,
        Bottom: metric.bottomMetricId || config.defaultBottom
      });
      setActivePosition('Center');
    }
  }, [metric, config]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !metric) return null;

  // Selected option objects for live preview & saving
  const centerOption = config.options.find(o => o.id === assignedMetrics.Center) || config.options[1] || config.options[0];
  const bottomOption = config.options.find(o => o.id === assignedMetrics.Bottom) || config.options[2] || config.options[0];

  const rawCenterValue = String(centerOption.value || '');
  const centerNumeric = parseFloat(rawCenterValue.replace(/%/g, ''));
  const isCenterPercentage = rawCenterValue.includes('%') || 
                             String(centerOption.label || '').toLowerCase().includes('percent') || 
                             String(centerOption.label || '').toLowerCase().includes('rate') || 
                             String(centerOption.label || '').toLowerCase().includes('ratio') ||
                             String(centerOption.id || '').includes('percent') ||
                             String(centerOption.id || '').includes('rate') ||
                             String(centerOption.id || '').includes('ratio');

  const handleSelectMetric = (option) => {
    if (option.id === config.defaultCenter) return;
    setAssignedMetrics(prev => ({
      ...prev,
      [activePosition]: option.id
    }));
  };

  const handleResetDefaults = () => {
    setAssignedMetrics({
      Center: config.defaultTop,
      Bottom: config.defaultBottom
    });
  };

  const handleSaveAndApply = () => {
    if (onSave && metric) {
      const updated = {
        ...metric,
        // Center Slot
        centerMetricId: assignedMetrics.Center,
        topMetricId: assignedMetrics.Center,
        topLabel: centerOption.label,
        topValue: centerOption.value,
        badgeValue: centerOption.badgeValue || centerOption.value,
        badgeColor: centerOption.badgeColor,
        badgeIcon: centerOption.badgeIcon,
        changeText: centerOption.label,
        changePercent: centerOption.numericValue,

        // Bottom Slot
        bottomMetricId: assignedMetrics.Bottom,
        footerLabel: bottomOption.label,
        footerValue: bottomOption.value
      };
      onSave(updated);
    }
    onClose();
  };

  const renderCardIcon = (iconName) => {
    switch (iconName) {
      case 'Users': return <Users size={16} className={metric.textColor || 'text-[#1890FF]'} />;
      case 'UserX': return <UserX size={16} className={metric.textColor || 'text-[#FF5630]'} />;
      case 'Video': return <Video size={16} className={metric.textColor || 'text-[#8E33FF]'} />;
      case 'Award': return <Award size={16} className={metric.textColor || 'text-[#FFAB00]'} />;
      case 'CheckCircle2': return <CheckCircle2 size={16} className={metric.textColor || 'text-[#00A76F]'} />;
      default: return <BarChart2 size={16} className={metric.textColor || 'text-[#1890FF]'} />;
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-full max-w-xl sm:max-w-[660px] max-h-[92vh] flex flex-col overflow-hidden text-[#212b36] dark:text-white transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800/80 flex items-start justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase block mb-1">
              JOB METRICS
            </span>
            <div role="heading" aria-level="2" style={{ textTransform: 'none' }} className="text-xl sm:text-2xl font-bold text-[#212b36] dark:text-white tracking-tight">
              Customize {metric.title.toLowerCase()} card
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose a card position, then select the metric to show there. Editing: <span className="font-semibold text-[#1890FF]">{activePosition}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer shrink-0 mt-0.5"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* FIXED SECTION: LIVE PREVIEW DUMMY CARD & POSITION SELECTOR (DOES NOT SCROLL) */}
        <div className="px-6 pt-4 pb-0 bg-gray-50/50 dark:bg-gray-800/20 shrink-0 space-y-3">
          {/* DUMMY CARD PREVIEW */}
          <div className="bg-white dark:bg-[#161c24] p-3.5 sm:p-4 rounded-xl shadow-xs border border-gray-200/80 dark:border-gray-800 max-w-sm mx-auto transition-all">
            {/* 1. Title Row: Icon + Title on left, FIXED TOTAL NUMBER on top right */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg ${metric.bgColor || 'bg-[#1890FF]/10'} flex items-center justify-center shrink-0`}>
                  {renderCardIcon(metric.icon)}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 truncate">
                  {metric.title}
                </span>
              </div>

              {/* Fixed Total Number on top right next to Title */}
              <div className="flex items-center gap-1.5 shrink-0" title="Fixed metric - cannot be configured">
                <span className="text-lg sm:text-xl font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none">
                  {metric.totalFormatted || metric.total?.toLocaleString() || '0'}
                </span>
                <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Fixed
                </span>
              </div>
            </div>

            {/* Metrics Body: Center + Bottom slots matching new KPI card design */}
            <div className="mt-3.5 space-y-2">
              {/* 2. Center Slot on card body */}
              <div 
                onClick={() => setActivePosition('Center')}
                className={`p-2 rounded-xl transition-all cursor-pointer relative ${
                  activePosition === 'Center'
                    ? 'border-2 border-dashed border-[#1890FF] bg-[#1890FF]/5'
                    : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
                title="Click to configure Center position"
              >
                {activePosition === 'Center' && (
                  <span className="absolute -top-2.5 right-2 bg-[#1890FF] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                    Editing Center
                  </span>
                )}
                {isCenterPercentage ? (
                  /* Center with Donut Chart */
                  <div className="flex items-center gap-3 min-h-[44px]">
                    <DonutRing
                      percent={centerNumeric}
                      size={44}
                      strokeWidth={4.5}
                      color={metric.color || '#1890FF'}
                      trackColor="text-gray-100 dark:text-gray-800"
                    >
                      <span className="text-[10px] font-black text-[#212b36] dark:text-white leading-none">
                        {centerNumeric}
                      </span>
                    </DonutRing>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-snug truncate" title={centerOption.label}>
                        {(centerOption.label || '').replace(/:\s*$/, '').trim()}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Center without Donut Chart: Simple Bold and Bigger Number */
                  <div className="flex items-center gap-3 min-h-[44px]">
                    <span className="text-2xl font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none shrink-0">
                      {isNaN(centerNumeric) ? rawCenterValue : centerNumeric}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-snug truncate" title={centerOption.label}>
                        {(centerOption.label || '').replace(/:\s*$/, '').trim()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Bottom Slot on card body with View icon on right bottom */}
              <div 
                onClick={() => setActivePosition('Bottom')}
                className={`pt-2 border-t border-gray-100 dark:border-gray-800 p-2 rounded-xl transition-all cursor-pointer relative ${
                  activePosition === 'Bottom'
                    ? 'border-2 border-dashed border-[#1890FF] bg-[#1890FF]/5'
                    : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
                title="Click to configure Bottom position"
              >
                {activePosition === 'Bottom' && (
                  <span className="absolute -top-2.5 right-2 bg-[#1890FF] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                    Editing Bottom
                  </span>
                )}
                <div className="flex items-center justify-between text-[11px] min-h-[24px]">
                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                    <span className="text-gray-500 dark:text-gray-400 truncate leading-none">
                      {(bottomOption.label || '').replace(/:\s*$/, '').trim()}
                    </span>
                    <span className="font-extrabold text-sm text-[#212b36] dark:text-gray-100 shrink-0 leading-none">
                      {String(bottomOption.value || '').replace(/%/g, '').trim()}
                    </span>
                  </div>
                  <div className="p-1 rounded-lg text-[#1890FF] shrink-0" title="View icon">
                    <Eye size={13} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* POSITION TABS: Center, Bottom */}
          <div className="flex items-center gap-7 border-b border-gray-200 dark:border-gray-800">
            {['Center', 'Bottom'].map((pos) => {
              const isActive = activePosition === pos;
              return (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setActivePosition(pos)}
                  className={`pb-2.5 text-[13px] font-bold transition-colors whitespace-nowrap relative cursor-pointer ${
                    isActive
                      ? 'text-[#1890FF] dark:text-[#1890FF]'
                      : 'text-gray-600 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  <span>{pos}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1890FF] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SCROLLABLE SECTION: METRICS LIST & NOTE (SCROLLS FREELY) */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div>
            {config.options.map((option) => {
              const isFixedTotal = option.id === config.defaultCenter;
              const isSelectedForActiveSlot = assignedMetrics[activePosition] === option.id;

              return (
                <div 
                  key={option.id}
                  className="py-3.5 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-4 text-xs sm:text-sm first:pt-0"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-gray-700 dark:text-gray-300 block truncate">
                      {option.label}
                    </span>
                    {isFixedTotal && (
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        Fixed on card header (top right)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-gray-900 dark:text-white text-right">
                      {option.value}
                    </span>

                    {isFixedTotal ? (
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs font-semibold px-2.5 py-0.5 rounded-md select-none">
                        Fixed
                      </span>
                    ) : isSelectedForActiveSlot ? (
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] dark:text-blue-400 text-xs font-semibold px-2.5 py-0.5 rounded-md select-none">
                        On card
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectMetric(option)}
                        className="text-[#1890FF] hover:text-[#096dd9] text-xs font-semibold hover:underline cursor-pointer transition-colors px-1 py-0.5"
                      >
                        Use metric
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* NOTE CALLOUT BOX */}
          <div className="mt-4 p-3.5 sm:p-4 rounded-xl border border-blue-100/60 dark:border-gray-800 bg-slate-50/60 dark:bg-gray-800/30 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {config.note}
          </div>
        </div>

        {/* MODAL FOOTER (FIXED AT BOTTOM) */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#161c24] shrink-0 space-y-3">
  
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} /> Reset to defaults
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndApply}
                className="px-5 py-2.5 rounded-xl bg-[#1890FF] hover:bg-[#096dd9] text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer flex items-center gap-1.5"
              >
                <Check size={13} strokeWidth={3} /> Save & Apply
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
