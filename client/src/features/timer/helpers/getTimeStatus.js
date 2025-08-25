import { daySeconds } from "../data/timePartsInSeconds";

const getTimeStatus = (endTime) => {
  const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const remainingTime = endTime / 1000 - startTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = Math.abs(days * daySeconds);
  return { remainingTime, daysDuration };
};

export default getTimeStatus;
