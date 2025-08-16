import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "components/ui/Header";

describe("Header Component", () => {
  test("renders children correctly", () => {
    render(<Header>Test Content</Header>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Header className="custom-class">Content</Header>);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("custom-class");
  });

  test("applies inline styles", () => {
    const style = { backgroundColor: "red" };
    render(<Header style={style}>Styled Header</Header>);
    const header = screen.getByText("Styled Header");
    expect(header).toHaveStyle("background-color: red");
  });

  test("sets role attribute when provided", () => {
    render(<Header role="navigation">Nav Header</Header>);
    const header = screen.getByRole("navigation");
    expect(header).toBeInTheDocument();
  });

  test("sets ARIA attributes correctly", () => {
    render(
      <Header
        ariaLabel="Site Header"
        ariaLabelledBy="header-label"
        ariaDescribedBy="header-desc"
      >
        Accessible Header
      </Header>
    );

    const header = screen.getByText("Accessible Header");
    expect(header).toHaveAttribute("aria-label", "Site Header");
    expect(header).toHaveAttribute("aria-labelledby", "header-label");
    expect(header).toHaveAttribute("aria-describedby", "header-desc");
  });
});
