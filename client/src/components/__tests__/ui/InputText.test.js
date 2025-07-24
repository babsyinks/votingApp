import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputText from "components/ui/InputText";
import getCompClasses from "util/getCompClasses";

jest.mock("components/ui/BaseInput", () => (props) => {
  const { className, ...rest } = props;
  return <input data-testid="mock-baseinput" className={className} {...rest} />;
});

jest.mock("components/ui/InputText.module.css", () => ({
  "inp-txt": "inp-txt",
  otherClass: "otherClass",
}));

jest.mock("util/getCompClasses", () => {
  return jest.fn();
});

describe("<InputText />", () => {
  const baseProps = {
    type: "text",
    name: "username",
    value: "John Doe",
    onChange: jest.fn(),
    placeholder: "Enter name",
    className: "otherClass",
  };

  const passwordProps = {
    type: "password",
    name: "password",
    value: "password",
    onChange: jest.fn(),
    placeholder: "Enter password",
    className: "otherClass",
  };

  const emailProps = {
    type: "email",
    name: "email",
    value: "johnDoe@mail.com",
    onChange: jest.fn(),
    placeholder: "Enter email",
    className: "otherClass",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input with correct value and placeholder", () => {
    render(<InputText {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "username");
    expect(input).toHaveAttribute("placeholder", "Enter name");
    expect(input).toHaveValue("John Doe");
  });

  it("calls onChange when text is entered", () => {
    render(<InputText {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    fireEvent.change(input, { target: { value: "Jane" } });
    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("applies only default class names when computed classnames are not passed in", () => {
    getCompClasses.mockReturnValue("");
    delete baseProps.className
    render(<InputText {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input.className).toContain("inp-txt");
    expect(input.className).not.toContain("resolved-custom-class");
  });

  it("applies default and computed class names", () => {
    getCompClasses.mockReturnValue("resolved-custom-class");
    render(<InputText {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input.className).toContain("inp-txt");
    expect(input.className).toContain("resolved-custom-class");
  });

  it("disables the input when disabled prop is true", () => {
    render(<InputText {...baseProps} disabled />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toBeDisabled();
  });

  it("renders with type=password", () => {
    render(<InputText {...passwordProps} type="password" />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("name", "password");
    expect(input).toHaveAttribute("placeholder", "Enter password");
    expect(input).toHaveValue("password");
  });

  it("renders with type=email", () => {
    render(<InputText {...emailProps} type="email" />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("placeholder", "Enter email");
    expect(input).toHaveValue("johnDoe@mail.com");
  });
});
