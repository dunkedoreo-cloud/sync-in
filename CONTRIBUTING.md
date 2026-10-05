# Contributing to Sync-in

Thank you for your interest in contributing to the **Sync-in** Campus Attendance & Logistics platform!

## Code Standards & Design System Guidelines
To preserve UI/UX and architectural integrity across mobile and desktop environments:

1. **Zero-Emoji Policy**:
   - Strictly **no emojis** in UI components, badges, modals, or banners.
   - Use clean, minimalist vector SVGs matching the monochrome **Flaticon** standard (`fill="currentColor"` / `stroke="currentColor"`).

2. **Typography & Styling**:
   - Upright sans-serif geometry (`Plus Jakarta Sans`) and monospace data tags (`JetBrains Mono`).
   - No italic headers; maintain high-contrast editorial restraint.

3. **Device Ergonomics**:
   - **Student Features**: Mobile-first design (single-screen focus on phones with 48px touch targets, dual-pane on tablets, tri-view on laptops).
   - **Faculty & Admin Features**: Optimized specifically for **Tablets (iPad)** and **Laptops/Desktops** with comfortable touch row heights (min 52px).

4. **Security & Cryptography**:
   - All client-side inputs must be passed through `SecurityCore.sanitizeHTML()` to prevent XSS.
   - All CSV export columns must be passed through `SecurityCore.sanitizeCSVField()` to prevent spreadsheet formula injection (CWE-1236).
   - Privileged operations must be gated by `SecurityCore.requirePermission()`.

## Pull Request Process
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Verify syntax and tests:
   ```bash
   npm test
   ```
3. Commit your changes with conventional commit messages:
   ```bash
   git commit -m "feat(scanner): add auto-focus to optical QR camera frame"
   ```
4. Push to your fork and submit a Pull Request.
