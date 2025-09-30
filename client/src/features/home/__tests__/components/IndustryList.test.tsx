import { render, screen } from "@testing-library/react";
import IndustryList from "features/home/components/IndustryList";
import industriesServed from "features/home/data/industriesServed";
import type { IndustryCardProps } from "features/home/components/IndustryCard";
import type { GridProps } from "layout/Grid";

jest.mock(
  "features/home/components/IndustryCard",
  () =>
    ({ name }: IndustryCardProps) => (
      <div data-testid="industry-card">{name}</div>
    ),
);

const stack: string[] = [];

jest.mock("layout/Grid", () => ({ children, ...props }: GridProps) => {
  const propCopy = { ...props };
  delete propCopy.useDefaultStyle;
  stack.push(`useDefaultStyle - ${props.useDefaultStyle}`);
  return (
    <div data-testid="grid" {...propCopy}>
      {children}
    </div>
  );
});

describe("IndustryList component", () => {
  it("renders without crashing", () => {
    render(<IndustryList />);
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("applies correct props to Grid", () => {
    render(<IndustryList />);
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveClass("grid-min-1-max-3", "gap-1p5r", "mt-2r");
    expect(stack).toContain("useDefaultStyle - false");
  });

  it("renders the same number of IndustryCard components as industries", () => {
    render(<IndustryList />);
    const cards = screen.getAllByTestId("industry-card");
    expect(cards.length).toBe(industriesServed.length);
  });

  it("renders each industry name correctly", () => {
    render(<IndustryList />);
    industriesServed.forEach((industry) => {
      expect(screen.getByText(industry)).toBeInTheDocument();
    });
  });
});
