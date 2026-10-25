import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, Settings, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

const mockApprovals = [
 { id: 1, type: 'Job Offer', subject: 'Senior AI Research Scientist', candidate: 'Ananya Sharma', date: 'Today, 10:30 AM', status: 'Pending' },
 { id: 2, type: 'New Requisition', subject: 'Frontend Engineer', department: 'Engineering', date: 'Yesterday, 2:15 PM', status: 'Pending' },
];

export default function ApprovalsPage() {
 const navigate = useNavigate();

 return (
 <div className="p-6 space-y-5 relative animate-fade-in font-sans">
      {/* TOP BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1">
        <Link to="/dashboard" className="hover:text-[#1890FF] transition-colors cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={14} className="text-gray-400 shrink-0" />
        <span className="text-[#212b36] dark:text-white">Approvals</span>
      </nav>

      {/* APPROVALS HEADER CARD */}
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/70 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#212b36] dark:text-white tracking-tight leading-none">
                Approvals
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFC107]/15 text-[#b78103] dark:text-[#FFC107]">
                {mockApprovals.length} Pending
              </span>
            </div>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              Review and approve pending requisitions, offers, and hiring requests.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button 
              onClick={() => navigate('/dashboard/agencies', { state: { jobData: { title: 'New Requisition', status: 'Draft' }, tab: 'Job Setup' } })}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#212b36] dark:bg-white dark:text-[#212b36] rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-sm cursor-pointer h-[38px]"
              title="Create a new job"
            >
              <Settings size={15} /> Create Job
            </button>
          </div>
        </div>
      </div>

 <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 overflow-hidden">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800/50">
 <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Type</th>
 <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Subject</th>
 <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Date</th>
 <th className="px-6 py-4 text-right text-xs font-bold text-black dark:text-gray-400 ">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
 {mockApprovals.map(approval => (
 <tr key={approval.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-[#FFC107]/10 flex items-center justify-center text-[#FFC107] shrink-0">
 <CheckSquare size={20} />
 </div>
 <span className="text-sm font-bold text-[#212b36] dark:text-white">{approval.type}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="text-sm font-medium text-[#212b36] dark:text-gray-300">{approval.subject}</span>
 {approval.candidate && <p className="text-xs text-gray-500 mt-1">Candidate: {approval.candidate}</p>}
 </td>
 <td className="px-6 py-4 text-sm font-medium text-black dark:text-gray-400">
 {approval.date}
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-[#00A76F] hover:bg-[#00A76F]/10 rounded-lg transition-colors cursor-pointer" title="Approve">
 <CheckCircle size={18} />
 </button>
 <button className="p-2 text-[#FF5630] hover:bg-[#FF5630]/10 rounded-lg transition-colors cursor-pointer" title="Reject">
 <XCircle size={18} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
}
