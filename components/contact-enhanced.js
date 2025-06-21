/**
 * Enhanced Contact Form Component with Web3Forms Integration
 * Advanced form handling with validation, animations, and user experience features
 */

class EnhancedContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form?.querySelector('.submit-btn');
        this.successMessage = document.getElementById('successMessage');
        this.isSubmitting = false;
        
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'Please enter a valid first name (letters only, minimum 2 characters)'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'Please enter a valid last name (letters only, minimum 2 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: true,
                pattern: /^[\+]?[\d\s\-\(\)]{10,}$/,
                message: 'Please enter a valid phone number (minimum 10 digits)'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Please enter a message between 10 and 1000 characters'
            }
        };
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupFormValidation();
        this.setupInteractiveElements();
        this.setupAccessibility();
        this.setupEnhancedCheckboxInteraction();
        this.loadSavedData();
    }

    setupEnhancedCheckboxInteraction() {
        // Enhanced checkbox interaction with maximum visual feedback
        const checkboxOptions = this.form.querySelectorAll('.checkbox-option');
        
        checkboxOptions.forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            const customCheckbox = option.querySelector('.checkbox-custom');
            
            if (!checkbox || !customCheckbox) return;
            
            // Handle clicks on the entire label area
            option.addEventListener('click', (e) => {
                // Prevent double-triggering if clicking directly on the hidden input
                if (e.target === checkbox) return;
                
                e.preventDefault();
                
                // Add click animation
                option.classList.add('clicking');
                setTimeout(() => option.classList.remove('clicking'), 200);
                
                // Toggle checkbox state
                checkbox.checked = !checkbox.checked;
                
                // Trigger change event for form handling
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Update visual state with enhanced feedback
                this.updateEnhancedCheckboxVisualState(checkbox, option, customCheckbox);
                
                // Save form data
                this.saveFormData(this.collectFormData());
                
                // Provide haptic feedback on supported devices
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
            
            // Handle keyboard interaction
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    
                    // Add click animation
                    option.classList.add('clicking');
                    setTimeout(() => option.classList.remove('clicking'), 200);
                    
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    this.updateEnhancedCheckboxVisualState(checkbox, option, customCheckbox);
                    this.saveFormData(this.collectFormData());
                    
                    // Haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                }
            });
            
            // Handle direct checkbox changes
            checkbox.addEventListener('change', () => {
                this.updateEnhancedCheckboxVisualState(checkbox, option, customCheckbox);
                this.saveFormData(this.collectFormData());
            });
            
            // Enhanced hover effects
            option.addEventListener('mouseenter', () => {
                if (!checkbox.checked) {
                    option.style.borderColor = '#3498db';
                    customCheckbox.style.borderColor = '#3498db';
                    customCheckbox.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.15)';
                }
            });
            
            option.addEventListener('mouseleave', () => {
                if (!checkbox.checked) {
                    option.style.borderColor = '#e1e8ed';
                    customCheckbox.style.borderColor = '#bdc3c7';
                    customCheckbox.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
            });
            
            // Make the option focusable
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'checkbox');
            option.setAttribute('aria-checked', checkbox.checked);
            
            // Initial visual state
            this.updateEnhancedCheckboxVisualState(checkbox, option, customCheckbox);
        });
    }

    updateEnhancedCheckboxVisualState(checkbox, option, customCheckbox) {
        // Add state changing animation
        option.classList.add('state-changing');
        setTimeout(() => option.classList.remove('state-changing'), 300);
        
        if (checkbox.checked) {
            // Checked state - maximum visual feedback
            option.classList.add('checked');
            option.style.background = 'linear-gradient(135deg, #e8f5e8, #f0f8f0)';
            option.style.borderColor = '#27ae60';
            option.style.boxShadow = '0 4px 20px rgba(39, 174, 96, 0.2)';
            
            customCheckbox.style.borderColor = '#27ae60';
            customCheckbox.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            customCheckbox.style.transform = 'scale(1.1)';
            customCheckbox.style.boxShadow = '0 4px 15px rgba(39, 174, 96, 0.3)';
            
            // Update text color
            const textSpan = option.querySelector('span:not(.checkbox-custom)');
            if (textSpan) {
                textSpan.style.color = '#27ae60';
                textSpan.style.fontWeight = '600';
            }
            
            option.setAttribute('aria-checked', 'true');
            
            // Add success sound effect (if audio context is available)
            this.playCheckSound();
            
        } else {
            // Unchecked state
            option.classList.remove('checked');
            option.style.background = '#ffffff';
            option.style.borderColor = '#e1e8ed';
            option.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            
            customCheckbox.style.borderColor = '#bdc3c7';
            customCheckbox.style.background = '#ffffff';
            customCheckbox.style.transform = 'scale(1)';
            customCheckbox.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            
            // Reset text color
            const textSpan = option.querySelector('span:not(.checkbox-custom)');
            if (textSpan) {
                textSpan.style.color = '#2c3e50';
                textSpan.style.fontWeight = '500';
            }
            
            option.setAttribute('aria-checked', 'false');
        }
    }

    playCheckSound() {
        // Create a subtle audio feedback for checkbox interaction
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio feedback not available, silently continue
        }
    }

    setupFormValidation() {
        // Real-time validation on input
        Object.keys(this.validationRules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });

        // Form submission validation
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    validateField(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        // Pattern validation
        else if (value && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }
        // Length validation
        else if (value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`;
        }
        else if (value && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must be less than ${rules.maxLength} characters`;
        }

        // Update UI
        if (isValid) {
            formGroup.classList.remove('error');
            errorElement.textContent = '';
        } else {
            formGroup.classList.add('error');
            errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    clearFieldError(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (formGroup.classList.contains('error') && field.value.trim()) {
            formGroup.classList.remove('error');
            errorElement.textContent = '';
        }
    }

    getFieldLabel(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const label = field.closest('.form-group').querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : fieldName;
    }

    validateForm() {
        let isValid = true;
        
        Object.keys(this.validationRules).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleFormSubmission() {
        if (this.isSubmitting) return;

        // Validate form
        if (!this.validateForm()) {
            this.focusFirstError();
            this.showFormError('Please correct the errors above and try again.');
            return;
        }

        this.isSubmitting = true;
        this.setSubmitButtonLoading(true);

        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Save form data to localStorage
            this.saveFormData(formData);
            
            // Submit to Web3Forms
            await this.submitToWeb3Forms(formData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Track analytics
            this.trackFormSubmission(formData);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Sorry, there was an error sending your message. Please try again or contact us directly.');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Handle checkbox values properly
        const newsletterCheckbox = this.form.querySelector('input[name="newsletter"]');
        if (newsletterCheckbox) {
            data.newsletter = newsletterCheckbox.checked;
        }
        
        // Add timestamp and additional metadata
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        data.referrer = document.referrer;
        data.currentUrl = window.location.href;
        
        return data;
    }

    async submitToWeb3Forms(data) {
        // Create FormData for Web3Forms submission
        const formData = new FormData();
        
        // Add Web3Forms required fields
        formData.append('access_key', 'c583e567-b467-4f99-a1b0-3c818882d856');
        formData.append('subject', 'New Security Consultation Request from Defendra Website');
        formData.append('from_name', 'Defendra Website');
        
        // Add form fields
        formData.append('email', data.email);
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('phone', data.phone);
        formData.append('message', data.message);
        
        // Add newsletter preference
        formData.append('newsletter_signup', data.newsletter ? 'Yes' : 'No');
        
        // Add metadata
        formData.append('submission_time', data.timestamp);
        formData.append('page_url', data.currentUrl);
        formData.append('referrer', data.referrer || 'Direct');
        
        // Anti-spam honeypot
        formData.append('botcheck', '');
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Form submission failed');
        }

        return await response.json();
    }

    showSuccessMessage() {
        this.successMessage.classList.add('show');
        this.form.style.display = 'none';
        
        // Setup "Send Another Message" button
        const sendAnotherBtn = this.successMessage.querySelector('.send-another-btn');
        if (sendAnotherBtn) {
            sendAnotherBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }
        
        // Auto-scroll to success message
        this.successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }

    resetForm() {
        this.form.reset();
        this.form.style.display = 'block';
        this.successMessage.classList.remove('show');
        
        // Clear all errors
        this.form.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
            group.querySelector('.error-message').textContent = '';
        });
        
        // Reset checkbox visual states
        this.form.querySelectorAll('.checkbox-option').forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            const customCheckbox = option.querySelector('.checkbox-custom');
            if (checkbox && customCheckbox) {
                option.classList.remove('checked');
                this.updateEnhancedCheckboxVisualState(checkbox, option, customCheckbox);
            }
        });
        
        // Focus first field
        const firstField = this.form.querySelector('input, select, textarea');
        if (firstField) {
            firstField.focus();
        }
        
        // Clear saved data
        localStorage.removeItem('contactFormData');
    }

    setSubmitButtonLoading(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    showFormError(message) {
        // Create or update error message
        let errorDiv = this.form.querySelector('.form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                background: #fee;
                color: #c33;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border: 1px solid #fcc;
                font-weight: 500;
            `;
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        
        errorDiv.textContent = message;
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    focusFirstError() {
        const firstError = this.form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
        if (firstError) {
            firstError.focus();
        }
    }

    setupInteractiveElements() {
        // Auto-save form data
        this.form.addEventListener('input', () => {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.saveFormData(this.collectFormData());
            }, 1000);
        });

        // Character counter for message field
        const messageField = this.form.querySelector('[name="message"]');
        if (messageField) {
            this.setupCharacterCounter(messageField);
        }

        // Phone number formatting
        const phoneField = this.form.querySelector('[name="phone"]');
        if (phoneField) {
            this.setupPhoneFormatting(phoneField);
        }
    }

    setupCharacterCounter(field) {
        const maxLength = this.validationRules.message.maxLength;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.85rem;
            color: #666;
            margin-top: 0.5rem;
        `;
        
        field.parentNode.appendChild(counter);
        
        const updateCounter = () => {
            const remaining = maxLength - field.value.length;
            counter.textContent = `${field.value.length}/${maxLength} characters`;
            counter.style.color = remaining < 50 ? '#e74c3c' : '#666';
        };
        
        field.addEventListener('input', updateCounter);
        updateCounter();
    }

    setupPhoneFormatting(field) {
        field.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // UK phone number formatting
            if (value.startsWith('44')) {
                value = '+44 ' + value.slice(2);
            } else if (value.startsWith('0')) {
                value = value.replace(/^0/, '+44 ');
            }
            
            // Add spaces for readability
            if (value.startsWith('+44')) {
                value = value.replace(/(\+44\s?)(\d{3})(\d{3})(\d{4})/, '$1$2 $3 $4');
            }
            
            e.target.value = value;
        });
    }

    setupAccessibility() {
        // Add ARIA labels and descriptions
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            const formGroup = field.closest('.form-group');
            
            // Skip fields that are not within a form group (e.g., hidden fields)
            if (!formGroup) return;
            
            const label = formGroup.querySelector('label');
            const errorElement = formGroup.querySelector('.error-message');
            
            if (label) {
                field.setAttribute('aria-labelledby', label.id || `label-${field.name}`);
                if (!label.id) label.id = `label-${field.name}`;
            }
            
            if (errorElement) {
                field.setAttribute('aria-describedby', `error-${field.name}`);
                errorElement.id = `error-${field.name}`;
            }
        });
    }

    saveFormData(data) {
        try {
            // Don't save sensitive data
            const safeData = { ...data };
            delete safeData.userAgent;
            delete safeData.timestamp;
            
            localStorage.setItem('contactFormData', JSON.stringify(safeData));
        } catch (e) {
            console.warn('Could not save form data to localStorage');
        }
    }

    loadSavedData() {
        try {
            const savedData = localStorage.getItem('contactFormData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field && data[key] !== undefined) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === true || data[key] === 'on';
                            // Update visual state for checkboxes
                            const option = field.closest('.checkbox-option');
                            const customCheckbox = field.parentNode.querySelector('.checkbox-custom');
                            if (option && customCheckbox) {
                                this.updateEnhancedCheckboxVisualState(field, option, customCheckbox);
                            }
                        } else {
                            field.value = data[key];
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('Could not load saved form data');
        }
    }

    trackFormSubmission(data) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_name': 'contact_form',
                'newsletter_signup': data.newsletter
            });
        }

        // Custom event for other tracking systems
        window.dispatchEvent(new CustomEvent('contactFormSubmitted', {
            detail: {
                timestamp: data.timestamp,
                newsletter: data.newsletter
            }
        }));
    }
}

// Initialize enhanced contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedContactForm = new EnhancedContactForm();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedContactForm;
}