import { render, screen } from "@testing-library/react";
import HomePage from "pages/HomePage";
import { useSelector, useDispatch } from "react-redux";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import featureCardConfig from "features/home/data/featureCardConfig";
import type { MainProps } from "components/ui/Main";
import type { UserAuthStatus } from "features/home/types/userAuthStatus";
import type { MiniFeatureSectionProps } from "features/home/components/MiniFeatureSection";
import { vi, type Mock } from "vitest";

vi.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: vi.fn(() => ({
    type: "mock/fetchThenSetCurrentTimerStatus",
  })),
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

vi.mock("components/ui/Main", () => ({
  __esModule: true,
  default: ({ children, className }: MainProps) => (
    <div data-testid="Main" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("layout/MainHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="MainHeader" />,
}));

vi.mock("layout/MainFooter", () => ({
  __esModule: true,
  default: () => <div data-testid="MainFooter" />,
}));

vi.mock("features/home/components/ElectionStatusIndicator", () => ({
  __esModule: true,
  default: () => <div data-testid="ElectionStatusIndicator" />,
}));

vi.mock("features/home/components/HeroSection", () => ({
  __esModule: true,
  default: ({ userIsAuthenticated }: UserAuthStatus) => (
    <div data-testid="HeroSection">{String(userIsAuthenticated)}</div>
  ),
}));

vi.mock("features/home/components/MiniFeatureSection", () => ({
  __esModule: true,
  default: ({ section }: MiniFeatureSectionProps) => (
    <div data-testid={`MiniFeatureSection-${section.title}`} />
  ),
}));

vi.mock("features/home/components/TestimonialList", () => ({
  __esModule: true,
  default: () => <div data-testid="TestimonialList" />,
}));

vi.mock("features/home/components/IndustriesServedDetails", () => ({
  __esModule: true,
  default: () => <div data-testid="IndustriesServed" />,
}));

vi.mock("features/home/components/HelpSection", () => ({
  __esModule: true,
  default: () => <div data-testid="HelpSection" />,
}));

const mockedFetchThenSetCurrentTimerStatus = vi.mocked(
  fetchThenSetCurrentTimerStatus,
);

describe("HomePage component", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    (useDispatch as Mock).mockReturnValue(mockDispatch);
    (useSelector as Mock).mockImplementation((selector) =>
      selector.name === "userAuth" ? true : null,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders all the home page sections", () => {
    render(<HomePage />);

    expect(screen.getByTestId("Main")).toBeInTheDocument();
    expect(screen.getByTestId("MainHeader")).toBeInTheDocument();
    expect(screen.getByTestId("ElectionStatusIndicator")).toBeInTheDocument();
    expect(screen.getByTestId("HeroSection")).toHaveTextContent("true");

    expect(
      screen.getByTestId(
        `MiniFeatureSection-${featureCardConfig.expect.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `MiniFeatureSection-${featureCardConfig.features.title}`,
      ),
    ).toBeInTheDocument();

    expect(screen.getByTestId("TestimonialList")).toBeInTheDocument();
    expect(screen.getByTestId("IndustriesServed")).toBeInTheDocument();
    expect(screen.getByTestId("HelpSection")).toBeInTheDocument();
    expect(screen.getByTestId("MainFooter")).toBeInTheDocument();
  });

  it("dispatches fetchThenSetCurrentTimerStatus on mount", () => {
    const mockAction = { type: "mock/fetchThenSetCurrentTimerStatus" } as any;
    mockedFetchThenSetCurrentTimerStatus.mockReturnValue(mockAction);

    render(<HomePage />);
    expect(mockDispatch).toHaveBeenCalledWith(mockAction);
  });
});
