const fs = require('fs');

const code = fs.readFileSync('src/pages/CandidateProfilePage.jsx', 'utf8');

const tabsStartStr = '<div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800/50">';
const tabsStartIdx = code.indexOf(tabsStartStr);

const chatStartStr = '{isChatCollapsed ? (';
const chatStartIdx = code.indexOf(chatStartStr, tabsStartIdx);

const toastStartStr = '{toast && (';
const toastStartIdx = code.indexOf(toastStartStr, chatStartIdx);

console.log('tabsStartIdx:', tabsStartIdx);
console.log('chatStartIdx:', chatStartIdx);
console.log('toastStartIdx:', toastStartIdx);

if (tabsStartIdx > -1 && chatStartIdx > -1 && toastStartIdx > -1) {
  const before = code.substring(0, tabsStartIdx);
  const tabsContent = code.substring(tabsStartIdx, chatStartIdx);
  const chatContent = code.substring(chatStartIdx, toastStartIdx);
  const after = code.substring(toastStartIdx);

  const applicationDetails = `
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

  // Process Tabs Panel
  const tabsInnerStartIdx = tabsContent.indexOf('<div className="flex items-center gap-6');
  // Since tabsInnerStartIdx is 0 in tabsContent...
  // We want to wrap tabsContent in a flex-1 rounded container
  let newTabsContent = `
<div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 flex flex-col overflow-hidden">
  <div className="px-5 pt-3 border-b border-gray-200 dark:border-gray-800/50">
    <div className="flex items-center gap-6">
` + tabsContent.substring(tabsStartStr.length);
  // Add closing div for the flex-1 container at the end of tabsContent
  newTabsContent = newTabsContent.trim() + '\n</div>\n';

  // Process Chat Panel
  let newChatContent = chatContent.trim();
  
  // Wrap everything in a horizontal flex
  const fullLayout = `
<div className="flex flex-col xl:flex-row gap-5 items-start">
  ${applicationDetails}
  ${newTabsContent}
  ${newChatContent}
</div>
  `;

  fs.writeFileSync('src/pages/CandidateProfilePage.jsx', before + fullLayout + '\n\n' + after);
  console.log('Successfully rebuilt layout.');
} else {
  console.log('Failed to find indices.');
}
