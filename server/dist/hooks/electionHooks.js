"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const slugify_1 = __importDefault(require("slugify"));
const logger_1 = __importDefault(require("../utils/logger"));
const electionHooks = {
    async beforeCreate(election) {
        if (!election.slug) {
            election.slug = (0, slugify_1.default)(election.name, { lower: true, strict: true });
        }
        if (!election.short_link) {
            election.short_link = `${process.env.CLIENT_URL}/${(0, nanoid_1.nanoid)(8)}`;
        }
    },
    async afterCreate(election) {
        logger_1.default.info(`Election created: ${election.slug}, short link: ${election.short_link}`);
    },
};
exports.default = electionHooks;
