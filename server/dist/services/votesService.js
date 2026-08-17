"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVotesService = void 0;
/**
 * Vote Service
 *
 * Provides methods to interact with the Votes model.
 */
const createVotesService = (VotesModel) => {
    return {
        /**
         * Fetch all votes.
         *
         * @returns {Promise<VotesAttributes[]>}
         */
        async getAllVotes() {
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
        async castVote({ userId, contestantId, position, electionId, }) {
            return VotesModel.create({
                user_id: userId,
                contestant_id: contestantId,
                position,
                election_id: electionId,
            });
        },
        /**
         * Delete all votes.
         *
         * @returns {Promise<void>}
         */
        async clearVotes() {
            await VotesModel.destroy({ truncate: true });
        },
    };
};
exports.createVotesService = createVotesService;
exports.default = exports.createVotesService;
