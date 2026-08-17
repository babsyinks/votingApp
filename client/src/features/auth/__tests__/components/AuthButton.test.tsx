import { render, screen, fireEvent } from "@testing-library/react";
import AuthButton from "features/auth/components/AuthButton";
import { ButtonProps } from "components/ui/Button";
import { vi } from "vitest";

vi.mock(
  "components/ui/Button",
  () =>
    ({ children, className, onClick, disabled }: ButtonProps) => (
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
        data-testid="button"
      >
        {children}
      </button>
    ),
);

describe("AuthButton", () => {
  const defaultProps = {
    onClick: vi.fn(),
    children: "Click Me",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Button with default props and correct className", () => {
    render(<AuthButton {...defaultProps} />);
    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("neumorphic-button mb-1r");
    expect(button).toHaveTextContent("Click Me");
    expect(button).not.toBeDisabled();
  });

  it("renders Button with custom className", () => {
    render(<AuthButton {...defaultProps} className="custom-class" />);
    const button = screen.getByTestId("button");
    expect(button).toHaveClass("neumorphic-button mb-1r custom-class");
    expect(button).toHaveTextContent("Click Me");
  });

  it("renders Button as disabled when disabled prop is true", () => {
    render(<AuthButton {...defaultProps} disabled={true} />);
    const button = screen.getByTestId("button");
    expect(button).toBeDisabled();
  });

  it("calls onClick handler when Button is clicked and not disabled", () => {
    render(<AuthButton {...defaultProps} />);
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick handler when Button is disabled", () => {
    render(<AuthButton {...defaultProps} disabled={true} />);
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });
});
