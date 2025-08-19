import React from "react";
import { render, screen } from "@testing-library/react";
import Blockquote from "components/ui/Blockquote";

describe("Blockquote Component", () => {
  it("renders children correctly", () => {
    render(<Blockquote>Test quote</Blockquote>);
    expect(screen.getByText("Test quote")).toBeInTheDocument();
  });

  it("applies additional className", () => {
    render(<Blockquote className="custom-class">Styled quote</Blockquote>);
    const element = screen.getByText("Styled quote");
    expect(element).toHaveClass("custom-class");
  });

  it("applies inline styles", () => {
    render(
      <Blockquote style={{ color: "red" }}>Styled quote</Blockquote>
    );
    const element = screen.getByText("Styled quote");
    expect(element).toHaveStyle({ color: "red" });
  });

  it("sets role attribute when provided", () => {
    render(<Blockquote role="note">Role test</Blockquote>);
    const element = screen.getByText("Role test");
    expect(element).toHaveAttribute("role", "note");
  });

  it("sets aria-label when provided", () => {
    render(<Blockquote ariaLabel="Quote label">Accessible quote</Blockquote>);
    const element = screen.getByText("Accessible quote");
    expect(element).toHaveAttribute("aria-label", "Quote label");
  });

  it("sets aria-labelledby when provided", () => {
    render(<Blockquote ariaLabelledBy="label-id">Labelled quote</Blockquote>);
    const element = screen.getByText("Labelled quote");
    expect(element).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("sets aria-describedby when provided", () => {
    render(<Blockquote ariaDescribedBy="desc-id">Described quote</Blockquote>);
    const element = screen.getByText("Described quote");
    expect(element).toHaveAttribute("aria-describedby", "desc-id");
  });

  it("renders as a <blockquote> element", () => {
    render(<Blockquote>HTML element check</Blockquote>);
    const element = screen.getByText("HTML element check");
    expect(element.tagName.toLowerCase()).toBe("blockquote");
  });
});
