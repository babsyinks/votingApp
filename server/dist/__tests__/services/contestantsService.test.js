"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contestantsService_1 = require("../../services/contestantsService");
describe("contestantsService", () => {
    let Contestants;
    let contestantsService;
    beforeEach(() => {
        Contestants = {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
        };
        contestantsService = (0, contestantsService_1.createContestantsService)(Contestants);
        jest.clearAllMocks();
    });
    describe("createContestant", () => {
        it("should create a contestant and return the result", async () => {
            const data = {
                firstname: "John",
                surname: "Doe",
                election_id: "e1",
                position: "President",
                manifesto: "Peace and Unity",
                picture: "image.jpg",
            };
            const mockResult = { contestant_id: "c1", ...data };
            Contestants.create.mockResolvedValue(mockResult);
            const result = await contestantsService.createContestant(data);
            expect(Contestants.create).toHaveBeenCalledWith(data);
            expect(result).toEqual(mockResult);
        });
    });
    describe("findContestantById", () => {
        it("should return contestant as JSON if found", async () => {
            const mockData = { contestant_id: "c1", firstname: "John" };
            const mockRecord = { toJSON: jest.fn().mockReturnValue(mockData) };
            Contestants.findOne.mockResolvedValue(mockRecord);
            const result = await contestantsService.findContestantById("c1");
            expect(Contestants.findOne).toHaveBeenCalledWith({
                where: { contestant_id: "c1" },
            });
            expect(mockRecord.toJSON).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockData);
        });
        it("should return undefined if contestant not found", async () => {
            Contestants.findOne.mockResolvedValue(null);
            const result = await contestantsService.findContestantById("unknown");
            expect(result).toBeUndefined();
        });
    });
    describe("getAllContestants", () => {
        it("should return an array of contestants as JSON", async () => {
            const mockDataArray = [
                { toJSON: jest.fn().mockReturnValue({ id: 1, name: "John" }) },
                { toJSON: jest.fn().mockReturnValue({ id: 2, name: "Jane" }) },
            ];
            Contestants.findAll.mockResolvedValue(mockDataArray);
            const result = await contestantsService.getAllContestants();
            expect(Contestants.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                { id: 1, name: "John" },
                { id: 2, name: "Jane" },
            ]);
        });
        it("should handle empty list", async () => {
            Contestants.findAll.mockResolvedValue([]);
            const result = await contestantsService.getAllContestants();
            expect(result).toEqual([]);
        });
    });
});
