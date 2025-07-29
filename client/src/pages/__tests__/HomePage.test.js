import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "pages/HomePage";
import { useSelector, useDispatch } from "react-redux";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";

jest.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: jest.fn(),
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

jest.mock("features/home/components/FeatureSection", () => ({
  __esModule: true,
  default: () => <div data-testid="FeatureSection" />,
}));

jest.mock("features/home/components/HelpSection", () => ({
  __esModule: true,
  default: () => <div data-testid="HelpSection" />,
}));

jest.mock("features/timer/timerSlice", () => ({
  fetchThenSetCurrentTimerStatus: jest.fn(() => ({
    type: "mock/fetchThenSetCurrentTimerStatus",
  })),
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
    expect(screen.getByTestId("ElectionStatusIndicator")).toBeInTheDocument();
    expect(screen.getByTestId("HeroSection")).toHaveTextContent("true");
    expect(screen.getByTestId("FeatureSection")).toBeInTheDocument();
    expect(screen.getByTestId("HelpSection")).toBeInTheDocument();
  });

  it("dispatches fetchThenSetCurrentTimerStatus on mount", () => {
    const mockAction = { type: "mock/fetchThenSetCurrentTimerStatus" };
    fetchThenSetCurrentTimerStatus.mockReturnValue(mockAction);

    render(<HomePage />);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "mock/fetchThenSetCurrentTimerStatus",
      }),
    );
  });
});
