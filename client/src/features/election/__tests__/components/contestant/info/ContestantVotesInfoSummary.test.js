import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantVotesInfoSummary from "features/election/components/contestant/info/ContestantVotesInfoSummary";

jest.mock(
  "features/election/components/contestant/info/ContestantVotesInfo",
  () =>
    ({ type, showInfo, children }) => (
      <div data-testid="votes-info-mock">
        {type}:{showInfo ? children : null}
      </div>
    ),
);

jest.mock("components/ui/Span", () => ({ children, ...props }) => (
  <span {...props}>{children}</span>
));

describe("ContestantVotesInfoSummary", () => {
  const defaultProps = {
    showInfo: true,
    contestantVotes: 120,
    totalVotes: 200,
    showExpandedStats: true,
  };

  it("renders contestantVotes and totalVotes when showExpandedStats is true", () => {
    render(<ContestantVotesInfoSummary {...defaultProps} />);

    const wrapper = screen.getByTestId("votes-info-mock");
    expect(wrapper).toHaveTextContent("Votes:120 out of 200");
  });

  it("renders only contestantVotes when showExpandedStats is false", () => {
    render(<ContestantVotesInfoSummary {...defaultProps} showExpandedStats={false} />);

    const wrapper = screen.getByTestId("votes-info-mock");
    expect(wrapper).toHaveTextContent("Votes:120");
    expect(wrapper).not.toHaveTextContent("out of 200");
  });

  it("renders nothing inside ContestantVotesInfo when showInfo is false", () => {
    render(<ContestantVotesInfoSummary {...defaultProps} showInfo={false} />);

    const wrapper = screen.getByTestId("votes-info-mock");
    expect(wrapper).toHaveTextContent("Votes:");
    expect(wrapper).not.toHaveTextContent("120");
    expect(wrapper).not.toHaveTextContent("200");
  });

  it("renders with different numbers correctly", () => {
    render(
      <ContestantVotesInfoSummary
        showInfo={true}
        contestantVotes={0}
        totalVotes={99}
        showExpandedStats={true}
      />,
    );

    const wrapper = screen.getByTestId("votes-info-mock");
    expect(wrapper).toHaveTextContent("0 out of 99");
  });
});
