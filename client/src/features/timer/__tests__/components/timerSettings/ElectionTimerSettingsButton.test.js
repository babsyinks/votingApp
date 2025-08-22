import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ElectionTimerSettingsButton from "features/timer/components/timerSettings/ElectionTimerSettingsButton";
import { useDispatch } from "react-redux";
import { setTimerData } from "features/timer/timerSlice";
import { useAxios } from "hooks/useAxios";
import useResponsiveFontSize from "features/timer/hooks/useResponsiveFontSize";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("features/timer/hooks/useResponsiveFontSize", () => jest.fn());

jest.mock("features/timer/timerSlice", () => ({
  setTimerData: jest.fn(),
}));

describe("ElectionTimerSettingsButton", () => {
  let mockDispatch;
  let mockTriggerRequest;
  let triggerSuccessToast;
  let triggerFailureToast;
  let setEnableDone;
  let electionSchedule;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockTriggerRequest = jest.fn();
    electionSchedule = {
      startDate: 1754816400000,
      endDate: 1754902800000,
    };
    useDispatch.mockReturnValue(mockDispatch);
    useAxios.mockReturnValue({
      response: null,
      error: null,
      triggerRequest: mockTriggerRequest,
    });
    useResponsiveFontSize.mockReturnValue("text-lg");

    triggerSuccessToast = jest.fn();
    triggerFailureToast = jest.fn();
    setEnableDone = jest.fn();
    jest.clearAllMocks();
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

    useAxios.mockReturnValue({
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
    useAxios.mockReturnValue({
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

    expect(triggerFailureToast).toHaveBeenCalledWith("Timer Could Not Be Cancelled!");
    expect(setEnableDone).toHaveBeenCalledWith(false);
  });
});
