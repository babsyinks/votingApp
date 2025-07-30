const { Op } = require("sequelize");

const { hashPassWord } = require("../helpers/authControllerHelpers");
module.exports = (User) => {
  return {
    /**
     * @typedef {Object} User
     * @property {number} id
     * @property {string} user_id
     * @property {string} username
     * @property {string} password
     * @property {string} firstname
     * @property {string} lastname
     * @property {string} role
     * @property {string} email
     */

    /**
     * Find user by email.
     *
     * @param {string} email The email of the user to retrieve
     * @returns {Promise<User>}
     */
    async getUserByEmail(email) {
      const user = await User.findOne({ where: { email } });
      return user.toJSON();
    },

    /**
     * Find user by identity (username or email).
     *
     * @param {Object} param0
     * @param {string} [param0.email] the email of the user
     * @param {string} [param0.username] the username of the user
     * @param {boolean} [param0.raw] if raw is true, it retrieves the user in its raw model form.
     * If false, it retrieves the user in its refined JSON() form.
     * @returns {Promise<User>}
     */
    async getUserByIdentity({ email, username, raw = false }) {
      const identity = username || email;
      const key = username ? "username" : "email";
      const user = await User.findOne({ where: { [key]: identity } });
      return raw ? user : user.toJSON();
    },

    /**
     * Find user by username or email for signup duplicate check.
     *
     * @param {Object} param0
     * @param {string} [param0.email] the email of the user
     * @param {string} [param0.username] the username of the user
     * @returns {Promise<User>}
     */
    async findExistingUser({ email, username }) {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });
      return user.toJSON();
    },

    /**
     * Create a new user with hashed password.
     *
     * @param {Object} param0 Object having configuration for the user to create
     * @returns {Promise<User>}
     */
    async createUser({ email, username, firstname, lastname, password }) {
      const hashedPassword = await hashPassWord(password);
      return User.create({
        email,
        username,
        firstname,
        lastname,
        password: hashedPassword,
        role: "user",
      });
    },

    /**
     * Update password for user.
     *
     * @param {User} user The user whose password is to be update
     * @param {string} password The new password for the user
     * @returns {Promise<User>}
     */
    async updatePassword(user, password) {
      user.password = await hashPassWord(password);
      return user.save();
    },
  };
};
