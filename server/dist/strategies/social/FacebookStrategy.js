"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_facebook_1 = require("passport-facebook");
const Social_1 = __importDefault(require("./Social"));
class FacebookSocial extends Social_1.default {
    constructor(profile) {
        super(profile, "facebook", false);
    }
}
const verify = async (_accessToken, _refreshToken, profile, done) => {
    const strategy = new FacebookSocial(profile);
    await strategy.authenticate(done);
};
exports.default = () => new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/v1/oauth/facebook/callback",
    profileFields: ["id", "emails", "name", "displayName"],
}, verify);
