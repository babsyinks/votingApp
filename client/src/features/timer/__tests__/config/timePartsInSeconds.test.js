import { minuteSeconds, hourSeconds, daySeconds } from "../../config/timePartsInSeconds";

describe("timePartsInSeconds", () => {
  test("should export correct values for time units in seconds", () => {
    expect(minuteSeconds).toBe(60);       // 60 seconds in a minute
    expect(hourSeconds).toBe(3600);       // 60 * 60 seconds in an hour
    expect(daySeconds).toBe(86400);       // 24 * 60 * 60 seconds in a day
  });
});
