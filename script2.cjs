const fs = require('fs');

let code = fs.readFileSync('src/pages/CandidateProfilePage.jsx', 'utf8').replace(/\r\n/g, '\n');

// The layout we want to replace starts at:
const tabsBarStart = code.indexOf('<div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800/50">');
const toastStart = code.indexOf('{toast && (');

if (tabsBarStart === -1 || toastStart === -1) throw new Error('Could not find bounds');

const before = code.substring(0, tabsBarStart);
const after = code.substring(code.lastIndexOf('\n', toastStart));
const section = code.substring(tabsBarStart, code.lastIndexOf('\n', toastStart));

const tabsBarEnd = section.indexOf('</div>') + 6;
const tabsBar = section.substring(0, tabsBarEnd);

const stageStart = section.indexOf('<div className="flex items-center justify-between mb-5">');
const chatStart = section.indexOf('{isChatCollapsed ? (');
let rawStageContent = section.substring(stageStart, chatStart).trimEnd();
while (rawStageContent.endsWith('</div>')) {
  rawStageContent = rawStageContent.substring(0, rawStageContent.lastIndexOf('</div>')).trimEnd();
}

const scorecardsStart = section.indexOf("{activeTab === 'Scorecards' && (");
const chatEndSeq = '      </div>\n    )}\n';
let chatContent = section.substring(chatStart, section.indexOf(chatEndSeq, chatStart) + chatEndSeq.length);

const otherTabsContent = section.substring(scorecardsStart).trimEnd();

const appDetails = `
  <div className="w-full xl:w-[280px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col gap-4">
    <h3 className="text-[12px] font-bold text-[#212b36] dark:text-white uppercase tracking-wider mb-2">APPLICATION DETAILS</h3>
    
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Source</p>
      <p className="text-[13px] font-medium text-[#212b36] dark:text-white flex items-center gap-2">
        {candidate.agency ? <><Briefcase size={14} className="text-gray-400" /> Sourced by {candidate.agency}</> : 'Direct Application'}
      </p>
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Applied Date</p>
      <p className="text-[13px] font-medium text-[#212b36] dark:text-white flex items-center gap-2"><Clock size={14} className="text-gray-400" /> {candidate.date}</p>
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Location</p>
      <p className="text-[13px] font-medium text-[#212b36] dark:text-white flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> Bangalore, India</p>
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Contact</p>
      <div className="space-y-2 mt-2">
        <p className="text-[13px] text-[#212b36] dark:text-gray-300 flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {candidate.name.toLowerCase().replace(/\\s+/g, '.')}@example.com</p>
        <p className="text-[13px] text-[#212b36] dark:text-gray-300 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> +1 (555) 123-4567</p>
      </div>
    </div>
  </div>
`;

const tabsPanel = `
  <div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 flex flex-col overflow-hidden">
    <div className="px-5 pt-3 border-b border-gray-200 dark:border-gray-800/50">
      ${tabsBar.replace('border-b border-gray-200 dark:border-gray-800/50', '')}
    </div>
    <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-transparent min-h-[500px]">
      {activeTab === 'Stage' && (
        <div>
          ${rawStageContent}
        </div>
      )}
      ${otherTabsContent}
    </div>
  </div>
`;

const newLayout = `
  <div className="flex flex-col xl:flex-row gap-5 items-stretch min-h-[640px] relative mt-6">
    ${appDetails}
    ${tabsPanel}
    ${chatContent.trim()} 
  </div>
`;

fs.writeFileSync('src/pages/CandidateProfilePage.jsx', before + newLayout + '\n\n' + after);
console.log('Successfully restructured!');
