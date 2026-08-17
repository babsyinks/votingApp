import { render, screen } from "@testing-library/react";
import ElectivePositionDetailsContestants from "features/election/components/ElectivePositionDetailsContestants";
import { useSelector } from "react-redux";
import assignVoteStatusColor from "../../helpers/assignVoteStatusColor";
import { ContestantViewProps } from "features/election/components/contestant/ContestantView";
import { mockContestants } from "../testData/mockContestants";
import { ContestantType } from "features/election/types/contestantType";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../../helpers/assignVoteStatusColor", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock(
  "features/election/components/contestant/ContestantView",
  () =>
    ({
      contestant,
      totalVotes,
      isButtonDisabled,
      votePercentColor,
      position,
    }: ContestantViewProps) => (
      <div data-testid={`mock-contestant-${contestant.contestant_id}`}>
        {contestant.firstname}
        {`totalVotes - ${totalVotes}`}
        {`position - ${position}`}
        {`isButtonDisabled - ${isButtonDisabled}`}
        {`votePercentColor - ${JSON.stringify(votePercentColor)}`}
        {`key - ${contestant.contestant_id}`}
      </div>
    ),
);

describe("ElectivePositionDetailsContestants", () => {
  let votes: string[];
  const mockUserId = "user-123";
  const mockedAssignVoteStatusColor = vi.mocked(assignVoteStatusColor);

  const contestantsList: ContestantType[] = mockContestants;

  const position = "President";

  beforeEach(() => {
    vi.clearAllMocks();

    (useSelector as Mock).mockReturnValue({ userId: mockUserId });

    mockedAssignVoteStatusColor.mockReturnValue({
      1: "lime",
      2: "red",
    });
    votes = ["user-1", "user-2", "user-3"];
  });

  it("renders a Contestant for each contestant in the list", () => {
    render(
      <ElectivePositionDetailsContestants
        contestantsList={contestantsList}
        listOfVotesCastInCategory={votes}
        position={position}
      />,
    );

    const contestant1 = screen.getByTestId("mock-contestant-1");
    expect(contestant1).toBeInTheDocument();
    const contestant2 = screen.getByTestId("mock-contestant-2");
    expect(contestant2).toBeInTheDocument();
    expect(contestant1.textContent.includes("isButtonDisabled - false")).toBe(
      true,
    );
    expect(contestant2.textContent.includes("isButtonDisabled - false")).toBe(
      true,
    );
  });

  it("disables vote button if user has already voted", () => {
    render(
      <ElectivePositionDetailsContestants
        contestantsList={contestantsList}
        listOfVotesCastInCategory={[mockUserId, "user-1", "user-2"]} // User has voted
        position={position}
      />,
    );
    const contestant1 = screen.getByTestId("mock-contestant-1");
    const contestant2 = screen.getByTestId("mock-contestant-2");

    expect(contestant1.textContent.includes("isButtonDisabled - true")).toBe(
      true,
    );
    expect(contestant2.textContent.includes("isButtonDisabled - true")).toBe(
      true,
    );
  });

  it("passes correct votePercentColor to each Contestant", () => {
    render(
      <ElectivePositionDetailsContestants
        contestantsList={contestantsList}
        listOfVotesCastInCategory={votes}
        position={position}
      />,
    );

    const contestant1 = screen.getByTestId("mock-contestant-1");
    const contestant2 = screen.getByTestId("mock-contestant-2");
    const colorVotePercent = { 1: "lime", 2: "red" };
    expect(
      contestant1.textContent.includes(
        `votePercentColor - ${JSON.stringify(colorVotePercent)}`,
      ),
    ).toBe(true);
    expect(
      contestant2.textContent.includes(
        `votePercentColor - ${JSON.stringify(colorVotePercent)}`,
      ),
    ).toBe(true);
  });

  it("passes totalVotes equal to listOfVotesCastInCategory.length", () => {
    render(
      <ElectivePositionDetailsContestants
        contestantsList={contestantsList}
        listOfVotesCastInCategory={votes}
        position={position}
      />,
    );
    const contestant1 = screen.getByTestId("mock-contestant-1");
    const contestant2 = screen.getByTestId("mock-contestant-2");

    expect(contestant1.textContent.includes("totalVotes - 3")).toBe(true);
    expect(contestant2.textContent.includes("totalVotes - 3")).toBe(true);
  });

  it("passes position and contestant_id as props", () => {
    render(
      <ElectivePositionDetailsContestants
        contestantsList={contestantsList}
        listOfVotesCastInCategory={votes}
        position={position}
      />,
    );
    const contestant1 = screen.getByTestId("mock-contestant-1");
    const contestant2 = screen.getByTestId("mock-contestant-2");

    expect(contestant1.textContent.includes("position - President")).toBe(true);
    expect(contestant2.textContent.includes("position - President")).toBe(true);
    expect(contestant1.textContent.includes("key - 1")).toBe(true);
    expect(contestant2.textContent.includes("key - 2")).toBe(true);
  });
});
