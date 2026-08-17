"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendEmail_1 = __importDefault(require("../../helpers/sendEmail"));
const brevo_1 = __importDefault(require("../../config/brevo"));
const logger_1 = __importDefault(require("../../utils/logger"));
jest.mock("../../config/brevo", () => ({
    sendTransacEmail: jest.fn(),
}));
jest.mock("../../utils/logger", () => ({
    info: jest.fn(),
    error: jest.fn(),
}));
describe("sendEmail", () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...OLD_ENV };
        process.env.BREVO_VERIFIED_SENDER_EMAIL = "noreply@example.com";
    });
    afterAll(() => {
        process.env = OLD_ENV;
    });
    it("should send email and log success", async () => {
        const mockResponse = { messageId: "12345" };
        brevo_1.default.sendTransacEmail.mockResolvedValueOnce(mockResponse);
        await (0, sendEmail_1.default)({
            toEmail: "test@example.com",
            subject: "Test Subject",
            htmlContent: "<p>Hello</p>",
        });
        expect(brevo_1.default.sendTransacEmail).toHaveBeenCalledWith({
            to: [{ email: "test@example.com" }],
            sender: {
                name: "VoteNow Voting App",
                email: "noreply@example.com",
            },
            subject: "Test Subject",
            htmlContent: "<p>Hello</p>",
        });
        expect(logger_1.default.info).toHaveBeenCalledWith("Email sent to test@example.com", mockResponse);
        expect(logger_1.default.error).not.toHaveBeenCalled();
    });
    it("should log error if sending fails", async () => {
        const mockError = new Error("SMTP error");
        brevo_1.default.sendTransacEmail.mockRejectedValueOnce(mockError);
        await (0, sendEmail_1.default)({
            toEmail: "fail@example.com",
            subject: "Fail Subject",
            htmlContent: "<p>Fail</p>",
        });
        expect(brevo_1.default.sendTransacEmail).toHaveBeenCalledWith({
            to: [{ email: "fail@example.com" }],
            sender: {
                name: "VoteNow Voting App",
                email: "noreply@example.com",
            },
            subject: "Fail Subject",
            htmlContent: "<p>Fail</p>",
        });
        expect(logger_1.default.error).toHaveBeenCalledWith("Error sending email to fail@example.com", mockError);
        expect(logger_1.default.info).not.toHaveBeenCalled();
    });
});
