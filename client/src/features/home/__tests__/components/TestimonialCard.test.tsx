import React from "react";
import { render, screen } from "@testing-library/react";
import TestimonialCard from "features/home/components/TestimonialCard";
import { BlockquoteProps } from "components/ui/Blockquote";
import { ParagraphProps } from "components/ui/Paragraph";
import { FooterProps } from "components/ui/Footer";

jest.mock(
  "components/ui/Blockquote",
  () =>
    ({ children, ...props }: BlockquoteProps) => (
      <blockquote data-testid="blockquote" {...props}>
        {children}
      </blockquote>
    ),
);
jest.mock(
  "components/ui/Paragraph",
  () =>
    ({ children, ...props }: ParagraphProps) => (
      <p data-testid="paragraph" {...props}>
        {children}
      </p>
    ),
);
jest.mock(
  "components/ui/Footer",
  () =>
    ({ children, ...props }: FooterProps) => (
      <footer data-testid="footer" {...props}>
        {children}
      </footer>
    ),
);

describe("TestimonialCard Component", () => {
  const defaultProps = {
    quote: "This product changed my life!",
    author: "Jane Doe",
  };

  it("renders the quote inside Paragraph", () => {
    render(<TestimonialCard {...defaultProps} />);
    const paragraph = screen.getByTestId("paragraph");
    expect(paragraph).toHaveTextContent("“This product changed my life!”");
    expect(paragraph).toHaveClass("fs-italic mb-0p75r");
  });

  it("renders the author inside Footer", () => {
    render(<TestimonialCard {...defaultProps} />);
    const footer = screen.getByTestId("footer");
    expect(footer).toHaveTextContent("— Jane Doe");
    expect(footer).toHaveClass("ta-right fw-bold");
  });

  it("wraps everything inside a Blockquote with correct classes", () => {
    render(<TestimonialCard {...defaultProps} />);
    const blockquote = screen.getByTestId("blockquote");
    expect(blockquote).toHaveClass(
      "border-left-6-aqua bg-white mxw-300 p-1r bs-black",
    );
  });
});
