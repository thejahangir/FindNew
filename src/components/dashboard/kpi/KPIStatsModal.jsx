import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, BarChart2, TrendingUp, TrendingDown, Users, UserX, Video, 
  Award, CheckCircle2, Calendar, Target, ArrowUpRight, ArrowDownRight, 
  Download, Filter, Sliders, Sparkles, Check, ChevronRight, Layers, PieChart
} from 'lucide-react';

export default function KPIStatsModal({ isOpen, onClose, metric, onEditMetric }) {
  const [activeTimeframe, setActiveTimeframe] = useState('30D');
  const [exportToast, setExportToast] = useState(false);

  if (!isOpen || !metric) return null;

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  const getMetricIcon = (iconName) => {
    switch (iconName) {
      case 'Users': return <Users size={20} className={metric.textColor} />;
      case 'UserX': return <UserX size={20} className={metric.textColor} />;
      case 'Video': return <Video size={20} className={metric.textColor} />;
      case 'Award': return <Award size={20} className={metric.textColor} />;
      case 'CheckCircle2': return <CheckCircle2 size={20} className={metric.textColor} />;
      default: return <BarChart2 size={20} className={metric.textColor} />;
    }
  };

  const total = metric.total || 0;
  const lastMonth = metric.lastMonth || 0;
  const netDelta = total - lastMonth;
  const target = metric.target || (total + 50);
  const targetProgress = Math.min(100, Math.round((total / target) * 100));

  // Determine chart maximum for relative bar heights
  const maxBarValue = Math.max(
    ...((metric.history || []).flatMap(h => [h.count, h.lastMonthCount])),
    1
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#212b36] dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl ${metric.bgColor} flex items-center justify-center shrink-0 border ${metric.borderColor || 'border-transparent'}`}>
              {getMetricIcon(metric.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#212b36] dark:text-white">
                  {metric.title} Analytics & Trends
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold">
                  JOB-1024
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {metric.description || 'Comprehensive historical performance and funnel conversion data'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                onClose();
                if (onEditMetric) onEditMetric(metric);
              }}
              className="p-2 text-gray-400 hover:text-[#1890FF] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              title="Edit Card Metrics"
            >
              <Sliders size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* TOAST MESSAGE */}
          {exportToast && (
            <div className="p-3 bg-[#00A76F]/10 border border-[#00A76F]/30 rounded-xl text-xs font-semibold text-[#00A76F] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Check size={14} /> Analytics report exported successfully (CSV / PDF)
              </span>
            </div>
          )}

          {/* TIMEFRAME SELECTOR & TOP STATS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300">
              {['7D', '30D', '90D', 'QTD', 'All'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTimeframe === tf 
                      ? 'bg-white dark:bg-[#212b36] text-[#1890FF] shadow-xs' 
                      : 'hover:text-[#212b36] dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-[#1890FF] hover:text-[#1890FF] transition-colors cursor-pointer"
            >
              <Download size={13} />
              Export Report
            </button>
          </div>

          {/* KPI HIGHLIGHT CARDS (3-COLUMN STAT STRIP) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Total Volume */}
            <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Current Total ({activeTimeframe})
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#212b36] dark:text-white tracking-tight">
                  {metric.totalFormatted || total.toLocaleString()}
                </span>
                <span className={`inline-flex items-center text-xs font-bold ${
                  metric.changePercent >= 0 ? 'text-[#00A76F]' : 'text-[#FF5630]'
                }`}>
                  {metric.changePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(metric.changePercent)}%
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Net change: <span className="font-semibold text-gray-600 dark:text-gray-300">{netDelta >= 0 ? `+${netDelta}` : netDelta}</span> vs last month
              </p>
            </div>

            {/* 2. Last Month Reference */}
            <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Last Month Total
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#212b36] dark:text-white tracking-tight">
                  {metric.lastMonthFormatted || lastMonth.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 font-medium">baseline</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Avg velocity: <span className="font-semibold text-gray-600 dark:text-gray-300">{metric.avgVelocity || '3.2 days'}</span>
              </p>
            </div>

            {/* 3. Goal / Funnel Target */}
            <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Target Progress
                </span>
                <span className="text-xs font-bold text-[#1890FF]">{targetProgress}%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1890FF] h-full rounded-full transition-all duration-500"
                  style={{ width: `${targetProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Goal: <span className="font-semibold text-gray-600 dark:text-gray-300">{target.toLocaleString()}</span> units
              </p>
            </div>
          </div>

          {/* HISTORICAL TRENDS COMPARISON (WEEKLY RUN RATE) */}
          <div className="p-5 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#161c24]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Weekly Run Rate (This Month vs Last Month)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Week-by-week volume progression</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#1890FF]" /> This Month
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-gray-300 dark:bg-gray-700" /> Last Month
                </span>
              </div>
            </div>

            {/* BAR CHART VISUALIZER */}
            <div className="space-y-3 pt-2">
              {(metric.history || []).map((h, idx) => {
                const currentHeight = Math.max(8, Math.round((h.count / maxBarValue) * 100));
                const prevHeight = Math.max(8, Math.round((h.lastMonthCount / maxBarValue) * 100));
                const diff = h.count - h.lastMonthCount;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-600 dark:text-gray-300">{h.week}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-gray-500 dark:text-gray-400 font-normal">
                          Last: {h.lastMonthCount}
                        </span>
                        <span className="font-mono text-[#212b36] dark:text-white font-bold">
                          Current: {h.count}
                        </span>
                        <span className={`text-[11px] font-mono font-bold ${
                          diff >= 0 ? 'text-[#00A76F]' : 'text-[#FF5630]'
                        }`}>
                          {diff >= 0 ? `+${diff}` : diff}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 h-3.5 bg-gray-50 dark:bg-gray-800/40 p-0.5 rounded-md">
                      <div className="w-full bg-gray-200 dark:bg-gray-700/60 rounded-xs overflow-hidden flex items-center">
                        <div 
                          className="bg-[#1890FF] h-full rounded-xs transition-all duration-300"
                          style={{ width: `${currentHeight}%` }}
                        />
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700/60 rounded-xs overflow-hidden flex items-center">
                        <div 
                          className="bg-gray-400 dark:bg-gray-600 h-full rounded-xs transition-all duration-300"
                          style={{ width: `${prevHeight}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BREAKDOWN BY SOURCE / CHANNELS */}
          {metric.sources && metric.sources.length > 0 && (
            <div className="p-5 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#161c24]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Distribution Breakdown
                </h3>
                <span className="text-xs text-gray-400">
                  Conversion: <span className="font-semibold text-gray-600 dark:text-gray-300">{metric.funnelConversion}</span>
                </span>
              </div>

              <div className="space-y-3">
                {metric.sources.map((src, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{src.source}</span>
                      <span className="font-mono text-gray-500 dark:text-gray-400 font-semibold">
                        {src.count.toLocaleString()} ({src.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#1890FF] h-full rounded-full"
                        style={{ width: `${src.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRINITY AI INSIGHT BOX */}
          <div className="p-4 rounded-xl bg-[#1890FF]/5 border border-[#1890FF]/20 flex items-start gap-3">
            <Sparkles size={18} className="text-[#1890FF] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#1890FF] block mb-0.5">Trinity ATS Intelligence</span>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {metric.title} have performed at <span className="font-semibold text-[#1890FF]">{metric.changePercent >= 0 ? `+${metric.changePercent}%` : `${metric.changePercent}%`}</span> compared to the previous month. Top candidate quality remains steady with average fit rating exceeding 85%.
              </p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              if (onEditMetric) onEditMetric(metric);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#1890FF] transition-colors cursor-pointer"
          >
            <Sliders size={14} />
            Configure Card Metric
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1890FF] hover:bg-[#1890FF]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
