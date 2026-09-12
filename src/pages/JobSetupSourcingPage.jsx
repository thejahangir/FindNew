import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Globe, Link, Briefcase, Mail, Send , Settings2} from 'lucide-react';

export default function JobSetupSourcingPage() {
 const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
 const location = useLocation();
 const navigate = useNavigate();
 const jobData = location.state?.jobData;

 


 const [channels, setChannels] = useState([
 { id: 1, name: 'Careers Page', icon: Globe, enabled: true, color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },
 { id: 2, name: 'LinkedIn', icon: Link, enabled: true, color: 'text-[#0077b5]', bg: 'bg-[#0077b5]/10' },
 { id: 3, name: 'Indeed', icon: Briefcase, enabled: false, color: 'text-[#2164f4]', bg: 'bg-[#2164f4]/10' },
 { id: 4, name: 'Internal Referral', icon: Mail, enabled: true, color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10' }
 ]);

 const toggleChannel = (id) => {
 setChannels(channels.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
 };

 
 if (!jobData) {
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
 <div className="p-6 space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
 <div className="flex-1 space-y-6 flex flex-col">
 <div>
 <h1 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">Sourcing Strategy</h1>
 <p className="text-black text-sm">Select the channels where this job will be published and configure automated sourcing campaigns.</p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">
 <Search size={20} className="text-[#1890FF]" />
 Publishing Channels
 </h2>
 
 <div className="space-y-4">
 {channels.map(channel => {
 const Icon = channel.icon;
 
 

 return (
 <div key={channel.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:shadow-sm transition-shadow">
 <div className="flex items-center gap-4">
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${channel.bg} ${channel.color}`}>
 <Icon size={20} />
 </div>
 <span className="font-bold text-[#212b36] dark:text-white">{channel.name}</span>
 </div>
 <label className="relative inline-flex items-center cursor-pointer">
 <input 
 type="checkbox" 
 className="sr-only peer" 
 checked={channel.enabled}
 onChange={() => toggleChannel(channel.id)}
 />
 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A76F]"></div>
 </label>
 </div>
 );
 })}
 </div>
 </div>

 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white mb-6 flex items-center gap-2">
 <Send size={20} className="text-[#FF5630]" />
 Automated Outreach
 </h2>
 
 <div className="p-4 bg-gray-50 dark:bg-[#212b36]/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h4 className="font-bold text-[#212b36] dark:text-white text-sm">AI Sourcing Agent</h4>
 <p className="text-xs text-black mt-1">Automatically reach out to passive candidates matching your ranking rules.</p>
 </div>
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1890FF]"></div>
 </label>
 </div>

 <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
 <label className="block text-xs font-bold text-[#212b36] dark:text-white mb-2">Outreach Message Template</label>
 <div className="p-3 bg-white dark:bg-[#161c24] rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-[#454f5b] dark:text-gray-300">
 Hi {'{candidate_name}'},<br/><br/>
 I came across your profile and was impressed by your experience with {'{top_skill}'}. We're looking for a {jobData?.title || 'great candidate'} at FindNew and I think you'd be a great fit.
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
 <button 
 onClick={() => navigate('/dashboard/job-setup/ranking-rules', { state: { jobData } })}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Ranking Rules
 </button>
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(true)}
 className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <button 
 onClick={() => navigate('/dashboard/job-setup/agencies', { state: { jobData } })}
 className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
 >Save and Continue to 'Agencies'</button>
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
 </div>
 );
}
