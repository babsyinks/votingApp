import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultsPositionsTabs from "features/results/components/ResultsPositionsTabs";

describe("ResultsPositionsTabs", () => {
  const result = [
    { position: "President" },
    { position: "Vice President" },
    { position: "Secretary" },
  ];

  const setup = (overrideProps = {}) => {
    const setCurrentIndex = jest.fn();

    const props = {
      result,
      currentIndex: 0,
      setCurrentIndex,
      ...overrideProps,
    };

    render(<ResultsPositionsTabs {...props} />);
    return { setCurrentIndex, props };
  };

  it("renders a ResultsPositionsTab for each position in the result array", () => {
    setup();

    expect(screen.getByText(/^President$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Vice President$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Secretary$/i)).toBeInTheDocument();
  });

  it("calls setCurrentIndex with the correct index when a tab is clicked", () => {
    const { setCurrentIndex } = setup();
    const vicePresidentTab = screen.getByText(/^Vice President$/i);

    fireEvent.click(vicePresidentTab);
    expect(setCurrentIndex).toHaveBeenCalledWith(1);
  });

  it("applies 'bg-red' only to the tab with matching currentIndex", () => {
    setup({ currentIndex: 2 });

    const presidentTab = screen.getByText(/^President$/i);
    const secretaryTab = screen.getByText(/^Secretary$/i);

    expect(presidentTab.className).not.toMatch(/bg-red/);
    expect(secretaryTab.className).toMatch(/bg-red/);
  });
});
