
import { render, screen } from "@testing-library/react";
import PreElectionCountDown from "features/timer/components/preElectionTimer/PreElectionCountDown";
import type { MultiLayerWrapperProps } from "layout/MultiLayerWrapper";
import { vi } from "vitest";

vi.mock(
  "layout/MultiLayerWrapper",
  () =>
    ({ children }: MultiLayerWrapperProps) => (
      <div data-testid="multi-layer-wrapper">{children}</div>
    ),
);

vi.mock(
  "features/timer/components/preElectionTimer/PreElectionCountDownTimer",
  () =>
    ({ endTime }: { endTime: number }) => (
      <div data-testid="pre-election-timer">Timer: {endTime}</div>
    ),
);

describe("PreElectionCountDown", () => {
  it("renders headings and timer correctly", () => {
    render(<PreElectionCountDown endTime={12345} />);

    expect(
      screen.getByRole("heading", { name: /The Election Will Start In:/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Please Come Back To Vote Then\./i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("multi-layer-wrapper")).toBeInTheDocument();

    expect(screen.getByTestId("pre-election-timer")).toHaveTextContent(
      "Timer: 12345",
    );
  });

  it("passes the endTime prop to PreElectionCountDownTimer", () => {
    render(<PreElectionCountDown endTime={98765} />);
    expect(screen.getByTestId("pre-election-timer")).toHaveTextContent(
      "Timer: 98765",
    );
  });
});
