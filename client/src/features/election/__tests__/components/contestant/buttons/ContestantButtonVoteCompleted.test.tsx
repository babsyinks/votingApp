import { render, screen } from "@testing-library/react";
import ContestantButtonVoteCompleted from "features/election/components/contestant/buttons/ContestantButtonVoteCompleted";
import { ButtonProps } from "components/ui/Button";
import { IProps } from "components/ui/I";
import { vi } from "vitest";

vi.mock(
  "components/ui/Button",
  () =>
    ({ children, ...props }: ButtonProps) => (
      <button {...props}>{children}</button>
    ),
);
vi.mock("components/ui/I", () => (props: IProps) => (
  <i data-testid="vote-icon" {...props} />
));

describe("ContestantButtonVoteCompleted", () => {
  it("renders a green check icon when votedFor is true", () => {
    render(<ContestantButtonVoteCompleted votedFor={true} />);
    const button = screen.getByRole("button");
    const icon = screen.getByTestId("vote-icon");

    expect(button).toHaveClass("text-lime");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("fa-check-circle");
  });

  it("renders a red times icon when votedFor is false", () => {
    render(<ContestantButtonVoteCompleted votedFor={false} />);
    const button = screen.getByRole("button");
    const icon = screen.getByTestId("vote-icon");

    expect(button).toHaveClass("text-red");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("fa-times-circle");
  });

  it("always has base button and icon classes", () => {
    render(<ContestantButtonVoteCompleted />);
    const button = screen.getByRole("button");
    const icon = screen.getByTestId("vote-icon");

    expect(button).toHaveClass("rnd-corner-btn");
    expect(button).toHaveClass("rnd-corner-btn-sized");
    expect(button).toHaveClass("bg-black");
    expect(button).toHaveClass("cs-not-allowed");

    expect(icon).toHaveClass("far");
    expect(icon).toHaveClass("fa-lg");
    expect(icon).toHaveClass("cs-not-allowed");
  });
});
