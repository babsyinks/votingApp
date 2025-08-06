import React from "react";
import { render, screen } from "@testing-library/react";
import ElectivePositionDetailsSummary from "features/election/components/ElectivePositionDetailsSummary";

jest.mock("components/ui/Block", () => ({ children, ...props }) => (
  <div data-testid="mock-block" {...props}>
    {children}
  </div>
));

jest.mock(
  "features/election/components/ElectivePositionDetailsSummaryPart",
  () =>
    ({ label, value }) => (
      <div data-testid="summary-part">
        {label}: {value}
      </div>
    ),
);

describe("ElectivePositionDetailsSummary", () => {
  const mockProps = {
    position: "President",
    totalVotes: 1000,
    totalContestants: 5,
  };

  it("renders 3 summary parts", () => {
    render(<ElectivePositionDetailsSummary {...mockProps} />);
    const parts = screen.getAllByTestId("summary-part");
    expect(parts).toHaveLength(3);
  });

  it("renders correct labels and values", () => {
    render(<ElectivePositionDetailsSummary {...mockProps} />);
    expect(screen.getByText(/Position: President/i)).toBeInTheDocument();
    expect(screen.getByText(/Number Of Contestants: 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Votes Cast: 1000/i)).toBeInTheDocument();
  });

  it("renders wrapper with correct classes", () => {
    render(<ElectivePositionDetailsSummary {...mockProps} />);
    const wrapper = screen.getByTestId("mock-block");
    expect(wrapper).toHaveClass("border-rounded-5"); 
    expect(wrapper).toHaveClass("bg-black");
    expect(wrapper).toHaveClass("text-white");
    expect(wrapper).toHaveClass("ff-patrick");
    expect(wrapper).toHaveClass("my-10-mx-5");
    expect(wrapper).toHaveClass("tt-cap");
  });
});
