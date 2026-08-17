import { render, screen } from "@testing-library/react";
import MultiLayerWrapper from "layout/MultiLayerWrapper";
import useWindowSize from "hooks/useWindowSize";
import { vi } from "vitest";

vi.mock("hooks/useWindowSize");
const mockedUseWindowSize = vi.mocked(useWindowSize);

describe("MultiLayerWrapper", () => {
  const TestContent = () => <div>Wrapped content</div>;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children inside the inner Block", () => {
    mockedUseWindowSize.mockReturnValue({ width: 1024, height: 768 });

    render(
      <MultiLayerWrapper>
        <TestContent />
      </MultiLayerWrapper>
    );

    expect(screen.getByText("Wrapped content")).toBeInTheDocument();
  });

  it("applies padding class for small screens (width < 800)", () => {
    mockedUseWindowSize.mockReturnValue({ width: 600, height: 768 });

    render(
      <MultiLayerWrapper>
        <TestContent />
      </MultiLayerWrapper>
    );

    const outerBlock = screen.getByTestId("outer-block");
    expect(outerBlock).toHaveClass("p-2r");
  });

  it("does NOT apply padding class for large screens (width >= 800)", () => {
    mockedUseWindowSize.mockReturnValue({ width: 1200, height: 768 });

    render(
      <MultiLayerWrapper>
        <TestContent />
      </MultiLayerWrapper>
    );

    const outerBlock = screen.getByTestId("outer-block");
    expect(outerBlock).not.toHaveClass("p-2r");
  });

  it("applies correct class names to both Block layers", () => {
    mockedUseWindowSize.mockReturnValue({ width: 1024, height: 768 });

    render(
      <MultiLayerWrapper>
        <TestContent />
      </MultiLayerWrapper>
    );

    const outerBlock = screen.getByTestId("outer-block");
    const innerBlock = screen.getByTestId("inner-block");

    expect(outerBlock).toHaveClass("mnh-100vh");
    expect(innerBlock).toHaveClass("bg-white-transparent");
    expect(innerBlock).toHaveClass("border-rounded-16");
    expect(innerBlock).toHaveClass("p-2r");
    expect(innerBlock).toHaveClass("mxw-600");
    expect(innerBlock).toHaveClass("ta-center");
    expect(innerBlock).toHaveClass("fadeIn");
  });
});
