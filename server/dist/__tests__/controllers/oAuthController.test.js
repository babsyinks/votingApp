"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const helpers = __importStar(require("../../helpers/oAuthHelpers"));
const oAuthController_1 = require("../../controllers/oAuthController");
// Mock helpers
jest.mock("../../helpers/oAuthHelpers", () => ({
    passportCallbackWrapper: jest.fn((provider) => `${provider}CallbackWrapper`),
    getOauthStartMiddleware: jest.fn((provider, _config) => `${provider}StartMiddleware`),
}));
describe("oAuthController", () => {
    describe("Middleware creation (import-time)", () => {
        it("creates google start middleware with correct args", () => {
            expect(oAuthController_1.googleOauthStart).toBe("googleStartMiddleware");
            expect(helpers.getOauthStartMiddleware).toHaveBeenCalledWith("google", {
                scope: ["email", "profile"],
            });
        });
        it("creates google conclude middleware with correct args", () => {
            expect(oAuthController_1.googleOauthConclude).toBe("googleCallbackWrapper");
            expect(helpers.passportCallbackWrapper).toHaveBeenCalledWith("google");
        });
        it("creates facebook start middleware with correct args", () => {
            expect(oAuthController_1.facebookOauthStart).toBe("facebookStartMiddleware");
            expect(helpers.getOauthStartMiddleware).toHaveBeenCalledWith("facebook", {
                scope: ["email", "public_profile"],
            });
        });
        it("creates facebook conclude middleware with correct args", () => {
            expect(oAuthController_1.facebookOauthConclude).toBe("facebookCallbackWrapper");
            expect(helpers.passportCallbackWrapper).toHaveBeenCalledWith("facebook");
        });
        it("creates github start middleware with correct args", () => {
            expect(oAuthController_1.githubOauthStart).toBe("githubStartMiddleware");
            expect(helpers.getOauthStartMiddleware).toHaveBeenCalledWith("github", {
                scope: ["user:email", "read:user"],
            });
        });
        it("creates github conclude middleware with correct args", () => {
            expect(oAuthController_1.githubOauthConclude).toBe("githubCallbackWrapper");
            expect(helpers.passportCallbackWrapper).toHaveBeenCalledWith("github");
        });
    });
    describe("getUserDetailsOnOauthSuccess", () => {
        let req;
        let res;
        let next;
        beforeEach(() => {
            jest.clearAllMocks();
            res = { json: jest.fn() };
            next = jest.fn();
        });
        it("responds with user details on success", async () => {
            req = {
                user: { username: "alice", user_id: "42", role: "admin" },
            };
            await (0, oAuthController_1.getUserDetailsOnOauthSuccess)(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                isAuthenticated: true,
                user: { username: "alice", userId: "42", role: "admin" },
            });
            expect(next).not.toHaveBeenCalled();
        });
        it("returns 401 if user is missing", async () => {
            req = {};
            res.status = jest.fn().mockReturnThis();
            res.json = jest.fn();
            await (0, oAuthController_1.getUserDetailsOnOauthSuccess)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                isAuthenticated: false,
                message: "No user found",
            });
        });
        it("calls next(err) on exception", async () => {
            const err = new Error("boom");
            const reqWithThrow = {
                get user() {
                    throw err;
                },
            };
            await (0, oAuthController_1.getUserDetailsOnOauthSuccess)(reqWithThrow, res, next);
            expect(next).toHaveBeenCalledWith(err);
        });
    });
});
