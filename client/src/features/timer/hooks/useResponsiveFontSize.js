import useOrientation from "../../../hooks/useOrientation";

function useResponsiveFontSize(
  portraitClass = "text-1p2vh",
  landscapeClass = "text-1p2vw",
) {
  const isPortrait = useOrientation();
  return isPortrait ? portraitClass : landscapeClass;
}

export default useResponsiveFontSize;
