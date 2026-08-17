import { render, screen, fireEvent } from "@testing-library/react";
import AdminFormFieldSelect from "features/admin/components/AdminFormFieldSelect";
import { LabelProps } from "components/ui/Label";
import { BlockProps } from "components/ui/Block";
import { SelectProps } from "components/ui/Select";

import getOptions from "features/admin/helpers/options";
import { vi } from "vitest";

vi.mock(
  "components/ui/Label",
  () =>
    ({ name, className, children }: LabelProps) => (
      <label data-testid="label" data-name={name} className={className}>
        {children}
      </label>
    ),
);

vi.mock(
  "components/ui/Block",
  () =>
    ({ children, type, className }: BlockProps) => (
      <div data-testid="block" data-type={type} className={className}>
        {children}
      </div>
    ),
);

vi.mock(
  "components/ui/Select",
  () =>
    ({ name, value, onChange, selectOptions }: SelectProps) => (
      <select
        data-testid="select"
        name={name}
        value={value}
        onChange={onChange}
      >
        {selectOptions.map((opt) => (
          <option key={opt.optionValue} value={opt.optionValue}>
            {opt.optionLabel}
          </option>
        ))}
      </select>
    ),
);

describe("AdminFormFieldSelect", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders the label and select with all position options", () => {
    render(
      <AdminFormFieldSelect
        label="Select Position"
        name="position"
        value="president"
        onChange={mockOnChange}
      />,
    );

    const block = screen.getByTestId("block");
    expect(block).toHaveAttribute("data-type", "flex-horz-fs");
    expect(block).toHaveClass("mb-2p");

    const label = screen.getByTestId("label");
    expect(label).toHaveTextContent("Select Position");
    expect(label).toHaveAttribute("data-name", "position");
    expect(label).toHaveClass("wd-md bld");

    const select = screen.getByTestId("select");
    expect(select).toHaveAttribute("name", "position");
    expect(select).toHaveValue("president");

    const expectedOptions = getOptions();
    expectedOptions.forEach(({ optionLabel }) => {
      expect(
        screen.getByRole("option", { name: optionLabel }),
      ).toBeInTheDocument();
    });
  });

  it("calls onChange when selection changes", () => {
    render(
      <AdminFormFieldSelect
        label="Select Position"
        name="position"
        value="vice president"
        onChange={mockOnChange}
      />,
    );

    const select = screen.getByTestId("select");
    fireEvent.change(select, { target: { value: "president" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
