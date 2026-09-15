import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
 FileText,
 Users,
 Columns,
 CheckSquare,
 Star,
 Briefcase,
 Bell,
 FileSignature,
 CheckCircle,
 ArrowLeft,
 ClipboardList,
 BookOpen
} from 'lucide-react';
import UserMenu from './UserMenu';

export default function JobSetupSidebar({ isSidebarCollapsed }) {
 const location = useLocation();
 const currentPath = location.pathname;
 const from = location.state?.from || { name: 'Job List', path: '/dashboard/jobs' };
 
 const jobSetupSubItems = [
 { name: 'Overview', path: '/dashboard/job-setup/overview', icon: FileText, completed: true },
 { name: 'Description & Skills', path: '/dashboard/job-setup/description-skills', icon: ClipboardList, completed: true },
 { name: 'Hiring Team', path: '/dashboard/job-setup/hiring-team', icon: Users, completed: true },
 { name: 'Pipeline', path: '/dashboard/job-setup/pipeline', icon: Columns, completed: true },
 { name: 'Applications', path: '/dashboard/job-setup/applications', icon: FileSignature, completed: true },
 { name: 'Scorecards', path: '/dashboard/job-setup/scorecards', icon: CheckSquare, completed: true },
 { name: 'Ranking Rules', path: '/dashboard/job-setup/ranking-rules', icon: Star, completed: true },
 { name: 'Agencies', path: '/dashboard/job-setup/agencies', icon: Briefcase, completed: false },
 { name: 'Notifications', path: '/dashboard/job-setup/notifications', icon: Bell, completed: false }
 ];

 return (
 <aside className={`fixed top-16 left-0 bottom-0 bg-white dark:bg-[#161c24] border-r border-gray-200 dark:border-gray-800/50 flex flex-col z-30 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
 <div className="flex-1 overflow-y-auto p-4 custom-scrollbar overflow-x-hidden">
 
 <div className="mb-6">
 <Link
 to={from.path}
 className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${isSidebarCollapsed ? 'justify-center' : ''}`}
 title={isSidebarCollapsed ? `Back to ${from.name}` : undefined}
 >
 <ArrowLeft size={18} className="shrink-0" />
 {!isSidebarCollapsed && <span className="truncate">Back to {from.name}</span>}
 </Link>
 </div>

 <nav className="space-y-1">
 {!isSidebarCollapsed && (
 <h3 className="px-3 text-xs font-bold text-gray-400 mb-3 mt-4">Job Setup</h3>
 )}
 
 <div className="space-y-1">
 {jobSetupSubItems.map(subItem => {
 const isSubActive = currentPath === subItem.path;
 const SubIcon = subItem.icon;
 return (
 <Link
 key={subItem.name}
 to={subItem.path}
 state={location.state}
 title={isSidebarCollapsed ? subItem.name : undefined}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
 isSubActive
 ? 'bg-[#00A76F]/10 text-[#00A76F] font-bold'
 : 'text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#212b36] dark:hover:text-white'
 } ${isSidebarCollapsed ? 'justify-center' : ''}`}
 >
 <SubIcon size={18} className={`shrink-0 ${subItem.completed && !isSubActive ? 'text-gray-400' : 'text-[#00A76F]'}`} />
 {!isSidebarCollapsed && (
 <div className="flex-1 flex items-center justify-between overflow-hidden">
 <span className={`truncate ${subItem.completed && !isSubActive ? 'text-gray-500 line-through decoration-gray-300 dark:decoration-gray-600' : ''}`}>{subItem.name}</span>
 {subItem.completed && (
 <CheckCircle size={14} className="text-[#00A76F] shrink-0 ml-2" />
 )}
 </div>
 )}
 </Link>
 );
 })}
 </div>
 </nav>
 </div>
 
 <UserMenu isSidebarCollapsed={isSidebarCollapsed} />
 </aside>
 );
}
