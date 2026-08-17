"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const organization_1 = require("../../models/organization");
const election_1 = require("../../models/election");
const user_1 = require("../../models/user");
const userOrganization_1 = require("../../models/userOrganization");
describe("Organization Model", () => {
    let sequelize;
    beforeAll(() => {
        sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
    });
    afterAll(async () => {
        await sequelize.close();
    });
    test("initModel initializes correctly", () => {
        const initSpy = jest.spyOn(organization_1.Organization, "init");
        organization_1.Organization.initModel(sequelize);
        expect(initSpy).toHaveBeenCalledWith(expect.objectContaining({
            organization_id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
        }), expect.objectContaining({
            sequelize,
            modelName: "Organization",
            tableName: "organizations",
        }));
        initSpy.mockRestore();
    });
    test("toJSON returns model data via get()", () => {
        organization_1.Organization.initModel(sequelize);
        const org = organization_1.Organization.build({
            organization_id: "org-123",
            name: "OpenAI",
            description: "AI research lab",
        });
        const getSpy = jest.spyOn(org, "get");
        const json = org.toJSON();
        expect(getSpy).toHaveBeenCalled();
        expect(json).toMatchObject({
            organization_id: "org-123",
            name: "OpenAI",
            description: "AI research lab",
        });
        getSpy.mockRestore();
    });
    test("associate sets up associations", () => {
        organization_1.Organization.initModel(sequelize);
        election_1.Election.initModel(sequelize);
        user_1.User.initModel(sequelize);
        userOrganization_1.UserOrganization.initModel(sequelize);
        organization_1.Organization.associate({ Election: election_1.Election, User: user_1.User, UserOrganization: userOrganization_1.UserOrganization });
        const assoc = organization_1.Organization.associations;
        expect(assoc.Elections).toBeDefined(); // hasMany
        expect(assoc.Users).toBeDefined(); // belongsToMany
    });
});
