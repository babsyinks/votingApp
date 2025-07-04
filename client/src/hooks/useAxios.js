import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

export const useAxios = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const cancelSourceRef = useRef(null);

  (function setAxiosDefaults(defaults) {
    Object.keys(defaults).forEach((key) => {
      axios.defaults[key] = defaults[key];
    });
  })({
    withCredentials: true,
    // baseURL: "https://votingapp-pmev.onrender.com",
  });

  (function addResponseInterceptors() {
    axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err.config;
        if (
          err.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/token/refresh")
        ) {
          originalRequest._retry = true;
          try {
            await axios.post("/token/refresh");
            return axios(originalRequest); // retry once. We only want to retry once to prevent infinite retries.
          } catch (refreshError) {
            return Promise.reject(refreshError); // still unauthorized, don't retry
          }
        }

        return Promise.reject(err);
      },
    );
  })();

  /**
   * Handles api requests for the application using axios.
   *
   * @param {Object} param The object containing request configurations
   * @param {Object} param.params This contains the parameters for making the request for example method, url,
   * data, etc.
   * @param {Boolean} param.useDefaultJsonHeader This determines if the default header configuration which is
   * set in this method should be used or not.
   * @returns
   */
  const triggerRequest = useCallback(
    async ({ params, useDefaultJsonHeader = true }) => {
      initCancelToken();
      dispatch({ type: "loader/pending" });
      const axiosParams = getHeaders({ params, useDefaultJsonHeader });
      try {
        const result = await makeRequest(axiosParams);
        setResponse(result.data);
        setError(null);
        dispatch({ type: "loader/fulfilled" });
        return result.data;
      } catch (err) {
        handleErrorsByType(err);
        setResponse(null);
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  const initCancelToken = () => {
    // Cancel any previous request
    cancelExistingToken("Operation canceled due to new request.");
    // Create a new cancel token
    cancelSourceRef.current = axios.CancelToken.source();
  };

  const cancelExistingToken = (message) => {
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel(message);
    }
  };

  const getHeaders = ({ params, useDefaultJsonHeader }) => {
    let axiosHeaders = {};
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

  const makeRequest = async (params) => {
    const result = await axios.request({
      cancelToken: cancelSourceRef.current.token,
      ...params,
    });
    return result;
  };

  const handleErrorsByType = (err) => {
    if (axios.isCancel(err)) {
      console.warn("Request canceled:", err.message);
    } else {
      const message =
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
