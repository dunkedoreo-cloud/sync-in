# Sync-in Project Guidelines & Agent Instructions

This repository defines the university events and attendance ecosystem (Sync-in) with hardware telemetry, live voting, student clearance records, and crisis protocol broadcasting.

---

## 1. Mandatory Skills & Directives

All agent actions in this workspace are strictly governed by the following core skills:

1. **`ui-ux-design-verification`** (`.agents/skills/ui-ux-design-verification`):
   - **Dual-Theme Color Harmony**: Both Light Mode and Obsidian Dark Mode must be fully cohesive. **Never** render pitch-black card containers (`bg-slate-950`, `bg-black`) inside light mode. Always pair base classes with `dark:` variants.
   - **Pure Vector Iconography**: Strictly zero Unicode emojis. Use 100% monochrome vector SVGs adhering to modern Flaticon / Heroicons standards.
   - **Multi-Device Responsiveness**: Seamless support across Phone (<768px), Tablet (768px-1024px), Laptop, and Desktop (>1024px).
   - **Clickability Integrity**: Every interactive element (`onclick`, `onchange`, `onsubmit`, `oninput`) MUST have a corresponding JavaScript implementation.

2. **`web-cybersecurity-hardening`** (`.agents/skills/web-cybersecurity-hardening`):
   - **Zero-Trust Privilege Separation**: Client views must be authenticated via role tokens or PIN verification (`SSG-2026`).
   - **Strict XSS Defense**: All dynamic DOM insertions must pass through entity sanitization (`SecurityCore.sanitizeHTML(str)`).
   - **HTTP Security Headers**: Strict Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
   - **Atomic Persistence**: Flushes to disk use the write-to-temp and atomic rename pattern (`.tmp` -> target file).

3. **`code-integrity-regression-prevention`** (`.agents/skills/code-integrity-regression-prevention`):
   - **No Naive Substring Checks**: Never use `if 'keyword' not in file` to gate code additions.
   - **Automated Verification**: Before completing any task, run `node .agents/skills/code-integrity-regression-prevention/scripts/verify_integrity.js index.html` to confirm that 100% of event handlers are defined and all script blocks compile cleanly.

---

## 2. Matt Pocock Skills Suite (38 Skills)

Located in `.agents/skills/` and globally installed:
- **Engineering**: `ask-matt`, `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `pr`, `prototype`, `research`, `retro`, `setup-matt-pocock-skills`, `tdd`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `wizard`.
- **Productivity**: `grill-me`, `grilling`, `handoff`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`.
- **Quality & Workflows**: `chief-of-staff`, `claude-handoff`, `loop-me`, `setup-ts-deep-modules`, `writing-beats`, `writing-fragments`, `writing-shape`, `git-guardrails-claude-code`, `migrate-to-shoehorn`, `scaffold-exercises`, `setup-pre-commit`.

---

## 3. Anthropic Cybersecurity Skills Suite (818 Skills)

Located in `.agents/skills/cybersecurity-skills-suite/` and installed system-wide in `~/.gemini/config/plugins/cybersecurity-skills` and `~/.gemini/config/skills/`:
- **Domain Coverage**: 34 cybersecurity domains mapped to MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, MITRE D3FEND, and MITRE F3.
- **Search Tool**:
  ```bash
  node .agents/skills/cybersecurity-skills-suite/scripts/search_skills.js "<query>"
  ```
