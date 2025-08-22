const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {
  generateRandomDigitsCode,
  getHashedDigitCode,
  generateRandomHexCode,
  getHashedHexCode,
} = require("../../utils/randomCodeGenerator");

describe("randomCodeGenerator utility functions", () => {
  describe("generateRandomDigitsCode", () => {
    it("should generate a string of digits of default length 6", () => {
      const code = generateRandomDigitsCode();
      expect(code).toMatch(/^\d{6}$/);
    });

    it("should generate a string of digits of given length", () => {
      const length = 8;
      const code = generateRandomDigitsCode(length);
      expect(code).toMatch(/^\d{8}$/);
    });

    it("should generate different values on multiple calls", () => {
      const code1 = generateRandomDigitsCode();
      const code2 = generateRandomDigitsCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe("getHashedDigitCode", () => {
    it("should hash the provided code", async () => {
      const code = "123456";
      const hash = await getHashedDigitCode(code);
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash format
      const match = await bcrypt.compare(code, hash);
      expect(match).toBe(true);
    });

    it("should generate a code if not provided and hash it", async () => {
      const hash = await getHashedDigitCode(null, 6);
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/);
    });
  });

  describe("generateRandomHexCode", () => {
    it("should generate a hex string of length 64 by default", () => {
      const code = generateRandomHexCode();
      expect(code).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should generate a hex string of length 2 * byteLength", () => {
      const byteLength = 10;
      const code = generateRandomHexCode(byteLength);
      expect(code).toMatch(/^[a-f0-9]{20}$/);
    });

    it("should generate different values on multiple calls", () => {
      const code1 = generateRandomHexCode();
      const code2 = generateRandomHexCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe("getHashedHexCode", () => {
    it("should return a SHA-256 hash in hex format", () => {
      const code = "strcode";
      const hash = getHashedHexCode(code);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);

      const expectedHash = crypto.createHash("sha256").update(code).digest("hex");
      expect(hash).toBe(expectedHash);
    });

    it("same input should return same hash", () => {
      const code = "consistent";
      const hash1 = getHashedHexCode(code);
      const hash2 = getHashedHexCode(code);
      expect(hash1).toBe(hash2);
    });

    it("different input should return different hashes", () => {
      const hash1 = getHashedHexCode("a");
      const hash2 = getHashedHexCode("b");
      expect(hash1).not.toBe(hash2);
    });
  });
});
