import { render, screen, fireEvent } from "@testing-library/react";
import InputTime from "components/ui/InputTime";
import { BaseInputProps } from "components/ui/BaseInput";
import { vi } from "vitest";

vi.mock("components/ui/BaseInput", () => (props: BaseInputProps) => {
  const { className, ...rest } = props;
  return <input data-testid="mock-baseinput" className={className} {...rest} />;
});

describe("<InputTime />", () => {
  const baseProps = {
    name: "startTime",
    value: "12:00",
    onChange: vi.fn(),
    placeholder: "Select time",
    className: "custom-class",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the time input with correct props", () => {
    render(<InputTime {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "startTime");
    expect(input).toHaveAttribute("value", "12:00");
    expect(input).toHaveAttribute("placeholder", "Select time");
    expect(input.className).toContain("custom-class");
  });

  it("calls onChange when time input changes", () => {
    render(<InputTime {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    fireEvent.change(input, { target: { value: "14:30" } });
    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("disables the input when disabled prop is true", () => {
    render(<InputTime {...baseProps} disabled />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toBeDisabled();
  });

  it("applies empty string className by default", () => {
    render(<InputTime value="08:00" onChange={vi.fn()} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input.className).toBe("");
  });
});
