import React from "react";
import { render, screen } from "@testing-library/react";
import Block from "components/ui/Block";
import getCompClasses from "util/getCompClasses";

jest.mock("components/ui/Base.module.css", () => ({
  block: "base-block",
  "flex-vert": "base-flex-vert",
}));

jest.mock("util/getCompClasses");

jest.mock("components/accessibility/AccessibleWrapper");

describe("<Block />", () => {
  beforeEach(() => {
    getCompClasses.mockReturnValue("resolved-class");
  });

  test("renders with default props", () => {
    render(<Block>Default Content</Block>);

    const block = screen.getByText("Default Content");
    expect(block).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(block.parentElement).not.toHaveAttribute("data-testid", "accessible-wrapper");
    expect(block).toHaveClass("base-block resolved-class");
  });

  test("renders with specific type and className", () => {
    render(
      <Block type="flex-vert" className="custom-class">
        Flex Content
      </Block>,
    );

    const block = screen.getByText("Flex Content");
    expect(block).toBeInTheDocument();
    expect(block).toHaveClass("base-flex-vert resolved-class");
  });

  test("applies inline style", () => {
    render(<Block style={{ backgroundColor: "red" }}>Styled Block</Block>);

    const block = screen.getByText("Styled Block");
    expect(block).toHaveStyle({ backgroundColor: "red" });
  });

  test("wraps with AccessibleWrapper when withAccessibility is true", () => {
    render(
      <Block withAccessibility role="region" ariaLabel="group-label">
        Accessible Content
      </Block>,
    );

    const wrapper = screen.getByLabelText("group-label");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute("role", "region");
    expect(wrapper).toHaveAttribute("aria-label", "group-label");
    expect(screen.getByText("Accessible Content")).toBeInTheDocument();
  });

  test("does not wrap with AccessibleWrapper when withAccessibility is false", () => {
    render(<Block withAccessibility={false}>Non-accessible content</Block>);

    const wrapper = screen.queryByTestId("accessible-wrapper");
    expect(wrapper).not.toBeInTheDocument();
    expect(screen.getByText("Non-accessible content")).toBeInTheDocument();
  });
});
