"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.resetPassword = exports.forgotPassword = exports.signin = exports.register = exports.verifySignUpCode = exports.requestSignUpCode = void 0;
const authHelpers_1 = require("../helpers/authHelpers");
const sendPasswordResetLink_1 = __importDefault(require("../helpers/sendPasswordResetLink"));
const sendPasswordResetSuccessNotification_1 = __importDefault(require("../helpers/sendPasswordResetSuccessNotification"));
const sendSignupCode_1 = __importDefault(require("../helpers/sendSignupCode"));
const services_1 = require("../services");
const authValidators_1 = require("../validators/authValidators");
/**
 * Handles signup code request.
 */
const requestSignUpCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        (0, authValidators_1.failIfEmpty)({ email });
        const user = await services_1.authService.getUserByEmail(email);
        (0, authValidators_1.failIfUserExists)(user);
        const code = await services_1.authService.createSignupCode(email);
        await (0, sendSignupCode_1.default)({ toEmail: email, otpCode: code });
        res.json({ success: true, email });
    }
    catch (e) {
        next(e);
    }
};
exports.requestSignUpCode = requestSignUpCode;
/**
 * Verifies a signup code sent to user's email.
 */
const verifySignUpCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const row = await services_1.authService.getLatestValidSignupCode(email);
        await (0, authValidators_1.failIfVerificationCodeIsNotValid)(code, row);
        await row.destroy();
        res.json({ success: true });
    }
    catch (e) {
        next(e);
    }
};
exports.verifySignUpCode = verifySignUpCode;
/**
 * Registers a new user after verifying signup code.
 */
const register = async (req, res, next) => {
    try {
        (0, authValidators_1.failIfEmpty)(req.body);
        const { username, email, password, firstname, lastname } = req.body;
        (0, authValidators_1.failIfPasswordWeak)(password);
        const existingUser = await services_1.authService.findExistingUser({
            email,
            username,
        });
        (0, authValidators_1.failIfUserExists)(existingUser);
        const user = await services_1.authService.createUser({
            username,
            email,
            firstname,
            lastname,
            password,
        });
        (0, authHelpers_1.generateTokensAndSendResponse)({ res, user });
    }
    catch (e) {
        next(e);
    }
};
exports.register = register;
/**
 * Logs a user in using username or email and password.
 */
const signin = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const identity = username || email;
        const isUsername = Boolean(username);
        (0, authValidators_1.failIfEmpty)({ [isUsername ? "username" : "email"]: identity, password });
        const user = await services_1.authService.getUserByIdentity({ email, username });
        await (0, authValidators_1.validateCredentials)(user, password);
        (0, authHelpers_1.generateTokensAndSendResponse)({ res, user: user });
    }
    catch (e) {
        next(e);
    }
};
exports.signin = signin;
/**
 * Handles forgot-password flow — sends reset link if user exists.
 */
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        (0, authValidators_1.failIfEmpty)({ email });
        const user = await services_1.authService.getUserByEmail(email);
        const message = `A reset link has been sent to ${email}`;
        if (!user)
            return res.status(200).json({ message });
        const resetCode = await services_1.authService.createResetCode(email);
        await (0, sendPasswordResetLink_1.default)({ toEmail: email, resetCode });
        res.json({ success: true, message });
    }
    catch (e) {
        next(e);
    }
};
exports.forgotPassword = forgotPassword;
/**
 * Handles password reset confirmation and update.
 */
const resetPassword = async (req, res, next) => {
    try {
        const { resetCode, password } = req.body;
        const resetCodeRecord = await services_1.authService.findValidResetCodeRecord(resetCode);
        if (!resetCodeRecord) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        await services_1.authService.updatePassword(resetCodeRecord.email, password);
        await resetCodeRecord.destroy();
        await (0, sendPasswordResetSuccessNotification_1.default)({
            toEmail: resetCodeRecord.email,
        });
        res.json({ message: "Password successfully updated" });
    }
    catch (e) {
        next(e);
    }
};
exports.resetPassword = resetPassword;
/**
 * Logs out user by clearing authentication cookies.
 */
const signout = (req, res) => {
    res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .json({ message: "Logged out" });
};
exports.signout = signout;
exports.default = {
    requestSignUpCode: exports.requestSignUpCode,
    verifySignUpCode: exports.verifySignUpCode,
    register: exports.register,
    signin: exports.signin,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword,
    signout: exports.signout,
};
