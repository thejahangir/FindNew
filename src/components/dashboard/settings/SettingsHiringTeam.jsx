import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Plus, Mail, Trash2, Shield, Settings2, X, LayoutGrid, List, Check, Edit2 } from 'lucide-react';
import SearchableSelect from '../../ui/SearchableSelect';

export default function SettingsHiringTeam({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialJobData = location.state?.jobData || {};
  const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [deleteConfirmMemberId, setDeleteConfirmMemberId] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', role: 'Interviewer', email: '' });
  const [formErrors, setFormErrors] = useState({});
  const [viewMode, setViewMode] = useState('cards');

  // Cardwise edit mode
  const [editModes, setEditModes] = useState({
    team: false
  });

  const [team, setTeam] = useState([
    { id: 1, name: 'Amit Sharma', role: 'Hiring Manager', email: 'amit.sharma@company.com', avatar: 'bg-[#1890FF]/20 text-[#1890FF]', initials: 'AS' },
    { id: 2, name: 'Priya Patel', role: 'Recruiter', email: 'priya.patel@company.com', avatar: 'bg-[#00A76F]/20 text-[#00A76F]', initials: 'PP' },
    { id: 3, name: 'David Chen', role: 'Interviewer', email: 'david.chen@company.com', avatar: 'bg-[#FFC107]/20 text-[#b78103]', initials: 'DC' },
    { id: 4, name: 'Sarah Jones', role: 'Interviewer', email: 'sarah.jones@company.com', avatar: 'bg-[#00A76F]/15 text-[#00A76F]', initials: 'SJ' },
    { id: 5, name: 'Michael Ross', role: 'Interviewer', email: 'michael.ross@company.com', avatar: 'bg-[#1890FF]/15 text-[#1890FF]', initials: 'MR' }
  ]);

  const handleAddMember = () => {
    const errors = {};
    if (!newMember.name.trim()) errors.name = 'Name is required';
    if (!newMember.role) errors.role = 'Role is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const member = {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email || `${newMember.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      avatar: 'bg-[#1890FF]/20 text-[#1890FF]',
      initials: newMember.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NA'
    };

    setTeam([...team, member]);
    setIsAddMemberModalOpen(false);
    setNewMember({ name: '', role: 'Interviewer', email: '' });
    setFormErrors({});
  };

  const handleUpdateRole = (id, newRole) => {
    setTeam(team.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  const confirmDelete = () => {
    if (deleteConfirmMemberId) {
      setTeam(prev => prev.filter(m => m.id !== deleteConfirmMemberId));
      setDeleteConfirmMemberId(null);
    }
  };

  const roleOptions = [
    { label: 'Hiring Manager', value: 'Hiring Manager' },
    { label: 'Recruiter', value: 'Recruiter' },
    { label: 'Interviewer', value: 'Interviewer' },
  ];

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Hiring Manager': return 'bg-[#1890FF]/10 text-[#1890FF] border-[#1890FF]/20';
      case 'Recruiter': return 'bg-[#00A76F]/10 text-[#00A76F] border-[#00A76F]/20';
      default: return 'bg-gray-100 dark:bg-gray-800 text-[#454f5b] dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="w-full flex-1">
        
        {/* Team Members Card */}
        <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all border border-gray-200/90 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <Users size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Hiring Team Members</h2>
                <p className="text-xs text-gray-500">Manage hiring managers, recruiters, and interviewers assigned to this job.</p>
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

              {editModes.team ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsAddMemberModalOpen(true)} 
                    className="px-3 py-1.5 bg-[#1890FF]/10 text-[#1890FF] hover:bg-[#1890FF]/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add Member
                  </button>
                  <button
                    onClick={() => setEditModes(prev => ({ ...prev, team: false }))}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                    title="Done"
                  >
                    <Check size={12} className="text-white stroke-[2.5]" />
                    <span>Done</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, team: true }))}
                  className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                  title="Edit"
                >
                  <Edit2 size={11} className="text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Members Display */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map(member => (
                <div 
                  key={member.id} 
                  className="flex flex-col bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all hover:border-gray-200 dark:hover:border-gray-700 relative group"
                >
                  {editModes.team && (
                    <button 
                      onClick={() => setDeleteConfirmMemberId(member.id)}
                      className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${member.avatar}`}>
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">{member.name}</h4>
                      <p className="text-[11px] text-gray-400 truncate">{member.email}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                    {editModes.team ? (
                      <div className="w-full">
                        <SearchableSelect 
                          options={roleOptions}
                          value={member.role}
                          onChange={(val) => handleUpdateRole(member.id, val)}
                          showSearch={false}
                          size="xs"
                        />
                      </div>
                    ) : (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${getRoleBadgeStyle(member.role)}`}>
                        {member.role}
                      </span>
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
                    <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Member</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    {editModes.team && <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {team.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${member.avatar}`}>
                            {member.initials}
                          </div>
                          <span className="text-[13px] font-bold text-[#212b36] dark:text-white">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[13px] text-gray-500">{member.email}</td>
                      <td className="py-3 px-4">
                        {editModes.team ? (
                          <div className="w-40">
                            <SearchableSelect 
                              options={roleOptions}
                              value={member.role}
                              onChange={(val) => handleUpdateRole(member.id, val)}
                              showSearch={false}
                              size="xs"
                            />
                          </div>
                        ) : (
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${getRoleBadgeStyle(member.role)}`}>
                            {member.role}
                          </span>
                        )}
                      </td>
                      {editModes.team && (
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={() => setDeleteConfirmMemberId(member.id)}
                            className="p-1.5 text-gray-400 hover:text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Remove member"
                          >
                            <Trash2 size={14} />
                          </button>
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
          onClick={() => setSettingsActiveNav('Description & Skills')}
          className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Description & Skills
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-3 text-gray-600 hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => setSettingsActiveNav('Pipeline')}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >
            Save and Continue to 'Pipeline'
          </button>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-[#212b36] dark:text-white">Add Team Member</h3>
              <button onClick={() => setIsAddMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                />
                {formErrors.name && <p className="text-xs text-[#FF5630] mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@company.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                <SearchableSelect 
                  options={roleOptions}
                  value={newMember.role}
                  onChange={(val) => setNewMember(prev => ({ ...prev, role: val }))}
                  showSearch={false}
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddMemberModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMember}
                className="px-5 py-2 bg-[#1890FF] text-white text-xs font-bold rounded-lg hover:bg-[#1890FF]/90 transition-colors shadow-sm"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmMemberId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-[#FF5630] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-2">Remove Team Member?</h3>
            <p className="text-xs text-gray-500 mb-6">Are you sure you want to remove this member from the hiring team for this job?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmMemberId(null)}
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
