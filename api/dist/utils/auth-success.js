"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRegisterSuccess = sendRegisterSuccess;
exports.sendLoginSuccess = sendLoginSuccess;
function sendRegisterSuccess(res, message) {
    const body = { message };
    res.status(201).json(body);
}
function sendLoginSuccess(res, message, user) {
    const body = {
        message,
        user,
    };
    res.json(body);
}
