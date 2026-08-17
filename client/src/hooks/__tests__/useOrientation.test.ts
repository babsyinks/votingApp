import { renderHook, act } from "@testing-library/react";
import useOrientation from "hooks/useOrientation";
import { vi, type Mock } from "vitest";

describe("useOrientation", () => {
  let matchMediaMock: (matches?: boolean) => MediaQueryList & {
    addEventListener: Mock;
    removeEventListener: Mock;
  };

  beforeEach(() => {
    matchMediaMock = (matches: boolean = true) => {
      const mql: MediaQueryList & {
        addEventListener: Mock;
        removeEventListener: Mock;
      } = {
        matches,
        media: "(orientation: portrait)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      (window as any).matchMedia = vi.fn().mockReturnValue(mql);

      return mql;
    };
  });

  it("should return true if orientation is portrait", () => {
    matchMediaMock(true);
    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe(true);
  });

  it("should return false if orientation is landscape", () => {
    matchMediaMock(false);
    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe(false);
  });

  it("should update when orientation changes", () => {
    const mql = matchMediaMock(true);
    const { result } = renderHook(() => useOrientation());

    expect(result.current).toBe(true);

    act(() => {
      // simulate "change" event handler call
      const handler = mql.addEventListener.mock.calls[0][1] as (e: MediaQueryListEvent) => void;
      handler({ matches: false } as MediaQueryListEvent);
    });

    expect(result.current).toBe(false);
  });
});
