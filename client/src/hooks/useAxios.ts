import { useState, useRef, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";
import { useDispatch } from "react-redux";

interface ErrorState {
  message: string;
}

interface TriggerRequestArgs {
  params: AxiosRequestConfig;
  useDefaultJsonHeader?: boolean;
}

export interface UseAxiosReturn<T = any> {
  response: T | null;
  error: ErrorState | null;
  triggerRequest: (args: TriggerRequestArgs) => Promise<T | null>;
  clearError: () => void;
}

export const useAxios = <T = any>(): UseAxiosReturn<T> => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const dispatch = useDispatch();

  const cancelSourceRef = useRef<CancelTokenSource | null>(null);

  // Axios defaults
  (function setAxiosDefaults(defaults: Record<string, any>) {
    Object.keys(defaults).forEach((key) => {
      (axios.defaults as any)[key] = defaults[key];
    });
  })({
    withCredentials: true,
    // baseURL: "https://votingapp-pmev.onrender.com",
  });

  // Axios interceptors
  (function addResponseInterceptors() {
    axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err.config;

        // Don't retry if it's a login request or already retried or a refresh attempt
        const dontRetryList = ["/api/v1/auth/signin", "/api/v1/token/refresh"];
        if (
          err.response?.status === 401 &&
          !originalRequest._retry &&
          !dontRetryList.some((path: string) => originalRequest.url.includes(path))
        ) {
          (originalRequest as any)._retry = true;
          try {
            await axios.post("/api/v1/token/refresh");
            return axios(originalRequest); // retry once. We only want to retry once to prevent infinite retries.
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(err);
      }
    );
  })();

  /**
   * Handles API requests for the application using axios.
   */
  const triggerRequest = useCallback(
    async ({ params, useDefaultJsonHeader = true }: TriggerRequestArgs): Promise<T | null> => {
      initCancelToken();
      dispatch({ type: "loader/pending" });
      const axiosParams = getHeaders({ params, useDefaultJsonHeader });
      try {
        const result = await makeRequest(axiosParams);
        setResponse(result.data);
        setError(null);
        dispatch({ type: "loader/fulfilled" });
        return result.data;
      } catch (err: any) {
        handleErrorsByType(err);
        setResponse(null);
        return null;
      }
    },
     // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const initCancelToken = () => {
    // Cancel any previous request
    cancelExistingToken("Operation canceled due to new request.");
    // Create a new cancel token
    cancelSourceRef.current = axios.CancelToken.source();
  };

  const cancelExistingToken = (message: string) => {
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel(message);
    }
  };

  const getHeaders = ({ params, useDefaultJsonHeader }: TriggerRequestArgs["params"] & { useDefaultJsonHeader?: boolean }) => {
    let axiosHeaders: Partial<AxiosRequestConfig> = {};
    if (useDefaultJsonHeader) {
      // Set the most common headers used in the application so it is not set multiple times
      axiosHeaders = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
    }
    return { ...axiosHeaders, ...params };
  };

  const makeRequest = async (params: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    if (!cancelSourceRef.current) {
      throw new Error("Cancel token not initialized");
    }
    return axios.request<T>({
      cancelToken: cancelSourceRef.current.token,
      ...params,
    });
  };

  const handleErrorsByType = (err: any) => {
    if (axios.isCancel(err)) {
      console.warn("Request canceled:", err.message);
    } else {
      const message: string =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";
      setError({ message });
      dispatch({ type: "loader/rejected" });
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Cancel request on unmount
  useEffect(() => {
    return () => {
      cancelExistingToken("Component unmounted.");
    };
  }, []);

  return { response, error, triggerRequest, clearError };
};
