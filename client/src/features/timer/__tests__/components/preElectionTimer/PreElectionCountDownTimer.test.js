import React from "react";
import { render, screen } from "@testing-library/react";
import PreElectionCountDownTimer from "features/timer/components/preElectionTimer/PreElectionCountDownTimer";
import * as useOrientationHook from "hooks/useOrientation";
import * as getTimeStatusHelper from "features/timer/helpers/getTimeStatus";
import * as getTimerConfig from "features/timer/config/getPreElectionTimerConfig";

jest.mock(
  "features/timer/components/preElectionTimer/PreElectionCountDownTimerPart",
  () =>
    ({ remainingTime, type }) => (
      <div data-testid="timer-part">
        {type}-{remainingTime}
      </div>
    ),
);

jest.mock("components/ui/Block", () => ({ type, className, children }) => {
  return (
    <div data-testid="pre-election-root" className={`${type} ${className}`}>
      {children}
    </div>
  );
});

describe("PreElectionCountDownTimer", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(getTimeStatusHelper, "default").mockReturnValue({
      remainingTime: 100,
      daysDuration: 3,
    });

    jest.spyOn(getTimerConfig, "default").mockReturnValue([
      { type: "days", duration: 3, color: "blue" },
      { type: "hours", duration: 24, color: "green" },
      { type: "minutes", duration: 60, color: "yellow" },
      { type: "seconds", duration: 60, color: "red" },
    ]);
  });

  it("renders the correct number of timer parts", () => {
    jest.spyOn(useOrientationHook, "default").mockReturnValue(true);

    render(<PreElectionCountDownTimer endTime={9999999} />);

    const parts = screen.getAllByTestId("timer-part");
    expect(parts).toHaveLength(4);
  });

  it("renders timer parts with correct props", () => {
    jest.spyOn(useOrientationHook, "default").mockReturnValue(true);

    render(<PreElectionCountDownTimer endTime={9999999} />);

    const parts = screen.getAllByTestId("timer-part").map((el) => el.textContent);
    expect(parts).toEqual(["days-100", "hours-100", "minutes-100", "seconds-100"]);
  });

  it("uses vertical layout in portrait mode", () => {
    jest.spyOn(useOrientationHook, "default").mockReturnValue(true);

    render(<PreElectionCountDownTimer endTime={9999999} />);
    const root = screen.getByTestId("pre-election-root");
    expect(root).toHaveClass("flex-vert-sa");
  });

  it("uses horizontal layout in landscape mode", () => {
    jest.spyOn(useOrientationHook, "default").mockReturnValue(false);

    render(<PreElectionCountDownTimer endTime={9999999} />);
    const root = screen.getByTestId("pre-election-root");
    expect(root).toHaveClass("flex-horz-sa");
  });
});
