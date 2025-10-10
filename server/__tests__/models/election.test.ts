import { Sequelize } from "sequelize";
import { Election } from "../../models/election";
import { Contestants } from "../../models/contestants";
import { Votes } from "../../models/votes";
import { Timer } from "../../models/timer";
import { Organization } from "../../models/organization";
import electionHooks from "../../hooks/electionHooks";

describe("Election Model", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("initModel initializes correctly", () => {
    const initSpy = jest.spyOn(Election, "init");

    Election.initModel(sequelize);

    expect(initSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        election_id: expect.any(Object),
        organization_id: expect.any(Object),
        name: expect.any(Object),
        mode: expect.any(Object),
        slug: expect.any(Object),
        short_link: expect.any(Object),
      }),
      expect.objectContaining({
        sequelize,
        modelName: "Election",
        tableName: "elections",
        indexes: expect.arrayContaining([
          expect.objectContaining({ fields: ["organization_id"] }),
        ]),
        hooks: expect.objectContaining({
          beforeCreate: electionHooks.beforeCreate,
          afterCreate: electionHooks.afterCreate,
        }),
      }),
    );

    initSpy.mockRestore();
  });

  test("toJSON returns model data via get()", () => {
    Election.initModel(sequelize);

    const election = Election.build({
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
    Election.initModel(sequelize);
    Contestants.initModel(sequelize);
    Votes.initModel(sequelize);
    Timer.initModel(sequelize);
    Organization.initModel(sequelize);

    Election.associate({ Contestants, Votes, Timer, Organization } as any);

    const assoc = Election.associations;

    expect(assoc.Organization).toBeDefined(); // belongsTo
    expect(assoc.Contestants).toBeDefined(); // hasMany
    expect(assoc.Votes).toBeDefined(); // hasMany
    expect(assoc.Timer).toBeDefined(); // hasOne
  });
});
