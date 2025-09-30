import React from "react";
import { render, screen, within } from "@testing-library/react";
import HelpMeansEmail from "features/help/components/HelpMeansEmail";

describe("HelpMeansEmail component", () => {
  it("renders the instruction text", () => {
    render(<HelpMeansEmail />);
    const text = screen.getByText(/alternatively, you can send an email to/i);
    expect(text).toBeInTheDocument();
  });

  it("renders the email link with correct href", () => {
    render(<HelpMeansEmail />);
    const link = screen.getByRole("link", { name: /multac@proton\.me/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:multac@proton.me");
  });

  it("renders the correct instruction text and email link inside the same paragraph", () => {
    render(<HelpMeansEmail />);
    const paragraph = screen.getByText(/alternatively, you can send an email to/i);
    const utils = within(paragraph);
    const link = utils.getByRole("link", { name: /multac@proton\.me/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:multac@proton.me");
  });
});
