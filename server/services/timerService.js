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
      const timers = Timer.findAll();
      return timers.map((timer) => timer.toJSON());
    },

    /**
     * Delete/reset the election timer.
     */
    async clearTimer() {
      return Timer.destroy({ truncate: true });
    },
  };
};
