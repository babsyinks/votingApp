import React from "react";
import { render, screen } from "@testing-library/react";
import ElectivePositionDetailsContestants from "features/election/components/ElectivePositionDetailsContestants";

import { useSelector } from "react-redux";
import assignVoteStatusColor from "../../helpers/assignVoteStatusColor";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("../../helpers/assignVoteStatusColor", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  "features/election/components/contestant/Contestant",
  () =>
    ({ contestant, totalVotes, isButtonDisabled, votePercentColor, position }) => (
      <div data-testid={`mock-contestant-${contestant.contestant_id}`}>
        {contestant.name}
        {`totalVotes - ${totalVotes}`}
        {`position - ${position}`}
        {`isButtonDisabled - ${isButtonDisabled}`}
        {`votePercentColor - ${JSON.stringify(votePercentColor)}`}
        {`key - ${contestant.contestant_id}`}
      </div>
    ),
);

describe("ElectivePositionDetailsContestants", () => {
  let votes;
  const mockUserId = "user-123";

  const contestantsList = [
    { contestant_id: "1", name: "Alice" },
    { contestant_id: "2", name: "Bob" },
  ];

  const position = "President";

  beforeEach(() => {
    jest.clearAllMocks();

    useSelector.mockReturnValue({ userId: mockUserId });

    assignVoteStatusColor.mockReturnValue({
      1: "green",
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
    expect(contestant1.textContent.includes("isButtonDisabled - false")).toBe(true);
    expect(contestant2.textContent.includes("isButtonDisabled - false")).toBe(true);
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

    expect(contestant1.textContent.includes("isButtonDisabled - true")).toBe(true);
    expect(contestant2.textContent.includes("isButtonDisabled - true")).toBe(true);
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
    const colorVotePercent = { 1: "green", 2: "red" };
    expect(
      contestant1.textContent.includes(`votePercentColor - ${JSON.stringify(colorVotePercent)}`),
    ).toBe(true);
    expect(
      contestant2.textContent.includes(`votePercentColor - ${JSON.stringify(colorVotePercent)}`),
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
