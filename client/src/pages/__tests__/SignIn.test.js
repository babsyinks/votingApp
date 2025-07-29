import { render, screen } from "@testing-library/react";
import SignIn from "pages/SignIn";
import { useDispatch } from "react-redux";
import { useToastMessage } from "hooks/useToastMessage";
import useWindowSize from "hooks/useWindowSize";
import { userNotAuthenticated } from "features/auth/userAuthSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));
jest.mock("hooks/useToastMessage");
jest.mock("hooks/useWindowSize");

jest.mock("components/ui/ToastMessage", () => ({ toast }) => (
  <div data-testid="toast">{toast?.message || "Mock Toast"}</div>
));
jest.mock("components/ui/Hr", () => (props) => (
  <div data-testid="hr" {...props}>
    Mock Hr
  </div>
));
jest.mock("features/auth/components/AuthFrame", () => ({ children, className }) => (
  <div data-testid="auth-frame" className={className}>
    {children}
  </div>
));
jest.mock("features/auth/components/AuthHeading", () => ({ children }) => (
  <div data-testid="auth-heading">{children}</div>
));
jest.mock("features/auth/components/signIn/SignInForm", () => () => (
  <div data-testid="sign-in-form">SignInForm</div>
));
jest.mock("features/auth/components/socials/SocialButtons", () => () => (
  <div data-testid="social-buttons">SocialButtons</div>
));
jest.mock("features/auth/components/signIn/SignInAccountDoesNotExist", () => () => (
  <div data-testid="account-does-not-exist">No Account</div>
));

describe("SignIn component", () => {
  const mockDispatch = jest.fn();
  const mockTriggerFailureToast = jest.fn();
  const mockToast = { message: "Something went wrong" };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useToastMessage.mockReturnValue({
      toast: mockToast,
      toastDetailsSet: jest.fn().mockReturnValue(false),
      triggerFailureToast: mockTriggerFailureToast,
    });
    useWindowSize.mockReturnValue({ height: 700 });

    const url = new URL("http://localhost/");
    window.history.pushState({}, "", url);
  });

  it("renders all expected children", () => {
    render(<SignIn />);
    expect(screen.getByTestId("auth-frame")).toBeInTheDocument();
    expect(screen.getByTestId("auth-heading")).toHaveTextContent("Sign in");
    expect(screen.getByTestId("sign-in-form")).toBeInTheDocument();
    expect(screen.getByTestId("social-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("account-does-not-exist")).toBeInTheDocument();
    expect(screen.getByTestId("hr")).toBeInTheDocument();
  });

  it("dispatches userNotAuthenticated and triggers toast if error param is present", () => {
    const url = new URL("http://localhost/?error=Session+expired");
    window.history.pushState({}, "", url);

    render(<SignIn />);

    expect(mockDispatch).toHaveBeenCalledWith(userNotAuthenticated());
    expect(mockTriggerFailureToast).toHaveBeenCalledWith("Session expired");
  });

  it("adds mb-1p5r class if window height is less than 650", () => {
    useWindowSize.mockReturnValueOnce({ height: 600 });
    render(<SignIn />);
    expect(screen.getByTestId("auth-frame")).toHaveClass("mb-1p5r");
  });

  it("does not render ToastMessage if toastDetailsSet returns false", () => {
    render(<SignIn />);
    expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
  });

  it("renders ToastMessage if toastDetailsSet returns true", () => {
    useToastMessage.mockReturnValueOnce({
      toast: mockToast,
      triggerFailureToast: mockTriggerFailureToast,
      toastDetailsSet: () => true,
    });

    render(<SignIn />);
    expect(screen.getByTestId("toast")).toHaveTextContent("Something went wrong");
  });
});
