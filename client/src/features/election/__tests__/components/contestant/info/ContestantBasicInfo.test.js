import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantBasicInfo from "features/election/components/contestant/info/ContestantBasicInfo";

jest.mock("components/ui/Block", () => (props) => <div data-testid="contestant-info-wrapper" {...props}></div>);

describe("ContestantBasicInfo", () => {
  it("renders the type and value correctly", () => {
    render(<ContestantBasicInfo type="Name" value="John" />);

    // Checks the full text content including the label and the span
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("applies correct classes to the value span", () => {
    render(<ContestantBasicInfo type="Age" value="35" />);
    const valueSpan = screen.getByText("35");
    expect(valueSpan).toHaveClass("tt-cap", "ff-berkshire", "py-5", "text-blue");
  });

  it("renders children inside ContestantTextInfoWrapper", () => {
    render(<ContestantBasicInfo type="Role" value="Treasurer" />);

    const wrapper = screen.getByTestId("contestant-info-wrapper");
    expect(wrapper).toBeInTheDocument(); 
  });
});
