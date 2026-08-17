"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emailTemplateBuilder_1 = __importDefault(require("./emailTemplateBuilder"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
async function sendPasswordResetLink({ toEmail, resetCode, }) {
    const subject = "Reset your password";
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetCode}`;
    const htmlContent = (0, emailTemplateBuilder_1.default)({
        heading: "Reset Your Password",
        content: [
            {
                message: "We received a request to reset your password. Click the button below to proceed:",
                linkDetails: {
                    url: resetUrl,
                    btnValue: "Reset Password",
                    isMainBtn: true,
                },
            },
        ],
        footNote: "If you didn't request this, you can safely ignore this email.",
    });
    await (0, sendEmail_1.default)({ toEmail, subject, htmlContent });
}
sendPasswordResetLink({
    toEmail: "babawarunn@yahoo.com",
    resetCode: "123456",
}).then((res) => {
    console.log("done");
});
exports.default = sendPasswordResetLink;
