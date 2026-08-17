import { renderHook } from "@testing-library/react";
import useResponsiveFontSize from "../../hooks/useResponsiveFontSize";

import useOrientation from "hooks/useOrientation";
import { vi } from "vitest";

vi.mock("hooks/useOrientation", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("useResponsiveFontSize", () => {
  let mockUseOrientation = vi.mocked(useOrientation);
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns portrait class when orientation is portrait", () => {
    mockUseOrientation.mockReturnValue(true); // portrait

    const { result } = renderHook(() => useResponsiveFontSize("portrait-text", "landscape-text"));

    expect(result.current).toBe("portrait-text");
  });

  test("returns landscape class when orientation is landscape", () => {
    mockUseOrientation.mockReturnValue(false); // landscape

    const { result } = renderHook(() => useResponsiveFontSize("portrait-text", "landscape-text"));

    expect(result.current).toBe("landscape-text");
  });

  test("returns default classes when no args are provided", () => {
    mockUseOrientation.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveFontSize());

    expect(result.current).toBe("text-1p2vh");

    mockUseOrientation.mockReturnValue(false);

    const { result: result2 } = renderHook(() => useResponsiveFontSize());

    expect(result2.current).toBe("text-1p2vw");
  });
});
