import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantTextInfoWrapper from "features/election/components/contestant/info/ContestantTextInfoWrapper";
import styles from "features/election/components/contestant/info/ContestantTextInfoWrapper.module.css";

jest.mock("components/ui/Block", () => (props) => <div data-testid="contestant-info-wrapper" {...props}></div>);

describe("ContestantTextInfoWrapper", () => {
  it("renders children correctly", () => {
    render(
      <ContestantTextInfoWrapper>
        <p>Candidate Bio</p>
      </ContestantTextInfoWrapper>,
    );

    expect(screen.getByText("Candidate Bio")).toBeInTheDocument();
  });

  it("applies the correct class from CSS module", () => {
    render(
      <ContestantTextInfoWrapper>
        <div>Details</div>
      </ContestantTextInfoWrapper>,
    );

    const wrapper = screen.getByTestId("contestant-info-wrapper");
    expect(wrapper).toHaveClass(styles["info-wrapper"]);
  });
});
