// common.js - Fixed dropdown issue with single source of truth

// ========== GLOBAL STATE ==========
let isMobileMenuOpen = false;
let isDropdownOpen = false;
let lastClickedDropdown = null;

// ========== DYNAMIC PAGE SUBTITLES ==========
const PAGE_SUBTITLES = {
    // Main pages
    'index.html': 'AI-Animated Historical Journey Collectibles',
    'trade.html': 'Trade & Exchange Guide',
    'epoch-rewards.html': 'Reward System Dashboard',
    'tokenomics.html': 'Tokenomics & Distribution',
    'community.html': 'Community Hub & Links',
    'security-integrity.html': 'Security & Integrity Protocols',
    'whitepaper.html': 'Project Documentation',
    'rebl-calculator.html': 'Reward Calculator Tool',
    'governance.html': 'Governance & Voting',
    'roadmap.html': 'Development Roadmap',
    'artwork.html': 'Art & Media Gallery',
    
    // Handle root/index pages
    'index': 'AI-Animated Historical Journey Collectibles',
    '/': 'AI-Animated Historical Journey Collectibles',
    '': 'AI-Animated Historical Journey Collectibles',
    
    // Default fallback
    'default': 'AI-Animated Historical Journey Collectibles'
};

function getCurrentPage() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // Handle hash-based routing (SPA)
    if (hash && hash.startsWith('#/')) {
        const hashPath = hash.substring(2);
        return hashPath || 'index.html';
    }
    
    // Handle root/index
    if (path === '/' || path === '/index.html' || path === '' || path.endsWith('/')) {
        return 'index.html';
    }
    
    // Extract filename
    const filename = path.split('/').pop();
    
    // If no extension, assume .html
    if (!filename.includes('.')) {
        return filename + '.html';
    }
    
    return filename;
}

function updateBrandSubtitle() {
    try {
        const subtitleElement = document.querySelector('.brand-subtitle');
        if (!subtitleElement) {
            console.warn('⚠️ Brand subtitle element not found');
            return;
        }
        
        const currentPage = getCurrentPage();
        const subtitle = PAGE_SUBTITLES[currentPage] || PAGE_SUBTITLES['default'];
        
        console.log(`📄 Updating subtitle for "${currentPage}": ${subtitle}`);
        subtitleElement.textContent = subtitle;
        
        // Add data attribute for CSS targeting
        subtitleElement.setAttribute('data-page', currentPage.replace('.html', ''));
        
        // Add animation effect
        subtitleElement.style.opacity = '0';
        setTimeout(() => {
            subtitleElement.style.transition = 'opacity 0.3s ease';
            subtitleElement.style.opacity = '1';
        }, 10);
        
    } catch (error) {
        console.error('❌ Error updating brand subtitle:', error);
    }
}

// ========== HEADER SCROLL EFFECT ==========
function setupHeaderScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let ticking = false;
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    updateHeader();
    console.log('📜 Header scroll effect initialized');
}

// ========== FIXED BUY DROPDOWN TOGGLE ==========
function setupBuyDropdown() {
    console.log('🛒 Setting up Buy dropdown...');
    
    const buyToggles = document.querySelectorAll('.buy-toggle');
    const buyDropdowns = document.querySelectorAll('.buy-dropdown');
    
    if (buyToggles.length === 0 || buyDropdowns.length === 0) {
        console.warn('⚠️ No buy dropdown elements found');
        return;
    }
    
    console.log(`Found ${buyToggles.length} buy toggles and ${buyDropdowns.length} dropdowns`);
    
    // Remove all existing event listeners
    buyToggles.forEach(toggle => {
        toggle.replaceWith(toggle.cloneNode(true));
    });
    
    // Re-select fresh toggles
    const freshBuyToggles = document.querySelectorAll('.buy-toggle');
    
    freshBuyToggles.forEach((toggle, index) => {
        console.log(`Setting up buy toggle ${index + 1}`);
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`Buy button ${index + 1} clicked`);
            
            const dropdown = this.closest('.buy-dropdown');
            if (!dropdown) {
                console.error('❌ No dropdown found for this toggle');
                return;
            }
            
            const isActive = dropdown.classList.contains('active');
            const isMobile = window.innerWidth <= 768;
            
            console.log(`State: Active=${isActive}, Mobile=${isMobile}`);
            
            // Close all other dropdowns first
            closeAllDropdowns();
            
            // Toggle this dropdown
            if (!isActive) {
                dropdown.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                // If on mobile, also close the mobile menu
                if (isMobile) {
                    isDropdownOpen = true;
                    document.body.classList.add('dropdown-open');
                    
                    // Close mobile menu if it's open
                    const mobileMenu = document.getElementById('nav-desktop');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.getElementById('mobileNavToggle')?.classList.remove('active');
                        document.body.classList.remove('nav-open');
                        isMobileMenuOpen = false;
                    }
                }
                
                console.log(`✅ Buy dropdown ${index + 1} opened`);
            } else {
                dropdown.classList.remove('active');
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                
                if (isMobile) {
                    isDropdownOpen = false;
                    document.body.classList.remove('dropdown-open');
                }
                
                console.log(`✅ Buy dropdown ${index + 1} closed`);
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        const clickedBuyDropdown = e.target.closest('.buy-dropdown');
        const clickedBuyToggle = e.target.closest('.buy-toggle');
        
        // If clicking outside buy dropdowns
        if (!clickedBuyDropdown && !clickedBuyToggle) {
            console.log('Clicking outside buy dropdown - closing all');
            
            buyDropdowns.forEach(d => {
                d.classList.remove('active');
                const toggle = d.querySelector('.buy-toggle');
                if (toggle) {
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
            
            if (isMobile && isDropdownOpen) {
                isDropdownOpen = false;
                document.body.classList.remove('dropdown-open');
            }
        }
    });
    
    // Close dropdown when clicking escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            buyDropdowns.forEach(d => {
                d.classList.remove('active');
                const toggle = d.querySelector('.buy-toggle');
                if (toggle) {
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
            
            if (window.innerWidth <= 768) {
                isDropdownOpen = false;
                document.body.classList.remove('dropdown-open');
            }
        }
    });
    
    console.log('✅ Buy dropdown setup complete');
}

// ========== SIMPLIFIED MOBILE NAVIGATION ==========
function setupMobileNavigation() {
    console.log('📱 Setting up simplified mobile navigation...');
    
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navDesktop = document.getElementById('nav-desktop');
    
    if (!mobileToggle || !navDesktop) {
        console.warn('⚠️ Mobile navigation elements not found');
        return;
    }
    
    // Set up staggered animation delays
    function setupStaggeredAnimation() {
        const menuItems = navDesktop.querySelectorAll('a:not(.buy-toggle), .dropdown, .buy-dropdown.mobile-buy');
        menuItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
            item.style.transitionDelay = `${index * 0.05}s`;
        });
    }
    
    // Main toggle click handler
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpening = !navDesktop.classList.contains('active');
        
        if (isOpening) {
            openMobileNav();
        } else {
            closeMobileNav();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768) return;
        
        if (isMobileMenuOpen && 
            !e.target.closest('#nav-desktop') && 
            !e.target.closest('#mobileNavToggle')) {
            closeMobileNav();
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileNav();
            mobileToggle.focus();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                closeMobileNav();
            }
        }, 250);
    });
    
    // Open mobile navigation function
    function openMobileNav() {
        navDesktop.classList.add('active');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        navDesktop.setAttribute('aria-hidden', 'false');
        
        // Set up animations
        setupStaggeredAnimation();
        
        // Lock body scroll
        document.body.classList.add('nav-open');
        document.body.style.overflow = 'hidden';
        
        // Close any open dropdowns
        closeAllDropdowns();
        
        // Focus management for accessibility
        setTimeout(() => {
            const firstFocusable = navDesktop.querySelector('a:not(.buy-toggle), .dropbtn');
            if (firstFocusable) firstFocusable.focus();
        }, 100);
        
        isMobileMenuOpen = true;
        console.log('📱 Mobile navigation opened');
    }
    
    // Close mobile navigation function
    function closeMobileNav() {
        navDesktop.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        navDesktop.setAttribute('aria-hidden', 'true');
        
        // Reset body
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        
        // Close all dropdowns
        closeAllDropdowns();
        
        // Reset animation delays
        const menuItems = navDesktop.querySelectorAll('a:not(.buy-toggle), .dropdown');
        menuItems.forEach(item => {
            item.style.transitionDelay = '';
        });
        
        isMobileMenuOpen = false;
        console.log('📱 Mobile navigation closed');
    }
    
    console.log('✅ Mobile navigation setup complete');
}

// ========== SIMPLIFIED DROPDOWN MANAGEMENT (SINGLE SOURCE) ==========
function setupDropdowns() {
    console.log('🔽 Setting up simplified dropdowns...');
    
    const dropbtns = document.querySelectorAll('.dropbtn');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    console.log(`Found ${dropbtns.length} dropdown buttons and ${dropdowns.length} dropdowns`);
    
    if (dropbtns.length === 0 || dropdowns.length === 0) {
        console.warn('⚠️ Dropdown elements not found');
        return;
    }
    
    // Remove any existing event listeners by cloning
    dropbtns.forEach((dropbtn) => {
        const newDropbtn = dropbtn.cloneNode(true);
        dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
    });
    
    // Re-select fresh buttons
    const freshDropbtns = document.querySelectorAll('.dropbtn');
    
    freshDropbtns.forEach((dropbtn, index) => {
        dropbtn.addEventListener('click', function(e) {
            console.log(`🎯 Dropdown ${index + 1} clicked`);
            
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.dropdown');
            if (!dropdown) {
                console.error('❌ Dropdown parent not found');
                return;
            }
            
            const isMobile = window.innerWidth <= 768;
            const isOpen = dropdown.classList.contains('active');
            
            console.log(`📱 Dropdown state - Open: ${isOpen}, Mobile: ${isMobile}`);
            
            // Track which dropdown was clicked
            lastClickedDropdown = dropdown;
            
            // Close all other dropdowns except this one
            closeAllDropdownsExcept(dropdown);
            
            // Close buy dropdowns
            document.querySelectorAll('.buy-dropdown').forEach(d => {
                if (d !== dropdown.closest('.buy-dropdown')) {
                    d.classList.remove('active');
                    const toggle = d.querySelector('.buy-toggle');
                    if (toggle) {
                        toggle.classList.remove('active');
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Toggle this dropdown
            if (!isOpen) {
                dropdown.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                if (isMobile) {
                    isDropdownOpen = true;
                    document.body.classList.add('dropdown-open');
                    
                    // On mobile, ensure dropdown content is visible
                    const dropdownContent = dropdown.querySelector('.dropdown-content');
                    if (dropdownContent) {
                        dropdownContent.style.display = 'block';
                        dropdownContent.style.opacity = '1';
                        dropdownContent.style.visibility = 'visible';
                        dropdownContent.style.transform = 'translateY(0)';
                    }
                }
                
                console.log('✅ Dropdown opened');
            } else {
                dropdown.classList.remove('active');
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                
                if (isMobile) {
                    isDropdownOpen = false;
                    document.body.classList.remove('dropdown-open');
                    
                    // Reset mobile dropdown styles
                    const dropdownContent = dropdown.querySelector('.dropdown-content');
                    if (dropdownContent) {
                        dropdownContent.style.display = '';
                        dropdownContent.style.opacity = '';
                        dropdownContent.style.visibility = '';
                        dropdownContent.style.transform = '';
                    }
                }
                
                console.log('✅ Dropdown closed');
            }
        });
    });
    
    // Handle dropdown item clicks
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('📱 Dropdown link clicked:', this.href);
            
            // Close parent dropdown
            const dropdown = this.closest('.dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
                const btn = dropdown.querySelector('.dropbtn');
                if (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                }
            }
            
            // Close mobile menu on mobile
            if (window.innerWidth <= 768) {
                setTimeout(closeMobileNav, 300);
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        const clickedDropdown = e.target.closest('.dropdown');
        const clickedDropbtn = e.target.closest('.dropbtn');
        const clickedBuyDropdown = e.target.closest('.buy-dropdown');
        const clickedBuyToggle = e.target.closest('.buy-toggle');
        
        // If clicking outside any dropdown
        if (!clickedDropdown && !clickedDropbtn && !clickedBuyDropdown && !clickedBuyToggle) {
            closeAllDropdowns();
            
            if (isMobile) {
                isDropdownOpen = false;
                document.body.classList.remove('dropdown-open');
            }
        }
    });
    
    // Close dropdown with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
            
            if (window.innerWidth <= 768) {
                isDropdownOpen = false;
                document.body.classList.remove('dropdown-open');
            }
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            
            if (!isMobile) {
                // Reset to desktop - close all dropdowns
                closeAllDropdowns();
                document.body.classList.remove('dropdown-open');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        }, 250);
    });
    
    console.log('✅ Simplified dropdowns setup complete');
}

function closeAllDropdowns() {
    const isMobile = window.innerWidth <= 768;
    
    console.log('🔽 Closing all dropdowns...');
    
    // Remove active class from dropdown containers
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
    
    // Remove active class from buttons and reset aria
    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
    });
    
    // Close buy dropdowns
    document.querySelectorAll('.buy-dropdown').forEach(d => {
        d.classList.remove('active');
        const toggle = d.querySelector('.buy-toggle');
        if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Reset body classes
    if (isMobile) {
        isDropdownOpen = false;
        document.body.classList.remove('dropdown-open');
    }
    
    lastClickedDropdown = null;
}

function closeAllDropdownsExcept(exceptDropdown) {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (dropdown !== exceptDropdown) {
            dropdown.classList.remove('active');
            const btn = dropdown.querySelector('.dropbtn');
            if (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Also close buy dropdowns
    document.querySelectorAll('.buy-dropdown').forEach(d => {
        d.classList.remove('active');
        const toggle = d.querySelector('.buy-toggle');
        if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ========== BACK TO TOP ==========
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    let ticking = false;
    
    function updateBackToTop() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateBackToTop);
            ticking = true;
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            const firstFocusable = document.querySelector('header a, header button');
            if (firstFocusable) firstFocusable.focus();
        }, 500);
    });
    
    console.log('⬆️ Back to top button setup complete');
}

// ========== ACTIVE NAVIGATION ==========
function setActiveNavItem() {
    console.log('📍 Setting active navigation item...');
    
    const currentPage = getCurrentPage();
    
    // Remove active from all nav items
    document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
        el.classList.remove('active');
    });
    
    // Update subtitle FIRST
    updateBrandSubtitle();
    
    // Define active page mapping - FIXED: Use correct nav class names
    const pageMap = {
        'index.html': 'a[href="index.html"]',
        'trade.html': 'a.nav-trade',
        'epoch-rewards.html': 'a.nav-rewards',
        'tokenomics.html': 'a.nav-tokenomics',
        'security-integrity.html': 'a.nav-security-integrity', // FIXED: Correct class name
        'community.html': 'a.nav-community',
        'governance.html': 'a.nav-governance',
        'roadmap.html': 'a.nav-roadmap',
        'artwork.html': 'a.nav-artwork',
        'rebl-calculator.html': 'a.nav-rebl-calculator', // FIXED: Correct class name
        'whitepaper.html': 'a.nav-whitepaper'
    };
    
    const selector = pageMap[currentPage];
    if (selector) {
        const activeElement = document.querySelector(selector);
        if (activeElement) {
            activeElement.classList.add('active');
            
            // If it's in a dropdown, also mark the dropdown button as active
            const dropdown = activeElement.closest('.dropdown-content');
            if (dropdown) {
                const dropdownBtn = dropdown.previousElementSibling;
                if (dropdownBtn && dropdownBtn.classList.contains('dropbtn')) {
                    dropdownBtn.classList.add('active');
                }
            }
        }
    }
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
function setupPerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            window.dispatchEvent(new Event('resizeDone'));
        }, 250);
    });
    
    // Use passive event listeners for touch events
    const options = { passive: true };
    
    document.addEventListener('touchstart', function() {}, options);
    document.addEventListener('touchmove', function() {}, options);
    document.addEventListener('touchend', function() {}, options);
    
    // Optimize animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });
        
        document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
            observer.observe(el);
        });
    }
}

// ========== ENHANCED CONTRACT COPY FUNCTIONALITY ==========
function setupContractCopy() {
    console.log('📋 Setting up enhanced contract copy functionality...');
    
    const contractElement = document.querySelector('.contract-value-quick');
    
    if (!contractElement) {
        console.warn('⚠️ Contract copy element not found');
        return;
    }
    
    // Remove existing event listeners by cloning
    const newContractElement = contractElement.cloneNode(true);
    contractElement.parentNode.replaceChild(newContractElement, contractElement);
    
    // Re-select fresh element
    const freshContractElement = document.querySelector('.contract-value-quick');
    
    // Add click event listener
    freshContractElement.addEventListener('click', copyContract);
    
    // Add touch support for mobile
    freshContractElement.addEventListener('touchstart', function(e) {
        e.preventDefault();
        copyContract();
    }, { passive: false });
    
    console.log('✅ Enhanced contract copy functionality setup complete');
}

function copyContract() {
    const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    const message = document.getElementById('contractCopiedMessage');
    const copyButton = document.querySelector('.contract-value-quick');
    
    if (!copyButton) {
        console.error('❌ Contract copy button not found');
        return;
    }
    
    const copyIcon = copyButton.querySelector('.copy-icon');
    
    // Show loading state
    if (copyIcon) {
        copyIcon.classList.remove('fa-copy');
        copyIcon.classList.add('fa-spinner', 'fa-spin');
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(contractAddress).then(() => {
        // Success state
        setTimeout(() => {
            if (copyIcon) {
                copyIcon.classList.remove('fa-spinner', 'fa-spin');
                copyIcon.classList.add('fa-check');
            }
            
            // Show success message
            if (message) {
                message.classList.add('show');
            }
            
            // Visual feedback on button
            copyButton.style.background = 'rgba(39, 174, 96, 0.1)';
            copyButton.style.borderColor = 'rgba(39, 174, 96, 0.3)';
            
            // Reset after 3 seconds
            setTimeout(() => {
                if (copyIcon) {
                    copyIcon.classList.remove('fa-check');
                    copyIcon.classList.add('fa-copy');
                }
                if (message) {
                    message.classList.remove('show');
                }
                copyButton.style.background = '';
                copyButton.style.borderColor = '';
            }, 3000);
        }, 300);
        
    }).catch(err => {
        // Fallback for older browsers
        console.error('Failed to copy: ', err);
        
        const textArea = document.createElement('textarea');
        textArea.value = contractAddress;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            
            if (copyIcon) {
                copyIcon.classList.remove('fa-spinner', 'fa-spin');
                copyIcon.classList.add('fa-check');
            }
            if (message) {
                message.classList.add('show');
            }
            
            setTimeout(() => {
                if (copyIcon) {
                    copyIcon.classList.remove('fa-check');
                    copyIcon.classList.add('fa-copy');
                }
                if (message) {
                    message.classList.remove('show');
                }
            }, 3000);
        } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
            alert('Failed to copy contract address. Please copy manually: ' + contractAddress);
            
            if (copyIcon) {
                copyIcon.classList.remove('fa-spinner', 'fa-spin');
                copyIcon.classList.add('fa-copy');
            }
        }
        
        document.body.removeChild(textArea);
    });
}

// ========== COPY CONTRACT FUNCTION (Legacy - for backward compatibility) ==========
window.copyContract = function() {
    const contract = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    const copyMessage = document.getElementById('copyMessage');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(contract)
            .then(() => {
                if (copyMessage) {
                    copyMessage.classList.add('show');
                    setTimeout(() => {
                        copyMessage.classList.remove('show');
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy contract:', err);
                fallbackCopy(contract);
            });
    } else {
        fallbackCopy(contract);
    }
};

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        const copyMessage = document.getElementById('copyMessage');
        if (copyMessage) {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy contract address. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// ========== DEBUG FUNCTION ==========
function debugMobileDropdowns() {
    console.log('=== MOBILE DROPDOWN DEBUG ===');
    console.log('Window width:', window.innerWidth);
    console.log('Is mobile?', window.innerWidth <= 768);
    console.log('Is mobile menu open?', isMobileMenuOpen);
    console.log('Is dropdown open?', isDropdownOpen);
    console.log('Last clicked dropdown:', lastClickedDropdown);
    
    // Check dropdown elements
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach((dropdown, i) => {
        const isActive = dropdown.classList.contains('active');
        const btn = dropdown.querySelector('.dropbtn');
        const btnActive = btn?.classList.contains('active');
        const ariaExpanded = btn?.getAttribute('aria-expanded');
        
        console.log(`Dropdown ${i + 1}:`, {
            isActive: isActive,
            btnActive: btnActive,
            ariaExpanded: ariaExpanded
        });
    });
}

// ========== LOADER ==========
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
    }
}
function setupMobileNavToggle() {
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navDesktop = document.getElementById('nav-desktop');
    
    if (mobileToggle && navDesktop) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navDesktop.classList.contains('active');
            
            // Toggle navigation
            navDesktop.classList.toggle('active');
            this.classList.toggle('active');
            this.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? '' : 'hidden';
        });
        
        // Close mobile menu when clicking a link
        navDesktop.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navDesktop.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
}
// ========== INITIALIZE EVERYTHING ==========
function initializeCommon() {
    console.log('🚀 Initializing common functionality...');
    
    try {
        // 1. Hide loader
        hideLoader();
        
        // 2. Setup performance optimizations
        setupPerformance();
        
        // 3. Setup header scroll effect
        setupHeaderScrollEffect();
        
        // 4. Setup mobile navigation
        setupMobileNavigation();
        
        // 5. Setup dropdowns
        setupDropdowns();
        
        // 6. Setup buy dropdown
        setupBuyDropdown();
        
        // 7. Setup back to top
        setupBackToTop();
        
        // 8. Set active navigation item (this now also updates subtitle)
        setActiveNavItem();
        
        // 9. Additional subtitle update for safety
        updateBrandSubtitle();
        
        // 10. Setup enhanced contract copy functionality
        setupContractCopy();
        setupMobileNavToggle(); 
        
        // 11. Add body class for JavaScript detection
        document.body.classList.add('js-enabled');
        
        console.log('✅ Common functionality initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing common functionality:', error);
    }
}

// ========== INITIALIZE ON DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded (common.js)');
    
    // Start initialization with a small delay
    setTimeout(initializeCommon, 100);
    
    // Add debug command to window for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugMobileDropdowns = debugMobileDropdowns;
        console.log('🔧 Debug commands available: debugMobileDropdowns()');
    }
});

// Update subtitle on navigation events
window.addEventListener('popstate', updateBrandSubtitle);
window.addEventListener('hashchange', updateBrandSubtitle);

// Also listen for component loading if using includes.js
if (window.componentsLoaded) {
    setTimeout(updateBrandSubtitle, 100);
} else {
    document.addEventListener('components:initialized', updateBrandSubtitle);
}

// ========== EXPORT FUNCTIONS FOR OTHER FILES ==========
window.setupMobileNavigation = setupMobileNavigation;
window.setupDropdowns = setupDropdowns;
window.setupBackToTop = setupBackToTop;
window.setActiveNavItem = setActiveNavItem;
window.closeAllDropdowns = closeAllDropdowns;
window.initializeCommon = initializeCommon;
window.copyContract = copyContract;
window.fallbackCopy = fallbackCopy;
window.setupContractCopy = setupContractCopy;
window.updateBrandSubtitle = updateBrandSubtitle;
window.getCurrentPage = getCurrentPage;
