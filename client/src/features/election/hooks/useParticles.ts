import { useCallback } from "react";
import { loadFull } from "tsparticles";
import type { Engine, Container } from "tsparticles-engine";

export const useParticles = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback((container: Container | undefined) => {
    return container;
  }, []);

  return { particlesInit, particlesLoaded };
};
