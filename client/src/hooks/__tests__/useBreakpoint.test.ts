import { renderHook } from "@testing-library/react";
import useBreakpoint from "hooks/useBreakpoint";
import useWindowSize from "hooks/useWindowSize";

jest.mock("hooks/useWindowSize");

describe("useBreakpoint", () => {
  const mockedUseWindowSize = useWindowSize as jest.Mock;
  it('returns "mobile" when width is 640 or less', () => {
    mockedUseWindowSize.mockReturnValue({ width: 480 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("mobile");

    mockedUseWindowSize.mockReturnValue({ width: 640 });
    const { result: result2 } = renderHook(() => useBreakpoint());
    expect(result2.current).toBe("mobile");
  });

  it('returns "tablet" when width is between 641 and 1023', () => {
    mockedUseWindowSize.mockReturnValue({ width: 800 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("tablet");

    mockedUseWindowSize.mockReturnValue({ width: 1023 });
    const { result: result2 } = renderHook(() => useBreakpoint());
    expect(result2.current).toBe("tablet");
  });

  it('returns "desktop" when width is 1024 or more', () => {
    mockedUseWindowSize.mockReturnValue({ width: 1024 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("desktop");

    mockedUseWindowSize.mockReturnValue({ width: 1440 });
    const { result: result2 } = renderHook(() => useBreakpoint());
    expect(result2.current).toBe("desktop");
  });

  it('handles undefined width gracefully (defaults to "desktop")', () => {
    mockedUseWindowSize.mockReturnValue({ width: undefined });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("desktop"); // because undefined >= 1024 is false, so fallback to default branch
  });
});
