const fs = require('fs');

console.log('=== AUDIT 1: SERVER.JS SECURITY & API REVIEW ===');
const serverCode = fs.readFileSync('server.js', 'utf8');

// Check auth on mutations
const hasAuth = serverCode.includes('verifyToken') || serverCode.includes('authHeader') || serverCode.includes('checkRole') || serverCode.includes('x-admin-token');
console.log('1. Server-side auth check on APIs:', hasAuth ? 'PRESENT' : 'CRITICAL FLAW: MISSING - Anyone can POST/PUT/DELETE events & attendees without authentication!');

// Check rate limiting
const hasRateLimit = serverCode.includes('rateLimit') || serverCode.includes('requestCount') || serverCode.includes('RATE_LIMIT');
console.log('2. Server-side rate limiting:', hasRateLimit ? 'PRESENT' : 'FLAW: MISSING - No DoS / brute-force rate limiter on REST endpoints.');

// Check payload size limits
const hasBodyLimit = serverCode.includes('MAX_PAYLOAD') || serverCode.includes('1e6') || serverCode.includes('body.length >');
console.log('3. Server-side payload size limit:', hasBodyLimit ? 'PRESENT' : 'FLAW: MISSING - No request body size cap (vulnerable to memory exhaustion).');

// Check CORS
const hasCORS = serverCode.includes('Access-Control-Allow-Origin');
console.log('4. Server-side CORS configuration:', hasCORS ? 'PRESENT' : 'FLAW: MISSING - CORS headers not set.');

console.log('\n=== AUDIT 2: HTML & CLIENT JS MODAL FORM BINDING REVIEW ===');
const html = fs.readFileSync('index.html', 'utf8');

const inputIds = [
  'evtFormId', 'evtFormTitle', 'evtFormCategory', 'evtFormDate', 'evtFormTimeIn', 'evtFormTimeOut', 'evtFormLocation', 'evtFormCapacity', 'evtFormVoting',
  'attFormId', 'attFormName', 'attFormStudId', 'attFormCourse', 'attFormYear', 'attFormDept', 'attFormEvent', 'attFormMethod', 'attFormStatus',
  'annFormId', 'annFormTitle', 'annFormCategory', 'annFormPriority', 'annFormAudience', 'annFormMessage',
  'protoFormId', 'protoFormTitle', 'protoFormSeverity', 'protoFormDirectives'
];

let missingInputs = [];
inputIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) missingInputs.push(id);
});
console.log('5. Modal form input IDs check:', missingInputs.length === 0 ? 'ALL INPUTS FOUND (28/28)' : 'CRITICAL FLAW: MISSING INPUTS: ' + missingInputs.join(', '));

console.log('\n=== AUDIT 3: EMOJI SCAN (ZERO-EMOJI RULE) ===');
// Scan for emoji unicode ranges
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
const emojisInHtml = html.match(emojiRegex) || [];
console.log('6. Zero-Emoji Rule in index.html:', emojisInHtml.length === 0 ? 'PASS (0 emojis found)' : 'FLAW: Found ' + emojisInHtml.length + ' emojis in HTML: ' + Array.from(new Set(emojisInHtml)).join(' '));

console.log('\n=== AUDIT 4: LIGHT MODE COLOR CONFLICT AUDIT ===');
// Check for dark backgrounds without dark: prefix that might darken light mode
const darkBgRegex = /\b(?<!dark:)bg-(?:slate-900|slate-950|black|gray-900)\b/g;
const darkBgs = [];
let dbm;
while ((dbm = darkBgRegex.exec(html)) !== null) {
  // Check surrounding context
  const start = Math.max(0, dbm.index - 40);
  const end = Math.min(html.length, dbm.index + 60);
  const snippet = html.substring(start, end).replace(/\n/g, ' ');
  darkBgs.push(snippet);
}
console.log('7. Hardcoded dark backgrounds in HTML:', darkBgs.length + ' instances found.');
if (darkBgs.length > 0) {
  console.log('Sample instances:');
  darkBgs.slice(0, 5).forEach(s => console.log('  -> ' + s));
}

console.log('\n=== AUDIT 5: MODAL KEYBOARD ACCESSIBILITY (ESC KEY) ===');
const hasEscapeListener = html.includes('keyup') || (html.includes('keydown') && html.includes('Escape'));
console.log('8. Modal Escape Key handling:', hasEscapeListener ? 'PRESENT' : 'FLAW: MISSING - Pressing ESC does not close open modals.');

console.log('\n=== AUDIT 6: ATTENDEE ROSTER TABLE PAGINATION & EMPTY STATES ===');
const hasPagination = html.includes('admPagination') || html.includes('pageCount') || html.includes('currentPage');
console.log('9. Attendee Table Pagination:', hasPagination ? 'PRESENT' : 'FLAW: MISSING - 100+ attendees will cause an infinite scroll without pagination controls.');
