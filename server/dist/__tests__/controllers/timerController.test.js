"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const generateCustomError_1 = __importDefault(require("../../utils/generateCustomError"));
const timerController_1 = require("../../controllers/timerController");
jest.mock("../../utils/generateCustomError", () => {
    const actual = jest.requireActual("../../utils/generateCustomError");
    return jest.fn(actual);
});
jest.mock("../../services", () => ({
    timerService: {
        getAllTimers: jest.fn(),
        createTimer: jest.fn(),
        updateExistingTimer: jest.fn(),
        clearTimer: jest.fn(),
    },
}));
describe("timerController", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            body: {
                startDate: 1754816400000,
                endDate: 1754902800000,
            },
        };
        res = {
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    describe("setTimer", () => {
        it("forwards error to next when startDate/endDate missing", async () => {
            req.body = { startDate: undefined, endDate: undefined };
            // Make the mocked generateCustomError throw a CustomError-like object
            generateCustomError_1.default.mockImplementation((msg, code) => {
                const err = new Error(msg);
                err.statusCode = code;
                throw err;
            });
            await (0, timerController_1.setTimer)(req, res, next);
            // Assert: generateCustomError was called and next was called with the error
            expect(generateCustomError_1.default).toHaveBeenCalledWith("Start and end dates must be set!", 400);
            expect(next).toHaveBeenCalledTimes(1);
            const errArg = next.mock.calls[0][0];
            expect(errArg).toEqual(expect.objectContaining({
                message: "Start and end dates must be set!",
                statusCode: 400,
            }));
            // Ensure no service or response side-effects happened
            expect(services_1.timerService.getAllTimers).not.toHaveBeenCalled();
            expect(services_1.timerService.createTimer).not.toHaveBeenCalled();
            expect(services_1.timerService.updateExistingTimer).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
        it("creates a new timer when none exist", async () => {
            services_1.timerService.getAllTimers.mockResolvedValue([]);
            services_1.timerService.createTimer.mockResolvedValue(undefined);
            await (0, timerController_1.setTimer)(req, res, next);
            expect(services_1.timerService.getAllTimers).toHaveBeenCalledWith({ raw: true });
            expect(services_1.timerService.createTimer).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith({
                startDate: req.body?.startDate,
                endDate: req.body?.endDate,
            });
        });
        it("updates an existing timer when one exists", async () => {
            const existing = { id: "1" };
            services_1.timerService.getAllTimers.mockResolvedValue([existing]);
            services_1.timerService.updateExistingTimer.mockResolvedValue(undefined);
            await (0, timerController_1.setTimer)(req, res, next);
            expect(services_1.timerService.updateExistingTimer).toHaveBeenCalledWith(existing, req.body);
            expect(res.json).toHaveBeenCalledWith({
                startDate: req.body?.startDate,
                endDate: req.body?.endDate,
            });
        });
    });
    describe("getTimerStatus", () => {
        it("returns {} when no timers exist", async () => {
            services_1.timerService.getAllTimers.mockResolvedValue([]);
            await (0, timerController_1.getTimerStatus)(req, res, next);
            expect(services_1.timerService.getAllTimers).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({});
        });
        it("returns timestamps when dates are present", async () => {
            const start = 1754816400000;
            const end = 1754902800000;
            services_1.timerService.getAllTimers.mockResolvedValue([
                { startDate: start, endDate: end },
            ]);
            await (0, timerController_1.getTimerStatus)(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                startDate: new Date(start).getTime(),
                endDate: new Date(end).getTime(),
            });
        });
        it("returns raw values when dates are falsy", async () => {
            services_1.timerService.getAllTimers.mockResolvedValue([
                { startDate: null, endDate: null },
            ]);
            await (0, timerController_1.getTimerStatus)(req, res, next);
            expect(res.json).toHaveBeenCalledWith({ startDate: null, endDate: null });
        });
    });
    describe("cancelTimer", () => {
        it("clears timer and returns {}", async () => {
            services_1.timerService.clearTimer.mockResolvedValue(undefined);
            await (0, timerController_1.cancelTimer)(req, res, next);
            expect(services_1.timerService.clearTimer).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({});
        });
        it("forwards error to next when clearTimer throws", async () => {
            const mockError = new Error("DB failure");
            services_1.timerService.clearTimer.mockRejectedValue(mockError);
            await (0, timerController_1.cancelTimer)(req, res, next);
            expect(services_1.timerService.clearTimer).toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });
});
