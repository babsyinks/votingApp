import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputNumber from "components/ui/InputNumber";
jest.mock("components/ui/BaseInput");

describe("<InputNumber />", () => { 
  const baseProps = {
    name: "pin",
    value: "1234",
    onChange: jest.fn(),
    placeholder: "Enter number",
    className: "extra-class",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with required props", () => {
    render(<InputNumber {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "pin");
    expect(input).toHaveAttribute("value", "1234");
    expect(input).toHaveAttribute("placeholder", "Enter number");
    expect(input.className).toContain("inp-txt");
    expect(input.className).toContain("extra-class");
  });

  it("calls onChange when user types", () => {
    render(<InputNumber {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    fireEvent.change(input, { target: { value: "5678" } });
    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("disables the input when disabled=true", () => {
    render(<InputNumber {...baseProps} disabled />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toBeDisabled();
  });

  it("sets max attribute and restricts value based on maxLength", () => {
    render(<InputNumber {...baseProps} maxLength={4} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toHaveAttribute("max", "9999");

    // Try valid value
    fireEvent.input(input, { target: { value: "8888" } });
    expect(input.value).toBe("8888");

    // Try value exceeding max
    fireEvent.input(input, { target: { value: "12345" } });
    expect(input.value).toBe(""); // should be cleared by onInput
  });

  it("clears value if it starts with 0", () => {
    render(<InputNumber {...baseProps} maxLength={4} />);
    const input = screen.getByTestId("mock-baseinput");

    fireEvent.input(input, { target: { value: "0123" } });
    expect(input.value).toBe(""); // cleared due to leading zero
  });

  it("renders with default styles even if className is empty", () => {
    render(<InputNumber value="9" onChange={jest.fn()} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input.className).toContain("inp-txt");
  });

  it("does not set max or onInput if maxLength is not provided", () => {
    render(<InputNumber {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).not.toHaveAttribute("max");
    expect(input.getAttribute("onInput")).toBeNull();
  });
});
