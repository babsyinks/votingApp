
import { render, screen, fireEvent } from "@testing-library/react";
import ElectionTimerSettingsButton from "features/timer/components/timerSettings/ElectionTimerSettingsButton";
import { useDispatch } from "react-redux";
import { setTimerData } from "features/timer/timerSlice";
import { useAxios } from "hooks/useAxios";
import useResponsiveFontSize from "features/timer/hooks/useResponsiveFontSize";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("hooks/useAxios", () => ({
  useAxios: vi.fn(),
}));

vi.mock("features/timer/hooks/useResponsiveFontSize", () => vi.fn());

vi.mock("features/timer/timerSlice", () => ({
  setTimerData: vi.fn(),
}));

describe("ElectionTimerSettingsButton", () => {
  let mockDispatch: Mock;
  let mockTriggerRequest: Mock;
  let triggerSuccessToast: Mock;
  let triggerFailureToast: Mock;
  let setEnableDone: Mock;
  let electionSchedule: { startDate: number; endDate: number };

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockTriggerRequest = vi.fn();
    electionSchedule = {
      startDate: 1754816400000,
      endDate: 1754902800000,
    };
    (useDispatch as Mock).mockReturnValue(mockDispatch);
    (useAxios as Mock).mockReturnValue({
      response: null,
      error: null,
      triggerRequest: mockTriggerRequest,
    });
    (useResponsiveFontSize as Mock).mockReturnValue("text-lg-r");

    triggerSuccessToast = vi.fn();
    triggerFailureToast = vi.fn();
    setEnableDone = vi.fn();
    vi.clearAllMocks();
  });

  it("calls triggerRequest with POST when label is 'Set Timer'", async () => {
    render(
      <ElectionTimerSettingsButton
        label="Set Timer"
        className="custom"
        electionSchedule={electionSchedule}
        setEnableDone={setEnableDone}
        triggerSuccessToast={triggerSuccessToast}
        triggerFailureToast={triggerFailureToast}
      />,
    );

    const btn = screen.getByRole("button", { name: "Set Timer" });
    await fireEvent.click(btn);

    expect(mockTriggerRequest).toHaveBeenCalledWith({
      params: {
        method: "POST",
        url: "/api/v1/timer/set",
        data: electionSchedule,
      },
    });
  });

  it("calls triggerRequest with DELETE when label is 'Cancel Timer'", async () => {
    render(
      <ElectionTimerSettingsButton
        label="Cancel Timer"
        className="custom"
        electionSchedule={electionSchedule}
        setEnableDone={setEnableDone}
        triggerSuccessToast={triggerSuccessToast}
        triggerFailureToast={triggerFailureToast}
      />,
    );

    const btn = screen.getByRole("button", { name: "Cancel Timer" });
    await fireEvent.click(btn);

    expect(mockTriggerRequest).toHaveBeenCalledWith({
      params: {
        method: "DELETE",
        url: "/api/v1/timer/cancel",
      },
    });
  });

  it("handles success response", () => {
    const mockResponse = electionSchedule;

    (useAxios as Mock).mockReturnValue({
      response: mockResponse,
      error: null,
      triggerRequest: mockTriggerRequest,
    });

    render(
      <ElectionTimerSettingsButton
        label="Set Timer"
        className="custom"
        electionSchedule={electionSchedule}
        setEnableDone={setEnableDone}
        triggerSuccessToast={triggerSuccessToast}
        triggerFailureToast={triggerFailureToast}
      />,
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      setTimerData({
        startDate: mockResponse.startDate,
        endDate: mockResponse.endDate,
      }),
    );
    expect(triggerSuccessToast).toHaveBeenCalledWith("Timer Successfully Set!");
    expect(setEnableDone).toHaveBeenCalledWith(false);
  });

  it("handles error response", () => {
    (useAxios as Mock).mockReturnValue({
      response: null,
      error: { message: "Oops" },
      triggerRequest: mockTriggerRequest,
    });

    render(
      <ElectionTimerSettingsButton
        label="Cancel Timer"
        className="custom"
        electionSchedule={electionSchedule}
        setEnableDone={setEnableDone}
        triggerSuccessToast={triggerSuccessToast}
        triggerFailureToast={triggerFailureToast}
      />,
    );

    expect(triggerFailureToast).toHaveBeenCalledWith(
      "Timer Could Not Be Cancelled!",
    );
    expect(setEnableDone).toHaveBeenCalledWith(false);
  });
});
