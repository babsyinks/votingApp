import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantFrame from "features/election/components/contestant/ContestantFrame";

jest.mock("components/ui/Block", () => ({ children, className }) => (
  <div data-testid="mock-block" className={className}>
    {children}
  </div>
));

describe("ContestantFrame", () => {
  it("renders children inside the Block", () => {
    render(
      <ContestantFrame>
        <p>Contestant Info</p>
      </ContestantFrame>
    );

    const block = screen.getByTestId("mock-block");
    expect(block).toBeInTheDocument();
    expect(block).toHaveTextContent("Contestant Info");
  });

  it("applies default styles", () => {
    render(<ContestantFrame>Child</ContestantFrame>);

    const block = screen.getByTestId("mock-block");
    expect(block.className).toContain("z-30");
    expect(block.className).toContain("p-10");
    expect(block.className).toContain("border-2-grey");
    expect(block.className).toContain("border-rounded-5");
    expect(block.className).toContain("ml-2");
    expect(block.className).toContain("bg-white");
    expect(block.className).toContain("fw-bold");
  });

  it("appends custom className prop", () => {
    render(<ContestantFrame className="custom-class">Child</ContestantFrame>);

    const block = screen.getByTestId("mock-block");
    expect(block.className).toContain("custom-class");
  });
});
