const fs = require('fs');

let code = fs.readFileSync('src/pages/CandidateProfilePage.jsx', 'utf8');
code = code.replace(/\r\n/g, '\n');

const s1 = code.indexOf('<div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800/50">');
const e1 = code.indexOf('{toast && (', s1);
if (s1 === -1 || e1 === -1) throw new Error("Could not find start/end");

const endOfSection = code.lastIndexOf('\n', e1) - 1;
const section = code.substring(s1, endOfSection);

const tabsBarEnd = section.indexOf('</div>') + 6;
const tabsBar = section.substring(0, tabsBarEnd);

const stageStart = section.indexOf("{activeTab === 'Stage' && (");
const stageInnerStart = section.indexOf('<div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5">');
const stageContentStart = stageInnerStart + '<div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5">'.length;

const isChatStr = '{isChatCollapsed ? (';
const chatStart = section.indexOf(isChatStr);

const rawStageContent = section.substring(stageContentStart, chatStart);
// Strip off the two closing </div>s which belong to the wrappers we are removing
const stageContent = rawStageContent.replace(/\s*<\/div>\s*<\/div>\s*$/, '');

const chatEndSeq = '      </div>\n    )}\n  </div>\n)}';
let chatEnd = section.indexOf(chatEndSeq, chatStart);
if (chatEnd !== -1) {
  chatEnd += chatEndSeq.length;
} else {
  // If exact match fails, use regex
  const chatMatch = section.substring(chatStart).match(/<\/div>\s*}\)\s*<\/div>\s*}\)/);
  if (chatMatch) {
    chatEnd = chatStart + chatMatch.index + chatMatch[0].length;
  }
}
const chatContent = section.substring(chatStart, chatEnd);

const otherTabsStart = section.indexOf("{activeTab === 'Scorecards' && (");
const otherTabsContent = section.substring(otherTabsStart);

const appDetails = `
  <div className="w-full lg:w-[280px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col gap-4">
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

// IMPORTANT: We need to cleanly close Activity Feed. In original file it ends with:
//   </div>
// )}
// However, earlier we saw a missing closing tag due to my script dropping it, or maybe it was there.
// If we just use otherTabsContent as it was extracted from original file, it has all its own closing tags!
// We just need to make sure we close the Tabs Content Pane and Tabs Panel correctly.
// otherTabsContent originally contained:
//   {activeTab === 'Activity Feed' && ( ... )}
// </div> // this closes flex gap-5 items-stretch min-h-[640px] relative
// )} // this closes activeTab === 'Stage' (wait, we moved activeTab === 'Stage' inside Tabs Content Pane!)
// Ah! In original file, {activeTab === 'Stage' && ( wrapped the ENTIRE layout including Team Chat.
// But Activity Feed and Scorecards were OUTSIDE {activeTab === 'Stage'}, wait... NO!
// Let's verify this.

const tabsPanel = `
  <div className="flex-1 min-w-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 flex flex-col overflow-hidden">
    <div className="px-5 pt-3 border-b border-gray-200 dark:border-gray-800/50">
      ${tabsBar.replace('border-b border-gray-200 dark:border-gray-800/50', '')}
    </div>
    <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-transparent min-h-[500px]">
      {activeTab === 'Stage' && (
        <div>
          ${stageContent.trim()}
        </div>
      )}
      ${otherTabsContent.trimEnd()}
    </div>
  </div>
`;

let finalChatBlock = chatContent;
// Trim off the ')}' that originally closed `{activeTab === 'Stage' && (`
finalChatBlock = finalChatBlock.substring(0, finalChatBlock.lastIndexOf('}') + 1);

const newLayout = `
  <div className="flex flex-col xl:flex-row gap-5 items-stretch min-h-[640px] relative mt-6">
    ${appDetails}
    ${tabsPanel}
    ${finalChatBlock} 
  </div>
\n\n`;

code = code.substring(0, s1) + newLayout + code.substring(endOfSection);
fs.writeFileSync('src/pages/CandidateProfilePage.jsx', code);
console.log('Successfully restructured!');
