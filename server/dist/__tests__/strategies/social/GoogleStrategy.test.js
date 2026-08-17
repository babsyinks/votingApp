"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const GoogleStrategy_1 = __importDefault(require("../../../strategies/social/GoogleStrategy"));
const Social_1 = __importDefault(require("../../../strategies/social/Social"));
jest.mock("../../../strategies/social/Social");
jest.mock("passport-google-oauth20");
describe("GoogleSocial Strategy", () => {
    let mockProfile;
    let mockDone;
    let mockAuthenticate;
    let mockedGoogleStrategy = passport_google_oauth20_1.Strategy;
    let profileJson = {
        iss: "https://accounts.google.com",
        aud: "test-client-id",
        sub: "123456789",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        name: "John Doe",
        given_name: "John",
        family_name: "Doe",
        email: "john.doe@example.com",
        email_verified: true,
    };
    beforeEach(() => {
        jest.clearAllMocks();
        mockProfile = {
            provider: "google",
            id: "123456789",
            displayName: "John Doe",
            name: {
                familyName: "Doe",
                givenName: "John",
            },
            emails: [{ value: "john.doe@example.com", verified: true }],
            photos: [{ value: "https://lh3.googleusercontent.com/a/default-user" }],
            _raw: "raw data",
            _json: profileJson,
            profileUrl: "https://google.com/profile",
        };
        mockDone = jest.fn();
        mockAuthenticate = jest.fn().mockResolvedValue(undefined);
        // Mock the Social class
        Social_1.default.mockImplementation(() => ({
            authenticate: mockAuthenticate,
        }));
        // Set up environment variables
        process.env.GOOGLE_CLIENT_ID = "test-client-id";
        process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
    });
    afterEach(() => {
        delete process.env.GOOGLE_CLIENT_ID;
        delete process.env.GOOGLE_CLIENT_SECRET;
    });
    describe("GoogleStrategy initialization", () => {
        it("should create GoogleStrategy with correct configuration", () => {
            const strategy = (0, GoogleStrategy_1.default)();
            expect(passport_google_oauth20_1.Strategy).toHaveBeenCalledWith({
                clientID: "test-client-id",
                clientSecret: "test-client-secret",
                callbackURL: "/api/v1/oauth/google/callback",
            }, expect.any(Function));
        });
        it("should return a GoogleStrategy instance", () => {
            const strategy = (0, GoogleStrategy_1.default)();
            expect(strategy).toBeInstanceOf(passport_google_oauth20_1.Strategy);
        });
    });
    describe("verify function", () => {
        let verify;
        beforeEach(() => {
            // Get the verify function that was passed to GoogleStrategy
            (0, GoogleStrategy_1.default)();
            verify = mockedGoogleStrategy.mock.calls[0][1];
        });
        it("should create GoogleSocial instance with correct parameters", async () => {
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(mockProfile, "google");
        });
        it("should call authenticate on the GoogleSocial instance", async () => {
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
                provider: "google",
                id: "123456789",
                displayName: "John Doe",
                name: {
                    familyName: "Doe",
                    givenName: "John",
                },
                _raw: "raw",
                _json: profileJson,
                profileUrl: "https://google.com/profile",
            };
            await verify("access-token", "refresh-token", profileWithoutEmail, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileWithoutEmail, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile with only required fields", async () => {
            const minimalProfile = {
                provider: "google",
                id: "987654321",
                displayName: "Minimal User",
                _raw: "raw",
                _json: profileJson,
                profileUrl: "https://google.com/profile",
            };
            await verify("access-token", "refresh-token", minimalProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(minimalProfile, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile with multiple emails", async () => {
            const profileWithMultipleEmails = {
                provider: "google",
                id: "123456789",
                displayName: "John Doe",
                emails: [
                    { value: "primary@example.com", verified: true },
                    { value: "secondary@example.com", verified: false },
                ],
                _raw: "raw",
                _json: profileJson,
                profileUrl: "https://google.com/profile",
            };
            await verify("access-token", "refresh-token", profileWithMultipleEmails, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileWithMultipleEmails, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle errors from authenticate method", async () => {
            const error = new Error("Authentication failed");
            mockAuthenticate.mockRejectedValue(error);
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(error);
        });
        it("should catch errors thrown during authentication", async () => {
            const error = new Error("Unexpected error");
            mockAuthenticate.mockImplementation(() => {
                throw error;
            });
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(error);
        });
        it("should handle profile without name object", async () => {
            const profileNoName = { ...mockProfile };
            delete profileNoName.name;
            await verify("access-token", "refresh-token", profileNoName, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileNoName, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile without displayName", async () => {
            const profileNoDisplayName = { ...mockProfile };
            delete profileNoDisplayName.displayName;
            await verify("access-token", "refresh-token", profileNoDisplayName, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileNoDisplayName, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle unverified email", async () => {
            const profileUnverifiedEmail = { ...mockProfile };
            profileUnverifiedEmail.emails = [
                { value: "unverified@example.com", verified: false },
            ];
            await verify("access-token", "refresh-token", profileUnverifiedEmail, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileUnverifiedEmail, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
    });
    describe("GoogleSocial class behavior", () => {
        it("should use default namesCombined value for Google profiles", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify that Social was called with only profile and strategy name
            // (namesCombined defaults to true in Social constructor)
            expect(Social_1.default).toHaveBeenCalledWith(expect.any(Object), "google");
        });
        it("should pass 'google' as strategy name", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(expect.any(Object), "google");
        });
    });
    describe("environment variable handling", () => {
        it("should use GOOGLE_CLIENT_ID from environment", () => {
            process.env.GOOGLE_CLIENT_ID = "custom-client-id";
            (0, GoogleStrategy_1.default)();
            expect(passport_google_oauth20_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                clientID: "custom-client-id",
            }), expect.any(Function));
        });
        it("should use GOOGLE_CLIENT_SECRET from environment", () => {
            process.env.GOOGLE_CLIENT_SECRET = "custom-client-secret";
            (0, GoogleStrategy_1.default)();
            expect(passport_google_oauth20_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                clientSecret: "custom-client-secret",
            }), expect.any(Function));
        });
    });
    describe("callback URL configuration", () => {
        it("should use correct callback URL", () => {
            (0, GoogleStrategy_1.default)();
            expect(passport_google_oauth20_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                callbackURL: "/api/v1/oauth/google/callback",
            }), expect.any(Function));
        });
    });
    describe("configuration options", () => {
        it("should not include scope configuration", () => {
            (0, GoogleStrategy_1.default)();
            const config = mockedGoogleStrategy.mock.calls[0][0];
            expect(config).not.toHaveProperty("scope");
        });
        it("should have exactly three configuration properties", () => {
            (0, GoogleStrategy_1.default)();
            const config = mockedGoogleStrategy.mock.calls[0][0];
            const keys = Object.keys(config);
            expect(keys).toHaveLength(3);
            expect(keys).toContain("clientID");
            expect(keys).toContain("clientSecret");
            expect(keys).toContain("callbackURL");
        });
    });
    describe("integration with Social superclass", () => {
        it("should properly extend Social class behavior", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify Social constructor was called
            expect(Social_1.default).toHaveBeenCalled();
            // Verify authenticate method was called on the instance
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should pass profile data to Social superclass", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(mockProfile, "google");
        });
        it("should cast done callback to DoneCallback type", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify authenticate was called with the done callback
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
    });
    describe("token handling", () => {
        it("should accept valid access tokens", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("ya29.validAccessToken123", "refresh-token", mockProfile, mockDone);
            expect(mockAuthenticate).toHaveBeenCalled();
        });
        it("should accept empty refresh token", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "", mockProfile, mockDone);
            expect(mockAuthenticate).toHaveBeenCalled();
        });
        it("should work with any token values", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("token1", "token2", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalled();
            expect(mockAuthenticate).toHaveBeenCalled();
        });
    });
    describe("profile variations", () => {
        it("should handle profile with all optional fields", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            const fullProfile = {
                provider: "google",
                id: "123",
                displayName: "Full Name",
                name: {
                    familyName: "Name",
                    givenName: "Full",
                    middleName: "M",
                },
                emails: [{ value: "full@example.com", verified: true }],
                photos: [{ value: "https://lh3.googleusercontent.com/a/photo" }],
                _raw: "raw data",
                _json: profileJson,
                profileUrl: "https://google.com/profile",
            };
            await verify("access-token", "refresh-token", fullProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(fullProfile, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile with only id", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            const minimalProfile = {
                provider: "google",
                id: "456",
                _raw: "raw",
                _json: {},
            };
            await verify("access-token", "refresh-token", minimalProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(minimalProfile, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile with photo array", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            const profileWithPhotos = { ...mockProfile };
            profileWithPhotos.photos = [
                { value: "https://example.com/photo1.jpg" },
                { value: "https://example.com/photo2.jpg" },
            ];
            await verify("access-token", "refresh-token", profileWithPhotos, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileWithPhotos, "google");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
    });
    describe("error scenarios", () => {
        it("should handle async errors from authenticate", async () => {
            const asyncError = new Error("Async authentication error");
            mockAuthenticate.mockRejectedValue(asyncError);
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(asyncError);
        });
        it("should handle synchronous errors from authenticate", async () => {
            const syncError = new Error("Sync authentication error");
            mockAuthenticate.mockImplementation(() => {
                throw syncError;
            });
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(syncError);
        });
        it("should handle non-Error objects thrown", async () => {
            const stringError = "String error";
            mockAuthenticate.mockImplementation(() => {
                throw stringError;
            });
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(stringError);
        });
        it("should pass error without second argument when error occurs", async () => {
            const error = new Error("Test error");
            mockAuthenticate.mockRejectedValue(error);
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify done was called with only the error (no second argument)
            expect(mockDone).toHaveBeenCalledWith(error);
            expect(mockDone).toHaveBeenCalledTimes(1);
            expect(mockDone.mock.calls[0]).toHaveLength(1);
        });
    });
    describe("constructor behavior", () => {
        it("should not pass namesCombined parameter to Social", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify Social was called with exactly 2 arguments
            expect(Social_1.default).toHaveBeenCalledWith(mockProfile, "google");
            expect(Social_1.default.mock.calls[0]).toHaveLength(2);
        });
    });
    describe("type casting", () => {
        it("should handle VerifyCallback to DoneCallback type casting", async () => {
            (0, GoogleStrategy_1.default)();
            const verify = mockedGoogleStrategy.mock.calls[0][1];
            // This test verifies the code compiles and runs with the type cast
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
    });
});
