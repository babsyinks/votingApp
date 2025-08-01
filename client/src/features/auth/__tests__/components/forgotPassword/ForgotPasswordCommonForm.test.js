import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordCommonForm from "features/auth/components/forgotPassword/ForgotPasswordCommonForm";

jest.mock("hooks/useAxios");
jest.mock("hooks/useToastMessage");
jest.mock("components/ui/Block", () => ({ children, className }) => (
  <div className={className}>{children}</div>
));
jest.mock("components/ui/Paragraph", () => ({ children, className }) => (
  <p className={className}>{children}</p>
));
jest.mock("components/ui/ToastMessage", () => ({ toast }) => (
  <div data-testid="toast-message">{toast.message}</div>
));
jest.mock("features/auth/components/AuthButton", () => ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
));
jest.mock("features/auth/components/AuthAlternativeAccessMeans", () => ({ btnLabel, route }) => (
  <div data-testid="auth-alternative" data-route={route}>
    {btnLabel}
  </div>
));

const mockUseAxios = {
  response: null,
  error: null,
  triggerRequest: jest.fn(),
};
const mockUseToastMessage = {
  toast: { message: "", type: "" },
  triggerSuccessToast: jest.fn(),
  triggerFailureToast: jest.fn(),
  toastDetailsSet: jest.fn(() => false),
};

jest.mock("hooks/useAxios", () => ({
  useAxios: () => mockUseAxios,
}));
jest.mock("hooks/useToastMessage", () => ({
  useToastMessage: () => mockUseToastMessage,
}));

describe("ForgotPasswordCommonForm", () => {
  const defaultProps = {
    path: "/forgot-password",
    data: { email: "test@example.com" },
    buttonLabel: "Send Reset Link",
    clearField: jest.fn(),
    children: <div>Test Child</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAxios.response = null;
    mockUseAxios.error = null;
    mockUseToastMessage.toast = { message: "", type: "" };
    mockUseToastMessage.toastDetailsSet.mockReturnValue(false);
  });

  it("renders the component with children and AuthButton", () => {
    render(<ForgotPasswordCommonForm {...defaultProps} />);
    expect(screen.getByText("Test Child")).toBeInTheDocument();
    expect(screen.getByText("Send Reset Link")).toBeInTheDocument();
  });

  it("calls triggerRequest with correct params when AuthButton is clicked", async () => {
    render(<ForgotPasswordCommonForm {...defaultProps} />);
    const button = screen.getByText("Send Reset Link");
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockUseAxios.triggerRequest).toHaveBeenCalledWith({
        params: {
          method: "POST",
          url: "/api/v1/auth/forgot-password",
          data: { email: "test@example.com" },
        },
      });
    });
  });

  it("does not call triggerRequest when button is disabled", () => {
    render(<ForgotPasswordCommonForm {...defaultProps} buttonDisabled={true} />);
    const button = screen.getByText("Send Reset Link");
    fireEvent.click(button);
    expect(mockUseAxios.triggerRequest).not.toHaveBeenCalled();
  });

  it("displays success message and calls clearField for /forgot-password path when response is received", async () => {
    mockUseAxios.response = { message: "Reset link sent" };
    render(<ForgotPasswordCommonForm {...defaultProps} />);
    await waitFor(() => {
      expect(mockUseToastMessage.triggerSuccessToast).toHaveBeenCalledWith("Reset link sent");
    });

    await waitFor(() => {
      expect(defaultProps.clearField).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText("The link is in your inbox or spam folder. It will expire in 10 minutes"),
      ).toBeInTheDocument();
    });
  });

  it("displays success message and AuthAlternativeAccessMeans for /reset-password path when response is received", async () => {
    mockUseAxios.response = { message: "Password reset successful" };
    const props = { ...defaultProps, path: "/reset-password" };
    render(<ForgotPasswordCommonForm {...props} />);
    await waitFor(() => {
      expect(mockUseToastMessage.triggerSuccessToast).toHaveBeenCalledWith(
        "Password reset successful",
      );
    });
    await waitFor(() => {
      expect(defaultProps.clearField).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("auth-alternative")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Click to sign in")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("auth-alternative")).toHaveAttribute("data-route", "/signin");
    });
  });

  it("displays error toast when error is received", async () => {
    mockUseAxios.error = { message: "Request failed" };
    render(<ForgotPasswordCommonForm {...defaultProps} />);
    await waitFor(() => {
      expect(mockUseToastMessage.triggerFailureToast).toHaveBeenCalledWith("Request failed");
    });
  });

  it("renders ToastMessage when toastDetailsSet returns true", () => {
    mockUseToastMessage.toastDetailsSet.mockReturnValue(true);
    mockUseToastMessage.toast = { message: "Test toast", type: "success" };
    render(<ForgotPasswordCommonForm {...defaultProps} />);
    expect(screen.getByTestId("toast-message")).toBeInTheDocument();
    expect(screen.getByText("Test toast")).toBeInTheDocument();
  });
});
