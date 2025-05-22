import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
/**
 * electionSlice
 *
 * It handles election-related data.
 */
const electionSlice = createSlice({
  name: "election",
  initialState,
  reducers: {
    setAllElectionData(state, action) {
      return action.payload;
    },
    updateVotes(state, action) {
      const { allVotes, contestantVotes, contestantId, position } =
        action.payload;
      const contestantsCategoryObj = getByPosition(state, position);
      updateTotalCategoryVotes(contestantsCategoryObj, allVotes);
      if (contestantId) {
        updateContestantVote(
          contestantsCategoryObj,
          contestantId,
          contestantVotes,
        );
      }
    },
  },
});

const updateTotalCategoryVotes = (categoryObj, allVotes) => {
  categoryObj.allVotes = allVotes;
};

const findContestant = (categoryObj, contestantId) => {
  return categoryObj.contestants.find((c) => c.contestant_id === contestantId);
};

const updateContestantVote = (categoryObj, contestantId, contestantVotes) => {
  const contestant = findContestant(categoryObj, contestantId);
  if (contestant) {
    contestant.votes = contestantVotes;
  }
};

const getByPosition = (state, targetPosition) => {
  return state.find(({ position }) => position === targetPosition);
};

export const { setAllElectionData } = electionSlice.actions;

export const { updateVotes } = electionSlice.actions;

export const allElectionData = (state) => state.election;

export const getAllVotesInACategory = (targetPosition) => (state) =>
  getByPosition(state.election, targetPosition).allVotes;

export const getAllContestantsInCategory = (targetPosition) => (state) =>
  getByPosition(state.election, targetPosition).contestants;

export const getContestantById = (contestantId, targetPosition) => (state) =>
  getByPosition(state.election, targetPosition).contestants.find(
    (c) => c.contestant_id === contestantId,
  );

export default electionSlice.reducer;
