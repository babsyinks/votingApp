"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const xss_clean_1 = __importDefault(require("xss-clean"));
dotenv_1.default.config();
require("./config/passport");
const helmet_2 = __importDefault(require("./config/helmet"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const models_1 = require("./models");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./utils/logger"));
const port = Number(process.env.PORT) || 3001;
const app = (0, express_1.default)();
// Initialize Passport
app.use(passport_1.default.initialize());
// CORS configuration
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // https://demovotingapp.onrender.com/
    credentials: true,
}));
// Helmet security middleware
app.use(helmet_1.default.contentSecurityPolicy(helmet_2.default.contentSecurityPolicy));
// XSS protection
app.use((0, xss_clean_1.default)());
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Main API routes
app.use("/api/v1", routes_1.default);
// Error handling middleware
app.use(errorHandler_1.default);
// Global process error handlers
process.on("unhandledRejection", (err) => {
    logger_1.default.error("Unhandled Rejection:", err);
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    logger_1.default.error("Uncaught Exception:", err);
    process.exit(1);
});
// Start server
app.listen(port, async () => {
    try {
        await models_1.sequelize.authenticate();
        logger_1.default.info("Database connection successful");
        logger_1.default.info(`Server listening on port ${port}`);
    }
    catch (err) {
        logger_1.default.error("Failed to connect to database:", err);
        process.exit(1);
    }
});
exports.default = app;
