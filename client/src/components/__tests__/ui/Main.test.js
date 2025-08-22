import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "components/ui/Main";

describe("<Main />", () => {
  it("renders a <main> element", () => {
    render(<Main />);
    const main = screen.getByRole("main");
    expect(main.tagName).toBe("MAIN");
  });

  it("renders children inside the main element", () => {
    render(<Main>Primary Content</Main>);
    expect(screen.getByText("Primary Content")).toBeInTheDocument();
  });

  it("applies className if provided", () => {
    render(<Main className="custom-class">Content</Main>);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("custom-class");
  });

  it("applies inline styles if provided", () => {
    const style = { padding: "10px", backgroundColor: "lightgray" };
    render(<Main style={style}>Styled Content</Main>);
    const main = screen.getByRole("main");
    expect(main).toHaveStyle("padding: 10px");
    expect(main).toHaveStyle("background-color: lightgray");
  });
});
