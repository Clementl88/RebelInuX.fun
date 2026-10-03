// governance.js — Governance Portal page functionality (v3.0)

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initGovernancePage, 300);
});

function initGovernancePage() {
  console.log('Initializing Governance Portal page (v3.0)');

  initAOS();
  initAccordion();
  initStatsAnimation();
  initGovernanceHubReminder();
}

// ========== AOS ANIMATIONS ==========
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });

    window.addEventListener('resize', function () {
      AOS.refresh();
    });
  }
}

// ========== STATS ANIMATION ==========
function initStatsAnimation() {
  document.querySelectorAll('.stat-number').forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';

    setTimeout(() => {
      stat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      stat.style.opacity = '1';
      stat.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
}

// ========== FAQ ACCORDION ==========
function initAccordion() {
  const accordionItems = document.querySelectorAll('.faq-item');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const chevron = item.querySelector('.faq-chevron');

    if (!header || !content) return;

    header.style.cursor = 'pointer';

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          const otherChevron = otherItem.querySelector('.faq-chevron');
          if (otherContent) {
            otherContent.style.maxHeight = '0';
            otherContent.style.opacity = '0';
            otherContent.style.paddingTop = '0';
          }
          if (otherChevron) {
            otherChevron.style.transform = 'rotate(0deg)';
          }
        }
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = '500px';
        content.style.opacity = '1';
        content.style.paddingTop = 'var(--spacing-md)';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      } else {
        item.classList.remove('active');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.paddingTop = '0';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    });

    // Initialize as closed
    content.style.maxHeight = '0';
    content.style.opacity = '0';
    content.style.paddingTop = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'all 0.5s ease';

    if (chevron) {
      chevron.style.transition = 'transform 0.3s ease';
      chevron.style.transform = 'rotate(0deg)';
    }
  });

  // Auto-expand first FAQ item
  setTimeout(() => {
    const firstFaqItem = document.querySelector('.faq-item');
    if (firstFaqItem) {
      const firstHeader = firstFaqItem.querySelector('.faq-header');
      if (firstHeader) firstHeader.click();
    }
  }, 1000);
}

// ========== GOVERNANCE HUB REMINDER ==========
function initGovernanceHubReminder() {
  const reminderBtn = document.createElement('button');
  reminderBtn.className = 'cta-button';
  reminderBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 998;
    background: linear-gradient(135deg, #0088cc, #00ace6);
    padding: 12px 20px;
    border-radius: 30px;
    box-shadow: 0 4px 15px rgba(0, 136, 204, 0.4);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  reminderBtn.innerHTML = `
    <i class="fab fa-telegram"></i>
    <span>Join Governance Hub</span>
  `;

  reminderBtn.addEventListener('click', function () {
    const target = document.getElementById('governance-hub');
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });

  setTimeout(() => {
    if (document.getElementById('governance-hub')) {
      document.body.appendChild(reminderBtn);

      setTimeout(() => {
        if (reminderBtn.parentNode) {
          reminderBtn.style.transition = 'opacity 0.5s ease';
          reminderBtn.style.opacity = '0';
          setTimeout(() => {
            if (reminderBtn.parentNode) reminderBtn.parentNode.removeChild(reminderBtn);
          }, 500);
        }
      }, 30000);
    }
  }, 3000);
}

// ========== EXPORTS ==========
window.initGovernancePage = initGovernancePage;
