"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
const emailTemplateBuilder_1 = __importDefault(require("./emailTemplateBuilder"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
async function sendPasswordResetSuccessNotification({ toEmail, }) {
    const subject = "Your password was successfully reset";
    const clientUrl = process.env.CLIENT_URL;
    const signinUrl = `${clientUrl}/signin`;
    const helpUrl = `${clientUrl}/help`;
    const htmlContent = (0, emailTemplateBuilder_1.default)({
        heading: "Password Reset Successful",
        content: [
            {
                message: "Your password has been successfully updated. If you initiated this change, no further action is needed. You can now sign in to your account.",
                linkDetails: { url: signinUrl, btnValue: "Sign In", isMainBtn: true },
            },
            {
                message: "<strong>Didn't request this change?</strong> Please contact our support team immediately. Your account's security is important to us.",
                linkDetails: {
                    url: helpUrl,
                    btnValue: "Contact Support",
                    isMainBtn: false,
                },
            },
        ],
        footNote: "You can also reset your password again if you suspect any unauthorized access by using the 'forgot password' link on the sign in page.",
    });
    await (0, sendEmail_1.default)({ toEmail, subject, htmlContent });
}
exports.default = sendPasswordResetSuccessNotification;
