import { useState, useEffect } from "react";

const useWindowSize = () => {
  const getInitialDimension = () => {
    const windowState = typeof window !== "undefined";
    const defaultVal = 0;
    return {
      width: windowState ? window.innerWidth : defaultVal,
      height: windowState ? window.innerHeight : defaultVal,
    };
  };
  const [size, setSize] = useState(getInitialDimension());

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

export default useWindowSize;
