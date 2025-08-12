const {
  getAllContestantsElectionDetails,
  userHasVoted,
  getAllVotesForAPosition,
  getVotesForAContestant,
} = require("../../helpers/electionControllerHelpers");

describe("electionControllerHelpers", () => {
  let votes;
  let contestants;

  beforeEach(() => {
    votes = [
      { id: 1, vote_id: "v1", user_id: "u1", contestant_id: "c1", position: "president" },
      { id: 2, vote_id: "v2", user_id: "u2", contestant_id: "c1", position: "president" },
      { id: 3, vote_id: "v3", user_id: "u3", contestant_id: "c2", position: "vice president" },
      { id: 4, vote_id: "v4", user_id: "u4", contestant_id: "c3", position: "vice president" },
    ];

    contestants = [
      {
        id: 1,
        contestant_id: "c1",
        surname: "Doe",
        firstname: "John",
        position: "president",
        manifesto: "Better future",
        picture: "john.jpg",
      },
      {
        id: 2,
        contestant_id: "c2",
        surname: "Smith",
        firstname: "Jane",
        position: "vice president",
        manifesto: "Unity and progress",
        picture: "jane.jpg",
      },
      {
        id: 3,
        contestant_id: "c3",
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
      const result = getAllVotesForAPosition({
        votes,
        contestant: contestants[0],
        position: "president",
      });
      expect(result).toEqual(["u1", "u2"]);
    });

    it("should fall back to contestant.position if position param is not given", () => {
      const result = getAllVotesForAPosition({
        votes,
        contestant: contestants[1], // vice president
      });
      expect(result).toEqual(["u3", "u4"]);
    });

    it("should return empty array if no votes for position", () => {
      const result = getAllVotesForAPosition({
        votes,
        contestant: contestants[0],
        position: "non-existent position",
      });
      expect(result).toEqual([]);
    });
  });

  describe("getVotesForAContestant", () => {
    it("should return all user_ids for given contestant", () => {
      const result = getVotesForAContestant({
        votes,
        contestant: contestants[0],
      });
      expect(result).toEqual(["u1", "u2"]);
    });

    it("should use contestantId param if provided", () => {
      const result = getVotesForAContestant({
        votes,
        contestant: contestants[0],
        contestantId: "c2",
      });
      expect(result).toEqual(["u3"]);
    });

    it("should return empty array if no votes for contestant", () => {
      const result = getVotesForAContestant({
        votes,
        contestant: contestants[0],
        contestantId: "non-existent",
      });
      expect(result).toEqual([]);
    });
  });

  describe("getAllContestantsElectionDetails", () => {
    it("should group contestants by position rank and attach votes", () => {
      const result = getAllContestantsElectionDetails({ contestants, votes });

      expect(result).toHaveLength(2); // president, vice president
      expect(result[0].position).toBe("president");
      expect(result[0].positionVotes).toEqual(["u1", "u2"]);
      expect(result[0].contestants[0].votes).toEqual(["u1", "u2"]);

      expect(result[1].position).toBe("vice president");
      expect(result[1].positionVotes).toEqual(["u3", "u4"]);
      expect(result[1].contestants).toHaveLength(2);
      expect(result[1].contestants.find((c) => c.contestant_id === "c3").votes).toEqual(["u4"]);
    });

    it("should ignore null entries in position ranks", () => {
      const contestantsSubset = [contestants[0]];
      const result = getAllContestantsElectionDetails({
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
          surname: "Doe",
          firstname: "John",
          position: "president",
          manifesto: "Manifesto 1",
          picture: "pic1.jpg",
        },
        {
          contestant_id: "c2", // different ID but same position
          surname: "Smith",
          firstname: "Jane",
          position: "president",
          manifesto: "Manifesto 2",
          picture: "pic2.jpg",
        },
      ];

      const votes = [
        { user_id: "u1", contestant_id: "c1", position: "president" },
        { user_id: "u2", contestant_id: "c2", position: "president" },
      ];

      const result = getAllContestantsElectionDetails({ contestants, votes });

      expect(result.length).toBe(1);
      expect(result[0].contestants.length).toBe(2);
      expect(result[0].contestants[1].contestant_id).toBe("c2");
    });

    it("should not add a duplicate contestant", () => {
      const contestants = [
        {
          contestant_id: "c1",
          surname: "Doe",
          firstname: "John",
          position: "president",
          manifesto: "Manifesto 1",
          picture: "pic1.jpg",
        },
        {
          contestant_id: "c1", // same contestant
          surname: "Doe",
          firstname: "John",
          position: "president",
          manifesto: "Manifesto 1",
          picture: "pic1.jpg",
        },
      ];

      const votes = [
        { user_id: "u1", contestant_id: "c1", position: "president" },
      ];

      const result = getAllContestantsElectionDetails({ contestants, votes });

      expect(result.length).toBe(1);
      expect(result[0].contestants.length).toBe(1);
      expect(result[0].contestants[0].contestant_id).toBe("c1");
    });
  });

  describe("userHasVoted", () => {
    it("should return the vote object if user has voted", () => {
      const result = userHasVoted(votes, "u1");
      expect(result).toEqual(expect.objectContaining({ user_id: "u1", contestant_id: "c1" }));
    });

    it("should return undefined if user has not voted", () => {
      const result = userHasVoted(votes, "non-existent");
      expect(result).toBeUndefined();
    });
  });
});
