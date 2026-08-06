/// js/includes.js - Load header and footer components with enhanced error handling

// Global state to track component loading
window.componentsLoaded = false;
window.componentsLoading = false;
window.componentsError = false;
window.commonJsReady = false;

// Configuration
const COMPONENTS_CONFIG = {
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 5000,
  commonJsMaxRetries: 5,
  commonJsRetryDelay: 500
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
    
    // Wait for common.js to be ready, then initialize
    await waitForCommonJs();
    
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

// Wait for common.js to be ready
function waitForCommonJs() {
  return new Promise((resolve) => {
    // Check if common.js is already loaded
    if (window.commonJsReady && typeof initializeCommon === 'function') {
      console.log('✅ common.js already loaded and ready');
      resolve();
      return;
    }
    
    // Check if setupMobileNavigation exists as a function
    if (typeof setupMobileNavigation === 'function' && 
        typeof setupDropdowns === 'function' && 
        typeof setActiveNavItem === 'function') {
      window.commonJsReady = true;
      console.log('✅ common.js functions detected');
      resolve();
      return;
    }
    
    // If common.js exists but isn't initialized yet, wait for it
    console.log('⏳ Waiting for common.js to initialize...');
    
    // Listen for the components:initialized event from common.js
    const onInitialized = function() {
      document.removeEventListener('components:initialized', onInitialized);
      window.commonJsReady = true;
      console.log('✅ common.js initialized (via event)');
      resolve();
    };
    
    document.addEventListener('components:initialized', onInitialized);
    
    // Also check periodically if functions become available
    let attempts = 0;
    const maxAttempts = COMPONENTS_CONFIG.commonJsMaxRetries;
    
    const checkFunctions = setInterval(() => {
      attempts++;
      
      if (typeof setupMobileNavigation === 'function' && 
          typeof setupDropdowns === 'function' && 
          typeof setActiveNavItem === 'function') {
        clearInterval(checkFunctions);
        document.removeEventListener('components:initialized', onInitialized);
        window.commonJsReady = true;
        console.log('✅ common.js functions detected (polling)');
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkFunctions);
        // If we still can't find functions, try to load common.js manually
        console.warn('⚠️ common.js not detected, attempting to load...');
        loadCommonJs().then(() => {
          window.commonJsReady = true;
          resolve();
        }).catch(() => {
          console.error('❌ Failed to load common.js');
          // Try to initialize with whatever is available
          resolve();
        });
      }
    }, COMPONENTS_CONFIG.commonJsRetryDelay);
    
    // Set a timeout to prevent hanging
    setTimeout(() => {
      clearInterval(checkFunctions);
      // If we haven't resolved by now, check one more time
      if (!window.commonJsReady) {
        if (typeof setupMobileNavigation === 'function') {
          window.commonJsReady = true;
          console.log('✅ common.js functions available (timeout fallback)');
          resolve();
        } else {
          console.warn('⚠️ common.js still not ready after timeout');
          resolve();
        }
      }
    }, COMPONENTS_CONFIG.commonJsMaxRetries * COMPONENTS_CONFIG.commonJsRetryDelay + 2000);
  });
}

// Load common.js dynamically if needed
function loadCommonJs() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.commonJsReady) {
      resolve();
      return;
    }
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="common.js"]');
    if (existingScript) {
      console.log('✅ common.js script already in DOM, waiting...');
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (typeof setupMobileNavigation === 'function') {
          clearInterval(checkInterval);
          window.commonJsReady = true;
          resolve();
        }
      }, 200);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window.commonJsReady) {
          resolve();
        } else {
          reject(new Error('common.js script found but not ready'));
        }
      }, 5000);
      
      return;
    }
    
    // Load script
    console.log('📥 Loading common.js dynamically...');
    const script = document.createElement('script');
    script.src = 'js/common.js';
    script.async = false; // Load synchronously for reliability
    
    script.onload = () => {
      console.log('✅ common.js loaded dynamically');
      window.commonJsReady = true;
      
      // If common.js has an initialize function, call it
      if (typeof initializeCommon === 'function') {
        console.log('🔄 Calling initializeCommon...');
        initializeCommon();
      }
      
      resolve();
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load common.js dynamically');
      reject(new Error('Failed to load common.js'));
    };
    
    document.head.appendChild(script);
  });
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
      if (!window.commonJsReady) {
        console.log('🔄 common.js not ready, attempting to load...');
        loadCommonJs().then(() => {
          console.log('✅ common.js loaded, retrying initialization...');
          setTimeout(initializeComponents, 200);
        }).catch(() => {
          console.error('❌ Failed to load common.js, skipping initialization');
        });
        return;
      }
    }
    
    // Initialize in correct order
    if (typeof setupHeaderScrollEffect === 'function') {
      console.log('🔧 Setting up header scroll effect...');
      setupHeaderScrollEffect();
    }
    
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
    
    if (typeof setupBackToTop === 'function') {
      console.log('🔧 Setting up back to top...');
      setupBackToTop();
    }
    
    // If initializeCommon exists, call it as a fallback
    if (typeof initializeCommon === 'function' && !window._commonInitialized) {
      console.log('🔧 Calling initializeCommon as fallback...');
      initializeCommon();
      window._commonInitialized = true;
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
  // Remove existing error alert if present
  const existingAlert = document.getElementById('components-error-alert');
  if (existingAlert) existingAlert.remove();
  
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
    const alert = document.getElementById('components-error-alert');
    if (alert) {
      alert.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => alert.remove(), 300);
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
  
  // Check if common.js is already loaded
  if (typeof setupMobileNavigation === 'function') {
    window.commonJsReady = true;
    console.log('✅ common.js already loaded');
  }
  
  // Start loading components
  setTimeout(() => {
    loadAllComponents();
  }, 100);
});

// Handle window load (when all resources are loaded)
window.addEventListener('load', function() {
  console.log('🌐 Window fully loaded');
  
  // If components haven't loaded yet, try to initialize
  if (window.componentsLoaded && !window._componentsInitialized) {
    window._componentsInitialized = true;
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
window.loadCommonJs = loadCommonJs;
window.waitForCommonJs = waitForCommonJs;

// Global component state access
Object.defineProperty(window, 'componentState', {
  get: function() {
    return {
      loaded: window.componentsLoaded,
      loading: window.componentsLoading,
      error: window.componentsError,
      commonJsReady: window.commonJsReady
    };
  }
});
