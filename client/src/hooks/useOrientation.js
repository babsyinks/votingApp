import { useEffect, useState } from "react";

export default function useOrientation() {
  const getOrientation = () => window.matchMedia("(orientation: portrait)");
  const [isPortrait, setIsPortrait] = useState(getOrientation().matches);

  useEffect(() => {
    const mql = getOrientation();
    const handler = (e) => setIsPortrait(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isPortrait;
}
