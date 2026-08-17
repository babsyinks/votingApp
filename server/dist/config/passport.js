"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const FacebookStrategy_1 = __importDefault(require("../strategies/social/FacebookStrategy"));
const GitHubStrategy_1 = __importDefault(require("../strategies/social/GitHubStrategy"));
const GoogleStrategy_1 = __importDefault(require("../strategies/social/GoogleStrategy"));
passport_1.default.use((0, FacebookStrategy_1.default)());
passport_1.default.use((0, GitHubStrategy_1.default)());
passport_1.default.use((0, GoogleStrategy_1.default)());
