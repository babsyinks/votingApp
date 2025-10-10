import { Sequelize } from "sequelize";
import { Votes } from "../../models/votes";
import { User } from "../../models/user";
import { Contestants } from "../../models/contestants";
import { Election } from "../../models/election";

describe("Votes Model", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });
    Votes.initModel(sequelize);
    User.initModel(sequelize);
    Contestants.initModel(sequelize);
    Election.initModel(sequelize);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("initModel initializes correctly", () => {
    const initSpy = jest.spyOn(Votes, "init");

    Votes.initModel(sequelize);

    expect(initSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        vote_id: expect.any(Object),
        election_id: expect.any(Object),
        user_id: expect.any(Object),
        contestant_id: expect.any(Object),
        position: expect.any(Object),
      }),
      expect.objectContaining({
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
      }),
    );

    initSpy.mockRestore();
  });

  test("builds and stores values correctly", async () => {
    const vote = await Votes.create({
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
    const vote = Votes.build({
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
    const belongsToUser = jest.spyOn(Votes, "belongsTo");
    const belongsToContestants = jest.spyOn(Votes, "belongsTo");
    const belongsToElection = jest.spyOn(Votes, "belongsTo");

    Votes.associate({ User, Contestants, Election } as any);

    expect(belongsToUser).toHaveBeenNthCalledWith(
      1,
      User,
      expect.objectContaining({ foreignKey: "user_id" }),
    );
    expect(belongsToContestants).toHaveBeenNthCalledWith(
      2,
      Contestants,
      expect.objectContaining({ foreignKey: "contestant_id" }),
    );
    expect(belongsToElection).toHaveBeenNthCalledWith(
      3,
      Election,
      expect.objectContaining({ foreignKey: "election_id" }),
    );
  });
});
