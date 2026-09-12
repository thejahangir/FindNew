const fs = require('fs');
let code = fs.readFileSync('src/pages/JobsPage.jsx', 'utf8');

// 1. Remove Search button and icon, reduce search box width
code = code.replace(
  '<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />',
  ''
);
code = code.replace(
  'className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-sm focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none text-[#212b36] dark:text-white transition-all"',
  'className="w-full px-4 py-2 text-xs bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none text-[#212b36] dark:text-white transition-all"'
);
code = code.replace(
  '<button className="px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">\n  <Search size={18} />\n  </button>',
  ''
);
// Make the search div not stretch full flex-1, maybe max-w-xs
code = code.replace(
  '<div className="relative flex-1 md:w-64">',
  '<div className="relative md:w-64">'
);
// And the container xl:flex-row gap-4 -> justify-between is already there.

// 2. Remove Hiring Manager & Status Columns
code = code.replace('<th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Status</th>\n', '');
code = code.replace('<th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 ">Hiring Manager</th>\n', '');

// Status column td
code = code.replace(/<td className="px-6 py-4">\s*<span className={`px-2\.5 py-1 rounded-md text-xs font-bold \$\{getStatusColor\(job\.status\)\} flex inline-flex items-center gap-1\.5 w-fit`}>\s*<span className="w-1\.5 h-1\.5 rounded-full bg-current"><\/span>\s*\{job\.status\}\s*<\/span>\s*<p className="text-\[11px\] text-black dark:text-gray-500 mt-1\.5 font-medium">Posted: \{job\.postedDate\}<\/p>\s*<\/td>/, '');

// Hiring Manager td
code = code.replace(/<td className="px-6 py-4">\s*<div className="flex items-center gap-2">\s*<div className="w-7 h-7 rounded-full bg-\[#1890FF\]\/20 text-\[#1890FF\] flex items-center justify-center text-\[10px\] font-bold">\s*\{job\.hiringManager\.split\(' '\)\.map\(n=>n\[0\]\)\.join\(''\)\}\s*<\/div>\s*<span className="text-sm font-medium text-\[#212b36\] dark:text-gray-300">\{job\.hiringManager\}<\/span>\s*<\/div>\s*<\/td>/, '');

// Add Status to Job Details
code = code.replace(
  '<div className="flex items-center gap-2 mt-1 text-xs font-medium text-black dark:text-gray-400">\n  <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>',
  '<div className="flex items-center gap-2 mt-1 mb-1">\n  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(job.status)} inline-flex items-center gap-1`}>\n  <span className="w-1 h-1 rounded-full bg-current"></span>\n  {job.status}\n  </span>\n  <span className="text-[10px] text-gray-500 font-medium border-l border-gray-300 dark:border-gray-600 pl-2">Posted: {job.postedDate}</span>\n  </div>\n  <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-black dark:text-gray-400">\n  <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>'
);

// 3. Add View Job modal
// Add isViewJobModalOpen to state
code = code.replace(
  'const [isSendAgencyModalOpen, setIsSendAgencyModalOpen] = useState(false);',
  'const [isViewJobModalOpen, setIsViewJobModalOpen] = useState(false);\n  const [selectedJobToView, setSelectedJobToView] = useState(null);\n  const [isSendAgencyModalOpen, setIsSendAgencyModalOpen] = useState(false);'
);

// Add action menu item
code = code.replace(
  '<Send size={14} />\n  Send to Agency\n  </button>',
  '<Send size={14} />\n  Send to Agency\n  </button>\n  <button\n  onClick={(e) => {\n  e.stopPropagation();\n  setSelectedJobToView(job);\n  setIsViewJobModalOpen(true);\n  setOpenActionMenuId(null);\n  }}\n  className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"\n  >\n  <FileText size={14} />\n  View Job\n  </button>'
);

// Add View Job Modal to the bottom
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

// 4. Wrap middle section in flex-row!
code = code.replace(
  '{/* Filters & Search */}',
  '<div className="flex flex-col xl:flex-row gap-6 relative items-start">\n  <div className="flex-1 min-w-0 space-y-6">\n  {/* Filters & Search */}'
);

code = code.replace(
  '  </div>\n\n  {/* Right Sidebar */}',
  '  </div>\n  </div>\n\n  {/* Right Sidebar */}'
);

fs.writeFileSync('src/pages/JobsPage.jsx', code);
console.log('Script ran successfully');
