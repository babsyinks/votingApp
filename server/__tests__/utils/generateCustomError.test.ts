import generateCustomError, { CustomError } from "../../utils/generateCustomError";

describe("generateCustomError", () => {
  it("should throw an error with the given message and statusCode", () => {
    const message = "Something went wrong";
    const statusCode = 400;

    try {
      generateCustomError(message, statusCode);
    } catch (err) {
      if (err instanceof CustomError) {
        expect(err).toBeInstanceOf(CustomError);
        expect(err.message).toBe(message);
        expect(err.statusCode).toBe(statusCode);
      } else {
        throw new Error("Caught error was not a CustomError");
      }
    }
  });

  it("should work with different status codes", () => {
    const message = "Not Found";
    const statusCode = 404;

    try {
      generateCustomError(message, statusCode);
    } catch (err) {
      if (err instanceof CustomError) {
        expect(err.message).toBe(message);
        expect(err.statusCode).toBe(statusCode);
      } else {
        throw new Error("Caught error was not a CustomError");
      }
    }
  });
});
