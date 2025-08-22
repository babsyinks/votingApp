import useWindowSize from "./useWindowSize";

const getBreakpoint = (width) => {
  if (width <= 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const useBreakpoint = () => {
  const { width } = useWindowSize();
  return getBreakpoint(width);
};

export default useBreakpoint;
