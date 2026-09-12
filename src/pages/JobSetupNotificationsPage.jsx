import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Save, Users, FileSignature, Settings2, Bell, 
  Clock, Activity, Edit2, ShieldAlert, Check, X, Plus, Trash2
} from 'lucide-react';
import JobSetupHeader from '../components/dashboard/JobSetupHeader';

const initialNotificationSections = [
  {
    title: 'Scorecard Notifications',
    description: 'Manage alerts related to interview feedback and evaluations.',
    icon: FileSignature,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    items: [
      {
        key: 'reminders',
        label: 'Scorecard Reminders',
        description: 'Customize the time and frequency that scorecard reminders are sent to interviewers.',
        configType: 'schedule',
        configData: [
          { label: 'First Reminder', value: 'End of day' },
          { label: 'Follow-ups', value: '8:00 AM every 2 days' },
          { label: 'Stop reminders', value: 'When scorecard has been submitted' }
        ]
      },
      {
        key: 'newScorecards',
        label: 'New Scorecards',
        description: 'Email select team members when a new scorecard is submitted with a summary of submitted and outstanding scorecards.',
        configType: 'recipients',
        configData: ['Hiring Manager(s)', 'Recruiter']
      }
    ]
  },
  {
    title: 'Candidate Notifications',
    description: 'Set up alerts for new applications and candidate status changes.',
    icon: Users,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    items: [
      {
        key: 'newApplicants',
        label: 'New Applicants',
        description: 'For each new candidate that applies to this job, emails will be sent to these participants:',
        configType: 'recipients',
        configData: ['Hiring Manager(s)', 'Admin Recruitment']
      },
      {
        key: 'newInternal',
        label: 'New Internal Applicants',
        description: 'For each new internal candidate that applies to this job, emails will be sent to these participants:',
        configType: 'recipients',
        configData: ['Hiring Manager(s)', 'HR Partner']
      },
      {
        key: 'newReferrals',
        label: 'New Referrals',
        description: 'For each new referral added to this job, emails will be sent to:',
        configType: 'recipients',
        configData: ['Hiring Manager(s)', 'Admin Recruitment']
      },
      {
        key: 'newAgency',
        label: 'New Agency Submissions',
        description: 'For each new agency submission added to this job, emails will be sent to:',
        configType: 'recipients',
        configData: ['Hiring Manager(s)', 'Agency Coordinator']
      },
      {
        key: 'candidateHired',
        label: 'Candidate Hired',
        description: 'When a candidate accepts an offer and is marked as hired, emails will be sent to:',
        configType: 'recipients',
        configData: [] 
      },
      {
        key: 'approvedToStart',
        label: 'Approved to Start Recruiting',
        description: 'For each job that is fully approved to start recruiting, emails will be sent to:',
        configType: 'recipients',
        configData: ['Admin Recruitment']
      }
    ]
  },
  {
    title: 'Other Notifications',
    description: 'Configure reports, summaries, and automated stage transition alerts.',
    icon: Activity,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    items: [
      {
        key: 'weeklyReport',
        label: 'Weekly Recruiting Report',
        description: 'Weekly recruiting report emails will be sent to these participants:',
        configType: 'recipients',
        configData: ['Hiring Manager(s)', 'Executive Sponsor']
      },
      {
        key: 'stageTransitions',
        label: 'Stage Transitions',
        description: 'Automate internal communication to select team members when a candidate transitions into a specific stage.',
        configType: 'list',
        configData: [
          { stage: 'To be rejected', recipients: ['Application\'s Recruiter'] },
          { stage: 'Interview - Technical', recipients: ['Engineering Manager'] }
        ]
      }
    ]
  }
];

export default function JobSetupNotificationsPage() {
  const [sections, setSections] = useState(initialNotificationSections);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('job');
  
  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null); // { sectionTitle, itemIndex, itemData }
  const [tempConfigData, setTempConfigData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state?.jobData;

  const handleFinish = (action) => {
    setIsPublishModalOpen(false);
    navigate('/dashboard/jobs');
  };

  const openEditModal = (sectionTitle, itemIndex, item) => {
    // Deep clone the config data for editing
    setEditingItem({ sectionTitle, itemIndex, label: item.label, configType: item.configType });
    setTempConfigData(JSON.parse(JSON.stringify(item.configData)));
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setTempConfigData(null);
  };

  const saveConfiguration = () => {
    setSections(prev => prev.map(section => {
      if (section.title === editingItem.sectionTitle) {
        const newItems = [...section.items];
        newItems[editingItem.itemIndex] = {
          ...newItems[editingItem.itemIndex],
          configData: tempConfigData
        };
        return { ...section, items: newItems };
      }
      return section;
    }));
    closeEditModal();
  };

  // --- Modal Sub-components for Editing ---
  
  const handleAddRecipient = (role) => {
    if (!tempConfigData.includes(role)) {
      setTempConfigData([...tempConfigData, role]);
    }
  };

  const handleRemoveRecipient = (role) => {
    setTempConfigData(tempConfigData.filter(r => r !== role));
  };

  const handleUpdateSchedule = (index, value) => {
    const newData = [...tempConfigData];
    newData[index].value = value;
    setTempConfigData(newData);
  };

  const handleRemoveStage = (index) => {
    setTempConfigData(tempConfigData.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 flex flex-col min-h-[calc(100vh-100px)] animate-fade-in font-sans">
      <div className="relative z-10 w-full mb-8">
        <JobSetupHeader 
          title="Notifications & Alerts" 
          subtitle="Configure who receives updates and when. Ensure your hiring team stays informed at every critical stage." 
        />
      </div>

      <div className="flex-1 space-y-8 flex flex-col w-full">
        
        {/* Top Controls: Job vs User Settings */}
        <div className="flex items-center justify-between bg-white dark:bg-[#161c24] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A76F]/10 flex items-center justify-center text-[#00A76F]">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#212b36] dark:text-white text-sm">View Settings By</h3>
              <p className="text-xs text-gray-500">Toggle between global job settings or your personal preferences.</p>
            </div>
          </div>
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl">
            <button
              onClick={() => setActiveTab('job')}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'job' 
                  ? 'bg-white dark:bg-[#161c24] text-[#212b36] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
                  : 'text-gray-500 hover:text-[#212b36] dark:hover:text-white'
              }`}
            >
              Job Settings
            </button>
            <button
              onClick={() => setActiveTab('user')}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'user' 
                  ? 'bg-white dark:bg-[#161c24] text-[#212b36] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
                  : 'text-gray-500 hover:text-[#212b36] dark:hover:text-white'
              }`}
            >
              My Preferences
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
          <ShieldAlert size={20} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-400">
            <strong>Note:</strong> You can now add dynamic hiring team roles as recipients (e.g. Hiring Manager, Candidate's Recruiter). When assigned, the actual user occupying that role will receive the notification.
          </p>
        </div>

        {/* Notifications Sections Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {sections.map(section => (
            <div key={section.title} className="bg-white dark:bg-[#161c24] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
              
              {/* Section Header */}
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-gray-50/50 dark:bg-[#1a222c]/50">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${section.bg} ${section.color}`}>
                  <section.icon size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#212b36] dark:text-white">{section.title}</h2>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {section.items.map((item, index) => (
                  <div key={item.key} className="p-8 hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors group">
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-1">{item.label}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>

                        {/* Configurations Visualizer */}
                        <div className="mt-4">
                          {item.configType === 'recipients' && (
                            <div className="flex flex-wrap gap-2">
                              {item.configData.length > 0 ? (
                                item.configData.map(role => (
                                  <span key={role} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                    {role}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-400 italic">No participants added</span>
                              )}
                            </div>
                          )}

                          {item.configType === 'schedule' && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2 border border-gray-100 dark:border-gray-800">
                              {item.configData.map(sched => (
                                <div key={sched.label} className="flex items-center text-sm">
                                  <span className="w-32 font-bold text-gray-700 dark:text-gray-300">{sched.label}:</span>
                                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                    <Clock size={14} className="text-gray-400" />
                                    {sched.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {item.configType === 'list' && (
                            <div className="space-y-3">
                              {item.configData.map(listItem => (
                                <div key={listItem.stage} className="flex items-center gap-4 text-sm">
                                  <div className="w-48 font-bold text-[#212b36] dark:text-gray-200 truncate" title={listItem.stage}>
                                    {listItem.stage}
                                  </div>
                                  <div className="flex-1 flex flex-wrap gap-2">
                                    {listItem.recipients.map(role => (
                                      <span key={role} className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                        {role}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => openEditModal(section.title, index, item)}
                        className="shrink-0 px-4 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-sm font-bold text-[#212b36] dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#1890FF] hover:text-[#1890FF] transition-all flex items-center gap-2 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                      >
                        <Edit2 size={16} />
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Edit Configuration Modal */}
      {editingItem && tempConfigData && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-3xl w-full max-w-lg flex flex-col shadow-[0_24px_48px_rgba(0,0,0,0.2)] animate-scale-up overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Configure {editingItem.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{editingItem.sectionTitle}</p>
              </div>
              <button onClick={closeEditModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {editingItem.configType === 'recipients' && (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-2">Active Recipients</label>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tempConfigData.length > 0 ? tempConfigData.map(role => (
                      <div key={role} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/20">
                        {role}
                        <button onClick={() => handleRemoveRecipient(role)} className="hover:bg-[#1890FF]/20 p-0.5 rounded transition-colors cursor-pointer">
                          <X size={14} />
                        </button>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-400 italic">No recipients selected</p>
                    )}
                  </div>
                  
                  <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-2">Available Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {['Hiring Manager(s)', 'Recruiter', 'Admin Recruitment', 'HR Partner', 'Agency Coordinator', 'Executive Sponsor'].filter(r => !tempConfigData.includes(r)).map(role => (
                      <button 
                        key={role} 
                        onClick={() => handleAddRecipient(role)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#1890FF] hover:text-[#1890FF] transition-colors cursor-pointer"
                      >
                        <Plus size={14} /> {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {editingItem.configType === 'schedule' && (
                <div className="space-y-4">
                  {tempConfigData.map((sched, idx) => (
                    <div key={sched.label}>
                      <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1">{sched.label}</label>
                      <input 
                        type="text" 
                        value={sched.value} 
                        onChange={(e) => handleUpdateSchedule(idx, e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-[#212b36] dark:text-white transition-all text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              {editingItem.configType === 'list' && (
                <div className="space-y-4">
                  {tempConfigData.map((item, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Stage</label>
                        <input 
                          type="text" 
                          value={item.stage} 
                          onChange={(e) => {
                            const newData = [...tempConfigData];
                            newData[idx].stage = e.target.value;
                            setTempConfigData(newData);
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#1890FF] text-sm text-[#212b36] dark:text-white"
                        />
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">Recipients (comma separated)</label>
                        <input 
                          type="text" 
                          value={item.recipients.join(', ')} 
                          onChange={(e) => {
                            const newData = [...tempConfigData];
                            newData[idx].recipients = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setTempConfigData(newData);
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#1890FF] text-sm text-[#212b36] dark:text-white"
                        />
                      </div>
                      <button onClick={() => handleRemoveStage(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setTempConfigData([...tempConfigData, { stage: 'New Stage', recipients: [] }])}
                    className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold text-sm rounded-xl hover:border-[#1890FF] hover:text-[#1890FF] transition-colors cursor-pointer"
                  >
                    <Plus size={16} /> Add Transition Rule
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-3 bg-gray-50/50 dark:bg-gray-800/30">
              <button 
                onClick={closeEditModal} 
                className="flex-1 py-2.5 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={saveConfiguration}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-12 sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20 pb-4">
        <button 
          onClick={() => navigate('/dashboard/job-setup/agencies', { state: { jobData } })}
          className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Agencies
        </button>
        <button 
          onClick={() => setIsPublishModalOpen(true)}
          className="px-8 py-3 bg-[#00A76F] text-white rounded-xl font-bold hover:bg-[#00A76F]/90 transition-colors shadow-[0_8px_16px_rgba(0,167,111,0.24)] cursor-pointer flex items-center gap-2 text-base"
        >
          Finish Setup and Publish
        </button>
      </div>

      {/* Publish Modal */}
      {isPublishModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#161c24] rounded-3xl w-full max-w-md flex flex-col shadow-[0_24px_48px_rgba(0,0,0,0.2)] animate-scale-up overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-[#00A76F]/10 text-[#00A76F] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-bold text-[#212b36] dark:text-white">Ready to Publish?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                You've successfully configured the entire hiring process for this role. You can publish it now to start accepting candidates, or save it as a draft to review later.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex flex-col gap-3 bg-gray-50/50 dark:bg-gray-800/30">
              <button 
                onClick={() => handleFinish('publish')}
                className="w-full py-3.5 text-sm font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 rounded-xl shadow-[0_8px_16px_rgba(0,167,111,0.24)] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Publish Job Now
              </button>
              <button 
                onClick={() => handleFinish('draft')}
                className="w-full py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={18} className="text-gray-400" /> Save as Draft
              </button>
              <button 
                onClick={() => setIsPublishModalOpen(false)} 
                className="w-full py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer mt-1"
              >
                Cancel and Review
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
