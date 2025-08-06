import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantVotesInfo from "features/election/components/contestant/info/ContestantVotesInfo";

jest.mock(
  "features/election/components/contestant/info/ContestantTextInfoWrapper",
  () =>
    ({ children }) => <div data-testid="wrapper">{children}</div>,
);

describe("ContestantVotesInfo", () => {
  const typeLabel = "Vote percent";

  it("renders the type label with child content when showInfo is true", () => {
    render(
      <ContestantVotesInfo type={typeLabel} showInfo>
        75%
      </ContestantVotesInfo>,
    );

    const wrapper = screen.getByTestId("wrapper");

    expect(wrapper).toHaveTextContent("Vote percent: 75%");
  });

  it("renders only the type label when showInfo is false", () => {
    render(
      <ContestantVotesInfo type={typeLabel} showInfo={false}>
        75%
      </ContestantVotesInfo>,
    );

    const wrapper = screen.getByTestId("wrapper");

    expect(wrapper).toHaveTextContent("Vote percent:");
    expect(wrapper).not.toHaveTextContent("75%");
  });

  it("renders with different type label and child content", () => {
    render(
      <ContestantVotesInfo type="Vote percent" showInfo>
        98%
      </ContestantVotesInfo>,
    );

    const wrapper = screen.getByTestId("wrapper");

    expect(wrapper).toHaveTextContent("Vote percent: 98%");
  });
});
