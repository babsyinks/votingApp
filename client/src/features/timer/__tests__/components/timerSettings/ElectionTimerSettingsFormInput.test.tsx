
import { render, screen, fireEvent } from "@testing-library/react";
import ElectionTimerSettingsFormInput from "features/timer/components/timerSettings/ElectionTimerSettingsFormInput";
import { useSelector } from "react-redux";
import useResponsiveFontSize from "features/timer/hooks/useResponsiveFontSize";
import type { ElectionTimerSettingsFormInputProps } from "features/timer/components/timerSettings/ElectionTimerSettingsFormInput";
import { vi } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("features/timer/hooks/useResponsiveFontSize", () => vi.fn());

describe("ElectionTimerSettingsFormInput", () => {
  const mockUseResponsiveFontSize = vi.mocked(useResponsiveFontSize);
  const mockedUseSelector = vi.mocked(useSelector);

  const baseProps: ElectionTimerSettingsFormInputProps = {
    label: "Start Date",
    type: "date",
    value: "2025-08-08",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    mockUseResponsiveFontSize.mockReturnValue("text-sm-r");
    vi.clearAllMocks();
  });

  it("renders label and input with correct props", () => {
    mockedUseSelector.mockReturnValue({ startDate: null, endDate: null });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    // Label should render correctly
    expect(screen.getByText(/Start Date:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toHaveClass("text-sm-r");

    // Input should render with correct type and value
    const input = screen.getByLabelText(/Start Date/i);
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveValue("2025-08-08");
    expect(input).not.toBeDisabled();
  });

  it("calls onChange when input value changes", () => {
    mockedUseSelector.mockReturnValue({ startDate: null, endDate: null });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    const input = screen.getByLabelText(/Start Date/i);
    fireEvent.change(input, { target: { value: "2025-08-08T11:00" } });

    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("disables input if timer.startDate exists", () => {
    mockedUseSelector.mockReturnValue({ startDate: "2025-08-01", endDate: null });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    expect(screen.getByLabelText(/Start Date/i)).toBeDisabled();
  });

  it("disables input if timer.endDate exists", () => {
    mockedUseSelector.mockReturnValue({ startDate: null, endDate: "2025-08-10" });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    expect(screen.getByLabelText(/Start Date/i)).toBeDisabled();
  });

  it("keeps input enabled if both startDate and endDate are null", () => {
    mockedUseSelector.mockReturnValue({ startDate: null, endDate: null });

    render(<ElectionTimerSettingsFormInput {...baseProps} />);

    expect(screen.getByLabelText(/Start Date/i)).not.toBeDisabled();
  });
});
