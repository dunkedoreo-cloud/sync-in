---
name: web-cybersecurity-hardening
description: Master guidelines and implementation runbook for full-stack web application cybersecurity, Zero-Trust architecture, Content Security Policy (CSP), Cross-Site Scripting (XSS) prevention, CSRF defenses, Role-Based Access Control (RBAC), secure persistence, and audit logging.
---

# Web & API Cybersecurity Hardening

This skill establishes the security baseline for web applications, frontend portals, and REST backends. It enforces defensive-in-depth protections against OWASP Top 10 vulnerabilities, unauthorized privilege escalation, and data corruption.

---

## 1. Zero-Trust Architecture & Privilege Separation

In a Zero-Trust web architecture:
1. **Never Trust the Client**: Client-side UI gating is purely cosmetic. The backend server must enforce role verification, request parameter validation, and rate limits on every endpoint.
2. **Principle of Least Privilege**:
   - Public / Student views: Read-only access to published events, general bulletins, personal attendance pass generation, and vote casting.
   - Faculty views: Attendance roster inspection and course-level clearance approvals.
   - SSG Admin Command: Full CRUD over events, attendee database, crisis protocols, and hardware kiosk configs.
3. **PIN & Session Token Authentication**:
   - Sensitive role escalations require challenge authentication (e.g. `SSG-2026` PIN).
   - Once validated, issue a scoped, timed session token (`sessionToken`) stored in memory or secure session storage.
   - Track failed attempts: enforce a 5-attempt threshold followed by exponential lockout (15s, 30s, 60s).

---

## 2. Cross-Site Scripting (XSS) Prevention

### Strict Sanitization Requirement
Whenever user-submitted or database records are injected into the DOM via `.innerHTML` or template literals, they **MUST** pass through HTML entity sanitization:

```javascript
const SecurityCore = {
  sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};
```

### Golden Rules:
* **Never** interpolate raw parameters directly into HTML strings:
  - ❌ `<div>${attendee.name}</div>`
  - ✅ `<div>${SecurityCore.sanitizeHTML(attendee.name)}</div>`
* Use `.textContent` or `.innerText` whenever inserting pure text into a target DOM node.
* Prohibit inline javascript URL execution: never accept `javascript:...` links in event external URLs or kiosk redirections.

---

## 3. Defense-in-Depth HTTP Security Headers

Every production server response must attach the following protective headers:

```javascript
const SECURITY_HEADERS = {
  // Prevent clickjacking by forbidding embedding in iframes
  'X-Frame-Options': 'DENY',
  // Block MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Restrict referrer information sent on navigation
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Disable dangerous browser device features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  // Strict Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};
```

---

## 4. Atomic File Persistence & Database Defense

To eliminate database corruption or truncation from unexpected process crashes, server restarts, or concurrent writes:

### Atomic Disk Flush Pattern
```javascript
function saveDatabaseAtomic(filePath, data) {
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  const serialized = JSON.stringify(data, null, 2);
  
  // 1. Write completely to a temporary file
  fs.writeFileSync(tempPath, serialized, 'utf8');
  
  // 2. Perform atomic file system rename
  fs.renameSync(tempPath, filePath);
}
```

### Schema & Payload Validation:
* Verify that incoming JSON payloads match expected types before mutation:
  - `id`: Non-empty alphanumeric string
  - `name`, `title`: Trimmed, max length 120 chars
  - `timeIn`, `timeOut`: Verified timestamp/time format
* Drop unexpected or excessive fields to prevent prototype pollution or JSON stuffing attacks.

---

## 5. Append-Only Audit Logging

All administrative actions (Event Creation, Deletion, Clearance Modification, Crisis Directive Broadcast) must write to an immutable audit ledger:

```javascript
function logAuditEvent(action, actorRole, details) {
  const auditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    actorRole,
    details,
    clientIp: req?.socket?.remoteAddress || '127.0.0.1'
  };
  // Append to audit log
}
```

---

## 6. Automated Security Pre-Flight Audit

Before finishing any deployment or commit, run:

```bash
node -e "
const http = require('http');
http.get('http://localhost:3000/api/health', res => {
  const headers = res.headers;
  const checks = [
    'x-frame-options',
    'x-content-type-options',
    'content-security-policy',
    'referrer-policy'
  ];
  console.log('--- Checking HTTP Security Headers ---');
  let pass = true;
  checks.forEach(h => {
    if (headers[h]) {
      console.log('✓ ' + h + ': PRESENT');
    } else {
      console.warn('✗ ' + h + ': MISSING');
      pass = false;
    }
  });
  if (!pass) process.exit(1);
});
"
```
