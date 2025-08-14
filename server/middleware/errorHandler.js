const jwt = require("jsonwebtoken");
const { ValidationError } = require("sequelize");

const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  const errorDetails = {
    statusCode: err.statusCode || 400,
    message: err.message || "An unexpected error occurred.",
  };

  _handleJwtErrors(err, errorDetails);
  _handleValidationErrors(err, errorDetails);

  const { statusCode, message } = errorDetails;

  logger.error(err);

  res.status(statusCode).json({
    error: { message },
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

const _handleJwtErrors = (err, errorDetails) => {
  if (err instanceof jwt.TokenExpiredError) {
    errorDetails.statusCode = 401;
    errorDetails.message = "Token has expired.";
  } else if (err instanceof jwt.JsonWebTokenError) {
    errorDetails.statusCode = 401;
    errorDetails.message = "Invalid token.";
  }
};

const _handleValidationErrors = (err, errorDetails) => {
  if (err instanceof ValidationError) {
    errorDetails.statusCode = 422;
    errorDetails.message = err.errors.map((e) => e.message).join("; ");
  }
};

module.exports = errorHandler;
