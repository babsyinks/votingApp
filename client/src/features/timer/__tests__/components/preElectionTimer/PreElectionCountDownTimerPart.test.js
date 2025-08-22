import { render, screen } from "@testing-library/react";
import PreElectionCountDownTimerPart from "features/timer/components/preElectionTimer/PreElectionCountDownTimerPart";

jest.mock(
  "features/timer/components/preElectionTimer/PreElectionCountDownTimerValue",
  () =>
    ({ dimension, time }) => (
      <div data-testid="value">
        <div>dimension - {dimension}</div>
        <div>time - {time}</div>
      </div>
    )
);

jest.mock("react-countdown-circle-timer", () => ({
  CountdownCircleTimer: ({ children, ...props }) => {
    global.lastCountdownProps = props;
    return <div data-testid="circle-timer">{children({ elapsedTime: 15 })}</div>;
  },
}));

describe("PreElectionCountDownTimerPart", () => {
  it("renders PreElectionCountDownTimerValue with correct props", () => {
    render(
      <PreElectionCountDownTimerPart
        duration={60}
        remainingTime={45}
        color="red"
        type="seconds"
      />
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
        color="blue"
        type="days"
      />
    );

    expect(global.lastCountdownProps.onComplete).toBeUndefined();
  });

  it("includes onComplete prop when type !== 'days'", () => {
    render(
      <PreElectionCountDownTimerPart
        duration={60}
        remainingTime={90}
        color="green"
        type="seconds"
      />
    );

    expect(typeof global.lastCountdownProps.onComplete).toBe("function");

    // Simulate onComplete with elapsedTime = 30; 60 seconds remaining.
    const result = global.lastCountdownProps.onComplete(30);
    expect(result).toEqual({ shouldRepeat: true });

    // Simulate onComplete with elapsedTime = 90; 0 seconds remaining.
    const result2 = global.lastCountdownProps.onComplete(90);
    expect(result2).toEqual({ shouldRepeat: false });
  });
});
