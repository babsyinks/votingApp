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

it("falls back to h1 if invalid type is passed", () => {
  // react's PropTypes validation logs an error about this invalid prop, I suppress the error, 
  // to keep my test output clean 
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  render(<Heading type="h7">Invalid Heading</Heading>);
  const el = screen.getByText("Invalid Heading");
  expect(el.tagName.toLowerCase()).toBe("h1");

  consoleErrorSpy.mockRestore();
});


  it("applies className and style", () => {
    render(
      <Heading className="my-heading" style={{ color: "red" }}>
        Styled Heading
      </Heading>
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
        ariaLabel="accessible heading"
        ariaLabelledBy="label-id"
        ariaDescribedBy="desc-id"
        title="Heading title"
      >
        Accessible Heading
      </Heading>
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
