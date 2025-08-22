import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultsAll from "features/results/components/ResultsAll";
import { getSortedResultsMock } from "../../helpers/getSortedResults";

jest.mock("../../helpers/getSortedResults", () => {
  const getSortedResultsMock = jest.fn();
  return {
    __esModule: true,
    default: getSortedResultsMock,
    getSortedResultsMock,
  };
});

jest.mock("features/results/components/ResultsPositionsTabs", () => {
  return function MockResultsPositionsTabs({ result, currentIndex, setCurrentIndex }) {
    return (
      <div data-testid="results-tabs">
        Tab Index: {currentIndex}
        <button onClick={() => setCurrentIndex(1)}>Switch to 1</button>
      </div>
    );
  };
});

jest.mock("features/results/components/ResultForAllContestants", () => {
  return function MockResultForAllContestants({ sortedResults }) {
    return <div data-testid="result-for-all">{sortedResults.map((c) => c.name).join(", ")}</div>;
  };
});

describe("ResultsAll", () => {
  const mockResult = [
    {
      position: "President",
      contestants: [
        { name: "Alice", votes: [1, 2] },
        { name: "Bob", votes: [3] },
      ],
    },
    {
      position: "Vice President",
      contestants: [
        { name: "Charlie", votes: [4, 5] },
        { name: "Dana", votes: [] },
      ],
    },
  ];

  beforeEach(() => {
    getSortedResultsMock.mockImplementation((result, index) => {
      return result[index].contestants;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders heading and child components with correct props", () => {
    render(<ResultsAll result={mockResult} />);

    expect(screen.getByRole("heading", { name: /election results/i })).toBeInTheDocument();

    expect(screen.getByTestId("results-tabs")).toHaveTextContent("Tab Index: 0");

    expect(getSortedResultsMock).toHaveBeenCalledWith(mockResult, 0);

    expect(screen.getByTestId("result-for-all")).toHaveTextContent("Alice, Bob");
  });

  it("updates currentIndex when tab is clicked and shows correct results", () => {
    render(<ResultsAll result={mockResult} />);

    const button = screen.getByRole("button", { name: /switch to 1/i });
    fireEvent.click(button);

    // getSortedResults is called again with new index
    expect(getSortedResultsMock).toHaveBeenCalledWith(mockResult, 1);

    // Check if new contestants are rendered
    expect(screen.getByTestId("result-for-all")).toHaveTextContent("Charlie, Dana");

    // Verify updated index in tab
    expect(screen.getByTestId("results-tabs")).toHaveTextContent("Tab Index: 1");
  });
});
