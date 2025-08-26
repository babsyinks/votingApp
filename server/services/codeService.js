const { Op } = require("sequelize");

const {
  generateRandomDigitsCode,
  getHashedDigitCode,
  generateRandomHexCode,
  getHashedHexCode,
} = require("../utils/randomCodeGenerator");

module.exports = (Code) => {
  return {
    /**
     * @typedef {Object} Code
     * 
     * @property {string} code_id
     * @property {string} codeHash
     * @property {string} email
     * @property {string} type
     * @property {EpochTimeStamp} expiresAt
     */

    /**
     * Create and return a new signup code (raw form).
     *
     * @param {string} email The email of the user signing up
     * @returns {Promise<number>} the signup code
     */
    async createSignupCode(email) {
      const code = generateRandomDigitsCode();
      await Code.create({
        email,
        codeHash: await getHashedDigitCode(code),
        type: "signup",
        expiresAt: Date.now() + 10 * 60 * 1000,
      });
      return code;
    },

    /**
     * Fetch latest valid signup code row.
     *
     * @param {string} email The email of the user to get the latest valid signup code for
     * @returns {Promise<Code>} the latest valid code model that is saved
     */
    async getLatestValidSignupCode(email) {
      const signupCode = await Code.findOne({
        where: {
          email,
          type: "signup",
          expiresAt: { [Op.gte]: new Date() },
        },
        order: [["createdAt", "DESC"]],
      });
      return signupCode?.toJSON();
    },

    /**
     * Create and return a password reset code (raw).
     *
     * @param {string} email The email of the user whose password is to be reset
     * @returns {Promise<number>} the reset code
     */
    async createResetCode(email) {
      const code = generateRandomHexCode();
      await Code.create({
        email,
        codeHash: getHashedHexCode(code),
        type: "password_reset",
        expiresAt: Date.now() + 10 * 60 * 1000,
      });
      return code;
    },

    /**
     * Find valid reset code row for a given code string.
     *
     * @param {number} resetCode The reset code to use to find out if it is valid
     * @returns {Promise<Code>} the code model having the reset code
     */
    async findValidResetCodeRecord(resetCode) {
      const resetCodeRecord = await Code.findOne({
        where: {
          codeHash: getHashedHexCode(resetCode),
          expiresAt: { [Op.gt]: new Date() },
        },
      });
      return resetCodeRecord;
    },
  };
};
