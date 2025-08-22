import React from "react";
import { render, screen } from "@testing-library/react";
import ResultStatusIndicatorChooser from "features/results/components/ResultStatusIndicatorChooser";

jest.mock("features/results/components/ResultStatusIndicatorWinner.js", () => () => (
  <div data-testid="winner">Winner</div>
));
jest.mock("features/results/components/ResultStatusIndicatorTie.js", () => () => (
  <div data-testid="tie">Tie</div>
));
jest.mock("features/results/components/ResultStatusIndicatorLoser.js", () => () => (
  <div data-testid="loser">Loser</div>
));

describe("ResultStatusIndicatorChooser", () => {
  it("renders Winner when index is 0, isTie is false, and votes > 0", () => {
    render(<ResultStatusIndicatorChooser index={0} isTie={false} contestantTotalVotes={10} />);
    expect(screen.getByTestId("winner")).toBeInTheDocument();
  });

it("does not render anything when index is 0, isTie is false, and votes === 0", () => {
  render(<ResultStatusIndicatorChooser index={0} isTie={false} contestantTotalVotes={0} />);
  expect(screen.queryByTestId("winner")).not.toBeInTheDocument(); 
  expect(screen.queryByTestId("tie")).not.toBeInTheDocument();
  expect(screen.queryByTestId("loser")).not.toBeInTheDocument();
});


  it("renders Tie when index is 0 and isTie is true", () => {
    render(<ResultStatusIndicatorChooser index={0} isTie={true} contestantTotalVotes={100} />);
    expect(screen.getByTestId("tie")).toBeInTheDocument();
  });

  it("renders Tie when index is not 0 and isTie is true", () => {
    render(<ResultStatusIndicatorChooser index={1} isTie={true} contestantTotalVotes={5} />);
    expect(screen.getByTestId("tie")).toBeInTheDocument();
  });

  it("renders Loser when index is not 0 and isTie is false", () => {
    render(<ResultStatusIndicatorChooser index={1} isTie={false} contestantTotalVotes={3} />);
    expect(screen.getByTestId("loser")).toBeInTheDocument();
  });
});
