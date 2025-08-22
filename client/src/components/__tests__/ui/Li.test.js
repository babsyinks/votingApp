import React from "react";
import { render, screen } from "@testing-library/react";
import Li from "components/ui/Li";

describe("Li component", () => {
  it("renders children correctly", () => {
    render(<Li>Item Text</Li>);
    expect(screen.getByText("Item Text")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Li className="custom-class">Item</Li>);
    expect(screen.getByText("Item")).toHaveClass("custom-class");
  });

  it("applies inline styles", () => {
    const style = { color: "red", fontWeight: "bold" };
    render(<Li style={style}>Styled Item</Li>);
    const li = screen.getByText("Styled Item");
    expect(li).toHaveStyle("color: red");
    expect(li).toHaveStyle("font-weight: bold");
  });

  it("renders as an <li> tag", () => {
    render(<Li>List Item</Li>);
    const li = screen.getByText("List Item");
    expect(li.tagName).toBe("LI");
  });
});
