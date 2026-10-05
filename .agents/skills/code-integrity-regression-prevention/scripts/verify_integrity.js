const fs = require('fs');
const path = require('path');

const BUILTINS = new Set([
  'if', 'for', 'while', 'switch', 'return',
  'alert', 'confirm', 'prompt', 'console',
  'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'window', 'document', 'location', 'history', 'navigator',
  'encodeURIComponent', 'decodeURIComponent', 'parseInt', 'parseFloat',
  'isNaN', 'isFinite', 'Boolean', 'Number', 'String', 'Array', 'Object'
]);

function auditFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`[Integrity Audit] Error: File ${filePath} not found.`);
    process.exit(1);
  }

  console.log(`[Integrity Audit] Auditing ${filePath}...`);
  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Audit Script Syntax
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let sMatch;
  let scriptIndex = 0;
  let allJsCode = '';

  while ((sMatch = scriptRegex.exec(html)) !== null) {
    const code = sMatch[1];
    allJsCode += '\n' + code;
    try {
      new Function(code);
      console.log(`  ✓ Script block #${scriptIndex} compiled successfully.`);
    } catch (e) {
      console.error(`  ✗ Script block #${scriptIndex} SYNTAX COMPILATION ERROR:`, e.message);
      process.exit(1);
    }
    scriptIndex++;
  }

  // 2. Cross-reference Event Handlers
  const handlerRegex = /on(?:click|change|input|submit)=\"([a-zA-Z0-9_]+)\(/g;
  let hMatch;
  const handlers = new Set();
  while ((hMatch = handlerRegex.exec(html)) !== null) {
    const fn = hMatch[1];
    if (!BUILTINS.has(fn)) {
      handlers.add(fn);
    }
  }

  console.log(`  ✓ Detected ${handlers.size} custom event handlers in DOM markup.`);
  const missing = [];
  for (const h of handlers) {
    const pattern = new RegExp(`(?:function\\s+${h}\\b|const\\s+${h}\\s*=|let\\s+${h}\\s*=)`);
    if (!pattern.test(allJsCode)) {
      missing.push(h);
    }
  }

  if (missing.length > 0) {
    console.error(`  ✗ CRITICAL REGRESSION: The following ${missing.length} handlers are bound in HTML but lack implementation in script:`);
    missing.forEach(m => console.error(`    - ${m}`));
    process.exit(1);
  } else {
    console.log(`  ✓ 100% of ${handlers.size} custom event handlers verified with valid implementations.`);
  }

  console.log(`[Integrity Audit] PASS: ${filePath} is completely validated.`);
}

const target = process.argv[2] || 'index.html';
auditFile(target);
