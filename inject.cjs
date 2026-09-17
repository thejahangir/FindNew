const fs = require('fs');
let code = fs.readFileSync('src/pages/JobsPage.jsx', 'utf8');

const replacement = `
  {/* Right Sidebar */}
  <div className="w-full xl:w-[320px] shrink-0 space-y-6 ml-auto">
  {/* Recent Activity */}
  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">
  <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3">Recent Activity</h3>
  <div className="space-y-3">
  {[
  { time: '2h ago', action: 'New applicant', target: 'Frontend Engineer', icon: Users, color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },
  { time: '4h ago', action: 'Offer accepted', target: 'UX Researcher', icon: CheckCircle, color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10' },
  { time: '1d ago', action: 'Job published', target: 'DevOps Engineer', icon: Briefcase, color: 'text-[#8E33FF]', bg: 'bg-[#8E33FF]/10' },
  { time: '2d ago', action: 'Interview scheduled', target: 'Product Manager', icon: Calendar, color: 'text-[#FFC107]', bg: 'bg-[#FFC107]/10' },
  ].map((activity, i) => (
  <div key={i} className="flex gap-2.5">
  <div className={\`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 \${activity.bg}\`}>
  <activity.icon size={12} className={activity.color} />
  </div>
  <div>
  <p className="text-[13px] font-bold text-[#212b36] dark:text-white">
  {activity.action}
  </p>
  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
  {activity.target} • {activity.time}
  </p>
  </div>
  </div>
  ))}
  </div>
  <button className="w-full mt-3 py-1.5 text-xs font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors cursor-pointer">
  View All Activity
  </button>
  </div>

  {/* Upcoming Interviews */}
  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">
  <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3">Upcoming Interviews</h3>
  <div className="space-y-2.5">
  {[
  { candidate: 'Sarah Jenkins', role: 'UX Researcher', time: 'Today, 2:00 PM', type: 'Technical', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { candidate: 'Michael Lee', role: 'Frontend Engineer', time: 'Tomorrow, 10:30 AM', type: 'Culture Fit', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { candidate: 'Emily Chen', role: 'Product Manager', time: 'Wed, 1:00 PM', type: 'Final Round', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' }
  ].map((interview, i) => (
  <div key={i} className="flex items-center gap-2.5 p-2 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
  <img src={interview.avatar} alt={interview.candidate} className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800" />
  <div className="flex-1 min-w-0">
  <p className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">{interview.candidate}</p>
  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{interview.role} • {interview.type}</p>
  </div>
  <div className="text-right shrink-0">
  <p className="text-[10px] font-bold text-[#212b36] dark:text-white">{interview.time.split(',')[0]}</p>
  <p className="text-[9px] text-gray-500">{interview.time.split(',')[1]}</p>
  </div>
  </div>
  ))}
  </div>
  <button className="w-full mt-3 py-1.5 text-xs font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors cursor-pointer">
  View Schedule
  </button>
  </div>

  {/* Action Items */}
  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">
  <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3 flex items-center gap-2">
  <AlertCircle size={16} className="text-[#FF5630]" /> Needs Attention
  </h3>
  <div className="space-y-2">
  {[
  { title: 'Review candidates', desc: '5 new applicants for AI Scientist', action: 'Review', color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },
  { title: 'Offer approval', desc: 'Pending for QA Engineer', action: 'Approve', color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10' },
  { title: 'Draft expires soon', desc: 'HR draft expires in 2 days', action: 'Publish', color: 'text-[#FFC107]', bg: 'bg-[#FFC107]/10' },
  ].map((item, i) => (
  <div key={i} className="flex flex-col gap-1.5 p-2.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
  <div>
  <p className="text-[13px] font-bold text-[#212b36] dark:text-white">{item.title}</p>
  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
  </div>
  <button className={\`self-start mt-0.5 px-2.5 py-1 rounded-md text-[10px] font-bold \${item.color} \${item.bg} hover:opacity-80 transition-opacity cursor-pointer\`}>
  {item.action}
  </button>
  </div>
  ))}
  </div>
  </div>
  </div>
  
  {/* AI Chatbot Panel Placeholder to maintain flex layout width */}
  <div className="hidden xl:block shrink-0" style={{ width: 320 }}></div>

  {/* AI Chatbot Panel (Absolute for overlapping on resize) */}
  <div 
  style={{ width: chatbotWidth }}
  className={\`absolute right-0 top-0 bottom-0 z-40 hidden xl:flex flex-col bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm overflow-hidden transition-shadow \${isChatbotResizing ? 'select-none pointer-events-none' : ''}\`}
  >
  {/* Resizer Handle */}
  <div 
  onMouseDown={() => setIsChatbotResizing(true)}
  className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#1890FF] bg-transparent transition-colors z-10"
  />
  
  <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/20">
  <div className="w-8 h-8 bg-[#1890FF]/10 text-[#1890FF] rounded-lg flex items-center justify-center shrink-0">
  <BrainCircuit size={18} />
  </div>
  <div>
  <h3 className="text-sm font-bold text-[#212b36] dark:text-white">FindNeo AI</h3>
  <p className="text-[11px] text-gray-500">Always here to help</p>
  </div>
  </div>

  <div className="flex-1 p-3 overflow-y-auto space-y-3">
  {/* System message 1 */}
  <div className="flex flex-col gap-1 items-start max-w-[85%]">
  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white leading-relaxed">
  Hi! I can help you analyze your hiring pipeline, find jobs, or summarize candidates.
  </div>
  </div>

  {/* User message 1 */}
  <div className="flex flex-col gap-1 items-end self-end max-w-[85%] ml-auto">
  <div className="bg-[#1890FF] text-white px-3 py-2 rounded-2xl rounded-tr-sm text-[13px] shadow-sm">
  Which jobs need attention today?
  </div>
  </div>

  {/* System message 2 */}
  <div className="flex flex-col gap-1 items-start max-w-[85%]">
  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white leading-relaxed">
  <p className="mb-1.5">Three areas need attention:</p>
  <ul className="list-disc pl-4 space-y-0.5">
  <li>Product Design Lead — still in Draft</li>
  <li>Backend Developer — no candidates yet</li>
  <li>Data Engineer — 12 active candidates</li>
  </ul>
  </div>
  </div>

  {/* User message 2 */}
  <div className="flex flex-col gap-1 items-end self-end max-w-[85%] ml-auto">
  <div className="bg-[#1890FF] text-white px-3 py-2 rounded-2xl rounded-tr-sm text-[13px] shadow-sm">
  Show me the highest-priority job.
  </div>
  </div>

  {/* System message 3 */}
  <div className="flex flex-col gap-1 items-start max-w-[85%]">
  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white space-y-2 leading-relaxed">
  <p>Product Design Lead is the highest priority. It is a Draft requisition with 0 active candidates.</p>
  <p>I can open the job details next.</p>
  </div>
  </div>

  {/* Suggested Questions */}
  <div className="mt-4 bg-gray-50/80 dark:bg-gray-800/30 p-3 rounded-xl">
  <h4 className="text-[10px] font-bold text-gray-500 mb-2.5 uppercase tracking-wider">Suggested questions</h4>
  <div className="space-y-1.5">
  {[
  "Who are my top candidates?",
  "Which jobs are overdue?",
  "Summarize this week"
  ].map((q, i) => (
  <button key={i} className="w-full text-left px-3 py-1.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 rounded-full text-xs font-medium text-[#212b36] dark:text-gray-300 hover:border-[#1890FF] hover:text-[#1890FF] transition-all cursor-pointer shadow-sm">
  {q}
  </button>
  ))}
  </div>
  </div>
  </div>

  <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24]">
  <div className="relative">
  <input 
  type="text" 
  placeholder="Ask me anything..." 
  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] text-[#212b36] dark:text-white"
  />
  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer">
  <Send size={16} />
  </button>
  </div>
  </div>
  </div>
`;

let lines = code.split('\n');
// We need to insert after line 417
// Arrays are 0-indexed, so line 417 is index 416
// line 417 is `  </div>` which closes the Table Container.
// line 418 is `  </div>` which closes the Row Container.
// We want to insert the replacement BETWEEN line 417 and line 418.
lines.splice(417, 0, replacement);

fs.writeFileSync('src/pages/JobsPage.jsx', lines.join('\n'));
console.log("Injected layout at line 418!");
