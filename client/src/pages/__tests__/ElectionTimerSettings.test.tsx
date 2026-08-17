import React from "react";
import { render, screen } from "@testing-library/react";
import { useToastMessage } from "hooks/useToastMessage";
import { useSelector, useDispatch } from "react-redux";
import ElectionTimerSettings from "pages/ElectionTimerSettings";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import type { UseToastMessageReturn } from "hooks/useToastMessage";
import { vi, type Mock } from "vitest";

vi.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  MemoryRouter: ({ children }: { children: React.ReactElement }) => (
    <div>{children}</div>
  ),
}));

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("hooks/useToastMessage", () => ({
  useToastMessage: vi.fn(),
}));

vi.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: vi.fn(() => ({
    type: "mock/fetchThenSetCurrentTimerStatus",
  })),
}));

vi.mock(
  "features/timer/components/timerSettings/ElectionTimerSettingsForm",
  () => () => <div data-testid="mock-timer-form">Timer Settings Form</div>,
);

vi.mock(
  "features/timer/components/timerSettings/ElectionTimerSettingsButtons",
  () => () => (
    <div data-testid="mock-timer-buttons">Timer Settings Buttons</div>
  ),
);

vi.mock(
  "components/ui/ToastMessage",
  () => (props: UseToastMessageReturn) => (
    <div data-testid="mock-toast">Toast: {props.toast?.message}</div>
  ),
);

const mockedFetchThenSetCurrentTimerStatus = vi.mocked(
  fetchThenSetCurrentTimerStatus,
);

describe("ElectionTimerSettings Component", () => {
  beforeEach(() => {
    (useDispatch as Mock).mockReturnValue(mockDispatch);
    (useSelector as Mock).mockImplementation((selectorFn) => {
      if (selectorFn.name === "userIsAdmin") return true;
      return selectorFn();
    });

    (useToastMessage as Mock).mockReturnValue({
      toast: { message: "Test toast message" },
      triggerSuccessToast: vi.fn(),
      triggerFailureToast: vi.fn(),
      toastDetailsSet: () => true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders timer settings layout", () => {
    render(<ElectionTimerSettings />);

    expect(screen.getByTestId("mock-timer-form")).toBeInTheDocument();
    expect(screen.getByTestId("mock-timer-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("mock-toast")).toHaveTextContent(
      "Test toast message",
    );
  });

  it("dispatches fetchThenSetCurrentTimerStatus on mount", () => {
    const mockAction = { type: "mock/fetchThenSetCurrentTimerStatus" } as any;
    mockedFetchThenSetCurrentTimerStatus.mockReturnValue(mockAction);

    render(<ElectionTimerSettings />);
    expect(mockDispatch).toHaveBeenCalledWith(mockAction);
  });

  it("redirects to home if user is not admin", () => {
    (useSelector as Mock).mockImplementation(() => false); // Not admin
    render(<ElectionTimerSettings />);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
