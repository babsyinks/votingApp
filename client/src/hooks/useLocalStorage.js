import { useState, useEffect } from "react";

export function useAddToLocalStorage(key, initialValue = "") {
  const [token, setToken] = useState(() => {
    return getItem(key, initialValue);
  });

  useEffect(() => {
    if (token) {
      setItem(key, token);
    } else {
    }
  }, [key, token]);

  return { token, setToken };
}

export function useRemoveFromLocalStorage(key) {
  const [removeToken, setRemoveToken] = useState(false);

  useEffect(() => {
    if (removeToken) {
      removeItem(key);
    }
  }, [key, removeToken]);

  return { removeToken, setRemoveToken };
}

const getItem = (key, initialValue) => {
  try {
    return localStorage.getItem(key) || initialValue;
  } catch (error) {
    console.error(error.message);
    return initialValue;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(error.message);
  }
};

const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log(error.message);
  }
};
