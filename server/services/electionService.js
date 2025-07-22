const {
  userHasVoted,
  getAllVotesForAPosition,
  getVotesForAContestant,
  getAllContestantsElectionDetails,
} = require("../helpers/electionControllerHelpers");
const generateCustomError = require("../utils/generateCustomError");

module.exports = ({ votesService, contestantsService, timerService }) => {
  return {
    /**
     * Create a new contestant.
     *
     * @param {Object} contestantData Details of the contestant to create
     * @returns {Promise<Object>}
     */
    async createContestant(contestantData) {
      return contestantsService.createContestant(contestantData);
    },

    /**
     * Find a contestant by ID.
     *
     * @param {string} contestant_id The id of the contestant
     * @returns {Promise<Object>}
     */
    async findContestant(contestant_id) {
      return contestantsService.findContestantById(contestant_id);
    },

    /**
     * Returns a full summary of all contestants grouped by position with votes.
     *
     * @returns {Promise<Object>}
     */
    async getElectionSummary() {
      const contestants = await contestantsService.getAllContestants();
      const votes = await votesService.getAllVotes();

      if (contestants.length === 0) {
        generateCustomError("There Is Currently No Election", 404);
      }

      return getAllContestantsElectionDetails({ contestants, votes });
    },

    /**
     * Casts a vote for a contestant if the user hasn't already voted.
     *
     * @param {number} userId Id of the user
     * @param {number} contestantId Id of the contestant
     * @param {string} position Position being contested, e.g president
     * @returns {Object}
     */
    async castVote(userId, contestantId, position) {
      let votes = await votesService.getAllVotes();
      if (userHasVoted(votes, userId)) {
        generateCustomError("User has already voted", 403);
      }

      await votesService.castVote({ userId, contestantId, position });

      votes = await votesService.getAllVotes();

      return {
        positionVotes: getAllVotesForAPosition({ votes, position }),
        contestantVotes: getVotesForAContestant({ votes, contestantId }),
      };
    },

    /**
     * Clears all votes and resets the timer.
     *
     * @returns {Promise<void>}
     */
    async clearElectionData() {
      await votesService.clearVotes();
      await timerService.clearTimer();
    },
  };
};
