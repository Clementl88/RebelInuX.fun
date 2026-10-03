/* ============================================================
   CONTESTS PAGE — RebelInuX v3.0
   Handles: FAQ accordion, smooth scroll, active contest CTAs
   ============================================================ */

(function () {
  'use strict';

  // ---------- FAQ Accordion ----------
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const button = item.querySelector('.faq-question');
      if (!button) return;

      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all (accordion behavior — one open at a time)
        faqItems.forEach((other) => {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ---------- Smooth Scroll for internal links ----------
  function initSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const headerOffset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });
  }

  // ---------- Active Contest — Auto-Update Contest ID ----------
  function initActiveContestId() {
    const idEl = document.querySelector('.contest-id');
    if (!idEl) return;

    // Optional: uncomment if you want the ID to increment automatically
    // based on a stored counter in localStorage (useful when you open contests often)
    /*
    const stored = localStorage.getItem('rebelinux_contest_id');
    if (!stored) {
      localStorage.setItem('rebelinux_contest_id', '001');
    }
    idEl.textContent = '#' + (stored || '001');
    */
  }

  // ---------- Copy helpers (reused from homepage) ----------
  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const value = btn.getAttribute('data-copy');
        if (!value) return;

        navigator.clipboard.writeText(value)
          .then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => { btn.innerHTML = original; }, 1500);
          })
          .catch(() => {
            prompt('Copy manually:', value);
          });
      });
    });
  }

  // ---------- Highlight Active Contest on Scroll ----------
  function initSectionReveal() {
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    initFaqAccordion();
    initSmoothScroll();
    initActiveContestId();
    initCopyButtons();
    initSectionReveal();
  });
})();
