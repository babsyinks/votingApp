import React from "react";
import { render, screen } from "@testing-library/react";
import Input from "components/ui/Input";
import { InputTextProps } from "components/ui/InputText";
import { InputFileProps } from "components/ui/InputFile";
import { InputDateProps } from "components/ui/InputDate";
import { InputTimeProps } from "components/ui/InputTime";
import { InputNumberProps } from "components/ui/InputNumber";

// Mock all input subcomponents
jest.mock("components/ui/InputText", () => (props: InputTextProps) => (
  <input data-testid="text-input" {...props} />
));
jest.mock("components/ui/InputFile", () => (props: InputFileProps) => (
  <input data-testid="file-input" {...props} />
));
jest.mock("components/ui/InputDate", () => (props: InputDateProps) => (
  <input data-testid="date-input" {...props} />
));
jest.mock("components/ui/InputTime", () => (props: InputTimeProps) => (
  <input data-testid="time-input" {...props} />
));
jest.mock("components/ui/InputNumber", () => (props: InputNumberProps) => (
  <input data-testid="number-input" {...props} />
));

describe("<Input />", () => {
  const baseProps = {
    name: "testInput",
    onChange: jest.fn(),
    placeholder: "Enter value",
    className: "test-class",
    style: { color: "blue" },
  };

  it("renders InputText for 'text' type", () => {
    render(<Input {...baseProps} type="text" value="hello" />);
    expect(screen.getByTestId("text-input")).toBeInTheDocument();
  });

  it("renders InputText for 'password' type", () => {
    render(<Input {...baseProps} type="password" value="secret" />);
    expect(screen.getByTestId("text-input")).toBeInTheDocument();
  });

  it("renders InputText for 'email' type", () => {
    render(<Input {...baseProps} type="email" value="test@example.com" />);
    expect(screen.getByTestId("text-input")).toBeInTheDocument();
  });

  it("renders InputFile for 'file' type without triggering InvalidStateError", () => {
    render(<Input {...baseProps} type="file" value="" />);
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  it("renders InputDate for 'date' type", () => {
    render(<Input {...baseProps} type="date" value="2025-07-23" />);
    expect(screen.getByTestId("date-input")).toBeInTheDocument();
  });

  it("renders InputTime for 'time' type", () => {
    render(<Input {...baseProps} type="time" value="14:00" />);
    expect(screen.getByTestId("time-input")).toBeInTheDocument();
  });

  it("renders InputNumber for 'number' type", () => {
    render(<Input {...baseProps} type="number" value="5" />);
    expect(screen.getByTestId("number-input")).toBeInTheDocument();
  });
});
