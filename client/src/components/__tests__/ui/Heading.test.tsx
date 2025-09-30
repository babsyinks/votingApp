import React from "react";
import { render, screen } from "@testing-library/react";
import Heading from "components/ui/Heading";

describe("<Heading />", () => {
  it("renders an h1 by default", () => {
    render(<Heading>Default Heading</Heading>);
    const el = screen.getByText("Default Heading");
    expect(el.tagName.toLowerCase()).toBe("h1");
  });

  it("renders the correct heading level when type is specified", () => {
    render(<Heading type="h3">Subheading</Heading>);
    const el = screen.getByText("Subheading");
    expect(el.tagName.toLowerCase()).toBe("h3");
  });


  it("applies className and style", () => {
    render(
      <Heading className="my-heading" style={{ color: "red" }}>
        Styled Heading
      </Heading>,
    );
    const el = screen.getByText("Styled Heading");
    expect(el).toHaveClass("my-heading");
    expect(el).toHaveStyle({ color: "red" });
  });

  it("sets accessibility attributes correctly", () => {
    render(
      <Heading
        type="h2"
        role="heading"
        aria-label="accessible heading"
        aria-labelledby="label-id"
        aria-describedby="desc-id"
        title="Heading title"
      >
        Accessible Heading
      </Heading>,
    );

    const el = screen.getByText("Accessible Heading");
    expect(el).toHaveAttribute("role", "heading");
    expect(el).toHaveAttribute("aria-label", "accessible heading");
    expect(el).toHaveAttribute("aria-labelledby", "label-id");
    expect(el).toHaveAttribute("aria-describedby", "desc-id");
    expect(el).toHaveAttribute("title", "Heading title");
  });

  it("renders children content", () => {
    render(<Heading>Test Content</Heading>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
