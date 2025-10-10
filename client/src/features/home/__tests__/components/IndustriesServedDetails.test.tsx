import { render, screen } from "@testing-library/react";
import IndustriesServedDetails from "features/home/components/IndustriesServedDetails";
import { SectionProps } from "components/ui/Section";
import { BlockProps } from "components/ui/Block";
import { HeadingProps } from "components/ui/Heading";
import { ParagraphProps } from "components/ui/Paragraph";

import useWindowSize from "hooks/useWindowSize";

jest.mock("features/home/components/IndustryList", () => () => (
  <div data-testid="industry-list">IndustryList</div>
));
jest.mock("components/ui/Section", () => ({ children, ...props }: SectionProps) => (
  <div data-testid="section" {...props}>
    {children}
  </div>
));
jest.mock("components/ui/Block", () => ({ children, ...props }: BlockProps) => (
  <div data-testid="block" {...props}>
    {children}
  </div>
));
jest.mock("components/ui/Heading", () => ({ children, ...props }: HeadingProps) => (
  <h2 data-testid="heading" {...props}>
    {children}
  </h2>
));
jest.mock("components/ui/Paragraph", () => ({ children, ...props }: ParagraphProps) => (
  <p data-testid="paragraph" {...props}>
    {children}
  </p>
));

jest.mock("hooks/useWindowSize", () => jest.fn());

describe("IndustriesServedDetails component", () => {
  const mockUseWindowSize = jest.mocked(useWindowSize);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly on small screens (width < 768)", () => {
    mockUseWindowSize.mockReturnValue({ width: 500, height: 800 });

    render(<IndustriesServedDetails />);

    const section = screen.getByTestId("section");
    expect(section).toHaveClass(
      "text-white",
      "px-1p5r",
      "py-3r",
      "bg-gradient-translucent-blue",
    );
    expect(section).not.toHaveClass("px-4r");

    expect(screen.getByTestId("heading")).toHaveTextContent("Who We Serve");
    expect(screen.getByTestId("paragraph")).toHaveTextContent(
      /Our voting platform is designed to serve a diverse range/i,
    );

    expect(screen.getByTestId("industry-list")).toBeInTheDocument();
  });

  it("renders correctly on mid/large screens (width >= 768)", () => {
    mockUseWindowSize.mockReturnValue({ width: 1024, height: 800 });

    render(<IndustriesServedDetails />);

    const section = screen.getByTestId("section");
    expect(section).toHaveClass("px-4r");

    const heading = screen.getByTestId("heading");
    expect(heading).toHaveClass("lh-2p5r");
  });
});
