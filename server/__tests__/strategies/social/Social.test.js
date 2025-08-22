const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../../../models");
const Social = require("../../../strategies/social/Social");

jest.mock("bcryptjs");
jest.mock("uuid", () => ({ v4: jest.fn() }));
jest.mock("../../../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Social", () => {
  let profile;
  let user;
  let done;

  beforeEach(() => {
    jest.clearAllMocks();

    profile = {
      id: "12345",
      username: "testuser",
      emails: [{ value: "test@example.com" }],
      displayName: "John Doe",
      name: { givenName: "John", familyName: "Doe" },
    };

    user = { id: "user-1", email: "test@example.com" };
    done = jest.fn();

    uuidv4.mockReturnValue("uuid-generated");
    bcrypt.hash.mockResolvedValue("hashed-password");
  });

  describe("authenticate", () => {
    it("returns existing user if found", async () => {
      User.findOne.mockResolvedValue(user);

      await new Social(profile).authenticate(done);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(User.create).not.toHaveBeenCalled();
      expect(done).toHaveBeenCalledWith(null, user);
    });

    it("creates new user if none found", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: "new-user" });

      await new Social(profile, "google").authenticate(done);

      expect(User.create).toHaveBeenCalledWith({
        user_id: "uuid-generated",
        username: "testuser",
        email: "test@example.com",
        password: "hashed-password",
        firstname: "John",
        lastname: "Doe",
        role: "user",
      });
      expect(done).toHaveBeenCalledWith(null, { id: "new-user" });
    });

    it("creates new user and sets username to email if username is not set on the Strategy", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: "new-user" });

      profile = {
        // no username on this profile
        id: "12345",
        emails: [{ value: "test@example.com" }],
        displayName: "John Doe",
        name: { givenName: "John", familyName: "Doe" },
      };

      await new Social(profile, "google").authenticate(done);

      expect(User.create).toHaveBeenCalledWith({
        user_id: "uuid-generated",
        username: "test@example.com", // email used as username
        email: "test@example.com",
        password: "hashed-password",
        firstname: "John",
        lastname: "Doe",
        role: "user",
      });
      expect(done).toHaveBeenCalledWith(null, { id: "new-user" });
    });

    it("handles errors", async () => {
      const error = new Error("DB error");
      User.findOne.mockRejectedValue(error);

      await new Social(profile, "google").authenticate(done);

      expect(done).toHaveBeenCalledWith(error, null);
    });
  });

  describe("__extractEmail", () => {
    it("uses profile email if present", () => {
      expect(new Social(profile, "google").__extractEmail()).toBe("test@example.com");
    });

    it("falls back to id@strategy.com", () => {
      delete profile.emails;
      expect(new Social(profile, "facebook").__extractEmail()).toBe("12345@facebook.com");
    });
  });

  describe("__extractFirstAndLastNames", () => {
    it("uses displayName if namesCombined=true", () => {
      expect(new Social(profile, "google", true).__extractFirstAndLastNames()).toEqual({
        firstname: "John",
        lastname: "Doe",
      });
    });

    it("uses name object if namesCombined=false", () => {
      expect(new Social(profile, "google", false).__extractFirstAndLastNames()).toEqual({
        firstname: "John",
        lastname: "Doe",
      });
    });
  });

  describe("name fallbacks", () => {
    it("falls back to capitalized strategy/User when displayName missing", () => {
      profile.displayName = null;
      expect(new Social(profile, "google", true).__extractFirstAndLastNames()).toEqual({
        firstname: "Google",
        lastname: "User",
      });
    });

    it("falls back to capitalized strategy/User when givenName missing", () => {
      profile.name = {};
      expect(new Social(profile, "linkedin", false).__extractFirstAndLastNames()).toEqual({
        firstname: "Linkedin",
        lastname: "User",
      });
    });
  });

  describe("__capitalizeFirstLetterOfStrategy", () => {
    it("capitalizes correctly", () => {
      expect(new Social(profile, "facebook").__capitalizeFirstLetterOfStrategy()).toBe("Facebook");
    });
  });
});
