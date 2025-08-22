import React from "react";
import { render, screen } from "@testing-library/react";
import ResultStatusIndicatorTie from "features/results/components/ResultStatusIndicatorTie";

jest.mock("features/results/components/ResultStatusIndicator.js");

describe("ResultStatusIndicatorTie", () => {
  it("renders the ResultStatusIndicator with tie message and icon", () => {
    render(<ResultStatusIndicatorTie />);

    const wrapper = screen.getByTestId("result-status-indicator"); 
    expect(screen.getByText("Tie")).toBeInTheDocument();
    expect(wrapper).toHaveClass("text-yellow-cool");

    const icon = screen.getByTestId("icon-indicator");
    expect(icon).toHaveClass("icon", "fa-handshake");
  });

  it("passes the correct props to ResultStatusIndicator", () => {
    render(<ResultStatusIndicatorTie />);

    const wrapper = screen.getByTestId("result-status-indicator");
    expect(wrapper).toHaveAttribute("textcolor", "text-yellow-cool");
    expect(wrapper).toHaveAttribute("indicatortype", "fa-handshake");
    expect(wrapper).toHaveAttribute("message", "Tie");
  });
});
