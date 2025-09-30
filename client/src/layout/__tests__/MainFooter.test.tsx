import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainFooter from "layout/MainFooter";

describe("MainFooter Component", () => {
  const currentYear = new Date().getFullYear();

  it("renders with current year and company name", () => {
    render(<MainFooter />);
    expect(screen.getByText(`© ${currentYear} Corestack Technologies`)).toBeInTheDocument();
  });

  it("applies classes", () => {
    render(<MainFooter />);
    const footer = screen.getByText(`© ${currentYear} Corestack Technologies`);
    expect(footer).toHaveClass(
      "ta-center px-1p5r-py-2r text-base text-white bg-gradient-translucent-blue",
    );
  });
});