"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oAuthCallbackHandler_1 = require("../../helpers/oAuthCallbackHandler");
const authHelpers_1 = require("../../helpers/authHelpers");
jest.mock("../../helpers/authHelpers", () => ({
    generateTokensAndRedirect: jest.fn(),
}));
describe("oAuthCallbackHandler", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            redirect: jest.fn(),
        };
        jest.clearAllMocks();
    });
    it("should export sessionOff with session set to false", () => {
        expect(oAuthCallbackHandler_1.sessionOff).toEqual({ session: false });
    });
    describe("failure cases", () => {
        it("should redirect to failure URL with default message if no user", () => {
            const handler = (0, oAuthCallbackHandler_1.handleOauthCallback)();
            handler(req, res)(null, undefined);
            expect(res.redirect).toHaveBeenCalledWith(expect.stringMatching(/\/signin\?error=Authentication%20failed/));
        });
        it("should redirect to failure URL with error message from err.message", () => {
            const handler = (0, oAuthCallbackHandler_1.handleOauthCallback)();
            const err = new Error("Something went wrong");
            handler(req, res)(err, undefined);
            expect(res.redirect).toHaveBeenCalledWith(expect.stringMatching(/\/signin\?error=Something%20went%20wrong/));
        });
        it("should redirect to failure URL with joined error messages if err.errors exists", () => {
            const handler = (0, oAuthCallbackHandler_1.handleOauthCallback)();
            const err = new Error("");
            err.errors = [
                { message: "First error" },
                { message: "Second error" },
            ]; /* {
              errors: [{ message: "First error" }, { message: "Second error" }],
            };
       */
            handler(req, res)(err, undefined);
            expect(res.redirect).toHaveBeenCalledWith(expect.stringMatching(/\/signin\?error=First%20error%3B%20Second%20error/));
        });
        it("should use custom failureRedirectUri when provided", () => {
            const handler = (0, oAuthCallbackHandler_1.handleOauthCallback)({
                failureRedirectUri: "http://custom-fail.com/fail",
            });
            handler(req, res)(null, undefined);
            expect(res.redirect).toHaveBeenCalledWith(expect.stringMatching(/^http:\/\/custom-fail\.com\/fail\?error=Authentication%20failed/));
        });
    });
    describe("success cases", () => {
        it("should call generateTokensAndRedirect with user and successRedirectUri", () => {
            const handler = (0, oAuthCallbackHandler_1.handleOauthCallback)();
            const user = {
                user_id: "1",
                username: "doe",
                isAdmin: false,
            };
            handler(req, res)(null, user);
            expect(authHelpers_1.generateTokensAndRedirect).toHaveBeenCalledWith({
                res,
                user,
                redirectUri: expect.stringMatching(/\/oauth-success$/),
            });
        });
        it("should use custom successRedirectUri when provided", () => {
            const handler = (0, oAuthCallbackHandler_1.handleOauthCallback)({
                successRedirectUri: "http://custom-success.com/welcome",
            });
            const user = {
                user_id: "456",
                username: "doe",
                isAdmin: false,
            };
            handler(req, res)(null, user);
            expect(authHelpers_1.generateTokensAndRedirect).toHaveBeenCalledWith({
                res,
                user,
                redirectUri: "http://custom-success.com/welcome",
            });
        });
    });
});
