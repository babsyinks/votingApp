import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "components/ui/Button";
import getCompClasses from "util/getCompClasses";

jest.mock("util/getCompClasses");

describe("<Button />", () => {
  const defaultProps = {
    children: "Click me",
    onClick: jest.fn(),
    className: "extra-class",
    type: "submit",
    name: "my-button",
    disabled: false,
    style: { backgroundColor: "red" },
    title: "My Button",
    role: "button",
    ariaLabel: "Click me button",
    ariaLabelledBy: "label-id",
    ariaDescribedBy: "desc-id",
  };

  it("renders the button with default props", () => {
    render(<Button />);
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
    expect(screen.getByRole("button", { type: "button" })).toBeInTheDocument();
    expect(screen.getByRole("button", { disabled: false })).toBeInTheDocument();
    expect(screen.getByRole("button", { className: "" })).toBeInTheDocument();
    expect(screen.getByRole("button", { style: {} })).toBeInTheDocument();
  });

  it("renders the button with children text", () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies the correct type, name, and other attributes", () => {
    render(<Button {...defaultProps} />);
    const btn = screen.getByRole("button");

    expect(btn).toHaveAttribute("type", "submit");
    expect(btn).toHaveAttribute("name", "my-button");
    expect(btn).toHaveAttribute("title", "My Button");
    expect(btn).toHaveAttribute("aria-label", "Click me button");
    expect(btn).toHaveAttribute("aria-labelledby", "label-id");
    expect(btn).toHaveAttribute("aria-describedby", "desc-id");
  });

  it("applies inline styles", () => {
    render(<Button {...defaultProps} />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveStyle("background-color: red");
  });

  it("calls onClick when clicked", () => {
    render(<Button {...defaultProps} />);
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
    getCompClasses.mockReturnValue("resolved-class");
    render(<Button {...defaultProps} />);
    const btn = screen.getByRole("button");
    expect(getCompClasses).toHaveBeenCalledWith(expect.any(Object), "extra-class");
    expect(btn.className).toMatch(/resolved-class/);
  });
});
