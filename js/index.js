/**
 * ============================================================
 * REBELINUX INDEX — MOBILE-FIRST JAVASCRIPT
 * Version: 4.0 (Attractive Main Page)
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
  function isMobile()  { return getViewport() === 'mobile'; }
  function isTablet()  { return getViewport() === 'tablet'; }
  function isDesktop() { return getViewport() === 'desktop'; }
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ============================================================
  // MAIN INIT
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 RebelInuX v4.0 — Initializing...');
    setTimeout(() => {
      initIndexPage();
      initPerformanceMonitoring();
      initResizeHandler();
    }, 60);
  });

  function initIndexPage() {
    const initQueue = [
      initLoader,
      initAudienceCarousel,
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
      initValueCardEffects,
      initFormulaAnimation,
      initWalletBar
    ];

    initQueue.forEach((fn, i) => {
      setTimeout(() => {
        try { fn(); }
        catch (err) { console.warn(`⚠️ ${fn.name}:`, err); }
      }, i * 55);
    });
  }

  function initPerformanceMonitoring() {
    if (!window.performance || !window.performance.timing) return;
    const perf = window.performance.timing;
    if (!perf.loadEventEnd) return;
    const loadTime = perf.loadEventEnd - perf.navigationStart;
    if (loadTime > 0) console.log(`📊 Loaded in ${loadTime}ms`);
  }

  function initResizeHandler() {
    let lastViewport = getViewport();
    let raf = null;
    window.addEventListener('resize', () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const now = getViewport();
        if (now !== lastViewport) {
          if (now === 'mobile') {
            document.querySelectorAll('.particle').forEach(p => p.remove());
            window.particles = [];
          } else if (lastViewport === 'mobile') {
            initParticles();
          }
          shortenAddresses();
          lastViewport = now;
        }
        if (typeof window.AOS !== 'undefined') window.AOS.refresh();
      });
    }, { passive: true });
  }

  // ============================================================
  // AUDIENCE CAROUSEL (Hero rotation)
  // ============================================================
  function initAudienceCarousel() {
    const slides = document.querySelectorAll('.audience-slide');
    const dots = document.querySelectorAll('.audience-dot');
    if (!slides.length || !dots.length) return;

    let current = 0;
    let autoTimer = null;
    const INTERVAL = 8000;

    function show(index) {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      current = index;
    }

    function next() { show((current + 1) % slides.length); }

    function startAuto() {
      stopAuto();
      if (prefersReducedMotion()) return;
      autoTimer = setInterval(next, INTERVAL);
    }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); autoTimer = null; }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        show(i);
        startAuto();
      });
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    startAuto();
  }

  // ============================================================
  // WALLET BAR
  // ============================================================
  function initWalletBar() {
    const bar = document.getElementById('walletBar');
    if (!bar) return;
    // Auto-hide after 60s to avoid annoying users
    setTimeout(() => {
      if (bar.style.display !== 'none') bar.style.display = 'none';
    }, 60000);
  }

  // ============================================================
  // LOADER
  // ============================================================
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const minTime = isMobile() ? 800 : 1400;
    const start = performance.now();
    const progressBar = loader.querySelector('.progress-bar');

    const finish = () => {
      loader.classList.add('loaded');
      document.body.classList.add('loaded');
      setTimeout(() => { loader.style.display = 'none'; }, 500);
      document.dispatchEvent(new CustomEvent('pageLoaded', { detail: { timestamp: Date.now() } }));
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
      '.value-card, .step-card, .stat-card, .token-card, ' +
      '.contract-emphasis, .process-step, .video-card, .why-card, ' +
      '.creator-card, .roadmap-item, .live-stat, .journey-story-card';

    const els = document.querySelectorAll(selector);
    if (!els.length) return;

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
        setTimeout(() => target.classList.add('fade-in'), delay);
        observer.unobserve(target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      observer.observe(el);
    });

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
        floatingLogo.style.transform = `translateY(-12px) rotateY(${logoX}deg) rotateX(${logoY}deg)`;
        window.logoAnimationId = requestAnimationFrame(animate);
      }
      window.logoAnimationId = requestAnimationFrame(animate);
    }

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
      if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
      if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
      if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
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
  function shorten(address) {
    if (!address || address.length <= 20) return address;
    return `${address.slice(0, 8)}…${address.slice(-6)}`;
  }

  function shortenAddresses() {
    document.querySelectorAll('.contract-short').forEach(code => {
      const full = code.getAttribute('data-full') || code.textContent.trim();
      if (!full || full.length <= 20) return;
      code.textContent = shorten(full);
    });
  }

  function initContractAddresses() { shortenAddresses(); }

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
    } else {
      codeEl.textContent = shorten(full);
      if (icon) icon.className = 'fas fa-expand-alt';
    }
  }

  // ============================================================
  // COPY TO CLIPBOARD
  // ============================================================
  function handleCopyClick(e) {
    e.preventDefault();
    const button = e.currentTarget;

    if (button.classList.contains('copy-contract-btn')) {
      copyToClipboard(REBL_CONTRACT)
        .then(() => { showNotification('✅ $REBL address copied!', 'success'); showCopyFeedback(button, true); })
        .catch(() => { showNotification('❌ Failed to copy', 'error'); showCopyFeedback(button, false); });
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
      .catch(() => { showNotification('❌ Failed to copy', 'error'); showCopyFeedback(button, false); });
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
    button.innerHTML = success
      ? '<i class="fas fa-check"></i> Copied!'
      : '<i class="fas fa-times"></i> Failed';
    button.style.background = success ? '#4CAF50' : '#f44336';
    button.style.color = 'white';
    setTimeout(() => {
      button.innerHTML = orig;
      button.style.background = bg;
      button.style.color = color;
    }, 1800);
  }

  function initCopyButtons() {
    document.querySelectorAll('.copy-btn, .copy-contract-btn').forEach(btn => {
      btn.addEventListener('click', handleCopyClick);
    });
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
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const colors = { success: 'rgba(76,175,80,0.95)', error: 'rgba(244,67,54,0.95)', warning: 'rgba(255,193,7,0.95)', info: 'rgba(33,150,243,0.95)' };
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
      border-radius: 12px;
      display: flex; align-items: center; gap: 12px;
      z-index: 10000;
      animation: slideDownIn 0.3s ease;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.15);
      max-width: min(92vw, 380px);
      pointer-events: none;
      font-size: 0.9rem;
      font-family: 'Montserrat', sans-serif;
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
      const headerH = header ? header.offsetHeight : 60;
      const top = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: top - headerH - 16,
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
    const count = Math.min(24, Math.floor(window.innerWidth / 45));
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
    const opacity = Math.random() * 0.25 + 0.1;
    const drift = (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 40 + 10) + 'px';
    p.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: rgba(${r}, ${g}, 255, ${opacity});
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
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(${drift}, -100vh); opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }
    container.appendChild(p);
    return p;
  }

  // ============================================================
  // LOGO
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
        logo.style.filter = 'drop-shadow(0 0 30px rgba(212,167,106,0.8)) brightness(1.15)';
      });
      logo.addEventListener('mouseleave', () => {
        logo.style.filter = 'drop-shadow(0 0 20px rgba(212,167,106,0.5))';
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
      '.step-btn, .step-btn-mini, .creator-cta, .wallet-connect-btn'
    );
    targets.forEach(el => {
      if (el.offsetHeight && el.offsetHeight < 44) el.style.minHeight = '44px';
      if (el.offsetWidth && el.offsetWidth < 44) el.style.minWidth = '44px';
    });
  }

  function initTouchInteractions() {
    if (!('ontouchstart' in window)) return;
    document.querySelectorAll('.contract-address code').forEach(code => {
      let pressTimer = null;
      const start = () => {
        pressTimer = setTimeout(() => {
          const full = code.getAttribute('data-full') || code.textContent.trim();
          copyToClipboard(full)
            .then(() => showNotification('✅ Address copied!', 'success'))
            .catch(() => showNotification('❌ Copy failed', 'error'));
          code.style.backgroundColor = 'rgba(76,175,80,0.2)';
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
    const walletType = detectWallet();
    document.querySelectorAll('.wallet-action').forEach(button => {
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
        setTimeout(() => { this.innerHTML = original; this.disabled = false; }, 2200);
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

  // ============================================================
  // EFFECTS
  // ============================================================
  function initValueCardEffects() {
    if (isMobile()) return;
    document.querySelectorAll('.value-card, .why-card, .creator-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  }

  function initFormulaAnimation() {
    const formula = document.querySelector('.asset-types-formula, .three-asset-formula');
    if (!formula || prefersReducedMotion()) return;
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

  window.addEventListener('load', function () {
    document.documentElement.classList.add('page-loaded');
    document.dispatchEvent(new CustomEvent('rebelinux:pageReady', {
      detail: { timestamp: Date.now(), page: 'index', version: '4.0', viewport: getViewport() }
    }));
    console.log('✅ RebelInuX v4.0 initialized');
  });

  window.addEventListener('error', function (e) {
    console.error('❌ Error:', e.error);
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: e.error?.message || 'Unknown', fatal: true
      });
    }
  });

  // ============================================================
  // PUBLIC API
  // ============================================================
  window.RebelInuX = {
    copyToClipboard,
    addToWallet,
    showNotification,
    toggleContractView,
    copyContractAddress,
    detectWallet,
    getViewport,
    isMobile,
    isTablet,
    isDesktop,
    REBL_CONTRACT,
    REBELINUX_CONTRACT,
    version: '4.0'
  };

  // Globals for inline onclick
  window.copyToClipboard     = copyToClipboard;
  window.toggleContractView  = toggleContractView;
  window.addToWallet         = addToWallet;
  window.copyContractAddress = copyContractAddress;
  window.showNotification    = showNotification;

  console.log('🪙 RebelInuX JS v4.0 loaded');
})();
