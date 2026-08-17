"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setCookies_1 = require("../../utils/setCookies");
describe("setCookies utility", () => {
    let res;
    const actualNodeEnv = process.env.NODE_ENV;
    beforeEach(() => {
        res = {
            cookie: jest.fn(),
        };
        jest.resetModules();
        process.env.NODE_ENV = "test";
    });
    afterEach(() => {
        process.env.NODE_ENV = actualNodeEnv;
    });
    describe("setAccessTokenOnCookie", () => {
        test("should set access_token cookie with correct settings (non-production)", () => {
            (0, setCookies_1.setAccessTokenOnCookie)({ res, accessToken: "abc123" });
            expect(res.cookie).toHaveBeenCalledWith("access_token", "abc123", expect.objectContaining({
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
            }));
        });
        test("should set access_token cookie with correct settings (production)", () => {
            process.env.NODE_ENV = "production";
            jest.resetModules();
            const { setAccessTokenOnCookie: prodSetAccessTokenOnCookie, } = require("../../utils/setCookies");
            prodSetAccessTokenOnCookie({ res, accessToken: "xyz789" });
            expect(res.cookie).toHaveBeenCalledWith("access_token", "xyz789", expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000,
            }));
        });
    });
    describe("setRefreshTokenOnCookie", () => {
        test("should set refresh_token cookie with correct settings (non-production)", () => {
            (0, setCookies_1.setRefreshTokenOnCookie)({ res, refreshToken: "refresh123" });
            expect(res.cookie).toHaveBeenCalledWith("refresh_token", "refresh123", expect.objectContaining({
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }));
        });
        test("should set refresh_token cookie with correct settings (production)", () => {
            process.env.NODE_ENV = "production";
            jest.resetModules();
            const { setRefreshTokenOnCookie: prodSetRefreshTokenOnCookie, } = require("../../utils/setCookies");
            prodSetRefreshTokenOnCookie({ res, refreshToken: "refreshProd" });
            expect(res.cookie).toHaveBeenCalledWith("refresh_token", "refreshProd", expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }));
        });
    });
});
