import params from "../../config/particlesConfig";

describe("particlesConfig", () => {
  it("should match the expected shape and values snapshot", () => {
    expect(params).toMatchSnapshot();
  });

  it("should have essential top-level keys", () => {
    expect(params).toHaveProperty("fps_limit", 60);
    expect(params).toHaveProperty("interactivity");
    expect(params).toHaveProperty("particles");
    expect(params).toHaveProperty("retina_detect", true);
  });

  it("should define hover repulse mode", () => {
    expect(params.interactivity.events.onhover.mode).toBe("repulse");
  });

  it("should set particles color to white", () => {
    expect(params.particles.color.value).toBe("#ffffff");
  });
});
