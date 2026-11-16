/**
 * ============================================================
 * REBELINUX — PRO HOME PAGE JAVASCRIPT
 * v5.3 · Mobile-First · Zora Only
 * ============================================================
 */

(function () {
  'use strict';

  const BP_TABLET = 600;
  const BP_DESKTOP = 992;

  // We only keep the Zora contract now
  const REBELINUX_CONTRACT = '0xf95beeF6439ec38fA757238Cdec8417ABDA536bd';

  const getViewport = () => {
    const w = window.innerWidth;
    if (w < BP_TABLET) return 'mobile';
    if (w < BP_DESKTOP) return 'tablet';
    return 'desktop';
  };
  const isMobile  = () => getViewport() === 'mobile';
  const isTablet  = () => getViewport() === 'tablet';
  const isDesktop = () => getViewport() === 'desktop';
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // BOOT
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 RebelInuX v5.3 (Zora Edition) — Initializing...');
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
      initVideoModal,
      initYouTubeThumbnails,
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
  // YOUTUBE THUMBNAILS
  // ============================================================
  function initYouTubeThumbnails() {
    const triggers = document.querySelectorAll('[data-video-open][data-video-id]');
    triggers.forEach(trigger => {
      const videoId = trigger.getAttribute('data-video-id');
      if (!videoId || videoId.startsWith('VIDEO_ID_')) return;

      const thumbWrap =
        trigger.querySelector('.video-thumb') ||
        trigger.querySelector('.gallery-thumb');
      if (!thumbWrap) return;
      if (thumbWrap.querySelector('img.yt-thumb')) return;

      const img = document.createElement('img');
      img.className = 'yt-thumb';
      img.alt = trigger.getAttribute('data-video-title') || 'Video thumbnail';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';

      const qualities = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];
      let qualityIndex = 0;

      const tryNext = () => {
        if (qualityIndex >= qualities.length) {
          img.remove();
          return;
        }
        const q = qualities[qualityIndex++];
        img.src = `https://i.ytimg.com/vi/${videoId}/${q}.jpg`;
      };

      img.addEventListener('load', () => {
        if (img.naturalWidth <= 120 && qualityIndex < qualities.length) {
          tryNext();
          return;
        }
        img.classList.add('yt-thumb--loaded');
        thumbWrap.classList.add('has-thumbnail');
        thumbWrap.style.setProperty('--thumb-bg', `url("${img.src}")`);
      });

      img.addEventListener('error', tryNext);

      const placeholder = thumbWrap.querySelector(
        '.video-placeholder, .gallery-placeholder'
      );
      if (placeholder) {
        thumbWrap.insertBefore(img, placeholder);
      } else {
        thumbWrap.insertBefore(img, thumbWrap.firstChild);
      }

      tryNext();
    });
  }

  // ============================================================
  // VIDEO MODAL
  // ============================================================
  let lastFocusedElement = null;

  function initVideoModal() {
    const modal = document.getElementById('videoModal');
    if (!modal) return;

    const frame = document.getElementById('videoModalFrame');
    const label = document.getElementById('videoModalLabel');
    const desc = document.getElementById('videoModalDesc');
    const ytLink = document.getElementById('videoModalYT');
    const loading = document.getElementById('videoModalLoading');

    document.querySelectorAll('[data-video-open]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const videoId = trigger.getAttribute('data-video-id');
        const title = trigger.getAttribute('data-video-title') || 'Journey Chapter';
        const description = trigger.getAttribute('data-video-desc') || '';
        openVideoModal({ videoId, title, description });
      });
    });

    modal.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', closeVideoModal);
    });

    const shareBtn = modal.querySelector('[data-share-video]');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = ytLink ? ytLink.href : window.location.href;
        const shareData = {
          title: label ? label.textContent : 'RebelInuX Journey',
          text: desc ? desc.textContent : 'Watch the Journey',
          url
        };
        if (navigator.share) {
          navigator.share(shareData).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            if(window.showNotification) window.showNotification('🔗 Link copied!', 'success');
          });
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeVideoModal();
      }
    });

    function openVideoModal({ videoId, title, description }) {
      if (!videoId || !frame) return;
      lastFocusedElement = document.activeElement;
      frame.innerHTML = '';
      if (loading) loading.style.display = 'flex';
      if (label) label.textContent = title;
      if (desc) desc.textContent = description || '';

      const origin = encodeURIComponent(window.location.origin || 'https://rebelinux.fun');
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=${origin}`;
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

      if (ytLink) ytLink.href = watchUrl;

      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'eager');
      iframe.setAttribute('title', title);
      iframe.addEventListener('load', () => {
        if (loading) loading.style.display = 'none';
      });

      frame.appendChild(iframe);
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('video-modal-open');

      const closeBtn = modal.querySelector('.video-modal-close');
      if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
    }

    function closeVideoModal() {
      if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('video-modal-open');
      setTimeout(() => { if (frame) frame.innerHTML = ''; }, 300);
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    window.RebelInuX = window.RebelInuX || {};
    window.RebelInuX.openVideoModal = openVideoModal;
    window.RebelInuX.closeVideoModal = closeVideoModal;
  }

  // ============================================================
  // SCROLL ANIMATIONS
  // ============================================================
  function initScrollAnimations() {
    const selector = [
      '.audience-card', '.pillar-card', '.partner-card', '.why-card',
      '.step-card', '.gallery-card', '.roadmap-item', '.live-stat',
      '.token-panel', '.chain-column', '.editorial-tag'
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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => { el.style.opacity = '0'; observer.observe(el); });
  }

  // ============================================================
  // PARALLAX
  // ============================================================
  function initParallaxEffects() {
    if (isMobile() || prefersReducedMotion()) return;
    const hero = document.querySelector('.page-hero--main');
    if (!hero) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          if (scrolled < hero.offsetHeight) {
            const pattern = hero.querySelector('.hero-background-pattern');
            if (pattern) pattern.style.transform = `translateY(${scrolled * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // PARTICLES
  // ============================================================
  function initParticles() {
    if (isMobile() || prefersReducedMotion()) return;
    const container = document.querySelector('.hero-particles');
    if (!container) return;
    const count = isTablet() ? 12 : 20;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 6 + 's';
      p.style.animationDuration = (Math.random() * 8 + 8) + 's';
      p.style.width = p.style.height = (Math.random() * 3 + 2) + 'px';
      container.appendChild(p);
    }
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          btn.classList.toggle('visible', window.pageYOffset > 600);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================================
  // CONTRACT & COPY HELPERS
  // ============================================================
  function initContractAddresses() {
    document.querySelectorAll('.contract-short').forEach(code => {
      if (!isMobile()) return;
      if (code.classList.contains('expanded')) return;
      const full = code.getAttribute('data-full') || code.textContent;
      code.textContent = full.slice(0, 8) + '…' + full.slice(-6);
    });
    shortenAddresses();
  }

  function shortenAddresses() {
    document.querySelectorAll('.contract-short').forEach(code => {
      if (code.classList.contains('expanded')) return;
      const full = code.getAttribute('data-full') || code.textContent;
      if (full.length > 20) code.textContent = full.slice(0, 8) + '…' + full.slice(-6);
    });
  }

  function initCopyButtons() {
    // Handled inline via window.copyToClipboard fallback
  }

  function initMobileOptimizations() {
    if (!isMobile()) return;
    document.documentElement.style.setProperty('--gutter', '1rem');
    document.querySelectorAll('button').forEach(btn => { if (btn.offsetHeight < 44) btn.style.minHeight = '44px'; });
  }

  function initTouchInteractions() {
    if (!isMobile()) return;
    document.querySelectorAll('.audience-card, .gallery-card, .pillar-card').forEach(card => {
      card.addEventListener('touchstart', () => { card.style.transform = 'scale(0.98)'; }, { passive: true });
      card.addEventListener('touchend', () => { card.style.transform = ''; }, { passive: true });
    });
  }

  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) return;
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            obs.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => observer.observe(img));
    }
  }

  function initPerformanceObservers() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) console.warn(`⚠️ Slow ${entry.name}: ${entry.duration.toFixed(0)}ms`);
          });
        });
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) { /* silent */ }
    }
  }

  function initWalletDetection() {
    // Placeholder if needed for Base/Zora
  }

  function initWalletBar() {
    // Placeholder if needed for Base/Zora
  }

  function initHoverEffects() {
    if (isMobile()) return;
    document.querySelectorAll('.cta-button, .audience-cta, .partner-cta').forEach(btn => {
      btn.addEventListener('mouseenter', () => { btn.style.transition = 'all 0.25s ease'; });
    });
  }

})();
