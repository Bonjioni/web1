/**
 * Social Media Icons Component
 * Standardized social media icons with consistent behavior
 */

class SocialIcons {
    constructor() {
        this.icons = {
            twitter: {
                url: 'https://twitter.com/defendraltd',
                icon: 'fab fa-twitter',
                label: 'Follow us on Twitter',
                ariaLabel: 'Follow Defendra on Twitter (opens in new tab)'
            },
            facebook: {
                url: 'https://www.facebook.com/people/Defendra/61561686682282/',
                icon: 'fab fa-facebook-f',
                label: 'Like us on Facebook',
                ariaLabel: 'Like Defendra on Facebook (opens in new tab)'
            },
            instagram: {
                url: 'https://www.instagram.com/defendra_solutions',
                icon: 'fab fa-instagram',
                label: 'Follow us on Instagram',
                ariaLabel: 'Follow Defendra on Instagram (opens in new tab)'
            },
            linkedin: {
                url: 'https://www.linkedin.com/company/defendra',
                icon: 'fab fa-linkedin-in',
                label: 'Connect on LinkedIn',
                ariaLabel: 'Connect with Defendra on LinkedIn (opens in new tab)'
            },
            youtube: {
                url: 'https://www.youtube.com/@defendra',
                icon: 'fab fa-youtube',
                label: 'Subscribe on YouTube',
                ariaLabel: 'Subscribe to Defendra on YouTube (opens in new tab)'
            }
        };
        
        this.init();
    }

    init() {
        this.createSocialIcons();
        this.addEventListeners();
    }

    createSocialIcons() {
        const containers = document.querySelectorAll('[data-social-icons]');
        
        containers.forEach(container => {
            const config = this.parseConfig(container.dataset.socialIcons);
            const iconsHtml = this.generateIconsHtml(config);
            container.innerHTML = iconsHtml;
        });
    }

    parseConfig(configString) {
        const defaultConfig = {
            platforms: ['twitter', 'facebook', 'instagram'],
            size: 'default',
            style: 'default',
            newTab: true,
            showLabels: false
        };

        if (!configString) return defaultConfig;

        try {
            const config = JSON.parse(configString.replace(/'/g, '"'));
            return { ...defaultConfig, ...config };
        } catch (e) {
            console.warn('Invalid social icons configuration, using defaults');
            return defaultConfig;
        }
    }

    generateIconsHtml(config) {
        const containerClasses = this.getContainerClasses(config);
        
        const iconsHtml = config.platforms
            .filter(platform => this.icons[platform])
            .map(platform => this.createIconHtml(platform, config))
            .join('');

        return `<div class="${containerClasses}">${iconsHtml}</div>`;
    }

    getContainerClasses(config) {
        let classes = ['social-icons-container'];
        
        if (config.size === 'small') classes.push('social-icons-small');
        if (config.size === 'large') classes.push('social-icons-large');
        if (config.layout === 'vertical') classes.push('social-icons-vertical');
        if (config.layout === 'centered') classes.push('social-icons-centered');
        if (config.spacing === 'wide') classes.push('social-icons-spaced');
        if (config.context === 'footer') classes.push('footer-social-icons');
        if (config.context === 'header') classes.push('header-social-icons');
        if (config.context === 'sidebar') classes.push('sidebar-social-icons');
        
        return classes.join(' ');
    }

    createIconHtml(platform, config) {
        const iconData = this.icons[platform];
        const target = config.newTab ? '_blank' : '_self';
        const rel = config.newTab ? 'noopener noreferrer' : '';
        
        return `
            <a href="${iconData.url}" 
               class="social-icon ${platform}" 
               target="${target}" 
               rel="${rel}"
               aria-label="${iconData.ariaLabel}"
               title="${iconData.label}"
               data-platform="${platform}">
                <i class="${iconData.icon}" aria-hidden="true"></i>
                ${config.showLabels ? `<span class="sr-only">${iconData.label}</span>` : ''}
            </a>
        `;
    }

    addEventListeners() {
        // Track social media clicks for analytics
        document.addEventListener('click', (e) => {
            if (e.target.closest('.social-icon')) {
                const link = e.target.closest('.social-icon');
                const platform = link.dataset.platform;
                
                // Analytics tracking (if available)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'social_click', {
                        'social_platform': platform,
                        'social_action': 'click',
                        'social_target': link.href
                    });
                }
                
                // Add loading state
                link.classList.add('loading');
                
                // Remove loading state after a short delay
                setTimeout(() => {
                    link.classList.remove('loading');
                }, 1000);
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('social-icon')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });
    }

    // Method to update social media URLs
    updateUrls(newUrls) {
        Object.keys(newUrls).forEach(platform => {
            if (this.icons[platform]) {
                this.icons[platform].url = newUrls[platform];
            }
        });
        
        // Refresh all social icon containers
        this.createSocialIcons();
    }

    // Method to add new platform
    addPlatform(platform, config) {
        this.icons[platform] = config;
        this.createSocialIcons();
    }
}

// Initialize social icons when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.socialIcons = new SocialIcons();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialIcons;
}