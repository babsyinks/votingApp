import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputFile from "components/ui/InputFile";

jest.mock("components/ui/BaseInput", () => (props) => {
  const { onChange, resetKey, ...rest } = props;

  return (
    <input
      data-testid="mock-baseinput"
      type="file"
      onChange={onChange}
      key={resetKey}
      {...rest}
    />
  );
});



describe("<InputFile />", () => {
  const onChangeMock = jest.fn();

  const baseProps = {
    name: "upload",
    resetKey: 1,
    onChange: onChangeMock,
    disabled: false,
    className: "custom-file-input",
    style: { borderColor: "green" },
    accept: ".png,.jpg",
  };

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  it("renders BaseInput", () => {
    render(<InputFile {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");
    expect(input).toBeInTheDocument();
  });

  it("passes props to BaseInput", () => {
    render(<InputFile {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    expect(input).toHaveAttribute("name", "upload");
    expect(input).toHaveAttribute("accept", ".png,.jpg");
    expect(input).not.toBeDisabled();
    expect(input).toHaveClass("custom-file-input");
    expect(input).toHaveStyle("border-color: green");
  });

  it("handles missing className safely", () => {
    const { className, ...rest } = baseProps;
    render(<InputFile {...rest} />);
    const input = screen.getByTestId("mock-baseinput");
    expect(input.className).toBe("");
  });

  it("calls onChange when file input changes", () => {
    render(<InputFile {...baseProps} />);
    const input = screen.getByTestId("mock-baseinput");

    const file = new File(["hello"], "hello.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });

    expect(onChangeMock).toHaveBeenCalled();
  });
});
