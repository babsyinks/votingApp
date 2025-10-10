import { render, screen } from "@testing-library/react";
import InputWithIcon, { InputWithIconProps } from "../../ui/InputWithIcon";
import getCompClasses from "util/getCompClasses";
import { BlockProps } from "components/ui/Block";
import { BaseInputProps } from "components/ui/BaseInput";
import { IProps } from "components/ui/I";
import "@testing-library/jest-dom";

jest.mock("../../ui/Input", () => (props: BaseInputProps) => (
  <input data-testid="mock-input" {...props} />
));

jest.mock("../../ui/Block", () => (props: BlockProps) => (
  <div data-testid="mock-block" {...props} />
));

jest.mock("../../ui/I", () => (props: IProps) => (
  <i data-testid="mock-icon" {...props} />
));

jest.mock("util/getCompClasses");

const mockedGetCompClasses = jest.mocked(getCompClasses);

describe("<InputWithIcon />", () => {
  let baseProps: InputWithIconProps;

  beforeEach(() => {
    baseProps = {
      type: "text",
      name: "testInput",
      value: "",
      onChange: jest.fn(),
      placeholder: "Enter value",
      className: "test-class",
      style: { color: "blue" },
    };
  });

  it("renders without crashing", () => {
    render(<InputWithIcon {...baseProps} />);
    expect(screen.getByTestId("mock-input")).toBeInTheDocument();
  });

  it("renders with empty class if not set", () => {
    delete baseProps.className;
    render(<InputWithIcon {...baseProps} />);
    expect(screen.getByTestId("mock-input")).toBeInTheDocument();
  });

  it("renders left icon if iconClass is provided", () => {
    render(<InputWithIcon iconClass="fa-user" {...baseProps} />);
    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("fas fa-user");
  });

  it("does not render left icon if iconClass is not provided", () => {
    render(<InputWithIcon {...baseProps} />);
    expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
  });

  it("renders right icon if rightIcon is provided", () => {
    render(
      <InputWithIcon
        {...baseProps}
        rightIcon={<span data-testid="custom-right-icon">R</span>}
      />,
    );
    expect(screen.getByTestId("custom-right-icon")).toBeInTheDocument();
  });

  it("applies default and resolved classes to input", () => {
    mockedGetCompClasses.mockReturnValue("resolved-class");
    render(<InputWithIcon {...baseProps} className="custom-class" />);
    const input = screen.getByTestId("mock-input");
    expect(input).toHaveClass("input-with-icon resolved-class");
  });

  it("wraps content in Block wrapper with correct class", () => {
    render(<InputWithIcon {...baseProps} />);
    const blocks = screen.getAllByTestId("mock-block");
    expect(blocks[0]).toHaveClass("input-icon-wrapper");
  });
});
