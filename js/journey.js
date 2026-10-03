/* ============================================================
   JOURNEY PAGE — RebelInuX v3.0
   Handles: chapter filter, smooth scroll, lazy images, copy Zora links
   ============================================================ */

(function () {
  'use strict';

  // ---------- Chapter Filter ----------
  function initChapterFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.collectible-card');
    const emptyState = document.getElementById('collectiblesEmpty');

    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const chapter = btn.getAttribute('data-chapter');

        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        let visibleCount = 0;
        cards.forEach((card) => {
          const cardChapter = card.getAttribute('data-chapter');
          const shouldShow = chapter === 'all' || cardChapter === chapter;

          if (shouldShow) {
            card.classList.remove('hidden');
            visibleCount++;
          } else {
            card.classList.add('hidden');
          }
        });

        if (emptyState) {
          emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        if (window.AOS && typeof window.AOS.refresh === 'function') {
          window.AOS.refresh();
        }
      });
    });
  }

  // ---------- Smooth Scroll ----------
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

  // ---------- Image Error Fallback ----------
  function initImageFallbacks() {
    const images = document.querySelectorAll('.collectible-thumb img');
    images.forEach((img) => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        const parent = img.parentElement;
        if (parent && !parent.querySelector('.img-placeholder')) {
          const placeholder = document.createElement('div');
          placeholder.className = 'img-placeholder';
          placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(227, 184, 124, 0.15), rgba(139, 92, 246, 0.1));
            color: rgba(227, 184, 124, 0.6);
            font-size: 2rem;
            aspect-ratio: 16 / 10;
          `;
          placeholder.innerHTML = '<i class="fas fa-image"></i>';
          parent.appendChild(placeholder);
        }
      });
    });
  }

  // ---------- Keyboard Support ----------
  function initFilterKeyboard() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // ---------- Copy Zora Link on Right-Click ----------
  function initCopyZoraLinks() {
    const mintButtons = document.querySelectorAll('.action-btn.primary');
    mintButtons.forEach((btn) => {
      btn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('href');
        if (!url) return;
        navigator.clipboard.writeText(url)
          .then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i><span>Copied</span>';
            setTimeout(() => { btn.innerHTML = original; }, 1500);
          })
          .catch(() => {});
      });
    });
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    initChapterFilter();
    initSmoothScroll();
    initImageFallbacks();
    initFilterKeyboard();
    initCopyZoraLinks();
  });
})();
