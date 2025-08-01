import { render, screen, fireEvent } from "@testing-library/react";
import { useParams } from "react-router-dom";
import useWindowSize from "hooks/useWindowSize";
import ForgotPasswordResetPassword from "features/auth/components/forgotPassword/ForgotPasswordResetPassword";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));
jest.mock("hooks/useWindowSize");
jest.mock(
  "features/auth/components/forgotPassword/ForgotPasswordCommonForm",
  () =>
    ({ path, data, buttonLabel, clearField, buttonDisabled, children }) => (
      <div data-testid="forgot-password-common-form">
        <div>{children}</div>
        <button onClick={clearField} data-testid="clear-field-button">
          {buttonLabel}
        </button>
        <div data-testid="form-props">
          Path: {path}, ResetCode: {data.resetCode}, Password: {data.password}, Disabled:{" "}
          {buttonDisabled.toString()}
        </div>
      </div>
    ),
);
jest.mock("components/ui/Block", () => ({ children, type, className }) => (
  <div className={className} data-testid="block">
    {children}
  </div>
));
jest.mock("features/auth/components/AuthFrame", () => ({ children, type, isFull, className }) => (
  <div className={className} data-testid="auth-frame">
    {children}
  </div>
));
jest.mock("features/auth/components/AuthFieldPassword", () => ({ value, onChange, placeholder }) => (
  <input
    type="password"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    data-testid={placeholder === "Enter New Password" ? "password-input" : "password-dup-input"}
  />
));
jest.mock("features/auth/components/AuthPasswordValidator", () => ({ password, setPasswordValid }) => {
  // Simulate password validation logic
  setPasswordValid(password.length >= 8);
  return <div data-testid="auth-password-validator">Validator</div>;
});
jest.mock("features/auth/components/AuthValidationIndicator", () => ({ label, isValid, usePresetWidths }) => (
  <div data-testid="auth-validation-indicator">
    {label} (Valid: {isValid.toString()})
  </div>
));

describe("ForgotPasswordResetPassword", () => {
  const mockSetBottomSpacingClass = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ resetCode: "abc123" });
    useWindowSize.mockReturnValue({ height: 700 });
  });

  it("renders ForgotPasswordCommonForm with correct props and AuthFieldPassword inputs", () => {
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    expect(screen.getByTestId("forgot-password-common-form")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-dup-input")).toBeInTheDocument();
    expect(screen.getByTestId("form-props")).toHaveTextContent("Path: /reset-password");
    expect(screen.getByTestId("form-props")).toHaveTextContent("ResetCode: abc123");
    expect(screen.getByTestId("form-props")).toHaveTextContent("Password:");
    expect(screen.getByTestId("form-props")).toHaveTextContent("Disabled: true");
    expect(screen.getByText("Update Password")).toBeInTheDocument();
  });

  it("updates password and passwordDup states via AuthFieldPassword inputs", () => {
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    const passwordInput = screen.getByTestId("password-input");
    const passwordDupInput = screen.getByTestId("password-dup-input");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    expect(passwordInput).toHaveValue("newpassword123");
    expect(screen.getByTestId("form-props")).toHaveTextContent("Password: newpassword123");

    fireEvent.change(passwordDupInput, { target: { value: "newpassword123" } });
    expect(passwordDupInput).toHaveValue("newpassword123");
  });

  it("clears password and passwordDup states when clearField is called", () => {
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    const passwordInput = screen.getByTestId("password-input");
    const passwordDupInput = screen.getByTestId("password-dup-input");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(passwordDupInput, { target: { value: "newpassword123" } });
    expect(passwordInput).toHaveValue("newpassword123");
    expect(passwordDupInput).toHaveValue("newpassword123");

    const clearButton = screen.getByTestId("clear-field-button");
    fireEvent.click(clearButton);
    expect(passwordInput).toHaveValue("");
    expect(passwordDupInput).toHaveValue("");
    expect(screen.getByTestId("form-props")).toHaveTextContent("Password:");
  });

  it("renders AuthPasswordValidator when password is non-empty and passwordDup is empty", () => {
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    expect(screen.getByTestId("auth-password-validator")).toBeInTheDocument();
  });

  it("sets passwordValid via AuthPasswordValidator and updates buttonDisabled", () => {
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(passwordInput, { target: { value: "short" } }); // < 8 chars
    expect(screen.getByTestId("form-props")).toHaveTextContent("Disabled: true");

    fireEvent.change(passwordInput, { target: { value: "longenough123" } }); // >= 8 chars
    expect(screen.getByTestId("form-props")).toHaveTextContent("Disabled: false");
  });

  it("renders AuthValidationIndicator when both password and passwordDup are non-empty", () => {
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    const passwordInput = screen.getByTestId("password-input");
    const passwordDupInput = screen.getByTestId("password-dup-input");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(passwordDupInput, { target: { value: "newpassword123" } });
    expect(screen.getByTestId("auth-validation-indicator")).toBeInTheDocument();
    expect(screen.getByText("Password Match (Valid: true)")).toBeInTheDocument();

    fireEvent.change(passwordDupInput, { target: { value: "different" } });
    expect(screen.getByText("Password Mismatch (Valid: false)")).toBeInTheDocument();
  });

  it("calls setBottomSpacingClass with mb-1p5r when height < 650 and showAuthPasswordValidator is true", () => {
    useWindowSize.mockReturnValue({ height: 600 });
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    expect(mockSetBottomSpacingClass).toHaveBeenCalledWith("mb-1p5r");
  });

  it("calls setBottomSpacingClass with empty string when height < 650 and showAuthPasswordValidator is false", () => {
    useWindowSize.mockReturnValue({ height: 600 });
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    expect(mockSetBottomSpacingClass).toHaveBeenCalledWith("");
  });

  it("does not call setBottomSpacingClass when height >= 650", () => {
    useWindowSize.mockReturnValue({ height: 700 });
    render(<ForgotPasswordResetPassword setBottomSpacingClass={mockSetBottomSpacingClass} />);
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    expect(mockSetBottomSpacingClass).not.toHaveBeenCalled();
  });
});
