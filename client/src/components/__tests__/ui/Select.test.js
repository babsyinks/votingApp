import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Select from "components/ui/Select";
import getCompClasses from "util/getCompClasses";

jest.mock("util/getCompClasses");
jest.mock("./Select.module.css", () => ({
  sel: "default-sel-class",
}));

describe("<Select />", () => {

  const mockOptions = [
    { optionLabel: "Option A", optionValue: "a" },
    { optionLabel: "Option B" }, // will fallback to label.toLowerCase()
    { optionLabel: "Option C", optionValue: "c" },
  ];

  const baseProps = {
    name: "test-select",
    value: "a",
    onChange: jest.fn(),
    selectOptions: mockOptions,
  };

  beforeEach(() => {
    getCompClasses.mockReturnValue("resolved-class");
    jest.clearAllMocks();
  });

  it("renders with default props and options", () => {
    render(<Select {...baseProps} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveClass("default-sel-class resolved-class");
    expect(select).toHaveAttribute("name", "test-select");
    expect(select).toHaveValue("a");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("Option A");
    expect(options[0]).toHaveValue("a");
    expect(options[1]).toHaveTextContent("Option B");
    expect(options[1]).toHaveValue("option b"); // fallback to lowercased label
    expect(options[2]).toHaveValue("c");
  });

  it("calls onChange when selection changes", () => {
    render(<Select {...baseProps} />);
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "c" } });
    expect(baseProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("respects the disabled prop", () => {
    render(<Select {...baseProps} disabled />);
    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  it("applies custom style and className", () => {
    render(
      <Select
        {...baseProps}
        className="custom-class"
        style={{ color: "red" }}
      />
    );
    const select = screen.getByRole("combobox");

    expect(select).toHaveStyle({ color: "red" });
    expect(select).toHaveClass("default-sel-class resolved-class");
  });

  it("adds ARIA attributes if provided", () => {
    render(
      <Select
        {...baseProps}
        ariaLabel="Accessible Select"
        ariaLabelledBy="select-label"
        ariaDescribedBy="select-help"
      />
    );

    const select = screen.getByLabelText("Accessible Select");
    expect(select).toHaveAttribute("aria-labelledby", "select-label");
    expect(select).toHaveAttribute("aria-describedby", "select-help");
  });
});
