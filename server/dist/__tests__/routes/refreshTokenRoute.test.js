"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
jest.mock("../../controllers/refreshTokenController", () => ({
    refreshToken: jest.fn((req, res) => res.status(200).json({ refreshed: true })),
}));
const refreshTokenController_1 = require("../../controllers/refreshTokenController");
const refreshTokenRoute_1 = __importDefault(require("../../routes/refreshTokenRoute"));
describe("refreshTokenRoute", () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(refreshTokenRoute_1.default);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("POST /refresh calls refreshToken controller", async () => {
        const res = await (0, supertest_1.default)(app).post("/refresh").send({ token: "oldToken" });
        expect(refreshTokenController_1.refreshToken).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ refreshed: true });
    });
});
