import { render, screen } from "@testing-library/react";
import HeroSection from "features/home/components/HeroSection";
import useWindowSize from "hooks/useWindowSize";
import type { SectionProps } from "components/ui/Section";
import type { BlockProps } from "components/ui/Block";
import type { UserAuthStatus } from "features/home/types/userAuthStatus";
import { vi, type Mock } from "vitest";

vi.mock(
  "components/ui/Section",
  () =>
    ({ children, type, className }: SectionProps) => (
      <section
        data-testid="hero-section"
        data-type={type}
        className={className}
      >
        {children}
      </section>
    ),
);
vi.mock(
  "components/ui/Block",
  () =>
    ({ children, className, type }: BlockProps) => (
      <div data-testid="block" data-type={type} className={className}>
        {children}
      </div>
    ),
);
vi.mock("features/home/components/HeroSectionMessage", () => () => (
  <div data-testid="hero-message" />
));
vi.mock(
  "features/home/components/HeroSectionLink",
  () =>
    ({ userIsAuthenticated }: UserAuthStatus) => (
      <div data-testid="hero-link">
        {userIsAuthenticated ? "Authenticated" : "Guest"}
      </div>
    ),
);
vi.mock("features/home/components/HeroSectionImage", () => () => (
  <div data-testid="hero-image" />
));

vi.mock("hooks/useWindowSize");

describe("HeroSection", () => {
  let mockUseWindowSize = useWindowSize as Mock;
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with flex-vert on small screens", () => {
    mockUseWindowSize.mockReturnValue({ width: 500 });

    render(<HeroSection userIsAuthenticated={false} />);

    const section = screen.getByTestId("hero-section");
    expect(section).toHaveAttribute("data-type", "flex-vert");
    expect(section).toHaveClass(
      "px-1p5r-py-4r bg-gradient-blueviolet text-white",
    );

    expect(screen.getByTestId("hero-message")).toBeInTheDocument();
    expect(screen.getByTestId("hero-link")).toHaveTextContent("Guest");
    expect(screen.getByTestId("hero-image")).toBeInTheDocument();
  });

  it("renders with flex-horz-sb on large screens", () => {
    mockUseWindowSize.mockReturnValue({ width: 1024 });

    render(<HeroSection userIsAuthenticated={true} />);

    const section = screen.getByTestId("hero-section");
    expect(section).toHaveAttribute("data-type", "flex-horz-sb");

    expect(screen.getByTestId("hero-link")).toHaveTextContent("Authenticated");
  });
});
