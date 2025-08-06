import React from "react";
import { render, screen } from "@testing-library/react";
import ElectivePositionDetailsSummaryPart from "features/election/components/ElectivePositionDetailsSummaryPart";

jest.mock("components/ui/Block", () => ({ children, ...props }) => (
  <div data-testid="mock-block" {...props}>
    {children}
  </div>
));

describe("ElectivePositionDetailsSummaryPart", () => {
  it('renders an <h2> when label is "Position"', () => {
    render(<ElectivePositionDetailsSummaryPart label="Position" value="President" />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Position: President");
  });

  it('renders an <h3> for any label other than "Position"', () => {
    render(<ElectivePositionDetailsSummaryPart label="Location" value="Lagos" />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Location: Lagos");
  });

  it("applies correct classes to wrapper, heading and span", () => {
    render(<ElectivePositionDetailsSummaryPart label="Total Votes Cast" value="30" />);

    const wrapper = screen.getByTestId("mock-block")
    expect(wrapper).toHaveClass("z-30 bg-black w-full");

    const heading = screen.getByRole("heading");
    expect(heading).toHaveClass("ff-patrick my-7 ta-center");

    const span = screen.getByText("30");
    expect(span).toHaveClass("text-sky-blue");
  });
});
