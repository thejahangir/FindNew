const fs = require('fs');

let code = fs.readFileSync('src/pages/JobsPage.jsx', 'utf8');

// 1. Add state variables for Chatbot and View Job Modal
code = code.replace(
  'const [currentPage, setCurrentPage] = useState(1);\n  const itemsPerPage = 5;',
  `const [currentPage, setCurrentPage] = useState(1);\n  const itemsPerPage = 5;\n\n  const [chatbotWidth, setChatbotWidth] = useState(320);\n  const [isChatbotResizing, setIsChatbotResizing] = useState(false);\n  const [isViewJobModalOpen, setIsViewJobModalOpen] = useState(false);\n  const [selectedJobToView, setSelectedJobToView] = useState(null);\n\n  useEffect(() => {\n    const handleMouseMove = (e) => {\n      if (!isChatbotResizing) return;\n      const newWidth = document.body.clientWidth - e.clientX;\n      if (newWidth >= 280 && newWidth <= 600) setChatbotWidth(newWidth);\n    };\n    const handleMouseUp = () => setIsChatbotResizing(false);\n    if (isChatbotResizing) {\n      document.addEventListener('mousemove', handleMouseMove);\n      document.addEventListener('mouseup', handleMouseUp);\n    }\n    return () => {\n      document.removeEventListener('mousemove', handleMouseMove);\n      document.removeEventListener('mouseup', handleMouseUp);\n    };\n  }, [isChatbotResizing]);`
);

// 2. Compact Search Textbox & Remove button
code = code.replace(
  '<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />',
  ''
);
code = code.replace(
  'className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-sm focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none text-[#212b36] dark:text-white transition-all"',
  'className="w-full px-4 py-2 text-xs bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none text-[#212b36] dark:text-white transition-all"'
);
code = code.replace(
  /<button className="px-3 py-2\.5 bg-gray-50 dark:bg-gray-800\/50 border border-gray-200 dark:border-gray-700\/50 rounded-lg text-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">[\s\S]*?<Search size={18} \/>[\s\S]*?<\/button>/,
  ''
);
code = code.replace(
  '<div className="relative flex-1 md:w-64">',
  '<div className="relative md:w-64">'
);

// 3. Wrap Filters&Search + TableList + Sidebar + Chatbot in flex container
code = code.replace(
  '{/* Filters & Search */}',
  '<div className="flex flex-col xl:flex-row gap-6 relative items-start">\n  {/* Left Panel - Filters & Jobs */}\n  <div className="flex-1 min-w-0 space-y-6">\n  {/* Filters & Search */}'
);

// Find where Table List ends. It is right before "Send to Agency Modal"
code = code.replace(
  '  {/* Send to Agency Modal */}',
  '  </div> {/* Close Left Panel */}\n\n' +
  `  {/* Right Sidebar */}\n` +
  `  <div className="w-full xl:w-[320px] shrink-0 space-y-6">\n` +
  `  {/* Recent Activity */}\n` +
  `  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">\n` +
  `  <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3">Recent Activity</h3>\n` +
  `  <div className="space-y-3">\n` +
  `  {[\n` +
  `  { time: '2h ago', action: 'New applicant', target: 'Frontend Engineer', icon: Users, color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },\n` +
  `  { time: '4h ago', action: 'Offer accepted', target: 'UX Researcher', icon: CheckCircle, color: 'text-[#00A76F]', bg: 'bg-[#00A76F]/10' },\n` +
  `  { time: '1d ago', action: 'Job published', target: 'DevOps Engineer', icon: Briefcase, color: 'text-[#8E33FF]', bg: 'bg-[#8E33FF]/10' },\n` +
  `  { time: '2d ago', action: 'Interview scheduled', target: 'Product Manager', icon: Calendar, color: 'text-[#FFC107]', bg: 'bg-[#FFC107]/10' },\n` +
  `  ].map((activity, i) => (\n` +
  `  <div key={i} className="flex gap-2.5">\n` +
  `  <div className={\`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 \${activity.bg}\`}>\n` +
  `  <activity.icon size={12} className={activity.color} />\n` +
  `  </div>\n` +
  `  <div>\n` +
  `  <p className="text-[13px] font-bold text-[#212b36] dark:text-white">{activity.action}</p>\n` +
  `  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{activity.target} • {activity.time}</p>\n` +
  `  </div>\n` +
  `  </div>\n` +
  `  ))}\n` +
  `  </div>\n` +
  `  <button className="w-full mt-3 py-1.5 text-xs font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors cursor-pointer">View All Activity</button>\n` +
  `  </div>\n` +
  `\n` +
  `  {/* Upcoming Interviews */}\n` +
  `  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">\n` +
  `  <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3">Upcoming Interviews</h3>\n` +
  `  <div className="space-y-2.5">\n` +
  `  {[\n` +
  `  { candidate: 'Sarah Jenkins', role: 'UX', time: 'Today, 2:00 PM', type: 'Tech', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },\n` +
  `  { candidate: 'Michael Lee', role: 'Frontend', time: 'Tmrw, 10:30 AM', type: 'Culture', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }\n` +
  `  ].map((interview, i) => (\n` +
  `  <div key={i} className="flex items-center gap-2.5 p-2 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">\n` +
  `  <img src={interview.avatar} alt={interview.candidate} className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800" />\n` +
  `  <div className="flex-1 min-w-0">\n` +
  `  <p className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">{interview.candidate}</p>\n` +
  `  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{interview.role} • {interview.type}</p>\n` +
  `  </div>\n` +
  `  </div>\n` +
  `  ))}\n` +
  `  </div>\n` +
  `  <button className="w-full mt-3 py-1.5 text-xs font-bold text-[#1890FF] hover:bg-[#1890FF]/5 rounded-lg transition-colors cursor-pointer">View Schedule</button>\n` +
  `  </div>\n` +
  `\n` +
  `  {/* Action Items */}\n` +
  `  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm p-4">\n` +
  `  <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-3 flex items-center gap-2">\n` +
  `  <AlertCircle size={16} className="text-[#FF5630]" /> Needs Attention\n` +
  `  </h3>\n` +
  `  <div className="space-y-2">\n` +
  `  {[\n` +
  `  { title: 'Review candidates', desc: '5 new applicants', action: 'Review', color: 'text-[#1890FF]', bg: 'bg-[#1890FF]/10' },\n` +
  `  { title: 'Draft expires soon', desc: 'Expires in 2 days', action: 'Publish', color: 'text-[#FFC107]', bg: 'bg-[#FFC107]/10' }\n` +
  `  ].map((item, i) => (\n` +
  `  <div key={i} className="flex flex-col gap-1.5 p-2.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">\n` +
  `  <div>\n` +
  `  <p className="text-[13px] font-bold text-[#212b36] dark:text-white">{item.title}</p>\n` +
  `  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>\n` +
  `  </div>\n` +
  `  <button className={\`self-start mt-0.5 px-2.5 py-1 rounded-md text-[10px] font-bold \${item.color} \${item.bg} hover:opacity-80 transition-opacity cursor-pointer\`}>\n` +
  `  {item.action}\n` +
  `  </button>\n` +
  `  </div>\n` +
  `  ))}\n` +
  `  </div>\n` +
  `  </div>\n` +
  `  </div> {/* Close Right Sidebar */}\n\n` +
  `  {/* AI Chatbot Placeholder */}\n` +
  `  <div className="hidden xl:block shrink-0" style={{ width: chatbotWidth }}></div>\n\n` +
  `  {/* AI Chatbot Panel */}\n` +
  `  <div \n` +
  `  style={{ width: chatbotWidth }}\n` +
  `  className={\`absolute right-0 top-0 bottom-0 z-40 hidden xl:flex flex-col bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm overflow-hidden transition-shadow \${isChatbotResizing ? 'select-none pointer-events-none' : ''}\`}\n` +
  `  >\n` +
  `  <div \n` +
  `  onMouseDown={() => setIsChatbotResizing(true)}\n` +
  `  className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#1890FF] bg-transparent transition-colors z-10"\n` +
  `  />\n` +
  `  <div className="p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/20">\n` +
  `  <div className="w-8 h-8 bg-[#1890FF]/10 text-[#1890FF] rounded-lg flex items-center justify-center shrink-0"><BrainCircuit size={18} /></div>\n` +
  `  <div><h3 className="text-sm font-bold text-[#212b36] dark:text-white">FindNew AI</h3><p className="text-[11px] text-gray-500">Always here to help</p></div>\n` +
  `  </div>\n` +
  `  <div className="flex-1 p-3 overflow-y-auto space-y-3">\n` +
  `  <div className="flex flex-col gap-1 items-start max-w-[85%]"><div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-tl-sm text-[13px] text-[#212b36] dark:text-white">Hi! I can help you analyze your hiring pipeline.</div></div>\n` +
  `  </div>\n` +
  `  <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24]">\n` +
  `  <div className="relative">\n` +
  `  <input type="text" placeholder="Ask me anything..." className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 text-[#212b36] dark:text-white"/>\n` +
  `  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg"><Send size={16} /></button>\n` +
  `  </div>\n` +
  `  </div>\n` +
  `  </div> {/* Close Chatbot Panel */}\n` +
  `  </div> {/* Close the main Flex-Row container */}\n\n` +
  '  {/* Send to Agency Modal */}'
);

// 4. Remove Hiring Manager & Status Columns
code = code.replace('<th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Status</th>\n', '');
code = code.replace('<th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Hiring Manager</th>\n', '');
code = code.replace(/<td className="px-6 py-4">\s*<span className={`px-2\.5 py-1 rounded-md text-xs font-bold \$\{getStatusColor\(job\.status\)\} flex inline-flex items-center gap-1\.5 w-fit`}>\s*<span className="w-1\.5 h-1\.5 rounded-full bg-current"><\/span>\s*\{job\.status\}\s*<\/span>\s*<p className="text-\[11px\] text-black dark:text-gray-500 mt-1\.5 font-medium">Posted: \{job\.postedDate\}<\/p>\s*<\/td>/, '');
code = code.replace(/<td className="px-6 py-4">\s*<div className="flex items-center gap-2">\s*<div className="w-7 h-7 rounded-full bg-\[#1890FF\]\/20 text-\[#1890FF\] flex items-center justify-center text-\[10px\] font-bold">\s*\{job\.hiringManager\.split\(' '\)\.map\(n=>n\[0\]\)\.join\(''\)\}\s*<\/div>\s*<span className="text-sm font-medium text-\[#212b36\] dark:text-gray-300">\{job\.hiringManager\}<\/span>\s*<\/div>\s*<\/td>/, '');

// Add Status to Job Details
code = code.replace(
  '<div className="flex items-center gap-2 mt-1 text-xs font-medium text-black dark:text-gray-400">\n  <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>',
  '<div className="flex items-center gap-2 mt-1 mb-1">\n  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(job.status)} inline-flex items-center gap-1`}>\n  <span className="w-1 h-1 rounded-full bg-current"></span>\n  {job.status}\n  </span>\n  <span className="text-[10px] text-gray-500 font-medium border-l border-gray-300 dark:border-gray-600 pl-2">Posted: {job.postedDate}</span>\n  </div>\n  <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-black dark:text-gray-400">\n  <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>'
);

// 5. Add View Job modal
code = code.replace(
  '<Send size={14} />\n  Send to Agency\n  </button>',
  '<Send size={14} />\n  Send to Agency\n  </button>\n  <button\n  onClick={(e) => {\n  e.stopPropagation();\n  setSelectedJobToView(job);\n  setIsViewJobModalOpen(true);\n  setOpenActionMenuId(null);\n  }}\n  className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"\n  >\n  <FileText size={14} />\n  View Job\n  </button>'
);

code = code.replace(
  '{/* Toast Notification */}',
  `{isViewJobModalOpen && selectedJobToView && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#212b36] dark:text-white">{selectedJobToView.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{selectedJobToView.department} • {selectedJobToView.type} • {selectedJobToView.location}</p>
          </div>
          <button onClick={() => setIsViewJobModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500">Status</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.status}</p></div>
            <div><p className="text-xs text-gray-500">Posted Date</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.postedDate}</p></div>
            <div><p className="text-xs text-gray-500">Hiring Manager</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.hiringManager}</p></div>
            <div><p className="text-xs text-gray-500">Active Candidates</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.applicants}</p></div>
          </div>
        </div>
      </div>
    </div>
  )}\n\n  {/* Toast Notification */}`
);

fs.writeFileSync('src/pages/JobsPage.jsx', code);
console.log("Success");
