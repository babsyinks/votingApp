import { render, screen, fireEvent } from "@testing-library/react";
import ElectionTimerSettingsForm from "features/timer/components/timerSettings/ElectionTimerSettingsForm";
import * as useTimerSchedule from "features/timer/hooks/useTimerSchedule";

jest.mock("features/timer/components/timerSettings/ElectionTimerSettingsFormInput", () => () => (
  <input type="date" data-testid="mock-input" />
));

describe("ElectionTimerSettingsForm", () => {
  let triggerFailureToast = jest.fn();
  let setElectionSchedule = jest.fn();
  let setEnableDone = jest.fn();
  const now = new Date("2025-08-09T08:00").getTime();
  let startDate;
  let endDate;

  const spyOnTimerSchedule = (startDate, endDate) => {
    jest.spyOn(useTimerSchedule, "default").mockReturnValue({
      mergedTimerState: [
        { value: startDate.toISOString().slice(0, 10), onChange: () => {} },
        { value: "10:00", onChange: () => {} },
        { value: endDate.toISOString().slice(0, 10), onChange: () => {} },
        { value: "10:00", onChange: () => {} },
      ],
      startDate: startDate.toISOString().slice(0, 10),
      startTime: "10:00",
      endDate: endDate.toISOString().slice(0, 10),
      endTime: "10:00",
    });
  };

  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
  });

  beforeEach(() => {
    triggerFailureToast = jest.fn();
    setElectionSchedule = jest.fn();
    setEnableDone = jest.fn();

    startDate = new Date("2025-08-10T10:00");
    endDate = new Date("2025-08-11T10:00");

    spyOnTimerSchedule(startDate, endDate);
  });

  afterAll(() => {
    jest.useRealTimers();
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
    startDate = new Date("2025-08-12T10:00");
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

    expect(triggerFailureToast).toHaveBeenCalledWith("End Date Must Be Greater Than Start Date");
    expect(setElectionSchedule).not.toHaveBeenCalled();
    expect(setEnableDone).not.toHaveBeenCalled();
  });

  it("calls triggerFailureToast if start date is before now", async () => {
    startDate = new Date("2025-08-05T10:00");

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

    expect(triggerFailureToast).toHaveBeenCalledWith("Election Date Should Not Be Set To The Past");
    expect(setElectionSchedule).not.toHaveBeenCalled();
    expect(setEnableDone).not.toHaveBeenCalled();
  });

  it("time-setting functions and status triggers are not run when any date or time value is unset", async () => {
    endDate = null;

    jest.spyOn(useTimerSchedule, "default").mockReturnValue({
      mergedTimerState: [
        { value: startDate.toISOString().slice(0, 10), onChange: () => {} },
        { value: "10:00", onChange: () => {} },
        { value: endDate, onChange: () => {} },
        { value: "10:00", onChange: () => {} },
      ],
      startDate: startDate.toISOString().slice(0, 10),
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
