// Enhanced main.js with cookie preferences integration

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Toggle active state
            const isActive = navLinks.classList.contains('active');
            
            if (isActive) {
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            } else {
                navLinks.classList.add('active');
                body.classList.add('nav-open');
                mobileMenuBtn.innerHTML = '✕';
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            }
        });

        // Close mobile menu when clicking on a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('#main-nav')) {
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Set initial aria attributes
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
        navLinks.setAttribute('id', 'nav-links');
    }

    // Blog search functionality
    const blogSearch = document.getElementById('blogSearch');
    if (blogSearch) {
        const blogList = document.getElementById('blogList');
        const noResults = document.getElementById('noResults');
        const blogCards = document.querySelectorAll('.blog-card');

        blogSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            let hasResults = false;

            blogCards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                const content = card.getAttribute('data-content').toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'block';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResults) {
                noResults.style.display = hasResults ? 'none' : 'block';
            }
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name')?.value || 
                      `${document.getElementById('firstName')?.value || ''} ${document.getElementById('lastName')?.value || ''}`.trim(),
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service')?.value,
                message: document.getElementById('message').value
            };

            // Basic form validation
            if (!formData.name || !formData.email || !formData.phone || !formData.message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Phone validation (basic)
            const phoneRegex = /^\+?[\d\s-()]{10,}$/;
            if (!phoneRegex.test(formData.phone)) {
                alert('Please enter a valid phone number.');
                return;
            }

            console.log('Form submitted:', formData);
            
            // Track form submission (only if analytics cookies are accepted)
            if (window.cookiePreferences && window.cookiePreferences.hasConsentFor('analytics')) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'form_name': 'contact_form',
                        'form_location': window.location.pathname
                    });
                }
            }
            
            alert('Thank you for your message. We will contact you soon!');
            contactForm.reset();
        });
    }

    // Navigation hide/show functionality
    const nav = document.getElementById('main-nav');
    
    // Create and append show navigation button
    const showNavBtn = document.createElement('button');
    showNavBtn.id = 'show-nav-btn';
    showNavBtn.innerHTML = '↑';
    showNavBtn.title = 'Show navigation';
    document.body.appendChild(showNavBtn);

    if (nav) {
        let lastScroll = 0;
        let isNavVisible = true;
        const scrollThreshold = 50; // Minimum scroll amount before hiding nav

        // Show/hide navigation based on scroll direction
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Always show nav at the top of the page
            if (currentScroll <= 0) {
                nav.style.boxShadow = 'none';
                nav.classList.remove('nav-hidden');
                showNavBtn.classList.remove('visible');
                isNavVisible = true;
                return;
            }

            // Add shadow when scrolled
            nav.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';

            // Determine scroll direction and distance
            if (currentScroll > lastScroll && currentScroll > scrollThreshold && isNavVisible) {
                // Scrolling down & nav is visible - hide nav
                nav.classList.add('nav-hidden');
                showNavBtn.classList.add('visible');
                isNavVisible = false;
            } else if (currentScroll < lastScroll && !isNavVisible) {
                // Scrolling up & nav is hidden - show nav
                nav.classList.remove('nav-hidden');
                showNavBtn.classList.remove('visible');
                isNavVisible = true;
            }

            lastScroll = currentScroll;
        });

        // Show navigation when button is clicked
        showNavBtn.addEventListener('click', () => {
            nav.classList.remove('nav-hidden');
            showNavBtn.classList.remove('visible');
            isNavVisible = true;
        });
    }

    // Cookie consent event listeners
    window.addEventListener('cookieConsentChanged', function(e) {
        const { action, preferences } = e.detail;
        
        console.log('Cookie consent changed:', action, preferences);
        
        // Handle script loading based on consent
        if (preferences) {
            // Analytics scripts
            if (preferences.analytics && typeof gtag === 'undefined') {
                loadAnalyticsScripts();
            }
            
            // Marketing scripts  
            if (preferences.marketing && typeof hj === 'undefined') {
                loadMarketingScripts();
            }
        }
    });

    // Load analytics scripts if consent is given
    function loadAnalyticsScripts() {
        const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 ID
        
        if (typeof gtag === 'undefined') {
            // Load Google Analytics
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', GA_MEASUREMENT_ID, {
                'cookie_flags': 'max-age=7200;secure;samesite=none',
                'anonymize_ip': true
            });
        }
    }

    // Load marketing scripts if consent is given
    function loadMarketingScripts() {
        const HOTJAR_ID = '0000000'; // Replace with actual Hotjar ID
        
        if (typeof hj === 'undefined') {
            // Load Hotjar
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:HOTJAR_ID,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        }
    }

    // Check if user has already given consent and load scripts accordingly
    if (window.cookiePreferences) {
        if (window.cookiePreferences.hasConsentFor('analytics')) {
            loadAnalyticsScripts();
        }
        
        if (window.cookiePreferences.hasConsentFor('marketing')) {
            loadMarketingScripts();
        }
    }
});

// Utility function to check cookie consent before tracking
window.trackEvent = function(eventName, parameters = {}) {
    if (window.cookiePreferences && window.cookiePreferences.hasConsentFor('analytics')) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
    }
};

// Utility function to check if specific cookie category is consented
window.hasCookieConsent = function(category) {
    return window.cookiePreferences ? window.cookiePreferences.hasConsentFor(category) : false;
};