const fs = require("fs");
const path = require("path");

const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const { combine, timestamp, printf, errors, json } = format;

const isProduction = process.env.NODE_ENV === "production";

const logDir = path.join(__dirname, "..", "logs");

const createLogDirIfNotExist = (logDir) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
};
createLogDirIfNotExist(logDir);

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    isProduction ? json() : devFormat,
  ),
  transports: [
    new transports.Console(),

    // Daily rotation for combined logs
    new DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true, // compress old logs
      maxSize: "10m", // rotate after 10MB
      maxFiles: "7d", // keep logs for 7 days
      level: "info",
    }),

    // Daily rotation for error logs
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "10d",
      level: "error",
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
