const fs = require('fs');
let code = fs.readFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/6d166f8a-4341-4396-bd89-02f0cc6b1e81/scratch/CandidateProfilePage.jsx', 'utf8');

const tabsBarStart = code.indexOf('<div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800/50">');
const stageTabStart = code.indexOf("{activeTab === 'Stage' && (");
const teamChatStart = code.indexOf("{isChatCollapsed ? (");
const scorecardsTabStart = code.indexOf("{activeTab === 'Scorecards' && (");
const toastStart = code.indexOf("{toast && (");

const beforeTabs = code.substring(0, tabsBarStart);

const tabsBar = code.substring(tabsBarStart, stageTabStart).trim().replace(' border-b border-gray-200 dark:border-gray-800/50', '');

let stageContent = code.substring(stageTabStart, teamChatStart);
stageContent = stageContent.replace('<div className="flex gap-5 items-stretch min-h-[640px] relative">', '');
stageContent = stageContent.trim() + '\\n )}';

let chatContent = code.substring(teamChatStart, scorecardsTabStart);
const lastDivIdx = chatContent.lastIndexOf('</div>');
chatContent = chatContent.substring(0, lastDivIdx).trim();
const previousParenIdx = chatContent.lastIndexOf(')}');
chatContent = chatContent.substring(0, previousParenIdx + 2).trim();

const otherTabs = code.substring(scorecardsTabStart, toastStart).trim();

const afterToast = code.substring(toastStart);

const appDetails = `
<div className="w-[300px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col">
  <h3 className="text-[13px] font-bold text-[#212b36] dark:text-white mb-4 uppercase tracking-wider">Application Details</h3>
  <div className="space-y-4">
    <div>
      <p className="text-[11px] text-gray-500 mb-1">Source</p>
      <p className="text-[13px] font-bold text-[#212b36] dark:text-white">Agency (TechTalent)</p>
    </div>
    <div>
      <p className="text-[11px] text-gray-500 mb-1">Applied Date</p>
      <p className="text-[13px] font-bold text-[#212b36] dark:text-white">Aug 24, 2026</p>
    </div>
    <div>
      <p className="text-[11px] text-gray-500 mb-1">Location</p>
      <p className="text-[13px] font-bold text-[#212b36] dark:text-white">{candidate.location}</p>
    </div>
    <hr className="border-gray-100 dark:border-gray-800/50 my-2" />
    <div>
      <p className="text-[11px] text-gray-500 mb-1">Email</p>
      <p className="text-[13px] font-bold text-[#1890FF] break-all">sneha.patil@example.com</p>
    </div>
    <div>
      <p className="text-[11px] text-gray-500 mb-1">Phone</p>
      <p className="text-[13px] font-bold text-[#212b36] dark:text-white">+91 98765 43210</p>
    </div>
    <div>
      <p className="text-[11px] text-gray-500 mb-1">Time Zone</p>
      <p className="text-[13px] font-bold text-[#212b36] dark:text-white">IST (UTC +5:30)</p>
    </div>
  </div>
</div>
`;

const middlePanel = `
<div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 flex flex-col overflow-hidden">
  <div className="px-5 pt-3 border-b border-gray-200 dark:border-gray-800/50">
    ${tabsBar}
  </div>
  <div className="p-0">
    ${stageContent}
    ${otherTabs}
  </div>
</div>
`;

const newLayout = `
<div className="flex flex-col xl:flex-row gap-5 items-start">
  ${appDetails}
  ${middlePanel}
  ${chatContent}
</div>
`;

fs.writeFileSync('src/pages/CandidateProfilePage.jsx', beforeTabs + newLayout + '\\n\\n' + afterToast);
