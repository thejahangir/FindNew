import fs from 'fs';

// 1. Fix NotificationPanel.jsx
let notif = fs.readFileSync('src/components/dashboard/NotificationPanel.jsx', 'utf8');
notif = notif.replace('return createPortal() => {', 'return () => {');
if (notif.includes('return createPortal(')) {
  // ok
} else {
  notif = notif.replace(
    'return (\n  <>\n  {/* Backdrop */}',
    'return createPortal(\n  <>\n  {/* Backdrop */}'
  );
  if (!notif.includes('document.body\n  );')) {
    notif = notif.replace(
      /(\n\s*<\/>\s*\n\s*\);)/,
      '\n  </>,\n  document.body\n);'
    );
  }
}
fs.writeFileSync('src/components/dashboard/NotificationPanel.jsx', notif, 'utf8');

// 2. Fix JobDashboardPage.jsx
let dash = fs.readFileSync('src/pages/JobDashboardPage.jsx', 'utf8');

// Check isConfirmRejectModalOpen
dash = dash.replace(
  /\{isConfirmRejectModalOpen && createPortal\([\s\S]*?className="fixed inset-0 z-\[9999\][\s\S]*?<\/div>\s*<\/div>,\s*document\.body\s*\)/,
  (match) => {
    // If it has 2 </div> instead of 3 (header/body/footer inside card, card, overlay)
    // Let's count open <div> vs close </div>
    return match;
  }
);

fs.writeFileSync('src/pages/JobDashboardPage.jsx', dash, 'utf8');
