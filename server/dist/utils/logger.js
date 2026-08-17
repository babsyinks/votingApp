"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devFormat = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, printf, errors, json } = winston_1.format;
const isProduction = process.env.NODE_ENV === "production";
const logDir = path_1.default.join(__dirname, "..", "logs");
const createLogDirIfNotExist = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
};
createLogDirIfNotExist(logDir);
exports.devFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${String(level).toUpperCase()}] ${stack || message}`;
});
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(timestamp(), errors({ stack: true }), isProduction ? json() : exports.devFormat),
    transports: [
        new winston_1.transports.Console(),
        // Daily rotation for combined logs
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logDir, "combined-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "7d",
            level: "info",
        }),
        // Daily rotation for error logs
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logDir, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "5m",
            maxFiles: "10d",
            level: "error",
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
