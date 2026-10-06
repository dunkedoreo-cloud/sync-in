const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function checkFn(name) {
  const idx = html.indexOf('function ' + name);
  if (idx === -1) { console.log(name, 'NOT FOUND'); return; }
  const code = html.slice(idx, idx + 1200);
  const regex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
  let match;
  const ids = [];
  while ((match = regex.exec(code)) !== null) {
    ids.push(match[1]);
  }
  console.log(`=== ${name} IDs (${ids.length}) ===`);
  ids.forEach(id => {
    const hasDef = html.includes(`id="${id}"`);
    console.log(`  ${id}: ${hasDef ? 'OK' : 'MISSING'}`);
  });
}

checkFn('openEditAttendeeModal');
checkFn('openEditAnnouncementModal');
checkFn('openEditProtocolModal');
checkFn('saveEventForm');
checkFn('saveAttendeeForm');
checkFn('saveAnnouncementForm');
checkFn('saveProtocolForm');
