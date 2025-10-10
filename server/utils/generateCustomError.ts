export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default function generateCustomError(
  message: string,
  statusCode: number,
): never {
  throw new CustomError(message, statusCode);
}
