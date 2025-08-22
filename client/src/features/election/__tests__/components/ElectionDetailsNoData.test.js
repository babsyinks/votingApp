import React from "react";
import { render, screen } from "@testing-library/react";
import ElectionDetailsNoData from "features/election/components/ElectionDetailsNoData";

jest.mock("features/election/components/ElectionDetailsHeader", () => ({ message }) => (
  <div data-testid="election-header">{message}</div>
));

describe("ElectionDetailsNoData", () => {
  it("renders ElectionDetailsHeader with correct message", () => {
    render(<ElectionDetailsNoData />);

    const header = screen.getByTestId("election-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Please come back later.");
  });

  it("renders heading with no data message", () => {
    render(<ElectionDetailsNoData />);

    const heading = screen.getByRole("heading", {
      name: /There Is Currently No Election Or Election Data Could Not Be Fetched/i,
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("ta-center");
  });
});
