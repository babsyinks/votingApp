"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateCustomError_1 = __importDefault(require("../../utils/generateCustomError"));
const electionHelpers_1 = require("../../helpers/electionHelpers");
const electionService_1 = __importDefault(require("../../services/electionService"));
// Mock dependencies
jest.mock("../../utils/generateCustomError", () => jest.fn((message, status) => {
    throw new Error(`${status}: ${message}`);
}));
jest.mock("../../helpers/electionHelpers", () => ({
    userHasVoted: jest.fn(),
    getAllVotesForAPosition: jest.fn(),
    getVotesForAContestant: jest.fn(),
    getAllContestantsElectionDetails: jest.fn(),
}));
describe("electionService", () => {
    let electionService;
    let votesService;
    let contestantsService;
    let timerService;
    beforeEach(() => {
        votesService = {
            getAllVotes: jest.fn(),
            castVote: jest.fn(),
            clearVotes: jest.fn(),
        };
        contestantsService = {
            createContestant: jest.fn(),
            findContestantById: jest.fn(),
            getAllContestants: jest.fn(),
        };
        timerService = {
            clearTimer: jest.fn(),
        };
        jest.clearAllMocks();
        electionService = (0, electionService_1.default)({
            votesService,
            contestantsService,
            timerService,
        });
    });
    describe("createContestant", () => {
        it("calls contestantsService.createContestant with provided data", async () => {
            const contestantData = {
                election_id: "elID",
                surname: "Kane",
                firstname: "John",
                position: "president",
                manifesto: "change",
                picture: "pix.jpeg",
            };
            contestantsService.createContestant.mockResolvedValue(contestantData);
            const result = await electionService.createContestant(contestantData);
            expect(contestantsService.createContestant).toHaveBeenCalledWith(contestantData);
            expect(result).toEqual(contestantData);
        });
    });
    describe("findContestant", () => {
        it("calls contestantsService.findContestantById", async () => {
            const contestant = { id: 1 };
            contestantsService.findContestantById.mockResolvedValue(contestant);
            const result = await electionService.findContestant("123");
            expect(contestantsService.findContestantById).toHaveBeenCalledWith("123");
            expect(result).toEqual(contestant);
        });
    });
    describe("getElectionSummary", () => {
        it("returns empty array if no contestants", async () => {
            contestantsService.getAllContestants.mockResolvedValue([]);
            votesService.getAllVotes.mockResolvedValue([]);
            const result = await electionService.getElectionSummary();
            expect(result).toEqual([]);
        });
        it("returns grouped election details", async () => {
            const contestants = [{ id: 1 }];
            const votes = [{ id: 2 }];
            contestantsService.getAllContestants.mockResolvedValue(contestants);
            votesService.getAllVotes.mockResolvedValue(votes);
            const mockDetails = { grouped: true };
            electionHelpers_1.getAllContestantsElectionDetails.mockReturnValue(mockDetails);
            const result = await electionService.getElectionSummary();
            expect(electionHelpers_1.getAllContestantsElectionDetails).toHaveBeenCalledWith({
                contestants,
                votes,
            });
            expect(result).toBe(mockDetails);
        });
    });
    describe("castVote", () => {
        it("throws an error if user already voted", async () => {
            electionHelpers_1.userHasVoted.mockReturnValue(true);
            await expect(electionService.castVote("user1", "contestant1", "president", "ele1")).rejects.toThrow("403: User has already voted");
            expect(generateCustomError_1.default).toHaveBeenCalledWith("User has already voted", 403);
            expect(votesService.castVote).not.toHaveBeenCalled();
        });
        it("casts vote and returns position and contestant votes", async () => {
            const initialVotes = [{ id: 1 }];
            const finalVotes = [{ id: 1 }, { id: 2 }];
            votesService.getAllVotes
                .mockResolvedValueOnce(initialVotes) // before vote
                .mockResolvedValueOnce(finalVotes); // after vote
            electionHelpers_1.userHasVoted.mockReturnValue(false);
            electionHelpers_1.getAllVotesForAPosition.mockReturnValue("posVotes");
            electionHelpers_1.getVotesForAContestant.mockReturnValue("contestantVotes");
            const result = await electionService.castVote("user1", "contestant1", "president", "ele1");
            expect(votesService.castVote).toHaveBeenCalledWith({
                userId: "user1",
                contestantId: "contestant1",
                position: "president",
                electionId: "ele1",
            });
            expect(result).toEqual({
                positionVotes: "posVotes",
                contestantVotes: "contestantVotes",
            });
        });
    });
    describe("clearElectionData", () => {
        it("clears votes and timer", async () => {
            await electionService.clearElectionData();
            expect(votesService.clearVotes).toHaveBeenCalled();
            expect(timerService.clearTimer).toHaveBeenCalled();
        });
    });
});
