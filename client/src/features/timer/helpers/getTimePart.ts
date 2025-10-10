import {
  minuteSeconds,
  hourSeconds,
  daySeconds,
} from "../data/timePartsInSeconds";

type TimePartType = "days" | "hours" | "minutes" | "seconds";

const timeFunctionMapper: Record<TimePartType, (time: number) => number> = {
  days: (time) => (time / daySeconds) | 0,
  hours: (time) => ((time % daySeconds) / hourSeconds) | 0,
  minutes: (time) => ((time % hourSeconds) / minuteSeconds) | 0,
  seconds: (time) => (minuteSeconds - time) | 0,
};

interface GetTimePartParams {
  type: TimePartType;
  time: number;
}

/**
 * Helps retrieve a part of time (days, hours, minutes, or seconds) from a given timestamp that is
 * already converted to seconds.
 *
 * @param param.type - The type of the time component to get. E.g. "seconds".
 * @param param.time - The time in seconds.
 * @returns number
 */
const getTimePart = ({ type, time }: GetTimePartParams): number => {
  return timeFunctionMapper[type](time);
};

export default getTimePart;
