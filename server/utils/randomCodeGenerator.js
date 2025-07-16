const bcrypt = require("bcryptjs");

/**
 * Generates random digits code of a specific length.
 *
 * @param {number} codeLength The length of the code to generate. It defaults to 6.
 * @returns {string}
 */
const generateRandomCode = (codeLength = 6) => {
  const adder = "1".padEnd(codeLength, 0);
  const multiplier = "9".padEnd(codeLength, 0);
  return Math.floor(+adder + Math.random() * +multiplier).toString();
};

/**
 * Helps to get the hash of a given code. If the code is not provided, it generates and hashes the code
 * of the provided codeLength or a 6 digit code which is the default code length.
 *
 * @param {string} randCode The code provided for this function to hash.
 * @param {number} codeLength The length of the desired hash code.
 * @returns {string}
 */
const getHashedCode = async (randCode, codeLength) => {
  const code = randCode || generateRandomCode(codeLength);
  const randomHashedCode = await bcrypt.hash(code, 12);
  return randomHashedCode;
};

module.exports = { generateRandomCode, getHashedCode };
