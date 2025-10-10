import { Sequelize } from "sequelize";
import { Organization } from "../../models/organization";
import { Election } from "../../models/election";
import { User } from "../../models/user";
import { UserOrganization } from "../../models/userOrganization";

describe("Organization Model", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("initModel initializes correctly", () => {
    const initSpy = jest.spyOn(Organization, "init");

    Organization.initModel(sequelize);

    expect(initSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        organization_id: expect.any(Object),
        name: expect.any(Object),
        description: expect.any(Object),
      }),
      expect.objectContaining({
        sequelize,
        modelName: "Organization",
        tableName: "organizations",
      })
    );

    initSpy.mockRestore();
  });

  test("toJSON returns model data via get()", () => {
    Organization.initModel(sequelize);

    const org = Organization.build({
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
    Organization.initModel(sequelize);
    Election.initModel(sequelize);
    User.initModel(sequelize);
    UserOrganization.initModel(sequelize);

    Organization.associate({ Election, User, UserOrganization } as any);

    const assoc = Organization.associations;

    expect(assoc.Elections).toBeDefined(); // hasMany
    expect(assoc.Users).toBeDefined(); // belongsToMany
  });
});
