import React from "react";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";

import ElectionDetailsAllData from "features/election/components/ElectionDetailsAllData";
import { timerData } from "features/timer/timerSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("features/election/hooks/useParticles", () => ({
  useParticles: () => ({
    particlesInit: jest.fn(),
    particlesLoaded: jest.fn(),
  }),
}));

jest.mock("react-tsparticles", () => () => <div data-testid="particles" />);

jest.mock("components/ui/Block", () => ({ children, ...rest }) => (
  <div data-testid="block" {...rest}>
    {children}
  </div>
));

jest.mock("features/election/components/ElectionDetailsHeader", () => ({ message }) => (
  <div data-testid="header">{message}</div>
));

jest.mock(
  "features/election/components/ElectivePositionDetails",
  () => ({ contestantsDetailsByPosition }) =>
    (
      <div data-testid="position-details">
        {`position: ${contestantsDetailsByPosition.position}`}
      </div>
    ),
);

jest.mock("features/timer/components/liveElectionTimer/LiveTimer", () => ({ electionEndTime }) => (
  <div data-testid="live-timer">{`EndTime: ${electionEndTime}`}</div>
));

jest.mock("features/timer/timerSlice", () => ({
  timerData: jest.fn(),
}));

describe("ElectionDetailsAllData", () => {
  const mockTimer = { endDate: Date.now() + 10000 };

  const mockElectionData = [
    { position: "President", contestants: ["A", "B"] },
    { position: "Vice President", contestants: ["C", "D"] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation((selectorFn) => {
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
    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn === timerData) return pastTimer;
    });

    render(<ElectionDetailsAllData listOfElectionData={mockElectionData} />);

    expect(screen.queryByTestId("live-timer")).not.toBeInTheDocument();
  });
});
