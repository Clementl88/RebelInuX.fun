// security-integrity.js — Security & Integrity page (v3.0)

function waitForComponents(callback, maxAttempts = 20) {
  let attempts = 0;

  const checkInterval = setInterval(function () {
    attempts++;

    if (window.componentsLoaded && typeof window.setupMobileNavigation === 'function') {
      clearInterval(checkInterval);
      callback();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      if (typeof window.initializeComponents === 'function') {
        window.initializeComponents();
      }
      callback();
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', function () {
  waitForComponents(function () {
    setTimeout(initSecurityIntegrityPage, 200);
  });
});

function initSecurityIntegrityPage() {
  console.log('Initializing Security & Integrity page (v3.0)');

  initAOS();
  initPrincipleCards();
  initCopyContract();
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

// ========== PRINCIPLE CARDS (mobile expand) ==========
function initPrincipleCards() {
  const principleCards = document.querySelectorAll('.principle-card');

  principleCards.forEach((card) => {
    card.addEventListener('click', function (e) {
      // Don't expand if a link/button inside was clicked
      if (e.target.closest('a') || e.target.closest('button')) return;

      if (window.innerWidth <= 768) {
        this.classList.toggle('expanded');
      }
    });
  });
}

// ========== COPY CONTRACT ==========
function initCopyContract() {
  // Buttons use inline onclick in HTML
}

function copyContract(event) {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;

  navigator.clipboard.writeText(contractAddress).then(() => {
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#4CAF50';
    button.style.transform = 'scale(0.95)';

    showToast('Contract address copied to clipboard!', 'success');

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
      button.style.transform = '';
    }, 2000);
  }).catch((err) => {
    console.error('Failed to copy: ', err);
    button.innerHTML = '<i class="fas fa-times"></i> Failed';
    button.style.background = '#f44336';
    showToast('Failed to copy. Please try again.', 'error');

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
    }, 2000);
  });
}

// ========== ADD TO WALLET ==========
function addToWallet(event) {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;

  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

  const instructions = `To add $REBL to your wallet:
1. Open your wallet (Phantom, Solflare, etc.)
2. Click "Add Token" or "Import Token"
3. Paste this address: ${contractAddress}
4. Confirm addition`;

  showToast('Check your wallet for token addition prompt', 'info');

  setTimeout(() => {
    alert(instructions);
    button.innerHTML = originalHTML;
  }, 200);
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const animatedElements = document.querySelectorAll(
    '.takeaway-item, .security-card, .practice-item, .audit-card, .faq-item, .related-card, .principle-card, .verification-stat, .tool-card'
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

// ========== TOAST ==========
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

// ========== EXPORTS ==========
window.copyContract = copyContract;
window.addToWallet = addToWallet;
window.showToast = showToast;
window.initSecurityIntegrityPage = initSecurityIntegrityPage;
