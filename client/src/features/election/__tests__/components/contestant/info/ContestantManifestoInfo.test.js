import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantManifestoInfo from "features/election/components/contestant/info/ContestantManifestoInfo";

describe("ContestantManifestoInfo", () => {
  it("renders the manifesto text", () => {
    const manifesto = "I promise to improve student welfare and provide free lunch.";
    render(<ContestantManifestoInfo manifesto={manifesto} />);
    expect(screen.getByText(manifesto)).toBeInTheDocument();
  });

  it("applies the correct styling classes", () => {
    const manifesto = "Transparency and fairness for all.";
    render(<ContestantManifestoInfo manifesto={manifesto} />);
    const block = screen.getByText(manifesto);
    expect(block).toHaveClass("fw-normal", "ta-left");
  });
});
