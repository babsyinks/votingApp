import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import {
  getAllVotesInACategory,
  getAllContestantsInCategory,
} from "../../electionSlice";
import ElectivePositionDetails from "features/election/components/ElectivePositionDetails";
import { ElectivePositionDetailsSummaryProps } from "features/election/components/ElectivePositionDetailsSummary";
import { ElectivePositionDetailsContestantsProps } from "features/election/components/ElectivePositionDetailsContestants";
import { mockContestants } from "../testData/mockContestants";
import type { ContestantType } from "features/election/types/contestantType";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../../electionSlice", () => ({
  getAllVotesInACategory: vi.fn(),
  getAllContestantsInCategory: vi.fn(),
}));

vi.mock(
  "features/election/components/ElectivePositionDetailsSummary",
  () =>
    ({
      position,
      totalContestants,
      totalVotes,
    }: ElectivePositionDetailsSummaryProps) => (
      <div data-testid="summary">
        {`position - ${position}`}
        {`totalContestants - ${totalContestants}`}
        {`totalVotes - ${totalVotes}`}
      </div>
    ),
);

vi.mock(
  "features/election/components/ElectivePositionDetailsContestants",
  () =>
    ({
      contestantsList,
      position,
      listOfVotesCastInCategory,
    }: ElectivePositionDetailsContestantsProps) => (
      <div data-testid="contestants">
        {`contestantsList - ${JSON.stringify(contestantsList)}`}
        {`position - ${position}`}
        {`listOfVotesCastInCategory - ${JSON.stringify(listOfVotesCastInCategory)}`}
      </div>
    ),
);

describe("ElectivePositionDetails", () => {
  const mockedGetAllVotesInACategory = getAllVotesInACategory as Mock;
  const mockedGetAllContestantsInCategory =
    getAllContestantsInCategory as Mock;
  const mockedUseSelector = useSelector as Mock;
  let mockPosition = "President";
  const mockProps = {
    contestantsDetailsByPosition: { position: mockPosition },
  };

  const mockVotes = ["v1", "v2"];
  let contestants: ContestantType[];

  beforeEach(() => {
    vi.clearAllMocks();

    contestants = [...mockContestants];

    mockedGetAllVotesInACategory.mockImplementation((pos: string) => {
      return (_state: any) => {
        return pos === "President" ? mockVotes : [];
      };
    });

    mockedGetAllContestantsInCategory.mockImplementation((pos: string) => {
      return (_state: any) => {
        return pos === "President" ? contestants : [];
      };
    });

    mockedUseSelector.mockImplementation((selector: any) =>
      selector(undefined),
    );
  });

  it("renders summary and contestant components with correct props", () => {
    render(<ElectivePositionDetails {...mockProps} />);
    const summary = screen.getByTestId("summary");
    const contestantsDetails = screen.getByTestId("contestants");

    expect(summary).toBeInTheDocument();
    expect(contestantsDetails).toBeInTheDocument();

    expect(summary.textContent.includes(`position - ${mockPosition}`)).toBe(
      true,
    );
    expect(
      summary.textContent.includes(`totalContestants - ${contestants.length}`),
    ).toBe(true);
    expect(
      summary.textContent.includes(`totalVotes - ${mockVotes.length}`),
    ).toBe(true);

    expect(
      contestantsDetails.textContent.includes(
        `contestantsList - ${JSON.stringify(contestants)}`,
      ),
    ).toBe(true);
    expect(
      contestantsDetails.textContent.includes(`position - ${mockPosition}`),
    ).toBe(true);
    expect(
      contestantsDetails.textContent.includes(
        `listOfVotesCastInCategory - ${JSON.stringify(mockVotes)}`,
      ),
    ).toBe(true);
  });

  it("renders summary and contestant components using default empty lists when lists are not set", () => {
    mockPosition = "treasurer";
    const mockProps = {
      contestantsDetailsByPosition: { position: mockPosition },
    };

    render(<ElectivePositionDetails {...mockProps} />);
    const summary = screen.getByTestId("summary");
    const contestantsDetails = screen.getByTestId("contestants");

    expect(summary).toBeInTheDocument();
    expect(contestantsDetails).toBeInTheDocument();

    expect(summary.textContent.includes(`position - ${mockPosition}`)).toBe(
      true,
    );
    expect(summary.textContent.includes("totalContestants - 0")).toBe(true);
    expect(summary.textContent.includes("totalVotes - 0")).toBe(true);

    expect(
      contestantsDetails.textContent.includes(
        `contestantsList - ${JSON.stringify([])}`,
      ),
    ).toBe(true);
    expect(summary.textContent.includes(`position - ${mockPosition}`)).toBe(
      true,
    );
    expect(
      contestantsDetails.textContent.includes(
        `listOfVotesCastInCategory - ${JSON.stringify([])}`,
      ),
    ).toBe(true);
  });

  it("falls back to empty arrays when selectors return undefined", () => {
    mockedGetAllVotesInACategory.mockImplementation((_pos: string) => {
      return () => undefined;
    });

    mockedGetAllContestantsInCategory.mockImplementation((_pos: string) => {
      return () => undefined;
    });

    mockedUseSelector.mockImplementation((selector: any) =>
      selector(undefined),
    );

    render(<ElectivePositionDetails {...mockProps} />);
    const contestantsDetails = screen.getByTestId("contestants");

    expect(contestantsDetails.textContent).toContain(
      `contestantsList - ${JSON.stringify([])}`,
    );
    expect(contestantsDetails.textContent).toContain(
      `listOfVotesCastInCategory - ${JSON.stringify([])}`,
    );
  });
});
