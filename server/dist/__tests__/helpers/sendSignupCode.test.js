"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendSignupCode_1 = __importDefault(require("../../helpers/sendSignupCode"));
const sendEmail_1 = __importDefault(require("../../helpers/sendEmail"));
jest.mock("../../helpers/sendEmail");
describe("sendSignupCode", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should call sendEmail with correct parameters", async () => {
        await (0, sendSignupCode_1.default)({ toEmail: "user@example.com", otpCode: "987654" });
        expect(sendEmail_1.default).toHaveBeenCalledWith({
            toEmail: "user@example.com",
            subject: "Your One-Time Password (OTP)",
            htmlContent: "<p>Your OTP is <strong>987654</strong>. It will expire in 10 minutes.</p>",
        });
    });
    it("should propagate error if sendEmail throws", async () => {
        sendEmail_1.default.mockRejectedValueOnce(new Error("Email send failed"));
        await expect((0, sendSignupCode_1.default)({ toEmail: "fail@example.com", otpCode: "111111" })).rejects.toThrow("Email send failed");
    });
});
