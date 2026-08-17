import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";

import ElectionDetailsAllData from "features/election/components/ElectionDetailsAllData";
import { timerData } from "features/timer/timerSlice";
import { BlockProps } from "components/ui/Block";
import { ElectionDetailsHeaderProps } from "features/election/components/ElectionDetailsHeader";
import { ElectivePositionDetailsProps } from "features/election/components/ElectivePositionDetails";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("features/election/hooks/useParticles", () => ({
  useParticles: () => ({
    particlesInit: vi.fn(),
    particlesLoaded: vi.fn(),
  }),
}));

vi.mock("react-tsparticles", () => () => <div data-testid="particles" />);

vi.mock("components/ui/Block", () => ({ children, ...rest }: BlockProps) => (
  <div data-testid="block" {...rest}>
    {children}
  </div>
));

vi.mock("features/election/components/ElectionDetailsHeader", () => ({ message }: ElectionDetailsHeaderProps) => (
  <div data-testid="header">{message}</div>
));

vi.mock(
  "features/election/components/ElectivePositionDetails",
  () => ({ contestantsDetailsByPosition }: ElectivePositionDetailsProps) =>
    (
      <div data-testid="position-details">
        {`position: ${contestantsDetailsByPosition.position}`}
      </div>
    ),
);

vi.mock("features/timer/components/liveElectionTimer/LiveTimer", () => ({ electionEndTime }: {electionEndTime: number}) => (
  <div data-testid="live-timer">{`EndTime: ${electionEndTime}`}</div>
));

vi.mock("features/timer/timerSlice", () => ({
  timerData: vi.fn(),
}));

describe("ElectionDetailsAllData", () => {
  const mockTimer = { endDate: Date.now() + 10000 };

  const mockElectionData = [
    { position: "President", contestants: ["A", "B"] },
    { position: "Vice President", contestants: ["C", "D"] },
  ];

  const mockedUseSelector = useSelector as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseSelector.mockImplementation((selectorFn) => {
      if (selectorFn === timerData) {
        return mockTimer;
      }
    });
  });

  it("renders all components correctly", () => {
    render(<ElectionDetailsAllData listOfElectionData={mockElectionData} />);

    expect(screen.getByTestId("particles")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toHaveTextContent("Please Proceed To Vote.");
    expect(screen.getByTestId("live-timer")).toHaveTextContent(`EndTime: ${mockTimer.endDate}`);

    const details = screen.getAllByTestId("position-details");
    expect(details.length).toBe(2);
    expect(details[0]).toHaveTextContent("President");
    expect(details[1]).toHaveTextContent("Vice President");
  });

  it("does not render LiveTimer when election has ended", () => {
    const pastTimer = { endDate: Date.now() - 10000 };
    mockedUseSelector.mockImplementation((selectorFn) => {
      if (selectorFn === timerData) return pastTimer;
    });

    render(<ElectionDetailsAllData listOfElectionData={mockElectionData} />);

    expect(screen.queryByTestId("live-timer")).not.toBeInTheDocument();
  });
});
