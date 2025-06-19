const getStatusMessage = (status) => {
  let message;

  switch (status) {
    case "active_preElectionCountdown":
      message = "Election countdown in progress";
      break;
    case "active_election_live":
      message = "🟢 Live Election Ongoing";
      break;
    case "active_election_ended":
      message = "⚠️ Live Election Has Ended";
      break;
    default:
      message = "";
  }
  return message;
};

export default getStatusMessage;
