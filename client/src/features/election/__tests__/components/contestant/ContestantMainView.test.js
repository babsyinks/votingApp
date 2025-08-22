import React from "react";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import ContestantMainView from "features/election/components/contestant/ContestantMainView";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("features/election/components/contestant/ContestantFrame", () => ({ children }) => (
  <div data-testid="contestant-frame">{children}</div>
));

jest.mock("features/election/components/contestant/info/ContestantMainInfo", () => (props) => (
  <div data-testid="main-info">{JSON.stringify(props)}</div>
));

jest.mock("features/election/components/contestant/buttons/ContestantButtonManifesto", () => ({ manifestoControl }) => (
  <button data-testid="button-manifesto">Manifesto</button>
));

jest.mock("features/election/components/contestant/buttons/ContestantButtonVote", () => ({ contestantId, position }) => (
  <button data-testid="button-vote">{`Vote for ${contestantId} as ${position}`}</button>
));

jest.mock("features/election/components/contestant/buttons/ContestantButtonVoteCompleted", () => ({ votedFor }) => (
  <span data-testid="button-vote-completed">
    {votedFor ? "You voted" : "You didn't vote"}
  </span>
));

describe("ContestantMainView", () => {
  const baseProps = {
    contestant: {
      contestant_id: "c123",
      votes: [],
    },
    position: "President",
    totalVotes: 100,
    isButtonDisabled: false,
    votePercentColor: { c123: "green" },
    manifestoControl: {
      manifestoVisible: true,
      setManifestoVisible: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all base components inside ContestantFrame", () => {
    useSelector.mockReturnValue({ userId: "u1" });

    render(<ContestantMainView {...baseProps} />);

    expect(screen.getByTestId("contestant-frame")).toBeInTheDocument();
    expect(screen.getByTestId("main-info")).toBeInTheDocument();
    expect(screen.getByTestId("button-manifesto")).toBeInTheDocument();
    expect(screen.getByTestId("button-vote")).toHaveTextContent("Vote for c123 as President");
  });

  it("renders ContestantButtonVoteCompleted with votedFor=true when user has voted", () => {
    useSelector.mockReturnValue({ userId: "u1" });

    render(
      <ContestantMainView
        {...baseProps}
        isButtonDisabled={true}
        contestant={{ ...baseProps.contestant, votes: ["u1"] }}
      />
    );

    expect(screen.queryByTestId("button-vote")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-vote-completed")).toHaveTextContent("You voted");
  });

  it("renders ContestantButtonVoteCompleted with votedFor=false when user has NOT voted", () => {
    useSelector.mockReturnValue({ userId: "u1" });

    render(
      <ContestantMainView
        {...baseProps}
        isButtonDisabled={true}
        contestant={{ ...baseProps.contestant, votes: ["u2", "u3"] }}
      />
    );

    expect(screen.queryByTestId("button-vote")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-vote-completed")).toHaveTextContent("You didn't vote");
  });

  it("passes correct props to ContestantMainInfo", () => {
    useSelector.mockReturnValue({ userId: "u1" });

    render(<ContestantMainView {...baseProps} />);

    const mainInfo = JSON.parse(screen.getByTestId("main-info").textContent);
    expect(mainInfo.contestant).toEqual(baseProps.contestant);
    expect(mainInfo.totalVotes).toBe(100);
    expect(mainInfo.showInfo).toBe(false);
    expect(mainInfo.votePercentColor).toEqual(baseProps.votePercentColor);
  });
});
