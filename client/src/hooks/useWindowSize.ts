import { useState, useEffect } from "react";

export interface WindowSize {
  width: number;
  height: number;
}

const useWindowSize = (): WindowSize => {
  const getSize = (): WindowSize => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [size, setSize] = useState<WindowSize>(getSize);

  useEffect(() => {
    const handleResize = () => {
      setSize(getSize());
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};

export default useWindowSize;
