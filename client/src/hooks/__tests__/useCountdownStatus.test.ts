import { renderHook, act } from "@testing-library/react";
import useCountdownStatus from "hooks/useCountdownStatus";
import { useDispatch, useSelector } from "react-redux";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("features/election/electionSlice", () => ({
  updateElectionStatusFromTimer: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useCountdownStatus", () => {
  const mockUseDispatch = useDispatch as Mock;
  const mockUseSelector = useSelector as Mock;

  it("immediately sets countDownOver if time is in the past", () => {
    const fakeDispatch = vi.fn();
    mockUseDispatch.mockReturnValue(fakeDispatch);
    mockUseSelector.mockReturnValue({
      startDate: 1759251240957,
      endDate: 1759251461273,
    });

    const pastTime = Date.now() - 1000;

    const { result } = renderHook(() => useCountdownStatus(pastTime));

    expect(result.current).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(false);
    expect(fakeDispatch).not.toHaveBeenCalled();
  });

  it("sets countDownOver to true after time elapses", () => {
    const fakeDispatch = vi.fn();
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
      vi.advanceTimersByTime(4000);
    });

    expect(result.current).toBe(true);
    expect(updateElectionStatusFromTimer).toHaveBeenCalledWith(fakeTimerState);
    expect(fakeDispatch).toHaveBeenCalledWith(
      updateElectionStatusFromTimer(fakeTimerState),
    );
  });

  it("clears interval on unmount", () => {
    const fakeDispatch = vi.fn();
    mockUseDispatch.mockReturnValue(fakeDispatch);
    mockUseSelector.mockReturnValue({ phase: "running" });

    const futureTime = Date.now() + 5000;

    const clearSpy = vi.spyOn(global, "clearInterval");

    const { unmount } = renderHook(() => useCountdownStatus(futureTime));

    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });

  it("starts an interval when time is in the future", () => {
    const fakeDispatch = vi.fn();
    mockUseDispatch.mockReturnValue(fakeDispatch);
    mockUseSelector.mockReturnValue({ phase: "running" });

    const futureTime = Date.now() + 2000;
    const setSpy = vi.spyOn(global, "setInterval");

    renderHook(() => useCountdownStatus(futureTime));

    expect(setSpy).toHaveBeenCalled();
  });
});
