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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mockAuthRoutes = express_1.default.Router().get("/", (_req, res) => res.json({ route: "auth" }));
const mockElectionRoutes = express_1.default.Router().get("/", (_req, res) => res.json({ route: "election" }));
const mockOAuthRoutes = express_1.default.Router().get("/", (_req, res) => res.json({ route: "oauth" }));
const mockRefreshRoute = express_1.default.Router().get("/", (_req, res) => res.json({ route: "refresh" }));
const mockTimerRoutes = express_1.default.Router().get("/", (_req, res) => res.json({ route: "timer" }));
// Define mocks BEFORE dynamic import
jest.mock("../../routes/authRoutes", () => ({
    __esModule: true,
    default: mockAuthRoutes,
}));
jest.mock("../../routes/electionRoutes", () => ({
    __esModule: true,
    default: mockElectionRoutes,
}));
jest.mock("../../routes/oAuthRoutes", () => ({
    __esModule: true,
    default: mockOAuthRoutes,
}));
jest.mock("../../routes/refreshTokenRoute", () => ({
    __esModule: true,
    default: mockRefreshRoute,
}));
jest.mock("../../routes/timerRoutes", () => ({
    __esModule: true,
    default: mockTimerRoutes,
}));
// Dynamically import AFTER mocks are registered
let indexRouter;
beforeAll(async () => {
    const mod = await Promise.resolve().then(() => __importStar(require("../../routes/index")));
    indexRouter = mod.default;
});
let app;
beforeAll(() => {
    app = (0, express_1.default)();
    app.use(indexRouter);
});
describe("index.ts routes", () => {
    it("should mount /auth routes", async () => {
        const res = await (0, supertest_1.default)(app).get("/auth");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "auth" });
    });
    it("should mount /oauth routes", async () => {
        const res = await (0, supertest_1.default)(app).get("/oauth");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "oauth" });
    });
    it("should mount /election routes", async () => {
        const res = await (0, supertest_1.default)(app).get("/election");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "election" });
    });
    it("should mount /timer routes", async () => {
        const res = await (0, supertest_1.default)(app).get("/timer");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "timer" });
    });
    it("should mount /token routes", async () => {
        const res = await (0, supertest_1.default)(app).get("/token");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "refresh" });
    });
});
