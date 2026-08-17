"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const Social_1 = __importDefault(require("./Social"));
class GoogleSocial extends Social_1.default {
    constructor(profile) {
        super(profile, "google");
    }
}
const verify = async (_accessToken, _refreshToken, profile, done) => {
    const strategy = new GoogleSocial(profile);
    try {
        await strategy.authenticate(done);
    }
    catch (err) {
        done(err);
    }
};
exports.default = () => new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/oauth/google/callback",
}, verify);
