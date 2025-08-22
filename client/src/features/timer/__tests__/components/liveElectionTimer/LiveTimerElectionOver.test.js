import { render, screen } from "@testing-library/react";
import LiveTimerElectionOver from "../../../components/liveElectionTimer/LiveTimerElectionOver";

jest.mock("components/ui/Span", () => {
  return ({ children, className }) => (
    <span data-testid="custom-span" className={className}>
      {children}
    </span>
  );
});

describe("LiveTimerElectionOver", () => {
  test("renders the correct message", () => {
    render(<LiveTimerElectionOver />);
    expect(screen.getByText("Election Is Now Over!")).toBeInTheDocument();
  });

  test("applies the correct class name", () => {
    render(<LiveTimerElectionOver />);
    const span = screen.getByTestId("custom-span");
    expect(span).toHaveClass("text-red");
  });

  test("uses the Span component", () => {
    render(<LiveTimerElectionOver />);
    expect(screen.getByTestId("custom-span").tagName.toLowerCase()).toBe("span");
  });
});
