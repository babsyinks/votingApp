import React from "react";
import { render, screen } from "@testing-library/react";

import { useSelector } from "react-redux";
import { getAllVotesInACategory, getAllContestantsInCategory } from "../../electionSlice";
import ElectivePositionDetails from "features/election/components/ElectivePositionDetails";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("../../electionSlice", () => ({
  getAllVotesInACategory: jest.fn(),
  getAllContestantsInCategory: jest.fn(),
}));

jest.mock(
  "features/election/components/ElectivePositionDetailsSummary",
  () =>
    ({ position, totalContestants, totalVotes }) => (
      <div data-testid="summary">
        {`position - ${position}`}
        {`totalContestants - ${totalContestants}`}
        {`totalVotes - ${totalVotes}`}
      </div>
    ),
);

jest.mock(
  "features/election/components/ElectivePositionDetailsContestants",
  () =>
    ({ contestantsList, position, listOfVotesCastInCategory }) => (
      <div data-testid="contestants">
        {`contestantsList - ${JSON.stringify(contestantsList)}`}
        {`position - ${position}`}
        {`listOfVotesCastInCategory - ${JSON.stringify(listOfVotesCastInCategory)}`}
      </div>
    ),
);

describe("ElectivePositionDetails", () => {
  const mockPosition = "President";
  const mockProps = {
    contestantsDetailsByPosition: { position: mockPosition },
  };

  const mockVotes = ["v1", "v2"];
  const mockContestants = [
    { contestant_id: "1", name: "Alice" },
    { contestant_id: "2", name: "Bob" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    getAllVotesInACategory.mockImplementation((pos) => () => mockVotes);
    getAllContestantsInCategory.mockImplementation((pos) => () => mockContestants);

    useSelector
      .mockImplementationOnce(getAllVotesInACategory(mockPosition))
      .mockImplementationOnce(getAllContestantsInCategory(mockPosition));
  });

  it("renders summary and contestant components with correct props", () => {
    render(<ElectivePositionDetails {...mockProps} />);
    const summary = screen.getByTestId("summary");
    const contestantsDetails = screen.getByTestId("contestants");

    expect(summary).toBeInTheDocument();
    expect(contestantsDetails).toBeInTheDocument();

    expect(summary.textContent.includes(`position - ${mockPosition}`)).toBe(true);
    expect(summary.textContent.includes(`totalContestants - ${mockContestants.length}`)).toBe(true);
    expect(summary.textContent.includes(`totalVotes - ${mockVotes.length}`)).toBe(true);

    expect(
      contestantsDetails.textContent.includes(
        `contestantsList - ${JSON.stringify(mockContestants)}`,
      ),
    ).toBe(true);
    expect(contestantsDetails.textContent.includes(`position - ${mockPosition}`)).toBe(true);
    expect(
      contestantsDetails.textContent.includes(
        `listOfVotesCastInCategory - ${JSON.stringify(mockVotes)}`,
      ),
    ).toBe(true);
  });
});
