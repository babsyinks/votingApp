import {
  minuteSeconds,
  hourSeconds,
  daySeconds,
} from "../config/timePartsInSeconds";

const timeFunctionMapper = {
  days: (time) => time / daySeconds | 0,
  hours: (time) => (time % daySeconds) / hourSeconds | 0,
  minutes: (time) => (time % hourSeconds) / minuteSeconds | 0,
  seconds: (time) => minuteSeconds - time | 0,
};

/**
 * Helps retrieve a part of time (days, hours, minutes, or seconds) from a given timestamp that is
 * already converted to seconds.
 *
 * @param {Object} param - Parameter object
 * @param {Enum<string>} [param.type] - The type of the time component to get. E.g seconds.
 * @param {number} [param.time] - The time in seconds.
 * @returns {number}
 */
const getTimePart = ({ type, time }) => {
  const validTypes = ["days", "hours", "minutes", "seconds"];
  if (!validTypes.includes(type)) {
    throw new Error(
      `${type} is invalid. It should be any of ${validTypes.join(", ")}`,
    );
  }
  return timeFunctionMapper[type](time);
};

export default getTimePart;
