"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electionHelpers_1 = require("../../helpers/electionHelpers");
describe("electionControllerHelpers", () => {
    let votes;
    let contestants;
    beforeEach(() => {
        votes = [
            {
                vote_id: "v1",
                user_id: "u1",
                election_id: "e1",
                contestant_id: "c1",
                position: "president",
            },
            {
                vote_id: "v2",
                user_id: "u2",
                election_id: "e1",
                contestant_id: "c1",
                position: "president",
            },
            {
                vote_id: "v3",
                user_id: "u3",
                election_id: "e1",
                contestant_id: "c2",
                position: "vice president",
            },
            {
                vote_id: "v4",
                user_id: "u4",
                election_id: "e1",
                contestant_id: "c3",
                position: "vice president",
            },
        ];
        contestants = [
            {
                contestant_id: "c1",
                election_id: "e1",
                surname: "Doe",
                firstname: "John",
                position: "president",
                manifesto: "Better future",
                picture: "john.jpg",
            },
            {
                contestant_id: "c2",
                election_id: "e1",
                surname: "Smith",
                firstname: "Jane",
                position: "vice president",
                manifesto: "Unity and progress",
                picture: "jane.jpg",
            },
            {
                contestant_id: "c3",
                election_id: "e1",
                surname: "Brown",
                firstname: "Bob",
                position: "vice president",
                manifesto: "Change now",
                picture: "bob.jpg",
            },
        ];
    });
    describe("getAllVotesForAPosition", () => {
        it("should return all user_ids for given position", () => {
            const result = (0, electionHelpers_1.getAllVotesForAPosition)({
                votes,
                contestant: contestants[0],
                position: "president",
            });
            expect(result).toEqual(["u1", "u2"]);
        });
        it("should fall back to contestant.position if position param is not given", () => {
            const result = (0, electionHelpers_1.getAllVotesForAPosition)({
                votes,
                contestant: contestants[1], // vice president
            });
            expect(result).toEqual(["u3", "u4"]);
        });
        it("should return empty array if no votes for position", () => {
            const result = (0, electionHelpers_1.getAllVotesForAPosition)({
                votes,
                contestant: contestants[0],
                position: "non-existent position",
            });
            expect(result).toEqual([]);
        });
        it("should throw an error if both position and contestant are undefined", () => {
            expect(() => (0, electionHelpers_1.getAllVotesForAPosition)({
                votes,
            })).toThrow("value set to filter position shouldn't be undefined");
        });
    });
    describe("getVotesForAContestant", () => {
        it("should return all user_ids for given contestant", () => {
            const result = (0, electionHelpers_1.getVotesForAContestant)({
                votes,
                contestant: contestants[0],
            });
            expect(result).toEqual(["u1", "u2"]);
        });
        it("should use contestantId param if provided", () => {
            const result = (0, electionHelpers_1.getVotesForAContestant)({
                votes,
                contestant: contestants[0],
                contestantId: "c2",
            });
            expect(result).toEqual(["u3"]);
        });
        it("should return empty array if no votes for contestant", () => {
            const result = (0, electionHelpers_1.getVotesForAContestant)({
                votes,
                contestant: contestants[0],
                contestantId: "non-existent",
            });
            expect(result).toEqual([]);
        });
        it("should throw an error if both contestant and contestantId are undefined", () => {
            expect(() => (0, electionHelpers_1.getVotesForAContestant)({
                votes,
            })).toThrow("value set to filter contestant_id shouldn't be undefined");
        });
    });
    describe("getAllContestantsElectionDetails", () => {
        it("should group contestants by position rank and attach votes", () => {
            const result = (0, electionHelpers_1.getAllContestantsElectionDetails)({ contestants, votes });
            expect(result).toHaveLength(2); // president, vice president
            expect(result[0].position).toBe("president");
            expect(result[0].positionVotes).toEqual(["u1", "u2"]);
            expect(result[0].contestants[0].votes).toEqual(["u1", "u2"]);
            expect(result[1].position).toBe("vice president");
            expect(result[1].positionVotes).toEqual(["u3", "u4"]);
            expect(result[1].contestants).toHaveLength(2);
            expect(result[1].contestants.find((c) => c.contestant_id === "c3")?.votes).toEqual(["u4"]);
        });
        it("should ignore null entries in position ranks", () => {
            const contestantsSubset = [contestants[0]];
            const result = (0, electionHelpers_1.getAllContestantsElectionDetails)({
                contestants: contestantsSubset,
                votes,
            });
            expect(result).toHaveLength(1);
            expect(result[0].position).toBe("president");
        });
        it("should add the second contestant in same position", () => {
            const contestants = [
                {
                    contestant_id: "c1",
                    election_id: "e1",
                    surname: "Doe",
                    firstname: "John",
                    position: "president",
                    manifesto: "Manifesto 1",
                    picture: "pic1.jpg",
                },
                {
                    contestant_id: "c2", // different ID but same position
                    election_id: "e1",
                    surname: "Smith",
                    firstname: "Jane",
                    position: "president",
                    manifesto: "Manifesto 2",
                    picture: "pic2.jpg",
                },
            ];
            const votes = [
                {
                    vote_id: "v1",
                    user_id: "u1",
                    election_id: "e1",
                    contestant_id: "c1",
                    position: "president",
                },
                {
                    vote_id: "v2",
                    user_id: "u2",
                    election_id: "e1",
                    contestant_id: "c2",
                    position: "president",
                },
            ];
            const result = (0, electionHelpers_1.getAllContestantsElectionDetails)({ contestants, votes });
            expect(result.length).toBe(1);
            expect(result[0].contestants.length).toBe(2);
            expect(result[0].contestants[1].contestant_id).toBe("c2");
        });
        it("should not add a duplicate contestant", () => {
            const contestants = [
                {
                    contestant_id: "c1",
                    election_id: "e1",
                    surname: "Doe",
                    firstname: "John",
                    position: "president",
                    manifesto: "Manifesto 1",
                    picture: "pic1.jpg",
                },
                {
                    contestant_id: "c1", // same contestant
                    election_id: "e1",
                    surname: "Doe",
                    firstname: "John",
                    position: "president",
                    manifesto: "Manifesto 1",
                    picture: "pic1.jpg",
                },
            ];
            const votes = [
                {
                    vote_id: "v1",
                    user_id: "u1",
                    election_id: "e1",
                    contestant_id: "c1",
                    position: "president",
                },
            ];
            const result = (0, electionHelpers_1.getAllContestantsElectionDetails)({ contestants, votes });
            expect(result.length).toBe(1);
            expect(result[0].contestants.length).toBe(1);
            expect(result[0].contestants[0].contestant_id).toBe("c1");
        });
    });
    describe("userHasVoted", () => {
        it("should return true if user has voted", () => {
            const result = (0, electionHelpers_1.userHasVoted)(votes, "u1");
            expect(result).toBe(true);
        });
        it("should return false if user has not voted", () => {
            const result = (0, electionHelpers_1.userHasVoted)(votes, "non-existent");
            expect(result).toBe(false);
        });
    });
});
