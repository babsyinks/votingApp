import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import helmet from "helmet";
import passport from "passport";
import xss from "xss-clean";

import "./config/passport";
import helmetConfig from "./config/helmet";
import errorHandler from "./middleware/errorHandler";
import { sequelize } from "./models";
import routes from "./routes";
import logger from "./utils/logger";

dotenv.config();

const port = Number(process.env.PORT) || 3001;
const app: Application = express();

// Initialize Passport
app.use(passport.initialize());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // https://demovotingapp.onrender.com/
    credentials: true,
  }),
);

// Helmet security middleware
app.use(helmet.contentSecurityPolicy(helmetConfig.contentSecurityPolicy));

// XSS protection
app.use(xss());

// Cookie parser
app.use(cookieParser());

// Main API routes
app.use("/api/v1", routes);

// Error handling middleware
app.use(errorHandler);

// Global process error handlers
process.on("unhandledRejection", (err: unknown) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err: unknown) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start server
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection successful");
    logger.info(`Server listening on port ${port}`);
  } catch (err) {
    logger.error("Failed to connect to database:", err);
    process.exit(1);
  }
});

export default app;
