const fs = require('fs');
let code = fs.readFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/6d166f8a-4341-4396-bd89-02f0cc6b1e81/scratch/CandidateProfilePage.jsx', 'utf8');

const tabsStart = code.indexOf('<div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800/50">');
const activeTabStageStart = code.indexOf("{activeTab === 'Stage' && (");
const teamChatStart = code.indexOf("{isChatCollapsed ? (");
const activeTabScorecardsStart = code.indexOf("{activeTab === 'Scorecards' && (");
const activeTabActivityStart = code.indexOf("{activeTab === 'Activity Feed' && (");
const toastStart = code.indexOf("{toast && (");

console.log('tabsStart:', tabsStart);
console.log('activeTabStageStart:', activeTabStageStart);
console.log('teamChatStart:', teamChatStart);
console.log('activeTabScorecardsStart:', activeTabScorecardsStart);
console.log('activeTabActivityStart:', activeTabActivityStart);
console.log('toastStart:', toastStart);
