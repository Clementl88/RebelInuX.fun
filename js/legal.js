// legal.js - Complete Legal Pages Functionality
// Supports Privacy Policy, Terms of Service, Disclaimer, and 404 pages

// ===== GLOBAL VARIABLES =====
window.componentsLoaded = false;
window.legalInitialized = false;

// ===== WAIT FOR COMPONENTS =====
function waitForComponents(callback, maxAttempts = 20) {
  let attempts = 0;

  const checkInterval = setInterval(function() {
    attempts++;

    if (window.componentsLoaded || document.querySelector('#header-container')) {
      clearInterval(checkInterval);
      console.log('✅ Components ready, initializing legal page');
      callback();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      console.warn('⚠️ Components timeout, forcing initialization');
      callback();
    } else {
      console.log(`⏳ Waiting for components... (${attempts}/${maxAttempts})`);
    }
  }, 100);
}

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Legal page DOM ready');

  setTimeout(function() {
    window.componentsLoaded = true;
  }, 300);

  waitForComponents(function() {
    setTimeout(initLegalPage, 200);
  });
});

// ===== MAIN INITIALIZATION =====
function initLegalPage() {
  if (window.legalInitialized) {
    console.log('⚠️ Legal page already initialized');
    return;
  }

  console.log('⚖️ Initializing Legal page');
  window.legalInitialized = true;

  initCopyButtons();
  initDisclaimerCheckboxes();
  initCookiePreferences();
  highlightCurrentLegalPage();
  initAOSWithDelay();
  initContractReminder();
  initFaqInteractions();

  if (document.querySelector('.page-hero--404')) {
    init404Page();
  }

  console.log('✅ Legal page initialization complete');
}

// ===== COPY CONTRACT FUNCTIONALITY =====
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-mini-btn, .copy-contract-btn, .copy-button');

  copyButtons.forEach(button => {
    button.removeEventListener('click', handleCopyClick);
    button.addEventListener('click', handleCopyClick);
  });
}

function handleCopyClick(e) {
  e.preventDefault();

  const contractElement = this.closest('.contract-address-box')?.querySelector('code') ||
                         document.getElementById('contract-address') ||
                         this.closest('div')?.querySelector('code');

  if (contractElement) {
    const contractAddress = contractElement.textContent.trim();

    navigator.clipboard.writeText(contractAddress).then(() => {
      const originalHTML = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i>';
      this.style.background = '#4CAF50';

      showLegalToast('Contract address copied! Always verify before transacting.', 'success');

      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.style.background = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      showLegalToast('Failed to copy. Please try again.', 'error');

      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-copy"></i>';
        this.style.background = '';
      }, 2000);
    });
  } else {
    const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    navigator.clipboard.writeText(contractAddress).then(() => {
      showLegalToast('Contract address copied!', 'success');
    });
  }
}

// ===== DISCLAIMER CHECKBOXES =====
function initDisclaimerCheckboxes() {
  const checkboxes = document.querySelectorAll('.ack-statement input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
    checkbox.disabled = true;

    checkbox.addEventListener('click', function(e) {
      e.preventDefault();
      this.checked = true;
    });
  });
}

// ===== COOKIE PREFERENCES =====
function initCookiePreferences() {
  const cookieSettingsLink = document.querySelector('a[href="#cookie-settings"]');

  if (cookieSettingsLink) {
    cookieSettingsLink.removeEventListener('click', handleCookieClick);
    cookieSettingsLink.addEventListener('click', handleCookieClick);
  }
}

function handleCookieClick(e) {
  e.preventDefault();
  showCookiePreferences();
}

function showCookiePreferences() {
  const existingModal = document.querySelector('.legal-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'legal-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  modal.innerHTML = `
    <div style="background: #1a1a1a; padding: 2rem; border-radius: 16px;
                border: 2px solid var(--rebel-gold); max-width: 500px; width: 90%;">
      <h3 style="color: var(--rebel-gold); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-cookie-bite"></i> Cookie Preferences
      </h3>

      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div>
            <strong style="color: white;">Essential Cookies</strong>
            <p style="color: rgba(255,255,255,0.7); font-size: 0.85rem; margin: 0;">Required for site functionality</p>
          </div>
          <span style="background: rgba(76,175,80,0.2); color: #4CAF50; padding: 0.2rem 0.8rem; border-radius: 12px; font-size: 0.8rem;">Always On</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div>
            <strong style="color: white;">Analytics Cookies</strong>
            <p style="color: rgba(255,255,255,0.7); font-size: 0.85rem; margin: 0;">Anonymous usage data</p>
          </div>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: white;">Opt-out</span>
            <input type="checkbox" id="analytics-opt-out" style="accent-color: var(--rebel-gold); width: 18px; height: 18px;">
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button onclick="this.closest('.legal-modal').remove()"
                style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 25px;
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600;">
          Cancel
        </button>
        <button onclick="saveCookiePreferences()"
                style="background: var(--rebel-gold); color: #1a1a1a; border: none; border-radius: 25px;
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600;">
          Save Preferences
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

window.saveCookiePreferences = function() {
  const analyticsOptOut = document.getElementById('analytics-opt-out')?.checked;

  try {
    if (analyticsOptOut) {
      localStorage.setItem('rebelinux_analytics_opt_out', 'true');
      showLegalToast('Analytics cookies disabled', 'success');
    } else {
      localStorage.removeItem('rebelinux_analytics_opt_out');
      showLegalToast('Preferences saved', 'success');
    }
  } catch (e) {
    console.warn('Could not save cookie preferences:', e);
  }

  const modal = document.querySelector('.legal-modal');
  if (modal) modal.remove();
};

// ===== HIGHLIGHT CURRENT PAGE =====
function highlightCurrentLegalPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const relatedLinks = document.querySelectorAll('.related-card');

  relatedLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.style.borderColor = 'var(--rebel-gold)';
      link.style.boxShadow = '0 0 15px rgba(255, 204, 0, 0.3)';
      link.style.opacity = '0.9';
      link.style.cursor = 'default';

      link.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
  });
}

// ===== CONTRACT REMINDER =====
function initContractReminder() {
  const contractReminder = document.querySelector('.contract-reminder');
  if (contractReminder) {
    const copyBtn = contractReminder.querySelector('.copy-mini-btn');
    if (copyBtn) {
      copyBtn.removeEventListener('click', handleCopyClick);
      copyBtn.addEventListener('click', handleCopyClick);
    }
  }
}

// ===== FAQ INTERACTIONS =====
function initFaqInteractions() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.addEventListener('click', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
}

// ===== 404 PAGE SPECIFIC =====
function init404Page() {
  console.log('🦴 404 Page detected');

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.style.display = 'none';
  }

  setupEasterEgg();
  prefetchPopularPages();
  log404Error();
}

function setupEasterEgg() {
  const eggElement = document.querySelector('.egg-content');

  if (eggElement) {
    let clickCount = 0;

    eggElement.addEventListener('click', function(e) {
      clickCount++;

      if (clickCount === 5) {
        showSecretAchievement('🔍 404 Explorer', 'You found the secret!');
      }

      if (clickCount === 10) {
        showSecretAchievement('👑 Rebel Legend', 'You\'re a true rebel!', 'legend');
      }
    });
  }
}

function showSecretAchievement(title, message, type = 'normal') {
  const achievement = document.createElement('div');
  achievement.className = 'achievement-popup';

  const colors = type === 'legend'
    ? 'linear-gradient(135deg, var(--rebel-red), #b71c1c); color: white; border: 2px solid var(--rebel-gold);'
    : 'linear-gradient(135deg, var(--rebel-gold), #e6b800); color: var(--rebel-dark);';

  achievement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors}
    padding: 1rem 1.5rem;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: 700;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(255, 204, 0, 0.5);
    animation: slideInRight 0.5s ease;
  `;

  achievement.innerHTML = `
    <i class="fas fa-${type === 'legend' ? 'crown' : 'trophy'}" style="font-size: 1.5rem;"></i>
    <div>
      <strong>🏆 ${title}!</strong>
      <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" style="background: transparent; border: none; color: ${type === 'legend' ? 'white' : 'var(--rebel-dark)'}; cursor: pointer; margin-left: 0.5rem;">
      <i class="fas fa-times"></i>
    </button>
  `;

  document.body.appendChild(achievement);

  setTimeout(() => {
    if (achievement.parentElement) {
      achievement.style.animation = 'slideOutRight 0.5s ease';
      setTimeout(() => achievement.remove(), 500);
    }
  }, 5000);
}

function prefetchPopularPages() {
  const pagesToPrefetch = [
    'index.html',
    'trade.html',
    'tokenomics.html'
  ];

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      pagesToPrefetch.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      });
      console.log('📦 Prefetched popular pages');
    });
  }
}

function log404Error() {
  const badUrl = document.referrer || window.location.pathname;
  console.warn(`⚠️ 404 Error: ${badUrl}`);

  try {
    const errors = JSON.parse(sessionStorage.getItem('rebel_404_errors') || '[]');
    errors.push({
      url: badUrl,
      timestamp: new Date().toISOString()
    });
    if (errors.length > 5) errors.shift();
    sessionStorage.setItem('rebel_404_errors', JSON.stringify(errors));
  } catch (e) {
    // Ignore storage errors
  }
}

// ===== FUN FACTS DATABASE =====
window.funFacts = [
  "The $REBL contract has 98.57% of LP tokens burned - one of the highest burn rates on Solana.",
  "RebelInuX launched with zero presale and zero team allocation - 100% fair launch.",
  "The dual logo system exists because on-chain metadata is immutable. Both logos represent the same token!",
  "$REBL has 67+ verified holders and growing.",
  "The Rebel Key NFTs on Base earn $REBL rewards every epoch.",
  "'RebelInuX' combines 'Rebel' + 'Inu' (dog) + 'X' (the unknown) — we're the rebellious unknown.",
  "Always verify the contract address. Scammers create fake tokens with similar addresses.",
  "The original on-chain logo is stored permanently on Solana and can never be changed.",
  "You can track $REBL live on DexScreener and GeckoTerminal.",
  "404 errors are also called 'Page Not Found' — but we prefer 'Rogue Page'."
];

window.factIndex = Math.floor(Math.random() * window.funFacts.length);

// ===== TOAST NOTIFICATION =====
function showLegalToast(message, type = 'info') {
  const existingToast = document.querySelector('.legal-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'legal-toast';

  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
    warning: '#FF9800'
  };

  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    info: 'info-circle',
    warning: 'exclamation-triangle'
  };

  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${colors[type] || colors.info};
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
  `;

  toast.innerHTML = `<i class="fas fa-${icons[type] || icons.info}"></i><span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== AOS INITIALIZATION =====
function initAOSWithDelay() {
  if (typeof AOS !== 'undefined') {
    setTimeout(function() {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
      console.log('✅ AOS initialized');
    }, 200);
  } else {
    console.log('⏳ AOS not loaded, skipping animation');
  }
}

// ===== ANIMATION STYLES =====
function addAnimationStyles() {
  if (!document.getElementById('legal-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'legal-animation-styles';
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to   { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to   { transform: translateX(-50%) translateY(100px); opacity: 0; }
      }
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to   { transform: translateX(100%); opacity: 0; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .legal-modal { animation: fadeIn 0.3s ease; }
    `;
    document.head.appendChild(style);
  }
}

addAnimationStyles();

// ===== GLOBAL EXPORTS =====
window.initLegalPage = initLegalPage;
window.showLegalToast = showLegalToast;
window.saveCookiePreferences = window.saveCookiePreferences;
window.copyContract = handleCopyClick;

console.log('✅ legal.js loaded successfully');
