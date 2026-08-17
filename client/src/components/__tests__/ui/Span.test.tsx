import { render, screen, fireEvent } from "@testing-library/react";
import Span from "components/ui/Span";
import getCompClasses from "util/getCompClasses";
import { vi } from "vitest";

vi.mock("components/ui/Base.module.css", () => ({
  inline: "base-inline",
  "inline-block": "base-inline-block",
}));

vi.mock("util/getCompClasses");

const mockedGetCompClasses = vi.mocked(getCompClasses);

describe("<Span />", () => {
  beforeEach(() => {
    mockedGetCompClasses.mockReturnValue("resolved-class");
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
      </Span>,
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
    const handleClick = vi.fn();
    render(<Span onClick={handleClick}>Clickable</Span>);

    const span = screen.getByText("Clickable");
    fireEvent.click(span);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("wraps with Accessibility", () => {
    render(
      <Span role="button" aria-label="Clickable Span" title="Click me">
        Accessible Span
      </Span>,
    );

    const span = screen.getByText("Accessible Span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute("role", "button");
    expect(span).toHaveAttribute("aria-label", "Clickable Span");
    expect(span).toHaveAttribute("title", "Click me");
  });
});
