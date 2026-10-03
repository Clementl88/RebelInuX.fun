// common.js — RebelInuX v3.0
// Handles: nav state, dropdowns, mobile menu, brand subtitle,
// scroll effects, back-to-top, contract copy.

// ========== GLOBAL STATE ==========
let isMobileMenuOpen = false;
let isDropdownOpen = false;
let lastClickedDropdown = null;


// ============================================================================
// DYNAMIC PAGE SUBTITLES
// ============================================================================
const PAGE_SUBTITLES = {
  // Home
  'index.html': 'AI Art • History • SocialFi',
  'index': 'AI Art • History • SocialFi',
  '/': 'AI Art • History • SocialFi',
  '': 'AI Art • History • SocialFi',

  // Core v3.0 pages
  'journey.html': 'AI-Animated Historical Collectibles',
  'contests.html': 'Enter Contests • Earn $REBL',
  'governance.html': 'REBL Governance Hub',
  'trade.html': 'Trade & Exchange Guide',
  'tokenomics.html': 'Tokenomics & Distribution',

  // Support pages
  'whitepaper.html': 'Project Documentation',
  'community.html': 'Community Hub & Links',
  'security-integrity.html': 'Security & Integrity Protocols',
  'roadmap.html': 'Development Roadmap',
  'artwork.html': 'Art & Media Gallery',

  // Fallback
  'default': 'AI Art • History • SocialFi'
};


function getCurrentPage() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  // SPA-style hash routing
  if (hash && hash.startsWith('#/')) {
    const hashPath = hash.substring(2);
    return hashPath || 'index.html';
  }

  // Root / index
  if (path === '/' || path === '/index.html' || path === '' || path.endsWith('/')) {
    return 'index.html';
  }

  // Extract filename
  const filename = path.split('/').pop();

  // If no extension, assume .html
  if (!filename.includes('.')) {
    return filename + '.html';
  }

  return filename;
}


function updateBrandSubtitle() {
  try {
    const subtitleElement = document.querySelector('.brand-subtitle');
    if (!subtitleElement) return;

    const currentPage = getCurrentPage();
    const subtitle = PAGE_SUBTITLES[currentPage] || PAGE_SUBTITLES['default'];

    console.log(`📄 Subtitle for "${currentPage}": ${subtitle}`);
    subtitleElement.textContent = subtitle;

    // data-page attribute for CSS color targeting
    subtitleElement.setAttribute('data-page', currentPage.replace('.html', ''));

    // Fade-in animation
    subtitleElement.style.opacity = '0';
    setTimeout(() => {
      subtitleElement.style.transition = 'opacity 0.3s ease';
      subtitleElement.style.opacity = '1';
    }, 10);
  } catch (error) {
    console.error('❌ Error updating brand subtitle:', error);
  }
}


// ============================================================================
// HEADER SCROLL EFFECT
// ============================================================================
function setupHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;

  let ticking = false;

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  updateHeader();
}


// ============================================================================
// BUY DROPDOWN TOGGLE
// ============================================================================
function setupBuyDropdown() {
  const buyToggles = document.querySelectorAll('.buy-toggle');
  const buyDropdowns = document.querySelectorAll('.buy-dropdown');

  if (buyToggles.length === 0 || buyDropdowns.length === 0) return;

  // Remove existing listeners
  buyToggles.forEach(toggle => {
    toggle.replaceWith(toggle.cloneNode(true));
  });

  const freshBuyToggles = document.querySelectorAll('.buy-toggle');

  freshBuyToggles.forEach((toggle) => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = this.closest('.buy-dropdown');
      if (!dropdown) return;

      const isActive = dropdown.classList.contains('active');

      closeAllDropdowns();

      if (!isActive) {
        dropdown.classList.add('active');
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      } else {
        dropdown.classList.remove('active');
        this.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    const clickedBuyDropdown = e.target.closest('.buy-dropdown');
    const clickedBuyToggle = e.target.closest('.buy-toggle');

    if (!clickedBuyDropdown && !clickedBuyToggle) {
      buyDropdowns.forEach(d => {
        d.classList.remove('active');
        const toggle = d.querySelector('.buy-toggle');
        if (toggle) {
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // Escape closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      buyDropdowns.forEach(d => {
        d.classList.remove('active');
        const toggle = d.querySelector('.buy-toggle');
        if (toggle) {
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
}


// ============================================================================
// MOBILE NAVIGATION
// ============================================================================
function setupMobileNavigation() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');

  if (!mobileToggle || !navDesktop) return;

  // Staggered animation delays
  function setupStaggeredAnimation() {
    const menuItems = navDesktop.querySelectorAll('a:not(.buy-toggle), .dropdown, .buy-dropdown.mobile-buy');
    menuItems.forEach((item, index) => {
      item.style.setProperty('--item-index', index);
      item.style.transitionDelay = `${index * 0.05}s`;
    });
  }

  mobileToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const isOpening = !navDesktop.classList.contains('active');
    if (isOpening) {
      openMobileNav();
    } else {
      closeMobileNav();
    }
  });

  // Click outside closes on mobile
  document.addEventListener('click', function (e) {
    if (window.innerWidth > 768) return;

    if (isMobileMenuOpen &&
        !e.target.closest('#nav-desktop') &&
        !e.target.closest('#mobileNavToggle')) {
      closeMobileNav();
    }
  });

  // Escape closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      closeMobileNav();
      mobileToggle.focus();
    }
  });

  // Resize — close on desktop
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        closeMobileNav();
      }
    }, 250);
  });

  function openMobileNav() {
    navDesktop.classList.add('active');
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navDesktop.setAttribute('aria-hidden', 'false');

    setupStaggeredAnimation();
    document.body.classList.add('nav-open');
    document.body.style.overflow = 'hidden';

    closeAllDropdowns();

    setTimeout(() => {
      const firstFocusable = navDesktop.querySelector('a:not(.buy-toggle), .dropbtn');
      if (firstFocusable) firstFocusable.focus();
    }, 100);

    isMobileMenuOpen = true;
  }

  function closeMobileNav() {
    navDesktop.classList.remove('active');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navDesktop.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
    closeAllDropdowns();

    const menuItems = navDesktop.querySelectorAll('a:not(.buy-toggle), .dropdown');
    menuItems.forEach(item => {
      item.style.transitionDelay = '';
    });

    isMobileMenuOpen = false;
  }

  // Expose for other functions
  window.closeMobileNav = closeMobileNav;
}


// ============================================================================
// DROPDOWN MANAGEMENT
// ============================================================================
function setupDropdowns() {
  const dropbtns = document.querySelectorAll('.dropbtn');
  const dropdowns = document.querySelectorAll('.dropdown');

  if (dropbtns.length === 0 || dropdowns.length === 0) return;

  // Remove existing listeners
  dropbtns.forEach((dropbtn) => {
    const newDropbtn = dropbtn.cloneNode(true);
    dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
  });

  const freshDropbtns = document.querySelectorAll('.dropbtn');

  freshDropbtns.forEach((dropbtn) => {
    dropbtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = this.closest('.dropdown');
      if (!dropdown) return;

      const isMobile = window.innerWidth <= 768;
      const isOpen = dropdown.classList.contains('active');

      lastClickedDropdown = dropdown;

      closeAllDropdownsExcept(dropdown);

      // Also close buy dropdowns
      document.querySelectorAll('.buy-dropdown').forEach(d => {
        if (d !== dropdown.closest('.buy-dropdown')) {
          d.classList.remove('active');
          const toggle = d.querySelector('.buy-toggle');
          if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
          }
        }
      });

      if (!isOpen) {
        dropdown.classList.add('active');
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');

        if (isMobile) {
          isDropdownOpen = true;
          document.body.classList.add('dropdown-open');

          const dropdownContent = dropdown.querySelector('.dropdown-content');
          if (dropdownContent) {
            dropdownContent.style.display = 'block';
            dropdownContent.style.opacity = '1';
            dropdownContent.style.visibility = 'visible';
            dropdownContent.style.transform = 'translateY(0)';
          }
        }
      } else {
        dropdown.classList.remove('active');
        this.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');

        if (isMobile) {
          isDropdownOpen = false;
          document.body.classList.remove('dropdown-open');

          const dropdownContent = dropdown.querySelector('.dropdown-content');
          if (dropdownContent) {
            dropdownContent.style.display = '';
            dropdownContent.style.opacity = '';
            dropdownContent.style.visibility = '';
            dropdownContent.style.transform = '';
          }
        }
      }
    });
  });

  // Close dropdown when a link inside is clicked
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function () {
      const dropdown = this.closest('.dropdown');
      if (dropdown) {
        dropdown.classList.remove('active');
        const btn = dropdown.querySelector('.dropbtn');
        if (btn) {
          btn.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      }

      if (window.innerWidth <= 768 && typeof window.closeMobileNav === 'function') {
        setTimeout(window.closeMobileNav, 300);
      }
    });
  });

  // Click outside closes
  document.addEventListener('click', function (e) {
    const isMobile = window.innerWidth <= 768;
    const clickedDropdown = e.target.closest('.dropdown');
    const clickedDropbtn = e.target.closest('.dropbtn');
    const clickedBuyDropdown = e.target.closest('.buy-dropdown');
    const clickedBuyToggle = e.target.closest('.buy-toggle');

    if (!clickedDropdown && !clickedDropbtn && !clickedBuyDropdown && !clickedBuyToggle) {
      closeAllDropdowns();

      if (isMobile) {
        isDropdownOpen = false;
        document.body.classList.remove('dropdown-open');
      }
    }
  });

  // Escape closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();

      if (window.innerWidth <= 768) {
        isDropdownOpen = false;
        document.body.classList.remove('dropdown-open');
      }
    }
  });

  // Resize — reset on desktop
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = window.innerWidth <= 768;

      if (!isMobile) {
        closeAllDropdowns();
        document.body.classList.remove('dropdown-open');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
      }
    }, 250);
  });
}


function closeAllDropdowns() {
  const isMobile = window.innerWidth <= 768;

  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.classList.remove('active');
  });

  document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  });

  document.querySelectorAll('.buy-dropdown').forEach(d => {
    d.classList.remove('active');
    const toggle = d.querySelector('.buy-toggle');
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  if (isMobile) {
    isDropdownOpen = false;
    document.body.classList.remove('dropdown-open');
  }

  lastClickedDropdown = null;
}


function closeAllDropdownsExcept(exceptDropdown) {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    if (dropdown !== exceptDropdown) {
      dropdown.classList.remove('active');
      const btn = dropdown.querySelector('.dropbtn');
      if (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  document.querySelectorAll('.buy-dropdown').forEach(d => {
    d.classList.remove('active');
    const toggle = d.querySelector('.buy-toggle');
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}


// ============================================================================
// BACK TO TOP
// ============================================================================
function setupBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  let ticking = false;

  function updateBackToTop() {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateBackToTop);
      ticking = true;
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      const firstFocusable = document.querySelector('header a, header button');
      if (firstFocusable) firstFocusable.focus();
    }, 500);
  });
}


// ============================================================================
// ACTIVE NAV STATE — matches the current page
// ============================================================================
function setActiveNavItem() {
  const currentPage = getCurrentPage();

  // Clear existing active states
  document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
    el.classList.remove('active');
  });

  // Always update subtitle first
  updateBrandSubtitle();

  // Page → nav selector map (v3.0)
  const pageMap = {
    'index.html':               'a[href="index.html"]',
    'journey.html':             'a.nav-journey',
    'contests.html':            'a.nav-contests',
    'governance.html':          'a.nav-governance',
    'trade.html':               'a.nav-trade',
    'tokenomics.html':          'a.nav-tokenomics',
    'whitepaper.html':          'a.nav-whitepaper',
    'community.html':           'a.nav-community',
    'security-integrity.html':  'a.nav-security-integrity',
    'roadmap.html':             'a.nav-roadmap',
    'artwork.html':             'a.nav-artwork'
  };

  const selector = pageMap[currentPage];
  if (!selector) return;

  const activeElement = document.querySelector(selector);
  if (!activeElement) return;

  activeElement.classList.add('active');

  // If the active link is inside a dropdown, mark the trigger as active too
  const dropdownParent = activeElement.closest('.dropdown-content');
  if (dropdownParent) {
    const dropdownBtn = dropdownParent.previousElementSibling;
    if (dropdownBtn && dropdownBtn.classList.contains('dropbtn')) {
      dropdownBtn.classList.add('active');
    }
  }
}


// ============================================================================
// PERFORMANCE
// ============================================================================
function setupPerformance() {
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      window.dispatchEvent(new Event('resizeDone'));
    }, 250);
  });

  const options = { passive: true };
  document.addEventListener('touchstart', function () {}, options);
  document.addEventListener('touchmove', function () {}, options);
  document.addEventListener('touchend', function () {}, options);
}


// ============================================================================
// CONTRACT COPY
// ============================================================================
function setupContractCopy() {
  const contractElement = document.querySelector('.contract-value-quick');
  if (!contractElement) return;

  const newContractElement = contractElement.cloneNode(true);
  contractElement.parentNode.replaceChild(newContractElement, contractElement);

  const fresh = document.querySelector('.contract-value-quick');
  fresh.addEventListener('click', copyContract);
  fresh.addEventListener('touchstart', function (e) {
    e.preventDefault();
    copyContract();
  }, { passive: false });
}


function copyContract() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const message = document.getElementById('contractCopiedMessage');
  const copyButton = document.querySelector('.contract-value-quick');

  if (!copyButton) return;

  const copyIcon = copyButton.querySelector('.copy-icon');

  if (copyIcon) {
    copyIcon.classList.remove('fa-copy');
    copyIcon.classList.add('fa-spinner', 'fa-spin');
  }

  navigator.clipboard.writeText(contractAddress).then(() => {
    setTimeout(() => {
      if (copyIcon) {
        copyIcon.classList.remove('fa-spinner', 'fa-spin');
        copyIcon.classList.add('fa-check');
      }
      if (message) message.classList.add('show');

      copyButton.style.background = 'rgba(39, 174, 96, 0.1)';
      copyButton.style.borderColor = 'rgba(39, 174, 96, 0.3)';

      setTimeout(() => {
        if (copyIcon) {
          copyIcon.classList.remove('fa-check');
          copyIcon.classList.add('fa-copy');
        }
        if (message) message.classList.remove('show');
        copyButton.style.background = '';
        copyButton.style.borderColor = '';
      }, 3000);
    }, 300);
  }).catch(err => {
    console.error('Failed to copy:', err);

    const textArea = document.createElement('textarea');
    textArea.value = contractAddress;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      if (copyIcon) {
        copyIcon.classList.remove('fa-spinner', 'fa-spin');
        copyIcon.classList.add('fa-check');
      }
      if (message) message.classList.add('show');

      setTimeout(() => {
        if (copyIcon) {
          copyIcon.classList.remove('fa-check');
          copyIcon.classList.add('fa-copy');
        }
        if (message) message.classList.remove('show');
      }, 3000);
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      alert('Failed to copy contract address. Please copy manually: ' + contractAddress);
      if (copyIcon) {
        copyIcon.classList.remove('fa-spinner', 'fa-spin');
        copyIcon.classList.add('fa-copy');
      }
    }

    document.body.removeChild(textArea);
  });
}


// ============================================================================
// LOADER
// ============================================================================
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  loader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
  loader.style.opacity = '0';
  loader.style.visibility = 'hidden';

  setTimeout(() => {
    if (loader.parentNode) loader.parentNode.removeChild(loader);
  }, 500);
}


// ============================================================================
// INITIALIZE
// ============================================================================
function initializeCommon() {
  console.log('🚀 Initializing common functionality...');

  try {
    hideLoader();
    setupPerformance();
    setupHeaderScrollEffect();
    setupMobileNavigation();
    setupDropdowns();
    setupBuyDropdown();
    setupBackToTop();
    setActiveNavItem();
    updateBrandSubtitle();
    setupContractCopy();

    document.body.classList.add('js-enabled');

    console.log('✅ Common functionality initialized');
  } catch (error) {
    console.error('❌ Error initializing common functionality:', error);
  }
}


document.addEventListener('DOMContentLoaded', function () {
  console.log('📄 DOM Content Loaded (common.js)');
  setTimeout(initializeCommon, 100);
});


// Update subtitle on navigation events
window.addEventListener('popstate', updateBrandSubtitle);
window.addEventListener('hashchange', updateBrandSubtitle);

// Hook into includes.js component loading
if (window.componentsLoaded) {
  setTimeout(updateBrandSubtitle, 100);
} else {
  document.addEventListener('components:initialized', updateBrandSubtitle);
}


// ============================================================================
// EXPORTS
// ============================================================================
window.setupMobileNavigation = setupMobileNavigation;
window.setupDropdowns = setupDropdowns;
window.setupBackToTop = setupBackToTop;
window.setActiveNavItem = setActiveNavItem;
window.closeAllDropdowns = closeAllDropdowns;
window.initializeCommon = initializeCommon;
window.copyContract = copyContract;
window.setupContractCopy = setupContractCopy;
window.updateBrandSubtitle = updateBrandSubtitle;
window.getCurrentPage = getCurrentPage;
