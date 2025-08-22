import { renderHook, act } from "@testing-library/react";
import { useAxios } from "hooks/useAxios";
import axios from "axios";
import { useDispatch } from "react-redux";

jest.mock("axios");
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("useAxios hook", () => {
  let dispatchMock;
  let cancelMock;
  let interceptorSuccessFn;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    cancelMock = jest.fn();
    axios.CancelToken.source = jest.fn(() => ({
      token: "mockToken",
      cancel: cancelMock,
    }));

    axios.interceptors.response.use.mockImplementation((success, error) => {
      interceptorSuccessFn = success;
      return 123;
    });

    axios.isCancel = jest.fn(() => false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("performs a successful request and sets response", async () => {
    const responseData = { success: true };
    axios.request.mockResolvedValueOnce({ data: responseData });

    const { result } = renderHook(() => useAxios());

    await act(async () => {
      const data = await result.current.triggerRequest({
        params: { url: "/test", method: "GET" },
        useDefaultJsonHeader: false,
      });
      expect(data).toEqual(responseData);
    });

    expect(dispatchMock).toHaveBeenCalledWith({ type: "loader/pending" });
    expect(dispatchMock).toHaveBeenCalledWith({ type: "loader/fulfilled" });
    expect(result.current.response).toEqual(responseData);
    expect(result.current.error).toBe(null);
  });

  it("interceptor success function returns response unchanged", async () => {
    const dummyResponse = { data: { message: "ok" } };

    const result = interceptorSuccessFn(dummyResponse);

    expect(result).toBe(dummyResponse);
  });

  it("handles rejection of request", async () => {
    const originalRequest = {
      url: "/api/v1/some-error",
      method: "GET",
    };

    const errorObject = {
      config: originalRequest,
      response: { status: 500 },
    };

    let interceptorReject;

    axios.CancelToken.source.mockReturnValue({
      token: "mockToken",
      cancel: jest.fn(),
    });

    axios.interceptors.response.use.mockImplementation((success, error) => {
      interceptorReject = error;
      return () => {};
    });

    renderHook(() => useAxios());

    await act(async () => {
      try {
        await interceptorReject(errorObject);
      } catch (err) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err).toBe(errorObject);
      }
    });
  });

  it("covers failed refresh in response interceptor", async () => {
    const originalRequest = {
      url: "/api/v1/protected",
      method: "GET",
      _retry: false,
    };

    const refreshError = new Error("Refresh failed");

    axios.CancelToken.source.mockReturnValue({
      token: "mockToken",
      cancel: jest.fn(),
    });

    axios.request.mockRejectedValueOnce({
      config: originalRequest,
      response: { status: 401 },
    });

    axios.post.mockRejectedValueOnce(refreshError); // Refresh token fails

    let interceptorReject;
    axios.interceptors.response.use.mockImplementation((success, error) => {
      interceptorReject = error;
      return () => {}; // just stubbed
    });

    renderHook(() => useAxios());

    await act(async () => {
      try {
        await interceptorReject({
          config: originalRequest,
          response: { status: 401 },
        });
      } catch (err) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err).toBe(refreshError);
      }
    });

    expect(axios.post).toHaveBeenCalledWith("/api/v1/token/refresh");
  });

  it("handles a non-cancelled error and sets error message", async () => {
    const errorMessage = "Something went wrong";
    axios.request.mockRejectedValueOnce({
      message: errorMessage,
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useAxios());

    await act(async () => {
      const data = await result.current.triggerRequest({
        params: { url: "/error", method: "GET" },
      });
      expect(data).toBe(null);
    });

    expect(dispatchMock).toHaveBeenCalledWith({ type: "loader/pending" });
    expect(dispatchMock).toHaveBeenCalledWith({ type: "loader/rejected" });
    expect(result.current.error).toEqual({ message: errorMessage });
    expect(result.current.response).toBe(null);
  });

  it("handles a cancelled request without setting error", async () => {
    const cancelError = { message: "Cancelled!", __CANCEL__: true };
    axios.isCancel.mockReturnValueOnce(true);
    axios.request.mockRejectedValueOnce(cancelError);

    const { result } = renderHook(() => useAxios());

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await act(async () => {
      await result.current.triggerRequest({
        params: { url: "/cancel", method: "GET" },
      });
    });

    expect(console.warn).toHaveBeenCalledWith("Request canceled:", "Cancelled!");
    expect(dispatchMock).toHaveBeenCalledWith({ type: "loader/pending" });
    expect(dispatchMock).not.toHaveBeenCalledWith({ type: "loader/rejected" });
    expect(result.current.error).toBe(null);
    expect(result.current.response).toBe(null);

    warnSpy.mockRestore();
  });

  it("clears error when clearError is called", async () => {
    axios.request.mockRejectedValueOnce({
      message: "Error",
      response: { data: { message: "Error" } },
    });

    const { result } = renderHook(() => useAxios());

    await act(async () => {
      await result.current.triggerRequest({
        params: { url: "/error", method: "GET" },
      });
    });

    expect(result.current.error).toEqual({ message: "Error" });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it("cancels request on unmount", async () => {
    axios.request.mockResolvedValueOnce({ data: { message: "ok" } });

    const { result, unmount } = renderHook(() => useAxios());

    await act(async () => {
      await result.current.triggerRequest({
        params: { url: "/test", method: "GET" },
      });
    });

    unmount();

    expect(cancelMock).toHaveBeenCalledWith("Component unmounted.");
  });

  it("registers response interceptor on mount", () => {
    const mockUse = jest.fn();
    axios.interceptors.response.use = mockUse;

    renderHook(() => useAxios());

    expect(mockUse).toHaveBeenCalledTimes(1);
    const [successFn, errorFn] = mockUse.mock.calls[0];

    expect(typeof successFn).toBe("function");
    expect(typeof errorFn).toBe("function");
  });

  it("sets up CancelToken and response interceptor after a request", async () => {
    const { result } = renderHook(() => useAxios());

    await act(async () => {
      await result.current.triggerRequest({
        params: { url: "/something", method: "GET" },
      });
    });

    expect(axios.CancelToken.source).toHaveBeenCalled();
    expect(axios.interceptors.response.use).toHaveBeenCalled();
  });

  it("retries once on 401 with refresh token and succeeds", async () => {
    const originalRequest = {
      url: "/api/v1/user",
      method: "GET",
    };

    const firstError = {
      config: originalRequest,
      response: { status: 401 },
    };

    const retriedResponse = { data: { user: "retried" } };

    // 1. First call to axios.request will simulate a 401
    axios.request.mockRejectedValueOnce(firstError);

    // 2. axios.post for token refresh will succeed
    axios.post.mockResolvedValueOnce({});

    // 3. axios (function call used for retry) must also return success
    const axiosMock = axios;
    axiosMock.mockResolvedValueOnce(retriedResponse); // axios(originalRequest)

    let interceptorReject;
    axios.interceptors.response.use.mockImplementation((success, error) => {
      interceptorReject = error;
    });

    const { result } = renderHook(() => useAxios());

    // First call triggers request + sets up interceptor
    await act(async () => {
      await result.current.triggerRequest({
        params: originalRequest,
      });
    });

    // Simulate Axios invoking the response interceptor with a 401
    let retryResult;
    await act(async () => {
      retryResult = await interceptorReject({
        config: { ...originalRequest },
        response: { status: 401 },
      });
    });

    expect(retryResult.data).toEqual({ user: "retried" });
    expect(axios.post).toHaveBeenCalledWith("/api/v1/token/refresh");
    expect(axios.request).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledTimes(1); // The retry via axios(originalRequest)
  });

  it("does not retry on 401 for excluded paths like /signin", async () => {
    const originalRequest = { url: "/api/v1/auth/signin", method: "POST" };
    const error401 = {
      config: originalRequest,
      response: { status: 401 },
    };

    axios.request.mockRejectedValueOnce(error401);

    const { result } = renderHook(() => useAxios());

    await act(async () => {
      const data = await result.current.triggerRequest({
        params: { url: "/api/v1/auth/signin", method: "POST" },
      });
      expect(data).toBe(null);
    });

    expect(axios.post).not.toHaveBeenCalled();
    expect(axios.request).toHaveBeenCalledTimes(1);
  });
});
