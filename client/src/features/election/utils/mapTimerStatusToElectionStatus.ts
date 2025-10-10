/**
 * Utility to map timerStatus shape to electionStatus string. The states are as follows:
 *
 * - inActive: No live election scheduled. App is in dry run state.
 * - active_preElectionCountdown: Election startDate is in the future.
 * - active_election_live: A live election is currently running.
 * - active_election_ended: The live election has ended.
 */

export type TimerStatus = {
  startDate?: number;
  endDate?: number;
};

export type ElectionStatus =
  | "inActive"
  | "active_preElectionCountdown"
  | "active_election_live"
  | "active_election_ended";

/**
 * Maps a TimerStatus object to an ElectionStatus string.
 */
export const mapTimerStatusToElectionStatus = (
  timerStatus?: TimerStatus,
): ElectionStatus => {
  if (
    !timerStatus ||
    (Object.keys(timerStatus).length === 0 &&
      timerStatus.constructor === Object)
  ) {
    return "inActive";
  }

  const { startDate, endDate } = timerStatus;
  const now = Date.now();

  if (startDate !== undefined && startDate > now) {
    return "active_preElectionCountdown";
  }

  if (
    startDate !== undefined &&
    endDate !== undefined &&
    startDate <= now &&
    endDate > now
  ) {
    return "active_election_live";
  }

  if (endDate !== undefined && endDate <= now) {
    return "active_election_ended";
  }

  return "inActive"; // fallback
};
