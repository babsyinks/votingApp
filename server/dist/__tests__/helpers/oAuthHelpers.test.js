"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
jest.mock("passport", () => ({
    authenticate: jest.fn(),
}));
jest.mock("../../helpers/oAuthCallbackHandler", () => ({
    sessionOff: { session: false },
    handleOauthCallback: jest.fn(() => jest.fn(() => "mockCallbackResult")),
}));
const oAuthCallbackHandler_1 = require("../../helpers/oAuthCallbackHandler");
const oAuthHelpers_1 = require("../../helpers/oAuthHelpers");
describe("oAuthControllerHelpers", () => {
    let req, res, next, fakeMiddleware;
    beforeEach(() => {
        req = { req: true };
        res = { res: true };
        next = jest.fn();
        fakeMiddleware = jest.fn();
        passport_1.default.authenticate.mockReturnValue(fakeMiddleware);
        jest.clearAllMocks();
    });
    describe("passportCallbackWrapper", () => {
        it("should call passport.authenticate with correct arguments", () => {
            const strategy = "google";
            const cbWrapper = (0, oAuthHelpers_1.passportCallbackWrapper)(strategy);
            cbWrapper(req, res, next);
            expect(oAuthCallbackHandler_1.handleOauthCallback).toHaveBeenCalledTimes(1);
            const expectedCbReturn = oAuthCallbackHandler_1.handleOauthCallback.mock.results[0].value(req, res, next);
            expect(passport_1.default.authenticate).toHaveBeenCalledWith(strategy, oAuthCallbackHandler_1.sessionOff, expectedCbReturn);
            expect(fakeMiddleware).toHaveBeenCalledWith(req, res, next);
        });
        it("should allow custom callbackFactory", () => {
            const strategy = "facebook";
            let customCbFn;
            customCbFn = jest.fn(() => jest.fn(() => "customCbResult"));
            const cbWrapper = (0, oAuthHelpers_1.passportCallbackWrapper)(strategy, customCbFn);
            cbWrapper(req, res, next);
            expect(customCbFn).toHaveBeenCalledTimes(1);
            const expectedCbReturn = customCbFn.mock.results[0].value(req, res, next);
            expect(passport_1.default.authenticate).toHaveBeenCalledWith(strategy, oAuthCallbackHandler_1.sessionOff, expectedCbReturn);
            expect(fakeMiddleware).toHaveBeenCalledWith(req, res, next);
        });
    });
    describe("getOauthStartMiddleware", () => {
        it("should call passport.authenticate with session:false and no extra options", () => {
            const strategy = "google";
            const middleware = (0, oAuthHelpers_1.getOauthStartMiddleware)(strategy);
            expect(passport_1.default.authenticate).toHaveBeenCalledWith(strategy, {
                session: false,
            });
            expect(middleware).toBe(fakeMiddleware);
        });
        it("should merge extra options with session:false", () => {
            const strategy = "github";
            const options = { scope: ["email"] };
            const middleware = (0, oAuthHelpers_1.getOauthStartMiddleware)(strategy, options);
            expect(passport_1.default.authenticate).toHaveBeenCalledWith(strategy, {
                session: false,
                scope: ["email"],
            });
            expect(middleware).toBe(fakeMiddleware);
        });
    });
});
