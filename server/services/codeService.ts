import { Op } from "sequelize";

import { Code } from "../models/code";
import {
  generateRandomDigitsCode,
  getHashedDigitCode,
  generateRandomHexCode,
  getHashedHexCode,
} from "../utils/randomCodeGenerator";

export const createCodeService = (CodeModel: typeof Code) => {
  return {
    /**
     * Create and return a new signup code (raw form).
     *
     * @param email - The email of the user signing up
     * @returns The raw signup code
     */
    async createSignupCode(email: string): Promise<string> {
      const code = generateRandomDigitsCode();
      await CodeModel.create({
        email,
        codeHash: await getHashedDigitCode(code),
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
    async getLatestValidSignupCode(email: string): Promise<Code | null> {
      const signupCode = await CodeModel.findOne({
        where: {
          email,
          type: "signup",
          expiresAt: { [Op.gte]: new Date() },
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
    async createResetCode(email: string): Promise<string> {
      const code = generateRandomHexCode();
      await CodeModel.create({
        email,
        codeHash: getHashedHexCode(code),
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
    async findValidResetCodeRecord(resetCode: string): Promise<Code | null> {
      const resetCodeRecord = await CodeModel.findOne({
        where: {
          codeHash: getHashedHexCode(resetCode),
          expiresAt: { [Op.gt]: new Date() },
        },
      });
      return resetCodeRecord;
    },
  };
};

export default createCodeService;
