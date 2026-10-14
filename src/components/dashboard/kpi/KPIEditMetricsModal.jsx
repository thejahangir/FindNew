import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Sliders, Check, Target, Calendar, Clock, BarChart2, 
  HelpCircle, Settings, ToggleLeft, ToggleRight, Sparkles
} from 'lucide-react';

export default function KPIEditMetricsModal({ isOpen, onClose, metric, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    changePeriod: 'vs last month',
    showLastMonthFooter: true,
    showChangeIndicator: true,
    benchmarkPeriod: 'previous_month',
    pipelineScope: ['applied', 'screened', 'interview']
  });

  useEffect(() => {
    if (metric) {
      setFormData({
        title: metric.title || '',
        target: String(metric.target || ''),
        changePeriod: metric.changePeriod || 'vs last month',
        showLastMonthFooter: metric.showLastMonthFooter !== false,
        showChangeIndicator: metric.showChangeIndicator !== false,
        benchmarkPeriod: metric.benchmarkPeriod || 'previous_month',
        pipelineScope: metric.pipelineScope || ['applied', 'screened', 'interview']
      });
    }
  }, [metric]);

  if (!isOpen || !metric) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...metric,
        title: formData.title.trim() || metric.title,
        target: Number(formData.target) || metric.target,
        changePeriod: formData.changePeriod,
        showLastMonthFooter: formData.showLastMonthFooter,
        showChangeIndicator: formData.showChangeIndicator,
        benchmarkPeriod: formData.benchmarkPeriod,
        pipelineScope: formData.pipelineScope
      });
    }
    onClose();
  };

  const toggleScope = (key) => {
    setFormData(prev => ({
      ...prev,
      pipelineScope: prev.pipelineScope.includes(key)
        ? prev.pipelineScope.filter(k => k !== key)
        : [...prev.pipelineScope, key]
    }));
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden text-[#212b36] dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center shrink-0 border ${metric.borderColor || 'border-transparent'}`}>
              <Sliders size={18} className={metric.textColor} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#212b36] dark:text-white">
                Edit Metric: {metric.title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Customize calculation rules, targets, and card footer display
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* 1. Metric Display Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Card Display Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Total Applications"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f2937] text-sm text-[#212b36] dark:text-white focus:outline-hidden focus:border-[#1890FF] focus:ring-1 focus:ring-[#1890FF] transition-all"
              required
            />
          </div>

          {/* 2. Monthly Target Goal */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Monthly Target / Goal Threshold
              </label>
              <span className="text-[11px] text-gray-400">Current count: {metric.totalFormatted}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                placeholder="e.g. 2500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f2937] text-sm text-[#212b36] dark:text-white focus:outline-hidden focus:border-[#1890FF] focus:ring-1 focus:ring-[#1890FF] transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                units
              </span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Used to calculate pace velocity and visual progress in analytics.
            </p>
          </div>

          {/* 3. Comparison Benchmark Period */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Comparison Baseline Period
            </label>
            <select
              value={formData.benchmarkPeriod}
              onChange={(e) => {
                const val = e.target.value;
                let periodText = 'vs last month';
                if (val === 'same_month_ly') periodText = 'vs last year';
                if (val === 'previous_quarter') periodText = 'vs last quarter';
                setFormData(prev => ({ ...prev, benchmarkPeriod: val, changePeriod: periodText }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f2937] text-sm text-[#212b36] dark:text-white focus:outline-hidden focus:border-[#1890FF] cursor-pointer"
            >
              <option value="previous_month">Previous Month (Default: Last Month)</option>
              <option value="same_month_ly">Same Month Last Year</option>
              <option value="previous_quarter">Previous Quarter</option>
              <option value="previous_30_days">Previous 30 Days Rolling</option>
            </select>
          </div>

          {/* 4. Display Toggles */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Card Display Options
            </span>

            {/* Toggle 1: Show Last Month in Footer */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-[#212b36] dark:text-white block">
                  Show "Last month" in card footer
                </span>
                <span className="text-[11px] text-gray-400">
                  Displays baseline reference number in the bottom row
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, showLastMonthFooter: !prev.showLastMonthFooter }))}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.showLastMonthFooter ? 'bg-[#1890FF]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    formData.showLastMonthFooter ? 'left-6' : 'left-1'
                  }`} 
                />
              </button>
            </div>

            {/* Toggle 2: Show Percentage Trend Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-[#212b36] dark:text-white block">
                  Show Percentage Change Pill
                </span>
                <span className="text-[11px] text-gray-400">
                  Renders the green/red % badge with trend arrow
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, showChangeIndicator: !prev.showChangeIndicator }))}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.showChangeIndicator ? 'bg-[#1890FF]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    formData.showChangeIndicator ? 'left-6' : 'left-1'
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* 5. Pipeline Stages Included */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Stages Included in Metric Scope
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'applied', label: 'Inbound Sourced' },
                { id: 'screened', label: 'Screening Round' },
                { id: 'interview', label: 'Tech & HM Interviews' },
                { id: 'offer', label: 'Extended Offers' }
              ].map(stage => {
                const isSelected = formData.pipelineScope.includes(stage.id);
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => toggleScope(stage.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected 
                        ? 'border-[#1890FF] bg-[#1890FF]/5 text-[#1890FF]' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span>{stage.label}</span>
                    {isSelected && <Check size={14} className="text-[#1890FF]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MODAL FOOTER BUTTONS */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1890FF] hover:bg-[#1890FF]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
