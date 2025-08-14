const authController = require("../../controllers/authController");
const { authService } = require("../../services");
const {
  failIfEmpty,
  failIfUserExists,
  validateCredentials,
  failIfVerificationCodeIsNotValid,
  failIfPasswordWeak,
} = require("../../validators/authValidators");
const { generateTokensAndSendResponse } = require("../../helpers/authControllerHelpers");
const sendSignupCode = require("../../helpers/sendSignupCode");
const sendPasswordResetLink = require("../../helpers/sendPasswordResetLink");
const sendPasswordResetSuccessNotification = require("../../helpers/sendPasswordResetSuccessNotification");

jest.mock("../../services", () => ({
  authService: {
    getUserByEmail: jest.fn(),
    createSignupCode: jest.fn(),
    getLatestValidSignupCode: jest.fn(),
    findExistingUser: jest.fn(),
    createUser: jest.fn(),
    getUserByIdentity: jest.fn(),
    createResetCode: jest.fn(),
    findValidResetCodeRecord: jest.fn(),
    updatePassword: jest.fn(),
  },
}));

jest.mock("../../validators/authValidators", () => ({
  failIfEmpty: jest.fn(),
  failIfUserExists: jest.fn(),
  validateCredentials: jest.fn(),
  failIfVerificationCodeIsNotValid: jest.fn(),
  failIfPasswordWeak: jest.fn(),
}));

jest.mock("../../helpers/authControllerHelpers", () => ({
  generateTokensAndSendResponse: jest.fn(),
}));

jest.mock("../../helpers/sendSignupCode", () => jest.fn());
jest.mock("../../helpers/sendPasswordResetLink", () => jest.fn());
jest.mock("../../helpers/sendPasswordResetSuccessNotification", () => jest.fn());

describe("authController", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();

    // Default to noop implementations so they never throw unless overridden
    failIfEmpty.mockImplementation(() => {});
    failIfPasswordWeak.mockImplementation(() => {});
    failIfUserExists.mockImplementation(() => {});
    validateCredentials.mockImplementation(() => {});
    failIfVerificationCodeIsNotValid.mockImplementation(() => {});
  });

  describe("requestSignUpCode", () => {
    it("should send signup code if email is valid and user doesn't exist", async () => {
      req.body.email = "test@example.com";
      authService.getUserByEmail.mockResolvedValue(null);
      authService.createSignupCode.mockResolvedValue("123456");

      await authController.requestSignUpCode(req, res, next);

      expect(failIfEmpty).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(authService.getUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(authService.createSignupCode).toHaveBeenCalledWith("test@example.com");
      expect(sendSignupCode).toHaveBeenCalledWith({
        toEmail: "test@example.com",
        otpCode: "123456",
      });
      expect(res.json).toHaveBeenCalledWith({ success: true, email: "test@example.com" });
    });

    it("should call next with error if something fails", async () => {
      const error = new Error("fail");
      failIfEmpty.mockImplementation(() => {
        throw error;
      });

      await authController.requestSignUpCode(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("verifySignUpCode", () => {
    it("should verify and destroy signup code", async () => {
      req.body = { email: "test@example.com", code: "123456" };
      const row = { destroy: jest.fn() };
      authService.getLatestValidSignupCode.mockResolvedValue(row);

      await authController.verifySignUpCode(req, res, next);

      expect(authService.getLatestValidSignupCode).toHaveBeenCalledWith("test@example.com");
      expect(failIfVerificationCodeIsNotValid).toHaveBeenCalledWith("123456", row);
      expect(row.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should call next with error message if verification code is invalid", async () => {
      req.body = { email: "test@example.com", code: "bad" };
      const row = { destroy: jest.fn() };
      authService.getLatestValidSignupCode.mockResolvedValue(row);
      failIfVerificationCodeIsNotValid.mockImplementation(() => {
        throw new Error("Invalid code");
      });

      await authController.verifySignUpCode(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(row.destroy).not.toHaveBeenCalled();
    });
  });

  describe("register", () => {
    it("should create user and send tokens", async () => {
      req.body = {
        username: "user",
        email: "test@example.com",
        password: "pass",
        firstname: "A",
        lastname: "B",
      };
      authService.findExistingUser.mockResolvedValue(null);
      authService.createUser.mockResolvedValue({ id: 1 });

      await authController.register(req, res, next);

      expect(failIfPasswordWeak).toHaveBeenCalledWith("pass");
      expect(generateTokensAndSendResponse).toHaveBeenCalledWith({ res, user: { id: 1 } });
    });

    it("should call next with error message if user already exists", async () => {
      req.body = { username: "user", email: "test@example.com", password: "pass" };
      authService.findExistingUser.mockResolvedValue({ id: 1 });
      failIfUserExists.mockImplementation(() => {
        throw new Error("User exists");
      });

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(generateTokensAndSendResponse).not.toHaveBeenCalled();
    });
  });

  describe("signin", () => {
    it("should validate credentials and send tokens", async () => {
      req.body = { username: "user", password: "pass" };
      authService.getUserByIdentity.mockResolvedValue({ id: 1 });

      await authController.signin(req, res, next);

      expect(authService.getUserByIdentity).toHaveBeenCalledWith({
        email: undefined,
        username: "user",
      });
      expect(validateCredentials).toHaveBeenCalledWith({ id: 1 }, "pass");
    });

    it("should work with email login", async () => {
      req.body = { email: "test@example.com", password: "pass" };
      authService.getUserByIdentity.mockResolvedValue({ id: 1 });

      await authController.signin(req, res, next);

      expect(failIfEmpty).toHaveBeenCalledWith({ email: "test@example.com", password: "pass" });
      expect(authService.getUserByIdentity).toHaveBeenCalledWith({
        email: "test@example.com",
        username: undefined,
      });
      expect(validateCredentials).toHaveBeenCalledWith({ id: 1 }, "pass");
      expect(generateTokensAndSendResponse).toHaveBeenCalledWith({ res, user: { id: 1 } });
    });

    it("should call next with error message if credentials invalid", async () => {
      req.body = { username: "user", password: "wrongpass" };
      authService.getUserByIdentity.mockResolvedValue({ id: 1 });
      validateCredentials.mockImplementation(() => {
        throw new Error("Invalid credentials");
      });

      await authController.signin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(generateTokensAndSendResponse).not.toHaveBeenCalled();
    });
  });

  describe("forgotPassword", () => {
    it("should send reset link if user exists", async () => {
      req.body.email = "test@example.com";
      authService.getUserByEmail.mockResolvedValue({ id: 1 });
      authService.createResetCode.mockResolvedValue("reset123");

      await authController.forgotPassword(req, res, next);

      expect(sendPasswordResetLink).toHaveBeenCalledWith({
        toEmail: "test@example.com",
        resetCode: "reset123",
      });
    });

    it("should respond with message if user not found", async () => {
      req.body.email = "notfound@example.com";
      authService.getUserByEmail.mockResolvedValue(null);

      await authController.forgotPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "A reset link has been sent to notfound@example.com",
      });
    });

    it("should call next with error message if sending reset link fails", async () => {
      req.body.email = "test@example.com";
      authService.getUserByEmail.mockResolvedValue({ id: 1 });
      authService.createResetCode.mockResolvedValue("reset123");
      sendPasswordResetLink.mockImplementation(() => {
        throw new Error("Mail fail");
      });

      await authController.forgotPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("should update password if reset code valid", async () => {
      req.body = { resetCode: "code123", password: "newpass" };
      const resetCodeRecord = { email: "test@example.com", destroy: jest.fn() };
      authService.findValidResetCodeRecord.mockResolvedValue(resetCodeRecord);

      await authController.resetPassword(req, res, next);

      expect(authService.updatePassword).toHaveBeenCalledWith("test@example.com", "newpass");
      expect(resetCodeRecord.destroy).toHaveBeenCalled();
      expect(sendPasswordResetSuccessNotification).toHaveBeenCalledWith({
        toEmail: "test@example.com",
      });
      expect(res.json).toHaveBeenCalledWith({ message: "Password successfully updated" });
    });

    it("should return 400 if reset code invalid", async () => {
      req.body = { resetCode: "invalid", password: "newpass" };
      authService.findValidResetCodeRecord.mockResolvedValue(null);

      await authController.resetPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
    });

    it("should call next with error message if success notification fails", async () => {
      req.body = { resetCode: "good", password: "pass" };
      const resetCodeRecord = { email: "test@example.com", destroy: jest.fn() };
      authService.findValidResetCodeRecord.mockResolvedValue(resetCodeRecord);
      sendPasswordResetSuccessNotification.mockImplementation(() => {
        throw new Error("Notify fail");
      });

      await authController.resetPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("signout", () => {
    it("should clear cookies and return message", () => {
      authController.signout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith("access_token");
      expect(res.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out" });
    });
  });
});
