/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen } from "@testing-library/react";
import MultiLayerWrapper from "layout/MultiLayerWrapper";
import useWindowSize from "hooks/useWindowSize";

jest.mock("hooks/useWindowSize");

describe("MultiLayerWrapper", () => {
  const TestContent = () => <div>Wrapped content</div>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders children inside the inner Block", () => {
    useWindowSize.mockReturnValue({ width: 1024, height: 768 });

    render(
      <MultiLayerWrapper>
        <TestContent />
      </MultiLayerWrapper>
    );

    expect(screen.getByText("Wrapped content")).toBeInTheDocument();
  });

  it("applies padding class for small screens (width < 800)", () => {
    useWindowSize.mockReturnValue({ width: 600, height: 768 });

    const { container } = render(
      <MultiLayerWrapper>
        <TestContent />
      </MultiLayerWrapper>
    );

    const outerBlock = container.firstChild;
    expect(outerBlock.className).toMatch(/p-2r/);
  });

  it("does NOT apply padding class for large screens (width >= 800)", () => {
    useWindowSize.mockReturnValue({ width: 1200, height: 768 });

    const { container } = render(
      <MultiLayerWrapper>
        <TestContent />
      </MultiLayerWrapper>
    );

    const outerBlock = container.firstChild;
    expect(outerBlock.className).not.toMatch(/p-2r/);
  });

  it("applies correct class names to both Block layers", () => {
    useWindowSize.mockReturnValue({ width: 1024, height: 768 });

    const { container } = render(
      <MultiLayerWrapper>
        <TestContent />
      </MultiLayerWrapper>
    );

    const outerBlock = container.firstChild;
    const innerBlock = outerBlock.firstChild;

    expect(outerBlock.className).toContain("mnh-100vh");
    expect(innerBlock.className).toContain("bg-white-transparent");
    expect(innerBlock.className).toContain("border-rounded-16");
    expect(innerBlock.className).toContain("p-2r");
    expect(innerBlock.className).toContain("mxw-600");
    expect(innerBlock.className).toContain("ta-center");
    expect(innerBlock.className).toContain("fadeIn");
  });
});
