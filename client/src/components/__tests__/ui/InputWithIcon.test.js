import React from "react";
import { render, screen } from "@testing-library/react";
import InputWithIcon from "../../ui/InputWithIcon";
import getCompClasses from "util/getCompClasses";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("../../ui/Input", () => (props) => (
  <input data-testid="mock-input" {...props} />
));

jest.mock("../../ui/Block", () => (props) => (
  <div data-testid="mock-block" {...props} />
));

jest.mock("../../ui/I", () => (props) => (
  <i data-testid="mock-icon" {...props} />
));

jest.mock("util/getCompClasses");

describe("<InputWithIcon />", () => {
  it("renders without crashing", () => {
    render(<InputWithIcon value="test" onChange={() => {}} />);
    expect(screen.getByTestId("mock-input")).toBeInTheDocument();
  });

  it("renders left icon if iconClass is provided", () => {
    render(
      <InputWithIcon iconClass="fa-user" value="" onChange={() => {}} />
    );
    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("fas fa-user");
  });

  it("does not render left icon if iconClass is not provided", () => {
    render(<InputWithIcon value="" onChange={() => {}} />);
    expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
  });

  it("renders right icon if rightIcon is provided", () => {
    render(
      <InputWithIcon
        value=""
        onChange={() => {}}
        rightIcon={<span data-testid="custom-right-icon">R</span>}
      />
    );
    expect(screen.getByTestId("custom-right-icon")).toBeInTheDocument();
  });

  it("applies default and resolved classes to input", () => {
    getCompClasses.mockReturnValue("resolved-class")
    render(
      <InputWithIcon
        value=""
        onChange={() => {}}
        className="custom-class"
      />
    );
    const input = screen.getByTestId("mock-input");
    expect(input).toHaveClass("input-with-icon resolved-class");
  });

  it("wraps content in Block wrapper with correct class", () => {
    render(<InputWithIcon value="" onChange={() => {}} />);
    const blocks = screen.getAllByTestId("mock-block");
    expect(blocks[0]).toHaveClass("input-icon-wrapper");
  });
});
