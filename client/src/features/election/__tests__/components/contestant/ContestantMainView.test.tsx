import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import ContestantMainView from "features/election/components/contestant/ContestantMainView";
import { ContestantFrameProps } from "features/election/components/contestant/ContestantFrame";
import { ContestantMainInfoProps } from "features/election/components/contestant/info/ContestantMainInfo";
import { ContestantButtonManifestoProps } from "features/election/components/contestant/buttons/ContestantButtonManifesto";
import { ContestantButtonVoteProps } from "features/election/components/contestant/buttons/ContestantButtonVote";
import { ContestantButtonVoteCompletedProps } from "features/election/components/contestant/buttons/ContestantButtonVoteCompleted";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock(
  "features/election/components/contestant/ContestantFrame",
  () =>
    ({ children }: ContestantFrameProps) => (
      <div data-testid="contestant-frame">{children}</div>
    ),
);

vi.mock(
  "features/election/components/contestant/info/ContestantMainInfo",
  () => (props: ContestantMainInfoProps) => (
    <div data-testid="main-info">{JSON.stringify(props)}</div>
  ),
);

vi.mock(
  "features/election/components/contestant/buttons/ContestantButtonManifesto",
  () =>
    ({ manifestoControl }: ContestantButtonManifestoProps) => (
      <button data-testid="button-manifesto">Manifesto</button>
    ),
);

vi.mock(
  "features/election/components/contestant/buttons/ContestantButtonVote",
  () =>
    ({ contestantId, position }: ContestantButtonVoteProps) => (
      <button data-testid="button-vote">{`Vote for ${contestantId} as ${position}`}</button>
    ),
);

vi.mock(
  "features/election/components/contestant/buttons/ContestantButtonVoteCompleted",
  () =>
    ({ votedFor }: ContestantButtonVoteCompletedProps) => (
      <span data-testid="button-vote-completed">
        {votedFor ? "You voted" : "You didn't vote"}
      </span>
    ),
);

describe("ContestantMainView", () => {
  const baseProps = {
    contestant: {
      contestant_id: "c123",
      firstname: "John",
      surname: "Doe",
      picture: "http://example.com/pic.jpg",
      manifesto: 'manifesto',
      votes: [],
    },
    position: "President",
    totalVotes: 100,
    isButtonDisabled: false,
    votePercentColor: { c123: "green" },
    manifestoControl: {
      showManifesto: true,
      setShowManifesto: vi.fn(),
    },
  };

  const mockedUseSelector = useSelector as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all base components inside ContestantFrame", () => {
    mockedUseSelector.mockReturnValue({ userId: "u1" });

    render(<ContestantMainView {...baseProps} />);

    expect(screen.getByTestId("contestant-frame")).toBeInTheDocument();
    expect(screen.getByTestId("main-info")).toBeInTheDocument();
    expect(screen.getByTestId("button-manifesto")).toBeInTheDocument();
    expect(screen.getByTestId("button-vote")).toHaveTextContent(
      "Vote for c123 as President",
    );
  });

  it("renders ContestantButtonVoteCompleted with votedFor=true when user has voted", () => {
    mockedUseSelector.mockReturnValue({ userId: "u1" });

    render(
      <ContestantMainView
        {...baseProps}
        isButtonDisabled={true}
        contestant={{ ...baseProps.contestant, votes: ["u1"] }}
      />,
    );

    expect(screen.queryByTestId("button-vote")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-vote-completed")).toHaveTextContent(
      "You voted",
    );
  });

  it("renders ContestantButtonVoteCompleted with votedFor=false when user has NOT voted", () => {
    mockedUseSelector.mockReturnValue({ userId: "u1" });

    render(
      <ContestantMainView
        {...baseProps}
        isButtonDisabled={true}
        contestant={{ ...baseProps.contestant, votes: ["u2", "u3"] }}
      />,
    );

    expect(screen.queryByTestId("button-vote")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-vote-completed")).toHaveTextContent(
      "You didn't vote",
    );
  });

  it("passes correct props to ContestantMainInfo", () => {
    mockedUseSelector.mockReturnValue({ userId: "u1" });

    render(<ContestantMainView {...baseProps} />);

    const mainInfo = JSON.parse(screen.getByTestId("main-info").textContent);
    expect(mainInfo.contestant).toEqual(baseProps.contestant);
    expect(mainInfo.totalVotes).toBe(100);
    expect(mainInfo.showInfo).toBe(false);
    expect(mainInfo.votePercentColor).toEqual(baseProps.votePercentColor);
  });
});
