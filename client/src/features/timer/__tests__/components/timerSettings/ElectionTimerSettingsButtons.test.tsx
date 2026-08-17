
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import ElectionTimerSettingsButtons from "features/timer/components/timerSettings/ElectionTimerSettingsButtons";
import ElectionTimerSettingsButton from "features/timer/components/timerSettings/ElectionTimerSettingsButton";
import { vi, type Mock } from "vitest";

vi.mock(
  "features/timer/components/timerSettings/ElectionTimerSettingsButton",
  () => vi.fn(() => <div data-testid="mock-button" />),
);

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

describe("ElectionTimerSettingsButtons", () => {
  const defaultProps = {
    setEnableDone: vi.fn(),
    triggerSuccessToast: vi.fn(),
    triggerFailureToast: vi.fn(),
    electionSchedule: {
      startDate: 1754816400000,
      endDate: 1754902800000,
    },
  };

  const mockUseSelector = useSelector as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders only 'Set Timer' button when enableDone is true and timer has no start/end date", () => {
    mockUseSelector.mockReturnValue({ startDate: "", endDate: "" });

    render(
      <ElectionTimerSettingsButtons enableDone={true} {...defaultProps} />,
    );

    expect(ElectionTimerSettingsButton).toHaveBeenCalledTimes(1);
    expect(ElectionTimerSettingsButton).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Set Timer", className: "pst-btn" }),
      {},
    );
  });

  it("renders only 'Cancel Timer' button when enableDone is false but timer has startDate or endDate", () => {
    mockUseSelector.mockReturnValue({ startDate: 1754816400000, endDate: 0 });

    render(
      <ElectionTimerSettingsButtons enableDone={false} {...defaultProps} />,
    );

    expect(ElectionTimerSettingsButton).toHaveBeenCalledTimes(1);
    expect(ElectionTimerSettingsButton).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Cancel Timer", className: "neg-btn" }),
      {},
    );
  });

  it("renders both 'Set Timer' and 'Cancel Timer' buttons when enableDone is true and timer has startDate or endDate", () => {
    mockUseSelector.mockReturnValue({
      startDate: 1754816400000,
      endDate: 1754902800000,
    });

    render(
      <ElectionTimerSettingsButtons enableDone={true} {...defaultProps} />,
    );

    expect(ElectionTimerSettingsButton).toHaveBeenCalledTimes(2);
    expect(ElectionTimerSettingsButton).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ label: "Set Timer", className: "pst-btn" }),
      {},
    );
    expect(ElectionTimerSettingsButton).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ label: "Cancel Timer", className: "neg-btn" }),
      {},
    );
  });

  it("renders nothing when enableDone is false and timer has no start/end date", () => {
    mockUseSelector.mockReturnValue({ startDate: 0, endDate: 0 });

    render(
      <ElectionTimerSettingsButtons enableDone={false} {...defaultProps} />,
    );

    expect(ElectionTimerSettingsButton).not.toHaveBeenCalled();
    expect(screen.queryByTestId("mock-button")).not.toBeInTheDocument();
  });
});
