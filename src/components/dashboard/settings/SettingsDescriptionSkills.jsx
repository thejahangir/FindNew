import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, X, Settings2, Minus, Trash2, CheckCircle2, Circle, Code2, FileText, PlusCircle, Edit2, Save } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function SettingsDescriptionSkills({ setSettingsActiveNav }) {
 const navigate = useNavigate();
 const location = useLocation();
 const initialJobData = location.state?.jobData || {};
 const [isEditingSettings, setIsEditingSettings] = useState(initialJobData?.status !== 'Published');
 const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);

 const [jobData, setJobData] = useState({
 jdText: initialJobData?.jdText || '',
 skills: initialJobData?.skills && initialJobData.skills.length > 0 
 ? initialJobData.skills.map(s => ({ ...s, isExpanded: false, source: 'jd' }))
 : [
 { name: 'React.js', years: '3', required: true, isExpanded: false, source: 'jd' },
 { name: 'Python', years: '2', required: true, isExpanded: false, source: 'jd' },
 { name: 'UI/UX Design', years: '1', required: false, isExpanded: false, source: 'jd' },
 { name: '', years: '1', required: true, isExpanded: true, source: 'manual' }
 ],
 isConfidential: initialJobData?.isConfidential || false
 });

 const handleInputChange = (field, value) => {
 setJobData(prev => ({ ...prev, [field]: value }));
 };

 const handleSkillChange = (index, field, value) => {
 const newSkills = [...jobData.skills];
 newSkills[index] = { ...newSkills[index], [field]: value };
 handleInputChange('skills', newSkills);
 };

 const addSkill = () => {
 handleInputChange('skills', [...jobData.skills, { name: '', years: '1', required: true, isExpanded: true, source: 'manual' }]);
 };

 const removeSkill = (index) => {
 let newSkills = jobData.skills.filter((_, i) => i !== index);
 if (!newSkills.some(s => s.isExpanded && !s.name.trim())) {
 newSkills.push({ name: '', years: '1', required: true, isExpanded: true, source: 'manual' });
 }
 handleInputChange('skills', newSkills);
 };

 // Merge the new data into the existing jobData object to pass to the next step
 const updatedJobData = { ...initialJobData, ...jobData };

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
 <div className="p-6 flex flex-col min-h-[calc(100vh-100px)] animate-fade-in">
 

 <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
 {/* Description Panel */}
 <div className="col-span-1 lg:col-span-6 xl:col-span-7 bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm h-full flex flex-col relative">
 {initialJobData?.status === 'Published' && (
 <button 
 onClick={() => setIsEditingSettings(!isEditingSettings)}
 className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer z-10 bg-gray-100 hover:bg-gray-200 text-gray-700"
 >
 {isEditingSettings ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
 </button>
 )}
 <div className={`flex flex-col flex-1 ${!isEditingSettings ? 'opacity-60 pointer-events-none' : ''}`}>
 <label className="block text-xs font-bold text-black mb-2">Description</label>
 <div className="react-quill-container flex-1 mt-2">
 <ReactQuill 
 theme="snow"
 value={jobData.jdText}
 onChange={(content) => handleInputChange('jdText', content)}
 className="h-full min-h-[300px] lg:min-h-[450px]"
 placeholder="Enter the full job description here..."
 readOnly={!isEditingSettings}
 />
 </div>
 </div>
 </div>

 {/* Skills Panel */}
 <div className="col-span-1 lg:col-span-6 xl:col-span-5 bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm flex flex-col h-fit relative">
 {initialJobData?.status === 'Published' && (
 <button 
 onClick={() => setIsEditingSettings(!isEditingSettings)}
 className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer z-20 bg-gray-100 hover:bg-gray-200 text-gray-700"
 >
 {isEditingSettings ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
 </button>
 )}
 <div className={`flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-[#161c24] z-10 ${!isEditingSettings ? 'opacity-60 pointer-events-none' : ''}`}>
 <label className="block text-xs font-bold text-black">Required Skills</label>
 <button 
 onClick={addSkill}
 className="px-3 py-1.5 text-xs font-bold text-[#1890FF] bg-[#1890FF]/10 rounded-lg hover:bg-[#1890FF]/20 transition-colors flex items-center gap-1 cursor-pointer mr-20"
 >
 <Plus size={14} /> Add
 </button>
 </div>
 <div className={`flex flex-col mb-6 ${!isEditingSettings ? 'opacity-60 pointer-events-none' : ''}`}>
 {jobData.skills.some(s => s.source === 'jd' && !s.isExpanded) && (
 <div className="pb-4">
 <div className="flex items-center gap-2 mb-3">
 <div className="w-6 h-6 rounded bg-[#1890FF]/10 flex items-center justify-center">
 <FileText size={14} className="text-[#1890FF]" />
 </div>
 <span className="text-[11px] text-[#212b36] dark:text-gray-300 font-bold">Extracted from Job Description</span>
 </div>
 <div className="flex flex-wrap gap-2">
 {jobData.skills.map((skill, index) => {
 if (skill.source !== 'jd' || skill.isExpanded) return null;
 return (
 <button
 key={index}
 onClick={() => handleSkillChange(index, 'isExpanded', true)}
 className="px-2 py-1 text-xs font-semibold text-[#212b36] dark:text-white bg-[#1890FF]/5 dark:bg-[#1890FF]/10 border border-[#1890FF]/20 dark:border-[#1890FF]/30 rounded-md hover:border-[#1890FF] hover:bg-[#1890FF]/10 transition-all cursor-pointer flex items-center gap-1.5 group"
 >
 <span>{skill.name || 'Unnamed Skill'}</span>
 <Settings2 size={12} className="text-[#1890FF] opacity-70 group-hover:opacity-100" />
 </button>
 );
 })}
 </div>
 </div>
 )}

 {jobData.skills.some(s => s.source === 'jd' && !s.isExpanded) && 
 jobData.skills.some(s => s.source === 'manual' && !s.isExpanded) && (
 <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-1" />
 )}

 {jobData.skills.some(s => s.source === 'manual' && !s.isExpanded) && (
 <div className="pt-4 pb-2">
 <div className="flex items-center gap-2 mb-3">
 <div className="w-6 h-6 rounded bg-[#36B37E]/10 flex items-center justify-center">
 <PlusCircle size={14} className="text-[#36B37E]" />
 </div>
 <span className="text-[11px] text-[#212b36] dark:text-gray-300 font-bold">Added Skills</span>
 </div>
 <div className="flex flex-wrap gap-2">
 {jobData.skills.map((skill, index) => {
 if (skill.source !== 'manual' || skill.isExpanded) return null;
 return (
 <button
 key={index}
 onClick={() => handleSkillChange(index, 'isExpanded', true)}
 className="px-2 py-1 text-xs font-semibold text-[#212b36] dark:text-white bg-[#36B37E]/10 border border-[#36B37E]/20 rounded-md hover:border-[#36B37E] hover:bg-[#36B37E]/20 transition-all cursor-pointer flex items-center gap-1.5 group"
 >
 <span>{skill.name || 'Unnamed Skill'}</span>
 <Settings2 size={12} className="text-[#36B37E] opacity-70 group-hover:opacity-100" />
 </button>
 );
 })}
 </div>
 </div>
 )}
 </div>

 <div className={`space-y-3 ${!isEditingSettings ? 'opacity-60 pointer-events-none' : ''}`}>
 {jobData.skills.map((skill, index) => {
 if (!skill.isExpanded) return null;
 
 return (
 <div key={index} className={`flex flex-col bg-white dark:bg-[#161c24] rounded-xl shadow-sm border transition-all duration-200 group relative ${skill.required ? 'border-[#1890FF]/40 shadow-[0_4px_12px_rgba(24,144,255,0.08)]' : 'border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'}`}>
 
 <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors ${skill.required ? 'bg-[#1890FF]' : 'bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600'}`} />
 
 <div className="p-2 pl-3 flex flex-col gap-2">
 <div className="flex items-center justify-between">
 <div className="w-full max-w-[280px] relative">
 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
 <Code2 size={16} />
 </div>
 <input 
 type="text" 
 value={skill.name}
 onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
 placeholder="Enter the skill"
 className="w-full pl-9 pr-3 py-1 bg-gray-50/50 dark:bg-gray-800/30 border border-transparent focus:border-[#1890FF] focus:bg-white dark:focus:bg-[#161c24] rounded-md text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1890FF]/20 transition-all text-[#212b36] dark:text-white placeholder-gray-400 placeholder:text-xs placeholder:font-normal"
 autoFocus={skill.source === 'manual' && !skill.name}
 />
 </div>
 <button 
 onClick={() => removeSkill(index)}
 className="p-1.5 text-[#FF5630] bg-red-50 dark:bg-red-900/20 rounded-md transition-colors cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40"
 title="Remove skill"
 >
 <Trash2 size={14} />
 </button>
 </div>
 
 <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60 pt-2">
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2">
 <span className="text-[11px] font-extrabold text-gray-600 dark:text-gray-400">Exp</span>
 <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-md p-0.5">
 <button 
 onClick={() => handleSkillChange(index, 'years', Math.max(0, Number(skill.years) - 1).toString())}
 className="w-6 h-6 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm text-black dark:text-gray-400 transition-all cursor-pointer"
 >
 <Minus size={12} />
 </button>
 <div className="w-8 text-center flex flex-col justify-center">
 <span className="text-xs font-bold text-[#212b36] dark:text-white">{skill.years}</span>
 </div>
 <button 
 onClick={() => handleSkillChange(index, 'years', (Number(skill.years) + 1).toString())}
 className="w-6 h-6 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm text-black dark:text-gray-400 transition-all cursor-pointer"
 >
 <Plus size={12} />
 </button>
 </div>
 <span className="text-[11px] font-bold text-gray-500">Years</span>
 </div>
 
 <div className="flex bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-md p-0.5">
 <button 
 onClick={() => handleSkillChange(index, 'required', true)}
 className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${skill.required ? 'bg-white dark:bg-[#161c24] text-[#1890FF] shadow-sm' : 'text-black dark:text-gray-400 hover:text-[#212b36] dark:hover:text-gray-200'}`}
 >
 {skill.required ? <CheckCircle2 size={12} className="text-[#1890FF] fill-[#1890FF]/10" /> : <Circle size={12} />}
 Must Have
 </button>
 <button 
 onClick={() => handleSkillChange(index, 'required', false)}
 className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${!skill.required ? 'bg-white dark:bg-[#161c24] text-[#8e33ff] shadow-sm' : 'text-black dark:text-gray-400 hover:text-[#212b36] dark:hover:text-gray-200'}`}
 >
 {!skill.required ? <CheckCircle2 size={12} className="text-[#8e33ff] fill-[#8e33ff]/10" /> : <Circle size={12} />}
 Nice to Have
 </button>
 </div>
 </div>
 
 <button 
 onClick={() => {
 let newSkills = [...jobData.skills];
 newSkills[index] = { ...newSkills[index], isExpanded: false };
 if (!newSkills.some(s => s.isExpanded && !s.name.trim())) {
 newSkills.push({ name: '', years: '1', required: true, isExpanded: true, source: 'manual' });
 }
 handleInputChange('skills', newSkills);
 }}
 disabled={!skill.name.trim()}
 className="px-4 py-1.5 bg-[#1890FF] text-white text-xs font-bold rounded-lg shadow-[0_4px_12px_rgba(24,144,255,0.24)] hover:bg-[#1890FF]/90 hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
 >
 <CheckCircle2 size={14} /> {skill.source === 'manual' && !skill.name ? 'Add' : 'Save'}
 </button>
 </div>
 </div>
 </div>
 )
 })}
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
 <button 
 onClick={() => setSettingsActiveNav('Overview')}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Overview
 </button>
 <div className="flex gap-4">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(true)}
 className="px-6 py-3 text-black hover:text-[#212b36] dark:hover:text-white font-bold transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <button 
 onClick={() => setSettingsActiveNav('Hiring Team')}
 className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
 >
 Save and Continue to 'Hiring Team'
 </button>
 </div>
 </div>
 
 {/* Draft Confirm Modal */}
 {isConfirmDraftModalOpen && (
 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-scale-up overflow-hidden">
 <div className="p-6 text-center space-y-4">
 <div className="w-16 h-16 bg-[#1890FF]/10 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-2">
 <Settings2 size={32} />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Save as Draft?</h3>
 <p className="text-sm text-black dark:text-gray-400">
 You can return and finish setting up this job pipeline later. Your current progress will be saved.
 </p>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(false)} 
 className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 setIsConfirmDraftModalOpen(false);
 navigate('/dashboard/jobs');
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
