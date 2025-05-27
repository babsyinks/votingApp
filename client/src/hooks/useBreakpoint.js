import { useState, useEffect } from "react";

const getBreakpoint = (width) => {
  if (width <= 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      const current = getBreakpoint(window.innerWidth);
      setBreakpoint(current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};

export default useBreakpoint;
