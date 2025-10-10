import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultsPositionsTab from "features/results/components/ResultsPositionsTab";

describe("ResultsPositionsTab", () => {
  const setup = (propsOverride = {}) => {
    const setCurrentIndex = jest.fn();
    const defaultProps = {
      position: "President",
      currentIndex: 0,
      setCurrentIndex,
      tabIndex: 0,
    };

    const props = { ...defaultProps, ...propsOverride };

    render(<ResultsPositionsTab {...props} />);
    return { setCurrentIndex, props };
  };

  it("renders the position name", () => {
    setup();
    expect(screen.getByText(/president/i)).toBeInTheDocument();
  });

  it("applies 'bg-red' class when tabIndex equals currentIndex", () => {
    setup({ currentIndex: 2, tabIndex: 2 });
    const span = screen.getByText(/president/i);
    expect(span.className).toMatch(/bg-red/);
  });

  it("does NOT apply 'bg-red' class when tabIndex does not equal currentIndex", () => {
    setup({ currentIndex: 1, tabIndex: 2 });
    const span = screen.getByText(/president/i);
    expect(span.className).not.toMatch(/bg-red/);
  });

  it("calls setCurrentIndex with tabIndex when clicked", () => {
    const { setCurrentIndex, props } = setup({ currentIndex: 1, tabIndex: 2 });
    const span = screen.getByText(/president/i);
    fireEvent.click(span);
    expect(setCurrentIndex).toHaveBeenCalledWith(props.tabIndex);
  });
});
