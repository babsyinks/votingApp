import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BaseInput from "components/ui/BaseInput";

describe("<BaseInput />", () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      type: "text",
      name: "username",
      value: "test",
      onChange: jest.fn(),
      onInput: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("renders input with default props", () => {
    render(<BaseInput {...defaultProps} />);
    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "username");
    expect(input).toHaveValue("test");
  });

  test("calls onChange when user types", () => {
    render(<BaseInput {...defaultProps} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "new value" } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test("applies aria and accessibility attributes", () => {
    render(
      <BaseInput
        {...defaultProps}
        ariaLabel="Custom input"
        ariaLabelledBy="input-label"
        ariaDescribedBy="input-desc"
        role="searchbox"
        title="Input tooltip"
      />,
    );

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("aria-label", "Custom input");
    expect(input).toHaveAttribute("aria-labelledby", "input-label");
    expect(input).toHaveAttribute("aria-describedby", "input-desc");
    expect(input).toHaveAttribute("title", "Input tooltip");
  });

  test("supports disabled, style, and custom className", () => {
    render(
      <BaseInput
        {...defaultProps}
        disabled
        className="custom-class"
        style={{ backgroundColor: "red" }}
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("custom-class");
    expect(input).toHaveStyle({ backgroundColor: "red" });
  });

  test("supports max for number types", () => {
    defaultProps.type = "number";
    render(<BaseInput {...defaultProps} max={5} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("max", "5");
  });

  test("calls onInput when user types", () => {
    render(<BaseInput {...defaultProps} />);
    const input = screen.getByRole("textbox");

    fireEvent.input(input, { target: { value: "new value" } }); 
    expect(defaultProps.onInput).toHaveBeenCalledTimes(1);
  });

  test("resets input when resetKey changes", () => {
    const { rerender } = render(<BaseInput {...defaultProps} resetKey={1} />);
    const input1 = screen.getByRole("textbox");

    rerender(<BaseInput {...defaultProps} resetKey={2} />);
    const input2 = screen.getByRole("textbox");

    expect(input1).not.toBe(input2);
  });
});
