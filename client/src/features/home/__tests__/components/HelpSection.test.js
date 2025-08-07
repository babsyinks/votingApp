import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HelpSection from "features/home/components/HelpSection";

describe("HelpSection", () => {
  test("renders paragraph with help text", () => {
    render(
      <MemoryRouter>
        <HelpSection />
      </MemoryRouter>
    );

    const paragraphText = screen.getByText(/Need assistance/i);
    expect(paragraphText).toBeInTheDocument();
  });

  test("renders a link to the Help Center", () => {
    render(
      <MemoryRouter>
        <HelpSection />
      </MemoryRouter>
    );

    const helpLink = screen.getByRole("link", { name: /Visit our Help Center/i });
    expect(helpLink).toBeInTheDocument();
    expect(helpLink).toHaveAttribute("href", "/help");
    expect(helpLink).toHaveClass("text-blueviolet-mute");
  });
});
