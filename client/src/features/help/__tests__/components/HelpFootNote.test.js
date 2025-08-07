import React from "react";
import { render, screen } from "@testing-library/react";
import HelpFootNote from "features/help/components/HelpFootNote";

describe("HelpFootNote component", () => {
  it("renders the paragraph with the note", () => {
    render(<HelpFootNote />);
    const paragraph = screen.getByText(
      /if whatsapp links are not opening, try updating your browser./i,
    );
    expect(paragraph).toBeInTheDocument();
  });

  it("includes the word 'Note:' in bold", () => {
    render(<HelpFootNote />);
    const strongTag = screen.getByText("Note:");
    expect(strongTag.tagName).toBe("STRONG");
  });
});
