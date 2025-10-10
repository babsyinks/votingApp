import { Sequelize } from "sequelize";
import modelsIndex, { sequelize } from "../../models";

describe("Models Index", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("sequelize instance is defined", () => {
    expect(sequelize).toBeDefined();
    expect(sequelize).toBeInstanceOf(Sequelize);
  });

  test("all models are initialized", () => {
    const expectedModels = [
      "User",
      "Organization",
      "UserOrganization",
      "Election",
      "Contestants",
      "Timer",
      "Votes",
      "Code",
    ];
    expectedModels.forEach((modelName) => {
      expect((modelsIndex as any)[modelName]).toBeDefined();
    });
  });

  test("associations are set up without throwing", () => {
    expect(() => {
      Object.values(modelsIndex).forEach((model: any) => {
        if (model && typeof model.associate === "function") {
          model.associate(modelsIndex as any);
        }
      });
    }).not.toThrow();
  });
});
