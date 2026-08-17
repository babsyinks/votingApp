"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_github2_1 = require("passport-github2");
const GitHubStrategy_1 = __importDefault(require("../../../strategies/social/GitHubStrategy"));
const Social_1 = __importDefault(require("../../../strategies/social/Social"));
jest.mock("../../../strategies/social/Social");
jest.mock("passport-github2");
describe("GithubSocial Strategy", () => {
    let mockProfile;
    let mockDone;
    let mockAuthenticate;
    let mockedGithubStrategy = passport_github2_1.Strategy;
    beforeEach(() => {
        jest.clearAllMocks();
        mockProfile = {
            provider: "github",
            id: "123456789",
            displayName: "John Doe",
            username: "johndoe",
            profileUrl: "https://github.com/johndoe",
            emails: [{ value: "john.doe@example.com" }],
            photos: [{ value: "https://avatars.githubusercontent.com/u/123456789" }],
        };
        mockDone = jest.fn();
        mockAuthenticate = jest.fn().mockResolvedValue(undefined);
        Social_1.default.mockImplementation(() => ({
            authenticate: mockAuthenticate,
        }));
        process.env.GITHUB_CLIENT_ID = "test-client-id";
        process.env.GITHUB_CLIENT_SECRET = "test-client-secret";
    });
    afterEach(() => {
        delete process.env.GITHUB_CLIENT_ID;
        delete process.env.GITHUB_CLIENT_SECRET;
    });
    describe("GitHubStrategy initialization", () => {
        it("should create GitHubStrategy with correct configuration", () => {
            const strategy = (0, GitHubStrategy_1.default)();
            expect(passport_github2_1.Strategy).toHaveBeenCalledWith({
                clientID: "test-client-id",
                clientSecret: "test-client-secret",
                callbackURL: "/api/v1/oauth/github/callback",
                scope: ["user:email"],
            }, expect.any(Function));
        });
        it("should return a GitHubStrategy instance", () => {
            const strategy = (0, GitHubStrategy_1.default)();
            expect(strategy).toBeInstanceOf(passport_github2_1.Strategy);
        });
    });
    describe("verify function", () => {
        let verify;
        beforeEach(() => {
            // Get the verify function that was passed to GitHubStrategy
            (0, GitHubStrategy_1.default)();
            verify = (mockedGithubStrategy).mock.calls[0][1];
        });
        it("should create GitHubSocial instance with correct parameters", async () => {
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(mockProfile, "github");
        });
        it("should call authenticate on the GitHubSocial instance", async () => {
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
                provider: "github",
                id: "123456789",
                displayName: "John Doe",
                username: "johndoe",
                profileUrl: "https://github.com/profile/",
            };
            await verify("access-token", "refresh-token", profileWithoutEmail, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileWithoutEmail, "github");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile with only id and username", async () => {
            const minimalProfile = {
                provider: "github",
                id: "987654321",
                username: "minimal",
            };
            await verify("access-token", "refresh-token", minimalProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(minimalProfile, "github");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile with multiple emails", async () => {
            const profileWithMultipleEmails = {
                provider: "github",
                id: "123456789",
                displayName: "John Doe",
                username: "johndoe",
                emails: [
                    { value: "primary@example.com" },
                    { value: "secondary@example.com" },
                ],
                profileUrl: "https://github.com/profile/",
            };
            await verify("access-token", "refresh-token", profileWithMultipleEmails, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileWithMultipleEmails, "github");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle errors from authenticate method", async () => {
            const error = new Error("Authentication failed");
            mockAuthenticate.mockRejectedValue(error);
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(error, null);
        });
        it("should catch errors thrown during authentication", async () => {
            const error = new Error("Unexpected error");
            mockAuthenticate.mockImplementation(() => {
                throw error;
            });
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(error, null);
        });
        it("should handle profile without displayName", async () => {
            const profileNoDisplayName = {
                provider: "github",
                id: "123456789",
                username: "johndoe",
                emails: [{ value: "john.doe@example.com" }],
            };
            await verify("access-token", "refresh-token", profileNoDisplayName, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(profileNoDisplayName, "github");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
    });
    describe("GitHubSocial class behavior", () => {
        it("should use default namesCombined value for GitHub profiles", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify that Social was called with only profile and strategy name
            // (namesCombined defaults to true in Social constructor)
            expect(Social_1.default).toHaveBeenCalledWith(expect.any(Object), "github");
        });
        it("should pass 'github' as strategy name", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(expect.any(Object), "github");
        });
    });
    describe("environment variable handling", () => {
        it("should use GITHUB_CLIENT_ID from environment", () => {
            process.env.GITHUB_CLIENT_ID = "custom-client-id";
            (0, GitHubStrategy_1.default)();
            expect(passport_github2_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                clientID: "custom-client-id",
            }), expect.any(Function));
        });
        it("should use GITHUB_CLIENT_SECRET from environment", () => {
            process.env.GITHUB_CLIENT_SECRET = "custom-client-secret";
            (0, GitHubStrategy_1.default)();
            expect(passport_github2_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                clientSecret: "custom-client-secret",
            }), expect.any(Function));
        });
    });
    describe("callback URL configuration", () => {
        it("should use correct callback URL", () => {
            (0, GitHubStrategy_1.default)();
            expect(passport_github2_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                callbackURL: "/api/v1/oauth/github/callback",
            }), expect.any(Function));
        });
    });
    describe("scope configuration", () => {
        it("should request user:email scope", () => {
            (0, GitHubStrategy_1.default)();
            expect(passport_github2_1.Strategy).toHaveBeenCalledWith(expect.objectContaining({
                scope: ["user:email"],
            }), expect.any(Function));
        });
        it("should only request email-related scope", () => {
            (0, GitHubStrategy_1.default)();
            const config = (mockedGithubStrategy).mock.calls[0][0];
            expect(config.scope).toEqual(["user:email"]);
            expect(config.scope).toHaveLength(1);
        });
    });
    describe("integration with Social superclass", () => {
        it("should properly extend Social class behavior", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify Social constructor was called
            expect(Social_1.default).toHaveBeenCalled();
            // Verify authenticate method was called on the instance
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should pass profile data to Social superclass", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            const customProfile = {
                provider: "github",
                id: "custom-id",
                displayName: "Custom User",
                username: "customuser",
                emails: [{ value: "custom@example.com" }],
                profileUrl: "https://github.com/profile/",
            };
            await verify("access-token", "refresh-token", customProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(customProfile, "github");
        });
    });
    describe("token handling", () => {
        it("should accept valid access tokens", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("ghp_validAccessToken123", "refresh-token", mockProfile, mockDone);
            expect(mockAuthenticate).toHaveBeenCalled();
        });
        it("should accept empty refresh token", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("access-token", "", mockProfile, mockDone);
            expect(mockAuthenticate).toHaveBeenCalled();
        });
        it("should work with any token values", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("token1", "token2", mockProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalled();
            expect(mockAuthenticate).toHaveBeenCalled();
        });
    });
    describe("profile variations", () => {
        it("should handle profile with all optional fields", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            const fullProfile = {
                provider: "github",
                id: "123",
                displayName: "Full Name",
                username: "fulluser",
                profileUrl: "https://github.com/fulluser",
                emails: [{ value: "full@example.com" }],
                photos: [{ value: "https://avatars.githubusercontent.com/u/123" }],
            };
            await verify("access-token", "refresh-token", fullProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(fullProfile, "github");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
        it("should handle profile with only required fields", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            const minimalProfile = {
                provider: "github",
                id: "456",
            };
            await verify("access-token", "refresh-token", minimalProfile, mockDone);
            expect(Social_1.default).toHaveBeenCalledWith(minimalProfile, "github");
            expect(mockAuthenticate).toHaveBeenCalledWith(mockDone);
        });
    });
    describe("error scenarios", () => {
        it("should handle async errors from authenticate", async () => {
            const asyncError = new Error("Async authentication error");
            mockAuthenticate.mockRejectedValue(asyncError);
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(asyncError, null);
        });
        it("should handle synchronous errors from authenticate", async () => {
            const syncError = new Error("Sync authentication error");
            mockAuthenticate.mockImplementation(() => {
                throw syncError;
            });
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(syncError, null);
        });
        it("should handle non-Error objects thrown", async () => {
            const stringError = "String error";
            mockAuthenticate.mockImplementation(() => {
                throw stringError;
            });
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            expect(mockDone).toHaveBeenCalledWith(stringError, null);
        });
    });
    describe("constructor behavior", () => {
        it("should not pass namesCombined parameter to Social", async () => {
            (0, GitHubStrategy_1.default)();
            const verify = (mockedGithubStrategy).mock.calls[0][1];
            await verify("access-token", "refresh-token", mockProfile, mockDone);
            // Verify Social was called with exactly 2 arguments
            expect(Social_1.default).toHaveBeenCalledWith(mockProfile, "github");
            expect(Social_1.default.mock.calls[0]).toHaveLength(2);
        });
    });
});
