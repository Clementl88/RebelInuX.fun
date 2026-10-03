// trade.js — Trade page specific functionality (v3.0)

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
    setTimeout(initTradePage, 200);
  });
});

function initTradePage() {
  console.log('Initializing Trade page (v3.0)');
  initAOSWithDelay();
  initializeLiveData();
  initLogoExplanation();
}

// ========== AOS ==========
function initAOSWithDelay() {
  if (typeof AOS !== 'undefined') {
    setTimeout(function () {
      AOS.init({ duration: 800, once: true, offset: 100 });
    }, 200);
  }
}

// ========== LOGO EXPLANATION ==========
function initLogoExplanation() {
  document.querySelectorAll('.logo-section').forEach(section => {
    section.addEventListener('click', function () {
      const type = this.classList.contains('onchain') ? 'on-chain' : 'off-chain';
      const messages = {
        'on-chain': 'The original RebelInuX logo is permanently stored on the Solana blockchain. This cannot be changed due to blockchain immutability.',
        'off-chain': 'The updated RebelInuX logo represents our current brand identity and is used across websites, marketing materials, and centralized platforms.'
      };
      showToast(messages[type], 'info');
    });
  });
}

// ========== LIVE TRADING DATA ==========
let currentSolPrice = 0;

async function fetchLiveStatsData() {
  try {
    let marketData = {
      price: 0,
      priceChange: 0,
      marketCap: 0,
      volume: 0,
      liquidity: 0,
      success: false
    };

    try {
      const res = await fetch(
        'https://api.dexscreener.com/latest/dex/pairs/solana/Fyak2SY4vx2PnExMh87rJ7uGAVrhN3Z9SfZcJEMa7kyv',
        { method: 'GET', headers: { 'Accept': 'application/json' }, cache: 'no-cache' }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          marketData = {
            price: parseFloat(pair.priceUsd) || 0,
            priceChange: parseFloat(pair.priceChange?.h24) || 0,
            marketCap: parseFloat(pair.fdv) || 0,
            volume: parseFloat(pair.volume?.h24) || 0,
            liquidity: parseFloat(pair.liquidity?.usd) || 0,
            success: true
          };
        }
      }
    } catch (err) {
      console.error('DexScreener error:', err);
    }

    // SOL price — placeholder until a real endpoint is wired up
    currentSolPrice = 150;

    return {
      price: marketData.price,
      priceChange: marketData.priceChange,
      marketCap: marketData.marketCap,
      volume: marketData.volume,
      liquidity: marketData.liquidity,
      solPrice: currentSolPrice,
      lastUpdate: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      success: marketData.success
    };
  } catch (error) {
    console.error('Error in fetchLiveStatsData:', error);
    return { price: 0, priceChange: 0, marketCap: 0, volume: 0, liquidity: 0, solPrice: 0, lastUpdate: 'Error', success: false };
  }
}

function updateTradingDisplay(data) {
  function formatNumber(num, isCurrency = true) {
    if (num === 0 || isNaN(num)) return '—';
    if (num >= 1000000) return (isCurrency ? '$' : '') + (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (isCurrency ? '$' : '') + (num / 1000).toFixed(1) + 'K';
    return (isCurrency ? '$' : '') + num.toFixed(2);
  }

  function formatSmallNumber(num) {
    if (num === 0 || isNaN(num)) return '0.00';
    if (num < 0.000001) return num.toExponential(2);
    if (num < 0.0001) return num.toFixed(8);
    if (num < 0.01) return num.toFixed(6);
    return num.toFixed(4);
  }

  const priceEl = document.getElementById('current-price');
  if (priceEl) priceEl.textContent = data.price > 0 ? `$${formatSmallNumber(data.price)}` : '$0.00000000';

  const changeEl = document.getElementById('price-change');
  if (changeEl) {
    if (data.priceChange !== 0) {
      changeEl.textContent = `${data.priceChange >= 0 ? '+' : ''}${data.priceChange.toFixed(2)}%`;
      changeEl.className = data.priceChange >= 0 ? 'positive' : 'negative';
    } else {
      changeEl.textContent = '0.00%';
      changeEl.className = 'positive';
    }
  }

  const updates = {
    'market-cap': formatNumber(data.marketCap),
    'volume-24h': formatNumber(data.volume),
    'liquidity': formatNumber(data.liquidity),
    'last-updated-time': data.lastUpdate || 'Just now'
  };

  Object.entries(updates).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  const solEl = document.getElementById('sol-price');
  if (solEl && currentSolPrice > 0 && data.price > 0) {
    const reblPerSol = 1 / (data.price / currentSolPrice);
    solEl.textContent = formatNumber(reblPerSol, false);
  }

  const usdcEl = document.getElementById('usdc-price');
  if (usdcEl && data.price > 0) {
    const reblPerUsdc = 1 / data.price;
    usdcEl.textContent = formatNumber(reblPerUsdc, false);
  }

  const statusEl = document.getElementById('api-status');
  if (statusEl) {
    statusEl.textContent = data.success ? '✅ Live' : '⚠️ Cached';
    statusEl.style.background = data.success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)';
    statusEl.style.color = data.success ? '#4CAF50' : '#FF9800';
    statusEl.style.borderColor = data.success ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)';
  }

  // Update holders stat if present (DexScreener doesn't return holder count; keep placeholder text)
  const holdersEl = document.getElementById('holders');
  if (holdersEl && holdersEl.textContent === 'Loading...') {
    holdersEl.textContent = '—';
  }
}

async function initializeLiveData() {
  try {
    const data = await fetchLiveStatsData();
    updateTradingDisplay(data);

    setInterval(async () => {
      if (document.visibilityState === 'visible') {
        const newData = await fetchLiveStatsData();
        updateTradingDisplay(newData);
      }
    }, 30000);
  } catch (error) {
    console.error('Failed to initialize live data:', error);
  }
}

// ========== GLOBAL REFRESH ==========
window.refreshAllData = async function (event) {
  const button = document.querySelector('.refresh-button');
  const isManualClick = button && event && event.type === 'click';

  if (isManualClick) {
    var originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
    button.disabled = true;
  }

  try {
    const data = await fetchLiveStatsData();
    updateTradingDisplay(data);

    if (isManualClick) {
      button.innerHTML = '<i class="fas fa-check"></i> Updated!';
      button.style.background = '#4CAF50';
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.background = '';
      }, 1500);
    }
  } catch (error) {
    console.error('Error refreshing data:', error);
    if (isManualClick) {
      button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
      button.style.background = 'var(--rebel-red)';
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.background = '';
      }, 2000);
    }
  }
};

// ========== COPY CONTRACT ==========
function copyContractFull(event) {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;

  navigator.clipboard.writeText(contractAddress).then(() => {
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#4CAF50';
    showToast('Contract address copied to clipboard!', 'success');
    setTimeout(() => { button.innerHTML = originalHTML; button.style.background = ''; }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    button.innerHTML = '<i class="fas fa-times"></i> Failed';
    button.style.background = '#f44336';
    showToast('Failed to copy. Please try again.', 'error');
    setTimeout(() => { button.innerHTML = originalHTML; button.style.background = ''; }, 2000);
  });
}

// Small button in the contract-emphasis block
function copyContract(event) {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  navigator.clipboard.writeText(contractAddress).then(() => {
    showToast('Contract address copied!', 'success');
  }).catch(() => {
    showToast('Copy failed. Please copy manually.', 'error');
  });
}

// ========== ADD TO WALLET ==========
function addToWallet(event) {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;

  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  showToast('Check your wallet for token addition prompt', 'info');

  const instructions = `To add $REBL to your wallet:\n1. Open your wallet (Phantom, Solflare, etc.)\n2. Click "Add Token" or "Import Token"\n3. Paste this address: ${contractAddress}\n4. Confirm addition`;

  setTimeout(() => {
    alert(instructions);
    button.innerHTML = originalHTML;
  }, 300);
}

// ========== VERIFY ON ALL ==========
function verifyOnAll() {
  const links = [
    'https://solscan.io/token/F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump',
    'https://rugcheck.xyz/tokens/F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump',
    'https://dexscreener.com/solana/Fyak2SY4vx2PnExMh87rJ7uGAVrhN3Z9SfZcJEMa7kyv'
  ];

  links.forEach(link => window.open(link, '_blank'));
  showToast('Opening all verification platforms...', 'info');
}

// ========== QR CODE ==========
function generateQR() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(contractAddress)}`;

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.9); display: flex; align-items: center;
    justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease;
  `;

  modal.innerHTML = `
    <div style="background: var(--dark-bg); padding: var(--spacing-xl); border-radius: var(--border-radius);
                border: 2px solid var(--rebel-gold); text-align: center; max-width: 400px; width: 90%;">
      <h3 style="color: var(--rebel-gold); margin-bottom: var(--spacing-lg);">
        <i class="fas fa-qrcode"></i> Contract QR Code
      </h3>
      <div style="margin: var(--spacing-lg) 0;">
        <img src="${qrUrl}" alt="Contract QR Code" style="width: 200px; height: 200px; margin: 0 auto; border: 3px solid var(--rebel-gold); border-radius: 10px;">
      </div>
      <div style="font-size: 0.9em; color: #aaa; margin-bottom: var(--spacing-lg); max-width: 300px; margin-left: auto; margin-right: auto;">
        Scan this QR code with your wallet app to quickly add the $REBL contract.
      </div>
      <div style="display: flex; gap: var(--spacing-md); justify-content: center;">
        <button onclick="this.closest('div[style*=\\'position: fixed\\']').remove()"
                style="background: var(--rebel-red); color: white; border: none; border-radius: 25px;
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
          Close
        </button>
        <button onclick="downloadQR('${qrUrl}')"
                style="background: var(--rebel-gold); color: var(--dark-bg); border: none; border-radius: 25px;
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
          <i class="fas fa-download"></i> Download
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.remove();
  });

  if (!document.querySelector('#qr-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'qr-modal-styles';
    style.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
    document.head.appendChild(style);
  }
}

function downloadQR(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rebelinux-contract-qr.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('QR code downloaded!', 'success');
}

// ========== TOAST ==========
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;

  toast.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white; padding: 12px 24px; border-radius: 30px; display: flex;
    align-items: center; gap: 10px; font-weight: 600; z-index: 9999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); animation: slideUp 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

if (!document.querySelector('#toast-styles')) {
  const toastStyle = document.createElement('style');
  toastStyle.id = 'toast-styles';
  toastStyle.textContent = `
    @keyframes slideUp {
      from { transform: translateX(-50%) translateY(100px); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translateX(-50%) translateY(0); opacity: 1; }
      to { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
  `;
  document.head.appendChild(toastStyle);
}

// ========== EXPORTS ==========
window.copyContractFull = copyContractFull;
window.copyContract = copyContract;
window.addToWallet = addToWallet;
window.verifyOnAll = verifyOnAll;
window.generateQR = generateQR;
window.downloadQR = downloadQR;
window.refreshAllData = refreshAllData;
window.initTradePage = initTradePage;
