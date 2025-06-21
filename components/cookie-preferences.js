/**
 * Cookie Preferences System - GDPR Compliant
 * Manages cookie consent, preferences, and script loading
 */

class CookiePreferences {
    constructor() {
        this.cookieCategories = {
            necessary: {
                name: 'Essential Cookies',
                description: 'These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.',
                required: true,
                enabled: true,
                details: [
                    'Session management and user authentication',
                    'Shopping cart functionality',
                    'Security and fraud prevention',
                    'Basic website functionality'
                ]
            },
            analytics: {
                name: 'Analytics Cookies',
                description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
                required: false,
                enabled: false,
                details: [
                    'Google Analytics for website usage statistics',
                    'Page view tracking and user behavior analysis',
                    'Performance monitoring and optimization',
                    'Visitor demographics and interests (anonymized)'
                ]
            },
            marketing: {
                name: 'Marketing Cookies',
                description: 'These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.',
                required: false,
                enabled: false,
                details: [
                    'Hotjar for user behavior analysis and heatmaps',
                    'Social media integration and sharing',
                    'Advertising campaign tracking',
                    'Personalized content recommendations'
                ]
            }
        };

        this.consentKey = 'defendra_cookie_consent';
        this.consentVersion = '1.0';
        this.hasConsent = false;
        this.scriptsLoaded = new Set();
        
        this.init();
    }

    init() {
        this.createCookieBanner();
        this.createCookieModal();
        this.loadExistingConsent();
        this.setupEventListeners();
        this.checkConsentStatus();
    }

    createCookieBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookieBanner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <h3>We Value Your Privacy</h3>
                    <p>We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
                </div>
                <div class="cookie-banner-actions">
                    <button class="cookie-btn cookie-btn-accept" id="acceptAllCookies">
                        Accept All
                    </button>
                    <button class="cookie-btn cookie-btn-reject" id="rejectAllCookies">
                        Reject All
                    </button>
                    <button class="cookie-btn cookie-btn-customize" id="customizeCookies">
                        Customize
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
    }

    createCookieModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-modal';
        modal.id = 'cookieModal';
        
        const categoriesHtml = Object.entries(this.cookieCategories).map(([key, category]) => `
            <div class="cookie-category ${category.required ? 'required' : ''}" data-category="${key}">
                <div class="cookie-category-header">
                    <div class="cookie-category-info">
                        <h3 class="cookie-category-title">
                            ${category.name}
                            ${category.required ? '<span class="required-badge">Required</span>' : ''}
                        </h3>
                        <p class="cookie-category-description">${category.description}</p>
                    </div>
                    <div class="cookie-toggle ${category.required ? 'disabled' : ''} ${category.enabled ? 'enabled' : ''}" 
                         data-category="${key}" ${category.required ? 'data-disabled="true"' : ''}>
                        <div class="cookie-toggle-slider"></div>
                    </div>
                </div>
                <div class="cookie-category-details">
                    <h4>What we use these cookies for:</h4>
                    <ul class="cookie-details-list">
                        ${category.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h2>Cookie Preferences</h2>
                    <p>Manage your cookie settings and choose which types of cookies you want to allow. You can change these settings at any time.</p>
                    <button class="cookie-modal-close" id="closeCookieModal" aria-label="Close cookie preferences">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cookie-modal-body">
                    ${categoriesHtml}
                </div>
                <div class="cookie-modal-footer">
                    <button class="cookie-btn cookie-btn-reject" id="rejectAllModal">
                        Reject All
                    </button>
                    <button class="cookie-btn cookie-btn-accept" id="savePreferences">
                        Save Preferences
                    </button>
                    <button class="cookie-btn cookie-btn-accept" id="acceptAllModal">
                        Accept All
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Banner buttons
        document.getElementById('acceptAllCookies')?.addEventListener('click', () => this.acceptAllCookies());
        document.getElementById('rejectAllCookies')?.addEventListener('click', () => this.rejectAllCookies());
        document.getElementById('customizeCookies')?.addEventListener('click', () => this.openModal());

        // Modal buttons
        document.getElementById('closeCookieModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('acceptAllModal')?.addEventListener('click', () => this.acceptAllCookies());
        document.getElementById('rejectAllModal')?.addEventListener('click', () => this.rejectAllCookies());
        document.getElementById('savePreferences')?.addEventListener('click', () => this.savePreferences());

        // Category toggles
        document.querySelectorAll('.cookie-toggle:not([data-disabled])').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.toggleCategory(category);
            });
        });

        // Category expansion
        document.querySelectorAll('.cookie-category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (!e.target.closest('.cookie-toggle')) {
                    const category = header.closest('.cookie-category');
                    category.classList.toggle('expanded');
                }
            });
        });

        // Modal backdrop click
        document.getElementById('cookieModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cookieModal') {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    checkConsentStatus() {
        const consent = this.getStoredConsent();
        
        if (!consent || consent.version !== this.consentVersion) {
            // No consent or outdated version - show banner
            this.showBanner();
        } else {
            // Valid consent exists
            this.hasConsent = true;
            this.applyCookieSettings(consent.preferences);
            this.loadScripts();
        }
    }

    loadExistingConsent() {
        const consent = this.getStoredConsent();
        if (consent && consent.preferences) {
            Object.keys(consent.preferences).forEach(category => {
                if (this.cookieCategories[category]) {
                    this.cookieCategories[category].enabled = consent.preferences[category];
                }
            });
            this.updateModalToggles();
        }
    }

    getStoredConsent() {
        try {
            const stored = localStorage.getItem(this.consentKey);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.warn('Could not parse stored cookie consent');
            return null;
        }
    }

    storeConsent(preferences) {
        const consent = {
            version: this.consentVersion,
            timestamp: new Date().toISOString(),
            preferences: preferences
        };

        try {
            localStorage.setItem(this.consentKey, JSON.stringify(consent));
        } catch (e) {
            console.warn('Could not store cookie consent');
        }

        return consent;
    }

    acceptAllCookies() {
        const preferences = {};
        Object.keys(this.cookieCategories).forEach(category => {
            preferences[category] = true;
            this.cookieCategories[category].enabled = true;
        });

        this.storeConsent(preferences);
        this.applyCookieSettings(preferences);
        this.hideBanner();
        this.closeModal();
        this.loadScripts();
        this.hasConsent = true;

        this.trackConsentEvent('accept_all');
    }

    rejectAllCookies() {
        const preferences = {};
        Object.keys(this.cookieCategories).forEach(category => {
            preferences[category] = this.cookieCategories[category].required;
            this.cookieCategories[category].enabled = this.cookieCategories[category].required;
        });

        this.storeConsent(preferences);
        this.applyCookieSettings(preferences);
        this.hideBanner();
        this.closeModal();
        this.loadScripts();
        this.hasConsent = true;

        this.trackConsentEvent('reject_all');
    }

    savePreferences() {
        const preferences = {};
        Object.keys(this.cookieCategories).forEach(category => {
            preferences[category] = this.cookieCategories[category].enabled;
        });

        this.storeConsent(preferences);
        this.applyCookieSettings(preferences);
        this.hideBanner();
        this.closeModal();
        this.loadScripts();
        this.hasConsent = true;

        this.trackConsentEvent('save_preferences');
    }

    toggleCategory(category) {
        if (this.cookieCategories[category] && !this.cookieCategories[category].required) {
            this.cookieCategories[category].enabled = !this.cookieCategories[category].enabled;
            this.updateModalToggles();
            this.updateCategoryVisualState(category);
        }
    }

    updateModalToggles() {
        Object.keys(this.cookieCategories).forEach(category => {
            const toggle = document.querySelector(`[data-category="${category}"].cookie-toggle`);
            const categoryElement = document.querySelector(`[data-category="${category}"].cookie-category`);
            
            if (toggle && categoryElement) {
                const isEnabled = this.cookieCategories[category].enabled;
                toggle.classList.toggle('enabled', isEnabled);
                categoryElement.classList.toggle('enabled', isEnabled);
            }
        });
    }

    updateCategoryVisualState(category) {
        const categoryElement = document.querySelector(`[data-category="${category}"].cookie-category`);
        if (categoryElement) {
            const isEnabled = this.cookieCategories[category].enabled;
            categoryElement.classList.toggle('enabled', isEnabled);
        }
    }

    applyCookieSettings(preferences) {
        // Remove existing non-essential cookies if disabled
        Object.keys(preferences).forEach(category => {
            if (!preferences[category] && !this.cookieCategories[category].required) {
                this.removeCookiesForCategory(category);
            }
        });
    }

    removeCookiesForCategory(category) {
        // Remove specific cookies based on category
        const cookiesToRemove = {
            analytics: ['_ga', '_ga_*', '_gid', '_gat', '_gtag_*'],
            marketing: ['_hjid', '_hjSessionUser_*', '_hjSession_*', '_hjIncludedInPageviewSample', '_hjIncludedInSessionSample']
        };

        if (cookiesToRemove[category]) {
            cookiesToRemove[category].forEach(cookieName => {
                if (cookieName.includes('*')) {
                    // Remove cookies matching pattern
                    const pattern = cookieName.replace('*', '');
                    document.cookie.split(';').forEach(cookie => {
                        const name = cookie.split('=')[0].trim();
                        if (name.startsWith(pattern)) {
                            this.deleteCookie(name);
                        }
                    });
                } else {
                    this.deleteCookie(cookieName);
                }
            });
        }
    }

    deleteCookie(name) {
        // Delete cookie for current domain and all parent domains
        const domains = [window.location.hostname];
        const parts = window.location.hostname.split('.');
        for (let i = 1; i < parts.length; i++) {
            domains.push('.' + parts.slice(i).join('.'));
        }

        domains.forEach(domain => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    }

    loadScripts() {
        const consent = this.getStoredConsent();
        if (!consent) return;

        // Load analytics scripts
        if (consent.preferences.analytics && !this.scriptsLoaded.has('analytics')) {
            this.loadGoogleAnalytics();
            this.scriptsLoaded.add('analytics');
        }

        // Load marketing scripts
        if (consent.preferences.marketing && !this.scriptsLoaded.has('marketing')) {
            this.loadHotjar();
            this.scriptsLoaded.add('marketing');
        }
    }

    loadGoogleAnalytics() {
        const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 ID
        
        // Create and load GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize GA
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            cookie_flags: 'max-age=7200;secure;samesite=none',
            anonymize_ip: true
        });

        console.log('Google Analytics loaded');
    }

    loadHotjar() {
        const HOTJAR_ID = '0000000'; // Replace with actual Hotjar ID
        
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:HOTJAR_ID,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

        console.log('Hotjar loaded');
    }

    showBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            setTimeout(() => banner.classList.add('show'), 100);
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    openModal() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const firstFocusable = modal.querySelector('button, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    trackConsentEvent(action) {
        // Track consent events for analytics (only if analytics are enabled)
        const consent = this.getStoredConsent();
        if (consent && consent.preferences.analytics && typeof gtag !== 'undefined') {
            gtag('event', 'cookie_consent', {
                'consent_action': action,
                'consent_timestamp': new Date().toISOString()
            });
        }

        // Custom event for other tracking systems
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
            detail: {
                action: action,
                preferences: consent ? consent.preferences : null,
                timestamp: new Date().toISOString()
            }
        }));
    }

    // Public API methods
    hasConsentFor(category) {
        const consent = this.getStoredConsent();
        return consent && consent.preferences && consent.preferences[category] === true;
    }

    getConsentStatus() {
        const consent = this.getStoredConsent();
        return consent ? consent.preferences : null;
    }

    resetConsent() {
        localStorage.removeItem(this.consentKey);
        this.hasConsent = false;
        this.scriptsLoaded.clear();
        
        // Reset categories to default
        Object.keys(this.cookieCategories).forEach(category => {
            this.cookieCategories[category].enabled = this.cookieCategories[category].required;
        });
        
        this.updateModalToggles();
        this.showBanner();
    }
}

// Initialize cookie preferences when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cookiePreferences = new CookiePreferences();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookiePreferences;
}