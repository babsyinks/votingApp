import type { UserAttributesWithRoles } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributesWithRoles;
    }
  }
}
