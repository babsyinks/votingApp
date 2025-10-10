import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { ValidationError } from "sequelize";

import logger from "../utils/logger";

interface StatusErrorWithMessage {
  statusCode: number;
  message: string;
}

interface CustomError extends Error {
  statusCode?: number;
  stack?: string;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const errorDetails: StatusErrorWithMessage = {
    statusCode: err.statusCode || 400,
    message: err.message || "An unexpected error occurred.",
  };

  handleJwtErrors(err, errorDetails);
  handleValidationErrors(err, errorDetails);

  const { statusCode, message } = errorDetails;

  logger.error(err);

  res.status(statusCode).json({
    error: { message },
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

function handleJwtErrors(
  err: unknown,
  errorDetails: StatusErrorWithMessage,
): void {
  if (err instanceof TokenExpiredError) {
    errorDetails.statusCode = 401;
    errorDetails.message = "Token has expired.";
  } else if (err instanceof JsonWebTokenError) {
    errorDetails.statusCode = 401;
    errorDetails.message = "Invalid token.";
  }
}

function handleValidationErrors(
  err: unknown,
  errorDetails: StatusErrorWithMessage,
): void {
  if (err instanceof ValidationError) {
    errorDetails.statusCode = 422;
    errorDetails.message = err.errors.map((e) => e.message).join("; ");
  }
}

export default errorHandler;
