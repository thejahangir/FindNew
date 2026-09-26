import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileSignature, Users, Activity, Bell, Check, Edit2, Plus, X } from 'lucide-react';

const RECIPIENT_OPTIONS = [
  'Hiring Manager(s)',
  'Recruiter',
  'Admin Recruitment',
  'HR Partner',
  'Agency Coordinator',
  'Executive Sponsor'
];

export default function SettingsNotifications({ setSettingsActiveNav }) {
  const navigate = useNavigate();

  // Cardwise edit mode
  const [editModes, setEditModes] = useState({
    scorecards: false,
    candidates: false,
    general: false
  });

  const [scorecardSettings, setScorecardSettings] = useState({
    reminders: {
      firstReminder: 'End of day',
      followUps: '8:00 AM every 2 days',
      stopCondition: 'When scorecard is submitted'
    },
    newScorecards: ['Hiring Manager(s)', 'Recruiter']
  });

  const [candidateSettings, setCandidateSettings] = useState({
    newApplicants: ['Hiring Manager(s)', 'Admin Recruitment'],
    newInternal: ['Hiring Manager(s)', 'HR Partner'],
    newReferrals: ['Hiring Manager(s)', 'Admin Recruitment'],
    newAgency: ['Hiring Manager(s)', 'Agency Coordinator'],
    candidateHired: ['Hiring Manager(s)', 'HR Partner', 'Admin Recruitment']
  });

  const [generalSettings, setGeneralSettings] = useState({
    weeklyReport: ['Hiring Manager(s)', 'Executive Sponsor'],
    stageTransitionAlerts: true,
    slaBreachAlerts: true
  });

  const toggleRecipient = (category, field, recipient) => {
    if (category === 'scorecard') {
      const current = scorecardSettings[field] || [];
      const updated = current.includes(recipient)
        ? current.filter(r => r !== recipient)
        : [...current, recipient];
      setScorecardSettings(prev => ({ ...prev, [field]: updated }));
    } else if (category === 'candidate') {
      const current = candidateSettings[field] || [];
      const updated = current.includes(recipient)
        ? current.filter(r => r !== recipient)
        : [...current, recipient];
      setCandidateSettings(prev => ({ ...prev, [field]: updated }));
    } else if (category === 'general') {
      const current = generalSettings[field] || [];
      const updated = current.includes(recipient)
        ? current.filter(r => r !== recipient)
        : [...current, recipient];
      setGeneralSettings(prev => ({ ...prev, [field]: updated }));
    }
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="w-full flex-1 space-y-6">
        
        {/* Card 1: Scorecard Notifications */}
        <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all border border-gray-200/90 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <FileSignature size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Scorecard & Evaluation Alerts</h2>
                <p className="text-xs text-gray-500">Automated reminder schedules and submission notices for interviewers.</p>
              </div>
            </div>

            {editModes.scorecards ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, scorecards: false }))}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[11px] font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={11} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, scorecards: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          <div className="space-y-5">
            {/* Reminder Schedule */}
            <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
              <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white mb-3">Interviewer Reminder Cadence</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 mb-1">First Reminder</span>
                  {editModes.scorecards ? (
                    <select 
                      value={scorecardSettings.reminders.firstReminder}
                      onChange={(e) => setScorecardSettings(prev => ({ ...prev, reminders: { ...prev.reminders, firstReminder: e.target.value } }))}
                      className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-[#212b36] dark:text-white"
                    >
                      <option value="1 hour after interview">1 hour after interview</option>
                      <option value="End of day">End of day (6:00 PM)</option>
                      <option value="Next morning">Next morning (9:00 AM)</option>
                    </select>
                  ) : (
                    <p className="text-[13px] font-bold text-[#212b36] dark:text-white py-1">{scorecardSettings.reminders.firstReminder}</p>
                  )}
                </div>

                <div>
                  <span className="block text-[11px] font-bold text-gray-400 mb-1">Follow-up Frequency</span>
                  {editModes.scorecards ? (
                    <select 
                      value={scorecardSettings.reminders.followUps}
                      onChange={(e) => setScorecardSettings(prev => ({ ...prev, reminders: { ...prev.reminders, followUps: e.target.value } }))}
                      className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-[#212b36] dark:text-white"
                    >
                      <option value="Every 24 hours">Every 24 hours</option>
                      <option value="8:00 AM every 2 days">8:00 AM every 2 days</option>
                      <option value="Daily until submitted">Daily until submitted</option>
                    </select>
                  ) : (
                    <p className="text-[13px] font-bold text-[#212b36] dark:text-white py-1">{scorecardSettings.reminders.followUps}</p>
                  )}
                </div>

                <div>
                  <span className="block text-[11px] font-bold text-gray-400 mb-1">Stop Trigger</span>
                  <p className="text-[13px] text-[#00A76F] font-bold py-1">✓ {scorecardSettings.reminders.stopCondition}</p>
                </div>
              </div>
            </div>

            {/* New Scorecard Submission Notice */}
            <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
              <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white mb-2">New Scorecard Submitted Notice</h4>
              <p className="text-xs text-gray-500 mb-3">Email these stakeholders as soon as an interviewer submits their evaluation:</p>
              
              {editModes.scorecards ? (
                <div className="flex flex-wrap gap-2">
                  {RECIPIENT_OPTIONS.map(opt => {
                    const isSelected = scorecardSettings.newScorecards.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleRecipient('scorecard', 'newScorecards', opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#1890FF] text-white shadow-xs' 
                            : 'bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {scorecardSettings.newScorecards.map((rec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#1890FF]/10 text-[#1890FF] text-xs font-bold">
                      {rec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Candidate Notifications */}
        <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all border border-gray-200/90 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[#00A76F] flex items-center justify-center shrink-0">
                <Users size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Candidate Inbound & Pipeline Alerts</h2>
                <p className="text-xs text-gray-500">Configure recipient groups for new applicants, referrals, and agency submissions.</p>
              </div>
            </div>

            {editModes.candidates ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, candidates: false }))}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[11px] font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={11} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, candidates: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { field: 'newApplicants', label: 'New Direct Applications' },
              { field: 'newInternal', label: 'Internal Transfer Applications' },
              { field: 'newReferrals', label: 'Employee Referral Submissions' },
              { field: 'newAgency', label: 'Agency Partner Submissions' }
            ].map(item => (
              <div key={item.field} className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white mb-2">{item.label}</h4>
                {editModes.candidates ? (
                  <div className="flex flex-wrap gap-1.5">
                    {RECIPIENT_OPTIONS.map(opt => {
                      const isSelected = (candidateSettings[item.field] || []).includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleRecipient('candidate', item.field, opt)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#00A76F] text-white' 
                              : 'bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {(candidateSettings[item.field] || []).map((rec, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#00A76F]/10 text-[#00A76F] text-[11px] font-bold">
                        {rec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Other Notifications */}
        <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all border border-gray-200/90 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <Activity size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Periodic Reports & SLA Alerts</h2>
                <p className="text-xs text-gray-500">Weekly recruiting summaries and candidate stagnation SLA warnings.</p>
              </div>
            </div>

            {editModes.general ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, general: false }))}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[11px] font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={11} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, general: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
              <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white mb-2">Weekly Pipeline Digest</h4>
              <p className="text-xs text-gray-500 mb-3">Sent every Monday at 8:00 AM summarizing pipeline throughput and pending actions:</p>
              
              {editModes.general ? (
                <div className="flex flex-wrap gap-2">
                  {RECIPIENT_OPTIONS.map(opt => {
                    const isSelected = generalSettings.weeklyReport.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleRecipient('general', 'weeklyReport', opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#1890FF] text-white' 
                            : 'bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {generalSettings.weeklyReport.map((rec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#1890FF]/10 text-[#1890FF] text-xs font-bold">
                      {rec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
        <button 
          onClick={() => setSettingsActiveNav('Agencies')}
          className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Agencies
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-3 bg-[#00A76F] text-white rounded-xl font-bold hover:bg-[#00A76F]/90 transition-colors shadow-[0_8px_16px_rgba(0,167,111,0.24)] cursor-pointer"
          >
            Finish Job Setup
          </button>
        </div>
      </div>
    </div>
  );
}
