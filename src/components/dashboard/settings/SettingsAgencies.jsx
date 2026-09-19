import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Pause, Play, Trash2, X, Building2, Calendar, Check, Search, AlertTriangle, LayoutGrid, List, Edit2 } from 'lucide-react';

const mockAgencies = [
 { id: 1, name: 'TechTalent Partners', status: 'Active', assignedDate: 'Aug 10, 2026' },
 { id: 2, name: 'Global Recruiters Inc.', status: 'Paused', assignedDate: 'Jul 22, 2026' },
 { id: 3, name: 'Elite Hiring Solutions', status: 'Active', assignedDate: 'Jun 15, 2026' },
 { id: 4, name: 'NextGen Staffing', status: 'Paused', assignedDate: 'May 05, 2026' },
 { id: 5, name: 'Vanguard Recruitment', status: 'Active', assignedDate: 'Apr 30, 2026' }
];

const availableAgencies = [
 'Apex Staffing',
 'Nexus Search Group',
 'Pinnacle Placements',
 'Quantum Recruiters'
];

export default function SettingsAgencies({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialJobData = location.state?.jobData || {};
  const [isEditingSettings, setIsEditingSettings] = useState(initialJobData?.status !== 'Published');
  const jobData = initialJobData;

 const [agencies, setAgencies] = useState(mockAgencies);
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [viewMode, setViewMode] = useState('cards');
 
 // Add Agency Modal State
 const [selectedAgency, setSelectedAgency] = useState('');
 const [searchQuery, setSearchQuery] = useState('');
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);

 // Confirmation Alert State
 const [confirmAlert, setConfirmAlert] = useState(null); // { action: 'pause' | 'resume' | 'remove', agencyId: number, agencyName: string }

 const executeConfirmAction = () => {
 if (!confirmAlert) return;
 
 if (confirmAlert.action === 'remove') {
 setAgencies(prev => prev.filter(a => a.id !== confirmAlert.agencyId));
 } else {
 setAgencies(prev => prev.map(a => 
 a.id === confirmAlert.agencyId ? { ...a, status: confirmAlert.action === 'resume' ? 'Active' : 'Paused' } : a
 ));
 }
 
 setConfirmAlert(null);
 };

 const handleAddAgency = () => {
 if (!selectedAgency) return;
 
 const newAgency = {
 id: Date.now(),
 name: selectedAgency,
 status: 'Active',
 assignedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
 };
 
 setAgencies([newAgency, ...agencies]);
 setIsAddModalOpen(false);
 setSelectedAgency('');
 setSearchQuery('');
 };

 const filteredAvailableAgencies = availableAgencies.filter(a => 
 a.toLowerCase().includes(searchQuery.toLowerCase()) && !agencies.some(existing => existing.name === a)
 );

 return (
 <div className="p-6 flex flex-col min-h-[calc(100vh-100px)] animate-fade-in font-sans">
 
 {/* Header section */}
 <div className="relative z-10 w-full mb-2">
 
 </div>

 <div className="flex justify-end gap-3 mb-6">
 <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center">
 <button onClick={() => setViewMode('cards')} className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'cards' ? 'bg-white dark:bg-[#161c24] shadow-sm text-[#1890FF]' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={16} /></button>
 <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-[#161c24] shadow-sm text-[#1890FF]' : 'text-gray-400 hover:text-gray-600'}`}><List size={16} /></button>
 </div>
  <div className="flex gap-3">
  <button
  onClick={() => setIsEditingSettings(prev => !prev)}
  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-[#1890FF] transition-colors cursor-pointer"
  title={isEditingSettings ? "Save changes" : "Edit Agencies"}
  >
  {isEditingSettings ? <Check size={20} className="text-[#00A76F]" /> : <Edit2 size={20} />}
  </button>
  {isEditingSettings && (
  <button 
  onClick={() => setIsAddModalOpen(true)}
  className="px-5 py-2.5 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
  >
  <Plus size={18} /> Add Agency
  </button>
  )}
  </div>
 </div>

 <div className="flex-1">
 {agencies.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50">
 <Building2 size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-2">No Agencies Assigned</h3>
 <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">You haven't assigned any external agencies to this job yet.</p>
  {isEditingSettings && (
  <button 
  onClick={() => setIsAddModalOpen(true)}
  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-[#212b36] dark:text-white rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
  >
  <Plus size={16} /> Assign an Agency
  </button>
  )}
 </div>
 ) : viewMode === 'cards' ? (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
 {agencies.map(agency => (
 <div key={agency.id} className="bg-white dark:bg-[#161c24] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-1">
 
 {/* Card Body */}
 <div className="p-6 flex-1">
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3 overflow-hidden">
 <div className="w-10 h-10 shrink-0 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-xl flex items-center justify-center">
 <Building2 size={20} />
 </div>
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white truncate" title={agency.name}>
 {agency.name}
 </h3>
 </div>
 <span className={`shrink-0 ml-2 px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 ${
 agency.status === 'Active' 
 ? 'bg-[#00A76F]/10 text-[#00A76F]' 
 : 'bg-[#FF5630]/10 text-[#FF5630]'
 }`}>
 <span className={`w-1.5 h-1.5 rounded-full ${agency.status === 'Active' ? 'bg-[#00A76F]' : 'bg-[#FF5630]'}`}></span>
 {agency.status}
 </span>
 </div>
 
 <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
 <Calendar size={14} />
 <span>Assigned: {agency.assignedDate}</span>
 </div>
 </div>

 {/* Card Footer */}
  {isEditingSettings && (
  <div className="bg-gray-50/50 dark:bg-[#212b36]/30 border-t border-gray-100 dark:border-gray-800/50 p-3 flex items-center justify-center gap-2">
  <button 
  onClick={() => setConfirmAlert({ 
  action: agency.status === 'Active' ? 'pause' : 'resume', 
  agencyId: agency.id, 
  agencyName: agency.name 
  })}
  className="p-2.5 text-gray-500 hover:text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer group relative"
  title={agency.status === 'Active' ? "Pause Agency" : "Resume Agency"}
  >
  {agency.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
  {/* Tooltip */}
  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[11px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
  {agency.status === 'Active' ? "Pause" : "Resume"}
  </span>
  </button>
  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700"></div>
  <button 
  onClick={() => setConfirmAlert({ action: 'remove', agencyId: agency.id, agencyName: agency.name })}
  className="p-2.5 text-gray-500 hover:text-[#FF5630] hover:bg-[#FF5630]/10 rounded-lg transition-colors cursor-pointer group relative"
  title="Remove Agency"
  >
  <Trash2 size={18} />
  {/* Tooltip */}
  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[11px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
  Remove
  </span>
  </button>
  </div>
  )}
 </div>
 ))}
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-50 dark:bg-gray-800/50">
 <th className="p-4 text-xs font-bold text-gray-500 rounded-l-xl">Agency Name</th>
  <th className="p-4 text-xs font-bold text-gray-500 ">Assigned Date</th>
  <th className="p-4 text-xs font-bold text-gray-500 ">Status</th>
  {isEditingSettings && <th className="p-4 text-center text-xs font-bold text-gray-500 rounded-r-xl">Actions</th>}
  </tr>
 </thead>
 <tbody>
 {agencies.map(agency => (
 <tr key={agency.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 shrink-0 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-xl flex items-center justify-center">
 <Building2 size={20} />
 </div>
 <span className="text-sm font-bold text-[#212b36] dark:text-white">{agency.name}</span>
 </div>
 </td>
 <td className="p-4">
 <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{agency.assignedDate}</span>
 </td>
 <td className="p-4">
 <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-md items-center gap-1.5 ${
 agency.status === 'Active' 
 ? 'bg-[#00A76F]/10 text-[#00A76F]' 
 : 'bg-[#FF5630]/10 text-[#FF5630]'
 }`}>
 <span className={`w-1.5 h-1.5 rounded-full ${agency.status === 'Active' ? 'bg-[#00A76F]' : 'bg-[#FF5630]'}`}></span>
 {agency.status}
 </span>
  </td>
  {isEditingSettings && (
  <td className="p-4">
  <div className="flex items-center justify-center gap-2">
  <button 
  onClick={() => setConfirmAlert({ 
  action: agency.status === 'Active' ? 'pause' : 'resume', 
  agencyId: agency.id, 
  agencyName: agency.name 
  })}
  className="p-2 text-gray-400 hover:text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer"
  title={agency.status === 'Active' ? "Pause Agency" : "Resume Agency"}
  >
  {agency.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
  </button>
  <button 
  onClick={() => setConfirmAlert({ action: 'remove', agencyId: agency.id, agencyName: agency.name })}
  className="p-2 text-gray-400 hover:text-[#FF5630] hover:bg-[#FF5630]/10 rounded-lg transition-colors cursor-pointer"
  title="Remove Agency"
  >
  <Trash2 size={18} />
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

 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-12">
 <button 
 onClick={() => setSettingsActiveNav('Ranking Rules')}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Ranking Rules
 </button>
 <div className="flex items-center gap-3">
 <button 
 onClick={() => navigate('/dashboard/jobs')}
 className="px-6 py-2.5 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
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
 {isAddModalOpen && createPortal(
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-scale-up overflow-hidden">
 <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-[#161c24]">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Building2 size={20} className="text-[#1890FF]" />
 Assign Agency
 </h3>
 <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
 <X size={20} />
 </button>
 </div>
 
 <div className="p-6">
 <label className="block text-xs font-bold text-black mb-2">Select Agency</label>
 
 <div className="relative">
 <div 
 className={`flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-[#161c24] border ${isDropdownOpen ? 'border-[#1890FF] ring-1 ring-[#1890FF]/20' : 'border-gray-200 dark:border-gray-700/50'} rounded-xl cursor-pointer transition-all`}
 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
 >
 <span className={`text-sm font-medium ${selectedAgency ? 'text-[#212b36] dark:text-white' : 'text-gray-400'}`}>
 {selectedAgency || 'Choose an agency...'}
 </span>
 <div className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
 <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </div>
 </div>

 {isDropdownOpen && (
 <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-[#212b36] border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden animate-fade-in">
 <div className="p-2 border-b border-gray-50 dark:border-gray-700/50 flex items-center gap-2">
 <Search size={14} className="text-gray-400 ml-2" />
 <input 
 type="text" 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search agencies..."
 className="w-full bg-transparent border-none text-sm focus:outline-none text-[#212b36] dark:text-white py-1"
 autoFocus
 />
 </div>
 <div className="max-h-48 overflow-y-auto p-1">
 {filteredAvailableAgencies.length > 0 ? (
 filteredAvailableAgencies.map(agency => (
 <div 
 key={agency}
 onClick={() => {
 setSelectedAgency(agency);
 setIsDropdownOpen(false);
 setSearchQuery('');
 }}
 className="px-3 py-2.5 text-sm font-medium text-[#212b36] dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg cursor-pointer flex items-center justify-between group"
 >
 {agency}
 <Check size={14} className="opacity-0 group-hover:opacity-100 text-[#1890FF]" />
 </div>
 ))
 ) : (
 <div className="px-3 py-4 text-center text-sm text-gray-500">No matching agencies found.</div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-[#161c24]">
 <button 
 onClick={() => setIsAddModalOpen(false)}
 className="px-4 py-2 text-sm font-bold text-[#212b36] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={handleAddAgency}
 disabled={!selectedAgency}
 className="px-6 py-2 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors cursor-pointer"
 >
 Assign Agency
 </button>
 </div>
 </div>
 </div>,
 document.body
 )}

 {/* Custom Confirmation Alert */}
 {confirmAlert && createPortal(
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-scale-up overflow-hidden">
 <div className="p-6 space-y-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-full flex shrink-0 items-center justify-center bg-[#FF5630]/10 text-[#FF5630]">
 <AlertTriangle size={24} />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">
 {confirmAlert.action === 'remove' ? 'Remove Agency' : confirmAlert.action === 'pause' ? 'Pause Agency' : 'Resume Agency'}
 </h3>
 </div>
 <p className="text-sm text-gray-500 dark:text-gray-400 pl-16">
 Are you sure you want to {confirmAlert.action} <strong>{confirmAlert.agencyName}</strong>? 
 {confirmAlert.action === 'remove' && " This action cannot be undone."}
 </p>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-3 bg-gray-50/50 dark:bg-[#212b36]/30">
 <button 
 onClick={() => setConfirmAlert(null)}
 className="flex-1 px-4 py-2.5 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={executeConfirmAction}
 className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#FF5630] hover:bg-[#FF5630]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
 >
 Confirm
 </button>
 </div>
 </div>
 </div>,
 document.body
 )}
 </div>
 );
}
