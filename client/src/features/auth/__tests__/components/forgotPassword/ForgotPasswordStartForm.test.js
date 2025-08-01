import { render, screen, fireEvent } from "@testing-library/react";
import ForgotPasswordStartForm from "features/auth/components/forgotPassword/ForgotPasswordStartForm";

jest.mock("features/auth/components/AuthFieldEmail", () => ({ value, onChange }) => (
  <input type="email" value={value} onChange={onChange} data-testid="email-input" />
));
jest.mock(
  "features/auth/components/forgotPassword/ForgotPasswordCommonForm",
  () =>
    ({ path, data, buttonLabel, clearField, children }) => (
      <div data-testid="forgot-password-common-form">
        <div>{children}</div>
        <button onClick={clearField} data-testid="clear-field-button">
          {buttonLabel}
        </button>
        <div data-testid="form-props">
          Path: {path}, Email: {data.email}
        </div>
      </div>
    ),
);

describe("ForgotPasswordStartForm", () => {
  it("renders AuthFieldEmail and ForgotPasswordCommonForm with correct props", () => {
    render(<ForgotPasswordStartForm />);
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("forgot-password-common-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-props")).toHaveTextContent("Path: /forgot-password");
    expect(screen.getByTestId("form-props")).toHaveTextContent("Email:");
    expect(screen.getByText("Send Reset Link")).toBeInTheDocument();
  });

  it("updates email state when AuthFieldEmail input changes", () => {
    render(<ForgotPasswordStartForm />);
    const emailInput = screen.getByTestId("email-input");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
    expect(screen.getByTestId("form-props")).toHaveTextContent("Email: test@example.com");
  });

  it("clears email state when clearField is called", () => {
    render(<ForgotPasswordStartForm />);
    const emailInput = screen.getByTestId("email-input");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
    const clearButton = screen.getByTestId("clear-field-button");
    fireEvent.click(clearButton);
    expect(emailInput).toHaveValue("");
    expect(screen.getByTestId("form-props")).toHaveTextContent("Email:");
  });
});
