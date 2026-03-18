"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeString = normalizeString;
exports.normalizeEmail = normalizeEmail;
exports.isValidEmail = isValidEmail;
exports.isIntegerInRange = isIntegerInRange;
exports.isNonNegativeInteger = isNonNegativeInteger;
exports.isPositiveInteger = isPositiveInteger;
function normalizeString(value) {
    return typeof value === 'string' ? value.trim() : '';
}
function normalizeEmail(value) {
    return normalizeString(value).toLowerCase();
}
function isValidEmail(email) {
    const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email_regex.test(email);
}
function isIntegerInRange(value, min, max) {
    return (typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= min &&
        value <= max);
}
function isNonNegativeInteger(value) {
    return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}
function isPositiveInteger(value) {
    return typeof value === 'number' && Number.isInteger(value) && value > 0;
}
