import { renderHook } from "@testing-library/react";
import useResponsiveFontSize from "../../hooks/useResponsiveFontSize";

import useOrientation from "hooks/useOrientation";

jest.mock("hooks/useOrientation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("useResponsiveFontSize", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns portrait class when orientation is portrait", () => {
    useOrientation.mockReturnValue(true); // portrait

    const { result } = renderHook(() => useResponsiveFontSize("portrait-text", "landscape-text"));

    expect(result.current).toBe("portrait-text");
  });

  test("returns landscape class when orientation is landscape", () => {
    useOrientation.mockReturnValue(false); // landscape

    const { result } = renderHook(() => useResponsiveFontSize("portrait-text", "landscape-text"));

    expect(result.current).toBe("landscape-text");
  });

  test("returns default classes when no args are provided", () => {
    useOrientation.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveFontSize());

    expect(result.current).toBe("text-1p2vh");

    useOrientation.mockReturnValue(false);

    const { result: result2 } = renderHook(() => useResponsiveFontSize());

    expect(result2.current).toBe("text-1p2vw");
  });
});
