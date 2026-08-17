"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const timer_1 = require("../../models/timer");
const election_1 = require("../../models/election");
describe("Timer Model", () => {
    let sequelize;
    beforeAll(() => {
        sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
    });
    afterAll(async () => {
        await sequelize.close();
    });
    test("initModel initializes correctly", () => {
        const initSpy = jest.spyOn(timer_1.Timer, "init");
        timer_1.Timer.initModel(sequelize);
        // Grab what init was called with
        const [attributes, options] = initSpy.mock.calls[0];
        // Check attribute keys
        expect(Object.keys(attributes)).toEqual(expect.arrayContaining(["timer_id", "election_id", "startDate", "endDate"]));
        // Check important model options
        expect(options.modelName).toBe("Timer");
        expect(options.tableName).toBe("timers");
        expect(options.indexes).toEqual(expect.arrayContaining([
            expect.objectContaining({
                unique: true,
                fields: ["election_id"],
                name: "uq_timer_per_election",
            }),
        ]));
        initSpy.mockRestore();
    });
    test("builds and stores values correctly", () => {
        timer_1.Timer.initModel(sequelize);
        const timer = timer_1.Timer.build({
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
        timer_1.Timer.initModel(sequelize);
        election_1.Election.initModel(sequelize);
        timer_1.Timer.associate({ Election: election_1.Election });
        const assoc = timer_1.Timer.associations;
        expect(assoc.Election).toBeDefined();
    });
});
