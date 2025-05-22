import { useState, useEffect } from "react";

export function useAddToLocalStorage(key, initialValue = "") {
  const [value, setValue] = useState(() => {
    return getItem(key, initialValue);
  });

  useEffect(() => {
    if (value) {
      setItem(key, value);
    } else {
    }
  }, [key, value]);

  return [value, setValue];
}

export function useRemoveFromLocalStorage(key) {
  const [removeValue, setRemoveValue] = useState(false);

  useEffect(() => {
    if (removeValue) {
      removeItem(key);
    }
  }, [key, removeValue]);

  return [removeValue, setRemoveValue];
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
