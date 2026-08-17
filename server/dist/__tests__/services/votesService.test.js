"use strict";
describe("votesService", () => {
    let Votes;
    let votesService;
    beforeEach(async () => {
        Votes = {
            findAll: jest.fn(),
            create: jest.fn(),
            destroy: jest.fn(),
        };
        const { createVotesService } = require("../../services/votesService");
        votesService = createVotesService(Votes);
        jest.clearAllMocks();
    });
    describe("getAllVotes", () => {
        it("returns all votes as JSON", async () => {
            const mockVotes = [
                { toJSON: jest.fn().mockReturnValue({ id: 1, position: "president" }) },
                {
                    toJSON: jest
                        .fn()
                        .mockReturnValue({ id: 2, position: "vice president" }),
                },
            ];
            Votes.findAll.mockResolvedValue(mockVotes);
            const result = await votesService.getAllVotes();
            expect(Votes.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                { id: 1, position: "president" },
                { id: 2, position: "vice president" },
            ]);
        });
        it("returns an empty array if no votes exist", async () => {
            Votes.findAll.mockResolvedValue([]);
            const result = await votesService.getAllVotes();
            expect(Votes.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
        });
    });
    describe("castVote", () => {
        it("creates a vote with correct fields", async () => {
            const voteData = {
                userId: "user123",
                contestantId: "cont456",
                electionId: "ele232",
                position: "treasurer",
            };
            const mockCreatedVote = { id: 99, ...voteData };
            Votes.create.mockResolvedValue(mockCreatedVote);
            const result = await votesService.castVote(voteData);
            expect(Votes.create).toHaveBeenCalledWith({
                user_id: "user123",
                contestant_id: "cont456",
                position: "treasurer",
                election_id: "ele232",
            });
            expect(result).toBe(mockCreatedVote);
        });
    });
    describe("clearVotes", () => {
        it("deletes all votes using truncate", async () => {
            Votes.destroy.mockResolvedValue(undefined);
            await votesService.clearVotes();
            expect(Votes.destroy).toHaveBeenCalledWith({ truncate: true });
        });
    });
});
