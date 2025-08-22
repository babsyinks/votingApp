import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantMainInfo from "features/election/components/contestant/info/ContestantMainInfo";

jest.mock(
  "features/election/components/contestant/info/ContestantPicture",
  () =>
    ({ picture, showFullPicture }) => (
      <div data-testid="mock-picture">{`${picture} - ${showFullPicture}`}</div>
    ),
);

jest.mock(
  "features/election/components/contestant/info/ContestantBasicInfo",
  () =>
    ({ type, value }) => <div data-testid="mock-basic-info">{`${type}: ${value}`}</div>,
);

jest.mock(
  "features/election/components/contestant/info/ContestantVotesInfoSummary",
  () =>
    ({ showInfo, contestantVotes, totalVotes, showExpandedStats }) => (
      <div data-testid="mock-summary">
        {showInfo ? `${contestantVotes} out of ${totalVotes}` : "Hidden"}
      </div>
    ),
);

jest.mock(
  "features/election/components/contestant/info/ContestantVotesInfoStat",
  () =>
    ({ showInfo, contestantVotes, totalVotes, contestantElectionStatusColor }) => (
      <div data-testid="mock-stat">
        {showInfo
          ? `${contestantVotes}/${totalVotes} % - ${contestantElectionStatusColor}`
          : ""}
      </div>
    ),
);

describe("ContestantMainInfo", () => {
  const defaultProps = {
    contestant: {
      contestant_id: "id-1",
      surname: "Doe",
      firstname: "John",
      picture: "img-url",
      votes: [{}, {}, {}],
    },
    totalVotes: 10,
    showInfo: true,
    votePercentColor: {
      "id-1": "green",
    },
  };

  it("renders all components with showExpandedStats = true (default)", () => {
    render(<ContestantMainInfo {...defaultProps} />);

    expect(screen.getByTestId("mock-picture")).toHaveTextContent("img-url - false");
    expect(screen.getByTestId("mock-basic-info")).toHaveTextContent("Name: Doe John");
    expect(screen.getByTestId("mock-summary")).toHaveTextContent("3 out of 10");
    expect(screen.getByTestId("mock-stat")).toHaveTextContent("3/10 % - green");
  });

  it("renders without ContestantVotesInfoStat when showExpandedStats is false", () => {
    render(<ContestantMainInfo {...defaultProps} showExpandedStats={false} />);

    expect(screen.getByTestId("mock-picture")).toHaveTextContent("img-url - true");
    expect(screen.getByTestId("mock-summary")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-stat")).not.toBeInTheDocument();
  });

  it("shows hidden info if showInfo is false", () => {
    render(<ContestantMainInfo {...defaultProps} showInfo={false} />);

    expect(screen.getByTestId("mock-summary")).not.toHaveTextContent(); 
    expect(screen.getByTestId("mock-stat")).not.toHaveTextContent();
  });

  it("handles zero votes gracefully", () => {
    const contestant = {
      ...defaultProps.contestant,
      votes: [],
    };
    render(<ContestantMainInfo {...defaultProps} contestant={contestant} />);

    expect(screen.getByTestId("mock-summary")).toHaveTextContent("0 out of 10");
    expect(screen.getByTestId("mock-stat")).toHaveTextContent("0/10 % - green");
  });
});
