const fs = require('fs');
let content = fs.readFileSync('src/pages/CandidateProfilePage.jsx', 'utf8');
let lines = content.split('\n');
let tabsBarStartLine = lines.findIndex(l => l.includes('<div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800/50">'));
let teamChatStartLine = lines.findIndex(l => l.includes('{/* TEAM CHAT SIDEBAR */}'));
console.log('tabsBarStartLine:', tabsBarStartLine);
console.log('teamChatStartLine:', teamChatStartLine);
