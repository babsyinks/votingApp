import { render, screen, fireEvent } from "@testing-library/react";
import ElectionTimerSettingsForm from "features/timer/components/timerSettings/ElectionTimerSettingsForm";
import * as useTimerSchedule from "features/timer/hooks/useTimerSchedule";
import { vi } from "vitest";

vi.mock(
  "features/timer/components/timerSettings/ElectionTimerSettingsFormInput",
  () => () => <input type="date" data-testid="mock-input" />,
);

describe("ElectionTimerSettingsForm", () => {
  let triggerFailureToast = vi.fn();
  let setElectionSchedule = vi.fn();
  let setEnableDone = vi.fn();
  const now = new Date("2025-08-09T08:00").getTime();
  let startDate: string;
  let endDate: string;

  const spyOnTimerSchedule = (startDate: string, endDate: string) => {
    vi.spyOn(useTimerSchedule, "default").mockReturnValue({
      mergedTimerState: [
        {
          label: "Start Date",
          type: "date",
          value: new Date(startDate).toISOString().slice(0, 10),
          onChange: () => {},
        },
        {
          label: "Start Time",
          type: "time",
          value: "10:00",
          onChange: () => {},
        },
        {
          label: "End Date",
          type: "date",
          value: new Date(endDate).toISOString().slice(0, 10),
          onChange: () => {},
        },
        { label: "End Time", type: "time", value: "10:00", onChange: () => {} },
      ],
      startDate: new Date(startDate).toISOString().slice(0, 10),
      startTime: "10:00",
      endDate: new Date(endDate).toISOString().slice(0, 10),
      endTime: "10:00",
    });
  };

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  beforeEach(() => {
    triggerFailureToast = vi.fn();
    setElectionSchedule = vi.fn();
    setEnableDone = vi.fn();

    startDate = "2025-08-10T10:00";
    endDate = "2025-08-11T10:00";

    spyOnTimerSchedule(startDate, endDate);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("schedules election period properly when correctly set (startDate after now and startDate before endDate)", async () => {
    render(
      <ElectionTimerSettingsForm
        triggerFailureToast={triggerFailureToast}
        setElectionSchedule={setElectionSchedule}
        setEnableDone={setEnableDone}
      />,
    );
    const inputs = await screen.findAllByTestId("mock-input");
    fireEvent.change(inputs[0]);

    expect(triggerFailureToast).not.toHaveBeenCalled();
    expect(setElectionSchedule).toHaveBeenCalledWith({
      startDate: 1754816400000,
      endDate: 1754902800000,
    });
    expect(setEnableDone).toHaveBeenCalledWith(true);
  });

  it("calls triggerFailureToast if end date is before start date", async () => {
    startDate = "2025-08-12T10:00";
    spyOnTimerSchedule(startDate, endDate);
    render(
      <ElectionTimerSettingsForm
        triggerFailureToast={triggerFailureToast}
        setElectionSchedule={setElectionSchedule}
        setEnableDone={setEnableDone}
      />,
    );
    const inputs = await screen.findAllByTestId("mock-input");
    fireEvent.change(inputs[0]);

    expect(triggerFailureToast).toHaveBeenCalledWith(
      "End Date Must Be Greater Than Start Date",
    );
    expect(setElectionSchedule).not.toHaveBeenCalled();
    expect(setEnableDone).not.toHaveBeenCalled();
  });

  it("calls triggerFailureToast if start date is before now", async () => {
    startDate = "2025-08-05T10:00";

    spyOnTimerSchedule(startDate, endDate);

    render(
      <ElectionTimerSettingsForm
        triggerFailureToast={triggerFailureToast}
        setElectionSchedule={setElectionSchedule}
        setEnableDone={setEnableDone}
      />,
    );

    const inputs = await screen.findAllByTestId("mock-input");
    fireEvent.change(inputs[0]);

    expect(triggerFailureToast).toHaveBeenCalledWith(
      "Election Date Should Not Be Set To The Past",
    );
    expect(setElectionSchedule).not.toHaveBeenCalled();
    expect(setEnableDone).not.toHaveBeenCalled();
  });

  it("time-setting functions and status triggers are not run when any date or time value is unset", async () => {
    endDate = "";

    vi.spyOn(useTimerSchedule, "default").mockReturnValue({
      mergedTimerState: [
        {
          label: "Start Date",
          type: "date",
          value: new Date(startDate).toISOString().slice(0, 10),
          onChange: () => {},
        },
        {
          label: "Start Time",
          type: "time",
          value: "10:00",
          onChange: () => {},
        },
        { label: "End Date", type: "date", value: endDate, onChange: () => {} },
        { label: "End Time", type: "time", value: "10:00", onChange: () => {} },
      ],
      startDate: new Date(startDate).toISOString().slice(0, 10),
      startTime: "10:00",
      endDate,
      endTime: "10:00",
    });

    render(
      <ElectionTimerSettingsForm
        triggerFailureToast={triggerFailureToast}
        setElectionSchedule={setElectionSchedule}
        setEnableDone={setEnableDone}
      />,
    );

    const inputs = await screen.findAllByTestId("mock-input");
    fireEvent.change(inputs[0]);

    expect(triggerFailureToast).not.toHaveBeenCalled();
    expect(setElectionSchedule).not.toHaveBeenCalled();
    expect(setEnableDone).not.toHaveBeenCalled();
  });
});
