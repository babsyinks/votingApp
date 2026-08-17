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
import { ElectionState } from "../electionSlice";
import { RootState } from "app/rootReducer";
import { vi } from "vitest";

describe("electionSlice", () => {
  const initialState: ElectionState = {
    contestantsData: [],
    electionStatus: "inActive",
  };

      const presidentPositionVotes = [
      "id1",
      "id2",
      "id3",
      "id4",
      "id5",
      "id6",
      "id7",
      "id8",
      "id9",
      "id10",
      "id11",
      "id12",
      "id13",
      "id14",
      "id15",
      "id16",
      "id17",
      "id18",
      "id19",
      "id20",
    ];
    const secretaryPositionVotes = [
      "id1",
      "id2",
      "id3",
      "id4",
      "id5",
      "id6",
      "id7",
      "id8",
      "id9",
      "id10",
      "id11",
      "id12",
      "id13",
      "id14",
      "id15",
      "id16",
      "id17",
      "id18",
    ];

    const contestant1ForPresidentVotes = ["id5, id9", "id11"];
    const contestant2ForPresidentVotes = ["id4", "id7", "id12", "id13"];
    const contestant1ForSecretaryVotes = ["id4", "id5", "id9", "id14"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle setAllElectionData", () => {
    const sampleData = [
      {
        position: "President",
        contestants: [
          {
            contestant_id: "c1",
            surname: "Alice",
            firstname: "joel",
            manifesto: "change",
            picture: "picture.jpg",
            votes: [],
          },
          {
            contestant_id: "c2",
            surname: "Bob",
            firstname: "grey",
            manifesto: "conserve",
            picture: "pic.jpg",
            votes: [],
          },
        ],
        positionVotes: [],
      },
    ];
    const newState = reducer(initialState, setAllElectionData(sampleData));
    expect(newState.contestantsData).toEqual(sampleData);
  });

  it("should handle updateVotes for category and contestant", () => {
    const prevState: ElectionState = {
      contestantsData: [
        {
          position: "President",
          positionVotes: [],
          contestants: [
            {
              contestant_id: "c1",
              surname: "Alice",
              firstname: "joel",
              manifesto: "change",
              picture: "picture.jpg",
              votes: [],
            },
            {
              contestant_id: "c2",
              surname: "Bob",
              firstname: "grey",
              manifesto: "conserve",
              picture: "pic.jpg",
              votes: [],
            },
          ],
        },
      ],
      electionStatus: "inActive",
    };

    const actionPayload = {
      position: "President",
      positionVotes: presidentPositionVotes,
      contestantId: "c1",
      contestantVotes: contestant1ForPresidentVotes,
    };

    const newState = reducer(prevState, updateVotes(actionPayload));
    const presidentCategory = newState.contestantsData[0];

    expect(presidentCategory.positionVotes).toEqual(presidentPositionVotes);
    expect(
      presidentCategory.contestants.find((c) => c.contestant_id === "c1")
        ?.votes,
    ).toEqual(contestant1ForPresidentVotes);
  });

  it("should not fail if updateVotes is called with non-matching position", () => {
    const prevState: ElectionState = {
      contestantsData: [
        {
          position: "President",
          positionVotes: [],
          contestants: [],
        },
      ],
      electionStatus: "inActive",
    };

    const newState = reducer(
      prevState,
      updateVotes({
        position: "Nonexistent",
        positionVotes: [],
        contestantId: "c99",
        contestantVotes: [],
      }),
    );

    expect(newState).toEqual(prevState);
  });

  it("should handle updateElectionStatusFromTimer using utility", () => {
    const timerStatus = { startDate: 9999, endDate: 10000 };
    vi
      .spyOn(utils, "mapTimerStatusToElectionStatus")
      .mockReturnValue("active_election_live");

    const newState = reducer(
      initialState,
      updateElectionStatusFromTimer(timerStatus),
    );

    expect(utils.mapTimerStatusToElectionStatus).toHaveBeenCalledWith(
      timerStatus,
    );
    expect(newState.electionStatus).toBe("active_election_live");
  });

  it("should handle fetchThenSetCurrentTimerStatus.fulfilled (extraReducer)", () => {
    const timerStatus = { startDate: 1111, endDate: 2222 };
    vi
      .spyOn(utils, "mapTimerStatusToElectionStatus")
      .mockReturnValue("active_election_ended");

    const action = {
      type: fetchThenSetCurrentTimerStatus.fulfilled.type,
      payload: timerStatus,
    };

    const newState = reducer(initialState, action);
    expect(utils.mapTimerStatusToElectionStatus).toHaveBeenCalledWith(
      timerStatus,
    );
    expect(newState.electionStatus).toBe("active_election_ended");
  });

  describe("electionSlice selectors", () => {

    const state: Pick<RootState, "election"> = {
      election: {
        contestantsData: [
          {
            position: "President",
            positionVotes: presidentPositionVotes,
            contestants: [
              {
                contestant_id: "a1",
                surname: "Alice",
                firstname: "joel",
                manifesto: "change",
                picture: "picture.jpg",
                votes: contestant1ForPresidentVotes,
              },
              {
                contestant_id: "b2",
                surname: "Bob",
                firstname: "grey",
                manifesto: "conserve",
                picture: "pic.jpg",
                votes: contestant2ForPresidentVotes,
              },
            ],
          },
          {
            position: "Secretary",
            positionVotes: secretaryPositionVotes,
            contestants: [
              {
                contestant_id: "c3",
                surname: "Carol",
                firstname: "Martha",
                manifesto: "build",
                picture: "pix.jpg",
                votes: contestant1ForSecretaryVotes,
              },
            ],
          },
        ],
        electionStatus: "active_election_live",
      },
    };

    it("getAllVotesInACategory returns total votes for a position", () => {
      const result = getAllVotesInACategory("President")(state);
      expect(result).toEqual(presidentPositionVotes);
    });

    it("getAllVotesInACategory returns undefined for wrong position", () => {
      expect(getAllVotesInACategory("Unknown")(state)).toBeUndefined();
    });

    it("getAllContestantsInCategory returns all contestants for a position", () => {
      const result = getAllContestantsInCategory("Secretary")(state);
      expect(result).toEqual([
        {
          contestant_id: "c3",
          surname: "Carol",
          firstname: "Martha",
          manifesto: "build",
          picture: "pix.jpg",
          votes: contestant1ForSecretaryVotes,
        },
      ]);
    });

    it("getAllContestantsInCategory returns undefined for wrong position", () => {
      expect(getAllContestantsInCategory("Unknown")(state)).toBeUndefined();
    });

    it("getContestantById returns correct contestant by ID and position", () => {
      const result = getContestantById("a1", "President")(state);
      expect(result).toEqual({
        contestant_id: "a1",
        surname: "Alice",
        firstname: "joel",
        manifesto: "change",
        picture: "picture.jpg",
        votes: contestant1ForPresidentVotes,
      });
    });

    it("getContestantById returns undefined for wrong ID or position", () => {
      expect(getContestantById("z9", "President")(state)).toBeUndefined();
      expect(getContestantById("a1", "Unknown")(state)).toBeUndefined();
    });
  });

  it("should handle updateVotes when contestantId is not found (should not throw)", () => {
    const prevState: ElectionState = {
      contestantsData: [
        {
          position: "President",
          positionVotes: [],
          contestants: [
            {
              contestant_id: "a1",
              surname: "Alice",
              firstname: "joel",
              manifesto: "change",
              picture: "picture.jpg",
              votes: [],
            },
          ],
        },
      ],
      electionStatus: "inActive",
    };

    const newState = reducer(
      prevState,
      updateVotes({
        position: "President",
        positionVotes: presidentPositionVotes,
        contestantId: "not-found-id",
        contestantVotes: contestant1ForPresidentVotes,
      }),
    );

    expect(newState.contestantsData[0].positionVotes).toEqual([]);
    expect(newState.contestantsData[0].contestants[0].votes).toEqual([]);
  });

  it("should select allElectionData", () => {
    const mockState: Pick<RootState, "election"> = {
      election: {
        contestantsData: [
          {
            position: "President",
            positionVotes: presidentPositionVotes,
            contestants: [
              {
                contestant_id: "a1",
                surname: "john",
                firstname: "max",
                manifesto: "m",
                picture: "maxpic.jpg",
                votes: contestant1ForPresidentVotes,
              },
              {
                contestant_id: "a2",
                surname: "sam",
                firstname: "nori",
                manifesto: "x",
                picture: "noripix.jpg",
                votes: [],
              },
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
    const mockState: Pick<RootState, "election"> = {
      election: {
        contestantsData: [],
        electionStatus: "active_preElectionCountdown",
      },
    };

    const result = electionStatus(mockState);
    expect(result).toBe("active_preElectionCountdown");
  });
});
