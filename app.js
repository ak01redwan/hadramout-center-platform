// app.js — Reactive Application Controller & State Manager
// Platform: Hadhramout Center for Historical Studies, Documentation and Publishing
// Engineered by Novixa | نوڤيكسا

(function () {
  'use strict';

  // State Management
  const state = {
    currentLang: localStorage.getItem('hc_lang') || 'ar',
    currentView: 'home',
    activeCategory: 'all',
    searchQuery: '',
    selectedPublication: null,
    theme: localStorage.getItem('hc_theme') || 'light',
    fontSize: localStorage.getItem('hc_font_size') || 'md',
    savedBooks: JSON.parse(localStorage.getItem('hc_saved_books') || '[]'),
    mediaFilter: 'all'
  };

  // DOM Elements Cache
  const elements = {
    html: document.documentElement,
    siteHeader: document.getElementById('site-header'),
    navMenu: document.getElementById('nav-menu'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileDrawer: document.getElementById('mobile-drawer'),
    langToggleBtn: document.getElementById('lang-toggle-btn'),
    langLabel: document.getElementById('lang-label'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    fontScalerBtn: document.getElementById('font-scaler-btn'),
    btnOpenSavedList: document.getElementById('btn-open-saved-list'),
    savedCounterBadge: document.getElementById('saved-counter-badge'),
    savedListModal: document.getElementById('saved-list-modal'),
    savedModalBody: document.getElementById('saved-modal-body'),
    savedModalCloseBtn: document.getElementById('saved-modal-close-btn'),
    globalSearchInput: document.getElementById('global-search-input'),
    categoryFilterBar: document.getElementById('category-filter-bar'),
    homePublicationsGrid: document.getElementById('home-publications-grid'),
    fullPublicationsGrid: document.getElementById('full-publications-grid'),
    magazinesListContainer: document.getElementById('magazines-list-container'),
    homeForumGrid: document.getElementById('home-forum-grid'),
    fullForumGrid: document.getElementById('full-forum-grid'),
    homeTimelineTrack: document.getElementById('home-timeline-track'),
    fullTimelineTrack: document.getElementById('full-timeline-track'),
    homeMediaGrid: document.getElementById('home-media-grid'),
    fullMediaGrid: document.getElementById('full-media-grid'),
    aboutLeadershipGrid: document.getElementById('about-leadership-grid'),
    aboutDepartmentsGrid: document.getElementById('about-departments-grid'),
    citationModal: document.getElementById('citation-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalBodyContent: document.getElementById('modal-body-content'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    toastNotification: document.getElementById('toast-notification'),
    toastText: document.getElementById('toast-text'),
    contactForm: document.getElementById('contact-inquiry-form'),
    views: {
      home: document.getElementById('view-home'),
      about: document.getElementById('view-about'),
      magazines: document.getElementById('view-magazines'),
      books: document.getElementById('view-books'),
      conferences: document.getElementById('view-conferences'),
      forum: document.getElementById('view-forum'),
      timeline: document.getElementById('view-timeline'),
      media: document.getElementById('view-media'),
      contact: document.getElementById('view-contact')
    }
  };

  // Helper: Show Floating Toast
  function showToast(message) {
    if (!elements.toastNotification || !elements.toastText) return;
    elements.toastText.textContent = message;
    elements.toastNotification.classList.add('show');
    setTimeout(() => {
      elements.toastNotification.classList.remove('show');
    }, 3200);
  }

  // Navigation & View Routing
  function navigateTo(viewName, scrollIntoView = true) {
    if (!elements.views[viewName]) {
      viewName = 'home';
    }
    state.currentView = viewName;

    // Toggle active view
    Object.keys(elements.views).forEach(key => {
      if (elements.views[key]) {
        elements.views[key].style.display = (key === viewName) ? 'block' : 'none';
      }
    });

    // Update active nav links
    document.querySelectorAll('[data-nav]').forEach(el => {
      if (el.getAttribute('data-nav') === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    if (elements.mobileDrawer) {
      elements.mobileDrawer.classList.remove('open');
      if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    }

    // Scroll to top of content smoothly if requested
    if (scrollIntoView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Document Title based on view
    updateDocumentTitle();
  }

  function updateDocumentTitle() {
    const isAr = state.currentLang === 'ar';
    const titles = {
      home: isAr ? 'مركز حضرموت للدراسات التاريخية والتوثيق والنشر | المنصة الرقمية' : 'Hadhramout Center for Historical Studies & Documentation',
      about: isAr ? 'عن المركز ورسالته | مركز حضرموت' : 'About the Center | Hadhramout Center',
      magazines: isAr ? 'مجلة حضرموت الثقافية | مركز حضرموت' : 'Hadramout Cultural Magazine | Hadhramout Center',
      books: isAr ? 'سلسلة إصدارات الكتب | مركز حضرموت' : 'Book Publications | Hadhramout Center',
      conferences: isAr ? 'المؤتمرات العلمية | مركز حضرموت' : 'Scientific Conferences | Hadhramout Center',
      forum: isAr ? 'منتدى عميد الوفاء الثقافي | مركز حضرموت' : 'Ameed Al-Wafa Cultural Forum | Hadhramout Center',
      timeline: isAr ? 'خط التاريخ والحضارة الحضرمية | مركز حضرموت' : 'Historical Timeline of Hadhramout',
      media: isAr ? 'الوسائط وبودكاست سقاية | مركز حضرموت' : 'Media & Siqayah Podcast | Hadhramout Center',
      contact: isAr ? 'تواصل مع المركز وطلب الأبحاث | مركز حضرموت' : 'Contact & Research Inquiries | Hadhramout Center'
    };
    document.title = titles[state.currentView] || titles.home;
  }

  // Routing via Hash
  function handleHashChange() {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (rawHash.startsWith('book-')) {
      const bookId = rawHash.replace('book-', '');
      navigateTo('books', false);
      setTimeout(() => {
        openCitationModal(bookId);
      }, 150);
      return;
    }
    if (rawHash && elements.views[rawHash]) {
      navigateTo(rawHash, false);
    } else {
      navigateTo('home', false);
    }
  }

  // Language System
  function applyLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('hc_lang', lang);
    const isAr = lang === 'ar';
    const t = HC_DATA.translations[lang];

    // Update HTML root attributes
    elements.html.setAttribute('lang', lang);
    elements.html.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    // Update Language Toggle Button Label
    if (elements.langLabel) {
      elements.langLabel.textContent = isAr ? 'English' : 'العربية';
    }

    // Update Header Brand
    const txtBrandTitle = document.getElementById('txt-brand-title');
    const txtBrandSubtitle = document.getElementById('txt-brand-subtitle');
    if (txtBrandTitle) txtBrandTitle.textContent = isAr ? HC_DATA.institution.shortNameAr : HC_DATA.institution.shortNameEn;
    if (txtBrandSubtitle) txtBrandSubtitle.textContent = isAr ? "للدراسات التاريخية والتوثيق والنشر" : "Historical Studies & Documentation";

    // Update Nav Links
    const navMapping = {
      'nav-home': t.navHome,
      'nav-about': t.navAbout,
      'nav-magazines': t.navMagazines,
      'nav-books': t.navBooks,
      'nav-conferences': t.navConferences,
      'nav-forum': t.navForum,
      'nav-timeline': t.navTimeline,
      'nav-contact': t.navContact
    };
    Object.keys(navMapping).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = navMapping[id];
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      const navTarget = link.getAttribute('data-nav');
      if (navTarget) {
        const key = 'nav' + navTarget.charAt(0).toUpperCase() + navTarget.slice(1);
        if (t[key]) link.textContent = t[key];
      }
    });

    // Update Hero elements
    const heroBadge = document.getElementById('hero-badge');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const btnHeroBooks = document.getElementById('btn-hero-books');
    const btnHeroMag = document.getElementById('btn-hero-magazine');
    const btnHeroAbout = document.getElementById('btn-hero-about');
    const searchInput = document.getElementById('global-search-input');

    if (heroBadge) heroBadge.textContent = t.heroBadge;
    if (heroTitle) heroTitle.textContent = t.heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
    if (btnHeroBooks) btnHeroBooks.textContent = t.exploreBooks;
    if (btnHeroMag) btnHeroMag.textContent = t.readMagazine;
    if (btnHeroAbout) btnHeroAbout.textContent = t.navAbout;
    if (searchInput) searchInput.setAttribute('placeholder', t.searchPlaceholder);

    // Update filter chips
    const filterMapping = {
      'filter-all': t.quickFilterAll,
      'filter-linguistics': t.quickFilterLinguistics,
      'filter-sultanates': t.quickFilterSultanates,
      'filter-ports': t.quickFilterPorts,
      'filter-archaeology': t.quickFilterArchaeology,
      'filter-islamic': t.quickFilterIslamic
    };
    Object.keys(filterMapping).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = filterMapping[id];
    });

    // Re-render Dynamic Components in current language
    renderAllComponents();
    updateDocumentTitle();
  }

  // Component Renderers
  function renderBookCard(book) {
    const isAr = state.currentLang === 'ar';
    const title = isAr ? book.titleAr : book.titleEn;
    const author = isAr ? book.authorAr : book.authorEn;
    const category = isAr ? book.categoryAr : book.categoryEn;
    const abstract = isAr ? book.abstractAr : book.abstractEn;
    const t = HC_DATA.translations[state.currentLang];
    const isSaved = state.savedBooks.includes(book.id);

    return `
      <article class="book-card" data-book-id="${book.id}">
        <div class="book-cover-wrap">
          <img src="${book.coverImage}" alt="${title}" class="book-cover-img" loading="lazy" onerror="this.src='https://files.hadramout.center/media/2026/02/img20260209_20543382-scaled.jpg'">
        </div>
        <div class="book-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
            <span class="book-tag">${category}</span>
            <button class="btn-bookmark ${isSaved ? 'bookmarked' : ''}" data-bookmark-id="${book.id}" title="${isSaved ? (isAr ? 'إزالة من المحفوظات' : 'Remove Bookmark') : (isAr ? 'حفظ في مكتبتي البحثية' : 'Save Reference')}" aria-label="حفظ المرجع">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              </svg>
            </button>
          </div>
          <h3 class="book-title">${title}</h3>
          <p class="book-author">${author}</p>
          <p class="book-abstract">${abstract}</p>
          <div class="book-footer">
            <span class="book-year">${book.year}م / ${book.hijriYear || ''}هـ</span>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn-icon btn-cite-pub" data-pub-id="${book.id}" title="${t.citeAPA}" aria-label="${t.citeAPA}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </button>
              <button class="btn-secondary btn-detail-pub" data-pub-id="${book.id}" style="padding: 0.4rem 0.75rem; font-size: 0.82rem;">
                ${t.viewDetails}
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderPublications() {
    const query = state.searchQuery.toLowerCase().trim();
    const category = state.activeCategory;

    const filtered = HC_DATA.publications.filter(book => {
      const matchesCategory = (category === 'all') || (book.category === category);
      const matchesQuery = !query || 
        book.titleAr.toLowerCase().includes(query) ||
        book.titleEn.toLowerCase().includes(query) ||
        book.authorAr.toLowerCase().includes(query) ||
        book.authorEn.toLowerCase().includes(query) ||
        book.categoryAr.toLowerCase().includes(query) ||
        book.abstractAr.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    const emptyHtml = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--color-surface-card); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
        <p style="font-size: 1.15rem; color: var(--color-text-muted); margin-bottom: 1rem;">
          ${state.currentLang === 'ar' ? 'لم يتم العثور على نتائج تطابق معايير البحث' : 'No publications match your current search query'}
        </p>
        <button class="btn-secondary" id="btn-reset-filters">
          ${state.currentLang === 'ar' ? 'إعادة تعيين البحث والتصنيفات' : 'Reset Search Filters'}
        </button>
      </div>
    `;

    // Render Home Grid (max 6 items)
    if (elements.homePublicationsGrid) {
      const homeItems = filtered.slice(0, 6);
      elements.homePublicationsGrid.innerHTML = homeItems.length ? homeItems.map(renderBookCard).join('') : emptyHtml;
    }

    // Render Full Catalog Grid
    if (elements.fullPublicationsGrid) {
      elements.fullPublicationsGrid.innerHTML = filtered.length ? filtered.map(renderBookCard).join('') : emptyHtml;
    }

    // Attach event listeners for citation and details
    document.querySelectorAll('.btn-cite-pub').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pubId = btn.getAttribute('data-pub-id');
        openCitationModal(pubId);
      });
    });

    document.querySelectorAll('.btn-detail-pub').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pubId = btn.getAttribute('data-pub-id');
        openCitationModal(pubId);
      });
    });

    // Attach event listeners for bookmarks
    document.querySelectorAll('.btn-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = btn.getAttribute('data-bookmark-id');
        toggleBookmark(bookId);
      });
    });

    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.searchQuery = '';
        state.activeCategory = 'all';
        if (elements.globalSearchInput) elements.globalSearchInput.value = '';
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        const allChip = document.getElementById('filter-all');
        if (allChip) allChip.classList.add('active');
        renderPublications();
      });
    }
  }

  function renderMagazines() {
    if (!elements.magazinesListContainer) return;
    const isAr = state.currentLang === 'ar';
    const t = HC_DATA.translations[state.currentLang];

    elements.magazinesListContainer.innerHTML = HC_DATA.magazines.map(mag => {
      const title = isAr ? mag.titleAr : mag.titleEn;
      const date = isAr ? mag.dateAr : mag.dateEn;
      const summary = isAr ? mag.summaryAr : mag.summaryEn;

      return `
        <div class="magazine-featured-card" style="box-shadow: var(--shadow-md);">
          <div class="magazine-cover-frame">
            <img src="${mag.coverImage}" alt="${title}" class="magazine-cover-img" loading="lazy" onerror="this.src='https://files.hadramout.center/media/2026/09/image-6.png'">
          </div>
          <div class="magazine-details">
            <span class="magazine-badge">${isAr ? 'العدد ' + mag.issueNumber : 'Issue ' + mag.issueNumber}</span>
            <h3 class="magazine-title">${title}</h3>
            <p class="magazine-desc">${summary}</p>
            <div class="magazine-meta-list">
              <span>${isAr ? 'تاريخ الصدور: ' : 'Published: '} <strong>${date}</strong></span>
              <span>${isAr ? 'عدد المقالات: ' : 'Articles: '} <strong>${mag.articlesCount}</strong></span>
              <span>${isAr ? 'الصفحات: ' : 'Pages: '} <strong>${mag.pages}</strong></span>
            </div>
            <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <a href="https://wa.me/00967773570194?text=${encodeURIComponent('السلام عليكم، أود الحصول على نسخة من مجلة حضرموت الثقافية: ' + mag.titleAr)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background-color: var(--color-amber-500); color: #000000;">
                ${t.requestBook}
              </a>
              <button class="btn-secondary btn-copy-mag-citation" data-mag-num="${mag.issueNumber}" style="background: rgba(255,255,255,0.1); color: #ffffff; border-color: rgba(255,255,255,0.2);">
                ${t.citeAPA}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.btn-copy-mag-citation').forEach(btn => {
      btn.addEventListener('click', () => {
        const num = btn.getAttribute('data-mag-num');
        const citation = `مجلة حضرموت الثقافية. (2026). العدد (${num}). المكلا: مركز حضرموت للدراسات التاريخية والتوثيق والنشر.`;
        navigator.clipboard.writeText(citation).then(() => {
          showToast(t.copiedToast);
        });
      });
    });
  }

  function renderForumEvents() {
    const isAr = state.currentLang === 'ar';
    const html = HC_DATA.forumEvents.map(evt => {
      const title = isAr ? evt.titleAr : evt.titleEn;
      const speaker = isAr ? evt.speakerAr : evt.speakerEn;
      const date = isAr ? evt.dateAr : evt.dateEn;
      const location = isAr ? evt.locationAr : evt.locationEn;
      const summary = isAr ? evt.summaryAr : evt.summaryEn;

      return `
        <article class="forum-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-teal-700); background: var(--color-teal-50); padding: 0.2rem 0.6rem; border-radius: var(--radius-full);">
              ${isAr ? 'محاضرة منتدى عميد الوفاء' : 'Ameed Al-Wafa Lecture'}
            </span>
            <span style="font-size: 0.85rem; color: var(--color-text-subtle);">${date}</span>
          </div>
          <h3 style="font-size: 1.15rem; color: var(--color-primary-900); line-height: 1.4;">${title}</h3>
          <div class="forum-card-speaker">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>${speaker}</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6;">${summary}</p>
          <div style="font-size: 0.82rem; color: var(--color-text-subtle); display: flex; align-items: center; gap: 0.4rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${location}</span>
          </div>
        </article>
      `;
    }).join('');

    if (elements.homeForumGrid) elements.homeForumGrid.innerHTML = html;
    if (elements.fullForumGrid) elements.fullForumGrid.innerHTML = html;
  }

  function renderTimeline() {
    const isAr = state.currentLang === 'ar';
    const html = HC_DATA.timelineMilestones.map(m => {
      const era = isAr ? m.eraLabelAr : m.eraLabelEn;
      const date = isAr ? m.yearLabelAr : m.yearLabelEn;
      const title = isAr ? m.titleAr : m.titleEn;
      const desc = isAr ? m.descriptionAr : m.descriptionEn;

      return `
        <div class="timeline-item">
          <div class="timeline-dot" aria-hidden="true"></div>
          <div class="timeline-card">
            <div class="timeline-era-tag">${era} · ${date}</div>
            <h3 class="timeline-title">${title}</h3>
            <p class="timeline-desc">${desc}</p>
          </div>
        </div>
      `;
    }).join('');

    if (elements.homeTimelineTrack) elements.homeTimelineTrack.innerHTML = html;
    if (elements.fullTimelineTrack) elements.fullTimelineTrack.innerHTML = html;
  }

  function renderAboutHub() {
    const isAr = state.currentLang === 'ar';

    // Leadership
    if (elements.aboutLeadershipGrid) {
      elements.aboutLeadershipGrid.innerHTML = HC_DATA.institution.leadership.map(leader => `
        <div class="leader-card">
          <h3 class="leader-name">${isAr ? leader.nameAr : leader.nameEn}</h3>
          <span class="leader-role">${isAr ? leader.roleAr : leader.roleEn}</span>
          <p class="leader-bio">${isAr ? leader.bioAr : leader.bioEn}</p>
        </div>
      `).join('');
    }

    // Departments
    if (elements.aboutDepartmentsGrid) {
      elements.aboutDepartmentsGrid.innerHTML = HC_DATA.institution.departments.map(dept => `
        <div class="leader-card" style="border-top: 3px solid var(--color-amber-500);">
          <h3 class="leader-name">${isAr ? dept.nameAr : dept.nameEn}</h3>
          <p class="leader-bio">${isAr ? dept.descAr : dept.descEn}</p>
        </div>
      `).join('');
    }
  }

  function renderAllComponents() {
    renderPublications();
    renderMagazines();
    renderForumEvents();
    renderTimeline();
    renderAboutHub();
    renderAllMedia();
    updateSavedCounter();
  }

  // Citation Export Utilities
  function generateRIS(book) {
    return [
      'TY  - BOOK',
      `TI  - ${book.titleAr}`,
      `AU  - ${book.authorAr}`,
      `PY  - ${book.year}`,
      'PB  - مركز حضرموت للدراسات التاريخية والتوثيق والنشر',
      'CY  - المكلا، حضرموت، اليمن',
      `SN  - ${book.id}`,
      `N2  - ${book.abstractAr}`,
      'UR  - https://hadramout.center',
      'ER  - '
    ].join('\r\n');
  }

  function generateBibTeX(book) {
    const cleanKey = book.id.replace(/[^a-zA-Z0-9]/g, '_');
    return `@book{${cleanKey},
  author    = {${book.authorAr}},
  title     = {${book.titleAr}},
  year      = {${book.year}},
  publisher = {مركز حضرموت للدراسات التاريخية والتوثيق والنشر},
  address   = {المكلا، حضرموت},
  url       = {https://hadramout.center}
}`;
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Theme Management
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('hc_theme', theme);
    elements.html.setAttribute('data-theme', theme);
    const moonSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
    const sunSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.innerHTML = (theme === 'dark' ? sunSvg : moonSvg) + `<span id="theme-label" style="display:none">${theme}</span>`;
      elements.themeToggleBtn.setAttribute('title', theme === 'dark' ? (state.currentLang === 'ar' ? 'التحويل للوضع النهاري' : 'Switch to Daylight Mode') : (state.currentLang === 'ar' ? 'التحويل للوضع الليلي الأكاديمي' : 'Switch to Dark Mode'));
    }
  }

  // Font Scaling
  function applyFontSize(size) {
    state.fontSize = size;
    localStorage.setItem('hc_font_size', size);
    elements.html.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
    elements.html.classList.add(`font-size-${size}`);
    const label = size === 'sm' ? 'A-' : size === 'lg' ? 'A++' : 'A+';
    if (elements.fontScalerBtn) {
      elements.fontScalerBtn.innerHTML = `<span>${label}</span>`;
    }
  }

  function cycleFontSize() {
    const next = state.fontSize === 'md' ? 'lg' : state.fontSize === 'lg' ? 'sm' : 'md';
    applyFontSize(next);
  }

  // Saved Bibliography (Bookmarks) Controller
  function toggleBookmark(bookId) {
    const t = HC_DATA.translations[state.currentLang];
    const idx = state.savedBooks.indexOf(bookId);
    if (idx > -1) {
      state.savedBooks.splice(idx, 1);
      showToast(t.removedBookmarkToast);
    } else {
      state.savedBooks.push(bookId);
      showToast(t.bookmarkedToast);
    }
    localStorage.setItem('hc_saved_books', JSON.stringify(state.savedBooks));
    updateSavedCounter();
    renderPublications();
    if (elements.savedListModal && elements.savedListModal.classList.contains('open')) {
      renderSavedListModal();
    }
  }

  function updateSavedCounter() {
    if (elements.savedCounterBadge) {
      elements.savedCounterBadge.textContent = state.savedBooks.length;
    }
  }

  function openSavedListModal() {
    if (!elements.savedListModal || !elements.savedModalBody) return;
    renderSavedListModal();
    elements.savedListModal.classList.add('open');
  }

  function closeSavedListModal() {
    if (elements.savedListModal) {
      elements.savedListModal.classList.remove('open');
    }
  }

  function renderSavedListModal() {
    const isAr = state.currentLang === 'ar';
    const t = HC_DATA.translations[state.currentLang];
    const saved = HC_DATA.publications.filter(p => state.savedBooks.includes(p.id));

    if (!saved.length) {
      elements.savedModalBody.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <p style="font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 1rem;">
            ${isAr ? 'لم تقم بحفظ أي مراجع في مكتبتك البحثية بعد.' : 'You have not saved any publications in your bibliography yet.'}
          </p>
          <p style="font-size: 0.88rem; color: var(--color-text-subtle);">
            ${isAr ? 'انقر على أيقونة الإشارة المرجعية بجانب أي كتاب لحفظه وتصدير مرافعه بنقرة واحدة.' : 'Click the bookmark icon on any book card to save it for bulk citation export.'}
          </p>
        </div>
      `;
      return;
    }

    const itemsHtml = saved.map(book => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); gap: 1rem;">
        <div>
          <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary-900);">${isAr ? book.titleAr : book.titleEn}</h5>
          <p style="font-size: 0.82rem; color: var(--color-text-muted);">${isAr ? book.authorAr : book.authorEn} (${book.year}م)</p>
        </div>
        <div style="display: flex; gap: 0.35rem; shrink-0;">
          <button class="btn-icon btn-cite-pub" data-pub-id="${book.id}" title="${t.citeAPA}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          </button>
          <button class="btn-icon btn-remove-saved" data-book-id="${book.id}" title="${isAr ? 'إزالة' : 'Remove'}" style="color: #ef4444;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `).join('');

    elements.savedModalBody.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">
          ${isAr ? `لديك <strong>${saved.length}</strong> مراجع محفوظة في جلستك الحالية. يمكنك تصديرها جميعاً مباشرة:` : `You have <strong>${saved.length}</strong> saved references in this session. Export all:`}
        </p>
      </div>

      <div style="max-height: 280px; overflow-y: auto; margin-bottom: 1.5rem;">
        ${itemsHtml}
      </div>

      <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; display: flex; gap: 0.65rem; flex-wrap: wrap;">
        <button class="btn-primary" id="btn-batch-export-ris" style="font-size: 0.85rem;">
          ${isAr ? 'تصدير الكل لـ Zotero (.RIS)' : 'Export All (.RIS)'}
        </button>
        <button class="btn-secondary" id="btn-batch-export-bib" style="font-size: 0.85rem;">
          ${isAr ? 'تصدير الكل لـ BibTeX (.bib)' : 'Export All (.bib)'}
        </button>
        <button class="btn-secondary" id="btn-clear-saved" style="font-size: 0.85rem; color: #ef4444; border-color: #ef4444;">
          ${isAr ? 'تفريغ القائمة' : 'Clear All'}
        </button>
      </div>
    `;

    // Hook batch actions
    document.getElementById('btn-batch-export-ris')?.addEventListener('click', () => {
      const combinedRIS = saved.map(generateRIS).join('\r\n\r\n');
      downloadFile('hadhramout_center_bibliography.ris', combinedRIS, 'application/x-research-info-systems');
      showToast(isAr ? 'تم تنزيل حزمة مراجع Zotero!' : 'RIS bibliography downloaded!');
    });

    document.getElementById('btn-batch-export-bib')?.addEventListener('click', () => {
      const combinedBib = saved.map(generateBibTeX).join('\n\n');
      downloadFile('hadhramout_center_bibliography.bib', combinedBib, 'application/x-bibtex');
      showToast(isAr ? 'تم تنزيل حزمة مراجع BibTeX!' : 'BibTeX bibliography downloaded!');
    });

    document.getElementById('btn-clear-saved')?.addEventListener('click', () => {
      state.savedBooks = [];
      localStorage.setItem('hc_saved_books', JSON.stringify([]));
      updateSavedCounter();
      renderSavedListModal();
      renderPublications();
    });

    elements.savedModalBody.querySelectorAll('.btn-remove-saved').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-book-id');
        toggleBookmark(id);
      });
    });

    elements.savedModalBody.querySelectorAll('.btn-cite-pub').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-pub-id');
        closeSavedListModal();
        openCitationModal(id);
      });
    });
  }

  // Multimedia & Podcasts Renderer
  function renderMediaCard(item) {
    const isAr = state.currentLang === 'ar';
    const isPodcast = item.type === 'podcast';
    const title = isAr ? item.titleAr : item.titleEn;
    const series = isAr ? item.seriesAr : item.seriesEn;
    const desc = isAr ? item.descriptionAr : item.descriptionEn;
    const guest = isAr ? item.guestAr : item.guestEn;
    const date = isAr ? item.dateAr : item.dateEn;

    return `
      <article class="media-card">
        <div class="media-thumbnail-wrap">
          <img src="${item.coverImage}" alt="${title}" class="media-thumbnail-img" loading="lazy">
          <a href="${item.videoUrl || item.audioUrl}" target="_blank" rel="noopener noreferrer" class="media-play-overlay" aria-label="تشغيل">
            <div class="media-play-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </a>
        </div>
        <div class="media-content">
          <span class="media-series-badge">${series} · ${item.duration}</span>
          <h3 class="media-title">${title}</h3>
          <p class="media-desc">${desc}</p>
          <div class="media-meta">
            <span><strong>${isAr ? 'الضيف: ' : 'Guest: '}</strong> ${guest}</span>
            <span>${date}</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderAllMedia() {
    const filter = state.mediaFilter;
    const filtered = (HC_DATA.media || []).filter(item => {
      if (filter === 'all') return true;
      return item.type === filter;
    });

    if (elements.homeMediaGrid) {
      elements.homeMediaGrid.innerHTML = (HC_DATA.media || []).slice(0, 3).map(renderMediaCard).join('');
    }

    if (elements.fullMediaGrid) {
      elements.fullMediaGrid.innerHTML = filtered.map(renderMediaCard).join('');
    }
  }

  // Citation & Detail Modal Controller
  function openCitationModal(pubId) {
    const book = HC_DATA.publications.find(p => p.id === pubId);
    if (!book || !elements.citationModal || !elements.modalBodyContent) return;

    state.selectedPublication = book;
    const isAr = state.currentLang === 'ar';
    const t = HC_DATA.translations[state.currentLang];
    const title = isAr ? book.titleAr : book.titleEn;
    const author = isAr ? book.authorAr : book.authorEn;
    const category = isAr ? book.categoryAr : book.categoryEn;
    const abstract = isAr ? book.abstractAr : book.abstractEn;

    elements.modalTitle.textContent = isAr ? 'تفاصيل الإصدار والتوثيق الأكاديمي' : 'Publication Details & Citation';

    elements.modalBodyContent.innerHTML = `
      <div style="display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap;">
        <img src="${book.coverImage}" alt="${title}" style="width: 120px; border-radius: var(--radius-md); box-shadow: var(--shadow-md); object-fit: contain; background: #eee;" onerror="this.src='https://files.hadramout.center/media/2026/02/img20260209_20543382-scaled.jpg'">
        <div style="flex: 1; min-width: 240px;">
          <span class="book-tag">${category}</span>
          <h4 style="font-size: 1.25rem; color: var(--color-primary-900); margin: 0.35rem 0;">${title}</h4>
          <p style="font-size: 0.95rem; color: var(--color-text-muted);">${author}</p>
          <p style="font-size: 0.85rem; color: var(--color-text-subtle); margin-top: 0.35rem;">
            ${book.year}م / ${book.hijriYear || ''}هـ · ${book.pages ? book.pages + ' صفحة' : ''} ${book.isbn ? '· ISBN: ' + book.isbn : ''}
          </p>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary-900); margin-bottom: 0.4rem;">${isAr ? 'مستخلص الدراسة:' : 'Abstract:'}</h5>
        <p style="font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.7;">${abstract}</p>
      </div>

      <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; margin-top: 1rem;">
        <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary-900); margin-bottom: 0.5rem;">${isAr ? 'نسخ الاقتباس الأكاديمي المباشر:' : 'Direct Academic Citations:'}</h5>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: var(--color-amber-600); margin-bottom: 0.2rem;">
              <span>APA 7th Edition</span>
              <button class="btn-copy-citation" data-format="apa" style="background: none; border: none; color: var(--color-primary-800); font-weight: 600; cursor: pointer;">${isAr ? 'نسخ' : 'Copy'}</button>
            </div>
            <div class="citation-box">${book.citationAPA}</div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: var(--color-amber-600); margin-bottom: 0.2rem;">
              <span>Chicago 17th Edition</span>
              <button class="btn-copy-citation" data-format="chicago" style="background: none; border: none; color: var(--color-primary-800); font-weight: 600; cursor: pointer;">${isAr ? 'نسخ' : 'Copy'}</button>
            </div>
            <div class="citation-box">${book.citationChicago}</div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: var(--color-amber-600); margin-bottom: 0.2rem;">
              <span>MLA 9th Edition</span>
              <button class="btn-copy-citation" data-format="mla" style="background: none; border: none; color: var(--color-primary-800); font-weight: 600; cursor: pointer;">${isAr ? 'نسخ' : 'Copy'}</button>
            </div>
            <div class="citation-box">${book.citationMLA}</div>
          </div>
        </div>

        <!-- Academic Reference File Exports -->
        <div class="citation-export-bar">
          <button class="btn-export-format btn-download-ris">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>${t.exportRIS}</span>
          </button>
          <button class="btn-export-format btn-download-bib">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>${t.exportBibTeX}</span>
          </button>
          <button class="btn-export-format btn-share-book">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            <span>${t.shareBook || (isAr ? 'مشاركة رابط الكتاب' : 'Share Link')}</span>
          </button>
          <button class="btn-export-format btn-print-modal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            <span>${t.printCard || (isAr ? 'طباعة البطاقة' : 'Print')}</span>
          </button>
        </div>
      </div>

      <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; margin-top: 1rem; display: flex; gap: 0.85rem; flex-wrap: wrap;">
        <a href="https://wa.me/00967773570194?text=${encodeURIComponent('السلام عليكم مركز حضرموت للدراسات، أود طلب اقتناء نسخة من كتاب: ' + book.titleAr + ' للمؤلف: ' + book.authorAr + ' (كود: ' + book.id + ')')}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="flex: 1; justify-content: center;">
          ${t.requestBook}
        </a>
      </div>
    `;

    // Hook up copy buttons
    elements.modalBodyContent.querySelectorAll('.btn-copy-citation').forEach(copyBtn => {
      copyBtn.addEventListener('click', () => {
        const format = copyBtn.getAttribute('data-format');
        let textToCopy = book.citationAPA;
        if (format === 'chicago') textToCopy = book.citationChicago;
        if (format === 'mla') textToCopy = book.citationMLA;

        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(t.copiedToast);
        });
      });
    });

    // Hook up RIS & BibTeX downloads
    elements.modalBodyContent.querySelector('.btn-download-ris')?.addEventListener('click', () => {
      downloadFile(`${book.id}_citation.ris`, generateRIS(book), 'application/x-research-info-systems');
      showToast(isAr ? 'تم تنزيل ملف مرجع Zotero (.RIS) بنجاح!' : 'RIS Citation downloaded!');
    });

    elements.modalBodyContent.querySelector('.btn-download-bib')?.addEventListener('click', () => {
      downloadFile(`${book.id}_citation.bib`, generateBibTeX(book), 'application/x-bibtex');
      showToast(isAr ? 'تم تنزيل ملف مرجع BibTeX (.bib) بنجاح!' : 'BibTeX Citation downloaded!');
    });

    // Hook up Share Book Link
    elements.modalBodyContent.querySelector('.btn-share-book')?.addEventListener('click', () => {
      const shareUrl = window.location.origin + window.location.pathname + '#book-' + book.id;
      if (navigator.share) {
        navigator.share({
          title: isAr ? book.titleAr : book.titleEn,
          text: (isAr ? book.titleAr : book.titleEn) + ' — ' + (isAr ? 'مركز حضرموت للدراسات التاريخية والتوثيق والنشر' : 'Hadhramout Center'),
          url: shareUrl
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast(t.copiedLinkToast || (isAr ? 'تم نسخ الرابط المباشر للكتاب إلى الحافظة!' : 'Direct book link copied!'));
        });
      }
    });

    // Hook up Print modal
    elements.modalBodyContent.querySelector('.btn-print-modal')?.addEventListener('click', () => {
      window.print();
    });

    elements.citationModal.classList.add('open');
  }

  function closeCitationModal() {
    if (elements.citationModal) {
      elements.citationModal.classList.remove('open');
    }
  }

  // Event Listeners Setup
  function initEventListeners() {
    // Hash routing
    window.addEventListener('hashchange', handleHashChange);

    // Nav Links Click
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-nav');
        window.location.hash = targetView;
        navigateTo(targetView, true);
      });
    });

    // Mobile Menu Toggle
    if (elements.mobileMenuBtn && elements.mobileDrawer) {
      elements.mobileMenuBtn.addEventListener('click', () => {
        const isOpen = elements.mobileDrawer.classList.toggle('open');
        elements.mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // Language Toggle Button
    if (elements.langToggleBtn) {
      elements.langToggleBtn.addEventListener('click', () => {
        const nextLang = state.currentLang === 'ar' ? 'en' : 'ar';
        applyLanguage(nextLang);
      });
    }

    // Theme Toggle Button
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', () => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }

    // Font Scaler Button
    if (elements.fontScalerBtn) {
      elements.fontScalerBtn.addEventListener('click', cycleFontSize);
    }

    // Saved List Modal Trigger & Close
    if (elements.btnOpenSavedList) {
      elements.btnOpenSavedList.addEventListener('click', openSavedListModal);
    }
    if (elements.savedModalCloseBtn) {
      elements.savedModalCloseBtn.addEventListener('click', closeSavedListModal);
    }
    if (elements.savedListModal) {
      elements.savedListModal.addEventListener('click', (e) => {
        if (e.target === elements.savedListModal) {
          closeSavedListModal();
        }
      });
    }

    // Media Filter Chips
    document.querySelectorAll('[data-media-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-media-filter]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.mediaFilter = chip.getAttribute('data-media-filter') || 'all';
        renderAllMedia();
      });
    });

    // Search Input
    if (elements.globalSearchInput) {
      elements.globalSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderPublications();
      });

      // Keyboard Esc to clear
      elements.globalSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          elements.globalSearchInput.value = '';
          state.searchQuery = '';
          renderPublications();
        }
      });
    }

    // Category Filter Chips
    if (elements.categoryFilterBar) {
      elements.categoryFilterBar.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;
        elements.categoryFilterBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.activeCategory = chip.getAttribute('data-category') || 'all';
        renderPublications();
      });
    }

    // Modal Close
    if (elements.modalCloseBtn) {
      elements.modalCloseBtn.addEventListener('click', closeCitationModal);
    }
    if (elements.citationModal) {
      elements.citationModal.addEventListener('click', (e) => {
        if (e.target === elements.citationModal) {
          closeCitationModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      // Focus search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (state.currentView !== 'books' && state.currentView !== 'home') {
          navigateTo('books');
        }
        elements.globalSearchInput?.focus();
        elements.globalSearchInput?.select();
        return;
      }

      if (e.key === 'Escape') {
        closeCitationModal();
        closeSavedListModal();
        if (elements.mobileDrawer) {
          elements.mobileDrawer.classList.remove('open');
        }
      }
    });

    // Contact Form Submission
    if (elements.contactForm) {
      elements.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('inquiry-name')?.value || '';
        const email = document.getElementById('inquiry-email')?.value || '';
        const phone = document.getElementById('inquiry-phone')?.value || '';
        const type = document.getElementById('inquiry-type')?.value || '';
        const msg = document.getElementById('inquiry-message')?.value || '';

        const t = HC_DATA.translations[state.currentLang];
        showToast(t.formSuccessToast);
        elements.contactForm.reset();

        // Optional WhatsApp Bridge Prompt
        setTimeout(() => {
          const waText = encodeURIComponent(`طلب جديد من منصة مركز حضرموت:\nالاسم: ${name}\nالنوع: ${type}\nالرسالة: ${msg}\nهاتف: ${phone}\nبريد: ${email}`);
          const waUrl = `https://wa.me/00967773570194?text=${waText}`;
          if (confirm(state.currentLang === 'ar' ? 'تم تسجيل رسالتك بنجاح! هل تود أيضاً فتح محادثة واتساب مباشرة مع إدارة المركز لإرسال التفاصيل فوراً؟' : 'Inquiry registered! Would you also like to open a direct WhatsApp chat with the Center?')) {
            window.open(waUrl, '_blank');
          }
        }, 1200);
      });
    }

    // Header shadow on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        elements.siteHeader?.classList.add('scrolled');
      } else {
        elements.siteHeader?.classList.remove('scrolled');
      }
    });
  }

  // Initialization
  function init() {
    initEventListeners();
    applyTheme(state.theme);
    applyFontSize(state.fontSize);
    applyLanguage(state.currentLang);
    handleHashChange();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
