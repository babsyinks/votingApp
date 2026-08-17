import getTimeStatus from "../../helpers/getTimeStatus";
import { daySeconds } from "../../data/timePartsInSeconds";
import { vi } from "vitest";

describe("c", () => {
  const now = Date.now();

  beforeAll(() => {
    // Freeze Date.now to a fixed point in time
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("should return remainingTime and daysDuration for exact 1 day", () => {
    const endTime = now + daySeconds * 1000; // 1 day from now in ms

    const { remainingTime, daysDuration } = getTimeStatus(endTime);

    expect(Math.floor(remainingTime)).toBe(daySeconds);
    expect(daysDuration).toBe(daySeconds);
  });

  test("should round up to 2 full days if remaining time is 1.1 days", () => {
    const onePointOneDays = daySeconds * 1.1 * 1000;
    const endTime = now + onePointOneDays;

    const { remainingTime, daysDuration } = getTimeStatus(endTime);

    expect(Math.ceil(remainingTime / daySeconds)).toBe(2);
    expect(daysDuration).toBe(2 * daySeconds);
  });

  test("should return 0 daysDuration and negative remainingTime if endTime is in the past", () => {
    const endTime = now - 10000; // 10 seconds in the past

    const { remainingTime, daysDuration } = getTimeStatus(endTime);

    expect(remainingTime).toBeLessThan(0);
    expect(daysDuration).toBe(0);
  });
});
