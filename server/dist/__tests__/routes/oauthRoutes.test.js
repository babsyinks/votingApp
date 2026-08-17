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
jest.mock("../../middleware/auth", () => ({
    checkAuthenticationStatus: (req, res, next) => next(),
}));
jest.mock("../../controllers/oAuthController", () => ({
    googleOauthStart: jest.fn((req, res) => res.status(200).json({ called: "googleOauthStart" })),
    googleOauthConclude: jest.fn((req, res) => res.status(200).json({ called: "googleOauthConclude" })),
    facebookOauthStart: jest.fn((req, res) => res.status(200).json({ called: "facebookOauthStart" })),
    facebookOauthConclude: jest.fn((req, res) => res.status(200).json({ called: "facebookOauthConclude" })),
    githubOauthStart: jest.fn((req, res) => res.status(200).json({ called: "githubOauthStart" })),
    githubOauthConclude: jest.fn((req, res) => res.status(200).json({ called: "githubOauthConclude" })),
    getUserDetailsOnOauthSuccess: jest.fn((req, res) => res.status(200).json({ called: "getUserDetailsOnOauthSuccess" })),
}));
const oAuthController = __importStar(require("../../controllers/oAuthController"));
const oauthRoutes_1 = __importDefault(require("../../routes/oauthRoutes"));
describe("oAuthRoutes", () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use("/", oauthRoutes_1.default);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const endpoints = [
        { path: "/google", handler: "googleOauthStart" },
        { path: "/google/callback", handler: "googleOauthConclude" },
        { path: "/facebook", handler: "facebookOauthStart" },
        { path: "/facebook/callback", handler: "facebookOauthConclude" },
        { path: "/github", handler: "githubOauthStart" },
        { path: "/github/callback", handler: "githubOauthConclude" },
        { path: "/me", handler: "getUserDetailsOnOauthSuccess" },
    ];
    endpoints.forEach(({ path, handler }) => {
        it(`GET ${path} should call oAuthController.${handler}`, async () => {
            const res = await (0, supertest_1.default)(app).get(path);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ called: handler });
            expect(oAuthController[handler]).toHaveBeenCalledTimes(1);
        });
    });
});
