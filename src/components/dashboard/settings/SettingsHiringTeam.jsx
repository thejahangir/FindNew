import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Plus, Mail, Trash2, Shield , Settings2, X, LayoutGrid, List, Check , Edit2, Save } from 'lucide-react';

import SearchableSelect from '../../ui/SearchableSelect';

export default function SettingsHiringTeam({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const location = useLocation();
 const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
 const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
 const [deleteConfirmMemberId, setDeleteConfirmMemberId] = useState(null);
 const [newMember, setNewMember] = useState({ name: '', role: 'Interviewer' });
 const [formErrors, setFormErrors] = useState({});
 const [viewMode, setViewMode] = useState('cards');
 
  const initialJobData = location.state?.jobData || {};
  const [isEditingSettings, setIsEditingSettings] = useState(initialJobData?.status !== 'Published');
 const [jobData, setJobData] = useState({ ...initialJobData });

 const handleJobDataChange = (field, value) => {
 setJobData(prev => ({ ...prev, [field]: value }));
 };

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
 avatar: 'bg-[#1890FF]/20 text-[#1890FF]',
 initials: newMember.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NA'
 };

 setTeam([...team, member]);
 setIsAddMemberModalOpen(false);
 setNewMember({ name: '', role: 'Interviewer' });
 setFormErrors({});
 };

 const roleOptions = [
 { label: 'Hiring Manager', value: 'Hiring Manager' },
 { label: 'Recruiter', value: 'Recruiter' },
 { label: 'Interviewer', value: 'Interviewer' },
 ];

 const [team, setTeam] = useState([
 { id: 1, name: 'Amit Sharma', role: 'Hiring Manager', avatar: 'bg-[#1890FF]/20 text-[#1890FF]', initials: 'AS' },
 { id: 2, name: 'Priya Patel', role: 'Recruiter', avatar: 'bg-[#00A76F]/20 text-[#00A76F]', initials: 'PP' },
 { id: 3, name: 'David Chen', role: 'Interviewer', avatar: 'bg-[#FFC107]/20 text-[#b78103]', initials: 'DC' },
 { id: 4, name: 'Sarah Jones', role: 'Interviewer', avatar: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', initials: 'SJ' },
 { id: 5, name: 'Michael Ross', role: 'Interviewer', avatar: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', initials: 'MR' }
 ]);

 const confirmDelete = () => {
 if (deleteConfirmMemberId) {
 setTeam(prev => prev.filter(m => m.id !== deleteConfirmMemberId));
 setDeleteConfirmMemberId(null);
 }
 };

 if (!initialJobData) {
 return (
 <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
 <h2 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">No Job Selected</h2>
 <p className="text-black mb-6">Please create a job or select one to view its setup overview.</p>
 <button 
 onClick={() => navigate('/dashboard/jobs')}
 className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer"
 >
 Back to Jobs
 </button>
 </div>
 );
 }

 return (
 <div className="p-6 space-y-5 animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
 

 <div className="flex-1 space-y-5">

 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Users size={20} className="text-[#00A76F]" />
 Team Members
 </h2>
  <div className="flex gap-3">
  <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center">
  <button onClick={() => setViewMode('cards')} className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'cards' ? 'bg-white dark:bg-[#161c24] shadow-sm text-[#1890FF]' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={16} /></button>
  <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-[#161c24] shadow-sm text-[#1890FF]' : 'text-gray-400 hover:text-gray-600'}`}><List size={16} /></button>
  </div>
  <button onClick={() => setIsEditingSettings(prev => !prev)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"> {isEditingSettings ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit</>} </button>
  {isEditingSettings && (
  <button onClick={() => setIsAddMemberModalOpen(true)} className="px-4 py-2 bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] rounded-lg text-sm font-bold shadow-sm hover:bg-[#161c24] dark:hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
  <Plus size={16} /> Add Member
  </button>
  )}
  </div>
 </div>

 {viewMode === 'cards' ? (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
 {team.map(member => (
 <div key={member.id} className="flex flex-col h-full bg-white dark:bg-[#161c24] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative group/card overflow-hidden">
 
  {isEditingSettings && (
  <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
  <button 
  onClick={() => setDeleteConfirmMemberId(member.id)}
  className="p-2 text-gray-400 hover:text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer"
  title="Remove Member"
  >
  <Trash2 size={16} />
  </button>
  </div>
  )}

 <div className="p-8 flex-1 flex flex-col items-center justify-center text-center relative z-0">
 <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl ${member.avatar} shadow-sm border border-current/10 mb-4`}>
 {member.initials}
 </div>
 <h4 className="text-[17px] font-bold text-[#212b36] dark:text-white leading-snug w-full truncate px-4">
 {member.name}
 </h4>
 <span className="mt-2 text-[11px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full ">
 {member.role}
 </span>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-50 dark:bg-gray-800/50">
  <th className="p-4 text-xs font-bold text-gray-500 rounded-l-xl">Name</th>
  <th className="p-4 text-xs font-bold text-gray-500 ">Role</th>
  {isEditingSettings && <th className="p-4 text-center text-xs font-bold text-gray-500 rounded-r-xl">Actions</th>}
 </tr>
 </thead>
 <tbody>
 {team.map(member => (
 <tr key={member.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${member.avatar} shadow-sm border border-current/10`}>
 {member.initials}
 </div>
 <span className="text-sm font-bold text-[#212b36] dark:text-white">{member.name}</span>
 </div>
 </td>
  <td className="p-4">
  <span className="text-[11px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full ">
  {member.role}
  </span>
  </td>
  {isEditingSettings && (
  <td className="p-4 text-center">
  <button 
  onClick={() => setDeleteConfirmMemberId(member.id)}
  className="p-2 text-gray-400 hover:text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer inline-flex"
  title="Remove Member"
  >
  <Trash2 size={16} />
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

 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
 <button 
 onClick={() => setSettingsActiveNav('Description & Skills')}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Description & Skills
 </button>
 <div className="flex gap-4">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(true)}
 className="px-6 py-3 text-black hover:text-[#212b36] dark:hover:text-white font-bold transition-colors cursor-pointer"
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
 
 {/* Confirm Draft Modal */}
 {isConfirmDraftModalOpen && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-scale-up overflow-hidden">
 <div className="p-6 text-center space-y-4">
 <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-4">
 <Settings2 size={32} />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Save as Draft?</h3>
 <p className="text-sm text-black dark:text-gray-400">
 Are you sure you want to save your progress as a draft and return to the Job List? You can resume editing later.
 </p>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-3 bg-gray-50 dark:bg-gray-800/30">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(false)} 
 className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 setIsConfirmDraftModalOpen(false);
 if (typeof setToastMessage !== 'undefined') {
 setToastMessage('Saved as draft.');
 }
 setTimeout(() => {
 if (typeof navigate !== 'undefined') {
 navigate('/dashboard/jobs');
 } else {
 window.location.href = '/dashboard/jobs';
 }
 }, 1000);
 }}
 className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
 >
 Yes, Save & Close
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Add Member Modal */}
 {isAddMemberModalOpen && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-visible">
 <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800/50 rounded-t-2xl">
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Add Team Member</h3>
 <button onClick={() => setIsAddMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
 <X size={20} />
 </button>
 </div>
 <div className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-semibold text-[#212b36] dark:text-gray-300 mb-1.5">Name <span className="text-red-500">*</span></label>
 <input 
 type="text" 
 value={newMember.name}
 onChange={(e) => { setNewMember({...newMember, name: e.target.value}); setFormErrors({...formErrors, name: null}); }}
 className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-[#212b36] dark:text-white transition-all`}
 placeholder="e.g. John Doe"
 />
 {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
 </div>
 <div>
 <label className="block text-sm font-semibold text-[#212b36] dark:text-gray-300 mb-1.5">Role <span className="text-red-500">*</span></label>
 <SearchableSelect 
 options={roleOptions}
 value={newMember.role}
 onChange={(val) => { setNewMember({...newMember, role: val}); setFormErrors({...formErrors, role: null}); }}
 placeholder="Select a role..."
 searchPlaceholder="Search roles..."
 className={formErrors.role ? 'border-red-500' : ''}
 />
 {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
 </div>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-3 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
 <button 
 onClick={() => setIsAddMemberModalOpen(false)} 
 className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={handleAddMember}
 className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
 >
 Add Member
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Delete Confirmation Modal */}
 {deleteConfirmMemberId && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] p-7 rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.2)] max-w-sm w-full mx-4 border border-gray-100 dark:border-gray-800 animate-scale-up">
 <div className="flex items-center justify-center gap-3 mb-4">
 <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-[#FF5630] rounded-full flex items-center justify-center shrink-0">
 <Trash2 size={20} />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Remove Member?</h3>
 </div>
 <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8 text-center">
 Are you sure you want to remove this team member? This action cannot be undone.
 </p>
 <div className="flex gap-3">
 <button 
 onClick={() => setDeleteConfirmMemberId(null)}
 className="flex-1 py-3 text-sm font-bold text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
 >
 Cancel
 </button>
 <button 
 onClick={confirmDelete}
 className="flex-1 py-3 text-sm font-bold text-white bg-[#FF5630] hover:bg-[#FF5630]/90 rounded-xl shadow-[0_8px_16px_rgba(255,86,48,0.24)] transition-colors cursor-pointer"
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
