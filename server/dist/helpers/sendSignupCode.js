"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendEmail_1 = __importDefault(require("./sendEmail"));
async function sendSignupCode({ toEmail, otpCode, }) {
    await (0, sendEmail_1.default)({
        toEmail,
        subject: "Your One-Time Password (OTP)",
        htmlContent: `<p>Your OTP is <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`,
    });
}
exports.default = sendSignupCode;
