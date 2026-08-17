import { render, screen } from "@testing-library/react";
import DataToolTip from "components/ui/DataToolTip";
import { vi } from "vitest";

describe("<DataToolTip />", () => {
  const defaultProps = {
    data: "This is a tooltip",
    role: "region",
    ariaLabel: "group-label",
    children: <button>Hover me</button>,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the tooltip content with data-tooltip attribute", () => {
    render(<DataToolTip {...defaultProps} />);
    const tooltipWrapper = screen.getByTestId("data-tooltip-id");
    expect(tooltipWrapper).toHaveAttribute("data-tooltip", "This is a tooltip");
  });

  it("renders the children inside the tooltip", () => {
    render(<DataToolTip {...defaultProps} />);
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});
