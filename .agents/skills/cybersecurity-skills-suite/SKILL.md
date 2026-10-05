---
name: cybersecurity-skills-suite
description: The complete Anthropic Cybersecurity Skills library comprising 818 production-grade skills across 34 security domains (Web & API Security, Penetration Testing, Incident Response, Cloud Security, Threat Intelligence, Identity/Access Management, and Compliance), mapped across MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, MITRE D3FEND, and MITRE F3.
---

# Anthropic Cybersecurity Skills Suite (818 Skills)

This skill suite provides direct access to 818 structured, production-grade cybersecurity skills spanning 34 security domains.

---

## 1. Quick Navigation & Skill Discovery

To search any technique, CVE, attack vector, or MITRE technique across all 818 skills, run:

```bash
node .agents/skills/cybersecurity-skills-suite/scripts/search_skills.js "<query>"
```

* Examples:
  - `node .agents/skills/cybersecurity-skills-suite/scripts/search_skills.js "xss"` (Reflected, Stored, DOM-based, CSP bypasses)
  - `node .agents/skills/cybersecurity-skills-suite/scripts/search_skills.js "sql injection"` (Blind SQLi, WAF evasion, prepared statements)
  - `node .agents/skills/cybersecurity-skills-suite/scripts/search_skills.js "jwt"` (Algorithm confusion, key cracking, signature bypass)
  - `node .agents/skills/cybersecurity-skills-suite/scripts/search_skills.js "api gateway"` (BOLA, rate limiting, access log analysis)
  - `node .agents/skills/cybersecurity-skills-suite/scripts/search_skills.js "oauth"` (Token theft, device code phishing, consent abuse)

---

## 2. Core Security Domains (34 Domains)

1. **Web & API Security**:
   - `testing-for-xss-vulnerabilities`
   - `exploiting-api-injection-vulnerabilities`
   - `exploiting-jwt-algorithm-confusion-attack`
   - `detecting-broken-object-property-level-authorization`
   - `implementing-api-schema-validation-security`
   - `performing-content-security-policy-bypass`
   - `exploiting-mass-assignment-in-rest-apis`
2. **Cloud Security (AWS / GCP / Azure)**:
   - `auditing-cloud-with-cis-benchmarks`
   - `auditing-aws-s3-bucket-permissions`
   - `auditing-gcp-iam-permissions`
   - `analyzing-azure-activity-logs-for-threats`
   - `detecting-serverless-function-injection`
3. **Identity, Authentication & Access Control (IAM)**:
   - `configuring-oauth2-authorization-flow`
   - `abusing-dpapi-for-credential-access`
   - `detecting-anomalous-authentication-patterns`
   - `bypassing-authentication-with-forced-browsing`
   - `attacking-entra-id-with-roadtools`
4. **Defensive Engineering & Blue Team**:
   - `implementing-cloud-waf-rules`
   - `detecting-sql-injection-via-waf-logs`
   - `analyzing-web-server-logs-for-intrusion`
   - `integrating-dast-with-owasp-zap-in-pipeline`
   - `analyzing-dns-logs-for-exfiltration`
5. **Digital Forensics & Incident Response (DFIR)**:
   - `analyzing-memory-dumps-with-volatility`
   - `analyzing-windows-event-logs-in-splunk`
   - `analyzing-mft-for-deleted-file-recovery`
   - `analyzing-network-traffic-with-wireshark`
   - `acquiring-disk-image-with-dd-and-dcfldd`
6. **Threat Intelligence & Attribution**:
   - `analyzing-threat-actor-ttps-with-mitre-attack`
   - `analyzing-apt-group-with-mitre-navigator`
   - `analyzing-indicators-of-compromise`
   - `analyzing-threat-landscape-with-misp`

---

## 3. Storage & Global Installation

All 818 individual `SKILL.md` documents are installed and accessible on this system at:
* **Global Plugin**: `~/.gemini/config/plugins/cybersecurity-skills/skills/`
* **Global Skills**: `~/.gemini/config/skills/<skill-name>/SKILL.md`
