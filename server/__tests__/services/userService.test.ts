const { Op } = require("sequelize");

jest.mock("../../helpers/authControllerHelpers", () => ({
  hashPassWord: jest.fn(),
}));

jest.mock("../../validators/authValidators", () => ({
  failIfUserDoesNotExist: jest.fn(),
  failIfPasswordWeak: jest.fn(),
}));

const { hashPassWord } = require("../../helpers/authControllerHelpers");
const { failIfUserDoesNotExist, failIfPasswordWeak } = require("../../validators/authValidators");

describe("userService", () => {
  let User;
  let userService;

  beforeEach(() => {
    User = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    userService = require("../../services/userService")(User);

    jest.clearAllMocks();
  });

  describe("getUserByEmail", () => {
    it("returns user as JSON when found", async () => {
      const mockJson = { id: 1, email: "test@example.com" };
      User.findOne.mockResolvedValue({ toJSON: jest.fn().mockReturnValue(mockJson) });

      const result = await userService.getUserByEmail("test@example.com");

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(result).toEqual(mockJson);
    });
  });

  describe("getUserByIdentity", () => {
    it("looks up by username when provided", async () => {
      const mockJson = { id: 1, username: "john" };
      User.findOne.mockResolvedValue({ toJSON: jest.fn().mockReturnValue(mockJson) });

      const result = await userService.getUserByIdentity({ username: "john" });

      expect(User.findOne).toHaveBeenCalledWith({ where: { username: "john" } });
      expect(result).toEqual(mockJson);
    });

    it("looks up by email when username is not provided", async () => {
      const mockJson = { id: 1, email: "john@example.com" };
      User.findOne.mockResolvedValue({ toJSON: jest.fn().mockReturnValue(mockJson) });

      const result = await userService.getUserByIdentity({ email: "john@example.com" });

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "john@example.com" } });
      expect(result).toEqual(mockJson);
    });

    it("returns raw model if raw=true", async () => {
      const mockUser = { id: 1, username: "rawUser" };
      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.getUserByIdentity({ username: "rawUser", raw: true });

      expect(result).toBe(mockUser);
    });
  });

  describe("findExistingUser", () => {
    it("returns user as JSON when found by username or email", async () => {
      const mockJson = { id: 2, username: "alice" };
      User.findOne.mockResolvedValue({ toJSON: jest.fn().mockReturnValue(mockJson) });

      const result = await userService.findExistingUser({
        email: "a@example.com",
        username: "alice",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        where: { [Op.or]: [{ email: "a@example.com" }, { username: "alice" }] },
      });
      expect(result).toEqual(mockJson);
    });
  });

  describe("createUser", () => {
    it("hashes password and creates non-admin user", async () => {
      hashPassWord.mockResolvedValue("hashed-pass");
      const userData = {
        email: "a@example.com",
        username: "userA",
        firstname: "User",
        lastname: "A",
        password: "plain-pass",
        isAdmin: false,
      };
      const mockCreatedUser = {
        ...userData,
        password: "hashed-pass",
      };
      User.create.mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(userData);

      expect(hashPassWord).toHaveBeenCalledWith("plain-pass");
      expect(User.create).toHaveBeenCalledWith({
        email: "a@example.com",
        username: "userA",
        firstname: "User",
        lastname: "A",
        password: "hashed-pass",
        isAdmin: false,
      });
      expect(result).toBe(mockCreatedUser);
    });

    it("hashes password and creates non-admin user even when a request is made to create user as admin", async () => {
      hashPassWord.mockResolvedValue("hashed-pass");
      const userData = {
        email: "a@example.com",
        username: "userA",
        firstname: "User",
        lastname: "A",
        password: "plain-pass",
        isAdmin: true,
      };
      const mockCreatedUser = {
        ...userData,
        password: "hashed-pass",
      };

      User.create.mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(userData);

      expect(hashPassWord).toHaveBeenCalledWith("plain-pass");
      expect(User.create).toHaveBeenCalledWith({
        email: "a@example.com",
        username: "userA",
        firstname: "User",
        lastname: "A",
        password: "hashed-pass",
        isAdmin: false,
      });
      expect(result).toBe(mockCreatedUser);
    });
  });

  describe("updatePassword", () => {
    it("updates password and saves user", async () => {
      const mockUser = {
        password: "old-pass",
        save: jest.fn(),
      };
      userService.getUserByIdentity = jest.fn().mockResolvedValue(mockUser);
      hashPassWord.mockResolvedValue("new-hash");

      await userService.updatePassword("john@example.com", "new-pass");

      expect(userService.getUserByIdentity).toHaveBeenCalledWith({
        email: "john@example.com",
        raw: true,
      });
      expect(failIfUserDoesNotExist).toHaveBeenCalledWith(mockUser);
      expect(failIfPasswordWeak).toHaveBeenCalledWith("new-pass");
      expect(hashPassWord).toHaveBeenCalledWith("new-pass");
      expect(mockUser.password).toBe("new-hash");
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
