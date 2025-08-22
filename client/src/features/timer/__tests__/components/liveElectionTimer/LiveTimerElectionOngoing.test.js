import { render, screen } from "@testing-library/react";
import LiveTimerElectionOngoing from "features/timer/components/liveElectionTimer/LiveTimerElectionOngoing";

jest.mock("components/ui/Span", () => {
  return ({ children, className }) => (
    <span data-testid="custom-span" className={className}>
      {children}
    </span>
  );
});

describe("LiveTimerElectionOngoing", () => {
  test("renders with all singular units", () => {
    render(<LiveTimerElectionOngoing days={1} hours={1} minutes={1} seconds={1} />);
    expect(screen.getByText("1 day, 1 hour, 1 minute, 1 second.")).toBeInTheDocument();
  });

  test("renders with pluralized units", () => {
    render(<LiveTimerElectionOngoing days={2} hours={3} minutes={4} seconds={5} />);
    expect(screen.getByText("2 days, 3 hours, 4 minutes, 5 seconds.")).toBeInTheDocument();
  });

  test("renders Span component with correct text and class", () => {
    render(<LiveTimerElectionOngoing days={0} hours={0} minutes={0} seconds={0} />);
    const span = screen.getByTestId("custom-span");
    expect(span).toHaveTextContent("Election Will End In:");
    expect(span).toHaveClass("text-red");
  });

  test("correctly handles mixed singular/plural cases", () => {
    render(<LiveTimerElectionOngoing days={1} hours={0} minutes={2} seconds={1} />);
    expect(screen.getByText("1 day, 0 hour, 2 minutes, 1 second.")).toBeInTheDocument();
  });
});
