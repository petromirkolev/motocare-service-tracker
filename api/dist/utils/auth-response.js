"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAuthError = sendAuthError;
function sendAuthError(res, status_code, message) {
    const body = { error: message };
    res.status(status_code).json(body);
}
