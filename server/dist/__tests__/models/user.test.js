"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_1 = require("../../models/user");
const organization_1 = require("../../models/organization");
const votes_1 = require("../../models/votes");
describe("User Model", () => {
    let sequelize;
    beforeAll(() => {
        sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
    });
    afterAll(async () => {
        await sequelize.close();
    });
    test("initModel initializes correctly", () => {
        const initSpy = jest.spyOn(user_1.User, "init");
        user_1.User.initModel(sequelize);
        const [attributes, options] = initSpy.mock.calls[0];
        // Check attribute keys
        expect(Object.keys(attributes)).toEqual(expect.arrayContaining([
            "user_id",
            "username",
            "password",
            "email",
            "firstname",
            "lastname",
            "isAdmin",
        ]));
        // Check model options
        expect(options.modelName).toBe("User");
        expect(options.tableName).toBe("users");
        expect(options.indexes).toEqual(expect.arrayContaining([
            expect.objectContaining({ fields: ["username"] }),
            expect.objectContaining({ fields: ["email"] }),
        ]));
        initSpy.mockRestore();
    });
    test("builds and stores values correctly", () => {
        user_1.User.initModel(sequelize);
        const user = user_1.User.build({
            user_id: "user-123",
            username: "john_doe",
            password: "hashedpassword",
            email: "john@example.com",
            firstname: "John",
            lastname: "Doe",
            isAdmin: true,
        });
        expect(user.user_id).toBe("user-123");
        expect(user.username).toBe("john_doe");
        expect(user.password).toBe("hashedpassword");
        expect(user.email).toBe("john@example.com");
        expect(user.firstname).toBe("John");
        expect(user.lastname).toBe("Doe");
        expect(user.isAdmin).toBe(true);
    });
    test("toJSON returns attributes with role field", () => {
        user_1.User.initModel(sequelize);
        const user = user_1.User.build({
            username: "jane_doe",
            password: "securepass",
            email: "jane@example.com",
            firstname: "Jane",
            lastname: "Doe",
            isAdmin: false,
        });
        const json = user.toJSON();
        expect(json).toHaveProperty("username", "jane_doe");
        expect(json).toHaveProperty("role", "user");
        const admin = user_1.User.build({
            username: "admin_user",
            password: "securepass",
            email: "admin@example.com",
            firstname: "Alice",
            lastname: "Admin",
            isAdmin: true,
        });
        expect(admin.toJSON().role).toBe("admin");
    });
    test("associate sets up relations", () => {
        user_1.User.initModel(sequelize);
        organization_1.Organization.initModel(sequelize);
        votes_1.Votes.initModel(sequelize);
        user_1.User.associate({
            Organization: organization_1.Organization,
            Votes: votes_1.Votes,
            UserOrganization: "user_organizations",
        });
        expect(user_1.User.associations.Organizations).toBeDefined();
        expect(user_1.User.associations.Votes).toBeDefined();
    });
});
