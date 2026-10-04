// community.js — Community Hub page (v3.0)

document.addEventListener('DOMContentLoaded', function () {
  console.log('Community Hub page initializing');
  setTimeout(initCommunityPage, 500);
});

function initCommunityPage() {
  initFAQAccordion();
  initScrollAnimations();
  initBackToTop();
  initAOS();
  initWelcomeToast();
}

// ========== FAQ ACCORDION ==========
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      toggleFAQItem(item);
    });

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', 'false');

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQItem(item);
      }
    });
  });

  if (faqItems.length > 0) {
    setTimeout(() => toggleFAQItem(faqItems[0], true), 1500);
  }
}

function toggleFAQItem(item, initial = false) {
  const isActive = item.classList.contains('active');

  if (!initial) {
    document.querySelectorAll('.faq-item.active').forEach((activeItem) => {
      if (activeItem !== item) {
        activeItem.classList.remove('active');
        activeItem.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (!isActive) {
    item.classList.add('active');
    item.setAttribute('aria-expanded', 'true');
  } else {
    item.classList.remove('active');
    item.setAttribute('aria-expanded', 'false');
  }
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

  const elementsToAnimate = document.querySelectorAll(
    '.social-card, .benefit-card, .voting-card, .guideline-item, .step-item, .faq-item, .related-card, .mission-highlight'
  );

  elementsToAnimate.forEach((el) => observer.observe(el));
}

// ========== BACK TO TOP ==========
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== AOS ==========
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      delay: 100,
      disable: function () { return window.innerWidth < 768; }
    });
    window.addEventListener('resize', () => AOS.refresh());
  }
}

// ========== WELCOME TOAST ==========
function initWelcomeToast() {
  const hasSeenWelcome = localStorage.getItem('community_welcome_seen');
  if (hasSeenWelcome) return;

  setTimeout(() => {
    showToast('Welcome to the RebelInuX Community Hub!', 'info');
    localStorage.setItem('community_welcome_seen', 'true');
  }, 2000);
}

// ========== TOAST ==========
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.rebel-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `rebel-toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-circle'
  };

  toast.innerHTML = `
    <i class="${icons[type] || icons.info}"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `;

  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50'
                : type === 'error' ? '#f44336'
                : type === 'warning' ? '#ff9800'
                : '#2196F3'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 350px;
    transform: translateY(100px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => hideToast(toast));

  const autoRemove = setTimeout(() => hideToast(toast), 4000);

  function hideToast(el) {
    clearTimeout(autoRemove);
    el.style.transform = 'translateY(100px)';
    el.style.opacity = '0';
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 300);
  }
}

// ========== EXPORTS ==========
window.RebelInuXCommunity = {
  init: initCommunityPage,
  showToast,
  toggleFAQ: toggleFAQItem
};

window.showToast = showToast;
