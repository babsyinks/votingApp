import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContestantView from "features/election/components/contestant/ContestantView";
import { ContestantMainViewProps } from "features/election/components/contestant/ContestantMainView";
import { ContestantManifestoViewProps } from "features/election/components/contestant/ContestantManifestoView";

jest.mock(
  "features/election/components/contestant/ContestantMainView",
  () => (props: ContestantMainViewProps) => (
    <div data-testid="contestant-main-view">
      <button onClick={() => props.manifestoControl.setShowManifesto(true)}>
        Show Manifesto
      </button>
    </div>
  ),
);

jest.mock(
  "features/election/components/contestant/ContestantManifestoView",
  () =>
    ({ manifestoControl, manifesto }: ContestantManifestoViewProps) => (
      <div data-testid="contestant-manifesto-view">
        <button onClick={() => manifestoControl.setShowManifesto(false)}>
          Close Manifesto
        </button>
        <p>{manifesto}</p>
      </div>
    ),
);

describe("ContestantView component", () => {
  const baseProps = {
    contestant: {
      contestant_id: "c001",
      surname: "Doe",
      firstname: "John",
      picture: "https://example.com/pic.jpg",
      votes: [],
      manifesto: "I will make things better.",
    },
    position: "President",
    totalVotes: 100,
    isButtonDisabled: false,
    votePercentColor: { c001: "blue" },
  };

  it("renders ContestantMainView by default", () => {
    render(<ContestantView {...baseProps} />);
    expect(screen.getByTestId("contestant-main-view")).toBeInTheDocument();
    expect(
      screen.queryByTestId("contestant-manifesto-view"),
    ).not.toBeInTheDocument();
  });

  it("renders ContestantManifestoView after clicking 'Show Manifesto'", () => {
    render(<ContestantView {...baseProps} />);

    fireEvent.click(screen.getByText("Show Manifesto"));

    expect(screen.getByTestId("contestant-manifesto-view")).toBeInTheDocument();
    expect(
      screen.queryByTestId("contestant-main-view"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("I will make things better.")).toBeInTheDocument();
  });

  it("returns to ContestantMainView after clicking 'Close Manifesto'", () => {
    render(<ContestantView {...baseProps} />);

    fireEvent.click(screen.getByText("Show Manifesto"));
    expect(screen.getByTestId("contestant-manifesto-view")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Manifesto"));
    expect(screen.getByTestId("contestant-main-view")).toBeInTheDocument();
    expect(
      screen.queryByTestId("contestant-manifesto-view"),
    ).not.toBeInTheDocument();
  });
});
