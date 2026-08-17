"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const models_1 = require("../../models");
class Social {
    constructor(profile, strategy = "Social", namesCombined = true) {
        this.profile = profile;
        this.strategy = strategy;
        this.namesCombined = namesCombined;
    }
    async authenticate(done) {
        try {
            const email = this.__extractEmail();
            let user = await models_1.User.findOne({ where: { email } });
            if (!user) {
                user = await this.__createUser(email);
            }
            return done(null, user);
        }
        catch (err) {
            return done(err, null);
        }
    }
    async __createUser(email) {
        const { firstname, lastname } = this.__extractFirstAndLastNames();
        return await models_1.User.create({
            user_id: (0, uuid_1.v4)(),
            username: this.profile.username || email,
            email,
            password: await bcryptjs_1.default.hash((0, uuid_1.v4)(), 10),
            firstname,
            lastname,
            isAdmin: false,
        });
    }
    __extractEmail() {
        return (this.profile.emails?.[0]?.value ||
            `${this.profile.id}@${this.strategy}.com`);
    }
    __extractFirstAndLastNames() {
        return this.namesCombined
            ? this.__extractNamesFromProfileDisplayNameProp()
            : this.__extractNamesFromProfileNameProp();
    }
    __extractNamesFromProfileNameProp() {
        return {
            firstname: this.profile.name?.givenName ||
                this.__capitalizeFirstLetterOfStrategy(),
            lastname: this.profile.name?.familyName || "User",
        };
    }
    __extractNamesFromProfileDisplayNameProp() {
        const names = this.profile.displayName?.split(" ");
        const firstname = names?.[0] || this.__capitalizeFirstLetterOfStrategy();
        const lastname = names?.[1] || "User";
        return { firstname, lastname };
    }
    __capitalizeFirstLetterOfStrategy() {
        return `${this.strategy.charAt(0).toUpperCase()}${this.strategy.slice(1)}`;
    }
}
exports.default = Social;
