const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.json');
if (!fs.existsSync(indexPath)) {
  console.error('index.json not found at:', indexPath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const query = process.argv.slice(2).join(' ').toLowerCase();

if (!query) {
  console.log(`Anthropic Cybersecurity Skills Suite: ${data.total_skills} skills available across 34 domains.`);
  console.log('Usage: node search_skills.js <search query>');
  console.log('Example: node search_skills.js xss');
  console.log('Example: node search_skills.js oauth');
  console.log('Example: node search_skills.js "T1190"');
  process.exit(0);
}

console.log(`Searching for "${query}" across ${data.total_skills} cybersecurity skills...\n`);

const results = [];
for (const s of data.skills) {
  const nameMatch = s.name.toLowerCase().includes(query);
  const descMatch = s.description.toLowerCase().includes(query);
  if (nameMatch || descMatch) {
    results.push(s);
  }
}

if (results.length === 0) {
  console.log('No skills found matching: ' + query);
} else {
  console.log(`Found ${results.length} matching skills:\n`);
  results.slice(0, 20).forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.name}]`);
    console.log(`   Path: ~/.gemini/config/skills/${r.name}/SKILL.md`);
    console.log(`   ${r.description.replace(/\n/g, ' ').slice(0, 140)}...\n`);
  });
  if (results.length > 20) {
    console.log(`... and ${results.length - 20} more matching skills.`);
  }
}
