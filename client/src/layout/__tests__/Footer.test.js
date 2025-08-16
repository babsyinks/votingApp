import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "layout/Footer";

describe("Footer Component", () => {
  const currentYear = new Date().getFullYear();

  test("renders with current year and company name", () => {
    render(<Footer />);
    expect(screen.getByText(`© ${currentYear} Corestack Technologies`)).toBeInTheDocument();
  });

  test("applies default and custom classes", () => {
    render(<Footer className="custom-class" />);
    const footer = screen.getByText(`© ${currentYear} Corestack Technologies`);
    expect(footer).toHaveClass("footer");
    expect(footer).toHaveClass("custom-class");
  });

  test("applies inline styles", () => {
    const style = { backgroundColor: "black" };
    render(<Footer style={style} />);
    const footer = screen.getByText(`© ${currentYear} Corestack Technologies`);
    expect(footer).toHaveStyle("background-color: black");
  });

  test("sets role attribute when provided", () => {
    render(<Footer role="contentinfo" />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  test("sets ARIA attributes correctly", () => {
    render(
      <Footer
        ariaLabel="Site Footer"
        ariaLabelledBy="footer-label"
        ariaDescribedBy="footer-desc"
      />
    );

    const footer = screen.getByText(`© ${currentYear} Corestack Technologies`);
    expect(footer).toHaveAttribute("aria-label", "Site Footer");
    expect(footer).toHaveAttribute("aria-labelledby", "footer-label");
    expect(footer).toHaveAttribute("aria-describedby", "footer-desc");
  });
});
