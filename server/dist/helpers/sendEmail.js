"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brevo_1 = __importDefault(require("../config/brevo"));
const logger_1 = __importDefault(require("../utils/logger"));
async function sendEmail({ toEmail, subject, htmlContent, }) {
    const emailConf = {
        to: [{ email: toEmail }],
        sender: {
            name: "VoteNow Voting App",
            email: process.env.BREVO_VERIFIED_SENDER_EMAIL,
        },
        subject,
        htmlContent,
    };
    try {
        const response = await brevo_1.default.sendTransacEmail(emailConf);
        logger_1.default.info(`Email sent to ${toEmail}`, response);
    }
    catch (error) {
        logger_1.default.error(`Error sending email to ${toEmail}`, error);
    }
}
exports.default = sendEmail;
