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
jest.mock("../../controllers/timerController", () => ({
    setTimer: jest.fn((req, res) => res.status(200).json({ message: "Timer set" })),
    getTimerStatus: jest.fn((req, res) => res.status(200).json({ status: "running" })),
    cancelTimer: jest.fn((req, res) => res.status(200).json({ message: "Timer cancelled" })),
}));
jest.mock("../../middleware/auth", () => ({
    checkAuthorizationStatus: jest.fn((req, res, next) => next()),
}));
const timerController = __importStar(require("../../controllers/timerController"));
const auth_1 = require("../../middleware/auth");
const timerRoutes_1 = __importDefault(require("../../routes/timerRoutes"));
describe("timerRoutes", () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(timerRoutes_1.default);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("POST /set", () => {
        it("should call checkAuthorizationStatus and setTimer", async () => {
            const res = await (0, supertest_1.default)(app).post("/set").send({ duration: 60 });
            expect(auth_1.checkAuthorizationStatus).toHaveBeenCalled();
            expect(timerController.setTimer).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: "Timer set" });
        });
    });
    describe("GET /status", () => {
        it("should call getTimerStatus", async () => {
            const res = await (0, supertest_1.default)(app).get("/status");
            expect(timerController.getTimerStatus).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ status: "running" });
        });
    });
    describe("DELETE /cancel", () => {
        it("should call checkAuthorizationStatus and cancelTimer", async () => {
            const res = await (0, supertest_1.default)(app).delete("/cancel");
            expect(auth_1.checkAuthorizationStatus).toHaveBeenCalled();
            expect(timerController.cancelTimer).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: "Timer cancelled" });
        });
    });
});
