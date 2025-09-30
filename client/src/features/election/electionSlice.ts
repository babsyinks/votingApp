import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import {
  mapTimerStatusToElectionStatus,
  TimerStatus,
  ElectionStatus,
} from "./utils/mapTimerStatusToElectionStatus";
import { ElectionCategory } from "./types/electionCategoryType";
import { RootState } from "app/rootReducer";

export interface ElectionState {
  contestantsData: ElectionCategory[];
  electionStatus: ElectionStatus;
}

const initialState: ElectionState = {
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
    setAllElectionData(state, action: PayloadAction<ElectionCategory[]>) {
      state.contestantsData = action.payload;
    },
    updateVotes(
      state,
      action: PayloadAction<{
        positionVotes: string[];
        contestantVotes: string[];
        contestantId: string;
        position: string;
      }>,
    ) {
      const { positionVotes, contestantVotes, contestantId, position } =
        action.payload;
      const category = getByPosition(state.contestantsData, position);
      if (!category || !contestantId) return;
      if (updateContestantVote(category, contestantId, contestantVotes)) {
        updateTotalCategoryVotes(category, positionVotes);
      }
    },
    updateElectionStatusFromTimer(state, action: PayloadAction<TimerStatus>) {
      state.electionStatus = mapTimerStatusToElectionStatus(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchThenSetCurrentTimerStatus.fulfilled,
      (state, action: PayloadAction<TimerStatus>) => {
        state.electionStatus = mapTimerStatusToElectionStatus(action.payload);
      },
    );
  },
});

const updateTotalCategoryVotes = (
  categoryObj: ElectionCategory,
  positionVotes: string[],
) => {
  categoryObj.positionVotes = positionVotes;
};

const findContestant = (categoryObj: ElectionCategory, contestantId: string) =>
  categoryObj.contestants.find((c) => c.contestant_id === contestantId);

const updateContestantVote = (
  categoryObj: ElectionCategory,
  contestantId: string,
  contestantVotes: string[],
): boolean => {
  const contestant = findContestant(categoryObj, contestantId);
  if (contestant) {
    contestant.votes = contestantVotes;
    return true;
  }
  return false;
};

const getByPosition = (data: ElectionCategory[], targetPosition: string) =>
  data.find(({ position }) => position === targetPosition);


export const {
  setAllElectionData,
  updateVotes,
  updateElectionStatusFromTimer,
} = electionSlice.actions;

export const allElectionData = (state: Pick<RootState, 'election'>) =>
  state.election.contestantsData;

export const electionStatus = (state: Pick<RootState, 'election'>) =>
  state.election.electionStatus;

export const getAllVotesInACategory =
  (targetPosition: string) => (state: Pick<RootState, 'election'>) =>
    getByPosition(state.election.contestantsData, targetPosition)
      ?.positionVotes;

export const getAllContestantsInCategory =
  (targetPosition: string) => (state: Pick<RootState, 'election'>) =>
    getByPosition(state.election.contestantsData, targetPosition)?.contestants;

export const getContestantById =
  (contestantId: string, targetPosition: string) => (state: Pick<RootState, 'election'>) =>
    getByPosition(state.election.contestantsData, targetPosition)?.contestants.find(
      (c) => c.contestant_id === contestantId,
    );

export default electionSlice.reducer;
