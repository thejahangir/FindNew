import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Pause, Play, Trash2, X, Building2, Calendar, Check, Search, LayoutGrid, List, Edit2, Mail, ExternalLink } from 'lucide-react';

const mockAgencies = [
  { id: 1, name: 'TechTalent Partners', email: 'desk@techtalentpartners.com', status: 'Active', assignedDate: '10 Aug 2026', fee: '18%' },
  { id: 2, name: 'Global Recruiters Inc.', email: 'india@globalrecruiters.com', status: 'Paused', assignedDate: '22 Jul 2026', fee: '15%' },
  { id: 3, name: 'Elite Hiring Solutions', email: 'submissions@elitehiring.com', status: 'Active', assignedDate: '15 Jun 2026', fee: '20%' },
  { id: 4, name: 'NextGen Staffing', email: 'profiles@nextgenstaffing.com', status: 'Paused', assignedDate: '05 May 2026', fee: '15%' },
  { id: 5, name: 'Vanguard Recruitment', email: 'jobs@vanguardrecruit.com', status: 'Active', assignedDate: '30 Apr 2026', fee: '18%' }
];

const availableAgencies = [
  'Apex Staffing',
  'Nexus Search Group',
  'Pinnacle Placements',
  'Quantum Recruiters'
];

export default function SettingsAgencies({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState(mockAgencies);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Cardwise edit mode
  const [editModes, setEditModes] = useState({
    agencies: false
  });

  const toggleAgencyStatus = (id) => {
    setAgencies(agencies.map(a => 
      a.id === id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a
    ));
  };

  const handleAddAgency = () => {
    if (!selectedAgency) return;
    const newAgency = {
      id: Date.now(),
      name: selectedAgency,
      email: `contact@${selectedAgency.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'Active',
      assignedDate: 'Today',
      fee: '18%'
    };
    setAgencies([newAgency, ...agencies]);
    setSelectedAgency('');
    setIsAddModalOpen(false);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      setAgencies(agencies.filter(a => a.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="w-full flex-1">
        
        {/* Agencies Card */}
        <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all border border-gray-200/90 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Assigned Recruitment Agencies</h2>
                <p className="text-xs text-gray-500">Manage external sourcing partners authorized to submit candidate profiles for this role.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center">
                <button 
                  onClick={() => setViewMode('cards')} 
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'cards' ? 'bg-white dark:bg-[#161c24] shadow-sm text-[#1890FF]' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Card view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('table')} 
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-[#161c24] shadow-sm text-[#1890FF]' : 'text-gray-400 hover:text-gray-600'}`}
                  title="List view"
                >
                  <List size={16} />
                </button>
              </div>

              {editModes.agencies ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsAddModalOpen(true)} 
                    className="px-3 py-1.5 bg-[#1890FF]/10 text-[#1890FF] hover:bg-[#1890FF]/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add Agency
                  </button>
                  <button
                    onClick={() => setEditModes(prev => ({ ...prev, agencies: false }))}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[11px] font-bold cursor-pointer shrink-0"
                    title="Done"
                  >
                    <Check size={11} className="text-white stroke-[2.5]" />
                    <span>Done</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, agencies: true }))}
                  className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                  title="Edit"
                >
                  <Edit2 size={11} className="text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Agencies Content */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencies.map(agency => (
                <div 
                  key={agency.id} 
                  className="flex flex-col bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all hover:border-gray-200 dark:hover:border-gray-700 relative"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-700 flex items-center justify-center text-[#1890FF] shadow-xs">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">{agency.name}</h4>
                        <p className="text-[11px] text-gray-400">{agency.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Assigned:</span>
                      <span className="font-semibold text-[#212b36] dark:text-gray-300">{agency.assignedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Agreed Fee:</span>
                      <span className="font-bold text-[#00A76F]">{agency.fee}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      agency.status === 'Active' 
                        ? 'bg-[#00A76F]/10 text-[#00A76F]' 
                        : 'bg-[#FFC107]/10 text-[#b78103]'
                    }`}>
                      {agency.status}
                    </span>

                    {editModes.agencies && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleAgencyStatus(agency.id)}
                          className="px-2 py-1 text-[11px] font-bold rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {agency.status === 'Active' ? 'Pause' : 'Resume'}
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(agency.id)}
                          className="p-1 text-gray-400 hover:text-[#FF5630] rounded transition-colors cursor-pointer"
                          title="Remove agency"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                    <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Agency Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Email</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Date</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Placement Fee</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    {editModes.agencies && <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {agencies.map(agency => (
                    <tr key={agency.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Building2 size={16} className="text-[#1890FF]" />
                          <span className="text-[13px] font-bold text-[#212b36] dark:text-white">{agency.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[13px] text-gray-500">{agency.email}</td>
                      <td className="py-3 px-4 text-[13px] text-gray-500">{agency.assignedDate}</td>
                      <td className="py-3 px-4 text-[13px] font-bold text-[#00A76F]">{agency.fee}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          agency.status === 'Active' 
                            ? 'bg-[#00A76F]/10 text-[#00A76F]' 
                            : 'bg-[#FFC107]/10 text-[#b78103]'
                        }`}>
                          {agency.status}
                        </span>
                      </td>
                      {editModes.agencies && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => toggleAgencyStatus(agency.id)}
                              className="px-2 py-1 text-[11px] font-bold rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                            >
                              {agency.status === 'Active' ? 'Pause' : 'Resume'}
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(agency.id)}
                              className="p-1 text-gray-400 hover:text-[#FF5630] rounded transition-colors"
                              title="Remove agency"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
        <button 
          onClick={() => setSettingsActiveNav('Ranking Rules')}
          className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Ranking Rules
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-3 text-gray-600 hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => setSettingsActiveNav('Notifications')}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >
            Save and Continue to 'Notifications'
          </button>
        </div>
      </div>

      {/* Add Agency Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-[#212b36] dark:text-white">Assign Recruitment Agency</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Select Agency Partner</label>
                <select 
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                >
                  <option value="">Choose an agency...</option>
                  {availableAgencies.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAgency}
                disabled={!selectedAgency}
                className="px-5 py-2 bg-[#1890FF] text-white text-xs font-bold rounded-lg hover:bg-[#1890FF]/90 transition-colors shadow-sm disabled:opacity-50"
              >
                Assign Agency
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-[#FF5630] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-2">Remove Agency Access?</h3>
            <p className="text-xs text-gray-500 mb-6">This agency will no longer be able to submit candidates for this job opening.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2 bg-[#FF5630] text-white text-xs font-bold rounded-lg hover:bg-[#FF5630]/90 transition-colors shadow-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
