import { render, screen, waitFor } from "@testing-library/react";
import LiveTimer from "features/timer/components/liveElectionTimer/LiveTimer";
import { useDispatch, useSelector } from "react-redux";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("features/timer/components/liveElectionTimer/LiveTimerRenderer", () => {
  return function MockRenderer() {
    return <div>LiveTimerRendererMock</div>;
  };
});

jest.mock("features/election/electionSlice", () => ({
  updateElectionStatusFromTimer: jest.fn(),
}));

jest.mock("react-countdown", () => {
  return ({ date, renderer: Renderer, onComplete }) => {
    const React = require("react");
    React.useEffect(() => {
      onComplete();
    }, [onComplete]);
    return <Renderer completed={true} />;
  };
});

describe("LiveTimer", () => {
  const mockDispatch = jest.fn();
  const mockTimerState = { foo: "bar" };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => selector({ timer: mockTimerState }));
  });

  test("renders LiveTimerRenderer via Countdown", () => {
    render(<LiveTimer electionEndTime={Date.now() + 10000} />);
    expect(screen.getByText("LiveTimerRendererMock")).toBeInTheDocument();
  });

  test("dispatches updateElectionStatusFromTimer when countdown completes", async () => {
    render(<LiveTimer electionEndTime={Date.now() + 10000} />);
    await waitFor(() => {
      expect(updateElectionStatusFromTimer).toHaveBeenCalledWith(mockTimerState);
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(updateElectionStatusFromTimer(mockTimerState));
    });
  });
});
