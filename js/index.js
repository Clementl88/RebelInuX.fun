/**
 * ============================================================
 * REBELINUX — PRO HOME PAGE JAVASCRIPT
 * v5.0 · Mobile-First · Museum-Grade
 * ============================================================
 */

(function () {
  'use strict';

  const BP_TABLET = 600;
  const BP_DESKTOP = 992;

  const REBL_CONTRACT      = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const REBELINUX_CONTRACT = '0xf95beeF6439ec38fA757238Cdec8417ABDA536bd';

  function getViewport() {
    const w = window.innerWidth;
    if (w < BP_TABLET) return 'mobile';
    if (w < BP_DESKTOP) return 'tablet';
    return 'desktop';
  }
  const isMobile  = () => getViewport() === 'mobile';
  const isTablet  = () => getViewport() === 'tablet';
  const isDesktop = () => getViewport() === 'desktop';
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // BOOT
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 RebelInuX v5.0 — Initializing...');
    setTimeout(() => {
      initIndexPage();
      initPerformanceMonitoring();
      initResizeHandler();
    }, 60);
  });

  function initIndexPage() {
    const queue = [
      initLoader,
      initAudienceCarousel,
      initScrollAnimations,
      initParallaxEffects,
      initContractAddresses,
      initCopyButtons,
      initSmoothScroll,
      initParticles,
      initBackToTop,
      initMobileOptimizations,
      initTouchInteractions,
      initLazyLoading,
      initPerformanceObservers,
      initWalletDetection,
      initWalletBar,
      initHoverEffects
    ];
    queue.forEach((fn, i) => {
      setTimeout(() => {
        try { fn(); } catch (err) { console.warn(`⚠️ ${fn.name}:`, err); }
      }, i * 55);
    });
  }

  function initPerformanceMonitoring() {
    if (!window.performance || !window.performance.timing) return;
    const t = window.performance.timing;
    if (!t.loadEventEnd) return;
    const loadTime = t.loadEventEnd - t.navigationStart;
    if (loadTime > 0) console.log(`📊 Loaded in ${loadTime}ms`);
  }

  function initResizeHandler() {
    let lastVp = getViewport();
    let raf = null;
    window.addEventListener('resize', () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const now = getViewport();
        if (now !== lastVp) {
          if (now === 'mobile') {
            document.querySelectorAll('.particle').forEach(p => p.remove());
            window.particles = [];
          } else if (lastVp === 'mobile') {
            initParticles();
          }
          shortenAddresses();
          lastVp = now;
        }
        if (typeof window.AOS !== 'undefined') window.AOS.refresh();
      });
    }, { passive: true });
  }

  // ============================================================
  // AUDIENCE CAROUSEL
  // ============================================================
  function initAudienceCarousel() {
    const slides = document.querySelectorAll('.audience-slide');
    const dots = document.querySelectorAll('.audience-dot');
    if (!slides.length || !dots.length) return;

    let current = 0;
    let timer = null;
    const INTERVAL = 7500;

    function show(i) {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
      current = i;
    }
    function next() { show((current + 1) % slides.length); }
    function start() {
      stop();
      if (prefersReducedMotion()) return;
      timer = setInterval(next, INTERVAL);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); start(); }));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });
    start();
  }

  // ============================================================
  // LOADER
  // ============================================================
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const minTime = isMobile() ? 800 : 1400;
    const start = performance.now();
    const bar = loader.querySelector('.progress-bar');

    const finish = () => {
      loader.classList.add('loaded');
      document.body.classList.add('loaded');
      setTimeout(() => { loader.style.display = 'none'; }, 500);
      document.dispatchEvent(new CustomEvent('pageLoaded', { detail: { timestamp: Date.now() } }));
    };

    if (bar) {
      let p = 0;
      const tick = setInterval(() => {
        p += Math.random() * 12;
        bar.style.width = Math.min(p, 100) + '%';
        if (p >= 100) {
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
    const selector = [
      '.audience-card', '.pillar-card', '.partner-card', '.why-card',
      '.step-card', '.gallery-card', '.roadmap-item', '.live-stat',
      '.token-panel', '.chain-column', '.chapter-row', '.editorial-tag'
    ].join(', ');
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (prefersReducedMotion()) {
      els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        const delay = isMobile() ? Math.min(index * 35, 180) : index * 55;
        setTimeout(() => entry.target.classList.add('fade-in'), delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      observer.observe(el);
    });

    window.scrollAnimationObserver = observer;
  }

  function initParallaxEffects() {
    if (isMobile() || prefersReducedMotion()) return;
    const heroBg = document.querySelector('.hero-background-pattern');
    if (!heroBg) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        heroBg.style.transform = `translate3d(0, ${window.pageYOffset * -0.4}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  // ============================================================
  // CONTRACT ADDRESSES
  // ============================================================
  const shorten = (addr) => (addr && addr.length > 20) ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : addr;

  function shortenAddresses() {
    document.querySelectorAll('.contract-short').forEach(code => {
      const full = code.getAttribute('data-full') || code.textContent.trim();
      if (full && full.length > 20) code.textContent = shorten(full);
    });
  }
  const initContractAddresses = shortenAddresses;

  function toggleContractView(button) {
    const wrap = button.closest('.contract-address');
    const codeEl = wrap ? wrap.querySelector('code') : null;
    if (!codeEl) return;
    const icon = button.querySelector('i');
    const expanded = codeEl.classList.toggle('expanded');
    const full = codeEl.getAttribute('data-full') || codeEl.textContent;
    if (expanded) {
      codeEl.textContent = full;
      if (icon) icon.className = 'fas fa-compress-alt';
    } else {
      codeEl.textContent = shorten(full);
      if (icon) icon.className = 'fas fa-expand-alt';
    }
  }

  // ============================================================
  // COPY
  // ============================================================
  function handleCopyClick(e) {
    e.preventDefault();
    const button = e.currentTarget;

    if (button.classList.contains('copy-contract-btn') || button.classList.contains('contract-panel-copy')) {
      copyToClipboard(REBL_CONTRACT)
        .then(() => { showNotification('✅ $REBL address copied!', 'success'); showCopyFeedback(button, true); })
        .catch(() => { showNotification('❌ Failed', 'error'); showCopyFeedback(button, false); });
      return;
    }
    const wrap = button.closest('.contract-address');
    if (!wrap) return;
    const codeEl = wrap.querySelector('code');
    if (!codeEl) return;
    const text = codeEl.getAttribute('data-full') || codeEl.textContent.trim();
    const isSolana = text.length > 32;
    const label = isSolana ? '⭐ $REBL' : '🪙 $rebelinux';

    copyToClipboard(text)
      .then(() => { showNotification(`✅ ${label} copied!`, 'success'); showCopyFeedback(button, true); })
      .catch(() => { showNotification('❌ Failed', 'error'); showCopyFeedback(button, false); });
  }

  async function copyToClipboard(text) {
    if (!text) throw new Error('Empty');
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0;';
    ta.setAttribute('readonly', '');
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!ok) throw new Error('execCommand failed');
    return true;
  }

  function showCopyFeedback(button, success) {
    const orig = button.innerHTML;
    const bg = button.style.background;
    const color = button.style.color;
    button.innerHTML = success ? '<i class="fas fa-check"></i> Copied!' : '<i class="fas fa-times"></i> Failed';
    button.style.background = success ? '#4CAF50' : '#f44336';
    button.style.color = 'white';
    setTimeout(() => {
      button.innerHTML = orig;
      button.style.background = bg;
      button.style.color = color;
    }, 1800);
  }

  function initCopyButtons() {
    document.querySelectorAll('.copy-btn, .copy-contract-btn, .contract-panel-copy')
      .forEach(btn => btn.addEventListener('click', handleCopyClick));
  }

  function copyContractAddress() {
    copyToClipboard(REBL_CONTRACT)
      .then(() => showNotification('✅ $REBL contract copied!', 'success'))
      .catch(() => showNotification('❌ Failed', 'error'));
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  function showNotification(message, type = 'info') {
    const prev = document.querySelector('.notification');
    if (prev) prev.remove();

    const icons = {
      success: 'fa-check-circle', error: 'fa-exclamation-circle',
      info: 'fa-info-circle', warning: 'fa-exclamation-triangle'
    };
    const colors = {
      success: 'rgba(76,175,80,0.96)', error: 'rgba(244,67,54,0.96)',
      warning: 'rgba(255,193,7,0.96)', info: 'rgba(33,150,243,0.96)'
    };
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    n.style.cssText = `
      position: fixed;
      top: calc(80px + env(safe-area-inset-top, 0px));
      left: 50%;
      transform: translateX(-50%);
      background: ${colors[type] || colors.info};
      color: white; padding: 14px 20px;
      border-radius: 14px;
      display: flex; align-items: center; gap: 12px;
      z-index: 10000;
      animation: slideDownIn 0.3s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.15);
      max-width: min(92vw, 400px);
      pointer-events: none;
      font-size: 0.9rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
    `;
    injectNotificationStyles();
    document.body.appendChild(n);
    setTimeout(() => {
      n.style.animation = 'slideUpOut 0.3s ease';
      setTimeout(() => n.remove(), 300);
    }, 4000);
  }

  function injectNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;
    const s = document.createElement('style');
    s.id = 'notification-styles';
    s.textContent = `
      @keyframes slideDownIn {
        from { transform: translate(-50%, -20px); opacity: 0; }
        to   { transform: translate(-50%, 0); opacity: 1; }
      }
      @keyframes slideUpOut {
        from { transform: translate(-50%, 0); opacity: 1; }
        to   { transform: translate(-50%, -20px); opacity: 0; }
      }
      @media (min-width: 992px) {
        .notification {
          left: auto !important; right: 20px !important;
          top: 100px !important; transform: none !important;
          animation: slideInRightN 0.3s ease !important;
        }
        @keyframes slideInRightN {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      }
    `;
    document.head.appendChild(s);
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
      const hh = header ? header.offsetHeight : 60;
      const top = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: top - hh - 16,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
      if (selector !== '#') history.pushState(null, null, selector);
    };
  }

  // ============================================================
  // PARTICLES (desktop)
  // ============================================================
  function initParticles() {
    if (isMobile() || prefersReducedMotion()) return;
    const hero = document.querySelector('.page-hero--main');
    if (!hero || hero.querySelector('.particle')) return;
    const container = hero.querySelector('.hero-particles');
    if (!container) return;
    const count = Math.min(24, Math.floor(window.innerWidth / 50));
    window.particles = window.particles || [];
    for (let i = 0; i < count; i++) window.particles.push(createParticle(container));
  }

  function createParticle(container) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 18 + 12;
    const delay = Math.random() * duration;
    const r = Math.floor(Math.random() * 60 + 195);
    const g = Math.floor(Math.random() * 60 + 195);
    const o = Math.random() * 0.25 + 0.1;
    const drift = (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 40 + 10) + 'px';

    p.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: rgba(${r}, ${g}, 255, ${o});
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: floatParticle ${duration}s linear ${delay}s infinite;
      pointer-events: none;
    `;
    if (!document.querySelector('#particle-kf')) {
      const s = document.createElement('style');
      s.id = 'particle-kf';
      s.textContent = `
        @keyframes floatParticle {
          0%   { transform: translate(0, 0); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translate(${drift}, -100vh); opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }
    container.appendChild(p);
    return p;
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    let ticking = false;
    const toggle = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.pageYOffset > 500);
        ticking = false;
      });
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }

  // ============================================================
  // MOBILE
  // ============================================================
  function initMobileOptimizations() {
    if (isMobile()) {
      document.documentElement.style.setProperty('--animation-medium', '0.35s');
      document.documentElement.style.setProperty('--animation-slow', '0.55s');
    }
    shortenAddresses();
    adjustTouchTargets();
  }

  function adjustTouchTargets() {
    const targets = document.querySelectorAll(
      '.action-btn, .copy-btn, .view-btn, .wallet-btn, .cta-button, ' +
      '.audience-cta, .partner-cta, .step-cta, .step-cta-mini, ' +
      '.token-panel-cta, .governance-banner-cta, .wallet-bar-btn'
    );
    targets.forEach(el => {
      if (el.offsetHeight && el.offsetHeight < 44) el.style.minHeight = '44px';
      if (el.offsetWidth && el.offsetWidth < 44) el.style.minWidth = '44px';
    });
  }

  // ============================================================
  // TOUCH
  // ============================================================
  function initTouchInteractions() {
    if (!('ontouchstart' in window)) return;
    document.querySelectorAll('.contract-address code').forEach(code => {
      let press = null;
      const start = () => {
        press = setTimeout(() => {
          const full = code.getAttribute('data-full') || code.textContent.trim();
          copyToClipboard(full)
            .then(() => showNotification('✅ Address copied!', 'success'))
            .catch(() => showNotification('❌ Copy failed', 'error'));
          code.style.backgroundColor = 'rgba(76,175,80,0.2)';
          setTimeout(() => { code.style.backgroundColor = ''; }, 400);
        }, 700);
      };
      const cancel = () => { if (press) clearTimeout(press); };
      code.addEventListener('touchstart', start, { passive: true });
      code.addEventListener('touchend', cancel, { passive: true });
      code.addEventListener('touchmove', cancel, { passive: true });
      code.addEventListener('touchcancel', cancel, { passive: true });
    });
  }

  // ============================================================
  // LAZY
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
  // PERF OBSERVER
  // ============================================================
  function initPerformanceObservers() {
    if (!('PerformanceObserver' in window)) return;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 80) console.log(`⚠️ Long task: ${entry.duration.toFixed(0)}ms`);
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {}
  }

  // ============================================================
  // WALLET
  // ============================================================
  function detectWallet() {
    if (window.phantom || window.solana) return 'phantom';
    if (typeof window.ethereum !== 'undefined') return 'ethereum';
    return 'none';
  }

  function initWalletDetection() {
    const wallet = detectWallet();
    document.querySelectorAll('.wallet-action').forEach(button => {
      const isSolana = button.textContent.includes('REBL');
      if (wallet === 'phantom' && isSolana) {
        button.innerHTML = '<i class="fas fa-wallet"></i><span>Add to Phantom</span>';
      } else if (wallet === 'ethereum' && !isSolana) {
        button.innerHTML = '<i class="fab fa-ethereum"></i><span>Add to MetaMask</span>';
      }
      button.addEventListener('click', function () {
        const orig = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting…</span>';
        this.disabled = true;
        setTimeout(() => { this.innerHTML = orig; this.disabled = false; }, 2200);
      });
    });
  }

  function addToWallet(address) {
    if (!address) return;
    const wallet = detectWallet();
    if (wallet === 'phantom' && window.solana && window.solana.request) {
      window.solana.request({
        method: 'wallet_watchAsset',
        params: { type: 'SPL', options: { address, symbol: 'REBL', decimals: 9 } }
      }).then(() => showNotification('✅ $REBL added to Phantom', 'success'))
        .catch(() => showNotification('ℹ️ Add $REBL manually', 'info'));
    } else {
      showNotification('ℹ️ Install Phantom to add $REBL', 'info');
    }
  }

  function initWalletBar() {
    const bar = document.getElementById('walletBar');
    if (!bar) return;
    setTimeout(() => {
      if (bar.style.display !== 'none') {
        bar.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        bar.style.opacity = '0';
        bar.style.transform = 'translate(-50%, 20px)';
        setTimeout(() => { bar.style.display = 'none'; }, 400);
      }
    }, 45000);
  }

  // ============================================================
  // HOVER EFFECTS (desktop only)
  // ============================================================
  function initHoverEffects() {
    if (isMobile()) return;
    document.querySelectorAll('.audience-card, .pillar-card, .partner-card, .step-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  }

  // ============================================================
  // CLEANUP
  // ============================================================
  function cleanup() {
    if (window.scrollAnimationObserver) {
      window.scrollAnimationObserver.disconnect();
      window.scrollAnimationObserver = null;
    }
  }
  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('pagehide', cleanup);

  // ============================================================
  // LOAD
  // ============================================================
  window.addEventListener('load', () => {
    document.documentElement.classList.add('page-loaded');
    document.dispatchEvent(new CustomEvent('rebelinux:pageReady', {
      detail: { timestamp: Date.now(), page: 'index', version: '5.0', viewport: getViewport() }
    }));
    console.log('✅ RebelInuX v5.0 ready');
  });

  window.addEventListener('error', (e) => {
    console.error('❌', e.error);
    if (window.gtag) {
      window.gtag('event', 'exception', { description: e.error?.message || 'Unknown', fatal: true });
    }
  });

  // ============================================================
  // PUBLIC API
  // ============================================================
  window.RebelInuX = {
    copyToClipboard, addToWallet, showNotification,
    toggleContractView, copyContractAddress, detectWallet,
    getViewport, isMobile, isTablet, isDesktop,
    REBL_CONTRACT, REBELINUX_CONTRACT, version: '5.0'
  };

  window.copyToClipboard     = copyToClipboard;
  window.toggleContractView  = toggleContractView;
  window.addToWallet         = addToWallet;
  window.copyContractAddress = copyContractAddress;
  window.showNotification    = showNotification;

  console.log('🪙 RebelInuX JS v5.0 loaded');
})();
