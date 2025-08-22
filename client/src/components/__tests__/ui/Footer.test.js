import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "components/ui/Footer";

describe("footer Component", () => {
  const currentYear = new Date().getFullYear();

  test("renders with current year and company name", () => {
    render(<Footer>{currentYear}</Footer>);
    expect(screen.getByText(currentYear)).toBeInTheDocument();
  });

  test("applies custom class", () => {
    render(<Footer className="custom-class">{currentYear}</Footer>);
    const footer = screen.getByText(currentYear);
    expect(footer).toHaveClass("custom-class");
  });

  test("applies inline styles", () => {
    const style = { backgroundColor: "black" };
    render(<Footer style={style}>{currentYear}</Footer>);
    const footer = screen.getByText(currentYear);
    expect(footer).toHaveStyle("background-color: black");
  });

  test("sets role attribute when provided", () => {
    render(<Footer role="contentinfo">{currentYear}</Footer>);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  test("sets ARIA attributes correctly", () => {
    render(
      <Footer ariaLabel="Site Footer" ariaLabelledBy="footer-label" ariaDescribedBy="footer-desc">
        {currentYear}
      </Footer>,
    );

    const footer = screen.getByText(currentYear);
    expect(footer).toHaveAttribute("aria-label", "Site Footer");
    expect(footer).toHaveAttribute("aria-labelledby", "footer-label");
    expect(footer).toHaveAttribute("aria-describedby", "footer-desc");
  });
});
