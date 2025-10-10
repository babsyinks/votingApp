import { Sequelize } from "sequelize";
import { Timer } from "../../models/timer";
import { Election } from "../../models/election";

describe("Timer Model", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("initModel initializes correctly", () => {
    const initSpy = jest.spyOn(Timer, "init");

    Timer.initModel(sequelize);

    // Grab what init was called with
    const [attributes, options] = initSpy.mock.calls[0];

    // Check attribute keys
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining(["timer_id", "election_id", "startDate", "endDate"])
    );

    // Check important model options
    expect(options.modelName).toBe("Timer");
    expect(options.tableName).toBe("timers");
    expect(options.indexes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          unique: true,
          fields: ["election_id"],
          name: "uq_timer_per_election",
        }),
      ])
    );

    initSpy.mockRestore();
  });

  test("builds and stores values correctly", () => {
    Timer.initModel(sequelize);

    const timer = Timer.build({
      timer_id: "timer-123",
      election_id: "election-1",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-02-01"),
    });

    expect(timer.timer_id).toBe("timer-123");
    expect(timer.election_id).toBe("election-1");
    expect(timer.startDate).toEqual(new Date("2025-01-01"));
    expect(timer.endDate).toEqual(new Date("2025-02-01"));
  });

  test("associate sets up belongsTo Election", () => {
    Timer.initModel(sequelize);
    Election.initModel(sequelize);

    Timer.associate({ Election } as any);

    const assoc = Timer.associations;
    expect(assoc.Election).toBeDefined();
  });
});
