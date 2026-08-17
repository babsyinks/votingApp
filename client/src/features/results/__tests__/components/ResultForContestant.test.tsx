import { render, screen } from "@testing-library/react";
import ResultForContestant from "features/results/components/ResultForContestant";
import { result } from "../testData/result";
import type { ContestantFrameProps } from "features/election/components/contestant/ContestantFrame";
import type { ContestantMainInfoProps } from "features/election/components/contestant/info/ContestantMainInfo";
import type { ResultStatusIndicatorChooserProps } from "features/results/components/ResultStatusIndicatorChooser";
import { vi } from "vitest";

vi.mock(
  "features/election/components/contestant/ContestantFrame",
  () =>
    ({ children, className }: ContestantFrameProps) => (
      <div data-testid="contestant-frame" className={className}>
        {children}
      </div>
    ),
);

vi.mock(
  "features/election/components/contestant/info/ContestantMainInfo",
  () =>
    ({ contestant, showInfo, showExpandedStats }: ContestantMainInfoProps) => (
      <div data-testid="contestant-main-info">
        {contestant.surname} - info: {showInfo ? "yes" : "no"}, stats:{" "}
        {showExpandedStats ? "yes" : "no"}
      </div>
    ),
);

vi.mock(
  "features/results/components/ResultStatusIndicatorChooser",
  () =>
    ({
      contestantTotalVotes,
      isTie,
      index,
    }: ResultStatusIndicatorChooserProps) => (
      <div data-testid="status-indicator">
        votes: {contestantTotalVotes}, tie: {isTie ? "yes" : "no"}, index:{" "}
        {index}
      </div>
    ),
);

describe("ResultForContestant", () => {
  const mockContestant = result[0].contestants[0];

  it("renders ContestantMainInfo and ResultStatusIndicatorChooser with correct props", () => {
    render(
      <ResultForContestant
        contestant={mockContestant}
        isTie={false}
        index={1}
      />,
    );

    expect(screen.getByTestId("contestant-frame")).toBeInTheDocument();
    expect(screen.getByTestId("contestant-frame")).toHaveClass("mb-10p");

    expect(screen.getByTestId("contestant-main-info")).toHaveTextContent(
      "Alice",
    );
    expect(screen.getByTestId("contestant-main-info")).toHaveTextContent(
      "info: yes",
    );
    expect(screen.getByTestId("contestant-main-info")).toHaveTextContent(
      "stats: no",
    );

    expect(screen.getByTestId("status-indicator")).toHaveTextContent(
      "votes: 2",
    );
    expect(screen.getByTestId("status-indicator")).toHaveTextContent("tie: no");
    expect(screen.getByTestId("status-indicator")).toHaveTextContent(
      "index: 1",
    );
  });

  it("correctly shows tie indicator", () => {
    render(
      <ResultForContestant
        contestant={mockContestant}
        isTie={true}
        index={0}
      />,
    );

    expect(screen.getByTestId("status-indicator")).toHaveTextContent(
      "tie: yes",
    );
  });
});
