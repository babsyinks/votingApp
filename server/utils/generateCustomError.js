function generateCustomError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

module.exports = generateCustomError;
