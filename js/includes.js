// js/includes.js - Load header and footer components with enhanced error handling

// Global state to track component loading
window.componentsLoaded = false;
window.componentsLoading = false;
window.componentsError = false;

// Configuration
const COMPONENTS_CONFIG = {
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 5000
};

// Load all components
async function loadAllComponents() {
  if (window.componentsLoading || window.componentsLoaded) return;
  
  window.componentsLoading = true;
  window.componentsError = false;
  
  console.log('🔄 Loading components...');
  
  try {
    const components = [];
    
    // Load header
    if (document.getElementById('header-container')) {
      components.push(loadComponent('header-container', 'header.html'));
    }
    
    // Load footer
    if (document.getElementById('footer-container')) {
      components.push(loadComponent('footer-container', 'footer.html'));
    }
    
    // Wait for all components to load
    await Promise.all(components);
    
    window.componentsLoaded = true;
    window.componentsLoading = false;
    
    console.log('✅ All components loaded successfully');
    
    // Initialize components after loading
    initializeComponents();
    
  } catch (error) {
    console.error('❌ Error loading components:', error);
    window.componentsLoading = false;
    window.componentsError = true;
    
    // Show user-friendly error messages
    showComponentErrors();
  }
}

// Load individual component with retry logic
async function loadComponent(elementId, url, attempt = 1) {
  try {
    console.log(`📥 Loading ${url} (attempt ${attempt}/${COMPONENTS_CONFIG.retryAttempts})...`);
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), COMPONENTS_CONFIG.timeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} loading ${url}`);
    }
    
    const html = await response.text();
    const container = document.getElementById(elementId);
    
    if (!container) {
      throw new Error(`Container #${elementId} not found`);
    }
    
    // Insert the HTML
    container.innerHTML = html;
    
    // Mark as loaded
    container.dataset.loaded = 'true';
    container.dataset.component = url.replace('.html', '');
    
    console.log(`✅ ${url} loaded into #${elementId}`);
    
    // Dispatch custom event
    container.dispatchEvent(new CustomEvent('component:loaded', {
      detail: { elementId, url }
    }));
    
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to load ${url}:`, error);
    
    // Retry logic
    if (attempt < COMPONENTS_CONFIG.retryAttempts) {
      console.log(`🔄 Retrying ${url} in ${COMPONENTS_CONFIG.retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, COMPONENTS_CONFIG.retryDelay));
      return loadComponent(elementId, url, attempt + 1);
    }
    
    // Show error message
    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = `
        <div class="component-error" style="
          padding: 20px;
          text-align: center;
          color: var(--rebel-red);
          background: rgba(215, 77, 77, 0.1);
          border-radius: 8px;
          margin: 10px;
          border: 1px solid rgba(215, 77, 77, 0.3);
        ">
          <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
          <strong>Failed to load ${url}</strong>
          <br>
          <small style="color: rgba(255, 255, 255, 0.7);">
            Please check your internet connection and try refreshing the page.
          </small>
          <br>
          <button onclick="window.location.reload()" style="
            margin-top: 10px;
            padding: 8px 16px;
            background: var(--rebel-red);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
          ">
            <i class="fas fa-sync-alt" style="margin-right: 5px;"></i>
            Retry Loading
          </button>
        </div>
      `;
    }
    
    throw error;
  }
}

// Initialize components after everything is loaded
function initializeComponents() {
  console.log('⚙️ Initializing components...');
  
  try {
    // Check if common.js functions are available
    const requiredFunctions = [
      'setupMobileNavigation',
      'setupDropdowns',
      'setActiveNavItem',
      'setupBackToTop',
      'setupBuyDropdown',
      'setupHeaderScrollEffect'
    ];
    
    const missingFunctions = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
    
    if (missingFunctions.length > 0) {
      console.warn('⚠️ Missing required functions:', missingFunctions);
      
      // Try to load common.js dynamically if missing
      if (!window.commonJsLoaded) {
        console.log('🔄 Attempting to load common.js dynamically...');
        loadScript('js/common.js');
        return;
      }
    }
    
    // Initialize in correct order
    if (typeof setupMobileNavigation === 'function') {
      console.log('🔧 Setting up mobile navigation...');
      setupMobileNavigation();
    }
    
    if (typeof setupDropdowns === 'function') {
      console.log('🔧 Setting up dropdowns...');
      setupDropdowns();
    }
    
    if (typeof setupBuyDropdown === 'function') {
      console.log('🔧 Setting up buy dropdown...');
      setupBuyDropdown();
    }
    
    if (typeof setActiveNavItem === 'function') {
      console.log('🔧 Setting active nav item...');
      setActiveNavItem();
    }
    
    if (typeof setupHeaderScrollEffect === 'function') {
      console.log('🔧 Setting up header scroll effect...');
      setupHeaderScrollEffect();
    }
    
    if (typeof setupBackToTop === 'function') {
      console.log('🔧 Setting up back to top...');
      setupBackToTop();
    }
    
    // Dispatch initialization complete event
    document.dispatchEvent(new CustomEvent('components:initialized'));
    
    console.log('✅ Components initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing components:', error);
  }
}

// Load external script dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    script.onload = () => {
      console.log(`✅ ${src} loaded`);
      window.commonJsLoaded = true;
      resolve();
    };
    
    script.onerror = () => {
      console.error(`❌ Failed to load ${src}`);
      reject(new Error(`Failed to load script: ${src}`));
    };
    
    document.head.appendChild(script);
  });
}

// Show component errors to user
function showComponentErrors() {
  const errorContainer = document.createElement('div');
  errorContainer.id = 'components-error-alert';
  errorContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--rebel-red);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;
  
  errorContainer.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 10px;">
      <i class="fas fa-exclamation-circle" style="font-size: 1.2rem; margin-top: 2px;"></i>
      <div>
        <strong>Connection Issue</strong>
        <p style="margin: 5px 0; font-size: 0.9rem; opacity: 0.9;">
          Some components failed to load. The site may not function properly.
        </p>
        <button onclick="this.closest('#components-error-alert').remove()" 
                style="background: rgba(255,255,255,0.2); border: none; color: white; 
                       padding: 5px 10px; border-radius: 4px; cursor: pointer; 
                       font-size: 0.8rem; margin-top: 5px;">
          Dismiss
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(errorContainer);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (errorContainer.parentNode) {
      errorContainer.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => errorContainer.remove(), 300);
    }
  }, 10000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .component-error {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// Handle page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM Content Loaded (includes.js)');
  
  // Start loading components
  setTimeout(() => {
    loadAllComponents();
  }, 100);
});

// Handle window load (when all resources are loaded)
window.addEventListener('load', function() {
  console.log('🌐 Window fully loaded');
  
  // If components haven't loaded yet, try to initialize
  if (window.componentsLoaded && typeof initializeComponents === 'function') {
    setTimeout(initializeComponents, 100);
  } else if (window.componentsError) {
    // If there was an error, try one more time
    console.log('🔄 Retrying component loading...');
    setTimeout(loadAllComponents, 2000);
  }
});

// Handle network status changes
window.addEventListener('online', function() {
  console.log('📶 Network connection restored');
  
  if (!window.componentsLoaded && !window.componentsLoading) {
    console.log('🔄 Retrying component loading...');
    loadAllComponents();
  }
});

// Export for debugging and external use
window.loadAllComponents = loadAllComponents;
window.loadComponent = loadComponent;
window.initializeComponents = initializeComponents;
window.showComponentErrors = showComponentErrors;

// Global component state access
Object.defineProperty(window, 'componentState', {
  get: function() {
    return {
      loaded: window.componentsLoaded,
      loading: window.componentsLoading,
      error: window.componentsError
    };
  }
});
