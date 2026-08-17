
import { render, screen, fireEvent } from "@testing-library/react";
import ElectionDetailsHeaderHomeIcon from "features/election/components/ElectionDetailsHeaderHomeIcon";
import useBreakpoint from "hooks/useBreakpoint";
import { IProps } from "components/ui/I";
import { vi, type Mock } from "vitest";

vi.mock("components/ui/I", () => ({ className, onClick }: IProps) => (
  <i data-testid="home-icon" className={className} onClick={onClick} />
));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("hooks/useBreakpoint", () => vi.fn());

describe("ElectionDetailsHeaderHomeIcon", () => {
  const mockUseBreakpoint = useBreakpoint as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with mobile breakpoint and applies 'fa-2x'", () => {
    mockUseBreakpoint.mockReturnValue("mobile");
    render(<ElectionDetailsHeaderHomeIcon />);
    const icon = screen.getByTestId("home-icon");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("fas", "fa-home", "fa-2x");
  });

  it("renders without 'fa-2x' on non-mobile breakpoints", () => {
    mockUseBreakpoint.mockReturnValue("desktop");
    render(<ElectionDetailsHeaderHomeIcon />);
    const icon = screen.getByTestId("home-icon");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("fas", "fa-home");
    expect(icon).not.toHaveClass("fa-2x");
  });

  it("navigates to '/' on click", () => {
    mockUseBreakpoint.mockReturnValue("mobile");
    render(<ElectionDetailsHeaderHomeIcon />);
    const icon = screen.getByTestId("home-icon");

    fireEvent.click(icon);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
