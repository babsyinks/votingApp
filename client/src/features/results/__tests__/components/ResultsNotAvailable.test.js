import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ResultsNotAvailable from "features/results/components/ResultsNotAvailable";

describe("ResultsNotAvailable", () => {
  it("renders ResultsNone with the correct heading and content", () => {
    render(
      <MemoryRouter>
        <ResultsNotAvailable />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /election results are not available/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /you are seeing this page because you either tried to view results in dry run mode/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /what would you like to do/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /go to home page/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /go to help page/i })
    ).toBeInTheDocument();
  });
});
