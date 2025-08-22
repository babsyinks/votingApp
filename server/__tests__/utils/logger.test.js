const path = require("path");

jest.mock("fs");

jest.mock("winston", () => {
  const actual = jest.requireActual("winston");

  class ConsoleStub {
    constructor(opts) {
      Object.assign(this, opts, { __isStub: true });
    }
  }

  return {
    ...actual,
    transports: {
      ...actual.transports,
      Console: ConsoleStub,
    },
    createLogger: jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      transports: [],
    }),
    format: {
      ...actual.format,
      combine: jest.fn((...args) => args),
      timestamp: jest.fn(() => "timestamp()"),
      printf: jest.fn((fn) => fn),
      errors: jest.fn(() => "errors()"),
      json: jest.fn(() => "json()"),
    },
  };
});

jest.mock("winston-daily-rotate-file", () => {
  return jest.fn().mockImplementation(function DailyRotateFile(opts) {
    Object.assign(this, opts, { __isStub: true });
  });
});

describe("logger", () => {
  let fs;
  let winston;
  let DailyRotateFile;
  const logDirPath = path.join(__dirname, "..", "..", "logs");

  beforeEach(() => {
    jest.resetModules();
    fs = require("fs");
    winston = require("winston");
    DailyRotateFile = require("winston-daily-rotate-file");
  });

  it("should create the log directory if it does not exist", () => {
    fs.existsSync.mockReturnValue(false);

    require("../../utils/logger");

    expect(fs.existsSync).toHaveBeenCalledWith(logDirPath);
    expect(fs.mkdirSync).toHaveBeenCalledWith(logDirPath);
  });

  it("should not create the log directory if it exists", () => {
    fs.existsSync.mockReturnValue(true);

    require("../../utils/logger");

    expect(fs.existsSync).toHaveBeenCalledWith(logDirPath);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  it("should configure the logger with correct transports and format in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    fs.existsSync.mockReturnValue(true);

    require("../../utils/logger");

    expect(winston.createLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "info",
        format: ["timestamp()", "errors()", expect.any(Function)],
        transports: expect.arrayContaining([
          expect.any(winston.transports.Console),
          expect.any(DailyRotateFile),
          expect.any(DailyRotateFile),
        ]),
        exitOnError: false,
      }),
    );
    expect(DailyRotateFile).toHaveBeenCalledTimes(2);

    process.env.NODE_ENV = originalEnv;
  });

  it("should configure the logger with correct transports and format in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    fs.existsSync.mockReturnValue(true);

    require("../../utils/logger");

    expect(winston.createLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "info",
        format: ["timestamp()", "errors()", "json()"],
        transports: expect.arrayContaining([
          expect.any(winston.transports.Console),
          expect.any(DailyRotateFile),
          expect.any(DailyRotateFile),
        ]),
        exitOnError: false,
      }),
    );
    expect(DailyRotateFile).toHaveBeenCalledTimes(2);

    process.env.NODE_ENV = originalEnv;
  });

  it("should expose info and error methods", () => {
    fs.existsSync.mockReturnValue(true);

    const logger = require("../../utils/logger");
    logger.info("Test info");
    logger.error("Test error");

    expect(logger.info).toHaveBeenCalledWith("Test info");
    expect(logger.error).toHaveBeenCalledWith("Test error");
  });

  it("should use the custom devFormat in development", () => {
    const { devFormat } = require("../../utils/logger");

    const logMessage = devFormat({
      level: "info",
      message: "Test message",
      timestamp: "2025-08-11 10:00:00",
    });

    expect(logMessage).toBe("2025-08-11 10:00:00 [INFO] Test message");

    const error = new Error("Boom");
    const errorLog = devFormat({
      level: "error",
      message: error.message,
      stack: error.stack,
      timestamp: "2025-08-11 10:05:00",
    });

    expect(errorLog).toContain(error.stack.split("\n")[0]);
  });
});