import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Video, Clock, Users, Plus, CheckCircle2 , Settings2, Edit3, Save } from 'lucide-react';

export default function JobSetupInterviewsPage() {
 const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
 const location = useLocation();
 const navigate = useNavigate();
 const jobData = location.state?.jobData;
 const [isEditing, setIsEditing] = useState(jobData?.status !== 'Published');

 


 const [interviews, setInterviews] = useState([
 { id: 1, name: 'Initial HR Screen', duration: '30 min', type: 'Video', interviewer: 'Priya Patel (Recruiter)' },
 { id: 2, name: 'Technical Assessment', duration: '60 min', type: 'Video', interviewer: 'David Chen (Interviewer)' },
 { id: 3, name: 'Hiring Manager Fit', duration: '45 min', type: 'Video', interviewer: 'Amit Sharma (Manager)' }
 ]);

 
 

 
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
 <div className="flex-1 space-y-6">
 <div>
 <h1 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">Interview Plan</h1>
 <p className="text-black text-sm">Define the interview stages, durations, and default interviewers.</p>
 </div>

 <div className="bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50">
 <div className="flex items-center justify-between mb-8">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Calendar size={20} className="text-[#FF5630]" />
 Interview Rounds
 </h2>
 <div className="flex items-center gap-4">
 {isEditing && (
 <button className="px-4 py-2 bg-[#FF5630]/10 text-[#FF5630] rounded-lg text-sm font-bold hover:bg-[#FF5630]/20 transition-colors flex items-center gap-2 cursor-pointer">
 <Plus size={16} /> Add Round
 </button>
 )}
 {isEditing ? (
 <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm">
 <Save size={14} /> Save
 </button>
 ) : (
 <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm">
 <Edit3 size={14} /> Edit
 </button>
 )}
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {interviews.map((interview, index) => (
 <div key={interview.id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161c24] hover:shadow-md hover:border-[#FF5630]/40 transition-all group relative overflow-hidden">
 <div className="absolute top-0 left-0 w-1 h-full bg-[#FF5630] opacity-0 group-hover:opacity-100 transition-opacity"></div>
 
 <div className="flex justify-between items-start mb-4">
 <h4 className="text-[15px] font-bold text-[#212b36] dark:text-white group-hover:text-[#FF5630] transition-colors">
 Round {index + 1}: {interview.name}
 </h4>
 </div>

 <div className="space-y-3">
 <div className="flex items-center gap-2 text-sm text-black dark:text-gray-400">
 <Clock size={14} className="text-[#00A76F]" />
 <span className="font-medium">{interview.duration}</span>
 </div>
 <div className="flex items-center gap-2 text-sm text-black dark:text-gray-400">
 <Video size={14} className="text-[#1890FF]" />
 <span className="font-medium">{interview.type} Call</span>
 </div>
 <div className="flex items-center gap-2 text-sm text-black dark:text-gray-400">
 <Users size={14} className="text-[#1890FF]" />
 <span className="font-medium truncate" title={interview.interviewer}>{interview.interviewer}</span>
 </div>
 </div>

 <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
 {isEditing ? (
 <button className="text-xs font-bold text-[#1890FF] hover:underline cursor-pointer">
 Attach Scorecard
 </button>
 ) : (
 <span className="text-xs font-medium text-gray-400">Scorecard Attached</span>
 )}
 <span className="text-xs font-bold px-2 py-1 bg-green-50 text-[#00A76F] rounded border border-green-200 flex items-center gap-1">
 <CheckCircle2 size={12}/> Ready
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
 <button 
 onClick={() => navigate('/dashboard/job-setup/pipeline', { state: { jobData } })}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Pipeline
 </button>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(true)}
 className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <button 
 onClick={() => navigate('/dashboard/jobs')}
 className="px-8 py-3 bg-[#00A76F] text-white rounded-xl font-bold hover:bg-[#00A76F]/90 transition-colors shadow-[0_8px_16px_rgba(0,167,111,0.24)] flex items-center gap-2 cursor-pointer"
 >
 <CheckCircle2 size={18} /> Finish and Create Job
 </button>
 </div>
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
