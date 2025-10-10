import bcrypt from "bcryptjs";

import strongPasswordCriteria from "../config/strongPasswordConf";
import type { ValidUser } from "../helpers/types/validAuthUser";
import type { CodeAttributes, Code } from "../models/code";
import generateCustomError from "../utils/generateCustomError";

export type FieldsObject = Record<string, string | undefined | null>;

export const failIfEmpty = (fieldsObj: FieldsObject): void => {
  const keys = Object.keys(fieldsObj);
  const emptyField: string[] = [];
  if (
    keys.some((key) => {
      if (!fieldsObj[key]) emptyField.push(key);
      return !fieldsObj[key];
    })
  ) {
    generateCustomError(
      `${emptyField[0].toLowerCase()} field must be filled!`,
      400,
    );
  }
};

export const failIfUserExists = (user: ValidUser | null): void => {
  if (user) {
    generateCustomError("This User Exists Already!", 403);
  }
};

export const failIfUserDoesNotExist = (user: ValidUser | null): void => {
  if (!user) {
    generateCustomError("User not found", 400);
  }
};

export const failIfVerificationCodeIsNotValid = async (
  code: string,
  row: Code | CodeAttributes | null,
): Promise<void> => {
  if (!row || !(await bcrypt.compare(code, row.codeHash))) {
    generateCustomError("Invalid or expired code", 403);
  }
};

export const validateCredentials = async (
  user: ValidUser | null,
  password: string,
): Promise<void> => {
  let checkPassword = false;
  if (user) {
    checkPassword = await bcrypt.compare(password, user.password);
  }
  if (!user || !checkPassword) {
    generateCustomError("Wrong Username, Email or Password", 401);
  }
};

const _passwordStrengthStatus = (password: string): string | undefined => {
  for (const { message, test } of strongPasswordCriteria as {
    message: string;
    test: (pwd: string) => boolean;
  }[]) {
    if (!test(password)) return message;
  }
};

export const failIfPasswordWeak = (password: string): void => {
  const passwordStrengthStatusMessage = _passwordStrengthStatus(password);
  if (passwordStrengthStatusMessage) {
    generateCustomError(
      `Password must have ${passwordStrengthStatusMessage.toLowerCase()}`,
      400,
    );
  }
};
