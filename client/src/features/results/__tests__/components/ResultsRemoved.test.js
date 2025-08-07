import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ResultsRemoved from "features/results/components/ResultsRemoved";

describe("ResultsRemoved", () => {
  it("renders ResultsNone with the correct heading and content", () => {
    render(
      <MemoryRouter>
        <ResultsRemoved />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /there is no election result/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/you are seeing this page because the last election results have been deleted/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: /what would you like to do/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /go to home page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to help page/i })).toBeInTheDocument();
  });
});
