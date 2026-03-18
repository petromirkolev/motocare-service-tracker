"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../constants/auth");
const auth_service_1 = require("../services/auth-service");
const auth_response_1 = require("../utils/auth-response");
const auth_success_1 = require("../utils/auth-success");
const auth_validation_1 = require("../utils/auth-validation");
const validation_1 = require("../utils/validation");
const auth_router = (0, express_1.Router)();
auth_router.post('/register', async (req, res) => {
    const validatedBody = (0, auth_validation_1.getValidatedAuthBody)((req.body ?? {}));
    if (!validatedBody) {
        (0, auth_response_1.sendAuthError)(res, 400, auth_1.MISSING_AUTH_FIELDS_ERROR);
        return;
    }
    const email = (0, validation_1.normalizeEmail)(validatedBody.email);
    const password = validatedBody.password;
    if (!(0, validation_1.isValidEmail)(email)) {
        (0, auth_response_1.sendAuthError)(res, 400, 'Invalid email format');
        return;
    }
    if (password.length < 8) {
        (0, auth_response_1.sendAuthError)(res, 400, 'Password must be at least 8 characters');
        return;
    }
    if (password.length > 32) {
        (0, auth_response_1.sendAuthError)(res, 400, 'Password must be 32 characters at most');
        return;
    }
    try {
        const existingUser = await (0, auth_service_1.findUserByEmail)(email);
        if (existingUser) {
            (0, auth_response_1.sendAuthError)(res, 409, auth_1.USER_ALREADY_EXISTS_ERROR);
            return;
        }
        await (0, auth_service_1.createUser)(email, password);
        (0, auth_success_1.sendRegisterSuccess)(res, auth_1.REGISTER_SUCCESS_MESSAGE);
    }
    catch (error) {
        console.error('Register failed:', error);
        (0, auth_response_1.sendAuthError)(res, 500, auth_1.INTERNAL_SERVER_ERROR);
    }
});
auth_router.post('/login', async (req, res) => {
    const validatedBody = (0, auth_validation_1.getValidatedAuthBody)((req.body ?? {}));
    if (!validatedBody) {
        (0, auth_response_1.sendAuthError)(res, 400, auth_1.MISSING_AUTH_FIELDS_ERROR);
        return;
    }
    const email = (0, validation_1.normalizeEmail)(validatedBody.email);
    const password = validatedBody.password;
    try {
        const user = await (0, auth_service_1.findUserByEmail)(email);
        if (!user) {
            (0, auth_response_1.sendAuthError)(res, 401, auth_1.INVALID_CREDENTIALS_ERROR);
            return;
        }
        const isPasswordValid = await (0, auth_service_1.verifyUserPassword)(password, user.password_hash);
        if (!isPasswordValid) {
            (0, auth_response_1.sendAuthError)(res, 401, auth_1.INVALID_CREDENTIALS_ERROR);
            return;
        }
        (0, auth_success_1.sendLoginSuccess)(res, auth_1.LOGIN_SUCCESS_MESSAGE, {
            id: user.id,
            email: user.email,
        });
    }
    catch (error) {
        console.error('Login failed:', error);
        (0, auth_response_1.sendAuthError)(res, 500, auth_1.INTERNAL_SERVER_ERROR);
    }
});
exports.default = auth_router;
