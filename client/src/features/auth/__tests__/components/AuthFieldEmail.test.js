import { render, screen, fireEvent } from "@testing-library/react";
import AuthFieldEmail from "features/auth/components/AuthFieldEmail";

jest.mock(
  "features/auth/components/AuthFieldWithIcon",
  () =>
    ({ type, name, onChange, placeholder, maxLength, iconClass }) => (
      <input
        type={type}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={iconClass}
        data-testid="auth-field-with-icon"
      />
    )
);

describe("AuthFieldEmail", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders AuthFieldWithIcon with correct props", () => {
    render(<AuthFieldEmail {...defaultProps} />);
    const input = screen.getByTestId("auth-field-with-icon");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Email");
    expect(input).toHaveClass("fa-at");
  });

  it("calls onChange handler when input value changes", () => {
    render(<AuthFieldEmail {...defaultProps} />);
    const input = screen.getByTestId("auth-field-with-icon");

    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.any(Object));
    expect(input.value).toBe("test@example.com");
  });
});
