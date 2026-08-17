"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const votes_1 = require("../../models/votes");
const user_1 = require("../../models/user");
const contestants_1 = require("../../models/contestants");
const election_1 = require("../../models/election");
describe("Votes Model", () => {
    let sequelize;
    beforeAll(async () => {
        sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
        votes_1.Votes.initModel(sequelize);
        user_1.User.initModel(sequelize);
        contestants_1.Contestants.initModel(sequelize);
        election_1.Election.initModel(sequelize);
        await sequelize.sync();
    });
    afterAll(async () => {
        await sequelize.close();
    });
    test("initModel initializes correctly", () => {
        const initSpy = jest.spyOn(votes_1.Votes, "init");
        votes_1.Votes.initModel(sequelize);
        expect(initSpy).toHaveBeenCalledWith(expect.objectContaining({
            vote_id: expect.any(Object),
            election_id: expect.any(Object),
            user_id: expect.any(Object),
            contestant_id: expect.any(Object),
            position: expect.any(Object),
        }), expect.objectContaining({
            sequelize,
            modelName: "Votes",
            tableName: "votes",
            indexes: expect.arrayContaining([
                expect.objectContaining({ fields: ["election_id"] }),
                expect.objectContaining({ fields: ["user_id"] }),
                expect.objectContaining({ fields: ["contestant_id"] }),
                expect.objectContaining({
                    unique: true,
                    fields: ["election_id", "user_id", "position"],
                    name: "uq_vote_once_per_position_per_election",
                }),
            ]),
        }));
        initSpy.mockRestore();
    });
    test("builds and stores values correctly", async () => {
        const vote = await votes_1.Votes.create({
            election_id: "election-1",
            user_id: "user-1",
            contestant_id: "contestant-1",
            position: "President",
        });
        expect(vote.election_id).toBe("election-1");
        expect(vote.user_id).toBe("user-1");
        expect(vote.contestant_id).toBe("contestant-1");
        expect(vote.position).toBe("President");
    });
    test("toJSON returns model data via get()", () => {
        const vote = votes_1.Votes.build({
            vote_id: "vote-123",
            election_id: "election-123",
            user_id: "user-123",
            contestant_id: "contestant-123",
            position: "Secretary",
        });
        const json = vote.toJSON();
        expect(json).toMatchObject({
            vote_id: "vote-123",
            election_id: "election-123",
            user_id: "user-123",
            contestant_id: "contestant-123",
            position: "Secretary",
        });
    });
    test("associate sets up relations", () => {
        const belongsToUser = jest.spyOn(votes_1.Votes, "belongsTo");
        const belongsToContestants = jest.spyOn(votes_1.Votes, "belongsTo");
        const belongsToElection = jest.spyOn(votes_1.Votes, "belongsTo");
        votes_1.Votes.associate({ User: user_1.User, Contestants: contestants_1.Contestants, Election: election_1.Election });
        expect(belongsToUser).toHaveBeenNthCalledWith(1, user_1.User, expect.objectContaining({ foreignKey: "user_id" }));
        expect(belongsToContestants).toHaveBeenNthCalledWith(2, contestants_1.Contestants, expect.objectContaining({ foreignKey: "contestant_id" }));
        expect(belongsToElection).toHaveBeenNthCalledWith(3, election_1.Election, expect.objectContaining({ foreignKey: "election_id" }));
    });
});
