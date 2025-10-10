import { Sequelize } from "sequelize";
import { User } from "../../models/user";
import { Organization } from "../../models/organization";
import { Votes } from "../../models/votes";

describe("User Model", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("initModel initializes correctly", () => {
    const initSpy = jest.spyOn(User, "init");

    User.initModel(sequelize);

    const [attributes, options] = initSpy.mock.calls[0];

    // Check attribute keys
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        "user_id",
        "username",
        "password",
        "email",
        "firstname",
        "lastname",
        "isAdmin",
      ])
    );

    // Check model options
    expect(options.modelName).toBe("User");
    expect(options.tableName).toBe("users");
    expect(options.indexes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fields: ["username"] }),
        expect.objectContaining({ fields: ["email"] }),
      ])
    );

    initSpy.mockRestore();
  });

  test("builds and stores values correctly", () => {
    User.initModel(sequelize);

    const user = User.build({
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
    User.initModel(sequelize);

    const user = User.build({
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

    const admin = User.build({
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
  User.initModel(sequelize);
  Organization.initModel(sequelize);
  Votes.initModel(sequelize);

  User.associate({
    Organization,
    Votes,
    UserOrganization: "user_organizations",
  } as any);

  expect(User.associations.Organizations).toBeDefined();
  expect(User.associations.Votes).toBeDefined();
});

});
