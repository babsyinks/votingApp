import { render, screen } from "@testing-library/react";
import AuthFieldWithIcon from "features/auth/components/AuthFieldWithIcon";

jest.mock("components/ui/InputWithIcon", () => ({ iconClass, rightIcon, type, value, onChange, placeholder, className }) => (
  <div data-testid="input-icon-wrapper" className="input-icon-wrapper">
    {iconClass && (
      <i data-testid="left-icon" className={`fas ${iconClass} input-icon`} />
    )}
    <input
      data-testid="input-element"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input-with-icon ${className}`}
    />
    {rightIcon && (
      <div data-testid="right-icon-wrapper" className="input-icon-right">
        {rightIcon}
      </div>
    )}
  </div>
));

describe("AuthFieldWithIcon", () => {
  const defaultProps = {
    value: "hello@example.com",
    onChange: jest.fn(),
    placeholder: "Email",
    iconClass: "fa-at",
  };

  it("renders input with correct type, value, and placeholder", () => {
    render(<AuthFieldWithIcon {...defaultProps} />);
    const input = screen.getByTestId("input-element");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("hello@example.com");
    expect(input).toHaveAttribute("placeholder", "Email");
  });

  it("renders the left icon when iconClass is provided", () => {
    render(<AuthFieldWithIcon {...defaultProps} />);
    const leftIcon = screen.getByTestId("left-icon");

    expect(leftIcon).toBeInTheDocument();
    expect(leftIcon).toHaveClass("fas fa-at input-icon");
  });

  it("renders the right icon when provided", () => {
    render(
      <AuthFieldWithIcon
        {...defaultProps}
        rightIcon={<span data-testid="custom-right-icon">👁</span>}
      />
    );

    const rightIconWrapper = screen.getByTestId("right-icon-wrapper");
    const rightIcon = screen.getByTestId("custom-right-icon");

    expect(rightIconWrapper).toBeInTheDocument();
    expect(rightIcon).toBeInTheDocument();
    expect(rightIcon).toHaveTextContent("👁");
  });

  it("defaults to type=text when no type is specified", () => {
    render(<AuthFieldWithIcon {...defaultProps} />);
    const input = screen.getByTestId("input-element");

    expect(input).toHaveAttribute("type", "text");
  });

  it("applies the custom className to the input", () => {
    render(<AuthFieldWithIcon {...defaultProps} />);
    const input = screen.getByTestId("input-element");

    expect(input).toHaveClass("input-with-icon bg-blue-faded neumorphic-input mb-2r");
  });
});
