import React from "react";
import { render, screen } from "@testing-library/react";
import ResultForContestant from "features/results/components/ResultForContestant";

jest.mock(
  "features/election/components/contestant/ContestantFrame",
  () =>
    ({ children, className }) => (
      <div data-testid="contestant-frame" className={className}>
        {children}
      </div>
    ),
);

jest.mock(
  "features/election/components/contestant/info/ContestantMainInfo",
  () =>
    ({ contestant, showInfo, showExpandedStats }) => (
      <div data-testid="contestant-main-info">
        {contestant.name} - info: {showInfo ? "yes" : "no"}, stats:{" "}
        {showExpandedStats ? "yes" : "no"}
      </div>
    ),
);

jest.mock(
  "features/results/components/ResultStatusIndicatorChooser",
  () =>
    ({ contestantTotalVotes, isTie, index }) => (
      <div data-testid="status-indicator">
        votes: {contestantTotalVotes}, tie: {isTie ? "yes" : "no"}, index: {index}
      </div>
    ),
);

describe("ResultForContestant", () => {
  const mockContestant = {
    name: "John Doe",
    votes: [1, 2, 3],
  };

  it("renders ContestantMainInfo and ResultStatusIndicatorChooser with correct props", () => {
    render(<ResultForContestant contestant={mockContestant} isTie={false} index={1} />);

    expect(screen.getByTestId("contestant-frame")).toBeInTheDocument();
    expect(screen.getByTestId("contestant-frame")).toHaveClass("mb-10");

    expect(screen.getByTestId("contestant-main-info")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("contestant-main-info")).toHaveTextContent("info: yes");
    expect(screen.getByTestId("contestant-main-info")).toHaveTextContent("stats: no");

    expect(screen.getByTestId("status-indicator")).toHaveTextContent("votes: 3");
    expect(screen.getByTestId("status-indicator")).toHaveTextContent("tie: no");
    expect(screen.getByTestId("status-indicator")).toHaveTextContent("index: 1");
  });

  it("correctly shows tie indicator", () => {
    render(<ResultForContestant contestant={mockContestant} isTie={true} index={0} />);

    expect(screen.getByTestId("status-indicator")).toHaveTextContent("tie: yes");
  });
});
