import { render, screen, fireEvent } from "@testing-library/react";
import AuthFieldCode from "features/auth/components/AuthFieldCode";
import { AuthFieldWithIconProps } from "features/auth/components/AuthFieldWithIcon";

jest.mock(
  "features/auth/components/AuthFieldWithIcon",
  () =>
    ({
      type,
      name,
      onChange,
      placeholder,
      maxLength,
      iconClass,
    }: AuthFieldWithIconProps) => (
      <input
        type={type}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={iconClass}
        data-testid="auth-field-with-icon"
      />
    ),
);

describe("AuthFieldCode", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders AuthFieldWithIcon with default props", () => {
    render(<AuthFieldCode {...defaultProps} />);
    const input = screen.getByTestId("auth-field-with-icon");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("name", "auth-field-code");
    expect(input).toHaveAttribute("placeholder", "Code");
    expect(input).toHaveAttribute("maxLength", "6");
    expect(input).toHaveClass("fa-key");
  });

  it("renders AuthFieldWithIcon with custom maxLength", () => {
    render(<AuthFieldCode {...defaultProps} maxLength={8} />);
    const input = screen.getByTestId("auth-field-with-icon");
    expect(input).toHaveAttribute("maxLength", "8");
  });

  it("calls onChange handler when input value changes", () => {
    render(<AuthFieldCode {...defaultProps} />);
    const input = screen.getByTestId(
      "auth-field-with-icon",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "123456" } });

    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.any(Object));
    expect(input.value).toBe("123456");
  });
});
