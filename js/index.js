/**
 * ============================================================
 * REBELINUX INDEX PAGE - MOBILE-FIRST JAVASCRIPT
 * Version: 3.0 (Mobile-First • 3 Asset Types)
 * ============================================================
 *
 * 3 Asset Types System:
 *   🪙 Type 1: Creator Coin ($rebelinux) on ZORA
 *   📜 Type 2: Content Coins (Rebel Key + Journey) on ZORA
 *   ⭐ Type 3: Governance + Reward Token ($REBL) on Solana
 *
 * Formula: Hold Type 1 + Type 2 → Earn Type 3 ($REBL)
 *
 * Breakpoints (kept in sync with CSS):
 *   Mobile ..... 0–599px
 *   Tablet ..... 600–991px
 *   Desktop .... 992px+
 * ============================================================
 */

(function () {
  'use strict';

  // ============================================================
  // CONSTANTS
  // ============================================================
  const BP_TABLET = 600;
  const BP_DESKTOP = 992;

  const REBL_CONTRACT = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const REBELINUX_CONTRACT = '0xf95beeF6439ec38fA757238Cdec8417ABDA536bd';

  // ============================================================
  // VIEWPORT HELPERS
  // ============================================================
  function getViewport() {
    const w = window.innerWidth;
    if (w < BP_TABLET) return 'mobile';
    if (w < BP_DESKTOP) return 'tablet';
    return 'desktop';
  }

  function isMobile() { return getViewport() === 'mobile'; }
  function isTablet() { return getViewport() === 'tablet'; }
  function isDesktop() { return getViewport() === 'desktop'; }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ============================================================
  // MAIN INITIALIZATION
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 RebelInuX (Mobile-First • 3 Asset Types) Initializing...');

    setTimeout(() => {
      initIndexPage();
      initPerformanceMonitoring();
      initResizeHandler();
    }, 60);
  });

  function initIndexPage() {
    console.log('✨ Initializing ecosystem — viewport:', getViewport());

    const initQueue = [
      initLoader,
      initScrollAnimations,
      initParallaxEffects,
      initStatsCounters,
      initContractAddresses,
      initCopyButtons,
      initSmoothScroll,
      initParticles,
      initLogoAnimations,
      initLogoInteractions,
      initBackToTop,
      initMobileOptimizations,
      initTouchInteractions,
      initLazyLoading,
      initPerformanceObservers,
      initWalletDetection,
      initChainAnimation,
      initValueCardEffects,
      initAssetTypesDisplay,
      initFormulaAnimation
    ];

    initQueue.forEach((fn, i) => {
      setTimeout(() => {
        try { fn(); }
        catch (err) { console.warn(`⚠️ Failed to init ${fn.name}:`, err); }
      }, i * 60);
    });
  }

  function initPerformanceMonitoring() {
    if (!window.performance || !window.performance.timing) return;
    const perf = window.performance.timing;
    if (!perf.loadEventEnd) return;
    const loadTime = perf.loadEventEnd - perf.navigationStart;
    if (loadTime > 0) console.log(`📊 Page loaded in ${loadTime}ms`);
    if (loadTime > 3000) console.warn('⚠️ Page load time is slow, consider optimization');
  }

  // ============================================================
  // RESIZE HANDLER (breakpoint-aware)
  // ============================================================
  function initResizeHandler() {
    let lastViewport = getViewport();
    let raf = null;

    window.addEventListener('resize', () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const now = getViewport();
        if (now !== lastViewport) {
          console.log(`📐 Viewport changed: ${lastViewport} → ${now}`);
          if (now === 'mobile') {
            // Remove particles on mobile
            document.querySelectorAll('.particle').forEach(p => p.remove());
            window.particles = [];
          } else if (lastViewport === 'mobile') {
            initParticles();
          }
          optimizeTokenEcosystemForMobile();
          lastViewport = now;
        }
        if (typeof window.AOS !== 'undefined') window.AOS.refresh();
      });
    }, { passive: true });
  }

  // ============================================================
  // LOADER
  // ============================================================
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const isMobileView = isMobile();
    const minTime = isMobileView ? 900 : 1500;
    const start = performance.now();
    const progressBar = loader.querySelector('.progress-bar');

    const finish = () => {
      loader.classList.add('loaded');
      document.body.classList.add('loaded');
      setTimeout(() => { loader.style.display = 'none'; }, 500);
      document.dispatchEvent(new CustomEvent('pageLoaded', {
        detail: { timestamp: Date.now() }
      }));
    };

    if (progressBar) {
      let progress = 0;
      const tick = setInterval(() => {
        progress += Math.random() * 12;
        progressBar.style.width = Math.min(progress, 100) + '%';
        if (progress >= 100) {
          clearInterval(tick);
          const elapsed = performance.now() - start;
          setTimeout(finish, Math.max(0, minTime - elapsed) + 300);
        }
      }, 100);
    } else {
      setTimeout(finish, minTime);
    }
  }

  // ============================================================
  // SCROLL ANIMATIONS
  // ============================================================
  function initScrollAnimations() {
    const selector =
      '.value-card, .comparison-card, .step-card, .stat-card, ' +
      '.token-card, .logo-card, .key-takeaway, .contract-emphasis, ' +
      '.feature-card, .process-step, .asset-card, .chain-node, ' +
      '.journey-story-card, .summary-card';

    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    // Reduced motion — show immediately
    if (prefersReducedMotion()) {
      els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    const isMobileView = isMobile();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const delay = isMobileView ? Math.min(index * 40, 200) : index * 60;

        setTimeout(() => {
          target.classList.add('fade-in');
        }, delay);

        observer.unobserve(target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      observer.observe(el);
    });

    // Floating logo tilt (desktop only)
    const floatingLogo = document.querySelector('.logo-3d');
    if (floatingLogo && isDesktop() && !prefersReducedMotion()) {
      let mouseX = 0, mouseY = 0, logoX = 0, logoY = 0;

      const onMouseMove = (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 30;
        mouseY = (e.clientY - window.innerHeight / 2) / 30;
      };

      window.addEventListener('mousemove', onMouseMove);
      window.mousemoveListener = onMouseMove;

      function animate() {
        logoX += (mouseX - logoX) * 0.08;
        logoY += (mouseY - logoY) * 0.08;
        floatingLogo.style.transform =
          `translateY(-12px) rotateY(${logoX}deg) rotateX(${logoY}deg)`;
        window.logoAnimationId = requestAnimationFrame(animate);
      }
      window.logoAnimationId = requestAnimationFrame(animate);
    }

    window.scrollAnimationObserver = observer;
  }

  function initParallaxEffects() {
    if (isMobile()) return;
    if (prefersReducedMotion()) return;

    const heroBg = document.querySelector('.hero-background-pattern');
    if (!heroBg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        heroBg.style.transform = `translate3d(0, ${scrolled * -0.4}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  // ============================================================
  // STATS COUNTERS
  // ============================================================
  function initStatsCounters() {
    const statValues = document.querySelectorAll('.stat-value[data-target], .stat-number[data-target]');
    if (!statValues.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting && !el.classList.contains('animated')) {
          const target = parseFloat(el.getAttribute('data-target'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, prefix, suffix);
          el.classList.add('animated');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4, rootMargin: '80px' });

    statValues.forEach(el => observer.observe(el));
  }

  function animateCounter(element, target, prefix = '', suffix = '') {
    if (isNaN(target)) return;

    const duration = prefersReducedMotion() ? 1 : 1800;
    const startTime = performance.now();
    const startValue = parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0;

    const format = (num) => {
      if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
      if (num >= 1_000_000)     return (num / 1_000_000).toFixed(1) + 'M';
      if (num >= 1_000)         return (num / 1_000).toFixed(1) + 'K';
      return Math.round(num).toString();
    };

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * ease;
      element.textContent = prefix + format(current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else element.textContent = prefix + format(target) + suffix;
    }
    requestAnimationFrame(step);
  }

  // ============================================================
  // CONTRACT ADDRESSES
  // ============================================================
  function initContractAddresses() {
    document.querySelectorAll('.contract-short').forEach(code => {
      const full = code.getAttribute('data-full') || code.textContent.trim();
      if (!full || full.length <= 20) return;
      code.textContent = shorten(full);
    });
  }

  function shorten(address) {
    if (!address || address.length <= 20) return address;
    return `${address.slice(0, 8)}…${address.slice(-6)}`;
  }

  function toggleContractView(button) {
    const wrap = button.closest('.contract-address');
    const codeEl = wrap ? wrap.querySelector('code') : null;
    if (!codeEl) return;

    const icon = button.querySelector('i');
    const isExpanded = codeEl.classList.toggle('expanded');
    const full = codeEl.getAttribute('data-full') || codeEl.textContent;

    if (isExpanded) {
      codeEl.textContent = full;
      if (icon) icon.className = 'fas fa-compress-alt';
      button.setAttribute('title', 'Collapse address');
    } else {
      codeEl.textContent = shorten(full);
      if (icon) icon.className = 'fas fa-expand-alt';
      button.setAttribute('title', 'Expand address');
    }
  }

  // ============================================================
  // COPY TO CLIPBOARD
  // ============================================================
  function handleCopyClick(e) {
    e.preventDefault();
    const button = e.currentTarget;

    // Copy contract button (official $REBL section)
    if (button.classList.contains('copy-contract-btn')) {
      copyToClipboard(REBL_CONTRACT.trim())
        .then(() => {
          showNotification('✅ $REBL (Type 3) address copied!', 'success');
          showCopyFeedback(button, true);
        })
        .catch(() => {
          showNotification('❌ Failed to copy address', 'error');
          showCopyFeedback(button, false);
        });
      return;
    }

    // Inline copy inside .contract-address
    const wrap = button.closest('.contract-address');
    if (!wrap) return;
    const codeEl = wrap.querySelector('code');
    if (!codeEl) return;

    const text = codeEl.getAttribute('data-full') || codeEl.textContent.trim();
    const isSolana = text.length > 32;
    const label = isSolana ? '⭐ $REBL (Type 3)' : '🪙 $rebelinux (Type 1)';

    copyToClipboard(text)
      .then(() => {
        showNotification(`✅ ${label} address copied!`, 'success');
        showCopyFeedback(button, true);
      })
      .catch(() => {
        showNotification('❌ Failed to copy address', 'error');
        showCopyFeedback(button, false);
      });
  }

  async function copyToClipboard(text) {
    if (!text) throw new Error('Empty text');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-1000px;left:-1000px;opacity:0;';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (!ok) throw new Error('execCommand failed');
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      throw err;
    }
  }

  function showCopyFeedback(button, success) {
    const originalHTML = button.innerHTML;
    const originalBg = button.style.background;
    const originalColor = button.style.color;

    if (success) {
      button.innerHTML = '<i class="fas fa-check"></i> Copied!';
      button.style.background = '#4CAF50';
      button.style.color = 'white';
    } else {
      button.innerHTML = '<i class="fas fa-times"></i> Failed';
      button.style.background = '#f44336';
      button.style.color = 'white';
    }

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = originalBg;
      button.style.color = originalColor;
    }, 1800);
  }

  function initCopyButtons() {
    document.querySelectorAll('.copy-btn, .copy-contract-btn').forEach(btn => {
      btn.addEventListener('click', handleCopyClick);
    });
  }

  function copyContractAddress() {
    copyToClipboard(REBL_CONTRACT)
      .then(() => showNotification('✅ $REBL (Type 3) contract address copied!', 'success'))
      .catch(() => showNotification('❌ Failed to copy address', 'error'));
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  function showNotification(message, type = 'info') {
    const prev = document.querySelector('.notification');
    if (prev) prev.remove();

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle',
      warning: 'fa-exclamation-triangle'
    };

    const colors = {
      success: 'rgba(76, 175, 80, 0.95)',
      error: 'rgba(244, 67, 54, 0.95)',
      warning: 'rgba(255, 193, 7, 0.95)',
      info: 'rgba(33, 150, 243, 0.95)'
    };

    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;

    n.style.cssText = `
      position: fixed;
      top: calc(80px + env(safe-area-inset-top, 0px));
      left: 50%;
      transform: translateX(-50%);
      right: auto;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 14px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      animation: slideDownIn 0.3s ease;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.15);
      max-width: min(92vw, 380px);
      min-width: 0;
      pointer-events: none;
      font-size: 0.9rem;
      line-height: 1.4;
      font-family: 'Montserrat', sans-serif;
    `;

    injectNotificationStyles();
    document.body.appendChild(n);

    setTimeout(() => {
      n.style.animation = 'slideUpOut 0.3s ease';
      setTimeout(() => n.remove(), 300);
    }, 4200);
  }

  function injectNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideDownIn {
        from { transform: translate(-50%, -20px); opacity: 0; }
        to   { transform: translate(-50%, 0);     opacity: 1; }
      }
      @keyframes slideUpOut {
        from { transform: translate(-50%, 0);     opacity: 1; }
        to   { transform: translate(-50%, -20px); opacity: 0; }
      }
      @media (min-width: 992px) {
        .notification {
          left: auto !important;
          right: 20px !important;
          top: 100px !important;
          transform: none !important;
          animation: slideInRight 0.3s ease !important;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || !document.querySelector(href)) return;
        e.preventDefault();
        scrollToElement(href);
      });
    });

    window.scrollToElement = function (selector) {
      const target = document.querySelector(selector);
      if (!target) return;

      const header = document.querySelector('.site-header');
      const headerH = header ? header.offsetHeight : 60;
      const top = target.getBoundingClientRect().top + window.pageYOffset;
      const offset = top - headerH - 16;

      window.scrollTo({
        top: offset,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });

      if (selector !== '#') history.pushState(null, null, selector);
    };
  }

  // ============================================================
  // PARTICLES (desktop only)
  // ============================================================
  function initParticles() {
    if (isMobile()) return;
    if (prefersReducedMotion()) return;

    const hero = document.querySelector('.page-hero--main');
    if (!hero) return;
    if (hero.querySelector('.particle')) return;

    const container = hero.querySelector('.hero-particles');
    if (!container) return;

    const count = Math.min(24, Math.floor(window.innerWidth / 45));
    window.particles = window.particles || [];

    for (let i = 0; i < count; i++) {
      window.particles.push(createParticle(container));
    }
  }

  function createParticle(container) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 18 + 12;
    const delay = Math.random() * duration;
    const r = Math.floor(Math.random() * 60 + 195);
    const g = Math.floor(Math.random() * 60 + 195);
    const opacity = Math.random() * 0.25 + 0.1;

    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(${r}, ${g}, 255, ${opacity});
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: floatParticle ${duration}s linear ${delay}s infinite;
      pointer-events: none;
    `;

    // Ensure keyframes exist
    if (!document.querySelector('#particle-kf')) {
      const s = document.createElement('style');
      s.id = 'particle-kf';
      s.textContent = `
        @keyframes floatParticle {
          0%   { transform: translate(0, 0);           opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}40px, -100vh); opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }

    container.appendChild(p);
    return p;
  }

  // ============================================================
  // LOGO ANIMATIONS
  // ============================================================
  function initLogoAnimations() {
    if (prefersReducedMotion()) return;

    document.querySelectorAll('.logo-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 200 + i * 120);
    });
  }

  function initLogoInteractions() {
    document.querySelectorAll('.logo-3d, .token-logo-img').forEach(logo => {
      logo.addEventListener('mouseenter', () => {
        logo.style.filter =
          'drop-shadow(0 0 30px rgba(212, 167, 106, 0.8)) brightness(1.15)';
      });
      logo.addEventListener('mouseleave', () => {
        logo.style.filter = 'drop-shadow(0 0 20px rgba(212, 167, 106, 0.5))';
      });
    });
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    let ticking = false;
    function toggle() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.pageYOffset > 400);
        ticking = false;
      });
    }

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });
  }

  // ============================================================
  // MOBILE OPTIMIZATIONS
  // ============================================================
  function initMobileOptimizations() {
    if (isMobile()) {
      document.documentElement.style.setProperty('--animation-medium', '0.35s');
      document.documentElement.style.setProperty('--animation-slow', '0.55s');
    }
    optimizeTokenEcosystemForMobile();
    adjustTouchTargets();
  }

  function optimizeTokenEcosystemForMobile() {
    // CSS handles all layout. Only shorten addresses here.
    document.querySelectorAll('.contract-short').forEach(code => {
      const full = code.getAttribute('data-full') || code.textContent;
      if (full && full.length > 20) code.textContent = shorten(full);
    });
  }

  function adjustTouchTargets() {
    const targets = document.querySelectorAll(
      '.action-btn, .copy-btn, .view-btn, .wallet-btn, .cta-button, .learn-link'
    );
    targets.forEach(el => {
      if (el.offsetHeight && el.offsetHeight < 44) el.style.minHeight = '44px';
      if (el.offsetWidth && el.offsetWidth < 44) el.style.minWidth = '44px';
    });
  }

  // ============================================================
  // TOUCH INTERACTIONS
  // ============================================================
  function initTouchInteractions() {
    if (!('ontouchstart' in window)) return;

    // Long-press to copy contract addresses
    document.querySelectorAll('.contract-address code').forEach(code => {
      let pressTimer = null;

      const start = () => {
        pressTimer = setTimeout(() => {
          const full = code.getAttribute('data-full') || code.textContent.trim();
          copyToClipboard(full)
            .then(() => showNotification('✅ Address copied!', 'success'))
            .catch(() => showNotification('❌ Copy failed', 'error'));

          code.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
          setTimeout(() => { code.style.backgroundColor = ''; }, 400);
        }, 700);
      };

      const cancel = () => { if (pressTimer) clearTimeout(pressTimer); };

      code.addEventListener('touchstart', start, { passive: true });
      code.addEventListener('touchend', cancel, { passive: true });
      code.addEventListener('touchmove', cancel, { passive: true });
      code.addEventListener('touchcancel', cancel, { passive: true });
    });
  }

  // ============================================================
  // LAZY LOADING
  // ============================================================
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgs.forEach(img => observer.observe(img));
  }

  // ============================================================
  // PERFORMANCE OBSERVERS
  // ============================================================
  function initPerformanceObservers() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 80) {
            console.log(`⚠️ Long task: ${entry.duration.toFixed(0)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) { /* not supported */ }
  }

  // ============================================================
  // WALLET DETECTION
  // ============================================================
  function detectWallet() {
    if (window.phantom || window.solana) return 'phantom';
    if (typeof window.ethereum !== 'undefined') return 'ethereum';
    return 'none';
  }

  function initWalletDetection() {
    const walletType = detectWallet();
    const buttons = document.querySelectorAll('.wallet-action');

    buttons.forEach(button => {
      const isSolanaButton = button.textContent.includes('REBL');

      if (walletType === 'phantom' && isSolanaButton) {
        button.innerHTML = '<i class="fas fa-wallet"></i><span>Add to Phantom</span>';
      } else if (walletType === 'ethereum' && !isSolanaButton) {
        button.innerHTML = '<i class="fab fa-ethereum"></i><span>Add to MetaMask</span>';
      }

      button.addEventListener('click', function () {
        const original = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting…</span>';
        this.disabled = true;
        setTimeout(() => {
          this.innerHTML = original;
          this.disabled = false;
        }, 2200);
      });
    });
  }

  // Add token to wallet (SPL token watchAsset)
  function addToWallet(address) {
    if (!address) return;
    const wallet = detectWallet();

    if (wallet === 'phantom' && window.solana && window.solana.request) {
      window.solana.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'SPL',
          options: {
            address: address,
            symbol: 'REBL',
            decimals: 9
          }
        }
      }).then(() => {
        showNotification('✅ $REBL added to Phantom', 'success');
      }).catch(() => {
        showNotification('ℹ️ Could not add token — add it manually', 'info');
      });
    } else if (wallet === 'phantom') {
      showNotification('ℹ️ Connect Phantom to add $REBL', 'info');
    } else {
      showNotification('ℹ️ Install Phantom wallet to add $REBL', 'info');
    }
  }

  // ============================================================
  // CHAIN ANIMATION
  // ============================================================
  function initChainAnimation() {
    // CSS now handles the moving coin on all viewports.
    // Nothing to do JS-side; keep the function for API compat.
  }

  // ============================================================
  // VALUE CARD EFFECTS (mouse spotlight — desktop only)
  // ============================================================
  function initValueCardEffects() {
    if (isMobile()) return;

    document.querySelectorAll('.value-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  }

  // ============================================================
  // ASSET TYPES DISPLAY
  // ============================================================
  function initAssetTypesDisplay() {
    // Update "triple-asset" copy → "3 Asset Types"
    document.querySelectorAll('.triple-asset-text, .triple-asset-label').forEach(el => {
      el.textContent = el.textContent.replace(/triple-asset/gi, '3 Asset Types');
    });

    // Auto-badge any .asset-card missing a badge
    document.querySelectorAll('.asset-card').forEach((card, i) => {
      if (card.querySelector('.asset-type-badge, .asset-badge')) return;
      const badge = document.createElement('div');
      badge.className = 'asset-type-badge';
      const types = ['ASSET 1', 'ASSET 2', 'ASSET 3'];
      const colors = ['#e3b87c', '#8b5cf6', '#fbbf24'];
      badge.textContent = types[i] || `TYPE ${i + 1}`;
      badge.style.cssText = `
        display:inline-block;
        padding:0.2rem 0.8rem;
        border-radius:20px;
        font-size:0.6rem;
        font-weight:700;
        text-transform:uppercase;
        letter-spacing:1px;
        margin-bottom:0.5rem;
        background:${colors[i] || '#e3b87c'}22;
        color:${colors[i] || '#e3b87c'};
        border:1px solid ${colors[i] || '#e3b87c'}44;
      `;
      card.insertBefore(badge, card.firstChild);
    });
  }

  // ============================================================
  // FORMULA ANIMATION
  // ============================================================
  function initFormulaAnimation() {
    const formula = document.querySelector('.asset-types-formula, .three-asset-formula');
    if (!formula) return;
    if (prefersReducedMotion()) return;

    const elements = formula.querySelectorAll('.type-badge, .asset-badge, .result, .arrow');
    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.85)';
      setTimeout(() => {
        el.style.transition = 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, 200 + i * 120);
    });
  }

  // ============================================================
  // UTILITIES
  // ============================================================
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // ============================================================
  // CLEANUP
  // ============================================================
  function cleanupAnimations() {
    if (window.scrollAnimationObserver) {
      window.scrollAnimationObserver.disconnect();
      window.scrollAnimationObserver = null;
    }
    if (window.logoAnimationId) {
      cancelAnimationFrame(window.logoAnimationId);
      window.logoAnimationId = null;
    }
    if (window.mousemoveListener) {
      window.removeEventListener('mousemove', window.mousemoveListener);
      window.mousemoveListener = null;
    }
  }

  window.addEventListener('beforeunload', cleanupAnimations);
  window.addEventListener('pagehide', cleanupAnimations);

  // ============================================================
  // PAGE LOAD EVENTS
  // ============================================================
  window.addEventListener('load', function () {
    document.documentElement.classList.add('page-loaded');

    document.dispatchEvent(new CustomEvent('rebelinux:pageReady', {
      detail: {
        timestamp: Date.now(),
        page: 'index',
        version: '3.0',
        viewport: getViewport()
      }
    }));

    console.log('✅ RebelInuX (Mobile-First • 3 Asset Types) Initialized');
  });

  window.addEventListener('error', function (e) {
    console.error('❌ Unhandled error:', e.error);
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: e.error?.message || 'Unknown error',
        fatal: true
      });
    }
  });

  // ============================================================
  // PUBLIC API
  // ============================================================
  window.RebelInuX = {
    // public methods
    copyToClipboard,
    addToWallet,
    showNotification,
    toggleContractView,
    copyContractAddress,
    detectWallet,

    // viewport helpers
    getViewport,
    isMobile,
    isTablet,
    isDesktop,

    // constants
    REBL_CONTRACT,
    REBELINUX_CONTRACT,

    version: '3.0'
  };

  console.log('🪙 RebelInuX Mobile-First JS loaded (v3.0)');
})();
