"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetailsOnOauthSuccess = exports.githubOauthConclude = exports.githubOauthStart = exports.facebookOauthConclude = exports.facebookOauthStart = exports.googleOauthConclude = exports.googleOauthStart = void 0;
const oAuthHelpers_1 = require("../helpers/oAuthHelpers");
// Google OAuth
exports.googleOauthStart = (0, oAuthHelpers_1.getOauthStartMiddleware)("google", {
    scope: ["email", "profile"],
});
exports.googleOauthConclude = (0, oAuthHelpers_1.passportCallbackWrapper)("google");
// Facebook OAuth
exports.facebookOauthStart = (0, oAuthHelpers_1.getOauthStartMiddleware)("facebook", {
    scope: ["email", "public_profile"],
});
exports.facebookOauthConclude = (0, oAuthHelpers_1.passportCallbackWrapper)("facebook");
// GitHub OAuth
exports.githubOauthStart = (0, oAuthHelpers_1.getOauthStartMiddleware)("github", {
    scope: ["user:email", "read:user"],
});
exports.githubOauthConclude = (0, oAuthHelpers_1.passportCallbackWrapper)("github");
// After OAuth success
const getUserDetailsOnOauthSuccess = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            res
                .status(401)
                .json({ isAuthenticated: false, message: "No user found" });
            return;
        }
        const { username, user_id, role } = user;
        res.json({
            isAuthenticated: true,
            user: {
                username,
                userId: user_id,
                role,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserDetailsOnOauthSuccess = getUserDetailsOnOauthSuccess;
