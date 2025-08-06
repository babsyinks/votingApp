import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantVotesInfoStat from "features/election/components/contestant/info/ContestantVotesInfoStat";

jest.mock(
  "features/election/components/contestant/info/ContestantVotesInfo",
  () =>
    ({ type, showInfo, children }) => (
      <div data-testid="votes-info">
        {type}:{showInfo ? children : null}
      </div>
    ),
);

jest.mock("components/ui/Span", () => ({ children, ...props }) => (
  <span {...props}>{children}</span>
));

describe("ContestantVotesInfoStat", () => {
  const defaultProps = {
    showInfo: true,
    contestantVotes: 50,
    totalVotes: 100,
    contestantElectionStatusColor: "green",
  };

  it("renders the percentage correctly with default props", () => {
    render(<ContestantVotesInfoStat {...defaultProps} />);

    const info = screen.getByTestId("votes-info");
    expect(info).toHaveTextContent("Vote Percent:50%");
  });

  it("shows 0% when both contestantVotes and totalVotes are 0", () => {
    render(
      <ContestantVotesInfoStat
        showInfo={true}
        contestantVotes={0}
        totalVotes={0}
        contestantElectionStatusColor="red"
      />,
    );

    expect(screen.getByTestId("votes-info")).toHaveTextContent("0%");
  });

  it("rounds the vote percentage correctly", () => {
    render(
      <ContestantVotesInfoStat
        showInfo={true}
        contestantVotes={1}
        totalVotes={3}
        contestantElectionStatusColor="yellow"
      />,
    );

    expect(screen.getByTestId("votes-info")).toHaveTextContent("33%");
  });

  it("does not show percentage when showInfo is false", () => {
    render(
      <ContestantVotesInfoStat
        showInfo={false}
        contestantVotes={50}
        totalVotes={100}
        contestantElectionStatusColor="green"
      />,
    );

    expect(screen.getByTestId("votes-info")).toHaveTextContent("Vote Percent:");
    expect(screen.getByTestId("votes-info")).not.toHaveTextContent("50%");
  });

  it("applies the correct color style to the inner Span", () => {
    render(<ContestantVotesInfoStat {...defaultProps} />);

    const span = screen.getByText("50%");
    expect(span).toHaveStyle("color: green");
  });
});
