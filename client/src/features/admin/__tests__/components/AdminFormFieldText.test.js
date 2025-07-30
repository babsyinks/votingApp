import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminFormFieldText from "features/admin/components/AdminFormFieldText";

jest.mock("components/ui/Label", () => ({ name, className, children }) => (
  <label data-testid="label" data-name={name} className={className}>
    {children}
  </label>
));

jest.mock("components/ui/Block", () => ({ children, type, className }) => (
  <div data-testid="block" data-type={type} className={className}>
    {children}
  </div>
));

jest.mock("components/ui/Input", () => ({ name, value, onChange, className }) => (
  <input
    data-testid="input"
    type="text"
    name={name}
    value={value}
    onChange={onChange}
    className={className}
  />
));

describe("AdminFormFieldText", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders label and text input with correct props", () => {
    render(
      <AdminFormFieldText label="Enter Name" name="name" value="John" onChange={mockOnChange} />,
    );

    const block = screen.getByTestId("block");
    expect(block).toHaveAttribute("data-type", "flex-horz-fs");
    expect(block).toHaveClass("mb-2p");

    const label = screen.getByTestId("label");
    expect(label).toHaveTextContent("Enter Name");
    expect(label).toHaveAttribute("data-name", "name");
    expect(label).toHaveClass("wd-md bld");

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "name");
    expect(input).toHaveValue("John");
    expect(input).toHaveClass("line-input");
  });

  it("triggers onChange when input value changes", () => {
    render(
      <AdminFormFieldText label="Enter Email" name="email" value="" onChange={mockOnChange} />,
    );

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "user@example.com" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object)); // event object
  });
});
