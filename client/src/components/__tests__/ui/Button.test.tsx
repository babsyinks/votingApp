import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "components/ui/Button";
import getCompClasses from "util/getCompClasses";
import { ButtonProps } from "components/ui/Button";

jest.mock("util/getCompClasses");

const mockedGetCompClasses = jest.mocked(getCompClasses);

describe("<Button />", () => {
  const children = "Click me";
  
  const defaultProps: ButtonProps = {
    children,
    onClick: jest.fn(),
    className: "extra-class",
    type: "submit",
    name: "my-button",
    disabled: false,
    style: { backgroundColor: "red" },
    title: "My Button",
    role: "button",
    "aria-label": "Click me button",
    "aria-labelledby": "label-id",
    "aria-describedby": "desc-id",
  };

  it("renders the button with default props", () => {
    render(<Button>{children}</Button>);
    
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveClass('btn');
    expect(btn).not.toHaveStyle('');
  });

  it("renders the button with children text", () => {
    render(<Button {...defaultProps}>{children}</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("applies the correct type, name, and other attributes", () => {
    render(<Button {...defaultProps}>{children}</Button>);
    const btn = screen.getByRole("button");

    expect(btn).toHaveAttribute("type", "submit");
    expect(btn).toHaveAttribute("name", "my-button");
    expect(btn).toHaveAttribute("title", "My Button");
    expect(btn).toHaveAttribute("aria-label", "Click me button");
    expect(btn).toHaveAttribute("aria-labelledby", "label-id");
    expect(btn).toHaveAttribute("aria-describedby", "desc-id");
  });

  it("applies inline styles", () => {
    render(<Button {...defaultProps}>{children}</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveStyle("background-color: red");
  });

  it("calls onClick when clicked", () => {
    render(<Button {...defaultProps}>{children}</Button>);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("respects the disabled prop", () => {
    render(<Button {...defaultProps} disabled={true} />);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("applies className via getCompClasses", () => {
    mockedGetCompClasses.mockReturnValue("resolved-class");
    render(<Button {...defaultProps}>{children}</Button>);
    const btn = screen.getByRole("button");
    expect(mockedGetCompClasses).toHaveBeenCalledWith(
      expect.any(Object),
      "extra-class",
    );
    expect(btn.className).toMatch(/resolved-class/);
  });
});
