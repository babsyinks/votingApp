import { Op } from "sequelize";
import { createUserService } from "../../services/userService";
import { hashPassWord } from "../../helpers/authControllerHelpers";
import {
  failIfUserDoesNotExist,
  failIfPasswordWeak,
} from "../../validators/authValidators";

jest.mock("../../helpers/authControllerHelpers", () => ({
  hashPassWord: jest.fn(),
}));

jest.mock("../../validators/authValidators", () => ({
  failIfUserDoesNotExist: jest.fn(),
  failIfPasswordWeak: jest.fn(),
}));

describe("userService", () => {
  let User: any;
  let userService: ReturnType<typeof createUserService>;

  beforeEach(() => {
    User = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    userService = createUserService(User);
    jest.clearAllMocks();
  });

  describe("getUserByEmail", () => {
    it("returns user as JSON when found", async () => {
      const mockJson = { id: 1, email: "test@example.com" };
      User.findOne.mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockJson),
      });

      const result = await userService.getUserByEmail("test@example.com");

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(result).toEqual(mockJson);
    });

    it("returns undefined when user not found", async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userService.getUserByEmail("none@example.com");
      expect(result).toBeNull();
    });
  });

  describe("getUserByIdentity", () => {
    it("looks up by username when provided", async () => {
      const mockJson = { id: 1, username: "john" };
      User.findOne.mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockJson),
      });

      const result = await userService.getUserByIdentity({ username: "john" });

      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "john" },
      });
      expect(result).toEqual(mockJson);
    });

    it("looks up by email when username is not provided", async () => {
      const mockJson = { id: 1, email: "john@example.com" };
      User.findOne.mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockJson),
      });

      const result = await userService.getUserByIdentity({
        email: "john@example.com",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(result).toEqual(mockJson);
    });

    it("returns raw model if raw=true", async () => {
      const mockUser = { id: 1, username: "rawUser" };
      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.getUserByIdentity({
        username: "rawUser",
        raw: true,
      });

      expect(result).toBe(mockUser);
    });

    it("returns undefined when user not found (email lookup)", async () => {
      // make findOne return null to simulate "not found"
      User.findOne.mockResolvedValue(null);

      const result = await userService.getUserByIdentity({
        email: "missing@example.com",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "missing@example.com" },
      });
      expect(result).toBeNull();
    });

    it("throws error if neither email nor username provided", async () => {
      await expect(userService.getUserByIdentity({} as any)).rejects.toThrow(
        "Either email or username must be provided",
      );
    });
  });

  describe("findExistingUser", () => {
    it("returns user as JSON when found by username or email", async () => {
      const mockJson = { id: 2, username: "alice" };
      User.findOne.mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockJson),
      });

      const result = await userService.findExistingUser({
        email: "a@example.com",
        username: "alice",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        where: { [Op.or]: [{ email: "a@example.com" }, { username: "alice" }] },
      });
      expect(result).toEqual(mockJson);
    });

    it("returns undefined when not found", async () => {
      User.findOne.mockResolvedValue(null);
      const result = await userService.findExistingUser({
        email: "missing@example.com",
        username: "none",
      });
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("hashes password and creates non-admin user", async () => {
      (hashPassWord as jest.Mock).mockResolvedValue("hashed-pass");
      const userData = {
        email: "a@example.com",
        username: "userA",
        firstname: "User",
        lastname: "A",
        password: "plain-pass",
      };
      const mockCreatedUser = { ...userData, password: "hashed-pass" };
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

    it("throws error when password missing", async () => {
      await expect(
        userService.createUser({
          email: "no-pass@example.com",
          username: "nopass",
          firstname: "No",
          lastname: "Pass",
        } as any),
      ).rejects.toThrow("Password is required");
    });
  });

  describe("updatePassword", () => {
    it("updates password and saves user", async () => {
      const mockUser = { password: "old-pass", save: jest.fn() };
      userService.getUserByIdentity = jest.fn().mockResolvedValue(mockUser);
      (hashPassWord as jest.Mock).mockResolvedValue("new-hash");

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

    it("throws error when user not found", async () => {
      userService.getUserByIdentity = jest.fn().mockResolvedValue(undefined);
      await expect(
        userService.updatePassword("missing@example.com", "new-pass"),
      ).rejects.toThrow("User not found");
    });
  });
});
