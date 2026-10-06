# Engineering Standards & Architectural Principles
**Platform:** Hadhramout Center for Historical Studies, Documentation and Publishing  
**Engineering Lead:** Eng. Abdulrahman Khaled Radwan (`ak01redwan`) — Novixa (`Novixa`)

---

## 1. Core Architectural Tenets
1. **Zero External Runtime Bloat:**
   - Use high-performance Vanilla JavaScript (ES6+ modular, IIFE or ES Modules), semantic HTML5, and CSS custom properties (variables).
   - No heavyweight frontend framework dependencies (e.g. React, Angular, Vue) unless explicitly requested.
   - Maximize speed for Yemeni and regional internet conditions (slow 3G/4G connectivity). Total core bundle size must stay strictly under **150 KB**.

2. **Bilingual First-Class Support (Arabic & English):**
   - Full bidirectional layout support (`dir="rtl"` for Arabic, `dir="ltr"` for English).
   - All dynamic UI strings, card titles, metadata tags, and navigational labels must maintain 100% translation parity in `data.js` (`translations.ar` and `translations.en`).
   - Accessible font pairings: Cairo / Tajawal for Arabic typography, Inter / system-ui for Latin typography.

3. **Academic & Research Rigor:**
   - All historical data, author names, publishers, citations (APA 7th, Chicago 17th, MLA 9th), and publication years must be rigorously verified against the Center's official archives.
   - Citation generation must support instantaneous clipboard copying and export formats (e.g. RIS, BibTeX).

4. **Accessibility & Usability (WCAG 2.1 AA):**
   - Color contrast ratio >= 4.5:1 in both Light Mode and Academic Dark Mode.
   - Full keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Escape` for modals).
   - Accessible skip link (`#skip-link`) pointing to `#main-content`.
   - Descriptive `aria-label`, `aria-expanded`, and role attributes on interactive elements.

5. **Responsive Design Matrix:**
   - Fluid typography and responsive grid systems supporting screen widths from **320px** (small mobile) through **768px** (tablets), **1024px** (laptops), and **1920px+** (desktop/4K).
   - Touch targets must be at least **44x44px** on touchscreens.

6. **SEO & Structured Knowledge:**
   - Canonical and alternate hreflang tags on all views.
   - Comprehensive Open Graph and Twitter Card tags.
   - Valid Schema.org JSON-LD structured data for `ResearchOrganization`, `Book`, `Periodical`, and `Event`.
