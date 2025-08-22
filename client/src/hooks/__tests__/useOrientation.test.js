import { renderHook, act } from "@testing-library/react";
import useOrientation from "hooks/useOrientation";

describe("useOrientation", () => {
  let matchMediaMock;

  beforeEach(() => {
    matchMediaMock = (matches = true) => {
      const mql = {
        matches,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      window.matchMedia = jest.fn().mockReturnValue(mql);
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
      // simulate event
      mql.addEventListener.mock.calls[0][1]({ matches: false });
    });

    expect(result.current).toBe(false);
  });
});
