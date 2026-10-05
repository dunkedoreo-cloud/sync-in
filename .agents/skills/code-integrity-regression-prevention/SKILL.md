---
name: code-integrity-regression-prevention
description: Enforces automated pre-delivery regression testing, script syntax parsing, AST/identifier verification, and safeguards against partial code injections, broken UI clicks, and naive substring checks. Use before finishing any coding task or delivering changes.
---

# Code Integrity & Regression Prevention

This skill provides an immutable standard of verification to guarantee that no code is handed to the user in a broken, half-injected, or uncallable state.

---

## 1. The "Naive Substring Check" Anti-Pattern

### What Went Wrong Previously
Code injectors or agents sometimes use naive substring checks:
```python
# DANGEROUS ANTI-PATTERN:
if 'myFunction' not in file_content:
    inject_code(...)
```
If an HTML comment or an attribute already contains `myFunction` (e.g. `<!-- myFunction placeholder -->` or `<button onclick="myFunction()">`), the check evaluates to `True`, skipping injection of the actual function implementation!

### Mandatory Correction
1. Never check for simple presence of a token name in the whole file.
2. Check for actual declarations using regex or AST:
   - JavaScript function: `/(?:function\s+myFunction\b|const\s+myFunction\s*=)/`
   - Class: `/class\s+MyClass\b/`
   - Variable: `/(?:let|const|var)\s+myVar\b/`
3. Always verify after writing: inspect the modified file to confirm the target declaration exists inside the `<script>` tag.

---

## 2. Mandatory Verification Checkpoints

Before completing ANY task involving code edits, you **MUST** run all 4 verification gates:

### Gate 1: Inline Event Handler Extraction & Cross-Reference
Scan the file for all DOM event attributes:
- `onclick="..."`
- `onchange="..."`
- `onsubmit="..."`
- `oninput="..."`

Extract every function name called. Assert that every extracted name has a matching declaration in the `<script>` tags.

### Gate 2: JavaScript Syntax & Compilation Audit
Run `node -e` on all script blocks to ensure zero syntax errors, missing brackets, or unclosed string literals:
```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];
scripts.forEach((s, i) => {
  const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
  new Function(code);
});
console.log('PASS: All scripts compiled successfully.');
"
```

### Gate 3: Lifecycle Auto-Initialization Check
Ensure all data stores or state machines (e.g., `SyncInDB.init()`) are actually invoked:
```javascript
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => store.init());
} else {
  store.init();
}
```

### Gate 4: Live Server Endpoint Sanity Check
If a server daemon is running, execute HTTP requests against:
- `GET /api/health`
- `GET /api/<resource>`
Confirm response status `200` and expected data schema.

---

## 3. Automated One-Command Verification Script

Run this script to verify an entire single-page application:

```javascript
// scripts/verify_integrity.js
const fs = require('fs');

function auditFile(filePath) {
  console.log(`[Integrity Audit] Checking ${filePath}...`);
  const html = fs.readFileSync(filePath, 'utf8');
  
  // 1. Check syntax of all script tags
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let sMatch;
  let scriptIndex = 0;
  let allJsCode = '';
  while ((sMatch = scriptRegex.exec(html)) !== null) {
    const code = sMatch[1];
    allJsCode += '\n' + code;
    try {
      new Function(code);
      console.log(`  ✓ Script #${scriptIndex} syntax valid`);
    } catch (e) {
      console.error(`  ✗ Script #${scriptIndex} SYNTAX ERROR:`, e.message);
      process.exit(1);
    }
    scriptIndex++;
  }

  // 2. Cross-reference event handlers
  const handlerRegex = /on(?:click|change|input|submit)=\"([a-zA-Z0-9_]+)\(/g;
  let hMatch;
  const handlers = new Set();
  while ((hMatch = handlerRegex.exec(html)) !== null) {
    handlers.add(hMatch[1]);
  }

  console.log(`  ✓ Found ${handlers.size} unique event handlers in markup`);
  let missing = [];
  for (const h of handlers) {
    const hasDef = new RegExp(`(?:function\\s+${h}\\b|const\\s+${h}\\s*=|let\\s+${h}\\s*=)`).test(allJsCode);
    if (!hasDef) {
      missing.push(h);
    }
  }

  if (missing.length > 0) {
    console.error(`  ✗ CRITICAL: Missing function definitions for:`, missing.join(', '));
    process.exit(1);
  } else {
    console.log(`  ✓ All ${handlers.size} handlers have valid implementations.`);
  }

  console.log(`[Integrity Audit] PASS: ${filePath} is 100% verified.`);
}

auditFile('index.html');
```
