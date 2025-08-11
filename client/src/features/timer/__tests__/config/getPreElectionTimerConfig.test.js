import getPreElectionTimerConfig from "../../config/getPreElectionTimerConfig";
import { minuteSeconds, hourSeconds, daySeconds } from "../../config/timePartsInSeconds";

describe("getPreElectionTimerConfig", () => {
  it("should return 4 timer segments with correct types and colors", () => {
    const config = getPreElectionTimerConfig(3);

    expect(config).toHaveLength(4);

    expect(config[0]).toEqual({
      color: "#7E2E84",
      duration: 3,
      type: "days",
    });

    expect(config[1]).toEqual({
      color: "#D14081",
      duration: daySeconds,
      type: "hours",
    });

    expect(config[2]).toEqual({
      color: "#EF798A",
      duration: hourSeconds,
      type: "minutes",
    });

    expect(config[3]).toEqual({
      color: "#218380",
      duration: minuteSeconds,
      type: "seconds",
    });
  });

  it("should use the provided daysDuration as the first segment's duration", () => {
    const inputDays = 7;
    const config = getPreElectionTimerConfig(inputDays);

    expect(config[0].duration).toBe(inputDays);
    expect(config[0].type).toBe("days");
  });
});
