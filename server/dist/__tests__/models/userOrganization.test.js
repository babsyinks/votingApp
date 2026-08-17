"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const userOrganization_1 = require("../../models/userOrganization");
describe("UserOrganization Model", () => {
    let sequelize;
    beforeAll(async () => {
        sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
        userOrganization_1.UserOrganization.initModel(sequelize);
        await sequelize.sync();
    });
    afterAll(async () => {
        await sequelize.close();
    });
    test("initModel initializes correctly", () => {
        const initSpy = jest.spyOn(userOrganization_1.UserOrganization, "init");
        userOrganization_1.UserOrganization.initModel(sequelize);
        expect(initSpy).toHaveBeenCalledWith(expect.objectContaining({
            user_id: expect.any(Object),
            organization_id: expect.any(Object),
            role: expect.any(Object),
        }), expect.objectContaining({
            sequelize,
            modelName: "UserOrganization",
            tableName: "user_organizations",
            indexes: expect.arrayContaining([
                expect.objectContaining({
                    unique: true,
                    fields: ["user_id", "organization_id"],
                    name: "uq_user_org_membership",
                }),
            ]),
        }));
        initSpy.mockRestore();
    });
    test("builds and stores values correctly", async () => {
        const membership = await userOrganization_1.UserOrganization.create({
            user_id: "user-123",
            organization_id: "org-456",
            role: "election-manager",
        });
        const json = membership.toJSON();
        expect(json).toMatchObject({
            user_id: "user-123",
            organization_id: "org-456",
            role: "election-manager",
        });
    });
    test("default role is user when not provided", async () => {
        const membership = await userOrganization_1.UserOrganization.create({
            user_id: "user-789",
            organization_id: "org-111",
        });
        expect(membership.role).toBe("user");
    });
});
