import positionRank from "../config/electionPositionRank";
import type { ContestantsAttributes } from "../models/contestants";
import type { VotesAttributes } from "../models/votes";

export type ElectionDetails = {
  positionVotes: string[];
  position: string;
  contestants: (ContestantsAttributes & { votes: string[] })[];
};

/**
 * creates array of same length as all keys of positionRank object, then fills it with null.
 */
const _initializeArrayOfContestants = (): (ElectionDetails | null)[] => {
  return new Array(Object.keys(positionRank).length).fill(null);
};

/**
 * Gets the current rank of a position. The ranks are arranged in ascending order between 0 and 10.
 */
const _getCurrentPositionRank = (contestant: ContestantsAttributes): number => {
  return positionRank[contestant.position.toLowerCase()];
};

/**
 * Filters the voting data based on a property (e.g., position, contestant_id).
 */
const _filterVotesByProperty = ({
  votes,
  property,
  value,
}: {
  votes: VotesAttributes[];
  property: keyof VotesAttributes;
  value: string | undefined;
}): VotesAttributes[] => {
  if (value === undefined)
    throw new Error(`value set to filter ${property} shouldn't be undefined`);
  return votes.filter((voteDetails) => voteDetails[property] === value);
};

/**
 * Returns an array of voter ids from vote objects.
 */
const _getAllVotersId = (voters: VotesAttributes[]): string[] => {
  return voters.map((voteDetails) => voteDetails.user_id);
};

/**
 * Returns all votes for a position.
 */
export const getAllVotesForAPosition = ({
  votes,
  contestant,
  position,
}: {
  votes: VotesAttributes[];
  contestant?: ContestantsAttributes;
  position?: string;
}): string[] => {
  return _getAllVotersId(
    _filterVotesByProperty({
      votes,
      property: "position",
      value: position || contestant?.position,
    }),
  );
};

/**
 * Returns all votes for a given contestant.
 */
export const getVotesForAContestant = ({
  votes,
  contestant,
  contestantId,
}: {
  votes: VotesAttributes[];
  contestant?: ContestantsAttributes;
  contestantId?: string;
}): string[] => {
  return _getAllVotersId(
    _filterVotesByProperty({
      votes,
      property: "contestant_id",
      value: contestantId || contestant?.contestant_id,
    }),
  );
};

/**
 * Builds the contestant object with votes.
 */
const _buildContestantsObj = ({
  votes,
  contestant,
}: {
  votes: VotesAttributes[];
  contestant: ContestantsAttributes;
}): ContestantsAttributes & { votes: string[] } => {
  const contestantVote = getVotesForAContestant({
    votes,
    contestant,
  });
  return { votes: contestantVote, ...contestant };
};

/**
 * Builds election details for a contestant's position.
 */
const _buildElectionDetailsObj = ({
  votes,
  contestant,
}: {
  votes: VotesAttributes[];
  contestant: ContestantsAttributes;
}): ElectionDetails => {
  const updatedContestant = _buildContestantsObj({
    votes,
    contestant,
  });

  return {
    positionVotes: getAllVotesForAPosition({
      votes,
      contestant: updatedContestant,
    }),
    position: updatedContestant.position,
    contestants: [updatedContestant],
  };
};

/**
 * Returns a contestant from a list based on contestant_id.
 */
const _findContestant = (
  contestants: (ContestantsAttributes & { votes: string[] })[],
  contestant: ContestantsAttributes,
): (ContestantsAttributes & { votes: string[] }) | undefined => {
  return contestants.find(
    ({ contestant_id }) => contestant_id === contestant.contestant_id,
  );
};

/**
 * Groups contestants by position and attaches vote count per contestant.
 */
export const getAllContestantsElectionDetails = ({
  contestants,
  votes,
}: {
  contestants: ContestantsAttributes[];
  votes: VotesAttributes[];
}): ElectionDetails[] => {
  const arrOfContestants = _initializeArrayOfContestants();

  for (let contestant of contestants) {
    const rank = _getCurrentPositionRank(contestant);
    let electionDetailsObj = arrOfContestants[rank];

    if (!electionDetailsObj) {
      electionDetailsObj = _buildElectionDetailsObj({
        votes,
        contestant,
      });
      arrOfContestants[rank] = electionDetailsObj;
    } else if (!_findContestant(electionDetailsObj.contestants, contestant)) {
      const updated = _buildContestantsObj({
        votes,
        contestant,
      });
      arrOfContestants[rank]!.contestants.push(updated);
    }
  }

  return arrOfContestants.filter(
    (contestantObj): contestantObj is ElectionDetails => contestantObj !== null,
  );
};

/**
 * Checks if a user has already voted.
 */
export const userHasVoted = (
  votes: VotesAttributes[],
  userId: string,
): boolean => {
  return votes.some((voteDetails) => voteDetails.user_id === userId);
};
