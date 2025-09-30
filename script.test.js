/**
 * Test suite for form validation
 * Following TDD/BDD principles
 */

// Mock implementation for testing (in real scenario, use Jest, Mocha, or similar)
const { validateField, ValidationRules } = require('./script.js');

// Simple test runner
class TestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    describe(suiteName, callback) {
        console.log(`\n${suiteName}`);
        callback();
    }

    it(testName, callback) {
        try {
            callback();
            this.passed++;
            console.log(`  ✓ ${testName}`);
        } catch (error) {
            this.failed++;
            console.log(`  ✗ ${testName}`);
            console.log(`    ${error.message}`);
        }
    }

    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected}, but got ${actual}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
                }
            },
            toBeTruthy: () => {
                if (!actual) {
                    throw new Error(`Expected truthy value, but got ${actual}`);
                }
            },
            toBeFalsy: () => {
                if (actual) {
                    throw new Error(`Expected falsy value, but got ${actual}`);
                }
            }
        };
    }

    summary() {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Tests Passed: ${this.passed}`);
        console.log(`Tests Failed: ${this.failed}`);
        console.log(`Total Tests: ${this.passed + this.failed}`);
        console.log(`${'='.repeat(50)}\n`);
        return this.failed === 0;
    }
}

// Initialize test runner
const test = new TestRunner();

// ============================================
// Email Validation Tests (TDD - Start with failing tests)
// ============================================

test.describe('Email Validation', () => {
    test.it('should reject empty email', () => {
        const result = validateField('email', '');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.email.messages.required);
    });

    test.it('should reject email without @ symbol', () => {
        const result = validateField('email', 'invalidemail.com');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.email.messages.pattern);
    });

    test.it('should reject email without domain', () => {
        const result = validateField('email', 'user@');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.email.messages.pattern);
    });

    test.it('should reject email without TLD', () => {
        const result = validateField('email', 'user@domain');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.email.messages.pattern);
    });

    test.it('should accept valid email', () => {
        const result = validateField('email', 'user@example.com');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });

    test.it('should accept email with subdomain', () => {
        const result = validateField('email', 'user@mail.example.com');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });

    test.it('should accept email with plus addressing', () => {
        const result = validateField('email', 'user+tag@example.com');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });
});

// ============================================
// First Name Validation Tests
// ============================================

test.describe('First Name Validation', () => {
    test.it('should reject empty first name', () => {
        const result = validateField('firstName', '');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.firstName.messages.required);
    });

    test.it('should reject first name with only whitespace', () => {
        const result = validateField('firstName', '   ');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.firstName.messages.required);
    });

    test.it('should reject first name shorter than 2 characters', () => {
        const result = validateField('firstName', 'A');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.firstName.messages.minLength);
    });

    test.it('should reject first name longer than 50 characters', () => {
        const result = validateField('firstName', 'A'.repeat(51));
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.firstName.messages.maxLength);
    });

    test.it('should reject first name with numbers', () => {
        const result = validateField('firstName', 'John123');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.firstName.messages.pattern);
    });

    test.it('should reject first name with special characters', () => {
        const result = validateField('firstName', 'John@');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.firstName.messages.pattern);
    });

    test.it('should accept valid first name', () => {
        const result = validateField('firstName', 'John');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });

    test.it('should accept first name with hyphen', () => {
        const result = validateField('firstName', 'Mary-Jane');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });

    test.it('should accept first name with apostrophe', () => {
        const result = validateField('firstName', "O'Brien");
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });

    test.it('should accept first name with space', () => {
        const result = validateField('firstName', 'Mary Ann');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });
});

// ============================================
// Last Name Validation Tests
// ============================================

test.describe('Last Name Validation', () => {
    test.it('should reject empty last name', () => {
        const result = validateField('lastName', '');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.lastName.messages.required);
    });

    test.it('should reject last name with only whitespace', () => {
        const result = validateField('lastName', '   ');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.lastName.messages.required);
    });

    test.it('should reject last name shorter than 2 characters', () => {
        const result = validateField('lastName', 'A');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.lastName.messages.minLength);
    });

    test.it('should reject last name longer than 50 characters', () => {
        const result = validateField('lastName', 'A'.repeat(51));
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.lastName.messages.maxLength);
    });

    test.it('should reject last name with numbers', () => {
        const result = validateField('lastName', 'Smith123');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.lastName.messages.pattern);
    });

    test.it('should reject last name with special characters', () => {
        const result = validateField('lastName', 'Smith@');
        test.expect(result.valid).toBeFalsy();
        test.expect(result.message).toBe(ValidationRules.lastName.messages.pattern);
    });

    test.it('should accept valid last name', () => {
        const result = validateField('lastName', 'Smith');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });

    test.it('should accept last name with hyphen', () => {
        const result = validateField('lastName', 'Smith-Jones');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });

    test.it('should accept last name with apostrophe', () => {
        const result = validateField('lastName', "O'Connor");
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });

    test.it('should accept last name with space', () => {
        const result = validateField('lastName', 'Van Der Berg');
        test.expect(result.valid).toBeTruthy();
        test.expect(result.message).toBe('');
    });
});

// ============================================
// Edge Cases and Negative Tests
// ============================================

test.describe('Edge Cases and Negative Tests', () => {
    test.it('should handle null input', () => {
        const result = validateField('email', null);
        test.expect(result.valid).toBeFalsy();
    });

    test.it('should handle undefined input', () => {
        const result = validateField('email', undefined);
        test.expect(result.valid).toBeFalsy();
    });

    test.it('should trim whitespace before validation', () => {
        const result = validateField('firstName', '  John  ');
        test.expect(result.valid).toBeTruthy();
    });

    test.it('should handle unknown field names gracefully', () => {
        const result = validateField('unknownField', 'value');
        test.expect(result.valid).toBeTruthy();
    });

    test.it('should reject email with spaces', () => {
        const result = validateField('email', 'user @example.com');
        test.expect(result.valid).toBeFalsy();
    });

    test.it('should reject email with multiple @ symbols', () => {
        const result = validateField('email', 'user@@example.com');
        test.expect(result.valid).toBeFalsy();
    });
});

// Run tests and display summary
const allTestsPassed = test.summary();

// Exit with appropriate code for CI/CD
if (typeof process !== 'undefined' && process.exit) {
    process.exit(allTestsPassed ? 0 : 1);
}
