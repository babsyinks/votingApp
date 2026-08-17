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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const authController = __importStar(require("../../controllers/authController"));
const authRoutes_1 = __importDefault(require("../../routes/authRoutes"));
jest.mock("../../controllers/authController", () => ({
    requestSignUpCode: jest.fn((req, res) => res.json({ called: "requestSignUpCode" })),
    verifySignUpCode: jest.fn((req, res) => res.json({ called: "verifySignUpCode" })),
    register: jest.fn((req, res) => res.json({ called: "register" })),
    signin: jest.fn((req, res) => res.json({ called: "signin" })),
    forgotPassword: jest.fn((req, res) => res.json({ called: "forgotPassword" })),
    resetPassword: jest.fn((req, res) => res.json({ called: "resetPassword" })),
    signout: jest.fn((req, res) => res.json({ called: "signout" })),
}));
describe("authRoutes", () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use("/", authRoutes_1.default);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const endpoints = [
        {
            path: "/request-signup-code",
            handler: "requestSignUpCode",
        },
        {
            path: "/verify-signup-code",
            handler: "verifySignUpCode",
        },
        { path: "/register", handler: "register" },
        { path: "/signin", handler: "signin" },
        {
            path: "/forgot-password",
            handler: "forgotPassword",
        },
        {
            path: "/reset-password",
            handler: "resetPassword",
        },
        { path: "/signout", handler: "signout" },
    ];
    endpoints.forEach(({ path, handler }) => {
        it(`POST ${path} should call authController.${String(handler)}`, async () => {
            const payload = { example: "data" };
            const res = await (0, supertest_1.default)(app).post(path).send(payload);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ called: handler });
            expect(authController[handler]).toHaveBeenCalledTimes(1);
            expect(authController[handler].mock.calls[0][0].body).toEqual(payload);
        });
    });
});
