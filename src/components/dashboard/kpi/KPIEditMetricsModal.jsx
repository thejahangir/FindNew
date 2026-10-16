import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Check, RotateCcw, Users, UserX, Video, Award, CheckCircle2 
} from 'lucide-react';
import { METRIC_CONFIGS } from './kpiConfig';

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

  // Draft assigned metrics state for the 3 customizable slots: Top, Center, Bottom
  const [assignedMetrics, setAssignedMetrics] = useState({
    Top: config.defaultTop,
    Center: config.defaultCenter,
    Bottom: config.defaultBottom
  });

  useEffect(() => {
    if (metric) {
      setAssignedMetrics({
        Top: metric.topMetricId || config.defaultTop,
        Center: metric.centerMetricId || config.defaultCenter,
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
  const topOption = config.options.find(o => o.id === assignedMetrics.Top) || config.options[1] || config.options[0];
  const centerOption = config.options.find(o => o.id === assignedMetrics.Center) || config.options[0];
  const bottomOption = config.options.find(o => o.id === assignedMetrics.Bottom) || config.options[2] || config.options[0];

  const handleSelectMetric = (option) => {
    setAssignedMetrics(prev => ({
      ...prev,
      [activePosition]: option.id
    }));
  };

  const handleResetDefaults = () => {
    setAssignedMetrics({
      Top: config.defaultTop,
      Center: config.defaultCenter,
      Bottom: config.defaultBottom
    });
  };

  const handleSaveAndApply = () => {
    if (onSave && metric) {
      const updated = {
        ...metric,
        // Center / Hero Slot
        centerMetricId: assignedMetrics.Center,
        total: centerOption.numericValue ?? metric.total,
        totalFormatted: centerOption.value,
        heroLabel: centerOption.heroLabel || centerOption.label,

        // Top Slot
        topMetricId: assignedMetrics.Top,
        topLabel: topOption.label,
        topValue: topOption.value,
        badgeValue: topOption.badgeValue || topOption.value,
        badgeColor: topOption.badgeColor,
        badgeIcon: topOption.badgeIcon,
        changeText: topOption.label,
        changePercent: topOption.numericValue,

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
      default: return <Users size={16} className={metric.textColor || 'text-[#1890FF]'} />;
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
              Choose a card position, then select the metric to show there. Editing: {activePosition}.
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
        <div className="px-6 pt-4 pb-0 bg-gray-50/50 dark:bg-gray-800/20 shrink-0 space-y-3.5">
          {/* DUMMY CARD PREVIEW */}
          <div className="bg-white dark:bg-[#161c24] p-3.5 sm:p-4 rounded-xl shadow-xs border border-gray-200/80 dark:border-gray-800 max-w-sm mx-auto transition-all">
            {/* 1. Title Row */}
            <div className="flex items-center justify-between pb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${metric.bgColor || 'bg-[#1890FF]/10'} flex items-center justify-center shrink-0`}>
                  {renderCardIcon(metric.icon)}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                  {metric.title}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider font-semibold">PREVIEW</span>
            </div>

            {/* 2. Top Metric Slot */}
            <div 
              onClick={() => setActivePosition('Top')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer relative ${
                activePosition === 'Top'
                  ? 'border-2 border-dashed border-[#1890FF] bg-[#1890FF]/5'
                  : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/60'
              }`}
              title="Click to select Top position"
            >
              {activePosition === 'Top' && (
                <span className="absolute -top-2 right-2 bg-[#1890FF] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  Editing Top
                </span>
              )}
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium flex items-center justify-between gap-1.5">
                <span className="truncate">{topOption.label}</span>
                <div className="flex items-center shrink-0">
                  <span className="text-gray-400 dark:text-gray-500 font-bold mx-1">:</span>
                  <span className="font-bold text-[#00A76F] dark:text-[#22c55e]">
                    {String(topOption.value).replace(/^\+/, '')}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Center / Hero Metric Slot */}
            <div 
              onClick={() => setActivePosition('Center')}
              className={`my-1.5 p-2 rounded-lg transition-all cursor-pointer relative ${
                activePosition === 'Center'
                  ? 'border-2 border-dashed border-[#1890FF] bg-[#1890FF]/5'
                  : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/60'
              }`}
              title="Click to select Center position"
            >
              {activePosition === 'Center' && (
                <span className="absolute -top-2 right-2 bg-[#1890FF] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  Editing Center
                </span>
              )}
              <div className="text-2xl sm:text-[26px] font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none">
                {centerOption.value}
              </div>
              <div className="text-[11.5px] font-semibold text-gray-600 dark:text-gray-300 mt-1 truncate">
                {centerOption.heroLabel || centerOption.label}
              </div>
            </div>

            {/* 4. Bottom Metric Slot */}
            <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
            <div 
              onClick={() => setActivePosition('Bottom')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer relative ${
                activePosition === 'Bottom'
                  ? 'border-2 border-dashed border-[#1890FF] bg-[#1890FF]/5'
                  : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/60'
              }`}
              title="Click to select Bottom position"
            >
              {activePosition === 'Bottom' && (
                <span className="absolute -top-2 right-2 bg-[#1890FF] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  Editing Bottom
                </span>
              )}
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span className="truncate">{bottomOption.label}</span>
                <div className="flex items-center shrink-0">
                  <span className="text-gray-400 dark:text-gray-500 font-bold mx-1">:</span>
                  <span className="font-bold text-[#212b36] dark:text-gray-200">
                    {bottomOption.value}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* POSITION TABS: Top, Center, Bottom */}
          <div className="flex items-center gap-7 border-b border-gray-200 dark:border-gray-800">
            {['Top', 'Center', 'Bottom'].map((pos) => {
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
              const isSelectedForActiveSlot = assignedMetrics[activePosition] === option.id;

              return (
                <div 
                  key={option.id}
                  className="py-3.5 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-4 text-xs sm:text-sm first:pt-0"
                >
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {option.label}
                  </span>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-gray-900 dark:text-white text-right">
                      {option.value}
                    </span>

                    {isSelectedForActiveSlot ? (
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
          <p className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
            Illustrative values; time pairs are median / P90. Actual values will come from the daily ATS statistics snapshot.
          </p>

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
