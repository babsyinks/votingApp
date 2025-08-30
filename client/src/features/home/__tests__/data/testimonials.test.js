import testimonials from "features/home/data/testimonials";

describe("testimonials config", () => {
  it("should export an array of testimonials", () => {
    expect(Array.isArray(testimonials)).toBe(true);
  });

  it("should contain 6 testimonials", () => {
    expect(testimonials).toHaveLength(6);
  });

  it("each testimonial should have quote and author", () => {
    testimonials.forEach((t) => {
      expect(t).toHaveProperty("quote");
      expect(typeof t.quote).toBe("string");
      expect(t.quote.length).toBeGreaterThan(0);

      expect(t).toHaveProperty("author");
      expect(typeof t.author).toBe("string");
      expect(t.author.length).toBeGreaterThan(0);
    });
  });

  it("should include known authors", () => {
    const authors = testimonials.map((t) => t.author);
    expect(authors).toContain("Victor Davidson, EGCOSA Secretary");
    expect(authors).toContain("LIC Cooperative Society");
  });
});
