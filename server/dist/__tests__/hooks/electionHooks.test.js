"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const nanoid_1 = require("nanoid");
const logger_1 = __importDefault(require("../../utils/logger"));
const electionHooks_1 = __importDefault(require("../../hooks/electionHooks"));
jest.mock("slugify");
jest.mock("nanoid");
jest.mock("../../utils/logger");
describe("electionHooks", () => {
    const mockedSlugify = jest.mocked(slugify_1.default);
    const mockedNanoId = jest.mocked(nanoid_1.nanoid);
    let baseElectionConf;
    beforeEach(() => {
        jest.clearAllMocks();
        baseElectionConf = {
            name: "My Test Election",
            election_id: "eId",
            organization_id: "oId",
            mode: "live",
        };
        process.env.CLIENT_URL = "http://client.test";
    });
    describe("beforeCreate", () => {
        test("generates slug and short_link when not provided", async () => {
            const election = baseElectionConf;
            mockedSlugify.mockReturnValue("my-test-election");
            mockedNanoId.mockReturnValue("abcd1234");
            await electionHooks_1.default.beforeCreate(election);
            expect(mockedSlugify).toHaveBeenCalledWith("My Test Election", {
                lower: true,
                strict: true,
            });
            expect(mockedNanoId).toHaveBeenCalledWith(8);
            expect(election.slug).toBe("my-test-election");
            expect(election.short_link).toBe("http://client.test/abcd1234");
        });
        test("does not overwrite slug and short_link if already provided", async () => {
            const election = {
                ...baseElectionConf,
                slug: "custom-slug",
                short_link: "http://custom.link/xyz",
            };
            await electionHooks_1.default.beforeCreate(election);
            expect(mockedSlugify).not.toHaveBeenCalled();
            expect(mockedNanoId).not.toHaveBeenCalled();
            expect(election.slug).toBe("custom-slug");
            expect(election.short_link).toBe("http://custom.link/xyz");
        });
    });
    describe("afterCreate", () => {
        test("logs election slug and short_link", async () => {
            const election = {
                ...baseElectionConf,
                slug: "my-slug",
                short_link: "http://client.test/short",
            };
            await electionHooks_1.default.afterCreate(election);
            expect(logger_1.default.info).toHaveBeenCalledWith("Election created: my-slug, short link: http://client.test/short");
        });
    });
});
