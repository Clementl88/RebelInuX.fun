// js/artwork.js — Enhanced Artwork Gallery v3.0
// Aligned with RebelInuX Whitepaper v3.0 (participation model, no epoch/3-asset mechanics)

// ============================================================================
// INITIALIZATION — Wait for header/footer components to load
// ============================================================================
function waitForComponents(callback, maxAttempts = 20) {
  let attempts = 0;

  const checkInterval = setInterval(function () {
    attempts++;

    if (window.componentsLoaded && typeof window.setupMobileNavigation === 'function') {
      clearInterval(checkInterval);
      console.log('✅ Components ready, initializing artwork page');
      callback();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      console.warn('⚠️ Components not ready after timeout, forcing initialization');
      if (typeof window.initializeComponents === 'function') {
        window.initializeComponents();
      }
      callback();
    } else {
      console.log(`⏳ Waiting for components... (${attempts}/${maxAttempts})`);
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('📄 Artwork page DOM ready');
  waitForComponents(function () {
    setTimeout(initArtworkPage, 200);
  });
});

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================
function initArtworkPage() {
  console.log('🚀 Initializing Enhanced Artwork Gallery page (v3.0)');

  initAOSWithDelay();
  initGalleryInteractions();
  initFiltering();
  initArtworkModal();
  initFAQAccordion();
  initScrollAnimations();
  trackPageVisit();
}

// ============================================================================
// AOS ANIMATIONS
// ============================================================================
function initAOSWithDelay() {
  if (typeof AOS !== 'undefined') {
    setTimeout(function () {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        disable: window.innerWidth < 768 ? 'mobile' : false
      });
      window.addEventListener('resize', function () { AOS.refresh(); });
      console.log('✅ AOS initialized');
    }, 200);
  } else {
    console.log('⏳ Waiting for AOS to load...');
    let attempts = 0;
    const maxAttempts = 10;

    const checkAOS = setInterval(function () {
      attempts++;
      if (typeof AOS !== 'undefined') {
        clearInterval(checkAOS);
        AOS.init({ duration: 800, once: true, offset: 100 });
        window.addEventListener('resize', function () { AOS.refresh(); });
        console.log('✅ AOS initialized after loading');
      } else if (attempts >= maxAttempts) {
        clearInterval(checkAOS);
        console.warn('⚠️ AOS failed to load');
      }
    }, 100);
  }
}

// ============================================================================
// GALLERY NAVIGATION
// ============================================================================
function initGalleryInteractions() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================================================
// ARTWORK FILTERING (Contest Winners / Featured / Video)
// ============================================================================
function initFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const artworkCards = document.querySelectorAll('#artworkGallery .artwork-card');

  if (!filterBtns.length || !artworkCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;

      artworkCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================
function initFAQAccordion() {
  console.log('📋 Initializing FAQ accordion');

  const faqItems = document.querySelectorAll('#faq .faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    item.removeEventListener('click', handleFAQClick);
    item.addEventListener('click', handleFAQClick);
  });

  document.querySelectorAll('.faq-chevron').forEach(chevron => {
    chevron.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  console.log(`✅ FAQ accordion initialized with ${faqItems.length} items`);
}

function handleFAQClick(e) {
  const isLink =
    e.target.tagName === 'A' ||
    e.target.closest('a') ||
    e.target.tagName === 'BUTTON' ||
    e.target.closest('.cta-button') ||
    e.target.closest('button');

  if (isLink) {
    e.stopPropagation();
    return;
  }

  this.classList.toggle('active');
}

// ============================================================================
// ARTWORK MODAL (View Details lightbox)
// ============================================================================
function initArtworkModal() {
  const modal = document.getElementById('artworkModal');
  const modalClose = document.getElementById('modalClose');
  const viewButtons = document.querySelectorAll('.view-artwork');

  // If modal doesn't exist in HTML, wire up a lightweight fallback
  if (!modal) {
    viewButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const link = this.getAttribute('data-link');
        if (link) {
          window.open(link, '_blank', 'noopener,noreferrer');
        }
      });
    });
    return;
  }

  viewButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const image = this.getAttribute('data-image');
      const title = this.getAttribute('data-title');
      const artist = this.getAttribute('data-artist');
      const description = this.getAttribute('data-description');
      const link = this.getAttribute('data-link');

      const imgEl = document.getElementById('modalImage');
      const titleEl = document.getElementById('modalTitle');
      const artistEl = document.getElementById('modalArtist');
      const descEl = document.getElementById('modalDescription');
      const linkEl = document.getElementById('modalLink');

      if (imgEl) { imgEl.src = image; imgEl.alt = title; }
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = description || 'Award-winning RebelInuX artwork';
      if (linkEl) linkEl.href = link || 'https://zora.co/@rebelinux';

      if (artistEl) {
        const handle = (artist || '@rebelinux').replace('@', '').split(' ')[0];
        const initial = handle.charAt(0).toUpperCase();
        artistEl.innerHTML = `
          <div class="artist-info">
            <div class="artist-avatar">${initial}</div>
            <span>by <a href="https://x.com/${handle}" target="_blank" rel="noopener noreferrer" class="artist-link">${artist || '@rebelinux'}</a></span>
          </div>
        `;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', function () {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.artwork-card, .faq-item, .related-card, .brand-card, .guideline, .benefit-card, .cross-link-card'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }
}

// ============================================================================
// PAGE VISIT TRACKING (localStorage only — no external calls)
// ============================================================================
function trackPageVisit() {
  try {
    const visitCount = parseInt(localStorage.getItem('artwork_visits') || '0', 10);
    localStorage.setItem('artwork_visits', String(visitCount + 1));

    if (visitCount === 0) {
      setTimeout(() => {
        showToast('🎨 Welcome to the RebelInuX Art Gallery!', 'info', 5000);
      }, 2000);
    }
  } catch (err) {
    // localStorage may be disabled — fail silently
  }
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================
function showToast(message, type = 'info', duration = 3000) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;

  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
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
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

  document.body.appendChild(toast);

  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================
window.initArtworkPage = initArtworkPage;
window.showToast = showToast;
