const fs = require('fs');
let content = fs.readFileSync('src/pages/CandidateProfilePage.jsx', 'utf8');
let lines = content.split('\n');
lines.splice(660, 4, '  );', '  })}', '  </div>', '  </div>', '  )}', "      {activeTab === 'Scorecards' && (");
fs.writeFileSync('src/pages/CandidateProfilePage.jsx', lines.join('\n'));
