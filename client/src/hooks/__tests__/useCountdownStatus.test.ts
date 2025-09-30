import { renderHook, act } from "@testing-library/react";
import useCountdownStatus from "hooks/useCountdownStatus";
import { useDispatch, useSelector } from "react-redux";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("features/election/electionSlice", () => ({
  updateElectionStatusFromTimer: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useCountdownStatus", () => {
  const mockUseDispatch = useDispatch as jest.Mock;
  const mockUseSelector = useSelector as jest.Mock;

  it("immediately sets countDownOver if time is in the past", () => {
    const fakeDispatch = jest.fn();
    mockUseDispatch.mockReturnValue(fakeDispatch);
    mockUseSelector.mockReturnValue({
      startDate: 1759251240957,
      endDate: 1759251461273,
    });

    const pastTime = Date.now() - 1000;

    const { result } = renderHook(() => useCountdownStatus(pastTime));

    expect(result.current).toBe(false);
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(false);
    expect(fakeDispatch).not.toHaveBeenCalled();
  });

  it("sets countDownOver to true after time elapses", () => {
    const fakeDispatch = jest.fn();
    const fakeTimerState = {
      startDate: 1759251240957,
      endDate: 1759251461273,
    };
    mockUseDispatch.mockReturnValue(fakeDispatch);
    mockUseSelector.mockReturnValue(fakeTimerState);

    const futureTime = Date.now() + 3000;

    const { result } = renderHook(() => useCountdownStatus(futureTime));

    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(result.current).toBe(true);
    expect(updateElectionStatusFromTimer).toHaveBeenCalledWith(fakeTimerState);
    expect(fakeDispatch).toHaveBeenCalledWith(
      updateElectionStatusFromTimer(fakeTimerState),
    );
  });

  it("clears interval on unmount", () => {
    const fakeDispatch = jest.fn();
    mockUseDispatch.mockReturnValue(fakeDispatch);
    mockUseSelector.mockReturnValue({ phase: "running" });

    const futureTime = Date.now() + 5000;

    const clearSpy = jest.spyOn(global, "clearInterval");

    const { unmount } = renderHook(() => useCountdownStatus(futureTime));

    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });

  it("starts an interval when time is in the future", () => {
    const fakeDispatch = jest.fn();
    mockUseDispatch.mockReturnValue(fakeDispatch);
    mockUseSelector.mockReturnValue({ phase: "running" });

    const futureTime = Date.now() + 2000;
    const setSpy = jest.spyOn(global, "setInterval");

    renderHook(() => useCountdownStatus(futureTime));

    expect(setSpy).toHaveBeenCalled();
  });
});
