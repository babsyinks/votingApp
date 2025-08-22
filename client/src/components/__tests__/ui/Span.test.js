import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Span from "components/ui/Span";
import getCompClasses from "util/getCompClasses";

jest.mock("components/ui/Base.module.css", () => ({
  inline: "base-inline",
  "inline-block": "base-inline-block",
}));

jest.mock("util/getCompClasses");

jest.mock("components/accessibility/AccessibleWrapper");

describe("<Span />", () => {
  beforeEach(() => {
    getCompClasses.mockReturnValue("resolved-class");
  });

  test("renders with default props", () => {
    render(<Span>Default Inline</Span>);
    const span = screen.getByText("Default Inline");

    expect(span).toBeInTheDocument();
    expect(span.tagName).toBe("SPAN");
    expect(span).toHaveClass("base-inline resolved-class");
  });

  test("renders with specific type and className", () => {
    render(
      <Span type="inline-block" className="extra-class">
        Custom Span
      </Span>
    );

    const span = screen.getByText("Custom Span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass("base-inline-block resolved-class");
  });

  test("applies inline styles", () => {
    render(<Span style={{ color: "blue" }}>Styled Span</Span>);
    const span = screen.getByText("Styled Span");

    expect(span).toHaveStyle({ color: "blue" });
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Span onClick={handleClick}>Clickable</Span>);

    const span = screen.getByText("Clickable");
    fireEvent.click(span);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("wraps with AccessibleWrapper when withAccessibility is true", () => {
    render(
      <Span
        withAccessibility
        role="button"
        ariaLabel="Clickable Span"
        title="Click me"
      >
        Accessible Span
      </Span>
    );

    const span = screen.getByText("Accessible Span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute("role", "button");
    expect(span).toHaveAttribute("aria-label", "Clickable Span");
    expect(span).toHaveAttribute("title", "Click me");
  });

  test("does not wrap with AccessibleWrapper when withAccessibility is false", () => {
    render(<Span withAccessibility={false}>No Wrapper</Span>);
    const span = screen.getByText("No Wrapper");

    expect(span).toBeInTheDocument();
    expect(span).not.toHaveAttribute("role");
  });
});
