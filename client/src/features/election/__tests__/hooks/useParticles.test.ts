import { renderHook } from "@testing-library/react";
import { useParticles } from "../../hooks/useParticles";
import { loadFull } from "tsparticles";
import type { Engine, Container } from "tsparticles-engine";
import { vi } from "vitest";

vi.mock("tsparticles", () => ({
  loadFull: vi.fn(),
}));

describe("useParticles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns particlesInit and particlesLoaded functions", () => {
    const { result } = renderHook(() => useParticles());
    expect(typeof result.current.particlesInit).toBe("function");
    expect(typeof result.current.particlesLoaded).toBe("function");
  });

  it("calls loadFull when particlesInit is invoked", async () => {
    const mockEngine = {} as unknown as Engine;;
    const { result } = renderHook(() => useParticles());

    await result.current.particlesInit(mockEngine);

    expect(loadFull).toHaveBeenCalledWith(mockEngine);
  });

  it("returns the container when particlesLoaded is called", () => {
    const mockContainer = { canvas: {} } as unknown as Container;
    const { result } = renderHook(() => useParticles());

    const returned = result.current.particlesLoaded(mockContainer);

    expect(returned).toBe(mockContainer);
  });
});
