import { minuteSeconds, hourSeconds, daySeconds } from "./timePartsInSeconds";
const getPreElectionTimerConfig = (daysDuration) => {
  return [
    { color: "#7E2E84", duration: daysDuration, type: "days" },
    { color: "#D14081", duration: daySeconds, type: "hours" },
    { color: "#EF798A", duration: hourSeconds, type: "minutes" },
    { color: "#218380", duration: minuteSeconds, type: "seconds" },
  ];
};

export default getPreElectionTimerConfig;
