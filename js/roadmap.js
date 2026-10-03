// roadmap.js — Roadmap page functionality (v3.0)

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initRoadmapPage, 300);
});

function initRoadmapPage() {
  console.log('Initializing Roadmap page (v3.0)');

  initAOS();
  initProgressAnimations();
  initScrollAnimations();
  initBackToTop();
}

// ========== AOS ==========
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.innerWidth < 768 ? 'mobile' : false
    });

    window.addEventListener('resize', function () {
      AOS.refresh();
    });
  }
}

// ========== PROGRESS BARS ==========
function initProgressAnimations() {
  const progressBars = document.querySelectorAll('.progress-fill');

  progressBars.forEach((bar) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = '0%';

          setTimeout(() => {
            entry.target.style.transition = 'width 1.5s ease-in-out';
            entry.target.style.width = width;
          }, 300);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(bar);
  });
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const animatedElements = document.querySelectorAll(
    '.timeline-section, .principle-card, .milestone-highlight, .related-card, .takeaway-item, .stat-card, .focus-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
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

// ========== EXPORTS ==========
window.initRoadmapPage = initRoadmapPage;
