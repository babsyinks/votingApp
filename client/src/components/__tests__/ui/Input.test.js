import React from "react";
import { render, screen } from "@testing-library/react";
import Input from "components/ui/Input";

// Mock all input subcomponents
jest.mock("components/ui/InputText", () => (props) => (
  <input data-testid="text-input" {...props} />
));
jest.mock("components/ui/InputFile", () => (props) => (
  <input data-testid="file-input" {...props} />
));
jest.mock("components/ui/InputDate", () => (props) => (
  <input data-testid="date-input" {...props} />
));
jest.mock("components/ui/InputTime", () => (props) => (
  <input data-testid="time-input" {...props} />
));
jest.mock("components/ui/InputNumber", () => (props) => (
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

  it("falls back to InputText for unknown type", () => {
    // react's PropTypes validation logs an error about this invalid prop, I suppress the error,
    // to keep my test output clean
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Input {...baseProps} type="unknown" value="test" />);
    expect(screen.getByTestId("text-input")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  it("defaults to InputText if type is not provided", () => {
    render(<Input {...baseProps} value="default" />);
    expect(screen.getByTestId("text-input")).toBeInTheDocument();
  });
});
