const generateCustomError = require("../../utils/generateCustomError");

describe("generateCustomError", () => {
  it("should throw an error with the given message and statusCode", () => {
    const message = "Something went wrong";
    const statusCode = 400;

    try {
      generateCustomError(message, statusCode);
      // If no error is thrown, fail the test
      throw new Error("Expected generateCustomError to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe(message);
      expect(err.statusCode).toBe(statusCode);
    }
  });

  it("should work with different status codes", () => {
    const message = "Not Found";
    const statusCode = 404;

    try {
      generateCustomError(message, statusCode);
    } catch (err) {
      expect(err.message).toBe(message);
      expect(err.statusCode).toBe(statusCode);
    }
  });
});
