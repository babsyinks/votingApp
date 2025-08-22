"use strict";

const slugify = require("slugify");
const { nanoid } = require("nanoid");
const logger = require("../../utils/logger");
const electionHooks = require("../../hooks/electionHooks");

jest.mock("slugify");
jest.mock("nanoid");
jest.mock("../../utils/logger");

describe("electionHooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CLIENT_URL = "http://client.test";
  });

  describe("beforeCreate", () => {
    test("generates slug and short_link when not provided", async () => {
      const election = { name: "My Test Election" };

      slugify.mockReturnValue("my-test-election");
      nanoid.mockReturnValue("abcd1234");

      await electionHooks.beforeCreate(election, {});

      expect(slugify).toHaveBeenCalledWith("My Test Election", {
        lower: true,
        strict: true,
      });
      expect(nanoid).toHaveBeenCalledWith(8);

      expect(election.slug).toBe("my-test-election");
      expect(election.short_link).toBe("http://client.test/abcd1234");
    });

    test("does not overwrite slug and short_link if already provided", async () => {
      const election = {
        name: "My Election",
        slug: "custom-slug",
        short_link: "http://custom.link/xyz",
      };

      await electionHooks.beforeCreate(election, {});

      expect(slugify).not.toHaveBeenCalled();
      expect(nanoid).not.toHaveBeenCalled();

      expect(election.slug).toBe("custom-slug");
      expect(election.short_link).toBe("http://custom.link/xyz");
    });
  });

  describe("afterCreate", () => {
    test("logs election slug and short_link", async () => {
      const election = {
        slug: "my-slug",
        short_link: "http://client.test/short",
      };

      await electionHooks.afterCreate(election, {});

      expect(logger.info).toHaveBeenCalledWith(
        "Election created: my-slug, short link: http://client.test/short"
      );
    });
  });
});
