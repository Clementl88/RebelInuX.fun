// legal.js - Complete Legal Pages Functionality
// Supports Privacy Policy, Terms of Service, Disclaimer, and 404 pages

// ===== GLOBAL STATE =====
window.componentsLoaded = false;
window.legalInitialized = false;

const CONTRACT_ADDRESS = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';

// ===== COMPONENT READY =====
// Preferred: includes.js dispatches 'components:loaded' when header/footer are injected.
// Fallback: short polling loop for older includes.js versions.
function waitForComponents(callback, maxAttempts = 20) {
  let settled = false;

  function settle(source) {
    if (settled) return;
    settled = true;
    console.log(`✅ Components ready (${source})`);
    callback();
  }

  window.addEventListener('components:loaded', () => settle('event'), { once: true });

  let attempts = 0;
  const poll = setInterval(() => {
    attempts++;
    if (window.componentsLoaded || document.querySelector('#header-container')) {
      clearInterval(poll);
      settle('poll');
    } else if (attempts >= maxAttempts) {
      clearInterval(poll);
      console.warn('⚠️ Components timeout — forcing init');
      settle('timeout');
    }
  }, 100);
}

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Legal page DOM ready');

  // Legacy bridge: if includes.js doesn't dispatch an event,
  // flip the flag after a short delay so polling can succeed.
  setTimeout(() => { window.componentsLoaded = true; }, 300);

  waitForComponents(() => setTimeout(initLegalPage, 200));
});

// ===== INIT =====
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
  initFaqInteractions();

  // AOS is initialized inline in the HTML — do NOT re-init here.

  if (document.querySelector('.page-hero--404')) {
    init404Page();
  }

  console.log('✅ Legal page initialization complete');
}

// ===== COPY CONTRACT =====
function initCopyButtons() {
  // Delegated — works for buttons added after init too.
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-action="copy"], .copy-mini-btn, .copy-contract-btn, .copy-button');
    if (!btn) return;
    e.preventDefault();
    handleCopy(btn);
  });
}

function handleCopy(button) {
  const box = button.closest('.contract-address-box, .contract-reminder, div');
  const codeEl = box?.querySelector('code') || document.getElementById('contract-address');
  const address = (codeEl?.textContent || CONTRACT_ADDRESS).trim();

  navigator.clipboard.writeText(address).then(() => {
    const original = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#4CAF50';

    showLegalToast('Contract address copied! Always verify before transacting.', 'success');

    setTimeout(() => {
      button.innerHTML = original;
      button.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showLegalToast('Failed to copy. Please try again.', 'error');
  });
}

// ===== DISCLAIMER CHECKBOXES =====
function initDisclaimerCheckboxes() {
  const checkboxes = document.querySelectorAll('.ack-statement input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
    checkbox.disabled = true;
    // Decorative only — label carries the meaning for screen readers.
    checkbox.setAttribute('aria-hidden', 'true');
    checkbox.setAttribute('tabindex', '-1');

    checkbox.addEventListener('click', function(e) {
      e.preventDefault();
      this.checked = true;
    });
  });
}

// ===== COOKIE PREFERENCES =====
function initCookiePreferences() {
  const link = document.querySelector('a[href="#cookie-settings"]');
  if (link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showCookiePreferences();
    });
  }
}

function showCookiePreferences() {
  const existing = document.querySelector('.legal-modal');
  if (existing) existing.remove();

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
        <i class="fas fa-cookie-bite" aria-hidden="true"></i> Cookie Preferences
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
        <button type="button" data-modal-action="cancel"
                style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 25px;
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600;">
          Cancel
        </button>
        <button type="button" data-modal-action="save"
                style="background: var(--rebel-gold); color: #1a1a1a; border: none; border-radius: 25px;
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600;">
          Save Preferences
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.remove();

    const action = e.target.closest('[data-modal-action]')?.getAttribute('data-modal-action');
    if (action === 'cancel') modal.remove();
    if (action === 'save') saveCookiePreferences();
  });
}

function saveCookiePreferences() {
  const optOut = document.getElementById('analytics-opt-out')?.checked;

  try {
    if (optOut) {
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
}

// ===== HIGHLIGHT CURRENT PAGE =====
function highlightCurrentLegalPage() {
  const path = window.location.pathname;
  const current = path.split('/').pop().replace(/\.html$/, '') || 'index';

  document.querySelectorAll('.related-card').forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/\.html$/, '');
    if (href === current) {
      link.style.borderColor = 'var(--rebel-gold)';
      link.style.boxShadow = '0 0 15px rgba(255, 204, 0, 0.3)';
      link.style.opacity = '0.9';
      link.style.cursor = 'default';
      link.setAttribute('aria-current', 'page');
      link.addEventListener('click', e => e.preventDefault());
    }
  });
}

// ===== FAQ =====
function initFaqInteractions() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
}

// ===== 404 ONLY =====
function init404Page() {
  console.log('🦴 404 Page detected');

  const backToTop = document.getElementById('backToTop');
  if (backToTop) backToTop.style.display = 'none';

  setupEasterEgg();
  prefetchPopularPages();
  log404Error();
}

function setupEasterEgg() {
  const eggElement = document.querySelector('.egg-content');
  if (!eggElement) return;

  let clickCount = 0;
  eggElement.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) showSecretAchievement('🔍 404 Explorer', 'You found the secret!');
    if (clickCount === 10) showSecretAchievement('👑 Rebel Legend', "You're a true rebel!", 'legend');
  });
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
    <i class="fas fa-${type === 'legend' ? 'crown' : 'trophy'}" style="font-size: 1.5rem;" aria-hidden="true"></i>
    <div>
      <strong>🏆 ${title}!</strong>
      <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">${message}</p>
    </div>
    <button type="button" data-dismiss-achievement style="background: transparent; border: none; color: ${type === 'legend' ? 'white' : 'var(--rebel-dark)'}; cursor: pointer; margin-left: 0.5rem;">
      <i class="fas fa-times" aria-hidden="true"></i>
    </button>
  `;

  achievement.querySelector('[data-dismiss-achievement]')
    .addEventListener('click', () => achievement.remove());

  document.body.appendChild(achievement);

  setTimeout(() => {
    if (achievement.parentElement) {
      achievement.style.animation = 'slideOutRight 0.5s ease';
      setTimeout(() => achievement.remove(), 500);
    }
  }, 5000);
}

function prefetchPopularPages() {
  const pages = ['index.html', 'trade.html', 'tokenomics.html'];
  if (!('requestIdleCallback' in window)) return;

  requestIdleCallback(() => {
    pages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
    console.log('📦 Prefetched popular pages');
  });
}

function log404Error() {
  const badUrl = document.referrer || window.location.pathname;
  console.warn(`⚠️ 404 Error: ${badUrl}`);

  try {
    const errors = JSON.parse(sessionStorage.getItem('rebel_404_errors') || '[]');
    errors.push({ url: badUrl, timestamp: new Date().toISOString() });
    if (errors.length > 5) errors.shift();
    sessionStorage.setItem('rebel_404_errors', JSON.stringify(errors));
  } catch (_) { /* storage may be unavailable */ }
}

// ===== TOAST =====
function showLegalToast(message, type = 'info') {
  const existing = document.querySelector('.legal-toast');
  if (existing) existing.remove();

  const colors = { success: '#4CAF50', error: '#f44336', info: '#2196F3', warning: '#FF9800' };
  const icons  = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle', warning: 'exclamation-triangle' };

  const toast = document.createElement('div');
  toast.className = 'legal-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
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

  toast.innerHTML = `<i class="fas fa-${icons[type] || icons.info}" aria-hidden="true"></i><span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== ANIMATION STYLES =====
(function addAnimationStyles() {
  if (document.getElementById('legal-animation-styles')) return;
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
})();

// ===== EXPORTS =====
window.initLegalPage = initLegalPage;
window.showLegalToast = showLegalToast;
window.saveCookiePreferences = saveCookiePreferences;
window.copyContract = handleCopy;

console.log('✅ legal.js loaded successfully');
