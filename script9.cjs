const fs = require('fs');
const content = fs.readFileSync('src/pages/CandidateProfilePage.jsx', 'utf8');
const lines = content.split('\n');

const widthLine = lines.findIndex(l => l.includes('w-[300px]'));
const tabsLine = lines.findIndex(l => l.includes("['Stage', 'Scorecards', 'Activity Feed']"));

console.log('widthLine:', widthLine + 1);
if (widthLine > -1) console.log(lines[widthLine]);

console.log('tabsLine:', tabsLine + 1);
if (tabsLine > -1) console.log(lines[tabsLine]);
