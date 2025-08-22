import { renderHook, act } from "@testing-library/react";
import { useToastMessage } from "hooks/useToastMessage";

jest.useFakeTimers();

describe("useToastMessage", () => {
  it("returns initial toast state", () => {
    const { result } = renderHook(() => useToastMessage());
    expect(result.current.toast).toEqual({ status: "", message: "" });
    expect(result.current.toastDetailsSet()).toBe(false);
  });

  it("triggers success toast with correct values", () => {
    const { result } = renderHook(() => useToastMessage());

    act(() => {
      result.current.triggerSuccessToast("Success message");
    });

    expect(result.current.toast).toEqual({
      status: "success",
      message: "Success message",
    });
    expect(result.current.toastDetailsSet()).toBe(true);
  });

  it("triggers failure toast with correct values", () => {
    const { result } = renderHook(() => useToastMessage());

    act(() => {
      result.current.triggerFailureToast("Error occurred");
    });

    expect(result.current.toast).toEqual({
      status: "failure",
      message: "Error occurred",
    });
    expect(result.current.toastDetailsSet()).toBe(true);
  });

  it("auto-clears the toast message after timeout", () => {
    const { result } = renderHook(() => useToastMessage(3000));

    act(() => {
      result.current.triggerSuccessToast("Will disappear");
    });

    expect(result.current.toast).toEqual({
      status: "success",
      message: "Will disappear",
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.toast).toEqual({
      status: "",
      message: "",
    });
    expect(result.current.toastDetailsSet()).toBe(false);
  });

  it("clears timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { result, unmount } = renderHook(() => useToastMessage());

    act(() => {
      result.current.triggerSuccessToast("Test");
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
