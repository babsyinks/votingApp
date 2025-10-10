import type { Votes } from "../models/votes";
import type { VotesAttributes, VotesCreationAttributes } from "../models/votes";

/**
 * Vote Service
 *
 * Provides methods to interact with the Votes model.
 */
export const createVotesService = (VotesModel: typeof Votes) => {
  return {
    /**
     * Fetch all votes.
     *
     * @returns {Promise<VotesAttributes[]>}
     */
    async getAllVotes(): Promise<VotesAttributes[]> {
      const votes = await VotesModel.findAll();
      return votes.map((vote) => vote.toJSON());
    },

    /**
     * Create a new vote.
     *
     * @param {Object} param0
     * @param {string} param0.userId - The ID of the user casting the vote
     * @param {string} param0.contestantId - The ID of the contestant being voted for
     * @param {string} param0.position - The position the contestant is vying for
     * @param {string} [param0.electionId] - ID of the election where the user is voting
     *
     * @returns {Promise<Votes>}
     */
    async castVote({
      userId,
      contestantId,
      position,
      electionId,
    }: {
      userId: string;
      contestantId: string;
      position: string;
      electionId: string;
    }): Promise<Votes> {
      return VotesModel.create({
        user_id: userId,
        contestant_id: contestantId,
        position,
        election_id: electionId,
      } as VotesCreationAttributes);
    },

    /**
     * Delete all votes.
     *
     * @returns {Promise<void>}
     */
    async clearVotes(): Promise<void> {
      await VotesModel.destroy({ truncate: true });
    },
  };
};

export type VotesService = ReturnType<typeof createVotesService>;
export default createVotesService;
