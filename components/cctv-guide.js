/**
 * CCTV Guide Interactive Features
 * Enhances the comprehensive CCTV guide with interactive elements
 */

class CCTVGuide {
    constructor() {
        this.init();
    }

    init() {
        this.setupTableOfContents();
        this.setupFeatureChecklist();
        this.setupSmoothScrolling();
        this.setupProgressTracking();
        this.setupPrintFunctionality();
        this.addEventListeners();
    }

    setupTableOfContents() {
        // Highlight current section in TOC
        const tocLinks = document.querySelectorAll('.toc-nav a');
        const sections = document.querySelectorAll('.guide-step');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    
                    // Remove active class from all TOC links
                    tocLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.toc-nav a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupFeatureChecklist() {
        const checkboxes = document.querySelectorAll('.features-checklist input[type="checkbox"]');
        
        // Load saved preferences
        this.loadChecklistState();
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.saveChecklistState();
                this.updateChecklistProgress();
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'feature_selection', {
                        'feature_name': e.target.id,
                        'selected': e.target.checked
                    });
                }
            });
        });
        
        this.updateChecklistProgress();
    }

    loadChecklistState() {
        try {
            const saved = localStorage.getItem('cctv-guide-checklist');
            if (saved) {
                const state = JSON.parse(saved);
                Object.keys(state).forEach(id => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) {
                        checkbox.checked = state[id];
                    }
                });
            }
        } catch (e) {
            console.warn('Could not load checklist state');
        }
    }

    saveChecklistState() {
        try {
            const checkboxes = document.querySelectorAll('.features-checklist input[type="checkbox"]');
            const state = {};
            
            checkboxes.forEach(checkbox => {
                state[checkbox.id] = checkbox.checked;
            });
            
            localStorage.setItem('cctv-guide-checklist', JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save checklist state');
        }
    }

    updateChecklistProgress() {
        const checkboxes = document.querySelectorAll('.features-checklist input[type="checkbox"]');
        const checked = document.querySelectorAll('.features-checklist input[type="checkbox"]:checked');
        
        const progress = checkboxes.length > 0 ? (checked.length / checkboxes.length) * 100 : 0;
        
        // Update progress indicator if it exists
        const progressIndicator = document.querySelector('.checklist-progress');
        if (progressIndicator) {
            progressIndicator.style.width = `${progress}%`;
        }
        
        // Show completion message
        if (progress === 100) {
            this.showChecklistCompletion();
        }
    }

    showChecklistCompletion() {
        // Create or update completion message
        let completionMsg = document.querySelector('.checklist-completion');
        if (!completionMsg) {
            completionMsg = document.createElement('div');
            completionMsg.className = 'checklist-completion';
            completionMsg.innerHTML = `
                <div style="background: #d5f4e6; color: #27ae60; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center; font-weight: 600;">
                    <i class="fas fa-check-circle"></i> Great! You've identified all the features you need.
                </div>
            `;
            
            const checklist = document.querySelector('.features-checklist');
            if (checklist) {
                checklist.appendChild(completionMsg);
            }
        }
    }

    setupSmoothScrolling() {
        // Smooth scroll for TOC links
        document.querySelectorAll('.toc-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'guide_navigation', {
                            'section': targetId
                        });
                    }
                }
            });
        });
    }

    setupProgressTracking() {
        // Track reading progress
        const sections = document.querySelectorAll('.guide-step');
        const totalSections = sections.length;
        let completedSections = new Set();
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    completedSections.add(entry.target.id);
                    this.updateReadingProgress(completedSections.size, totalSections);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            progressObserver.observe(section);
        });
    }

    updateReadingProgress(completed, total) {
        const progress = (completed / total) * 100;
        
        // Update progress bar if it exists
        const progressBar = document.querySelector('.reading-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Track completion milestone
        if (progress === 100 && typeof gtag !== 'undefined') {
            gtag('event', 'guide_completed', {
                'guide_name': 'cctv_selection_guide'
            });
        }
    }

    setupPrintFunctionality() {
        // Enhanced print functionality
        const printBtn = document.querySelector('.download-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                // Add print-specific styles
                this.preparePrintVersion();
                
                // Trigger print
                window.print();
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'guide_download', {
                        'download_type': 'print',
                        'guide_name': 'cctv_selection_guide'
                    });
                }
            });
        }
    }

    preparePrintVersion() {
        // Expand all collapsed sections for printing
        const expandableElements = document.querySelectorAll('.expandable');
        expandableElements.forEach(element => {
            element.classList.add('expanded-for-print');
        });
        
        // Add print timestamp
        const printInfo = document.createElement('div');
        printInfo.className = 'print-info';
        printInfo.innerHTML = `
            <p style="font-size: 0.8rem; color: #666; margin-top: 2rem; text-align: center;">
                Downloaded from Defendra.co.uk on ${new Date().toLocaleDateString()}
            </p>
        `;
        
        const guideContent = document.querySelector('.guide-content');
        if (guideContent) {
            guideContent.appendChild(printInfo);
        }
    }

    addEventListeners() {
        // Camera type hover effects
        document.querySelectorAll('.camera-type').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Spec option interactions
        document.querySelectorAll('.spec-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from siblings
                const siblings = option.parentElement.querySelectorAll('.spec-option');
                siblings.forEach(sibling => sibling.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Save selection
                this.saveSpecSelection(option);
            });
        });

        // Budget tier interactions
        document.querySelectorAll('.budget-tier').forEach(tier => {
            tier.addEventListener('click', () => {
                // Remove selected class from all tiers
                document.querySelectorAll('.budget-tier').forEach(t => {
                    t.classList.remove('selected');
                });
                
                // Add selected class to clicked tier
                tier.classList.add('selected');
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    const tierType = tier.classList.contains('entry-level') ? 'entry' :
                                   tier.classList.contains('mid-range') ? 'mid' : 'professional';
                    
                    gtag('event', 'budget_selection', {
                        'budget_tier': tierType
                    });
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Navigate sections with arrow keys
            if (e.altKey) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateToNextSection();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateToPreviousSection();
                }
            }
        });
    }

    saveSpecSelection(option) {
        try {
            const category = option.closest('.spec-category').querySelector('h4').textContent;
            const selection = option.querySelector('.spec-label').textContent;
            
            let selections = JSON.parse(localStorage.getItem('cctv-guide-selections') || '{}');
            selections[category] = selection;
            
            localStorage.setItem('cctv-guide-selections', JSON.stringify(selections));
        } catch (e) {
            console.warn('Could not save spec selection');
        }
    }

    navigateToNextSection() {
        const currentSection = document.querySelector('.guide-step.in-view');
        if (currentSection) {
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && nextSection.classList.contains('guide-step')) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    navigateToPreviousSection() {
        const currentSection = document.querySelector('.guide-step.in-view');
        if (currentSection) {
            const prevSection = currentSection.previousElementSibling;
            if (prevSection && prevSection.classList.contains('guide-step')) {
                prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Method to generate personalized recommendations
    generateRecommendations() {
        try {
            const checklist = JSON.parse(localStorage.getItem('cctv-guide-checklist') || '{}');
            const selections = JSON.parse(localStorage.getItem('cctv-guide-selections') || '{}');
            
            const recommendations = {
                cameras: [],
                features: [],
                budget: 'mid-range'
            };
            
            // Analyze selections and generate recommendations
            if (checklist['motion-detection']) {
                recommendations.features.push('Smart motion detection with AI analytics');
            }
            
            if (checklist['mobile-viewing']) {
                recommendations.features.push('Mobile app with push notifications');
            }
            
            if (checklist['night-vision']) {
                recommendations.features.push('Advanced infrared night vision');
            }
            
            return recommendations;
        } catch (e) {
            console.warn('Could not generate recommendations');
            return null;
        }
    }
}

// Initialize CCTV Guide when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cctvGuide = new CCTVGuide();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CCTVGuide;
}