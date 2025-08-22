/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen } from "@testing-library/react";
import InputAndLabelGroup from "components/ui/InputAndLabelGroup";

// Mock subcomponents
jest.mock("components/ui/Label", () => (props) => (
  <label data-testid="mock-label" htmlFor={props.name}>
    {props.children}
  </label>
));

jest.mock("components/ui/Input", () => (props) => (
  <input data-testid="mock-input" {...props} />
));

jest.mock("components/ui/Block", () => (props) => (
  <div data-testid="mock-block">{props.children}</div>
));

describe("<InputAndLabelGroup />", () => {
  const baseProps = {
    label: "Email Address",
    type: "email",
    name: "email",
    value: "test@example.com",
    onChange: jest.fn(),
    placeholder: "Enter your email",
    className: "email-class",
    style: { color: "blue" },
  };

  it("renders the Block wrapper", () => {
    render(<InputAndLabelGroup {...baseProps} />);
    expect(screen.getByTestId("mock-block")).toBeInTheDocument();
  });

  it("renders the Label with correct text and htmlFor", () => {
    render(<InputAndLabelGroup {...baseProps} />);
    const label = screen.getByTestId("mock-label");
    expect(label).toHaveTextContent("Email Address");
    expect(label).toHaveAttribute("for", "email");
  });

  it("renders the Input with correct props", () => {
    render(<InputAndLabelGroup {...baseProps} />);
    const input = screen.getByTestId("mock-input");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("value", "test@example.com");
    expect(input).toHaveAttribute("placeholder", "Enter your email");
    expect(input).toHaveClass("email-class");
    expect(input).toHaveStyle("color: blue");
  });

  it("renders Label with empty htmlFor if name is not provided", () => {
    const { label, ...rest } = baseProps;
    render(<InputAndLabelGroup label={label} {...rest} name={undefined} />);
    const labelEl = screen.getByTestId("mock-label");
    expect(labelEl).toHaveAttribute("for", "");
  });
});
