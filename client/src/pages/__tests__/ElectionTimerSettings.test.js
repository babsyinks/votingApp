import { render, screen } from "@testing-library/react";
import { useToastMessage } from "hooks/useToastMessage";
import { useSelector, useDispatch } from "react-redux";
import ElectionTimerSettings from "pages/ElectionTimerSettings";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";

jest.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  MemoryRouter: ({ children }) => <div>{children}</div>,
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

jest.mock("features/timer/components/timerSettings/ElectionTimerSettingsForm", () => () => (
  <div data-testid="mock-timer-form">Timer Settings Form</div>
));

jest.mock("features/timer/components/timerSettings/ElectionTimerSettingsButtons", () => () => (
  <div data-testid="mock-timer-buttons">Timer Settings Buttons</div>
));

jest.mock("components/ui/ToastMessage", () => (props) => (
  <div data-testid="mock-toast">Toast: {props.toast?.message}</div>
));

describe("ElectionTimerSettings Component", () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn.name === "userIsAdmin") return true;
      return selectorFn();
    });

    useToastMessage.mockReturnValue({
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
    expect(screen.getByTestId("mock-toast")).toHaveTextContent("Test toast message");
  });

it("dispatches fetchThenSetCurrentTimerStatus on mount", () => {
  const mockAction = { type: "mock/fetchThenSetCurrentTimerStatus" };
  fetchThenSetCurrentTimerStatus.mockReturnValue(mockAction);

  render(<ElectionTimerSettings />);
  expect(mockDispatch).toHaveBeenCalledWith(mockAction);
});


  it("redirects to home if user is not admin", () => {
    useSelector.mockImplementation(() => false); // Not admin
    render(<ElectionTimerSettings />);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
