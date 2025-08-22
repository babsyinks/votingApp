import { useCallback } from "react";
import { loadFull } from "tsparticles";

export const useParticles = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback((container) => {
    return container;
  }, []);

  return { particlesInit, particlesLoaded };
};
