import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Contestant from "features/election/components/contestant/Contestant";

jest.mock("features/election/components/contestant/ContestantMainView", () => (props) => (
  <div data-testid="contestant-main-view">
    <button onClick={() => props.manifestoControl.setShowManifesto(true)}>Show Manifesto</button>
  </div>
));

jest.mock("features/election/components/contestant/ContestantManifestoView", () => ({ manifestoControl, manifesto }) => (
  <div data-testid="contestant-manifesto-view">
    <button onClick={() => manifestoControl.setShowManifesto(false)}>Close Manifesto</button>
    <p>{manifesto}</p>
  </div>
));

describe("Contestant component", () => {
  const baseProps = {
    contestant: {
      contestant_id: "c001",
      votes: [],
      manifesto: "I will make things better.",
    },
    position: "President",
    totalVotes: 100,
    isButtonDisabled: false,
    votePercentColor: { c001: "blue" },
  };

  it("renders ContestantMainView by default", () => {
    render(<Contestant {...baseProps} />);
    expect(screen.getByTestId("contestant-main-view")).toBeInTheDocument();
    expect(screen.queryByTestId("contestant-manifesto-view")).not.toBeInTheDocument();
  });

  it("renders ContestantManifestoView after clicking 'Show Manifesto'", () => {
    render(<Contestant {...baseProps} />);

    fireEvent.click(screen.getByText("Show Manifesto"));

    expect(screen.getByTestId("contestant-manifesto-view")).toBeInTheDocument();
    expect(screen.queryByTestId("contestant-main-view")).not.toBeInTheDocument();
    expect(screen.getByText("I will make things better.")).toBeInTheDocument();
  });

  it("returns to ContestantMainView after clicking 'Close Manifesto'", () => {
    render(<Contestant {...baseProps} />);

    fireEvent.click(screen.getByText("Show Manifesto"));
    expect(screen.getByTestId("contestant-manifesto-view")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Manifesto"));
    expect(screen.getByTestId("contestant-main-view")).toBeInTheDocument();
    expect(screen.queryByTestId("contestant-manifesto-view")).not.toBeInTheDocument();
  });
});
