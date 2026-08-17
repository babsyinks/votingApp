"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const election_1 = require("../../models/election");
const contestants_1 = require("../../models/contestants");
const votes_1 = require("../../models/votes");
const timer_1 = require("../../models/timer");
const organization_1 = require("../../models/organization");
const electionHooks_1 = __importDefault(require("../../hooks/electionHooks"));
describe("Election Model", () => {
    let sequelize;
    beforeAll(() => {
        sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
    });
    afterAll(async () => {
        await sequelize.close();
    });
    test("initModel initializes correctly", () => {
        const initSpy = jest.spyOn(election_1.Election, "init");
        election_1.Election.initModel(sequelize);
        expect(initSpy).toHaveBeenCalledWith(expect.objectContaining({
            election_id: expect.any(Object),
            organization_id: expect.any(Object),
            name: expect.any(Object),
            mode: expect.any(Object),
            slug: expect.any(Object),
            short_link: expect.any(Object),
        }), expect.objectContaining({
            sequelize,
            modelName: "Election",
            tableName: "elections",
            indexes: expect.arrayContaining([
                expect.objectContaining({ fields: ["organization_id"] }),
            ]),
            hooks: expect.objectContaining({
                beforeCreate: electionHooks_1.default.beforeCreate,
                afterCreate: electionHooks_1.default.afterCreate,
            }),
        }));
        initSpy.mockRestore();
    });
    test("toJSON returns model data via get()", () => {
        election_1.Election.initModel(sequelize);
        const election = election_1.Election.build({
            election_id: "1111",
            organization_id: "2222",
            name: "Presidential Election",
            mode: "demo",
            slug: "presidential-2025",
            short_link: "pres-25",
        });
        const getSpy = jest.spyOn(election, "get");
        const json = election.toJSON();
        expect(getSpy).toHaveBeenCalled();
        expect(json).toMatchObject({
            election_id: "1111",
            organization_id: "2222",
            name: "Presidential Election",
            mode: "demo",
            slug: "presidential-2025",
            short_link: "pres-25",
        });
        getSpy.mockRestore();
    });
    test("associate sets up associations", () => {
        election_1.Election.initModel(sequelize);
        contestants_1.Contestants.initModel(sequelize);
        votes_1.Votes.initModel(sequelize);
        timer_1.Timer.initModel(sequelize);
        organization_1.Organization.initModel(sequelize);
        election_1.Election.associate({ Contestants: contestants_1.Contestants, Votes: votes_1.Votes, Timer: timer_1.Timer, Organization: organization_1.Organization });
        const assoc = election_1.Election.associations;
        expect(assoc.Organization).toBeDefined(); // belongsTo
        expect(assoc.Contestants).toBeDefined(); // hasMany
        expect(assoc.Votes).toBeDefined(); // hasMany
        expect(assoc.Timer).toBeDefined(); // hasOne
    });
});
