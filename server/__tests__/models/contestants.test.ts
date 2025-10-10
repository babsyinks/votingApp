import { Sequelize, DataTypes, Model } from "sequelize";
import { Contestants } from "../../models/contestants";

// Minimal fake Election and Votes models to test associations
class Election extends Model {}
class Votes extends Model {}

describe("Contestants Model", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });

    Election.init(
      { election_id: { type: DataTypes.UUID, primaryKey: true } },
      { sequelize, modelName: "Election" }
    );
    Votes.init(
      { vote_id: { type: DataTypes.UUID, primaryKey: true } },
      { sequelize, modelName: "Votes" }
    );

    Contestants.initModel(sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

test("initModel initializes correctly", () => {
  const attributes = Contestants.getAttributes();

  expect(attributes.contestant_id).toBeDefined();
  expect(attributes.election_id).toBeDefined();
  expect(attributes.surname).toBeDefined();
  expect(attributes.firstname).toBeDefined();
  expect(attributes.position).toBeDefined();
  expect(attributes.manifesto).toBeDefined();
  expect(attributes.picture).toBeDefined();

  expect(Contestants.tableName).toBe("contestants");
  expect(Contestants.name).toBe("Contestants");
});


  test("toJSON returns model data via get()", () => {
    const contestant = Contestants.build({
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
    Contestants.associate({ Election, Votes } as any);

    const assoc = Contestants.associations;

    expect(assoc.Election).toBeDefined(); // belongsTo
    expect(assoc.Votes).toBeDefined();    // hasMany
  });
});
