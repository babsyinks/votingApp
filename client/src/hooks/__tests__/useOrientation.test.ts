import { renderHook, act } from "@testing-library/react";
import useOrientation from "hooks/useOrientation";

describe("useOrientation", () => {
  let matchMediaMock: (matches?: boolean) => MediaQueryList & {
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  beforeEach(() => {
    matchMediaMock = (matches: boolean = true) => {
      const mql: MediaQueryList & {
        addEventListener: jest.Mock;
        removeEventListener: jest.Mock;
      } = {
        matches,
        media: "(orientation: portrait)",
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };

      (window as any).matchMedia = jest.fn().mockReturnValue(mql);

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
