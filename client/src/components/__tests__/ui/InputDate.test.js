import React from "react";
import { render, screen } from "@testing-library/react";
import InputDate from "components/ui/InputDate";

// Mock BaseInput
jest.mock("components/ui/BaseInput", () => (props) => (
  <input data-testid="mock-baseinput" {...props} />
));

describe("<InputDate />", () => {
  const baseProps = {
    name: "dob",
    value: "2025-07-23",
    onChange: jest.fn(),
    placeholder: "Enter your birth date",
    disabled: false,
    className: "custom-date-input",
    style: { borderColor: "blue" },
  };

  it("renders BaseInput", () => {
    render(<InputDate {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");
    expect(input).toBeInTheDocument();
  });

  it("passes props to BaseInput", () => {
    render(<InputDate {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");
    expect(input).toHaveAttribute("name", "dob");
    expect(input).toHaveAttribute("value", "2025-07-23");
    expect(input).toHaveAttribute("placeholder", "Enter your birth date");
    expect(input).not.toBeDisabled();
    expect(input).toHaveClass("custom-date-input");
    expect(input).toHaveStyle("border-color: blue");
  });

  it("handles missing className without error", () => {
    const { className, ...rest } = baseProps;
    render(<InputDate {...rest} />);
    const input = screen.getByTestId("mock-baseinput");
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveClass("undefined"); // no accidental string class
  });
});
