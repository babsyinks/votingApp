import React from "react";
import { render, screen } from "@testing-library/react";
import Paragraph from "components/ui/Paragraph";
import getCompClasses from "util/getCompClasses";

jest.mock("util/getCompClasses");

describe("<Paragraph />", () => {
  beforeEach(() => {
    getCompClasses.mockReturnValue("resolved-class");
  });

  it("renders a <p> element", () => {
    render(<Paragraph>Sample text</Paragraph>);
    const paragraph = screen.getByText("Sample text");
    expect(paragraph.tagName).toBe("P");
  });

  it("renders children correctly", () => {
    render(<Paragraph>This is a test</Paragraph>);
    expect(screen.getByText("This is a test")).toBeInTheDocument();
  });

  it("applies resolved class from getCompClasses", () => {
    render(<Paragraph className="custom-class">Styled text</Paragraph>);
    const paragraph = screen.getByText("Styled text");
    expect(paragraph).toHaveClass("resolved-class");
    expect(getCompClasses).toHaveBeenCalledWith(expect.any(Object), "custom-class");
  });

  it("applies default and resolved class from module CSS", () => {
    render(<Paragraph className="extra-class">Text</Paragraph>);
    const paragraph = screen.getByText("Text");
    expect(paragraph.className).toContain("paragraph");
    expect(paragraph.className).toContain("resolved-class");
  });

  it("does not apply the paragraph class when 'useDefaultStyle' is false", () => {
    render(
      <Paragraph className="extra-class" useDefaultStyle={false}>
        Text
      </Paragraph>,
    );
    const paragraph = screen.getByText("Text");
    expect(paragraph.className).not.toContain("paragraph");
    expect(paragraph.className).toContain("resolved-class");
  });

  it("applies inline styles", () => {
    render(<Paragraph style={{ color: "red" }}>Styled Text</Paragraph>);
    expect(screen.getByText("Styled Text")).toHaveStyle("color: red");
  });
});
