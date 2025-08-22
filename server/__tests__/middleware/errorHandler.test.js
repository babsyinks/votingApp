const jwt = require("jsonwebtoken");
const { ValidationError } = require("sequelize");
const errorHandler = require("../../middleware/errorHandler");
const logger = require("../../utils/logger");

jest.mock("../../utils/logger", () => ({
  error: jest.fn(),
}));

describe("errorHandler middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.NODE_ENV = "development";
    jest.clearAllMocks();
  });

  it("handles generic error", () => {
    const err = new Error("Something went wrong");

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { message: "Something went wrong" },
        stack: err.stack,
      }),
    );
  });

  it("handles JWT TokenExpiredError", () => {
    const err = new jwt.TokenExpiredError("jwt expired", new Date());

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { message: "Token has expired." },
      }),
    );
  });

  it("handles JWT JsonWebTokenError", () => {
    const err = new jwt.JsonWebTokenError("invalid signature");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { message: "Invalid token." },
      }),
    );
  });

  it("handles Sequelize ValidationError", () => {
    const err = new ValidationError("Validation failed", [
      { message: "Name is required" },
      { message: "Email is invalid" },
    ]);

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { message: "Name is required; Email is invalid" },
      }),
    );
  });

  it("uses default message when err.message is falsy", () => {
    const err = new Error();
    err.message = "";

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { message: "An unexpected error occurred." },
        stack: err.stack,
      }),
    );
  });

  it("respects custom statusCode from error object", () => {
    const err = new Error("Custom error");
    err.statusCode = 418;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { message: "Custom error" },
      }),
    );
  });

  it("omits stack trace in production mode", () => {
    process.env.NODE_ENV = "production";
    const err = new Error("Prod error");

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      error: { message: "Prod error" },
    });
  });
});
