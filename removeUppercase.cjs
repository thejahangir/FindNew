const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace instances of uppercase class
      // It can be space separated, e.g. "uppercase tracking-wider" -> "tracking-wider"
      // or "text-xs font-bold uppercase" -> "text-xs font-bold"
      // We'll use a regex that matches `uppercase` with word boundaries inside classNames.
      // But since we can just replace 'uppercase ' with '' and ' uppercase' with '' and 'uppercase' with '', it might be easier.
      const original = content;
      content = content.replace(/\buppercase\b/g, '');
      // Clean up multiple spaces that might result
      content = content.replace(/  +/g, ' ');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Processed:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done removing uppercase class across platform.');
