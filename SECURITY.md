# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.4.x   | :white_check_mark: |
| < 2.4   | :x:                |

## Reporting a Vulnerability

We prioritize the security and privacy of campus attendees and faculty records. If you discover a security vulnerability in the Sync-in system:

1. **Do not disclose publicly**: Avoid opening public GitHub issues for critical vulnerabilities.
2. **Submit a Private Report**: Contact the SSG Security Operations Center or open a private [GitHub Security Advisory](https://github.com).
3. **Include Reproduction Steps**:
   - Clear description of the vulnerability.
   - Attack vector (e.g., OWASP A01 BOLA, A03 XSS, A07 Token Replay).
   - Proof-of-concept payload or execution steps.

## Defensive Standards
Sync-in adheres to:
- **OWASP Top 10 Web Application Security Standards**.
- **Republic Act 10173 (Philippine Data Privacy Act of 2012)**: Mandatory zero-photo policy on public attendance screens and masked hardware RFID UIDs (`04:9A:**:**:B4`).
- **Cryptographic TOTP Rolling Pass**: HMAC-SHA256 signature verification with 15-second epoch window and nonce cache to prevent screenshot replay fraud.
