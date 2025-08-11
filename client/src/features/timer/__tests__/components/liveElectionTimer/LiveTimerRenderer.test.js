import { render, screen } from "@testing-library/react";
import LiveTimerRenderer from "features/timer/components/liveElectionTimer/LiveTimerRenderer";

jest.mock("components/ui/Span", () => {
  return ({ children, className }) => (
    <span data-testid="mock-span" className={className}>
      {children}
    </span>
  );
});

jest.mock("features/timer/components/liveElectionTimer/LiveTimerElectionOver", () => () => (
  <div data-testid="election-over">Election is now over</div>
));
jest.mock("features/timer/components/liveElectionTimer/LiveTimerElectionOngoing", () => ({ days, hours, minutes, seconds }) => (
  <div data-testid="election-ongoing">
    Ends in: {days}d {hours}h {minutes}m {seconds}s
  </div>
));

describe("LiveTimerRenderer", () => {
  test("renders LiveTimerElectionOver if completed is true", () => {
    render(
      <LiveTimerRenderer
        completed={true}
        days={5}
        hours={3}
        minutes={30}
        seconds={15}
      />
    );

    expect(screen.getByTestId("election-over")).toBeInTheDocument();
    expect(screen.queryByTestId("election-ongoing")).not.toBeInTheDocument();

    const span = screen.getByTestId("mock-span");
    expect(span).toHaveClass("text-sky-blue fw-bold py-10 text-responsive-1p5");
  });

  test("renders LiveTimerElectionOngoing with correct props when completed is false", () => {
    render(
      <LiveTimerRenderer
        completed={false}
        days={2}
        hours={4}
        minutes={10}
        seconds={45}
      />
    );

    const ongoing = screen.getByTestId("election-ongoing");
    expect(ongoing).toHaveTextContent("Ends in: 2d 4h 10m 45s");
    expect(screen.queryByTestId("election-over")).not.toBeInTheDocument();

    const span = screen.getByTestId("mock-span");
    expect(span).toHaveClass("text-sky-blue fw-bold py-10 text-responsive-1p5");
  });
});
