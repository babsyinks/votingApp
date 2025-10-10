import type { ElectionStatus } from "features/election/utils/mapTimerStatusToElectionStatus";

const getStatusMessage = (status: ElectionStatus) => {
  let message;

  switch (status) {
    case "active_preElectionCountdown":
      message = "Election Countdown In Progress";
      break;
    case "active_election_live":
      message = "🟢 Election Is Live";
      break;
    case "active_election_ended":
      message = "⚠️ Election Has Ended";
      break;
    default:
      message = "";
  }
  return message;
};

export default getStatusMessage;
