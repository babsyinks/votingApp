import { renderHook, act } from "@testing-library/react";
import useWindowSize from "hooks/useWindowSize";
import { vi } from "vitest";

vi.useFakeTimers();

describe("useWindowSize", () => {
  const setWindowSize = (width: number, height: number) => {
    window.innerWidth = width;
    window.innerHeight = height;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
  };

  beforeEach(() => {
    setWindowSize(1024, 768);
  });

  it("should return the current window dimensions on mount", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({ width: 1024, height: 768 });
  });

  it("should update dimensions when window is resized", () => {
    const { result } = renderHook(() => useWindowSize());

    setWindowSize(1440, 900);

    expect(result.current).toEqual({ width: 1440, height: 900 });
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useWindowSize());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
  });
});
