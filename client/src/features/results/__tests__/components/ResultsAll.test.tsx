import { render, screen, fireEvent } from "@testing-library/react";
import ResultsAll from "features/results/components/ResultsAll";
import getSortedResults from "../../helpers/getSortedResults";
import { result as mockResult } from "../testData/result";
import type { ResultsPositionsTabsProps } from "features/results/components/ResultsPositionsTabs";
import type { ContestantType } from "features/election/types/contestantType";
import { vi } from "vitest";

vi.mock("../../helpers/getSortedResults");

const getSortedResultsMock = vi.mocked(getSortedResults);

vi.mock("features/results/components/ResultsPositionsTabs", () => {
  return function MockResultsPositionsTabs({
    currentIndex,
    setCurrentIndex,
  }: ResultsPositionsTabsProps) {
    return (
      <div data-testid="results-tabs">
        Tab Index: {currentIndex}
        <button onClick={() => setCurrentIndex(1)}>Switch to 1</button>
      </div>
    );
  };
});

vi.mock("features/results/components/ResultForAllContestants", () => {
  return function MockResultForAllContestants({
    sortedResults,
  }: {
    sortedResults: ContestantType[];
  }) {
    return (
      <div data-testid="result-for-all">
        {sortedResults.map((c) => c.surname).join(", ")}
      </div>
    );
  };
});

describe("ResultsAll", () => {
  beforeEach(() => {
    getSortedResultsMock.mockImplementation((result, index) => {
      return result[index].contestants;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading and child components with correct props", () => {
    render(<ResultsAll result={mockResult} />);

    expect(
      screen.getByRole("heading", { name: /election results/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("results-tabs")).toHaveTextContent(
      "Tab Index: 0",
    );

    expect(getSortedResultsMock).toHaveBeenCalledWith(mockResult, 0);

    expect(screen.getByTestId("result-for-all")).toHaveTextContent(
      "Alice, Bob",
    );
  });

  it("updates currentIndex when tab is clicked and shows correct results", () => {
    render(<ResultsAll result={mockResult} />);

    const button = screen.getByRole("button", { name: /switch to 1/i });
    fireEvent.click(button);

    // getSortedResults is called again with new index
    expect(getSortedResultsMock).toHaveBeenCalledWith(mockResult, 1);

    // Check if new contestants are rendered
    expect(screen.getByTestId("result-for-all")).toHaveTextContent(
      "Brad, Robert",
    );

    // Verify updated index in tab
    expect(screen.getByTestId("results-tabs")).toHaveTextContent(
      "Tab Index: 1",
    );
  });
});
