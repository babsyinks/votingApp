"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCodeService = void 0;
const sequelize_1 = require("sequelize");
const randomCodeGenerator_1 = require("../utils/randomCodeGenerator");
const createCodeService = (CodeModel) => {
    return {
        /**
         * Create and return a new signup code (raw form).
         *
         * @param email - The email of the user signing up
         * @returns The raw signup code
         */
        async createSignupCode(email) {
            const code = (0, randomCodeGenerator_1.generateRandomDigitsCode)();
            await CodeModel.create({
                email,
                codeHash: await (0, randomCodeGenerator_1.getHashedDigitCode)(code),
                type: "signup",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            });
            return code;
        },
        /**
         * Fetch latest valid signup code row.
         *
         * @param email - The email of the user to get the latest valid signup code for
         * @returns The latest valid code record, or null
         */
        async getLatestValidSignupCode(email) {
            const signupCode = await CodeModel.findOne({
                where: {
                    email,
                    type: "signup",
                    expiresAt: { [sequelize_1.Op.gte]: new Date() },
                },
                order: [["createdAt", "DESC"]],
            });
            return signupCode;
        },
        /**
         * Create and return a password reset code (raw).
         *
         * @param email - The email of the user whose password is to be reset
         * @returns The raw reset code
         */
        async createResetCode(email) {
            const code = (0, randomCodeGenerator_1.generateRandomHexCode)();
            await CodeModel.create({
                email,
                codeHash: (0, randomCodeGenerator_1.getHashedHexCode)(code),
                type: "password_reset",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            });
            return code;
        },
        /**
         * Find valid reset code row for a given code string.
         *
         * @param resetCode - The reset code to use to find out if it is valid
         * @returns The code record if valid, or null
         */
        async findValidResetCodeRecord(resetCode) {
            const resetCodeRecord = await CodeModel.findOne({
                where: {
                    codeHash: (0, randomCodeGenerator_1.getHashedHexCode)(resetCode),
                    expiresAt: { [sequelize_1.Op.gt]: new Date() },
                },
            });
            return resetCodeRecord;
        },
    };
};
exports.createCodeService = createCodeService;
exports.default = exports.createCodeService;
