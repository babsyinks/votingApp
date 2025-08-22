module.exports = (Votes) => {
  return {
    /**
     * @typedef {Object} Vote
     * @property {number} id
     * @property {string} vote_id
     * @property {string} user_id
     * @property {string} contestant_id
     * @property {string} position
     */

    /**
     * Fetch all votes.
     *
     * @returns {Promise<Array>}
     */
    async getAllVotes() {
      const votes = await Votes.findAll();
      return votes.map((vote) => vote.toJSON());
    },

    /**
     * Create a new vote.
     *
     * @param {string} userId The id of the user casting the vote
     * @param {string} contestantId The id of the contestant being voted for
     * @param {string} position The position the contestant is vying for, e.g president
     *
     * @returns {Promise<Vote>}
     */
    async castVote({ userId, contestantId, position }) {
      return Votes.create({
        user_id: userId,
        contestant_id: contestantId,
        position,
      });
    },

    /**
     * Delete all votes.
     *
     * @returns {Promise<undefined>}
     */
    async clearVotes() {
      return Votes.destroy({ truncate: true });
    },
  };
};
