import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ElectionDetailsHeaderHomeIcon from "features/election/components/ElectionDetailsHeaderHomeIcon";

import useBreakpoint from "hooks/useBreakpoint";

jest.mock("components/ui/I", () => ({ className, onClick }) => (
  <i data-testid="home-icon" className={className} onClick={onClick} />
));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("hooks/useBreakpoint", () => jest.fn());

describe("ElectionDetailsHeaderHomeIcon", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with mobile breakpoint and applies 'fa-2x'", () => {
    useBreakpoint.mockReturnValue("mobile");
    render(<ElectionDetailsHeaderHomeIcon />);
    const icon = screen.getByTestId("home-icon");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("fas", "fa-home", "fa-2x");
  });

  it("renders without 'fa-2x' on non-mobile breakpoints", () => {
    useBreakpoint.mockReturnValue("desktop");
    render(<ElectionDetailsHeaderHomeIcon />);
    const icon = screen.getByTestId("home-icon");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("fas", "fa-home");
    expect(icon).not.toHaveClass("fa-2x");
  });

  it("navigates to '/' on click", () => {
    useBreakpoint.mockReturnValue("mobile");
    render(<ElectionDetailsHeaderHomeIcon />);
    const icon = screen.getByTestId("home-icon");

    fireEvent.click(icon);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
