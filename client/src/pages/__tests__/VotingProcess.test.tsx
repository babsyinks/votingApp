import React from "react";
import { render, screen } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { fetchThenSetCurrentTimerStatus, timerData } from "features/timer/timerSlice";
import useCountdownStatus from "hooks/useCountdownStatus";
import VotingProcess from "pages/VotingProcess";

jest.useFakeTimers().setSystemTime(1753795664000);

jest.mock("features/election/components/ElectionDetails", () => () => (
  <div data-testid="election-details">ElectionDetails Component</div>
));
jest.mock("features/timer/components/preElectionTimer/PreElectionCountDown", () => () => (
  <div data-testid="pre-election-countdown">PreElectionCountDown Component</div>
));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: jest.fn(() => ({ type: "MOCK_DISPATCH" })),
  timerData: jest.fn(),
}));

jest.mock("hooks/useCountdownStatus", () => jest.fn());

describe("VotingProcess", () => {
  const NOW = Date.now();
  const mockDispatch = jest.fn();
    const mockUseDispatch = jest.mocked(useDispatch);
    const mockTimerData = jest.mocked(timerData);
    const mockUseSelector = jest.mocked(useSelector);

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  it("dispatches fetchThenSetCurrentTimerStatus on mount", () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ timer: { startDate: NOW } })
    );
    mockTimerData.mockReturnValue({ startDate: NOW });

    render(<VotingProcess />);
    expect(mockDispatch).toHaveBeenCalledWith(fetchThenSetCurrentTimerStatus());
  });

  it("calls useCountdownStatus with timer.startDate", () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ timer: { startDate: NOW } })
    );
    mockTimerData.mockReturnValue({ startDate: NOW });

    render(<VotingProcess />);
    expect(useCountdownStatus).toHaveBeenCalledWith(NOW);
  });

    it("calls useCountdownStatus with Date.now if there is no start date", () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ timer: { startDate: undefined } })
    );
    mockTimerData.mockReturnValue({ startDate: undefined });

    render(<VotingProcess />);
    expect(useCountdownStatus).toHaveBeenCalledWith(NOW);
  });

  it("renders PreElectionCountDown if timer is in the future", () => {
    const futureTime = NOW + 10000;
    mockUseSelector.mockImplementation((selector) =>
      selector({ timer: { startDate: futureTime } })
    );
    mockTimerData.mockReturnValue({ startDate: futureTime });

    render(<VotingProcess />);
    expect(screen.getByTestId("pre-election-countdown")).toBeInTheDocument();
    expect(screen.queryByTestId("election-details")).not.toBeInTheDocument();
  });

  it("renders ElectionDetails if timer is in the past", () => {
    const pastTime = NOW - 10000;
    mockUseSelector.mockImplementation((selector) =>
      selector({ timer: { startDate: pastTime } })
    );
    mockTimerData.mockReturnValue({ startDate: pastTime });

    render(<VotingProcess />);
    expect(screen.getByTestId("election-details")).toBeInTheDocument();
    expect(screen.queryByTestId("pre-election-countdown")).not.toBeInTheDocument();
  });
});
