import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminFormFieldFile from "features/admin/components/AdminFormFieldFile";

jest.mock("components/ui/Input", () => ({ type, name, resetKey, onChange }) => (
  <input
    data-testid="file-input"
    type={type}
    name={name}
    data-reset-key={resetKey}
    onChange={onChange}
  />
));

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

describe("AdminFormFieldFile", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders label and file input correctly", () => {
    render(
      <AdminFormFieldFile
        label="Upload Avatar"
        name="avatar"
        resetFile="resetKey123"
        onChange={mockOnChange}
      />,
    );

    const block = screen.getByTestId("block");
    expect(block).toBeInTheDocument();
    expect(block).toHaveAttribute("data-type", "flex-horz-fs");
    expect(block).toHaveClass("mb-2p");

    const label = screen.getByTestId("label");
    expect(label).toHaveTextContent("Upload Avatar");
    expect(label).toHaveAttribute("data-name", "avatar");
    expect(label).toHaveClass("wd-md bld");

    const input = screen.getByTestId("file-input");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("name", "avatar");
    expect(input).toHaveAttribute("data-reset-key", "resetKey123");
  });

  it("calls onChange when file is selected", () => {
    render(
      <AdminFormFieldFile
        label="Upload CV"
        name="cv"
        resetFile="resetKey456"
        onChange={mockOnChange}
      />,
    );

    const file = new File(["contestant picture"], "john.jpeg", { type: "image/jpeg" });
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
