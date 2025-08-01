import { render, screen, fireEvent } from "@testing-library/react";
import AuthFieldPassword from "features/auth/components/AuthFieldPassword";

jest.mock("components/ui/I", () => ({ className, onClick, role, ariaLabel }) => (
  <i
    className={className}
    onClick={onClick}
    role={role}
    aria-label={ariaLabel}
    data-testid="eye-icon"
  />
));

jest.mock(
  "features/auth/components/AuthFieldWithIcon",
  () =>
    ({ type, onChange, placeholder, iconClass, rightIcon }) => (
      <div>
        <input
          type={type}
          onChange={onChange}
          placeholder={placeholder}
          className={iconClass}
          data-testid="auth-password-input"
        />
        {rightIcon}
      </div>
    )
);

describe("AuthFieldPassword", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input with password type and correct props initially", () => {
    render(<AuthFieldPassword {...defaultProps} />);
    const input = screen.getByTestId("auth-password-input");
    const toggleIcon = screen.getByTestId("eye-icon");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("placeholder", "Password");
    expect(input).toHaveClass("fa-lock");

    expect(toggleIcon).toBeInTheDocument();
    expect(toggleIcon).toHaveAttribute("role", "button");
    expect(toggleIcon).toHaveAttribute("aria-label", "Toggle password visibility");
    expect(toggleIcon).toHaveClass("fa-eye");
  });

  it("calls onChange handler when value is changed", () => {
    render(<AuthFieldPassword {...defaultProps} />);
    const input = screen.getByTestId("auth-password-input");

    fireEvent.change(input, { target: { value: "secret123" } });

    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.any(Object));
    expect(input.value).toBe("secret123");
  });

  it("toggles visibility when icon is clicked", () => {
    render(<AuthFieldPassword {...defaultProps} />);
    const input = screen.getByTestId("auth-password-input");
    const toggleIcon = screen.getByTestId("eye-icon");

    // Initial state: type="password", icon="fa-eye"
    expect(input).toHaveAttribute("type", "password");
    expect(toggleIcon).toHaveClass("fa-eye");

    // Click to show password
    fireEvent.click(toggleIcon);
    expect(screen.getByTestId("auth-password-input")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("eye-icon")).toHaveClass("fa-eye-slash");

    // Click again to hide password
    fireEvent.click(toggleIcon);
    expect(screen.getByTestId("auth-password-input")).toHaveAttribute("type", "password");
    expect(screen.getByTestId("eye-icon")).toHaveClass("fa-eye");
  });
});
