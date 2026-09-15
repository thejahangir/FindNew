const fs = require('fs');
let code = fs.readFileSync('src/pages/CandidateProfilePage.jsx', 'utf8');

// 1. Increase Application Details width
code = code.replace(
  '<div className="w-[300px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col">',
  '<div className="w-[380px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col">'
);

// 2. Add Overview to tabs array
code = code.replace(
  "const tabs = ['Stage', 'Scorecards', 'Activity Feed'];",
  "const tabs = ['Overview', 'Stage', 'Scorecards', 'Activity Feed'];"
);

// 3. Add Overview tab content right before Stage tab content
const overviewContent = `
    {activeTab === 'Overview' && (
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-8 text-center">
        <h2 className="text-base font-bold text-[#212b36] dark:text-white">Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Candidate overview information will live here.</p>
      </div>
    )}
`;

code = code.replace(
  "{activeTab === 'Stage' && (",
  overviewContent.trim() + "\\n    {activeTab === 'Stage' && ("
);

fs.writeFileSync('src/pages/CandidateProfilePage.jsx', code);
