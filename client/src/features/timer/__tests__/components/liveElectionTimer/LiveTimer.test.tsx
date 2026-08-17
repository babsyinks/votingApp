import { render, screen, waitFor } from "@testing-library/react";
import LiveTimer from "features/timer/components/liveElectionTimer/LiveTimer";
import { useDispatch, useSelector } from "react-redux";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";
import type { LiveTimerRendererProps } from "features/timer/components/liveElectionTimer/LiveTimerRenderer";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

vi.mock(
  "features/timer/components/liveElectionTimer/LiveTimerRenderer",
  () => {
    return function MockRenderer() {
      return <div>LiveTimerRendererMock</div>;
    };
  },
);

vi.mock("features/election/electionSlice", () => ({
  updateElectionStatusFromTimer: vi.fn(),
}));

vi.mock("react-countdown", () => {
  return ({
    date,
    renderer: Renderer,
    onComplete,
  }: {
    date: number;
    renderer: React.ComponentType<LiveTimerRendererProps>;
    onComplete: () => {};
  }) => {
    const React = require("react");
    React.useEffect(() => {
      onComplete();
    }, [onComplete]);
    return (
      <Renderer days={1} hours={2} minutes={10} seconds={30} completed={true} />
    );
  };
});

describe("LiveTimer", () => {
  const mockDispatch = vi.fn();
  const mockTimerState = {
  startDate: 1758979661570,
  endDate: 1758992341783
};

  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as Mock).mockReturnValue(mockDispatch);
    (useSelector as Mock).mockImplementation((selector) =>
      selector({ timer: mockTimerState }),
    );
  });

  test("renders LiveTimerRenderer via Countdown", () => {
    render(<LiveTimer electionEndTime={Date.now() + 10000} />);
    expect(screen.getByText("LiveTimerRendererMock")).toBeInTheDocument();
  });

  test("dispatches updateElectionStatusFromTimer when countdown completes", async () => {
    render(<LiveTimer electionEndTime={Date.now() + 10000} />);
    await waitFor(() => {
      expect(updateElectionStatusFromTimer).toHaveBeenCalledWith(
        mockTimerState,
      );
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        updateElectionStatusFromTimer(mockTimerState),
      );
    });
  });
});
