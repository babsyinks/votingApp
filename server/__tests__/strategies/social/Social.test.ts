import bcrypt from "bcryptjs";
import type { Profile } from "passport";
import { v4 as uuidv4 } from "uuid";

import Social from "../../../strategies/social/Social";
import { User } from "../../../models";

jest.mock("bcryptjs");
jest.mock("uuid");
jest.mock("../../../models");

describe("Social Strategy", () => {
  let mockProfile: Profile;
  let mockUser: any;
  let mockDone: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = {
      user_id: "test-uuid",
      username: "testuser",
      email: "test@example.com",
      password: "hashed-password",
      firstname: "John",
      lastname: "Doe",
      isAdmin: false,
    };

    mockDone = jest.fn();

    (uuidv4 as jest.Mock).mockReturnValue("test-uuid");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
  });

  describe("authenticate", () => {
    it("should return existing user if found by email", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(User.create).not.toHaveBeenCalled();
      expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });

    it("should create new user if not found by email", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        emails: [{ value: "newuser@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "newuser@example.com" },
      });
      expect(User.create).toHaveBeenCalledWith({
        user_id: "test-uuid",
        username: "newuser@example.com",
        email: "newuser@example.com",
        password: "hashed-password",
        firstname: "John",
        lastname: "Doe",
        isAdmin: false,
      });
      expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });

    it("should handle errors and call done with error", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        emails: [{ value: "test@example.com" }],
      };

      const error = new Error("Database error");
      (User.findOne as jest.Mock).mockRejectedValue(error);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(mockDone).toHaveBeenCalledWith(error, null);
    });
  });

  describe("email extraction", () => {
    it("should extract email from profile emails array", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        emails: [{ value: "primary@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "primary@example.com" },
      });
    });

    it("should generate email from profile id and strategy if no email", async () => {
      mockProfile = {
        provider: "test",
        id: "123456",
        displayName: "John Doe",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "github", true);
      await social.authenticate(mockDone);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "123456@github.com" },
      });
    });
  });

  describe("username extraction", () => {
    it("should use profile username if available", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        username: "johndoe123",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "johndoe123",
        }),
      );
    });

    it("should use email as username if no profile username", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "test@example.com",
        }),
      );
    });
  });

  describe("name extraction - namesCombined=true", () => {
    it("should extract names from displayName when namesCombined is true", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "Jane Smith",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstname: "Jane",
          lastname: "Smith",
        }),
      );
    });

    it("should use strategy name and 'User' if displayName is missing", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "google", true);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstname: "Google",
          lastname: "User",
        }),
      );
    });

    it("should use 'User' as lastname if only first name in displayName", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "Madonna",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstname: "Madonna",
          lastname: "User",
        }),
      );
    });
  });

  describe("name extraction - namesCombined=false", () => {
    it("should extract names from profile.name when namesCombined is false", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        name: {
          familyName: "Johnson",
          givenName: "Robert",
        },
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", false);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstname: "Robert",
          lastname: "Johnson",
        }),
      );
    });

    it("should use strategy name if givenName is missing", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        name: {
          familyName: "Smith",
          givenName: "Alan",
        },
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "facebook", false);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          firstname: "Alan",
          isAdmin: false,
          lastname: "Smith",
          password: "hashed-password",
          user_id: "test-uuid",
          username: "test@example.com",
        }),
      );
    });

    it("should use 'User' as lastname if familyName is missing", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        name: {
          familyName: "Baker",
          givenName: "Alice",
        },
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", false);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          firstname: "Alice",
          isAdmin: false,
          lastname: "Baker",
          password: "hashed-password",
          user_id: "test-uuid",
          username: "test@example.com",
        }),
      );
    });

    it("should use strategy name and 'User' if name object is missing", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "twitter", false);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstname: "Twitter",
          lastname: "User",
        }),
      );
    });
  });

  describe("strategy capitalization", () => {
    it("should capitalize first letter of strategy name", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "linkedin", true);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstname: "Linkedin",
        }),
      );
    });
  });

  describe("default constructor values", () => {
    it("should use default strategy name 'Social' if not provided", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile);
      await social.authenticate(mockDone);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });
  });

  describe("password hashing", () => {
    it("should hash a UUID for password", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(bcrypt.hash).toHaveBeenCalledWith("test-uuid", 10);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: "hashed-password",
        }),
      );
    });
  });

  describe("user properties", () => {
    it("should create user with isAdmin set to false", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          isAdmin: false,
        }),
      );
    });

    it("should create user with generated UUID", async () => {
      mockProfile = {
        provider: "test",
        id: "123",
        displayName: "John Doe",
        emails: [{ value: "test@example.com" }],
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (uuidv4 as jest.Mock).mockReturnValue("unique-uuid-123");

      const social = new Social(mockProfile, "test", true);
      await social.authenticate(mockDone);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "unique-uuid-123",
        }),
      );
    });
  });
});
