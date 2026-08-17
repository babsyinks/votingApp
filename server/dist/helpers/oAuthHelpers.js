"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOauthStartMiddleware = exports.passportCallbackWrapper = void 0;
const passport_1 = __importDefault(require("passport"));
const oAuthCallbackHandler_1 = require("./oAuthCallbackHandler");
const passportCallbackWrapper = (strategy, callbackFactory = oAuthCallbackHandler_1.handleOauthCallback) => {
    return (req, res, next) => {
        passport_1.default.authenticate(strategy, oAuthCallbackHandler_1.sessionOff, callbackFactory()(req, res))(req, res, next);
    };
};
exports.passportCallbackWrapper = passportCallbackWrapper;
const getOauthStartMiddleware = (strategy, options = {}) => {
    return passport_1.default.authenticate(strategy, {
        session: false,
        ...options,
    });
};
exports.getOauthStartMiddleware = getOauthStartMiddleware;
