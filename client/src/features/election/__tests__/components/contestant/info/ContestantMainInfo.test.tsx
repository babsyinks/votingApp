import { render, screen } from "@testing-library/react";
import ContestantMainInfo from "features/election/components/contestant/info/ContestantMainInfo";
import { ContestantPictureProps } from "features/election/components/contestant/info/ContestantPicture";
import { ContestantBasicInfoProps } from "features/election/components/contestant/info/ContestantBasicInfo";
import { ContestantVotesInfoSummaryProps } from "features/election/components/contestant/info/ContestantVotesInfoSummary";
import { ContestantVotesInfoStatProps } from "features/election/components/contestant/info/ContestantVotesInfoStat";
import { vi } from "vitest";

vi.mock(
  "features/election/components/contestant/info/ContestantPicture",
  () =>
    ({ picture, showFullPicture }: ContestantPictureProps) => (
      <div data-testid="mock-picture">{`${picture} - ${showFullPicture}`}</div>
    ),
);

vi.mock(
  "features/election/components/contestant/info/ContestantBasicInfo",
  () =>
    ({ type, value }: ContestantBasicInfoProps) => (
      <div data-testid="mock-basic-info">{`${type}: ${value}`}</div>
    ),
);

vi.mock(
  "features/election/components/contestant/info/ContestantVotesInfoSummary",
  () =>
    ({
      showInfo,
      contestantVotes,
      totalVotes,
    }: ContestantVotesInfoSummaryProps) => (
      <div data-testid="mock-summary">
        {showInfo ? `${contestantVotes} out of ${totalVotes}` : "Hidden"}
      </div>
    ),
);

vi.mock(
  "features/election/components/contestant/info/ContestantVotesInfoStat",
  () =>
    ({
      showInfo,
      contestantVotes,
      totalVotes,
      contestantElectionStatusColor,
    }: ContestantVotesInfoStatProps) => (
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
      manifesto: 'manifesto',
      votes: ['id1', 'id2', 'id3'],
    },
    totalVotes: 10,
    showInfo: true,
    votePercentColor: {
      "id-1": "green",
    },
  };

  it("renders all components with showExpandedStats = true (default)", () => {
    render(<ContestantMainInfo {...defaultProps} />);

    expect(screen.getByTestId("mock-picture")).toHaveTextContent(
      "img-url - false",
    );
    expect(screen.getByTestId("mock-basic-info")).toHaveTextContent(
      "Name: Doe John",
    );
    expect(screen.getByTestId("mock-summary")).toHaveTextContent("3 out of 10");
    expect(screen.getByTestId("mock-stat")).toHaveTextContent("3/10 % - green");
  });

  it("renders without ContestantVotesInfoStat when showExpandedStats is false", () => {
    render(<ContestantMainInfo {...defaultProps} showExpandedStats={false} />);

    expect(screen.getByTestId("mock-picture")).toHaveTextContent(
      "img-url - true",
    );
    expect(screen.getByTestId("mock-summary")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-stat")).not.toBeInTheDocument();
  });

  it("does not show hidden info if showInfo is false", () => {
    render(<ContestantMainInfo {...defaultProps} showInfo={false} />);

    expect(screen.getByTestId("mock-summary")).not.toHaveTextContent("3 out of 10");
    expect(screen.getByTestId("mock-stat")).not.toHaveTextContent("3/10 % - green");
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
