# Quality Assurance & Testing Standards
**Platform:** Hadhramout Center for Historical Studies, Documentation and Publishing  
**Engineering Lead:** Eng. Abdulrahman Khaled Radwan (`ak01redwan`) — Novixa (`Novixa`)

---

## 1. Testing Hierarchy
The platform employs a multi-tier testing strategy to ensure zero defects before deployment:

### Tier 1: Static Data & Structure Validation (`scripts/validate.js`)
- Validates the existence and non-emptiness of all core project files (`index.html`, `styles.css`, `app.js`, `data.js`, `package.json`, `vercel.json`, `netlify.toml`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, assets).
- Validates integrity of `HC_DATA`:
  - `institution` metadata (names, address, phone numbers, emails, social URLs).
  - `publications` catalog (valid IDs, bilingual titles, authors, years, pages, categories, and complete APA/Chicago/MLA citations).
  - `periodicals` archive (issues, covers, dates, descriptions).
  - `forum` events (titles, speakers, dates, locations).
  - `timeline` milestones (eras, dates, descriptions).
  - `translations` dictionaries (parity of all keys between Arabic and English).
- Validates `index.html` headers, JSON-LD schemas, skip link, and meta tags.

### Tier 2: Interactive Browser Testing
- Real browser verification using browser automation subagent:
  - Theme toggling (Light <-> Dark mode) with persistent state across page reloads.
  - Font scaler cycling (`md` -> `lg` -> `xl` -> `md`).
  - Language switching (`ar` <-> `en`) ensuring full bidirectional layout adjustments (`dir="rtl"` vs `dir="ltr"`).
  - Search engine testing: query matching against titles, authors, categories, and descriptions.
  - Category filter pills switching (`all`, `manuscripts`, `sultanate`, `social`, `maritime`, etc.).
  - Saved books (bookmarks) system: adding, removing, persistent storage in `localStorage`, and modal display.
  - Citation modal: opening, dynamic switching between APA 7th, Chicago 17th, and MLA 9th, and copying to clipboard with confirmation toast.
  - WhatsApp order integration: verifying dynamic link generation with pre-filled message text.
  - Audio/Video modal: playing sample audios (e.g. Siqayah podcast), close button, Escape key dismiss.

### Tier 3: Cross-Device & Responsive Verification
- Test viewport dimensions:
  - Mobile Small: 320px
  - Mobile Medium: 375px & 414px
  - Tablet: 768px & 820px
  - Desktop: 1280px & 1920px
- Ensure header responsiveness: desktop nav menu hides gracefully on <= 992px, hamburger icon toggles mobile drawer, drawer closes on link click or backdrop tap.
