// js/whitepaper.js — Whitepaper download page functionality (v3.0)

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initWhitepaperPage, 300);
});

function initWhitepaperPage() {
  console.log('Initializing Whitepaper page (v3.0)');

  initializeMobileDropdown();
  initDownloadFunctionality();
  initAOS();
  initTouchEvents();
  updateFileSizeDisplay();
}

// ============================================================================
// DOWNLOAD BUTTONS
// ============================================================================
function initDownloadFunctionality() {
  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function () {
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
      this.classList.add('downloading');

      setTimeout(() => {
        this.innerHTML = originalText;
        this.classList.remove('downloading');
        trackDownload('whitepaper_pdf');
        showDownloadSuccess();
      }, 1500);
    });
  });
}

// ============================================================================
// FILE METADATA — single source of truth
// ============================================================================
const WHITEPAPER_META = {
  version: 'v3.0',
  published: 'October 2026',
  fileSize: '~299 KB',
  pages: '~34 Pages',
  fileName: 'RebelInuX_White_Paper_v3.0.pdf'
};

function updateFileSizeDisplay() {
  const infoValues = document.querySelectorAll('.info-value');
  infoValues.forEach(el => {
    const text = el.textContent.trim();
    if (text.includes('KB') || text.includes('MB')) {
      el.textContent = WHITEPAPER_META.fileSize;
    } else if (text.includes('Pages')) {
      el.textContent = WHITEPAPER_META.pages;
    } else if (text.includes('October')) {
      el.textContent = WHITEPAPER_META.published;
    }
  });
}

// ============================================================================
// DOCUMENT HASH / FILE INFO
// ============================================================================
function verifyDocumentHash() {
  const message =
    `📄 Document Verification\n\n` +
    `To verify document authenticity:\n\n` +
    `1. File Name: ${WHITEPAPER_META.fileName}\n` +
    `2. File Size: ${WHITEPAPER_META.fileSize}\n` +
    `3. Page Count: ${WHITEPAPER_META.pages}\n` +
    `4. Published: ${WHITEPAPER_META.published}\n` +
    `5. Version: ${WHITEPAPER_META.version}\n\n` +
    `Official cryptographic hash will be provided when available for complete verification.`;

  showToast('Verification information shown', 'info');
  setTimeout(() => {
    alert(message);
  }, 100);

  trackDownload('whitepaper_verify_hash');
}

function showDocumentInfo() {
  const info =
    `📄 RebelInuX Whitepaper Information\n\n` +
    `• Version: ${WHITEPAPER_META.version}\n` +
    `• Pages: ${WHITEPAPER_META.pages}\n` +
    `• File Size: ${WHITEPAPER_META.fileSize}\n` +
    `• Format: PDF\n` +
    `• Published: ${WHITEPAPER_META.published}\n` +
    `• Language: English\n\n` +
    `📋 Key Sections:\n` +
    `1. Abstract & Executive Summary\n` +
    `2. AI-Animated Historical Art\n` +
    `3. The Participation System\n` +
    `4. Tokenomics\n` +
    `5. Cross-Chain Value Acceleration\n` +
    `6. REBL Governance Hub\n` +
    `7. Decentralization & Security\n` +
    `8. Roadmap 2025–2027\n` +
    `9. Risk Assessment & Legal Disclaimers\n\n` +
    `🎯 Core Topics:\n` +
    `• Multi-chain architecture (Solana + ZORA/Base)\n` +
    `• Participation-based rewards via contests\n` +
    `• Three contest types: Thumbnail, Tokenization, Journey\n` +
    `• Rebel Journey Collectibles (content coins on Zora)\n` +
    `• Governance Hub (500K $REBL, 1 member = 1 vote)\n` +
    `• Contract renouncement details\n` +
    `• Vesting schedules\n` +
    `• Restricted jurisdictions`;

  showToast('Document information shown', 'info');
  setTimeout(() => {
    alert(info);
  }, 100);

  trackDownload('whitepaper_info');
}

// ============================================================================
// PRINT & VIEW ONLINE
// ============================================================================
function printDocument() {
  showToast('Opening print dialog...', 'info');

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://rebelinux.fun/' + WHITEPAPER_META.fileName;
  document.body.appendChild(iframe);

  iframe.onload = function () {
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 1000);
  };

  trackDownload('whitepaper_print');
}

function viewWhitepaperOnline() {
  const pdfUrl = 'https://rebelinux.fun/' + WHITEPAPER_META.fileName;
  const url = 'https://docs.google.com/viewer?url=' + encodeURIComponent(pdfUrl);

  window.open(url, '_blank', 'noopener,noreferrer');

  trackDownload('whitepaper_view_online');
  showToast('Opening whitepaper in new tab...', 'info');
}

// ============================================================================
// TRACKING (localStorage only)
// ============================================================================
function trackDownload(type) {
  console.log(`Download tracked: ${type} - ${new Date().toISOString()}`);
  console.log(`File: ${WHITEPAPER_META.fileName} (${WHITEPAPER_META.fileSize}, ${WHITEPAPER_META.pages}, ${WHITEPAPER_META.version})`);

  try {
    const downloads = JSON.parse(localStorage.getItem('rebelinux_downloads') || '[]');
    downloads.push({
      type: type,
      file: WHITEPAPER_META.fileName,
      size: WHITEPAPER_META.fileSize,
      pages: WHITEPAPER_META.pages,
      version: WHITEPAPER_META.version,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    localStorage.setItem('rebelinux_downloads', JSON.stringify(downloads));
  } catch (e) {
    // localStorage may be disabled — fail silently
  }
}

function showDownloadSuccess() {
  showToast('✅ Whitepaper download started!', 'success');

  setTimeout(() => {
    showToast('Check your downloads folder', 'info');

    console.info('%c📥 Whitepaper Download Complete!', 'color: #4CAF50; font-weight: bold;');
    console.info(`File: ${WHITEPAPER_META.fileName}`);
    console.info(`Size: ${WHITEPAPER_META.fileSize} | Pages: ${WHITEPAPER_META.pages} | Version: ${WHITEPAPER_META.version}`);
    console.info(`Published: ${WHITEPAPER_META.published}`);
  }, 1000);
}

// ============================================================================
// AOS
// ============================================================================
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

// ============================================================================
// TOUCH EVENTS
// ============================================================================
function initTouchEvents() {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('touchstart', function () {
      this.classList.add('touch-active');
    });

    element.addEventListener('touchend', function () {
      this.classList.remove('touch-active');
    });

    element.addEventListener('touchcancel', function () {
      this.classList.remove('touch-active');
    });
  });
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle'
                  : type === 'error' ? 'exclamation-triangle'
                  : type === 'warning' ? 'exclamation-circle'
                  : 'info-circle'}"></i>
    <span>${message}</span>
  `;

  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50'
                : type === 'error' ? '#f44336'
                : type === 'warning' ? '#FF9800'
                : '#2196F3'};
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
    white-space: normal;
    text-align: center;
    line-height: 1.4;
  `;

  document.body.appendChild(toast);

  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to   { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to   { transform: translateX(-50%) translateY(100px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  const duration = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 5000
    : 4000;

  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// ============================================================================
// MOBILE DROPDOWN (called from initWhitepaperPage)
// ============================================================================
function initializeMobileDropdown() {
  // Placeholder — kept for compatibility with init sequence.
  // The header dropdown is handled by includes.js + common.js.
}

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================
window.verifyDocumentHash = verifyDocumentHash;
window.showDocumentInfo = showDocumentInfo;
window.printDocument = printDocument;
window.viewWhitepaperOnline = viewWhitepaperOnline;
window.showToast = showToast;

// ============================================================================
// TOUCH-ACTIVE + DOWNLOADING STYLES
// ============================================================================
document.addEventListener('DOMContentLoaded', function () {
  const style = document.createElement('style');
  style.textContent = `
    .touch-active {
      opacity: 0.7 !important;
      transform: scale(0.98) !important;
      transition: all 0.1s ease !important;
    }
    .download-btn.downloading {
      opacity: 0.7;
      cursor: not-allowed;
      animation: none !important;
    }
    .download-btn.downloading:hover {
      transform: none !important;
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    const downloadCard = document.querySelector('.download-card');
    if (downloadCard) {
      downloadCard.style.animation = 'none';
    }
  }, 2000);
});
