"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidatedAuthBody = getValidatedAuthBody;
function getValidatedAuthBody(body) {
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();
    if (!email || !password) {
        return null;
    }
    return { email, password };
}
