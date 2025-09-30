import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminFormFieldTextArea from "features/admin/components/AdminFormFieldTextArea";
import { LabelProps } from "components/ui/Label";
import { BlockProps } from "components/ui/Block";
import { TextAreaProps } from "components/ui/TextArea";

jest.mock(
  "components/ui/Label",
  () =>
    ({ name, className, children }: LabelProps) => (
      <label data-testid="label" data-name={name} className={className}>
        {children}
      </label>
    ),
);

jest.mock(
  "components/ui/Block",
  () =>
    ({ children, type, className }: BlockProps) => (
      <div data-testid="block" data-type={type} className={className}>
        {children}
      </div>
    ),
);

jest.mock(
  "components/ui/TextArea",
  () =>
    ({ name, value, onChange }: TextAreaProps) => (
      <textarea
        data-testid="textarea"
        name={name}
        value={value}
        onChange={onChange}
      />
    ),
);

describe("AdminFormFieldTextArea", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders label and textarea with correct props", () => {
    render(
      <AdminFormFieldTextArea
        label="Enter Manifesto"
        name="manifesto"
        value="Sample text"
        onChange={mockOnChange}
      />,
    );

    const block = screen.getByTestId("block");
    expect(block).toHaveAttribute("data-type", "flex-horz-fs");
    expect(block).toHaveClass("mb-2p");

    const label = screen.getByTestId("label");
    expect(label).toHaveTextContent("Enter Manifesto");
    expect(label).toHaveAttribute("data-name", "manifesto");
    expect(label).toHaveClass("wd-md bld");

    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("name", "manifesto");
    expect(textarea).toHaveValue("Sample text");
  });

  it("calls onChange when textarea value changes", () => {
    render(
      <AdminFormFieldTextArea
        label="Enter Manifesto"
        name="manifesto"
        value=""
        onChange={mockOnChange}
      />,
    );

    const textarea = screen.getByTestId("textarea");
    fireEvent.change(textarea, { target: { value: "New content" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });
});
