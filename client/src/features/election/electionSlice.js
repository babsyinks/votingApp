import { createSlice } from "@reduxjs/toolkit";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import { mapTimerStatusToElectionStatus } from "./utils/mapTimerStatusToElectionStatus";

const initialState = {
  contestantsData: [],
  electionStatus: "inActive",
};

/**
 * electionSlice
 *
 * Handles election-related data and the election's current status.
 */
const electionSlice = createSlice({
  name: "election",
  initialState,
  reducers: {
    setAllElectionData(state, action) {
      state.contestantsData = action.payload;
    },
    updateVotes(state, action) {
      const { positionVotes, contestantVotes, contestantId, position } = action.payload;
      const category = getByPosition(state.contestantsData, position);
      if (!category || !contestantId) return;
      if (updateContestantVote(category, contestantId, contestantVotes)) {
        updateTotalCategoryVotes(category, positionVotes);
      }
    },
    updateElectionStatusFromTimer(state, action) {
      state.electionStatus = mapTimerStatusToElectionStatus(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchThenSetCurrentTimerStatus.fulfilled, (state, action) => {
      state.electionStatus = mapTimerStatusToElectionStatus(action.payload);
    });
  },
});

const updateTotalCategoryVotes = (categoryObj, positionVotes) => {
  categoryObj.positionVotes = positionVotes;
};

const findContestant = (categoryObj, contestantId) =>
  categoryObj.contestants.find((c) => c.contestant_id === contestantId);

const updateContestantVote = (categoryObj, contestantId, contestantVotes) => {
  const contestant = findContestant(categoryObj, contestantId);
  if (contestant) {
    contestant.votes = contestantVotes;
    return true;
  }
  return false;
};

const getByPosition = (data, targetPosition) =>
  data.find(({ position }) => position === targetPosition);

export const { setAllElectionData, updateVotes, updateElectionStatusFromTimer } =
  electionSlice.actions;

export const allElectionData = (state) => state.election.contestantsData;
export const electionStatus = (state) => state.election.electionStatus;

export const getAllVotesInACategory = (targetPosition) => (state) =>
  getByPosition(state.election.contestantsData, targetPosition)?.positionVotes;

export const getAllContestantsInCategory = (targetPosition) => (state) =>
  getByPosition(state.election.contestantsData, targetPosition)?.contestants;

export const getContestantById = (contestantId, targetPosition) => (state) =>
  getByPosition(state.election.contestantsData, targetPosition)?.contestants.find(
    (c) => c.contestant_id === contestantId,
  );

export default electionSlice.reducer;
