
/**
 * Utility to map timerStatus shape to electionStatus string. The states are as follows:
 * 
 * inActive - This state is when timerStatus is an empty object({} or
 * {startDate: undefined,endDate: undefined}). This maps to "inActive", meaning no live election
 * is running or concluded.
 * 
 * active_preElectionCountdown - This state is when the timer status startDate and endDate are set
 * to their corresponding timestamps. This maps to "active_preElectionCountdown", meaning the pre-
 * election countdown timer is running and will terminate when the startDate timestamp has been reached(
 * when this happens the startDate will be set to null).
 * 
 * active_election_live - This state commences immediately after "active_preElectionCountdown" state. This state
 * is active when startDate is null and endDate is a timestamp. This indicates that there is a live election going
 * on which will end at the endDate timestamp.
 * 
 * active_election_ended - This state follows after "active_election_live". It state has a startDate of null and
 * endDate of null, indicating that the live election has ended.
 * 
 * @param {Object} timerStatus The object containing start and end date states.
 * @param {number | null | undefined} [timerStatus.startDate] The election start date which is a timestamp indicating
 * when election will start, or null indicating no pre_election countdown timer is running or undefined indicating the
 * timer is not active at all.
 * @param {number | null | undefined} [timerStatus.endDate] The election end date indicating when the election will end.
 * This can be a timestamp showing election end date, or null showing live election has ended or undefined showing there
 * is no election data to show.
 * 
 * @returns {string} The election status
 * 
 */
export const mapTimerStatusToElectionStatus = (timerStatus) => {
  if (!timerStatus || (Object.keys(timerStatus).length === 0 && timerStatus.constructor === Object)) {
    return "inActive";
  }
  if (timerStatus.startDate && timerStatus.endDate) {
    return "active_preElectionCountdown";
  }
  if (timerStatus.startDate === null && timerStatus.endDate) {
    return "active_election_live";
  }
  if (timerStatus.startDate === null && timerStatus.endDate === null) {
    return "active_election_ended";
  }
  return "inActive"; // fallback
};