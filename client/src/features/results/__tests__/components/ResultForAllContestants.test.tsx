import { render, screen } from "@testing-library/react";
import ResultForAllContestants from "features/results/components/ResultForAllContestants";
import getTieStatus from "features/results/helpers/getTieStatus";
import { result } from "../testData/result";
import type { ResultForContestantProps } from "features/results/components/ResultForContestant";

jest.mock("features/results/components/ResultForContestant", () => {
  return function MockResultForContestant({
    contestant,
    isTie,
    index,
  }: ResultForContestantProps) {
    return (
      <div data-testid="result-contestant">
        {contestant.surname}, votes: {contestant.votes.length}, tie:{" "}
        {isTie ? "yes" : "no"}, index: {index}
      </div>
    );
  };
});

jest.mock("../../helpers/getTieStatus");
const getTieStatusMock = jest.mocked(getTieStatus);

describe("ResultForAllContestants", () => {
  const mockSortedResults = result[0].contestants;

  beforeEach(() => {
    getTieStatusMock.mockImplementation(({ index }) => index === 1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a ResultForContestant for each contestant in sortedResults", () => {
    render(<ResultForAllContestants sortedResults={mockSortedResults} />);

    const contestants = screen.getAllByTestId("result-contestant");
    expect(contestants).toHaveLength(2);

    expect(contestants[0]).toHaveTextContent("Alice");
    expect(contestants[0]).toHaveTextContent("votes: 2");
    expect(contestants[0]).toHaveTextContent("tie: no");
    expect(contestants[0]).toHaveTextContent("index: 0");

    expect(contestants[1]).toHaveTextContent("Bob");
    expect(contestants[1]).toHaveTextContent("votes: 1");
    expect(contestants[1]).toHaveTextContent("tie: yes");
    expect(contestants[1]).toHaveTextContent("index: 1");
  });

  it("calls getTieStatus with correct arguments", () => {
    render(<ResultForAllContestants sortedResults={mockSortedResults} />);

    expect(getTieStatusMock).toHaveBeenCalledTimes(2);

    expect(getTieStatusMock).toHaveBeenCalledWith({
      sortedResults: mockSortedResults,
      index: 0,
      votes: mockSortedResults[0].votes,
      highestVote: 2,
    });

    expect(getTieStatusMock).toHaveBeenCalledWith({
      sortedResults: mockSortedResults,
      index: 1,
      votes: mockSortedResults[1].votes,
      highestVote: 2,
    });
  });
});
