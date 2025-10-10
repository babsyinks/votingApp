import type { ContestantsService } from "./contestantsService";
import type { TimerService } from "./timerService";
import type { VotesService } from "./votesService";
import {
  userHasVoted,
  getAllVotesForAPosition,
  getVotesForAContestant,
  getAllContestantsElectionDetails,
} from "../helpers/electionControllerHelpers";
import type { ElectionDetails } from "../helpers/electionControllerHelpers";
import type {
  ContestantsAttributes,
  ContestantsCreationAttributes,
} from "../models/contestants";
import { Contestants } from "../models/contestants";
import generateCustomError from "../utils/generateCustomError";

export const createElectionService = ({
  votesService,
  contestantsService,
  timerService,
}: {
  votesService: VotesService;
  contestantsService: ContestantsService;
  timerService: TimerService;
}) => {
  return {
    /**
     * Create a new contestant.
     *
     * @param contestantData Details of the contestant to create
     * @returns Promise<ContestantsAttributes>
     */
    async createContestant(
      contestantData: ContestantsCreationAttributes,
    ): Promise<Contestants> {
      return contestantsService.createContestant(contestantData);
    },

    /**
     * Find a contestant by ID.
     *
     * @param contestant_id The id of the contestant
     * @returns Promise<ContestantsAttributes | null>
     */
    async findContestant(
      contestant_id: string,
    ): Promise<ContestantsAttributes | undefined> {
      return contestantsService.findContestantById(contestant_id);
    },

    /**
     * Returns a full summary of all contestants grouped by position with votes.
     *
     * @returns Promise<Record<ElectionDetails[] | ContestantsAttributes[]>
     */
    async getElectionSummary(): Promise<
      ElectionDetails[] | ContestantsAttributes[]
    > {
      const contestants = await contestantsService.getAllContestants();
      const votes = await votesService.getAllVotes();

      if (contestants.length === 0) {
        return contestants;
      }

      return getAllContestantsElectionDetails({ contestants, votes });
    },

    /**
     * Casts a vote for a contestant if the user hasn't already voted.
     *
     * @param userId Id of the user
     * @param contestantId Id of the contestant
     * @param position Position being contested
     * @param electionId Id of the ongoing election
     * @returns Object containing position and contestant vote counts
     */
    async castVote(
      userId: string,
      contestantId: string,
      position: string,
      electionId: string,
    ): Promise<{
      positionVotes: string[]; // array of user ids that voted for contestants vying for a position
      contestantVotes: string[]; // array of user ids that voted for a contestant
    }> {
      let votes = await votesService.getAllVotes();

      if (userHasVoted(votes, userId)) {
        generateCustomError("User has already voted", 403);
      }

      await votesService.castVote({
        userId,
        contestantId,
        position,
        electionId,
      });

      votes = await votesService.getAllVotes();

      return {
        positionVotes: getAllVotesForAPosition({ votes, position }),
        contestantVotes: getVotesForAContestant({ votes, contestantId }),
      };
    },

    /**
     * Clears all votes and resets the timer.
     *
     * @returns Promise<void>
     */
    async clearElectionData(): Promise<void> {
      await votesService.clearVotes();
      await timerService.clearTimer();
    },
  };
};

export default createElectionService;
