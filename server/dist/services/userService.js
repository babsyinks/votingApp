"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserService = void 0;
const sequelize_1 = require("sequelize");
const authHelpers_1 = require("../helpers/authHelpers");
const authValidators_1 = require("../validators/authValidators");
const createUserService = (UserModel) => {
    return {
        /**
         * Find user by email.
         */
        async getUserByEmail(email) {
            const user = await UserModel.findOne({ where: { email } });
            if (!user)
                return null;
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
            if (!user)
                return null;
            return raw ? user : user.toJSON();
        },
        /**
         * Find user by username or email for signup duplicate check.
         */
        async findExistingUser({ email, username }) {
            const user = await UserModel.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ email }, { username }],
                },
            });
            if (!user)
                return null;
            return user.toJSON();
        },
        /**
         * Create a new user with hashed password.
         */
        async createUser({ email, username, firstname, lastname, password }) {
            if (!password)
                throw new Error("Password is required");
            const hashedPassword = await (0, authHelpers_1.hashPassWord)(password);
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
            }));
            (0, authValidators_1.failIfUserDoesNotExist)(user);
            (0, authValidators_1.failIfPasswordWeak)(password);
            if (!user)
                throw new Error("User not found");
            user.password = await (0, authHelpers_1.hashPassWord)(password);
            await user.save();
        },
    };
};
exports.createUserService = createUserService;
exports.default = exports.createUserService;
