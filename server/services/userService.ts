import { Op } from "sequelize";

import { hashPassWord } from "../helpers/authHelpers";
import { User } from "../models/user";
import type {
  UserAttributesWithRoles,
  UserCreationAttributes,
} from "../models/user";
import {
  failIfUserDoesNotExist,
  failIfPasswordWeak,
} from "../validators/authValidators";

export interface UserService {
  getUserByEmail(email: string): Promise<UserAttributesWithRoles | null>;
  getUserByIdentity(params: {
    email?: string;
    username?: string;
    raw?: boolean;
  }): Promise<User | UserAttributesWithRoles | null>;
  findExistingUser(params: {
    email?: string;
    username?: string;
  }): Promise<UserAttributesWithRoles | null>;
  createUser(params: UserCreationAttributes): Promise<User>;
  updatePassword(email: string, password: string): Promise<void>;
}

export const createUserService = (UserModel: typeof User): UserService => {
  return {
    /**
     * Find user by email.
     */
    async getUserByEmail(email) {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) return null;
      return user.toJSON();
    },

    /**
     * Find user by identity (username or email).
     */
    async getUserByIdentity({ email, username, raw = false }) {
      const identity = username || email;
      const key = username ? "username" : "email";

      if (!identity)
        throw new Error("Either email or username must be provided");

      const user = await UserModel.findOne({
        where: { [key]: identity },
      });

      if (!user) return null;
      return raw ? user : user.toJSON();
    },

    /**
     * Find user by username or email for signup duplicate check.
     */
    async findExistingUser({ email, username }) {
      const user = await UserModel.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });
      if (!user) return null;
      return user.toJSON();
    },

    /**
     * Create a new user with hashed password.
     */
    async createUser({ email, username, firstname, lastname, password }) {
      if (!password) throw new Error("Password is required");
      const hashedPassword = await hashPassWord(password);
      return UserModel.create({
        email,
        username,
        firstname,
        lastname,
        password: hashedPassword,
        isAdmin: false,
      });
    },

    /**
     * Update password for user.
     */
    async updatePassword(email, password) {
      const user = (await this.getUserByIdentity({
        email,
        raw: true,
      })) as User | null;

      failIfUserDoesNotExist(user);
      failIfPasswordWeak(password);

      if (!user) throw new Error("User not found");

      user.password = await hashPassWord(password);
      await user.save();
    },
  };
};

export default createUserService;
