import useWindowSize from "./useWindowSize";

type Breakpoint = "mobile" | "tablet" | "desktop";

const getBreakpoint = (width: number): Breakpoint => {
  if (width <= 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

const useBreakpoint = (): Breakpoint => {
  const { width } = useWindowSize();

  return getBreakpoint(width);
};

export default useBreakpoint;
