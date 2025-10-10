import { render, screen, fireEvent } from "@testing-library/react";
import I from "components/ui/I";

describe("<I />", () => {
  it("renders an <i> tag with children", () => {
    render(<I>Icon Content</I>);
    const el = screen.getByText("Icon Content");
    expect(el.tagName.toLowerCase()).toBe("i");
  });

  it("applies className and style", () => {
    render(
      <I className="my-icon" style={{ color: "red" }}>
        Styled Icon
      </I>,
    );
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

  it("wraps with accessibility", () => {
    render(
      <I
        aria-label="test"
        role="img"
        aria-labelledby="labelled"
        aria-describedby="described"
        title="tooltip"
      >
        Wrap
      </I>,
    );
    const el = screen.getByText("Wrap");
    expect(el.tagName.toLowerCase()).toBe("i");
    expect(el).toHaveAttribute("aria-label", "test");
    expect(el).toHaveAttribute("role", "img");
    expect(el).toHaveAttribute("aria-labelledby", "labelled");
    expect(el).toHaveAttribute("aria-describedby", "described");
    expect(el).toHaveAttribute("title", "tooltip");
  });
});
