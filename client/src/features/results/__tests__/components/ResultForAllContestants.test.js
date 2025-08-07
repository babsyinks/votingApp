import React from "react";
import { render, screen } from "@testing-library/react";
import ResultForAllContestants from "features/results/components/ResultForAllContestants";
import { getTieStatusMock } from "../../helpers/getTieStatus";

jest.mock("features/results/components/ResultForContestant", () => {
  return function MockResultForContestant({ contestant, isTie, index }) {
    return (
      <div data-testid="result-contestant">
        {contestant.name}, votes: {contestant.votes.length}, tie: {isTie ? "yes" : "no"}, index:{" "}
        {index}
      </div>
    );
  };
});

jest.mock("../../helpers/getTieStatus", () => {
  const getTieStatusMock = jest.fn();
  return {
    __esModule: true,
    default: getTieStatusMock,
    getTieStatusMock,
  };
});

describe("ResultForAllContestants", () => {
  const mockSortedResults = [
    { name: "Alice", votes: [1, 2, 3] },
    { name: "Bob", votes: [4, 5] },
    { name: "Charlie", votes: [6] },
  ];

  beforeEach(() => {
    getTieStatusMock.mockImplementation(({ index }) => index === 1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a ResultForContestant for each contestant in sortedResults", () => {
    render(<ResultForAllContestants sortedResults={mockSortedResults} />);

    const contestants = screen.getAllByTestId("result-contestant");
    expect(contestants).toHaveLength(3);

    expect(contestants[0]).toHaveTextContent("Alice");
    expect(contestants[0]).toHaveTextContent("votes: 3");
    expect(contestants[0]).toHaveTextContent("tie: no");
    expect(contestants[0]).toHaveTextContent("index: 0");

    expect(contestants[1]).toHaveTextContent("Bob");
    expect(contestants[1]).toHaveTextContent("votes: 2");
    expect(contestants[1]).toHaveTextContent("tie: yes");
    expect(contestants[1]).toHaveTextContent("index: 1");

    expect(contestants[2]).toHaveTextContent("Charlie");
    expect(contestants[2]).toHaveTextContent("votes: 1");
    expect(contestants[2]).toHaveTextContent("tie: no");
    expect(contestants[2]).toHaveTextContent("index: 2");
  });

  it("calls getTieStatus with correct arguments", () => {
    render(<ResultForAllContestants sortedResults={mockSortedResults} />);

    expect(getTieStatusMock).toHaveBeenCalledTimes(3);

    expect(getTieStatusMock).toHaveBeenCalledWith({
      sortedResults: mockSortedResults,
      index: 0,
      votes: mockSortedResults[0].votes,
      highestVote: 3,
    });

    expect(getTieStatusMock).toHaveBeenCalledWith({
      sortedResults: mockSortedResults,
      index: 1,
      votes: mockSortedResults[1].votes,
      highestVote: 3,
    });

    expect(getTieStatusMock).toHaveBeenCalledWith({
      sortedResults: mockSortedResults,
      index: 2,
      votes: mockSortedResults[2].votes,
      highestVote: 3,
    });
  });
});
