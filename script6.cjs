const fs = require('fs');
let code = fs.readFileSync('src/pages/CandidateProfilePage.jsx', 'utf8');
let tabsStartIdx = code.indexOf('<div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800/50">');
let chatStartIdx = code.indexOf('{isChatCollapsed ? (', tabsStartIdx);
let tabsContent = code.substring(tabsStartIdx, chatStartIdx);
console.log(tabsContent.substring(tabsContent.length - 200));
