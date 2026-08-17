"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("../../controllers/authController");
const services_1 = require("../../services");
const authValidators_1 = require("../../validators/authValidators");
const authHelpers_1 = require("../../helpers/authHelpers");
const sendSignupCode_1 = __importDefault(require("../../helpers/sendSignupCode"));
const sendPasswordResetLink_1 = __importDefault(require("../../helpers/sendPasswordResetLink"));
const sendPasswordResetSuccessNotification_1 = __importDefault(require("../../helpers/sendPasswordResetSuccessNotification"));
jest.mock("../../services", () => ({
    authService: {
        getUserByEmail: jest.fn(),
        createSignupCode: jest.fn(),
        getLatestValidSignupCode: jest.fn(),
        findExistingUser: jest.fn(),
        createUser: jest.fn(),
        getUserByIdentity: jest.fn(),
        createResetCode: jest.fn(),
        findValidResetCodeRecord: jest.fn(),
        updatePassword: jest.fn(),
    },
}));
jest.mock("../../validators/authValidators", () => ({
    failIfEmpty: jest.fn(),
    failIfUserExists: jest.fn(),
    validateCredentials: jest.fn(),
    failIfVerificationCodeIsNotValid: jest.fn(),
    failIfPasswordWeak: jest.fn(),
}));
jest.mock("../../helpers/authHelpers", () => ({
    generateTokensAndSendResponse: jest.fn(),
}));
jest.mock("../../helpers/sendSignupCode", () => jest.fn());
jest.mock("../../helpers/sendPasswordResetLink", () => jest.fn());
jest.mock("../../helpers/sendPasswordResetSuccessNotification", () => jest.fn());
describe("authController", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { body: {} };
        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            clearCookie: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
        // Default safe mock behavior
        authValidators_1.failIfEmpty.mockImplementation(() => { });
        authValidators_1.failIfPasswordWeak.mockImplementation(() => { });
        authValidators_1.failIfUserExists.mockImplementation(() => { });
        authValidators_1.validateCredentials.mockImplementation(() => { });
        authValidators_1.failIfVerificationCodeIsNotValid.mockImplementation(() => { });
    });
    describe("requestSignUpCode", () => {
        it("should send signup code if email is valid and user doesn't exist", async () => {
            req.body.email = "test@example.com";
            services_1.authService.getUserByEmail.mockResolvedValue(null);
            services_1.authService.createSignupCode.mockResolvedValue("123456");
            await (0, authController_1.requestSignUpCode)(req, res, next);
            expect(authValidators_1.failIfEmpty).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(services_1.authService.getUserByEmail).toHaveBeenCalledWith("test@example.com");
            expect(services_1.authService.createSignupCode).toHaveBeenCalledWith("test@example.com");
            expect(sendSignupCode_1.default).toHaveBeenCalledWith({
                toEmail: "test@example.com",
                otpCode: "123456",
            });
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                email: "test@example.com",
            });
        });
        it("should call next with error if something fails", async () => {
            const error = new Error("fail");
            authValidators_1.failIfEmpty.mockImplementation(() => {
                throw error;
            });
            await (0, authController_1.requestSignUpCode)(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
    describe("verifySignUpCode", () => {
        it("should verify and destroy signup code", async () => {
            req.body = { email: "test@example.com", code: "123456" };
            const row = { destroy: jest.fn() };
            services_1.authService.getLatestValidSignupCode.mockResolvedValue(row);
            await (0, authController_1.verifySignUpCode)(req, res, next);
            expect(services_1.authService.getLatestValidSignupCode).toHaveBeenCalledWith("test@example.com");
            expect(authValidators_1.failIfVerificationCodeIsNotValid).toHaveBeenCalledWith("123456", row);
            expect(row.destroy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ success: true });
        });
        it("should call next with error if verification fails", async () => {
            req.body = { email: "test@example.com", code: "bad" };
            const row = { destroy: jest.fn() };
            services_1.authService.getLatestValidSignupCode.mockResolvedValue(row);
            authValidators_1.failIfVerificationCodeIsNotValid.mockImplementation(() => {
                throw new Error("Invalid code");
            });
            await (0, authController_1.verifySignUpCode)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(row.destroy).not.toHaveBeenCalled();
        });
    });
    describe("register", () => {
        it("should create user and send tokens", async () => {
            req.body = {
                username: "user",
                email: "test@example.com",
                password: "pass",
                firstname: "A",
                lastname: "B",
            };
            services_1.authService.findExistingUser.mockResolvedValue(null);
            services_1.authService.createUser.mockResolvedValue({ id: 1 });
            await (0, authController_1.register)(req, res, next);
            expect(authValidators_1.failIfPasswordWeak).toHaveBeenCalledWith("pass");
            expect(authHelpers_1.generateTokensAndSendResponse).toHaveBeenCalledWith({
                res,
                user: { id: 1 },
            });
        });
        it("should call next with error if user already exists", async () => {
            req.body = {
                username: "user",
                email: "test@example.com",
                password: "pass",
            };
            services_1.authService.findExistingUser.mockResolvedValue({ id: 1 });
            authValidators_1.failIfUserExists.mockImplementation(() => {
                throw new Error("User exists");
            });
            await (0, authController_1.register)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(authHelpers_1.generateTokensAndSendResponse).not.toHaveBeenCalled();
        });
    });
    describe("signin", () => {
        it("should validate credentials and send tokens (username login)", async () => {
            req.body = { username: "user", password: "pass" };
            services_1.authService.getUserByIdentity.mockResolvedValue({ id: 1 });
            await (0, authController_1.signin)(req, res, next);
            expect(services_1.authService.getUserByIdentity).toHaveBeenCalledWith({
                email: undefined,
                username: "user",
            });
            expect(authValidators_1.validateCredentials).toHaveBeenCalledWith({ id: 1 }, "pass");
            expect(authHelpers_1.generateTokensAndSendResponse).toHaveBeenCalledWith({
                res,
                user: { id: 1 },
            });
        });
        it("should validate credentials and send tokens (email login)", async () => {
            req.body = { email: "test@example.com", password: "pass" };
            services_1.authService.getUserByIdentity.mockResolvedValue({ id: 1 });
            await (0, authController_1.signin)(req, res, next);
            expect(authValidators_1.failIfEmpty).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "pass",
            });
            expect(services_1.authService.getUserByIdentity).toHaveBeenCalledWith({
                email: "test@example.com",
                username: undefined,
            });
            expect(authValidators_1.validateCredentials).toHaveBeenCalledWith({ id: 1 }, "pass");
            expect(authHelpers_1.generateTokensAndSendResponse).toHaveBeenCalledWith({
                res,
                user: { id: 1 },
            });
        });
        it("should call next if credentials invalid", async () => {
            req.body = { username: "user", password: "wrong" };
            services_1.authService.getUserByIdentity.mockResolvedValue({ id: 1 });
            authValidators_1.validateCredentials.mockImplementation(() => {
                throw new Error("Invalid credentials");
            });
            await (0, authController_1.signin)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(authHelpers_1.generateTokensAndSendResponse).not.toHaveBeenCalled();
        });
    });
    describe("forgotPassword", () => {
        it("should send reset link if user exists", async () => {
            req.body = { email: "test@example.com" };
            services_1.authService.getUserByEmail.mockResolvedValue({ id: 1 });
            services_1.authService.createResetCode.mockResolvedValue("reset123");
            await (0, authController_1.forgotPassword)(req, res, next);
            expect(sendPasswordResetLink_1.default).toHaveBeenCalledWith({
                toEmail: "test@example.com",
                resetCode: "reset123",
            });
        });
        it("should respond with message if user not found", async () => {
            req.body = { email: "notfound@example.com" };
            services_1.authService.getUserByEmail.mockResolvedValue(null);
            await (0, authController_1.forgotPassword)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "A reset link has been sent to notfound@example.com",
            });
        });
        it("should call next with error if sending fails", async () => {
            req.body = { email: "test@example.com" };
            services_1.authService.getUserByEmail.mockResolvedValue({ id: 1 });
            services_1.authService.createResetCode.mockResolvedValue("reset123");
            sendPasswordResetLink_1.default.mockImplementation(() => {
                throw new Error("Mail fail");
            });
            await (0, authController_1.forgotPassword)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
    describe("resetPassword", () => {
        it("should update password if reset code valid", async () => {
            req.body = { resetCode: "code123", password: "newpass" };
            const resetCodeRecord = { email: "test@example.com", destroy: jest.fn() };
            services_1.authService.findValidResetCodeRecord.mockResolvedValue(resetCodeRecord);
            await (0, authController_1.resetPassword)(req, res, next);
            expect(services_1.authService.updatePassword).toHaveBeenCalledWith("test@example.com", "newpass");
            expect(resetCodeRecord.destroy).toHaveBeenCalled();
            expect(sendPasswordResetSuccessNotification_1.default).toHaveBeenCalledWith({
                toEmail: "test@example.com",
            });
            expect(res.json).toHaveBeenCalledWith({
                message: "Password successfully updated",
            });
        });
        it("should return 400 if reset code invalid", async () => {
            req.body = { resetCode: "invalid", password: "newpass" };
            services_1.authService.findValidResetCodeRecord.mockResolvedValue(null);
            await (0, authController_1.resetPassword)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid or expired token",
            });
        });
        it("should call next with error if notification fails", async () => {
            req.body = { resetCode: "good", password: "pass" };
            const resetCodeRecord = { email: "test@example.com", destroy: jest.fn() };
            services_1.authService.findValidResetCodeRecord.mockResolvedValue(resetCodeRecord);
            sendPasswordResetSuccessNotification_1.default.mockImplementation(() => {
                throw new Error("Notify fail");
            });
            await (0, authController_1.resetPassword)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(res.json).not.toHaveBeenCalled();
        });
    });
    describe("signout", () => {
        it("should clear cookies and return message", () => {
            (0, authController_1.signout)(req, res);
            expect(res.clearCookie).toHaveBeenCalledWith("access_token");
            expect(res.clearCookie).toHaveBeenCalledWith("refresh_token");
            expect(res.json).toHaveBeenCalledWith({ message: "Logged out" });
        });
    });
});
