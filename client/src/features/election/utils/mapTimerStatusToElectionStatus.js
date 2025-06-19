/**
 * Utility to map timerStatus shape to electionStatus string. The states are as follows:
 *
 * inActive - This state indicates when no live election has been scheduled. In this state, the
 * application is in a dry run state.
 *
 * active_preElectionCountdown - This state indicates when the election startDate is in the future.
 *
 * active_election_live - This state indicates when a live election is running. 
 *
 * active_election_ended - This state indicates when a live election has ended.
 *
 * @param {Object} timerStatus The object containing start and end date states.
 * @param {number} [timerStatus.startDate] The election start date which is a timestamp indicating
 * when election is scheduled to start
 * @param {number} [timerStatus.endDate] The election end date which is a timestamp indicating when 
 * the election is scheduled to end.
 *
 * @returns {string} The election status
 *
 */
export const mapTimerStatusToElectionStatus = (timerStatus) => {
  if (
    !timerStatus ||
    (Object.keys(timerStatus).length === 0 &&
      timerStatus.constructor === Object)
  ) {
    return "inActive";
  }
  const { startDate, endDate } = timerStatus;
  const now = Date.now();
  if (startDate > now) {
    return "active_preElectionCountdown";
  }
  if (startDate <= now && endDate > now) {
    return "active_election_live";
  }
  if (endDate <= now) {
    return "active_election_ended";
  }
  return "inActive"; // fallback
};
