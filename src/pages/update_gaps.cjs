const fs = require('fs');
const path = require('path');

const files = [
  'JobDashboardPage.jsx',
  '../components/dashboard/settings/SettingsDescriptionSkills.jsx',
  '../components/dashboard/settings/SettingsHiringTeam.jsx',
  '../components/dashboard/settings/SettingsPipeline.jsx',
  '../components/dashboard/settings/SettingsScorecards.jsx',
  '../components/dashboard/settings/SettingsRankingRules.jsx',
  '../components/dashboard/settings/SettingsAgencies.jsx',
  '../components/dashboard/settings/SettingsNotifications.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Specific replacements for layout grids and column spacing
  content = content.replace(/gap-8/g, 'gap-5');
  content = content.replace(/space-y-8/g, 'space-y-5');
  
  // Some use gap-6 or space-y-6 for the main structure. We can replace them too to standardise to 5.
  // We should only replace the main container gap-6. Let's just blindly replace gap-6 to gap-5 if it's the main container.
  // Actually, gap-6 is fine to replace if we want consistency. Let's replace gap-6 with gap-5 and space-y-6 with space-y-5.
  content = content.replace(/gap-6/g, 'gap-5');
  content = content.replace(/space-y-6/g, 'space-y-5');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated', file);
});
