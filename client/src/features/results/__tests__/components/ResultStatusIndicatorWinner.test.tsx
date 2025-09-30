import React from "react";
import { render, screen } from "@testing-library/react";
import ResultStatusIndicatorWinner from "features/results/components/ResultStatusIndicatorWinner";

jest.mock("features/results/components/ResultStatusIndicator");

describe("ResultStatusIndicatorWinner", () => {
  it("renders the ResultStatusIndicator with winner message and icon", () => {
    render(<ResultStatusIndicatorWinner />);

    const wrapper = screen.getByTestId("result-status-indicator");
    expect(screen.getByText("Won the election")).toBeInTheDocument();
    expect(wrapper).toHaveClass("text-green");

    const icon = screen.getByTestId("icon-indicator");
    expect(icon).toHaveClass("icon", "fa-check-circle");
  });

  it("passes the correct props to ResultStatusIndicator", () => {
    render(<ResultStatusIndicatorWinner />);

    const wrapper = screen.getByTestId("result-status-indicator");
    expect(wrapper).toHaveAttribute("textcolor", "text-green");
    expect(wrapper).toHaveAttribute("indicatortype", "fa-check-circle");
    expect(wrapper).toHaveAttribute("message", "Won the election");
  });
});
