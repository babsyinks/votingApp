import { render, screen } from "@testing-library/react";
import PreElectionCountDownTimerValue from "features/timer/components/preElectionTimer/PreElectionCountDownTimerValue";
import type { BlockProps } from "components/ui/Block";

jest.mock("components/ui/Block", () => {
  return ({ children, className }: BlockProps) => (
    <div data-testid="block" className={className}>
      {children}
    </div>
  );
});

describe("PreElectionCountDownTimerValue", () => {
  test("renders time and dimension correctly", () => {
    render(<PreElectionCountDownTimerValue time={5} dimension="Minutes" />);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Minutes")).toBeInTheDocument();
  });

  test('applies "text-32" class to time block', () => {
    render(<PreElectionCountDownTimerValue time={12} dimension="Seconds" />);

    const timeBlock = screen.getByText("12");
    expect(timeBlock).toHaveClass("text-32");
  });

  test("renders exactly three Block components", () => {
    render(<PreElectionCountDownTimerValue time={99} dimension="Hours" />);

    const blocks = screen.getAllByTestId("block");
    expect(blocks.length).toBe(3);
  });
});
