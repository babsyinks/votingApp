import { render, screen } from "@testing-library/react";
import TestimonialList from "features/home/components/TestimonialList";
import testimonials from "features/home/data/testimonials";
import { SectionProps } from "components/ui/Section";
import { HeadingProps } from "components/ui/Heading";
import { BlockProps } from "components/ui/Block";
import { TestimonialCardProps } from "features/home/components/TestimonialCard";

jest.mock(
  "components/ui/Section",
  () =>
    ({ children, ...props }: SectionProps) => (
      <section data-testid="section" {...props}>
        {children}
      </section>
    ),
);
jest.mock(
  "components/ui/Heading",
  () =>
    ({ children, ...props }: HeadingProps) => (
      <h2 data-testid="heading" {...props}>
        {children}
      </h2>
    ),
);
jest.mock("components/ui/Block", () => ({ children, ...props }: BlockProps) => (
  <div data-testid="block" {...props}>
    {children}
  </div>
));
jest.mock(
  "features/home/components/TestimonialCard",
  () =>
    ({ quote, author }: TestimonialCardProps) => (
      <div data-testid="testimonial-card">
        {quote} — {author}
      </div>
    ),
);

describe("TestimonialList Component", () => {
  it("renders the Section wrapper with correct classes", () => {
    render(<TestimonialList />);
    const section = screen.getByTestId("section");
    expect(section).toHaveClass("p-2r bg-gradient-translucent-blue");
  });

  it("renders the heading with correct text and classes", () => {
    render(<TestimonialList />);
    const heading = screen.getByTestId("heading");
    expect(heading).toHaveTextContent("What Our Customers Are Saying");
    expect(heading).toHaveClass("ta-center text-white");
  });

  it("renders the Block wrapper with correct classes", () => {
    render(<TestimonialList />);
    const block = screen.getByTestId("block");
    expect(block).toHaveClass("flex-wrap gap-1p5r justify-content-center");
  });

  it("renders a TestimonialCard for each testimonial", () => {
    render(<TestimonialList />);
    const cards = screen.getAllByTestId("testimonial-card");
    expect(cards).toHaveLength(testimonials.length);

    testimonials.forEach((t, idx) => {
      expect(cards[idx]).toHaveTextContent(t.quote);
      expect(cards[idx]).toHaveTextContent(t.author);
    });
  });
});
