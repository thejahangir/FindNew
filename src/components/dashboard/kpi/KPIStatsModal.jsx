import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Sliders } from 'lucide-react';
import { METRIC_CONFIGS } from './kpiConfig';

export default function KPIStatsModal({ isOpen, onClose, metric, onEditMetric }) {
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Determine all metric IDs that are currently displayed on the card
  const activeOnCardIds = useMemo(() => {
    const ids = new Set();
    const centerId = metric?.centerMetricId || config?.defaultCenter;
    const topId = metric?.topMetricId || config?.defaultTop;
    const bottomId = metric?.bottomMetricId || config?.defaultBottom;

    if (centerId) ids.add(centerId);
    if (topId) ids.add(topId);
    if (bottomId) ids.add(bottomId);
    return ids;
  }, [metric, config]);

  if (!isOpen || !metric) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-full max-w-xl sm:max-w-[660px] max-h-[90vh] flex flex-col overflow-hidden text-[#212b36] dark:text-white transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800/80 flex items-start justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase block mb-1">
              JOB METRICS
            </span>
            <div role="heading" aria-level="2" style={{ textTransform: 'none' }} className="text-xl sm:text-2xl font-bold text-[#212b36] dark:text-white tracking-tight">
              {metric.title} metrics
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Explore the available daily metrics for this job.
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

        {/* METRICS LIST & NOTE (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div>
            {config.options.map((option) => {
              const isOnCard = activeOnCardIds.has(option.id);

              return (
                <div 
                  key={option.id}
                  className="py-3.5 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {option.label}
                  </span>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-gray-900 dark:text-white text-right">
                      {option.value}
                    </span>

                    {isOnCard && (
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] dark:text-blue-400 text-xs font-semibold px-2.5 py-0.5 rounded-md select-none">
                        On card
                      </span>
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

          <div className="flex items-center justify-end">
            {onEditMetric && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditMetric(metric);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1890FF] hover:bg-[#096dd9] text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer flex items-center justify-center gap-1.5"
                title="Customized the Card"
              >
                <Sliders size={13.5} />
                <span>Customized the Card</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
