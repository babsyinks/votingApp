import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models";
import type { UserAttributesWithRoles } from "../models/user";

// Define a type for the decoded JWT payload
interface AuthTokenPayload extends JwtPayload {
  user: {
    user_id: string;
  };
}

/**
 * Middleware to check if the user is authenticated.
 */
const checkAuthenticationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await _handleAuth("authentication")(req, res, next);
};

/**
 * Middleware to check if the user is authorized (admin only).
 */
const checkAuthorizationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await _handleAuth("authorization")(req, res, next);
};

/**
 * Shared handler for both authentication and authorization checks.
 */
function _handleAuth(statusType: "authentication" | "authorization") {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const statusObj = _getAuthStatusObject(statusType);

    try {
      const token = req.cookies.access_token;
      const user = await _retrieveUser(token);
      if (!token || !user) {
        res
          .status(statusObj.statusCode)
          .json({ [statusObj.type]: false, error: statusObj.message });
        return;
      }

      if (statusType === "authorization") {
        const denied = _denyAuthorizationIfNotAdmin({ res, user });
        if (denied) return;
      }
      req.user = user;
      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      res.status(401).json({ [statusObj.type]: false, error: message });
    }
  };
}

/**
 * Restricts access if user is not an admin.
 */
function _denyAuthorizationIfNotAdmin({
  res,
  user,
}: {
  res: Response;
  user: UserAttributesWithRoles;
}) {
  if (user.role !== "admin") {
    res.status(403).json({
      authorized: false,
      error: `${user.username} is unauthorized to access this resource.`,
    });
    return true;
  }
  return false;
}

/**
 * Returns appropriate auth error message depending on type.
 */
function _getAuthStatusObject(statusType: "authentication" | "authorization") {
  const authObj = {
    authentication: {
      statusCode: 401,
      message: "authentication failed!",
      type: "authenticated",
    },
    authorization: {
      statusCode: 403,
      message: "authorization denied!",
      type: "authorized",
    },
  };
  return authObj[statusType];
}

/**
 * Retrieves user from the access token.
 */
async function _retrieveUser(
  token?: string,
): Promise<UserAttributesWithRoles | null> {
  if (!token) return null;
  const authObj = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
  ) as AuthTokenPayload;

  const { user_id } = authObj.user;
  if (!user_id) return null;

  const user = await User.findOne({ where: { user_id } });
  return user ? user.toJSON() : null;
}

export { checkAuthenticationStatus, checkAuthorizationStatus };
