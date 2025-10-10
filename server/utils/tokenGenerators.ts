import jwt, { SignOptions, Secret } from "jsonwebtoken";

import type { ValidUser } from "../helpers/types/validAuthUser";

interface GenerateTokenOptions {
  user: ValidUser;
  secret: "ACCESS_TOKEN_SECRET" | "REFRESH_TOKEN_SECRET";
  expiresIn: string | number;
}

export function generateAccessToken(user: ValidUser): string {
  return generateToken({
    user,
    secret: "ACCESS_TOKEN_SECRET",
    expiresIn: "1d",
  });
}

export function generateRefreshToken(user: ValidUser): string {
  return generateToken({
    user,
    secret: "REFRESH_TOKEN_SECRET",
    expiresIn: "7d",
  });
}

function generateToken({
  user,
  secret,
  expiresIn,
}: GenerateTokenOptions): string {
  const secretKey = process.env[secret];

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(
    { user: { user_id: user.user_id } },
    secretKey as Secret,
    options,
  );
}
