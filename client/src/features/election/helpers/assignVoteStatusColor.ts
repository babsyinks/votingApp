import { ContestantType } from "../types/contestantType";

/**
 * Color mapping type
 */
export type VoteStatusColors = Record<string, "lime" | "red" | "yellow">;

/**
 * Sets the proper colour code for the vote status of contestants. Contestants with the highest votes
 * are assigned a lime color, while the ones below the highest vote are assigned a red color. When there
 * is a tie, all contestants are assigned a yellow color showing that there is no winner or loser yet.
 *
 * @param contestants List of contestant objects
 * @returns Object mapping contestant_id to a color
 */
const assignVoteStatusColor = (
  contestants: ContestantType[],
): VoteStatusColors => {
  const colorStatusObj: VoteStatusColors = {};
  if (!contestants || contestants.length === 0) return colorStatusObj;

  const firstVoteCount = contestants[0].votes.length;

  if (
    contestants.length > 1 &&
    contestants.every((c) => c.votes.length === firstVoteCount)
  ) {
    setColorCodeForATie(contestants, colorStatusObj);
  } else {
    setColorCodesForWinnersAndLosers(contestants, colorStatusObj);
  }

  return colorStatusObj;
};

const setColorCodeForATie = (
  contestants: ContestantType[],
  colorStatusObj: VoteStatusColors,
) => {
  contestants.forEach((c) => {
    colorStatusObj[c.contestant_id] = "yellow";
  });
};

const setColorCodesForWinnersAndLosers = (
  contestants: ContestantType[],
  colorStatusObj: VoteStatusColors,
) => {
  const highestVotedContestant = getContestantWithHighestVote(contestants);
  contestants.forEach((c) => {
    if (c.votes.length === highestVotedContestant.votes.length) {
      colorStatusObj[c.contestant_id] = "lime";
    } else {
      colorStatusObj[c.contestant_id] = "red";
    }
  });
};

const getContestantWithHighestVote = (
  contestants: ContestantType[],
): ContestantType => {
  // being that contestants is an array obtained from redux state, it is immutable, so a copy must
  // be created to mutate this array.
  const contestantsCopy = [...contestants];
  contestantsCopy.sort((c1, c2) => c1.votes.length - c2.votes.length);
  return contestantsCopy[contestantsCopy.length - 1];
};

export default assignVoteStatusColor;
