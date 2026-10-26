import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CalendarClock, Clock, Check, AlertCircle, Sparkles } from 'lucide-react';
import { addFollowup } from '../../data/followupsData';

export default function FollowUpModal({ isOpen, onClose, targetItem, onFollowupAdded }) {
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('Tomorrow • 10:00 AM');
  const [priority, setPriority] = useState('Normal');

  useEffect(() => {
    if (targetItem) {
      if (targetItem.type === 'Candidate') {
        setTitle(`Check scorecard & debrief with ${targetItem.title}`);
      } else if (targetItem.type === 'Job') {
        setTitle(`Pipeline alignment review for ${targetItem.title}`);
      } else if (targetItem.type === 'Application') {
        setTitle(`Application review & next round for ${targetItem.title}`);
      } else {
        setTitle(`Follow-up with ${targetItem.title}`);
      }
      setDue('Tomorrow • 10:00 AM');
      setPriority('Normal');
    }
  }, [targetItem]);

  if (!isOpen || !targetItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newFollowup = addFollowup({
      relatedId: targetItem.relatedId,
      type: targetItem.type,
      title: title.trim(),
      subject: targetItem.subject || `${targetItem.type}: ${targetItem.title}`,
      due,
      priority
    });

    if (onFollowupAdded) {
      onFollowupAdded(newFollowup.followup);
    }
    onClose();
  };

  const candidatePresets = [
    'Debrief with interview panel',
    'Follow up on salary expectations',
    'Send reminder for technical assignment',
    'Final decision alignment'
  ];

  const jobPresets = [
    'Hiring manager sync',
    'Sourcing pipeline review',
    'Agency submission deadline',
    'Interview panel review'
  ];

  const applicationPresets = [
    'Screening round scheduling',
    'Portfolio & resume review',
    'Send status update to candidate',
    'Hiring manager recommendation'
  ];

  const currentPresets =
    targetItem.type === 'Job'
      ? jobPresets
      : targetItem.type === 'Application'
      ? applicationPresets
      : candidatePresets;

  const dueOptions = [
    'Today • 5:00 PM',
    'Tomorrow • 10:00 AM',
    'In 2 Days • 2:00 PM',
    'Next Monday • 9:30 AM'
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="bg-white dark:bg-[#161c24] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center font-bold">
              <CalendarClock size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                Set Follow-Up Reminder
              </h3>
              <p className="text-xs text-gray-400">
                Will be visible in your top navbar Follow-ups drawer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Target Item Pill */}
          <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1890FF]">
                {targetItem.type}
              </span>
              <p className="text-xs font-bold text-[#212b36] dark:text-white truncate">
                {targetItem.title}
              </p>
              {targetItem.meta && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {targetItem.meta}
                </p>
              )}
            </div>
          </div>

          {/* Follow-up Note / Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Reminder Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Follow up on interview feedback..."
              className="w-full text-xs font-semibold px-3 py-2.5 bg-white dark:bg-[#1c252e] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#1890FF]"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTitle(preset)}
                  className="text-[10.5px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1890FF]/10 hover:text-[#1890FF] transition-colors cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Due Timing Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Due Date & Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dueOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDue(opt)}
                  className={`text-xs font-semibold px-2.5 py-2 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                    due === opt
                      ? 'border-[#1890FF] bg-[#1890FF]/5 text-[#1890FF] dark:bg-[#1890FF]/15'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span>{opt}</span>
                  {due === opt && <Check size={13} className="text-[#1890FF]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Priority Level
            </label>
            <div className="flex items-center gap-2">
              {['Normal', 'High', 'Urgent'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    priority === p
                      ? p === 'Urgent'
                        ? 'bg-red-50 text-red-600 border-red-300 dark:bg-red-950/40 dark:border-red-800'
                        : p === 'High'
                        ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800'
                        : 'bg-blue-50 text-blue-600 border-blue-300 dark:bg-blue-950/40 dark:border-blue-800'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1890FF] text-white hover:bg-[#096dd9] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <CalendarClock size={14} />
              <span>Save Follow-Up</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
