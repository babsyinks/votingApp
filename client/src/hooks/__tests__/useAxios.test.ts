import { renderHook, act } from "@testing-library/react";
import { useAxios } from "hooks/useAxios";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { CancelTokenSource, Method } from "axios";

jest.mock("axios");
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useAxios hook", () => {
  let dispatchMock: jest.Mock;
  let cancelMock: jest.Mock;
  let interceptorSuccessFn: (res: { data: { message: string } }) => any;
  let interceptorReject: (err: any) => any;
  let useResponseMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);

    cancelMock = jest.fn();
    mockedAxios.CancelToken.source = jest.fn(
      () =>
        ({
          token: "mockToken",
          cancel: cancelMock,
        }) as unknown as CancelTokenSource,
    );

    useResponseMock = mockedAxios.interceptors.response.use as jest.Mock;

    useResponseMock.mockImplementation((success, error) => {
      interceptorSuccessFn = success;
      interceptorReject = error;
      return 123;
    });

    mockedAxios.isCancel = jest.fn((_value?: any) => false) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("performs a successful request and sets response", async () => {
    const responseData = { success: true };
    mockedAxios.request.mockResolvedValueOnce({ data: responseData });

    const { result } = renderHook(() => useAxios());

    await act(async () => {
      const data = await result.current.triggerRequest({
        params: { url: "/test", method: "get" },
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
      method: "get",
    };

    const errorObject = {
      config: originalRequest,
      response: { status: 500 },
    };

    (mockedAxios.CancelToken.source as jest.Mock).mockReturnValue({
      token: "mockToken",
      cancel: jest.fn(),
    });

    useResponseMock.mockImplementation((success, error) => {
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
      method: "get",
      _retry: false,
    };

    const refreshError = new Error("Refresh failed");

    (mockedAxios.CancelToken.source as jest.Mock).mockReturnValue({
      token: "mockToken",
      cancel: jest.fn(),
    });

    mockedAxios.request.mockRejectedValueOnce({
      config: originalRequest,
      response: { status: 401 },
    });

    mockedAxios.post.mockRejectedValueOnce(refreshError); // Refresh token fails

    useResponseMock.mockImplementation((success, error) => {
      interceptorReject = error;
      return () => {};
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

    expect(mockedAxios.post).toHaveBeenCalledWith("/api/v1/token/refresh");
  });

  it("handles a non-cancelled error and sets error message", async () => {
    const errorMessage = "Something went wrong";
    mockedAxios.request.mockRejectedValueOnce({
      message: errorMessage,
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useAxios());

    await act(async () => {
      const data = await result.current.triggerRequest({
        params: { url: "/error", method: "get" },
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
    mockedAxios.isCancel.mockReturnValueOnce(true);
    mockedAxios.request.mockRejectedValueOnce(cancelError);

    const { result } = renderHook(() => useAxios());

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await act(async () => {
      await result.current.triggerRequest({
        params: { url: "/cancel", method: "get" },
      });
    });

    expect(console.warn).toHaveBeenCalledWith(
      "Request canceled:",
      "Cancelled!",
    );
    expect(dispatchMock).toHaveBeenCalledWith({ type: "loader/pending" });
    expect(dispatchMock).not.toHaveBeenCalledWith({ type: "loader/rejected" });
    expect(result.current.error).toBe(null);
    expect(result.current.response).toBe(null);

    warnSpy.mockRestore();
  });

  it("clears error when clearError is called", async () => {
    mockedAxios.request.mockRejectedValueOnce({
      message: "Error",
      response: { data: { message: "Error" } },
    });

    const { result } = renderHook(() => useAxios());

    await act(async () => {
      await result.current.triggerRequest({
        params: { url: "/error", method: "get" },
      });
    });

    expect(result.current.error).toEqual({ message: "Error" });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it("cancels request on unmount", async () => {
    mockedAxios.request.mockResolvedValueOnce({ data: { message: "ok" } });

    const { result, unmount } = renderHook(() => useAxios());

    await act(async () => {
      await result.current.triggerRequest({
        params: { url: "/test", method: "get" },
      });
    });

    unmount();

    expect(cancelMock).toHaveBeenCalledWith("Component unmounted.");
  });

  it("registers response interceptor on mount", () => {
    const mockUse = jest.fn();
    mockedAxios.interceptors.response.use = mockUse;

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
        params: { url: "/something", method: "get" },
      });
    });

    expect(mockedAxios.CancelToken.source).toHaveBeenCalled();
    expect(useResponseMock).toHaveBeenCalled();
  });

  it("retries once on 401 with refresh token and succeeds", async () => {
    const originalRequest: { url: string; method: Method } = {
      url: "/api/v1/user",
      method: "get",
    };

    const firstError = {
      config: originalRequest,
      response: { status: 401 },
    };

    const retriedResponse = {
      data: { user: "retried" },
      status: 200,
      statusText: "ok",
      headers: {},
      config: originalRequest,
    };
    function asMock<T extends (...args: any[]) => any>(fn: T) {
      return fn as unknown as jest.Mock<ReturnType<T>, Parameters<T>>;
    }
    // 1. First call to mockedAxios.request will simulate a 401
    mockedAxios.request.mockRejectedValueOnce(firstError);

    // 2. mockedAxios.post for token refresh will succeed
    mockedAxios.post.mockResolvedValueOnce({});

    // 3. axios (function call used for retry) must also return success
    asMock(axios).mockResolvedValueOnce(retriedResponse); // axios(originalRequest)

    useResponseMock.mockImplementation((success, error) => {
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
    let retryResult!: { data: { user: string } };
    await act(async () => {
      retryResult = await interceptorReject({
        config: { ...originalRequest },
        response: { status: 401 },
      });
    });

    expect(retryResult.data).toEqual({ user: "retried" });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/v1/token/refresh");
    expect(mockedAxios.request).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledTimes(1); // The retry via axios(originalRequest)
  });

  it("does not retry on 401 for excluded paths like /signin", async () => {
    const originalRequest = { url: "/api/v1/auth/signin", method: "POST" };
    const error401 = {
      config: originalRequest,
      response: { status: 401 },
    };

    mockedAxios.request.mockRejectedValueOnce(error401);

    const { result } = renderHook(() => useAxios());

    await act(async () => {
      const data = await result.current.triggerRequest({
        params: { url: "/api/v1/auth/signin", method: "POST" },
      });
      expect(data).toBe(null);
    });

    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(mockedAxios.request).toHaveBeenCalledTimes(1);
  });

it("covers 'Cancel token not initialized' path when CancelToken.source returns undefined", async () => {
  // make CancelToken.source return undefined for this test run
  // cast to jest.Mock so ts accepts mockReturnValueOnce
  (mockedAxios.CancelToken.source as jest.Mock).mockReturnValueOnce(undefined);

  const { result } = renderHook(() => useAxios());

  await act(async () => {
    // triggerRequest will call initCancelToken which will set cancelSourceRef.current = undefined,
    // then makeRequest will throw; triggerRequest catches it and returns null
    const data = await result.current.triggerRequest({
      params: { url: "/no-token", method: "get" },
    });
    expect(data).toBeNull();
  });
 
  expect(result.current.error).toEqual({ message: "Cancel token not initialized" });

  expect(dispatchMock).toHaveBeenCalledWith({ type: "loader/pending" });
  expect(dispatchMock).toHaveBeenCalledWith({ type: "loader/rejected" });
});
});
