"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendPasswordResetLink_1 = __importDefault(require("../../helpers/sendPasswordResetLink"));
const emailTemplateBuilder_1 = __importDefault(require("../../helpers/emailTemplateBuilder"));
const sendEmail_1 = __importDefault(require("../../helpers/sendEmail"));
jest.mock("../../helpers/emailTemplateBuilder");
jest.mock("../../helpers/sendEmail");
describe("sendPasswordResetLink", () => {
    const OLD_ENV = process.env;
    const mockedEmailTemplateBuilder = jest.mocked(emailTemplateBuilder_1.default);
    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...OLD_ENV };
        process.env.CLIENT_URL = "https://example.com";
    });
    afterAll(() => {
        process.env = OLD_ENV;
    });
    it("should build email and call sendEmail with correct parameters", async () => {
        mockedEmailTemplateBuilder.mockReturnValue("<p>Email HTML</p>");
        await (0, sendPasswordResetLink_1.default)({
            toEmail: "user@example.com",
            resetCode: "abc123",
        });
        expect(emailTemplateBuilder_1.default).toHaveBeenCalledWith({
            heading: "Reset Your Password",
            content: [
                {
                    message: "We received a request to reset your password. Click the button below to proceed:",
                    linkDetails: {
                        url: "https://example.com/reset-password/abc123",
                        btnValue: "Reset Password",
                        isMainBtn: true,
                    },
                },
            ],
            footNote: "If you didn't request this, you can safely ignore this email.",
        });
        expect(sendEmail_1.default).toHaveBeenCalledWith({
            toEmail: "user@example.com",
            subject: "Reset your password",
            htmlContent: "<p>Email HTML</p>",
        });
    });
    it("should propagate error if sendEmail throws", async () => {
        mockedEmailTemplateBuilder.mockReturnValue("<p>Email HTML</p>");
        sendEmail_1.default.mockRejectedValueOnce(new Error("Send failed"));
        await expect((0, sendPasswordResetLink_1.default)({
            toEmail: "fail@example.com",
            resetCode: "code123",
        })).rejects.toThrow("Send failed");
    });
});
