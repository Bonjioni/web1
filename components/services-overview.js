/**
 * Services Overview Component
 * Interactive above-the-fold services display
 */

class ServicesOverview {
    constructor() {
        this.services = [
            {
                id: 'cctv',
                title: 'CCTV Installation',
                icon: 'fas fa-video',
                description: 'Professional surveillance systems with HD cameras and remote monitoring.',
                features: ['HD & 4K Cameras', 'Night Vision', 'Mobile Access'],
                category: 'surveillance',
                link: 'cctv-installation.html',
                status: 'Popular',
                details: {
                    title: 'Complete CCTV Solutions',
                    features: [
                        'Professional installation and setup',
                        'HD and 4K camera options',
                        'Night vision capabilities',
                        'Remote viewing via mobile app',
                        'Cloud storage options',
                        'Motion detection alerts'
                    ]
                }
            },
            {
                id: 'burglar-alarm',
                title: 'Burglar Alarms',
                icon: 'fas fa-shield-alt',
                description: 'Advanced alarm systems with 24/7 monitoring and instant alerts.',
                features: ['24/7 Monitoring', 'Smart Sensors', 'Mobile Alerts'],
                category: 'protection',
                link: 'burglar-alarm.html',
                status: 'Essential',
                details: {
                    title: 'Comprehensive Alarm Systems',
                    features: [
                        'Motion sensors with pet immunity',
                        'Door and window contacts',
                        'Glass break detectors',
                        '24/7 professional monitoring',
                        'Smartphone integration',
                        'Battery backup systems'
                    ]
                }
            },
            {
                id: 'access-control',
                title: 'Access Control',
                icon: 'fas fa-key',
                description: 'Secure entry systems with keycard, biometric, and mobile access.',
                features: ['Keycard Access', 'Biometric', 'Mobile Control'],
                category: 'access',
                link: 'access-control.html',
                status: 'Advanced',
                details: {
                    title: 'Smart Access Solutions',
                    features: [
                        'Keycard and fob systems',
                        'Biometric access control',
                        'Mobile app integration',
                        'Time-based access restrictions',
                        'Visitor management',
                        'Integration with other systems'
                    ]
                }
            },
            {
                id: 'intercom',
                title: 'Intercom Systems',
                icon: 'fas fa-phone',
                description: 'Modern communication systems with video calling and remote access.',
                features: ['Video Calling', 'Remote Access', 'Multi-Unit'],
                category: 'communication',
                link: 'intercom-installation.html',
                status: 'Modern',
                details: {
                    title: 'Advanced Intercom Solutions',
                    features: [
                        'HD video quality',
                        'Two-way audio communication',
                        'Smartphone integration',
                        'Multi-tenant support',
                        'Night vision capability',
                        'Cloud recording options'
                    ]
                }
            },
            {
                id: 'smart-home',
                title: 'Smart Home Security',
                icon: 'fas fa-home',
                description: 'Integrated smart security with automation and voice control.',
                features: ['Voice Control', 'Automation', 'Integration'],
                category: 'smart',
                link: 'smart-home.html',
                status: 'Trending',
                details: {
                    title: 'Complete Smart Home Integration',
                    features: [
                        'Smart locks and lighting',
                        'Voice assistant integration',
                        'Automated security responses',
                        'Geofencing capabilities',
                        'Energy management',
                        'Remote monitoring and control'
                    ]
                }
            },
            {
                id: 'motion-sensors',
                title: 'Motion Sensors',
                icon: 'fas fa-running',
                description: 'Advanced motion detection with pet-friendly technology.',
                features: ['Pet-Friendly', 'Wireless', 'Smart Detection'],
                category: 'detection',
                link: 'motion-sensor.html',
                status: 'Reliable',
                details: {
                    title: 'Intelligent Motion Detection',
                    features: [
                        'PIR sensor technology',
                        'Pet immunity options',
                        'Adjustable sensitivity',
                        'Wireless connectivity',
                        'Zone programming',
                        'Anti-masking protection'
                    ]
                }
            }
        ];

        this.categories = {
            all: 'All Services',
            surveillance: 'Surveillance',
            protection: 'Protection',
            access: 'Access Control',
            communication: 'Communication',
            smart: 'Smart Home',
            detection: 'Detection'
        };

        this.currentCategory = 'all';
        this.expandedCard = null;
        
        this.init();
    }

    init() {
        this.createServicesOverview();
        this.addEventListeners();
    }

    createServicesOverview() {
        const containers = document.querySelectorAll('[data-services-overview]');
        
        containers.forEach(container => {
            const config = this.parseConfig(container.dataset.servicesOverview);
            const overviewHtml = this.generateOverviewHtml(config);
            container.innerHTML = overviewHtml;
        });
    }

    parseConfig(configString) {
        const defaultConfig = {
            showCategories: true,
            showViewAll: true,
            maxServices: 6,
            layout: 'grid'
        };

        if (!configString) return defaultConfig;

        try {
            const config = JSON.parse(configString.replace(/'/g, '"'));
            return { ...defaultConfig, ...config };
        } catch (e) {
            console.warn('Invalid services overview configuration, using defaults');
            return defaultConfig;
        }
    }

    generateOverviewHtml(config) {
        const servicesToShow = this.getFilteredServices().slice(0, config.maxServices);
        
        return `
            <div class="services-overview">
                <div class="container">
                    <div class="services-overview-header">
                        <h2>Our Security Services</h2>
                        <p>Comprehensive protection solutions tailored to your needs</p>
                    </div>
                    
                    ${config.showCategories ? this.generateCategoriesHtml() : ''}
                    
                    <div class="services-grid" id="servicesGrid">
                        ${servicesToShow.map(service => this.generateServiceCardHtml(service)).join('')}
                    </div>
                    
                    ${config.showViewAll ? this.generateViewAllHtml() : ''}
                </div>
            </div>
        `;
    }

    generateCategoriesHtml() {
        return `
            <div class="services-categories">
                ${Object.entries(this.categories).map(([key, label]) => `
                    <button class="category-filter ${key === this.currentCategory ? 'active' : ''}" 
                            data-category="${key}">
                        ${label}
                    </button>
                `).join('')}
            </div>
        `;
    }

    generateServiceCardHtml(service) {
        return `
            <div class="service-card-compact" data-service="${service.id}">
                <div class="service-header">
                    <div class="service-icon">
                        <i class="${service.icon}" aria-hidden="true"></i>
                    </div>
                    <h3 class="service-title">${service.title}</h3>
                </div>
                
                <p class="service-description">${service.description}</p>
                
                <div class="service-features">
                    ${service.features.map(feature => `
                        <span class="service-feature">${feature}</span>
                    `).join('')}
                </div>
                
                <div class="service-action">
                    <a href="${service.link}" class="service-link">Learn More</a>
                    <span class="service-status">${service.status}</span>
                </div>
                
                <div class="service-details">
                    <h4>${service.details.title}</h4>
                    <ul>
                        ${service.details.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <a href="${service.link}" class="cta-button">Get Quote</a>
                </div>
            </div>
        `;
    }

    generateViewAllHtml() {
        return `
            <div class="services-overview-footer">
                <a href="services.html" class="view-all-services">
                    <i class="fas fa-th-large" aria-hidden="true"></i>
                    View All Services
                </a>
            </div>
        `;
    }

    getFilteredServices() {
        if (this.currentCategory === 'all') {
            return this.services;
        }
        return this.services.filter(service => service.category === this.currentCategory);
    }

    addEventListeners() {
        document.addEventListener('click', (e) => {
            // Category filter clicks
            if (e.target.classList.contains('category-filter')) {
                e.preventDefault();
                this.handleCategoryFilter(e.target);
            }
            
            // Service card clicks for expansion
            if (e.target.closest('.service-card-compact')) {
                const card = e.target.closest('.service-card-compact');
                const serviceId = card.dataset.service;
                
                // Don't expand if clicking on links
                if (!e.target.closest('.service-link, .cta-button')) {
                    this.toggleServiceDetails(card, serviceId);
                }
            }
            
            // Close expanded cards when clicking outside
            if (!e.target.closest('.service-card-compact')) {
                this.closeAllExpandedCards();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('category-filter')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCategoryFilter(e.target);
                }
            }
            
            // Close expanded cards with Escape key
            if (e.key === 'Escape') {
                this.closeAllExpandedCards();
            }
        });

        // Track service interactions for analytics
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-link, .cta-button')) {
                const card = e.target.closest('.service-card-compact');
                const serviceId = card?.dataset.service;
                
                if (serviceId && typeof gtag !== 'undefined') {
                    gtag('event', 'service_click', {
                        'service_type': serviceId,
                        'click_type': e.target.classList.contains('cta-button') ? 'cta' : 'learn_more'
                    });
                }
            }
        });
    }

    handleCategoryFilter(button) {
        const category = button.dataset.category;
        
        // Update active state
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Update current category
        this.currentCategory = category;
        
        // Update services grid
        this.updateServicesGrid();
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_filter', {
                'filter_category': category
            });
        }
    }

    updateServicesGrid() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        
        const filteredServices = this.getFilteredServices().slice(0, 6);
        
        // Add fade out effect
        grid.style.opacity = '0.5';
        
        setTimeout(() => {
            grid.innerHTML = filteredServices.map(service => 
                this.generateServiceCardHtml(service)
            ).join('');
            
            // Fade back in
            grid.style.opacity = '1';
        }, 150);
    }

    toggleServiceDetails(card, serviceId) {
        const isExpanded = card.classList.contains('expanded');
        
        // Close all other expanded cards
        this.closeAllExpandedCards();
        
        if (!isExpanded) {
            card.classList.add('expanded');
            this.expandedCard = serviceId;
            
            // Scroll card into view if needed
            setTimeout(() => {
                const cardRect = card.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                if (cardRect.bottom > viewportHeight) {
                    card.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
            }, 300);
        }
    }

    closeAllExpandedCards() {
        document.querySelectorAll('.service-card-compact.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
        this.expandedCard = null;
    }

    // Method to update services data
    updateServices(newServices) {
        this.services = newServices;
        this.createServicesOverview();
    }

    // Method to add new service
    addService(service) {
        this.services.push(service);
        this.updateServicesGrid();
    }
}

// Initialize services overview when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.servicesOverview = new ServicesOverview();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServicesOverview;
}