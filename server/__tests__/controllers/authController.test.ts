import { Request, Response, NextFunction } from "express";

import {
  requestSignUpCode,
  verifySignUpCode,
  register,
  signin,
  forgotPassword,
  resetPassword,
  signout,
} from "../../controllers/authController";

import { authService } from "../../services";
import {
  failIfEmpty,
  failIfUserExists,
  validateCredentials,
  failIfVerificationCodeIsNotValid,
  failIfPasswordWeak,
} from "../../validators/authValidators";

import { generateTokensAndSendResponse } from "../../helpers/authControllerHelpers";
import sendSignupCode from "../../helpers/sendSignupCode";
import sendPasswordResetLink from "../../helpers/sendPasswordResetLink";
import sendPasswordResetSuccessNotification from "../../helpers/sendPasswordResetSuccessNotification";

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
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    jest.clearAllMocks();

    // Default safe mock behavior
    (failIfEmpty as jest.Mock).mockImplementation(() => {});
    (failIfPasswordWeak as jest.Mock).mockImplementation(() => {});
    (failIfUserExists as jest.Mock).mockImplementation(() => {});
    (validateCredentials as jest.Mock).mockImplementation(() => {});
    (failIfVerificationCodeIsNotValid as jest.Mock).mockImplementation(() => {});
  });

  describe("requestSignUpCode", () => {
    it("should send signup code if email is valid and user doesn't exist", async () => {
      (req.body as any).email = "test@example.com";
      (authService.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (authService.createSignupCode as jest.Mock).mockResolvedValue("123456");

      await requestSignUpCode(req as Request, res as Response, next);

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
      (failIfEmpty as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await requestSignUpCode(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("verifySignUpCode", () => {
    it("should verify and destroy signup code", async () => {
      req.body = { email: "test@example.com", code: "123456" };
      const row = { destroy: jest.fn() };
      (authService.getLatestValidSignupCode as jest.Mock).mockResolvedValue(row);

      await verifySignUpCode(req as Request, res as Response, next);

      expect(authService.getLatestValidSignupCode).toHaveBeenCalledWith("test@example.com");
      expect(failIfVerificationCodeIsNotValid).toHaveBeenCalledWith("123456", row);
      expect(row.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should call next with error if verification fails", async () => {
      req.body = { email: "test@example.com", code: "bad" };
      const row = { destroy: jest.fn() };
      (authService.getLatestValidSignupCode as jest.Mock).mockResolvedValue(row);
      (failIfVerificationCodeIsNotValid as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid code");
      });

      await verifySignUpCode(req as Request, res as Response, next);

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
      (authService.findExistingUser as jest.Mock).mockResolvedValue(null);
      (authService.createUser as jest.Mock).mockResolvedValue({ id: 1 });

      await register(req as Request, res as Response, next);

      expect(failIfPasswordWeak).toHaveBeenCalledWith("pass");
      expect(generateTokensAndSendResponse).toHaveBeenCalledWith({ res, user: { id: 1 } });
    });

    it("should call next with error if user already exists", async () => {
      req.body = { username: "user", email: "test@example.com", password: "pass" };
      (authService.findExistingUser as jest.Mock).mockResolvedValue({ id: 1 });
      (failIfUserExists as jest.Mock).mockImplementation(() => {
        throw new Error("User exists");
      });

      await register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(generateTokensAndSendResponse).not.toHaveBeenCalled();
    });
  });

  describe("signin", () => {
    it("should validate credentials and send tokens (username login)", async () => {
      req.body = { username: "user", password: "pass" };
      (authService.getUserByIdentity as jest.Mock).mockResolvedValue({ id: 1 });

      await signin(req as Request, res as Response, next);

      expect(authService.getUserByIdentity).toHaveBeenCalledWith({
        email: undefined,
        username: "user",
      });
      expect(validateCredentials).toHaveBeenCalledWith({ id: 1 }, "pass");
      expect(generateTokensAndSendResponse).toHaveBeenCalledWith({ res, user: { id: 1 } });
    });

    it("should validate credentials and send tokens (email login)", async () => {
      req.body = { email: "test@example.com", password: "pass" };
      (authService.getUserByIdentity as jest.Mock).mockResolvedValue({ id: 1 });

      await signin(req as Request, res as Response, next);

      expect(failIfEmpty).toHaveBeenCalledWith({ email: "test@example.com", password: "pass" });
      expect(authService.getUserByIdentity).toHaveBeenCalledWith({
        email: "test@example.com",
        username: undefined,
      });
      expect(validateCredentials).toHaveBeenCalledWith({ id: 1 }, "pass");
      expect(generateTokensAndSendResponse).toHaveBeenCalledWith({ res, user: { id: 1 } });
    });

    it("should call next if credentials invalid", async () => {
      req.body = { username: "user", password: "wrong" };
      (authService.getUserByIdentity as jest.Mock).mockResolvedValue({ id: 1 });
      (validateCredentials as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid credentials");
      });

      await signin(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(generateTokensAndSendResponse).not.toHaveBeenCalled();
    });
  });

  describe("forgotPassword", () => {
    it("should send reset link if user exists", async () => {
      req.body = { email: "test@example.com" };
      (authService.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });
      (authService.createResetCode as jest.Mock).mockResolvedValue("reset123");

      await forgotPassword(req as Request, res as Response, next);

      expect(sendPasswordResetLink).toHaveBeenCalledWith({
        toEmail: "test@example.com",
        resetCode: "reset123",
      });
    });

    it("should respond with message if user not found", async () => {
      req.body = { email: "notfound@example.com" };
      (authService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await forgotPassword(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "A reset link has been sent to notfound@example.com",
      });
    });

    it("should call next with error if sending fails", async () => {
      req.body = { email: "test@example.com" };
      (authService.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });
      (authService.createResetCode as jest.Mock).mockResolvedValue("reset123");
      (sendPasswordResetLink as jest.Mock).mockImplementation(() => {
        throw new Error("Mail fail");
      });

      await forgotPassword(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("resetPassword", () => {
    it("should update password if reset code valid", async () => {
      req.body = { resetCode: "code123", password: "newpass" };
      const resetCodeRecord = { email: "test@example.com", destroy: jest.fn() };
      (authService.findValidResetCodeRecord as jest.Mock).mockResolvedValue(resetCodeRecord);

      await resetPassword(req as Request, res as Response, next);

      expect(authService.updatePassword).toHaveBeenCalledWith("test@example.com", "newpass");
      expect(resetCodeRecord.destroy).toHaveBeenCalled();
      expect(sendPasswordResetSuccessNotification).toHaveBeenCalledWith({
        toEmail: "test@example.com",
      });
      expect(res.json).toHaveBeenCalledWith({ message: "Password successfully updated" });
    });

    it("should return 400 if reset code invalid", async () => {
      req.body = { resetCode: "invalid", password: "newpass" };
      (authService.findValidResetCodeRecord as jest.Mock).mockResolvedValue(null);

      await resetPassword(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
    });

    it("should call next with error if notification fails", async () => {
      req.body = { resetCode: "good", password: "pass" };
      const resetCodeRecord = { email: "test@example.com", destroy: jest.fn() };
      (authService.findValidResetCodeRecord as jest.Mock).mockResolvedValue(resetCodeRecord);
      (sendPasswordResetSuccessNotification as jest.Mock).mockImplementation(() => {
        throw new Error("Notify fail");
      });

      await resetPassword(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("signout", () => {
    it("should clear cookies and return message", () => {
      signout(req as Request, res as Response);
      expect(res.clearCookie).toHaveBeenCalledWith("access_token");
      expect(res.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out" });
    });
  });
});
