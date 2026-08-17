
import { render, screen } from "@testing-library/react";
import PreElectionCountDownTimer from "features/timer/components/preElectionTimer/PreElectionCountDownTimer";
import * as useOrientationHook from "hooks/useOrientation";
import * as getTimeStatusHelper from "features/timer/helpers/getTimeStatus";
import * as getTimerConfig from "features/timer/data/getPreElectionTimerSettings";
import type { BlockProps } from "components/ui/Block";
import type { PreElectionCountDownTimerPartProps } from "features/timer/components/preElectionTimer/PreElectionCountDownTimerPart";
import { vi } from "vitest";

vi.mock(
  "features/timer/components/preElectionTimer/PreElectionCountDownTimerPart",
  () =>
    ({ remainingTime, type }: PreElectionCountDownTimerPartProps) => (
      <div data-testid="timer-part">
        {type}-{remainingTime}
      </div>
    ),
);

vi.mock(
  "components/ui/Block",
  () =>
    ({ type, className, children }: BlockProps) => {
      return (
        <div data-testid="pre-election-root" className={`${type} ${className}`}>
          {children}
        </div>
      );
    },
);

describe("PreElectionCountDownTimer", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(getTimeStatusHelper, "default").mockReturnValue({
      remainingTime: 100,
      daysDuration: 3,
    });

    vi.spyOn(getTimerConfig, "default").mockReturnValue([
      { type: "days", duration: 3, color: "#7E2E84" },
      { type: "hours", duration: 24, color: "#D14081" },
      { type: "minutes", duration: 60, color: "#EF798A" },
      { type: "seconds", duration: 60, color: "#218380" },
    ]);
  });

  it("renders the correct number of timer parts", () => {
    vi.spyOn(useOrientationHook, "default").mockReturnValue(true);

    render(<PreElectionCountDownTimer endTime={9999999} />);

    const parts = screen.getAllByTestId("timer-part");
    expect(parts).toHaveLength(4);
  });

  it("renders timer parts with correct props", () => {
    vi.spyOn(useOrientationHook, "default").mockReturnValue(true);

    render(<PreElectionCountDownTimer endTime={9999999} />);

    const parts = screen
      .getAllByTestId("timer-part")
      .map((el) => el.textContent);
    expect(parts).toEqual([
      "days-100",
      "hours-100",
      "minutes-100",
      "seconds-100",
    ]);
  });

  it("uses vertical layout in portrait mode", () => {
    vi.spyOn(useOrientationHook, "default").mockReturnValue(true);

    render(<PreElectionCountDownTimer endTime={9999999} />);
    const root = screen.getByTestId("pre-election-root");
    expect(root).toHaveClass("flex-vert-sa");
  });

  it("uses horizontal layout in landscape mode", () => {
    vi.spyOn(useOrientationHook, "default").mockReturnValue(false);

    render(<PreElectionCountDownTimer endTime={9999999} />);
    const root = screen.getByTestId("pre-election-root");
    expect(root).toHaveClass("flex-horz-sa");
  });
});
