module.exports = (Timer) => {
  return {
    /**
     * @typedef {Object} Timer
     * @property {number} id
     * @property {string} startDate
     * @property {string} endDate
     */

    /**
     * Fetch all timers.
     *
     * @returns {Promise<Array>}
     */
    async getAllTimers() {
      const timers = await Timer.findAll();
      return timers.map((timer) => timer.toJSON());
    },

    /**
     * Find timer by ID.
     *
     * @param {number} id id of the Timer to find
     * @returns {Promise<Timer>}
     */
    async findTimerById(id) {
      const timer = await Timer.findOne({ where: { id } });
      return timer.toJSON();
    },

    /**
     * Create a new timer
     *
     * @param {Timer} timer timer configuration object
     * @returns {Promise<Timer>}
     */
    async createTimer(timer) {
      return Timer.create(timer);
    },

    /**
     * Update existing timer
     *
     * @param {Timer} timer The existing timer
     * @param {Object} update The object containing the update information
     */
    async updateExistingTimer(timer, update) {
      timer.set(update);
      await timer.save();
    },

    /**
     * Delete/reset the election timer.
     */
    async clearTimer() {
      return Timer.destroy({ truncate: true });
    },
  };
};
