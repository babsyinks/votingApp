import React from "react";
import { render, screen } from "@testing-library/react";
import ResultStatusIndicatorLoser from "features/results/components/ResultStatusIndicatorLoser";

jest.mock("features/results/components/ResultStatusIndicator.js");

describe("ResultStatusIndicatorLoser", () => {
  it("renders the ResultStatusIndicator with loser message and icon", () => {
    render(<ResultStatusIndicatorLoser />);

    const wrapper = screen.getByTestId("result-status-indicator"); 
    expect(screen.getByText("Lost the election")).toBeInTheDocument();
    expect(wrapper).toHaveClass("text-red-cool");

    const icon = screen.getByTestId("icon-indicator");
    expect(icon).toHaveClass("icon", "fa-times-circle");
  });

  it("passes the correct props to ResultStatusIndicator", () => {
    render(<ResultStatusIndicatorLoser />);

    const wrapper = screen.getByTestId("result-status-indicator");
    expect(wrapper).toHaveAttribute("textcolor", "text-red-cool");
    expect(wrapper).toHaveAttribute("indicatortype", "fa-times-circle");
    expect(wrapper).toHaveAttribute("message", "Lost the election");
  });
});
