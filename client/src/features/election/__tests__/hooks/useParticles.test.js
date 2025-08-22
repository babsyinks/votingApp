import { renderHook } from "@testing-library/react";
import { useParticles } from "../../hooks/useParticles";
import { loadFull } from "tsparticles";

jest.mock("tsparticles", () => ({
  loadFull: jest.fn(),
}));

describe("useParticles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns particlesInit and particlesLoaded functions", () => {
    const { result } = renderHook(() => useParticles());
    expect(typeof result.current.particlesInit).toBe("function");
    expect(typeof result.current.particlesLoaded).toBe("function");
  });

  it("calls loadFull when particlesInit is invoked", async () => {
    const mockEngine = {};
    const { result } = renderHook(() => useParticles());

    await result.current.particlesInit(mockEngine);

    expect(loadFull).toHaveBeenCalledWith(mockEngine);
  });

  it("returns the container when particlesLoaded is called", () => {
    const mockContainer = { canvas: {} };
    const { result } = renderHook(() => useParticles());

    const returned = result.current.particlesLoaded(mockContainer);

    expect(returned).toBe(mockContainer);
  });
});
