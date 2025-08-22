import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ElectionTimerSettingsFormInput from "features/timer/components/timerSettings/ElectionTimerSettingsFormInput";
import { useSelector } from "react-redux";
import useResponsiveFontSize from "features/timer/hooks/useResponsiveFontSize";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("features/timer/hooks/useResponsiveFontSize", () => jest.fn());

describe("ElectionTimerSettingsFormInput", () => {
  const baseProps = {
    label: "Start Date",
    type: "date",
    value: "2025-08-08",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    useResponsiveFontSize.mockReturnValue("text-sm");
    jest.clearAllMocks();
  });

  it("renders label and input with correct props", () => {
    useSelector.mockReturnValue({ startDate: null, endDate: null });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    // Label should render correctly
    expect(screen.getByText(/Start Date:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toHaveClass("text-sm");

    // Input should render with correct type and value
    const input = screen.getByLabelText(/Start Date/i);
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveValue("2025-08-08");
    expect(input).not.toBeDisabled();
  });

  it("calls onChange when input value changes", () => {
    useSelector.mockReturnValue({ startDate: null, endDate: null });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    const input = screen.getByLabelText(/Start Date/i);
    fireEvent.change(input, { target: { value: "2025-08-08T11:00" } });

    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("disables input if timer.startDate exists", () => {
    useSelector.mockReturnValue({ startDate: "2025-08-01", endDate: null });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    expect(screen.getByLabelText(/Start Date/i)).toBeDisabled();
  });

  it("disables input if timer.endDate exists", () => {
    useSelector.mockReturnValue({ startDate: null, endDate: "2025-08-10" });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    expect(screen.getByLabelText(/Start Date/i)).toBeDisabled();
  });

  it("keeps input enabled if both startDate and endDate are null", () => {
    useSelector.mockReturnValue({ startDate: null, endDate: null });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    expect(screen.getByLabelText(/Start Date/i)).not.toBeDisabled();
  });
});
