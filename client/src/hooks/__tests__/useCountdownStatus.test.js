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
  it("immediately sets countDownOver if time is in the past", () => {
    const fakeDispatch = jest.fn();
    useDispatch.mockReturnValue(fakeDispatch);
    useSelector.mockReturnValue({ phase: "initial" });

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
    const fakeTimerState = { phase: "counting" };
    useDispatch.mockReturnValue(fakeDispatch);
    useSelector.mockReturnValue(fakeTimerState);

    const futureTime = Date.now() + 3000;

    const { result } = renderHook(() => useCountdownStatus(futureTime));

    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(result.current).toBe(true);
    expect(updateElectionStatusFromTimer).toHaveBeenCalledWith(fakeTimerState);
    expect(fakeDispatch).toHaveBeenCalledWith(updateElectionStatusFromTimer(fakeTimerState));
  });

  it("clears interval on unmount", () => {
    const fakeDispatch = jest.fn();
    useDispatch.mockReturnValue(fakeDispatch);
    useSelector.mockReturnValue({ phase: "running" });

    const futureTime = Date.now() + 5000;

    const clearSpy = jest.spyOn(global, "clearInterval");

    const { unmount } = renderHook(() => useCountdownStatus(futureTime));

    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });
});
