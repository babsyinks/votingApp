import React from "react";
import { render, screen } from "@testing-library/react";
import { useToastMessage } from "hooks/useToastMessage";
import { useSelector, useDispatch } from "react-redux";
import ElectionTimerSettings from "pages/ElectionTimerSettings";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import type { UseToastMessageReturn } from "hooks/useToastMessage";

jest.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  MemoryRouter: ({ children }: { children: React.ReactElement }) => (
    <div>{children}</div>
  ),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("hooks/useToastMessage", () => ({
  useToastMessage: jest.fn(),
}));

jest.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: jest.fn(() => ({
    type: "mock/fetchThenSetCurrentTimerStatus",
  })),
}));

jest.mock(
  "features/timer/components/timerSettings/ElectionTimerSettingsForm",
  () => () => <div data-testid="mock-timer-form">Timer Settings Form</div>,
);

jest.mock(
  "features/timer/components/timerSettings/ElectionTimerSettingsButtons",
  () => () => (
    <div data-testid="mock-timer-buttons">Timer Settings Buttons</div>
  ),
);

jest.mock(
  "components/ui/ToastMessage",
  () => (props: UseToastMessageReturn) => (
    <div data-testid="mock-toast">Toast: {props.toast?.message}</div>
  ),
);

const mockedFetchThenSetCurrentTimerStatus = jest.mocked(
  fetchThenSetCurrentTimerStatus,
);

describe("ElectionTimerSettings Component", () => {
  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selectorFn) => {
      if (selectorFn.name === "userIsAdmin") return true;
      return selectorFn();
    });

    (useToastMessage as jest.Mock).mockReturnValue({
      toast: { message: "Test toast message" },
      triggerSuccessToast: jest.fn(),
      triggerFailureToast: jest.fn(),
      toastDetailsSet: () => true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    (useSelector as jest.Mock).mockImplementation(() => false); // Not admin
    render(<ElectionTimerSettings />);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
