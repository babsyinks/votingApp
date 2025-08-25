import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "pages/HomePage";
import { useSelector, useDispatch } from "react-redux";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import featureCardConfig from "features/home/data/featureCardConfig";

jest.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: jest.fn(() => ({
    type: "mock/fetchThenSetCurrentTimerStatus",
  })),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("components/ui/Main", () => ({
  __esModule: true,
  default: ({ children, className }) => (
    <div data-testid="Main" className={className}>
      {children}
    </div>
  ),
}));

jest.mock("layout/MainHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="MainHeader" />,
}));

jest.mock("layout/MainFooter", () => ({
  __esModule: true,
  default: () => <div data-testid="MainFooter" />,
}));

jest.mock("features/home/components/ElectionStatusIndicator", () => ({
  __esModule: true,
  default: () => <div data-testid="ElectionStatusIndicator" />,
}));

jest.mock("features/home/components/HeroSection", () => ({
  __esModule: true,
  default: ({ userIsAuthenticated }) => (
    <div data-testid="HeroSection">{String(userIsAuthenticated)}</div>
  ),
}));

jest.mock("features/home/components/MiniFeatureSection", () => ({
  __esModule: true,
  default: ({ section }) => <div data-testid={`MiniFeatureSection-${section.title}`} />,
}));

jest.mock("features/home/components/TestimonialList", () => ({
  __esModule: true,
  default: () => <div data-testid="TestimonialList" />,
}));

jest.mock("features/home/components/IndustriesServed", () => ({
  __esModule: true,
  default: () => <div data-testid="IndustriesServed" />,
}));

jest.mock("features/home/components/HelpSection", () => ({
  __esModule: true,
  default: () => <div data-testid="HelpSection" />,
}));

describe("HomePage component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => (selector.name === "userAuth" ? true : null));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all the home page sections", () => {
    render(<HomePage />);

    expect(screen.getByTestId("Main")).toBeInTheDocument();
    expect(screen.getByTestId("MainHeader")).toBeInTheDocument();
    expect(screen.getByTestId("ElectionStatusIndicator")).toBeInTheDocument();
    expect(screen.getByTestId("HeroSection")).toHaveTextContent("true");

    expect(
      screen.getByTestId(`MiniFeatureSection-${featureCardConfig.expect.title}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`MiniFeatureSection-${featureCardConfig.features.title}`),
    ).toBeInTheDocument();

    expect(screen.getByTestId("TestimonialList")).toBeInTheDocument();
    expect(screen.getByTestId("IndustriesServed")).toBeInTheDocument();
    expect(screen.getByTestId("HelpSection")).toBeInTheDocument();
    expect(screen.getByTestId("MainFooter")).toBeInTheDocument();
  });

  it("dispatches fetchThenSetCurrentTimerStatus on mount", () => {
    const mockAction = { type: "mock/fetchThenSetCurrentTimerStatus" };
    fetchThenSetCurrentTimerStatus.mockReturnValue(mockAction);

    render(<HomePage />);
    expect(mockDispatch).toHaveBeenCalledWith(mockAction);
  });
});
