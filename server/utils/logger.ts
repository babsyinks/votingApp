import fs from "fs";
import path from "path";

import type { TransformableInfo } from "logform";
import { createLogger, format, transports, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, errors, json } = format;

const isProduction = process.env.NODE_ENV === "production";

const logDir = path.join(__dirname, "..", "logs");

const createLogDirIfNotExist = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};
createLogDirIfNotExist(logDir);

export const devFormat = printf(
  ({ level, message, timestamp, stack }: TransformableInfo) => {
    return `${timestamp as string} [${String(level).toUpperCase()}] ${stack || message}`;
  },
);

const logger: Logger = createLogger({
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
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "7d",
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

export default logger;
