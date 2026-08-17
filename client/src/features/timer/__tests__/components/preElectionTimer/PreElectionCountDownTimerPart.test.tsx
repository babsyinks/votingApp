import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import PreElectionCountDownTimerPart from "features/timer/components/preElectionTimer/PreElectionCountDownTimerPart";
import type { PreElectionCountDownTimerValueProps } from "features/timer/components/preElectionTimer/PreElectionCountDownTimerValue";
import { vi } from "vitest";

vi.mock(
  "features/timer/components/preElectionTimer/PreElectionCountDownTimerValue",
  () =>
    ({ dimension, time }: PreElectionCountDownTimerValueProps) => (
      <div data-testid="value">
        <div>dimension - {dimension}</div>
        <div>time - {time}</div>
      </div>
    ),
);

interface CountdownCircleTimerProps {
  children: (props: {
    elapsedTime: number;
    remainingTime: number;
  }) => ReactNode;
  duration: number;
  isPlaying?: boolean;
  colors: string | string[];
  onComplete?: (totalElapsedTime: number) => { shouldRepeat: boolean };
  [key: string]: unknown;
}

vi.mock("react-countdown-circle-timer", () => ({
  CountdownCircleTimer: ({ children, ...props }: CountdownCircleTimerProps) => {
    (global as any).lastCountdownProps = props;
    return (
      <div data-testid="circle-timer">
        {children({ elapsedTime: 15, remainingTime: 45 })}
      </div>
    );
  },
}));

describe("PreElectionCountDownTimerPart", () => {
  let glb = global as any;
  it("renders PreElectionCountDownTimerValue with correct props", () => {
    render(
      <PreElectionCountDownTimerPart
        duration={60}
        remainingTime={45}
        color={["#D14081", "#7E2E84"]}
        type="seconds"
      />,
    );

    const value = screen.getByTestId("value");
    expect(value).toHaveTextContent("dimension - seconds");
    expect(value).toHaveTextContent("time - 45");
  });

  it("does NOT include onComplete prop when type === 'days'", () => {
    render(
      <PreElectionCountDownTimerPart
        duration={86400}
        remainingTime={86400}
        color="#218380"
        type="days"
      />,
    );

    expect(glb.lastCountdownProps.onComplete).toBeUndefined();
  });

  it("includes onComplete prop when type !== 'days'", () => {
    render(
      <PreElectionCountDownTimerPart
        duration={60}
        remainingTime={90}
        color="#7E2E84"
        type="seconds"
      />,
    );

    expect(typeof glb.lastCountdownProps.onComplete).toBe("function");

    // Simulate onComplete with elapsedTime = 30; 60 seconds remaining.
    const result = glb.lastCountdownProps.onComplete(30);
    expect(result).toEqual({ shouldRepeat: true });

    // Simulate onComplete with elapsedTime = 90; 0 seconds remaining.
    const result2 = glb.lastCountdownProps.onComplete(90);
    expect(result2).toEqual({ shouldRepeat: false });
  });
});
