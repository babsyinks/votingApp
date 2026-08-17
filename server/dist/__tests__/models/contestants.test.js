"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const contestants_1 = require("../../models/contestants");
// Minimal fake Election and Votes models to test associations
class Election extends sequelize_1.Model {
}
class Votes extends sequelize_1.Model {
}
describe("Contestants Model", () => {
    let sequelize;
    beforeAll(() => {
        sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
        Election.init({ election_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true } }, { sequelize, modelName: "Election" });
        Votes.init({ vote_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true } }, { sequelize, modelName: "Votes" });
        contestants_1.Contestants.initModel(sequelize);
    });
    afterAll(async () => {
        await sequelize.close();
    });
    test("initModel initializes correctly", () => {
        const attributes = contestants_1.Contestants.getAttributes();
        expect(attributes.contestant_id).toBeDefined();
        expect(attributes.election_id).toBeDefined();
        expect(attributes.surname).toBeDefined();
        expect(attributes.firstname).toBeDefined();
        expect(attributes.position).toBeDefined();
        expect(attributes.manifesto).toBeDefined();
        expect(attributes.picture).toBeDefined();
        expect(contestants_1.Contestants.tableName).toBe("contestants");
        expect(contestants_1.Contestants.name).toBe("Contestants");
    });
    test("toJSON returns model data via get()", () => {
        const contestant = contestants_1.Contestants.build({
            election_id: "e1",
            surname: "Doe",
            firstname: "John",
            position: "President",
            manifesto: "Change everything",
            picture: "pic.png",
        });
        const json = contestant.toJSON();
        expect(json).toMatchObject({
            election_id: "e1",
            surname: "Doe",
            firstname: "John",
            position: "President",
            manifesto: "Change everything",
            picture: "pic.png",
        });
    });
    test("associate sets up associations", () => {
        contestants_1.Contestants.associate({ Election, Votes });
        const assoc = contestants_1.Contestants.associations;
        expect(assoc.Election).toBeDefined(); // belongsTo
        expect(assoc.Votes).toBeDefined(); // hasMany
    });
});
