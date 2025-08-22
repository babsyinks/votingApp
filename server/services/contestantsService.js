module.exports = (Contestants) => {
  return {
    /**
     * @typedef {Object} Contestant
     * @property {number} id
     * @property {string} contestant_id
     * @property {string} surname
     * @property {string} firstname
     * @property {string} position
     * @property {string} manifesto
     * @property {string} picture
     */

    /**
     * Add a new contestant.
     *
     * @param {Contestant} contestantData data used to create the new contestant
     * @returns {Promise<Contestant>}
     */
    async createContestant(contestantData) {
      return Contestants.create(contestantData);
    },

    /**
     * Find contestant by ID.
     *
     * @param {string} contestant_id id of the contestant to find
     * @returns {Promise<Contestant>}
     */
    async findContestantById(contestant_id) {
      const contestant = await Contestants.findOne({ where: { contestant_id } });
      return contestant?.toJSON();
    },

    /**
     * Fetch all contestants.
     *
     * @returns {Promise<Array>}
     */
    async getAllContestants() {
      const contestants = await Contestants.findAll();
      return contestants.map((contestant) => contestant?.toJSON());
    },
  };
};
