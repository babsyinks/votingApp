import crypto from "crypto";

import bcrypt from "bcryptjs";

/**
 * Generates random digits code of a specific length.
 *
 * @param codeLength - The length of the code to generate. Defaults to 6.
 * @returns A string of random digits of the given length.
 */
export const generateRandomDigitsCode = (codeLength: number = 6): string => {
  const adder = "1".padEnd(codeLength, "0");
  const multiplier = "9".padEnd(codeLength, "0");
  return Math.floor(
    Number(adder) + Math.random() * Number(multiplier),
  ).toString();
};

/**
 * Hashes a given code using bcrypt. If no code is provided,
 * generates one of the given length (defaults to 6).
 *
 * @param randCode - The code to hash. If omitted, one will be generated.
 * @param codeLength - The length of the code to generate if randCode is omitted.
 * @returns A bcrypt hash of the code.
 */
export const getHashedDigitCode = async (
  randCode?: string,
  codeLength: number = 6,
): Promise<string> => {
  const code = randCode || generateRandomDigitsCode(codeLength);
  return bcrypt.hash(code, 12);
};

/**
 * Generates random hex code of a specific byte length.
 *
 * @param byteLength - The number of bytes to generate. Defaults to 32.
 * @returns A hex string of length `byteLength * 2`.
 */
export const generateRandomHexCode = (byteLength: number = 32): string => {
  return crypto.randomBytes(byteLength).toString("hex");
};

/**
 * Generates a SHA-256 hash of a given hex code.
 *
 * @param code - The string to hash.
 * @returns The SHA-256 hash as a hex string.
 */
export const getHashedHexCode = (code: string): string => {
  return crypto.createHash("sha256").update(code).digest("hex");
};
