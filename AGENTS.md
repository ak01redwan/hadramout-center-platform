# AGENTS.md — Autonomous Agent Directives & Repository Guide
**Project:** Hadhramout Center for Historical Studies, Documentation and Publishing — Digital Knowledge & Archival Platform  
**Owner & Engineering Lead:** Eng. Abdulrahman Khaled Radwan (`ak01redwan`) — Novixa (`Novixa`)  
**Repository:** `https://github.com/ak01redwan/hadramout-center-platform`

---

## 1. Mission & Context
This repository houses the modern, high-performance digital knowledge platform and archival research portal engineered for the **Hadhramout Center for Historical Studies, Documentation and Publishing** (مركز حضرموت للدراسات التاريخية والتوثيق والنشر) located in Al-Mukalla, Hadhramout, Yemen.

The project is developed as a flagship initiative by **Novixa** (`novixa.dev`) to modernize cultural and academic research infrastructure in Yemen and the Arabian Peninsula.

---

## 2. Technology Stack & Design Architecture
- **Core Engine:** Vanilla HTML5, CSS3 Custom Properties, Vanilla JavaScript (ES6+ reactive state controller in `app.js`).
- **Data Layer:** Centralized academic knowledge graph in `data.js` (`HC_DATA`).
- **Design Philosophy:** Editorial Academic Heritage theme with Gold/Navy accents, Dark/Light modes, dynamic font scaling, fully responsive from 320px to 4K displays.
- **Internationalization:** Complete dual-language support (Arabic RTL / English LTR).
- **Zero-Dependency Runtime:** No heavy frontend frameworks; ultra-lightweight (<120 KB total bundle) for lightning-fast loads on slow connections.
- **Deployment Targets:** Vercel (`vercel.json`), Netlify (`netlify.toml`), GitHub Pages.

---

## 3. Mandatory Operational Rules for AI Agents
Any AI assistant or autonomous subagent working in this repository MUST strictly abide by the rules documented in `.agents/rules/`:
1. [engineering-standards.md](file:///.agents/rules/engineering-standards.md): Follow zero-bloat architecture, WCAG 2.1 AA accessibility, and responsive design guidelines.
2. [autonomous-workflow.md](file:///.agents/rules/autonomous-workflow.md): Follow the Plan -> Track -> Code -> Test -> Review -> Sync lifecycle.
3. [git-workflow.md](file:///.agents/rules/git-workflow.md): Always commit using Conventional Commits and sync changes to GitHub (`origin/master`).
4. [quality-assurance.md](file:///.agents/rules/quality-assurance.md): Always run `node scripts/validate.js` and conduct browser verification before declaring any task complete.

---

## 4. Key CLI Commands
```bash
# Start local development preview server
npm run dev
# or: python -m http.server 3000

# Execute full automated test suite & validation audit
npm run test
# or: node scripts/validate.js

# Check git status and commit
git status
git add .
git commit -m "feat(scope): descriptive message"
git push origin master
```

---

## 5. Directory Structure Overview
```text
├── .agents/
│   └── rules/                  # Permanent rules and agent instructions
├── assets/                     # Vector icons and institutional logos
├── docs/                       # 50+ institutional strategy & engineering documents
│   ├── content/                # Editorial standards, style guide, terminology
│   ├── design/                 # Design system, tokens, wireframes
│   ├── handover/               # Admin manuals, maintenance procedures
│   ├── qa/                     # Audit checklists, test plans, accessibility reports
│   ├── research/               # Institutional audits, competitor analysis
│   ├── strategy/               # Executive dossiers, outreach playbooks, value props
│   ├── technical/              # System architecture, deployment, security
│   └── ux/                     # User journeys, sitemaps, IA
├── scripts/
│   └── validate.js             # Automated 100% production readiness validator
├── app.js                      # Reactive application state controller
├── data.js                     # Academic database and i18n dictionaries
├── index.html                  # Accessible semantic single-page layout
├── styles.css                  # Unified design system & responsive styling
├── MASTER_STRATEGY_HADRAMOUT_NOVIXA.md # Executive strategy reference
├── MANUAL_AND_AUDIT_ARABIC.md  # Comprehensive Arabic manual & testing instructions
├── package.json                # Project scripts and metadata
├── vercel.json                 # Vercel deployment routing & caching headers
└── netlify.toml                # Netlify deployment configuration
```
