import reducer, {
  setAllElectionData,
  updateVotes,
  updateElectionStatusFromTimer,
  getAllVotesInACategory,
  getAllContestantsInCategory,
  getContestantById,
  allElectionData,
  electionStatus,
} from "../electionSlice";

import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import * as utils from "../utils/mapTimerStatusToElectionStatus";

describe("electionSlice", () => {
  const initialState = {
    contestantsData: [],
    electionStatus: "inActive",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle setAllElectionData", () => {
    const sampleData = [
      {
        position: "President",
        contestants: [
          { contestant_id: "c1", name: "Alice", votes: 0 },
          { contestant_id: "c2", name: "Bob", votes: 0 },
        ],
        positionVotes: 0,
      },
    ];
    const newState = reducer(initialState, setAllElectionData(sampleData));
    expect(newState.contestantsData).toEqual(sampleData);
  });

  it("should handle updateVotes for category and contestant", () => {
    const prevState = {
      contestantsData: [
        {
          position: "President",
          positionVotes: 0,
          contestants: [
            { contestant_id: "c1", name: "Alice", votes: 0 },
            { contestant_id: "c2", name: "Bob", votes: 0 },
          ],
        },
      ],
      electionStatus: "inActive",
    };

    const actionPayload = {
      position: "President",
      positionVotes: 5,
      contestantId: "c1",
      contestantVotes: 3,
    };

    const newState = reducer(prevState, updateVotes(actionPayload));
    const presidentCategory = newState.contestantsData[0];

    expect(presidentCategory.positionVotes).toBe(5);
    expect(presidentCategory.contestants.find((c) => c.contestant_id === "c1").votes).toBe(3);
  });

  it("should not fail if updateVotes is called with non-matching position", () => {
    const prevState = {
      contestantsData: [
        {
          position: "President",
          positionVotes: 0,
          contestants: [],
        },
      ],
      electionStatus: "inActive",
    };

    const newState = reducer(
      prevState,
      updateVotes({
        position: "Nonexistent",
        positionVotes: 10,
        contestantId: "c99",
        contestantVotes: 5,
      }),
    );

    expect(newState).toEqual(prevState);
  });

  it("should handle updateElectionStatusFromTimer using utility", () => {
    const timerStatus = { startDate: 9999, endDate: 10000 };
    jest.spyOn(utils, "mapTimerStatusToElectionStatus").mockReturnValue("active_election_live");

    const newState = reducer(initialState, updateElectionStatusFromTimer(timerStatus));

    expect(utils.mapTimerStatusToElectionStatus).toHaveBeenCalledWith(timerStatus);
    expect(newState.electionStatus).toBe("active_election_live");
  });

  it("should handle fetchThenSetCurrentTimerStatus.fulfilled (extraReducer)", () => {
    const timerStatus = { startDate: 1111, endDate: 2222 };
    jest.spyOn(utils, "mapTimerStatusToElectionStatus").mockReturnValue("active_election_ended");

    const action = {
      type: fetchThenSetCurrentTimerStatus.fulfilled.type,
      payload: timerStatus,
    };

    const newState = reducer(initialState, action);
    expect(utils.mapTimerStatusToElectionStatus).toHaveBeenCalledWith(timerStatus);
    expect(newState.electionStatus).toBe("active_election_ended");
  });

  describe("electionSlice selectors", () => {
    const state = {
      election: {
        contestantsData: [
          {
            position: "President",
            positionVotes: 42,
            contestants: [
              { contestant_id: "a1", name: "Alice", votes: 30 },
              { contestant_id: "b2", name: "Bob", votes: 12 },
            ],
          },
          {
            position: "Secretary",
            positionVotes: 10,
            contestants: [{ contestant_id: "c3", name: "Carol", votes: 10 }],
          },
        ],
      },
    };

    it("getAllVotesInACategory returns total votes for a position", () => {
      const result = getAllVotesInACategory("President")(state);
      expect(result).toBe(42);
    });

    it("getAllVotesInACategory returns undefined for wrong position", () => {
      expect(getAllVotesInACategory("Unknown")(state)).toBeUndefined();
    });

    it("getAllContestantsInCategory returns all contestants for a position", () => {
      const result = getAllContestantsInCategory("Secretary")(state);
      expect(result).toEqual([{ contestant_id: "c3", name: "Carol", votes: 10 }]);
    });

    it("getAllContestantsInCategory returns undefined for wrong position", () => {
      expect(getAllContestantsInCategory("Unknown")(state)).toBeUndefined();
    });

    it("getContestantById returns correct contestant by ID and position", () => {
      const result = getContestantById("a1", "President")(state);
      expect(result).toEqual({ contestant_id: "a1", name: "Alice", votes: 30 });
    });

    it("getContestantById returns undefined for wrong ID or position", () => {
      expect(getContestantById("z9", "President")(state)).toBeUndefined();
      expect(getContestantById("a1", "Unknown")(state)).toBeUndefined();
    });
  });

  it("state should remain unchanged when contestantId is not provided", () => {
    const prevState = {
      contestantsData: [
        {
          position: "President",
          positionVotes: 0,
          contestants: [{ contestant_id: "x1", name: "John", votes: 0 }],
        },
      ],
      electionStatus: "inActive",
    };

    const newState = reducer(
      prevState,
      updateVotes({
        position: "President",
        positionVotes: 99,
      }),
    );

    expect(newState.contestantsData[0].positionVotes).toBe(0);
    expect(newState.contestantsData[0].contestants[0].votes).toBe(0);
  });

  it("should handle updateVotes when contestantId is not found (should not throw)", () => {
    const prevState = {
      contestantsData: [
        {
          position: "President",
          positionVotes: 0,
          contestants: [{ contestant_id: "a1", name: "Alice", votes: 0 }],
        },
      ],
      electionStatus: "inActive",
    };

    const newState = reducer(
      prevState,
      updateVotes({
        position: "President",
        positionVotes: 10,
        contestantId: "not-found-id",
        contestantVotes: 5,
      }),
    );

    expect(newState.contestantsData[0].positionVotes).toBe(0);
    expect(newState.contestantsData[0].contestants[0].votes).toBe(0);
  });

  it("should select allElectionData", () => {
    const mockState = {
      election: {
        contestantsData: [
          {
            position: "President",
            contestants: [
              { contestant_id: "a1", name: "john", votes: 5 },
              { contestant_id: "a2", name: "sam", votes: 3 },
            ],
          },
        ],
        electionStatus: "active_election_live",
      },
    };

    const result = allElectionData(mockState);
    expect(result).toEqual(mockState.election.contestantsData);
  });

  it("should select electionStatus", () => {
    const mockState = {
      election: {
        contestantsData: [],
        electionStatus: "active_preElectionCountdown",
      },
    };

    const result = electionStatus(mockState);
    expect(result).toBe("active_preElectionCountdown");
  });
});
