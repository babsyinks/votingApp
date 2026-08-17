"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_facebook_1 = require("passport-facebook");
const FacebookStrategy_1 = __importDefault(require("../../../strategies/social/FacebookStrategy"));
const Social_1 = __importDefault(require("../../../strategies/social/Social"));
jest.mock("../../../strategies/social/Social");
jest.mock("passport-facebook");
describe("FacebookSocial Strategy", () => {
    let mockProfile;
    let mockDone;
    let mockAuthenticate;
    let mockedFacebookStrategy = passport_facebook_1.Strategy;
    beforeEach(() => {
        jest.clearAllMocks();
        mockProfile = {
            provider: "facebook",
            id: "123456789",
            displayName: "John Doe",
            name: {
                familyName: "Doe",
                givenName: "John",
            },
            emails: [{ value: "john.doe@example.com" }],
            birthday: "March 1",
            _json: {},
            _raw: "",
        };
        mockDone = jest.fn();
        mockAuthenticate = jest.fn();
        Social_1.default.mockImplementation(() => ({
            authenticate: mockAuthenticate,
        }));
        process.env.FACEBOOK_APP_ID = "test-app-id";
        process.env.FACEBOOK_APP_SECRET = "test-app-secret";
    });
    afterEach(() => {
        delete process.env.FACEBOOK_APP_ID;
        delete process.env.FACEBOOK_APP_SECRET;
    });
    describe("FacebookStrategy initialization", () => {
        it("should create FacebookStrategy with correct configuration", () => {
            const strategy = (0, FacebookStrategy_1.default)();
            expect(passport_facebook_1.Strategy).toHaveBeenCalledWith({
                clientID: "test-app-id",
                clientSecret: "test-app-secret",
                callbackURL: "/api/v1/oauth/facebook/callback",
                profileFields: ["id", "emails", "name", "displayName"],
            }, expect.any(Function));
        });
        it("should return a FacebookStrategy instance", () => {
            const strategy = (0, FacebookStrategy_1.default)();
            expect(strategy).toBeInstanceOf(passport_facebook_1.Strategy);
        });
    });
    describe("verify function", () => {
        let verify;
        beforeEach(() => {
            // Get the verify function that was passed to FacebookStrategy
            (0, FacebookStrategy_1.default)();
            verify = mockedFacebookStrategy.mock.calls[0][1];
        });
        it("should create FacebookSocial instance with correct parameters", async () => {
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(mockProfile, "facebook", false);
        });
        it("should call authenticate on the FacebookSocial instance", async () => {
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should pass accessToken to verify function", async () => {
            await verify("test-access-token", "refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalled();
            expect(mockAuthenticate).toHaveBeenCalled();
        });
        it("should pass refreshToken to verify function", async () => {
            await verify("access-token", "test-refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalled();
            expect(mockAuthenticate).toHaveBeenCalled();
        });
        it("should handle profile without emails", async () => {
            const profileWithoutEmail = {
                provider: "facebook",
                id: "123456789",
                displayName: "John Doe",
                name: {
                    familyName: "Doe",
                    givenName: "John",
                },
                birthday: "March 1",
                _json: {},
                _raw: "",
            };
            await verify("access-token", "refresh-token", profileWithoutEmail, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileWithoutEmail, "facebook", false);
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile with only id", async () => {
            const minimalProfile = {
                provider: "facebook",
                id: "987654321",
            };
            await verify("access-token", "refresh-token", minimalProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(minimalProfile, "facebook", false);
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle authenticate errors", async () => {
            const error = new Error("Authentication failed");
            mockAuthenticate.mockRejectedValue(error);
            await expect(verify("access-token", "refresh-token", mockProfile, mockDone)).rejects.toThrow("Authentication failed");
        });
    });
    describe("FacebookSocial class behavior", () => {
        it("should use namesCombined=false for Facebook profiles", async () => {
            (0, FacebookStrategy_1.default)();
            const verify = mockedFacebookStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify that Social was called with namesCombined=false
            expect(Social_1.default).toHaveBeenCalledWith(expect.any(Object), "facebook", false);
        });
        it("should pass 'facebook' as strategy name", async () => {
            (0, FacebookStrategy_1.default)();
            const verify = mockedFacebookStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(expect.any(Object), "facebook", expect.any(Boolean));
        });
    });
    describe("environment variable handling", () => {
        it("should use FACEBOOK_APP_ID from environment", () => {
            process.env.FACEBOOK_APP_ID = "custom-app-id";
            (0, FacebookStrategy_1.default)();
            expect(passport_facebook_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                clientID: "custom-app-id",
            }), expect.any(Function));
        });
        it("should use FACEBOOK_APP_SECRET from environment", () => {
            process.env.FACEBOOK_APP_SECRET = "custom-app-secret";
            (0, FacebookStrategy_1.default)();
            expect(passport_facebook_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                clientSecret: "custom-app-secret",
            }), expect.any(Function));
        });
    });
    describe("callback URL configuration", () => {
        it("should use correct callback URL", () => {
            (0, FacebookStrategy_1.default)();
            expect(passport_facebook_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                callbackURL: "/api/v1/oauth/facebook/callback",
            }), expect.any(Function));
        });
    });
    describe("profile fields configuration", () => {
        it("should request correct profile fields", () => {
            (0, FacebookStrategy_1.default)();
            expect(passport_facebook_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                profileFields: ["id", "emails", "name", "displayName"],
            }), expect.any(Function));
        });
        it("should request all necessary fields for user creation", () => {
            (0, FacebookStrategy_1.default)();
            const config = mockedFacebookStrategy.mock.calls[0][0];
            expect(config.profileFields).toContain("id");
            expect(config.profileFields).toContain("emails");
            expect(config.profileFields).toContain("name");
            expect(config.profileFields).toContain("displayName");
        });
    });
    describe("integration with Social superclass", () => {
        it("should properly extend Social class behavior", async () => {
            (0, FacebookStrategy_1.default)();
            const verify = mockedFacebookStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify Social constructor was called
            expect(Social_1.default).toHaveBeenCalled();
            // Verify authenticate method was called on the instance
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
    });
});
