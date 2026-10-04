// whitepaper.js - Whitepaper download page functionality

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initWhitepaperPage, 300);
});

function initWhitepaperPage() {
  console.log('Initializing Whitepaper page');

  initializeMobileDropdown();
  initDownloadFunctionality();
  initAOS();
  initTouchEvents();
  updateFileSizeDisplay();
}

function initDownloadFunctionality() {
  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
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

function updateFileSizeDisplay() {
  const fileSizeElements = document.querySelectorAll('.info-value');
  fileSizeElements.forEach(el => {
    if (el.textContent.includes('MB') || el.textContent.includes('KB')) {
      el.textContent = '5.8 MB';
    }
    if (el.textContent.includes('Pages')) {
      el.textContent = '32 Pages';
    }
    if (el.textContent.includes('Published')) {
      el.textContent = 'October 23, 2025';
    }
  });
}

function verifyDocumentHash() {
  const hash = "SHA-256: [File hash will be provided when available]";
  const message = `📄 Document Verification\n\nTo verify document authenticity:\n\n1. File Name: RebelInuX_White_Paper.pdf\n2. File Size: 5.8 MB\n3. Page Count: 32 pages\n4. Published: October 23, 2025\n5. Version: 1.5\n\nOfficial cryptographic hash will be provided when available for complete verification.`;

  showToast('Verification information shown', 'info');
  setTimeout(() => {
    alert(message);
  }, 100);

  trackDownload('whitepaper_verify_hash');
}

function showDocumentInfo() {
  const info = `📄 RebelInuX Whitepaper Information\n\n• Version: 1.5\n• Pages: 32\n• File Size: 5.8 MB\n• Format: PDF\n• Published: October 23, 2025\n• Language: English\n\n📋 Key Sections:\n1. Abstract & Executive Summary\n2. Triple-Asset Ecosystem\n3. Token Economics\n4. DAO Governance Model\n5. Security & Decentralization\n6. Roadmap 2025-2026\n7. Risk Assessment & Legal Disclaimers\n\n🎯 Core Topics:\n• Multi-chain architecture (Solana + ZORA/Base)\n• Dual-governance system\n• Contract renouncement details\n• Vesting schedules\n• Restricted jurisdictions`;

  showToast('Document information shown', 'info');
  setTimeout(() => {
    alert(info);
  }, 100);

  trackDownload('whitepaper_info');
}

function printDocument() {
  showToast('Opening print dialog...', 'info');

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://rebelinux.fun/RebelInuX_White_Paper.pdf';
  document.body.appendChild(iframe);

  iframe.onload = function() {
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
  const url = 'https://docs.google.com/viewer?url=https://rebelinux.fun/RebelInuX_White_Paper.pdf';
  window.open(url, '_blank', 'noopener,noreferrer');

  trackDownload('whitepaper_view_online');
  showToast('Opening whitepaper in new tab...', 'info');
}

function trackDownload(type) {
  console.log(`Download tracked: ${type} - ${new Date().toISOString()}`);
  console.log(`File: RebelInuX_White_Paper.pdf (5.8 MB, 32 pages, v1.5)`);

  const downloads = JSON.parse(localStorage.getItem('rebelinux_downloads') || '[]');
  downloads.push({
    type: type,
    file: 'RebelInuX_White_Paper.pdf',
    size: '5.8 MB',
    pages: 32,
    version: '1.5',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
  localStorage.setItem('rebelinux_downloads', JSON.stringify(downloads));
}

function showDownloadSuccess() {
  showToast('✅ Whitepaper download started!', 'success');

  setTimeout(() => {
    const info = `📥 Download Tips:\n\n• Save the PDF to your preferred location\n• File size: 5.8 MB (32 pages)\n• Open with Adobe Reader or any PDF viewer\n• Recommended: Create a backup copy\n• Share with interested community members\n\n⚠️ Remember legal restrictions apply to certain jurisdictions.`;

    showToast('Check your downloads folder', 'info');

    console.info('%c📥 Whitepaper Download Complete!', 'color: #4CAF50; font-weight: bold;');
    console.info('File: RebelInuX_White_Paper.pdf');
    console.info('Size: 5.8 MB | Pages: 32 | Version: 1.5');
    console.info('Published: October 23, 2025');
  }, 1000);
}

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.innerWidth < 768 ? 'mobile' : false
    });

    window.addEventListener('resize', function() {
      AOS.refresh();
    });
  }
}

function initTouchEvents() {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    });

    element.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    });

    element.addEventListener('touchcancel', function() {
      this.classList.remove('touch-active');
    });
  });
}

function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 
                     type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;

  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : 
                type === 'warning' ? '#FF9800' : '#2196F3'};
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

  const duration = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 5000 : 4000;

  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

window.verifyDocumentHash = verifyDocumentHash;
window.showDocumentInfo = showDocumentInfo;
window.printDocument = printDocument;
window.viewWhitepaperOnline = viewWhitepaperOnline;
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', function() {
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
