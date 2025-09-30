const { Op } = require("sequelize");


jest.mock("../../utils/randomCodeGenerator", () => ({
  generateRandomDigitsCode: jest.fn(),
  getHashedDigitCode: jest.fn(),
  generateRandomHexCode: jest.fn(),
  getHashedHexCode: jest.fn(),
}));

const {
  generateRandomDigitsCode,
  getHashedDigitCode,
  generateRandomHexCode,
  getHashedHexCode,
} = require("../../utils/randomCodeGenerator");

describe("codeService", () => {
  let Code;
  let codeService;

  beforeEach(() => {
    Code = {
      create: jest.fn(),
      findOne: jest.fn(),
    };
    codeService = require("../../services/codeService")(Code);

    jest.clearAllMocks();
  });

  describe("createSignupCode", () => {
    it("should create a signup code and return the raw code", async () => {
      generateRandomDigitsCode.mockReturnValue(123456);
      getHashedDigitCode.mockResolvedValue("hashed123456");

      const email = "test@example.com";
      await expect(codeService.createSignupCode(email)).resolves.toBe(123456);

      expect(generateRandomDigitsCode).toHaveBeenCalledTimes(1);
      expect(getHashedDigitCode).toHaveBeenCalledWith(123456);
      expect(Code.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email,
          codeHash: "hashed123456",
          type: "signup",
        })
      );
    });
  });

  describe("getLatestValidSignupCode", () => {
    it("should return latest valid signup code as JSON", async () => {
      const mockCode = { id: 1, toJSON: jest.fn().mockReturnValue({ id: 1 }) };
      Code.findOne.mockResolvedValue(mockCode);

      const result = await codeService.getLatestValidSignupCode("test@example.com");

      expect(Code.findOne).toHaveBeenCalledWith({
        where: {
          email: "test@example.com",
          type: "signup",
          expiresAt: { [Op.gte]: expect.any(Date) },
        },
        order: [["createdAt", "DESC"]],
      });
      expect(result).toEqual({ id: 1 });
    });

    it("should return undefined if no code is found", async () => {
      Code.findOne.mockResolvedValue(null);

      const result = await codeService.getLatestValidSignupCode("test@example.com");

      expect(result).toBeUndefined();
    });
  });

  describe("createResetCode", () => {
    it("should create a reset code and return the raw code", async () => {
      generateRandomHexCode.mockReturnValue("abc123");
      getHashedHexCode.mockReturnValue("hashedabc123");

      const email = "reset@example.com";
      const result = await codeService.createResetCode(email);

      expect(result).toBe("abc123");
      expect(generateRandomHexCode).toHaveBeenCalledTimes(1);
      expect(getHashedHexCode).toHaveBeenCalledWith("abc123");
      expect(Code.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email,
          codeHash: "hashedabc123",
          type: "password_reset",
        })
      );
    });
  });

  describe("findValidResetCodeRecord", () => {
    it("should find and return valid reset code record", async () => {
      const mockRecord = { id: 99 };
      Code.findOne.mockResolvedValue(mockRecord);
      getHashedHexCode.mockReturnValue("hashed123");

      const result = await codeService.findValidResetCodeRecord("123");

      expect(getHashedHexCode).toHaveBeenCalledWith("123");
      expect(Code.findOne).toHaveBeenCalledWith({
        where: {
          codeHash: "hashed123",
          expiresAt: { [Op.gt]: expect.any(Date) },
        },
      });
      expect(result).toBe(mockRecord);
    });

    it("should return null if no record found", async () => {
      Code.findOne.mockResolvedValue(null);
      getHashedHexCode.mockReturnValue("hashed456");

      const result = await codeService.findValidResetCodeRecord("456");

      expect(result).toBeNull();
    });
  });
});
