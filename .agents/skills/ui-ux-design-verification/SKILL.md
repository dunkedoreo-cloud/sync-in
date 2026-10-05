---
name: ui-ux-design-verification
description: Master guidance for professional UI/UX design, responsive multi-device ergonomics (phone, tablet, laptop, desktop), dual-theme color harmony (light mode and obsidian dark mode), pure monochrome vector iconography (zero emojis), and mandatory interactive clickability verification.
---

# UI/UX Design & Interactive Verification

This skill governs the standards for creating, updating, and auditing user interfaces across web applications. It guarantees that interfaces are visually cohesive, fully responsive across all device form factors, compliant with zero-emoji vector icon standards, and 100% verified for interactive clickability.

---

## 1. Dual-Theme Color Harmony (Light Mode & Obsidian Dark Mode)

### The Light Mode "Black Container" Bug (Strictly Forbidden)
* **Anti-Pattern**: Using dark-mode utilities (`bg-slate-900`, `bg-black`, `bg-slate-950`) without a `dark:` prefix inside light-mode views. This causes jarring "black box" containers in light mode.
* **Golden Rule**: Every container surface, border, and text element must declare both light and dark classes explicitly, or use CSS variables.

| UI Element | Light Mode Tokens | Dark Mode Tokens (`dark:`) |
| :--- | :--- | :--- |
| **Page Canvas** | `bg-slate-50` or `bg-zinc-50` | `dark:bg-slate-950` / `dark:bg-black` |
| **Cards / Surfaces** | `bg-white`, `bg-slate-50/80` | `dark:bg-slate-900`, `dark:bg-slate-800/60` |
| **Sub-surfaces / Inputs** | `bg-slate-100`, `bg-slate-50` | `dark:bg-slate-800`, `dark:bg-slate-900/80` |
| **Borders / Dividers** | `border-slate-200/80` | `dark:border-slate-800`, `dark:border-slate-700/80` |
| **Primary Text** | `text-slate-900` | `dark:text-white` |
| **Muted / Subtitle Text** | `text-slate-500`, `text-slate-600` | `dark:text-slate-400` |
| **Hairline Dividers** | Use directional borders (`border-b`, `border-t`). Never apply `.hairline-border` (which adds 4-sided borders) to directional divider elements. |

---

## 2. Zero-Emoji Vector Icon Standard

* **Strict Prohibition**: Never use raw Unicode emojis (e.g. 📱, 📊, ⚡, 🔔, 🚨, 📅, 🔍) in production interface markup.
* **Vector Standard**: Use pure, scalable, monochrome SVG icons with inline `stroke="currentColor"` or `fill="currentColor"`.
* **Sizing & Alignment**:
  - Micro icons: `w-3.5 h-3.5` or `w-4 h-4` with `shrink-0`.
  - Standard action icons: `w-4 h-4` or `w-5 h-5`.
  - Feature hero icons: `w-6 h-6` or `w-8 h-8` in rounded badge backdrops (`p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400`).

---

## 3. Responsive Multi-Device Ergonomics

Every screen layout must be functional and aesthetically balanced across four primary form factors:

```
+-------------------------------------------------------------------------+
|  Phone (< 768px)       Tablet (768px - 1024px)    Laptop/Desktop (> 1024px)|
|  - Bottom nav dock     - 2-column dashboards      - Full sidebar/tab suite |
|  - Full-width sheets   - Split preview panes      - Multi-column grids     |
|  - Touch targets 44px+ - Flexible data tables     - Dense keyboard controls|
+-------------------------------------------------------------------------+
```

### Guidelines by Role:
* **Student / Public Views**: Must be fully mobile-first and thumb-friendly. Single-column stacks, sticky bottom navigation bars, and swipeable cards.
* **Admin & Faculty Portals**: Optimized for tablets, laptops, and wide desktop screens. Requires high-density data tables, search/filter control bars, and modal management suites.

---

## 4. Mandatory Interactive Clickability Verification

Before delivering any UI task, you **MUST** run the following interactive integrity audit:

### Rule 1: Every Handler Must Have an Implementation
For every HTML element with:
- `onclick="..."`
- `onchange="..."`
- `onsubmit="..."`
- `oninput="..."`

You must verify that the called function name exists as a declared `function <name>(...)` or `const <name> = (...)` in the active `<script>` block.

### Rule 2: Sub-Tab & View Switching Standard
When building sub-tabs (e.g., Kiosk, Events, Attendees, Bulletins):
1. Give each tab button a distinct ID (e.g., `id="admTabEvents"`).
2. Give each view container a distinct ID (e.g., `id="admViewEvents"`).
3. The switcher function must:
   - Remove active classes from all tab buttons and add active classes to the selected button.
   - Add `.hidden` to all view panels and remove `.hidden` from the target panel.
   - Trigger the data render function for the newly activated panel (e.g., `renderAdminEventsList()`).

### Rule 3: Modal Dialog Ergonomics
1. Backdrops must use `bg-black/60 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4`.
2. Must provide an explicit close button (`X`) and a `Cancel` button.
3. Must close on `Escape` key press.
4. Must prevent body scrolling when open (`document.body.classList.add('overflow-hidden')`).

---

## 5. Automated Verification Script

Before reporting any UI change as complete, run the following automated node check:

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /on(?:click|change|input|submit)=\"([a-zA-Z0-9_]+)\(/g;
let m;
const usedFns = new Set();
while ((m = regex.exec(html)) !== null) {
  usedFns.add(m[1]);
}
console.log('Checking ' + usedFns.size + ' inline event handlers...');
let missing = 0;
for (const fn of usedFns) {
  const hasDef = html.includes('function ' + fn) || html.includes('const ' + fn + ' =') || html.includes('let ' + fn + ' =') || html.includes(fn + '(');
  if (!hasDef) {
    console.error('CRITICAL ERROR: ' + fn + ' is referenced in HTML but has no definition in script!');
    missing++;
  }
}
if (missing === 0) console.log('PASS: All ' + usedFns.size + ' handlers are defined!');
else process.exit(1);
"
```
