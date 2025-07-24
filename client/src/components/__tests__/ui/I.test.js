import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import I from "components/ui/I";

describe("<I />", () => {
  it("renders an <i> tag with children", () => {
    render(<I>Icon Content</I>);
    const el = screen.getByText("Icon Content");
    expect(el.tagName.toLowerCase()).toBe("i");
  });

  it("applies className and style", () => {
    render(<I className="my-icon" style={{ color: "red" }}>Styled Icon</I>);
    const el = screen.getByText("Styled Icon");
    expect(el).toHaveClass("my-icon");
    expect(el).toHaveStyle("color: red");
  });

  it("handles onClick events", () => {
    const handleClick = jest.fn();
    render(<I onClick={handleClick}>Clickable</I>);
    fireEvent.click(screen.getByText("Clickable"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not wrap with AccessibleWrapper by default", () => {
    render(<I ariaLabel="test">No Wrap</I>);
    const el = screen.getByText("No Wrap");
    expect(el.tagName.toLowerCase()).toBe("i");
    // Check it does NOT have aria-label, since it's not wrapped
    expect(el).not.toHaveAttribute("aria-label", "test");
  });

  it("wraps with AccessibleWrapper when withAccessibility is true", () => {
    render(
      <I withAccessibility ariaLabel="accessible-label">Accessible Icon</I>
    );
    const el = screen.getByLabelText("accessible-label");
    expect(el.tagName.toLowerCase()).toBe("i");
  });

  it("passes all accessibility props to AccessibleWrapper", () => {
    render(
      <I
        withAccessibility
        ariaLabel="icon"
        role="img"
        ariaLabelledBy="labelled"
        ariaDescribedBy="described"
        title="tooltip"
      >
        A11y Icon
      </I>
    );

    const el = screen.getByLabelText("icon");

    expect(el).toHaveAttribute("role", "img");
    expect(el).toHaveAttribute("aria-labelledby", "labelled");
    expect(el).toHaveAttribute("aria-describedby", "described");
    expect(el).toHaveAttribute("title", "tooltip");
  });
});
