import { render, screen, fireEvent } from "@testing-library/react";
import AuthFieldUser from "features/auth/components/AuthFieldUser";

jest.mock(
  "features/auth/components/AuthFieldWithIcon",
  () =>
    ({ onChange, placeholder, iconClass }) => (
      <input
        onChange={onChange}
        placeholder={placeholder}
        className={iconClass}
        data-testid="auth-user-input"
      />
    )
);

describe("AuthFieldUser", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
    placeholder: "Username",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders AuthFieldWithIcon with correct props", () => {
    render(<AuthFieldUser {...defaultProps} />);
    const input = screen.getByTestId("auth-user-input");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Username");
    expect(input).toHaveClass("fa-user");
  });

  it("calls onChange handler when input value changes", () => {
    render(<AuthFieldUser {...defaultProps} />);
    const input = screen.getByTestId("auth-user-input");

    fireEvent.change(input, { target: { value: "john_doe" } });

    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.any(Object));
    expect(input.value).toBe("john_doe");
  });
});
