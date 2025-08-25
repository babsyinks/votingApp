import { renderHook, act } from "@testing-library/react";
import useTimerSchedule from "../../hooks/useTimerSchedule";
import timerLabelsWithTypes from "../../data/timerLabelsWithTypes";

jest.mock("../../data/timerLabelsWithTypes", () => [
  { label: "Election Start Day", type: "date" },
  { label: "Election Start Time", type: "time" },
  { label: "Election End Day", type: "date" },
  { label: "Election End Time", type: "time" },
]);

describe("useTimerSchedule", () => {
  test("should initialize all values as empty strings", () => {
    const { result } = renderHook(() => useTimerSchedule());

    const { startDate, startTime, endDate, endTime, mergedTimerState } = result.current;

    expect(startDate).toBe("");
    expect(startTime).toBe("");
    expect(endDate).toBe("");
    expect(endTime).toBe("");

    expect(mergedTimerState).toHaveLength(4);

    mergedTimerState.forEach((entry, index) => {
      expect(entry.label).toBe(timerLabelsWithTypes[index].label);
      expect(entry.type).toBe(timerLabelsWithTypes[index].type);
      expect(typeof entry.onChange).toBe("function");
      expect(entry.value).toBe("");
    });
  });

  test("should update values correctly when onChange is called", () => {
    const { result } = renderHook(() => useTimerSchedule());

    const { mergedTimerState } = result.current;

    act(() => {
      mergedTimerState[0].onChange({ target: { value: "2025-08-10" } }); // startDate
      mergedTimerState[1].onChange({ target: { value: "08:00" } }); // startTime
      mergedTimerState[2].onChange({ target: { value: "2025-08-11" } }); // endDate
      mergedTimerState[3].onChange({ target: { value: "17:00" } }); // endTime
    });

    const { startDate, startTime, endDate, endTime } = result.current;

    expect(startDate).toBe("2025-08-10");
    expect(startTime).toBe("08:00");
    expect(endDate).toBe("2025-08-11");
    expect(endTime).toBe("17:00");

    expect(result.current.mergedTimerState[0].value).toBe("2025-08-10");
    expect(result.current.mergedTimerState[1].value).toBe("08:00");
    expect(result.current.mergedTimerState[2].value).toBe("2025-08-11");
    expect(result.current.mergedTimerState[3].value).toBe("17:00");
  });
});
