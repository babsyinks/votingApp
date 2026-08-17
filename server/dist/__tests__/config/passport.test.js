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
jest.mock("passport", () => ({
    use: jest.fn(),
}));
jest.mock("../../strategies/social/FacebookStrategy", () => jest.fn(() => "FacebookStrategyInstance"));
jest.mock("../../strategies/social/GitHubStrategy", () => jest.fn(() => "GitHubStrategyInstance"));
jest.mock("../../strategies/social/GoogleStrategy", () => jest.fn(() => "GoogleStrategyInstance"));
describe("passport config", () => {
    beforeEach(async () => {
        // Clear module cache and mock state so each test runs cleanly.
        jest.resetModules();
        jest.clearAllMocks();
        // Dynamically import the module under test AFTER mocks are in place.
        // This causes the top-level passport.use(...) calls in config/passport to run
        // with the mocked strategy factories and mocked passport.use.
        await Promise.resolve().then(() => __importStar(require("../../config/passport")));
    });
    it("should call each strategy factory once", () => {
        // Retrieve the mocked factory functions
        const getFacebookStrategy = jest.requireMock("../../strategies/social/FacebookStrategy");
        const githubStrategy = jest.requireMock("../../strategies/social/GitHubStrategy");
        const getGoogleStrategy = jest.requireMock("../../strategies/social/GoogleStrategy");
        expect(getFacebookStrategy).toHaveBeenCalledTimes(1);
        expect(githubStrategy).toHaveBeenCalledTimes(1);
        expect(getGoogleStrategy).toHaveBeenCalledTimes(1);
    });
    it("should register each strategy with passport.use", () => {
        const passportMock = jest.requireMock("passport");
        expect(passportMock.use).toHaveBeenCalledWith("FacebookStrategyInstance");
        expect(passportMock.use).toHaveBeenCalledWith("GitHubStrategyInstance");
        expect(passportMock.use).toHaveBeenCalledWith("GoogleStrategyInstance");
    });
    it("should register exactly 3 strategies", () => {
        const passportMock = jest.requireMock("passport");
        expect(passportMock.use).toHaveBeenCalledTimes(3);
    });
});
