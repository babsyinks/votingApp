import React from "react";
import { render, screen } from "@testing-library/react";
import HelpMessage from "features/help/components/HelpMessage";

describe("HelpMessage component", () => {
  it("renders the heading with correct text", () => {
    render(<HelpMessage />);
    const heading = screen.getByRole("heading", { name: /do you need help\?/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Do You Need Help?");
    expect(heading.tagName).toBe("H1");
  });

  it("renders the paragraph with the expected support message", () => {
    render(<HelpMessage />);
    const paragraph = screen.getByText(
      /we're here to help! reach out to our support team via whatsapp/i,
    );
    expect(paragraph).toBeInTheDocument();
  });
});
