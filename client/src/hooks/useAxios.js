import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useAddToLocalStorage } from "./useLocalStorage";

// axios.defaults.baseURL = 'https://votingapp-pmev.onrender.com';

export const useAxios = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [token] = useAddToLocalStorage("token");

  const cancelSourceRef = useRef(null);

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
    [dispatch, token],
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
    if (token) {
      addTokenHeader(axiosHeaders);
    }
    return { ...axiosHeaders, ...params };
  };

  const addTokenHeader = (axiosHeaders) => {
    if (!axiosHeaders.headers) {
      axiosHeaders.headers = {};
    }
    axiosHeaders.headers["X-Auth-Token"] = token;
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
      setError(err);
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
