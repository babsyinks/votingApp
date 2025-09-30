import { useEffect, useState } from "react";

export default function useOrientation(): boolean {
  const getOrientation = (): MediaQueryList =>
    window.matchMedia("(orientation: portrait)");

  const [isPortrait, setIsPortrait] = useState<boolean>(
    getOrientation().matches
  );

  useEffect(() => {
    const mql = getOrientation();
    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches);

    mql.addEventListener("change", handler);
    return () => {
      mql.removeEventListener("change", handler);
    };
  }, []);

  return isPortrait;
}
