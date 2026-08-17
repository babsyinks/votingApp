"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOauthCallback = exports.sessionOff = void 0;
const authHelpers_1 = require("./authHelpers");
const FAILURE_REDIRECT = `${process.env.CLIENT_URL}/signin`;
const SUCCESS_REDIRECT = `${process.env.CLIENT_URL}/oauth-success`;
exports.sessionOff = { session: false };
const handleOauthCallback = ({ successRedirectUri = SUCCESS_REDIRECT, failureRedirectUri = FAILURE_REDIRECT, } = {}) => {
    return (_req, res) => (err, user) => {
        if (err || !user) {
            let errorMessage = err?.message || "Authentication failed";
            if (err?.errors) {
                errorMessage = err.errors.map((e) => e.message).join("; ");
            }
            return res.redirect(`${failureRedirectUri}?error=${encodeURIComponent(errorMessage)}`);
        }
        return (0, authHelpers_1.generateTokensAndRedirect)({
            res,
            user,
            redirectUri: successRedirectUri,
        });
    };
};
exports.handleOauthCallback = handleOauthCallback;
