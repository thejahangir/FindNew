import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Lock, ShieldAlert } from 'lucide-react';

export default function JobSetupHeader({ title, subtitle, isConfidential, onConfidentialChange }) {
 const [showModal, setShowModal] = useState(false);

 return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3.5">
 <div>
 <h1 className="text-2xl font-bold text-[#212b36] dark:text-white">{title}</h1>
 <p className="text-sm text-black dark:text-gray-400 mt-1">{subtitle}</p>
 </div>
 
 <div 
 onClick={() => {
 if (!isConfidential) {
 setShowModal(true);
 } else {
 onConfidentialChange(false);
 }
 }}
 className={`tour-step-confidentiality flex items-center gap-3 cursor-pointer select-none group/toggle px-4 py-2.5 rounded-xl border transition-all shadow-sm ${isConfidential ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30' : 'bg-white dark:bg-[#161c24] border-gray-200 dark:border-gray-800/50 hover:border-[#1890FF]/30'}`}
 >
 <div className="flex flex-col items-end">
 <span className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${isConfidential ? 'text-amber-600 dark:text-amber-500' : 'text-[#212b36] dark:text-white'}`}>
 <Lock size={14} className={isConfidential ? 'text-amber-500' : 'text-gray-400'} />
 Job Confidentiality
 </span>
 <span className="text-[11px] text-gray-400 ">{isConfidential ? 'Restricted Access' : 'Public to Hiring Team'}</span>
 </div>
 
 <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out shadow-inner ${isConfidential ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
 <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out shadow-sm ${isConfidential ? 'translate-x-6' : 'translate-x-0'}`}></div>
 </div>
 </div>

 {showModal && createPortal(
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-scale-up overflow-hidden border border-gray-100 dark:border-gray-800">
 <div className="p-6 text-center space-y-4">
 <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
 <ShieldAlert size={32} />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Mark Job as Confidential?</h3>
 <p className="text-sm text-black dark:text-gray-400 px-4">
 Are you sure you want to mark this <strong>entire job</strong> as confidential?
 <br/><br/>
 Only users with explicit permissions (like Admins or the assigned Hiring Manager) will be able to see this job and its candidates. It will be hidden from the general team dashboard.
 </p>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-3 bg-gray-50 dark:bg-gray-800/30">
 <button 
 onClick={(e) => {
 e.stopPropagation();
 setShowModal(false);
 }} 
 className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 onConfidentialChange(true);
 setShowModal(false);
 }}
 className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
 >
 <Lock size={16} /> Confirm
 </button>
 </div>
 </div>
 </div>,
 document.body
 )}
 </div>
 );
}
