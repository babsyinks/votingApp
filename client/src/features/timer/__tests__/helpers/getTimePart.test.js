import getTimePart from "../../helpers/getTimePart";
import {
  minuteSeconds,
  hourSeconds,
  daySeconds,
} from "../../config/timePartsInSeconds";

describe("getTimePart", () => {
  test("should return correct number of days", () => {
    const time = 3 * daySeconds + 5 * hourSeconds; // 3 days + 5 hours
    const result = getTimePart({ type: "days", time });
    expect(result).toBe(3);
  });

  test("should return correct number of hours (after removing full days)", () => {
    const time = 2 * daySeconds + 6 * hourSeconds + 30 * minuteSeconds;
    const result = getTimePart({ type: "hours", time });
    expect(result).toBe(6); // 6 hours left after full days
  });

  test("should return correct number of minutes (after removing full hours)", () => {
    const time = 1 * hourSeconds + 45 * minuteSeconds;
    const result = getTimePart({ type: "minutes", time });
    expect(result).toBe(45);
  });

  test("should return remaining seconds in a minute", () => {
    const time = 13;
    const result = getTimePart({ type: "seconds", time });
    expect(result).toBe(minuteSeconds - time); // 60 - 13 = 47
  });

  test("should throw an error for invalid type", () => {
    expect(() =>
      getTimePart({ type: "weeks", time: 1000 })
    ).toThrowError("weeks is invalid. It should be any of days, hours, minutes, seconds");
  });

  test("should throw an error if type is missing", () => {
    expect(() =>
      getTimePart({ time: 1000 })
    ).toThrowError("undefined is invalid. It should be any of days, hours, minutes, seconds");
  });
});
