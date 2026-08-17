"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_github2_1 = require("passport-github2");
const Social_1 = __importDefault(require("./Social"));
class GitHubSocial extends Social_1.default {
    constructor(profile) {
        super(profile, "github");
    }
}
const verify = async (_accessToken, _refreshToken, profile, done) => {
    const strategy = new GitHubSocial(profile);
    try {
        await strategy.authenticate(done);
    }
    catch (err) {
        done(err, null);
    }
};
exports.default = () => new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/v1/oauth/github/callback",
    scope: ["user:email"], // To access verified email and profile info
}, verify);
