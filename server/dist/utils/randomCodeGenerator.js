"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHashedHexCode = exports.generateRandomHexCode = exports.getHashedDigitCode = exports.generateRandomDigitsCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Generates random digits code of a specific length.
 *
 * @param codeLength - The length of the code to generate. Defaults to 6.
 * @returns A string of random digits of the given length.
 */
const generateRandomDigitsCode = (codeLength = 6) => {
    const adder = "1".padEnd(codeLength, "0");
    const multiplier = "9".padEnd(codeLength, "0");
    return Math.floor(Number(adder) + Math.random() * Number(multiplier)).toString();
};
exports.generateRandomDigitsCode = generateRandomDigitsCode;
/**
 * Hashes a given code using bcrypt. If no code is provided,
 * generates one of the given length (defaults to 6).
 *
 * @param randCode - The code to hash. If omitted, one will be generated.
 * @param codeLength - The length of the code to generate if randCode is omitted.
 * @returns A bcrypt hash of the code.
 */
const getHashedDigitCode = async (randCode, codeLength = 6) => {
    const code = randCode || (0, exports.generateRandomDigitsCode)(codeLength);
    return bcryptjs_1.default.hash(code, 12);
};
exports.getHashedDigitCode = getHashedDigitCode;
/**
 * Generates random hex code of a specific byte length.
 *
 * @param byteLength - The number of bytes to generate. Defaults to 32.
 * @returns A hex string of length `byteLength * 2`.
 */
const generateRandomHexCode = (byteLength = 32) => {
    return crypto_1.default.randomBytes(byteLength).toString("hex");
};
exports.generateRandomHexCode = generateRandomHexCode;
/**
 * Generates a SHA-256 hash of a given hex code.
 *
 * @param code - The string to hash.
 * @returns The SHA-256 hash as a hex string.
 */
const getHashedHexCode = (code) => {
    return crypto_1.default.createHash("sha256").update(code).digest("hex");
};
exports.getHashedHexCode = getHashedHexCode;
