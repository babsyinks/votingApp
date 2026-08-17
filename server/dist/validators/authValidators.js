"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.failIfPasswordWeak = exports.validateCredentials = exports.failIfVerificationCodeIsNotValid = exports.failIfUserDoesNotExist = exports.failIfUserExists = exports.failIfEmpty = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const strongPasswordConf_1 = __importDefault(require("../config/strongPasswordConf"));
const generateCustomError_1 = __importDefault(require("../utils/generateCustomError"));
const failIfEmpty = (fieldsObj) => {
    const keys = Object.keys(fieldsObj);
    const emptyField = [];
    if (keys.some((key) => {
        if (!fieldsObj[key])
            emptyField.push(key);
        return !fieldsObj[key];
    })) {
        (0, generateCustomError_1.default)(`${emptyField[0].toLowerCase()} field must be filled!`, 400);
    }
};
exports.failIfEmpty = failIfEmpty;
const failIfUserExists = (user) => {
    if (user) {
        (0, generateCustomError_1.default)("This User Exists Already!", 403);
    }
};
exports.failIfUserExists = failIfUserExists;
const failIfUserDoesNotExist = (user) => {
    if (!user) {
        (0, generateCustomError_1.default)("User not found", 400);
    }
};
exports.failIfUserDoesNotExist = failIfUserDoesNotExist;
const failIfVerificationCodeIsNotValid = async (code, row) => {
    if (!row || !(await bcryptjs_1.default.compare(code, row.codeHash))) {
        (0, generateCustomError_1.default)("Invalid or expired code", 403);
    }
};
exports.failIfVerificationCodeIsNotValid = failIfVerificationCodeIsNotValid;
const validateCredentials = async (user, password) => {
    let checkPassword = false;
    if (user) {
        checkPassword = await bcryptjs_1.default.compare(password, user.password);
    }
    if (!user || !checkPassword) {
        (0, generateCustomError_1.default)("Wrong Username, Email or Password", 401);
    }
};
exports.validateCredentials = validateCredentials;
const _passwordStrengthStatus = (password) => {
    for (const { message, test } of strongPasswordConf_1.default) {
        if (!test(password))
            return message;
    }
};
const failIfPasswordWeak = (password) => {
    const passwordStrengthStatusMessage = _passwordStrengthStatus(password);
    if (passwordStrengthStatusMessage) {
        (0, generateCustomError_1.default)(`Password must have ${passwordStrengthStatusMessage.toLowerCase()}`, 400);
    }
};
exports.failIfPasswordWeak = failIfPasswordWeak;
