import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Save, Edit3, CheckCircle2 , Settings2} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
export default function JobSetupJobDescriptionPage() {
 const location = useLocation();
 const navigate = useNavigate();
 const jobData = location.state?.jobData;

 


 const defaultJd = `We are looking for a Senior AI Research Scientist to join our cutting-edge AI labs team. In this role, you will be responsible for leading research and development of novel deep learning architectures, particularly focusing on large language models and multimodal AI systems. You will work closely with a cross-functional team of researchers, engineers, and product managers to push the boundaries of what's possible with artificial intelligence.

Key Responsibilities:
- Design, develop, and train state-of-the-art machine learning models for natural language processing and computer vision tasks.
- Conduct independent research leading to publications in top-tier AI conferences (e.g., NeurIPS, ICML, ICLR).
- Collaborate with the engineering team to optimize models for efficient deployment in production environments.

Requirements:
- Ph.D. or Master's degree in Computer Science, Artificial Intelligence, Machine Learning, or a related field.
- 5+ years of industry or academic experience in developing and training deep learning models.
- Strong programming skills in Python and proficiency with frameworks like PyTorch or TensorFlow.`;

 const [jdText, setJdText] = useState(jobData?.jdText || defaultJd);
 const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
 const [isAiLoading, setIsAiLoading] = useState(false);
 const [isEditing, setIsEditing] = useState(jobData?.status !== 'Published');

 const handleAiEnhance = () => {
 setIsAiLoading(true);
 setTimeout(() => {
 setJdText(prev => prev + '\n\nPerks & Benefits:\n- Comprehensive health insurance\n- 401(k) matching\n- Flexible work hours\n- Remote-first culture');
 setIsAiLoading(false);
 }, 1500);
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
 <h1 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">Job Description</h1>
 <p className="text-black text-sm">Review and refine the job description. Use our AI assistant to improve the copy and attract better candidates.</p>
 </div>

 <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6">
 <div className="xl:col-span-2 bg-white dark:bg-[#161c24] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 flex flex-col overflow-hidden">
 <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between bg-gray-50 dark:bg-gray-800/20">
 <div className="flex items-center gap-2 text-sm font-bold text-[#212b36] dark:text-white">
 <Edit3 size={16} className="text-[#1890FF]" /> Editor
 </div>
 {isEditing ? (
 <button 
 onClick={() => setIsEditing(false)}
 className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
 >
 <Save size={14} /> Save
 </button>
 ) : (
 <button 
 onClick={() => setIsEditing(true)}
 className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
 >
 <Edit3 size={14} /> Edit
 </button>
 )}
 </div>
 <div className="react-quill-container flex-1">
 {isEditing ? (
 <ReactQuill
 theme="snow"
 value={jdText}
 onChange={(content) => setJdText(content)}
 className="h-full min-h-[400px]"
 placeholder="Enter job description..."
 />
 ) : (
 <div 
 className="p-6 prose dark:prose-invert max-w-none text-[13px] text-gray-600 dark:text-gray-300"
 dangerouslySetInnerHTML={{ __html: jdText }}
 />
 )}
 </div>
 </div>

 <div className="bg-gradient-to-b from-[#1890FF]/5 to-transparent dark:from-[#1890FF]/10 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#1890FF]/20 flex flex-col gap-4">
 <div className="flex items-center gap-2 text-[#1890FF] font-bold text-lg mb-2">
 <Sparkles size={20} /> AI Assistant
 </div>
 
 <div className="bg-white dark:bg-[#212b36] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white mb-2">Analysis Score</h4>
 <div className="flex items-center justify-between mb-2">
 <span className="text-3xl font-black text-[#00A76F]">85</span>
 <span className="text-xs font-bold text-[#00A76F] bg-[#00A76F]/10 px-2 py-1 rounded-full">Good</span>
 </div>
 <p className="text-xs text-black dark:text-gray-400">The description is clear but lacks a benefits section.</p>
 </div>

 <div className="space-y-3 mt-2">
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white">Suggestions</h4>
 
 <button 
 onClick={handleAiEnhance}
 disabled={isAiLoading || !isEditing}
 className="w-full flex items-start gap-3 p-3 bg-white dark:bg-[#212b36] border border-[#1890FF]/30 rounded-xl hover:border-[#1890FF] hover:shadow-md transition-all text-left cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <div className="mt-0.5 bg-[#1890FF]/10 p-1.5 rounded-lg text-[#1890FF]">
 {isAiLoading ? <div className="w-3.5 h-3.5 border-2 border-[#1890FF] border-t-transparent rounded-full animate-spin" /> : <Sparkles size={14} />}
 </div>
 <div>
 <p className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors">Generate Perks & Benefits</p>
 <p className="text-[11px] text-black mt-0.5">Add a compelling section about your company perks.</p>
 </div>
 </button>

 <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#212b36] border border-gray-100 dark:border-gray-700 rounded-xl opacity-70">
 <div className="mt-0.5 bg-[#00A76F]/10 p-1.5 rounded-lg text-[#00A76F]">
 <CheckCircle2 size={14} />
 </div>
 <div>
 <p className="text-sm font-bold text-[#212b36] dark:text-white line-through">Gender Neutral Language</p>
 <p className="text-[11px] text-[#00A76F] mt-0.5 font-medium">Already optimized</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
 <button 
 onClick={() => navigate('/dashboard/job-setup/hiring-team', { state: { jobData: { ...jobData, jdText } } })}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Hiring Team
 </button>
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(true)}
 className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <button 
 onClick={() => navigate('/dashboard/job-setup/ranking-rules', { state: { jobData: { ...jobData, jdText } } })}
 className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
 >Save and Continue to 'Ranking Rules'</button>
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
