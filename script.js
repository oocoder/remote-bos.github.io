/**
 * Form validation and submission handler for Remote BOS waitlist
 */

// Form validation rules
const ValidationRules = {
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        messages: {
            required: 'First name is required',
            minLength: 'First name must be at least 2 characters',
            maxLength: 'First name must be less than 50 characters',
            pattern: 'First name can only contain letters, spaces, hyphens, and apostrophes'
        }
    },
    lastName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        messages: {
            required: 'Last name is required',
            minLength: 'Last name must be at least 2 characters',
            maxLength: 'Last name must be less than 50 characters',
            pattern: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
        }
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: {
            required: 'Email is required',
            pattern: 'Please enter a valid email address'
        }
    }
};

/**
 * Validates a single form field
 * @param {string} fieldName - Name of the field to validate
 * @param {string} value - Value to validate
 * @returns {Object} - {valid: boolean, message: string}
 */
function validateField(fieldName, value) {
    const rules = ValidationRules[fieldName];

    if (!rules) {
        return { valid: true, message: '' };
    }

    // Handle null or undefined values
    if (value == null) {
        if (rules.required) {
            return { valid: false, message: rules.messages.required };
        }
        return { valid: true, message: '' };
    }

    // Convert to string if needed
    const strValue = String(value);

    // Check required
    if (rules.required && !strValue.trim()) {
        return { valid: false, message: rules.messages.required };
    }

    // Check min length
    if (rules.minLength && strValue.trim().length < rules.minLength) {
        return { valid: false, message: rules.messages.minLength };
    }

    // Check max length
    if (rules.maxLength && strValue.trim().length > rules.maxLength) {
        return { valid: false, message: rules.messages.maxLength };
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(strValue.trim())) {
        return { valid: false, message: rules.messages.pattern };
    }

    return { valid: true, message: '' };
}

/**
 * Displays error message for a field
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message to display
 */
function showError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);

    if (input && errorElement) {
        input.classList.add('error');
        errorElement.textContent = message;
    }
}

/**
 * Clears error message for a field
 * @param {string} fieldName - Name of the field
 */
function clearError(fieldName) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);

    if (input && errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
    }
}

/**
 * Validates all form fields
 * @param {FormData} formData - Form data to validate
 * @returns {boolean} - True if all fields are valid
 */
function validateForm(formData) {
    let isValid = true;

    for (const [fieldName, value] of formData.entries()) {
        const validation = validateField(fieldName, value);

        if (!validation.valid) {
            showError(fieldName, validation.message);
            isValid = false;
        } else {
            clearError(fieldName);
        }
    }

    return isValid;
}

/**
 * Submits form data to backend
 * @param {Object} data - Form data to submit
 * @returns {Promise} - Promise that resolves with submission result
 */
async function submitToBackend(data) {
    // TODO: Replace with actual backend endpoint (Firebase, Google Sheets, etc.)
    // For now, simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful submission
            console.log('Form submitted:', data);
            resolve({ success: true });

            // Uncomment to simulate error:
            // reject(new Error('Submission failed'));
        }, 1000);
    });
}

/**
 * Tracks form submission in Google Analytics
 * @param {Object} data - Form data that was submitted
 */
function trackFormSubmission(data) {
    if (typeof gtag === 'function') {
        gtag('event', 'form_submission', {
            'event_category': 'waitlist',
            'event_label': 'waitlist_signup',
            'value': 1
        });
    }
}

/**
 * Main form submission handler
 */
function initializeForm() {
    const form = document.getElementById('waitlist-form');

    if (!form) {
        console.error('Waitlist form not found');
        return;
    }

    // Add real-time validation on blur
    ['firstName', 'lastName', 'email'].forEach(fieldName => {
        const input = document.getElementById(fieldName);
        if (input) {
            input.addEventListener('blur', () => {
                const validation = validateField(fieldName, input.value);
                if (!validation.valid) {
                    showError(fieldName, validation.message);
                } else {
                    clearError(fieldName);
                }
            });

            // Clear error on input
            input.addEventListener('input', () => {
                clearError(fieldName);
            });
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Disable submit button during submission
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            // Convert FormData to object
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value.trim();
            });

            // Submit to backend
            await submitToBackend(data);

            // Track in analytics
            trackFormSubmission(data);

            // Redirect to thank you page
            window.location.href = 'thank-you.html';

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error submitting your information. Please try again.');

            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Initialize form when DOM is ready (only in browser environment)
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeForm);
    } else {
        initializeForm();
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        ValidationRules
    };
}
