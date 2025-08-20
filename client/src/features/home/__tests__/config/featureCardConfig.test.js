import React from "react";
import items from "features/home/config/featureCardConfig";

describe("featureCardConfig", () => {
  it("should export an object with 'expect' and 'features'", () => {
    expect(items).toHaveProperty("expect");
    expect(items).toHaveProperty("features");
  });

  it("each section should have a title and contents array", () => {
    Object.values(items).forEach((section) => {
      expect(typeof section.title).toBe("string");
      expect(Array.isArray(section.contents)).toBe(true);
      expect(section.contents.length).toBeGreaterThan(0);
    });
  });

  it("each content item should have id, icon, title, and description", () => {
    Object.values(items).forEach((section) => {
      section.contents.forEach((item) => {
        expect(typeof item.id).toBe("string");
        expect(item.id.length).toBeGreaterThan(0);

        const Icon = item.icon;
        expect(Icon).toBeTruthy();
        expect(React.isValidElement(<Icon />)).toBe(true);

        expect(typeof item.title).toBe("string");
        expect(item.title.length).toBeGreaterThan(0);
        expect(typeof item.description).toBe("string");
        expect(item.description.length).toBeGreaterThan(0);
      });
    });
  });

  it("should generate unique ids for each content item", () => {
    const allIds = [
      ...items.expect.contents.map((c) => c.id),
      ...items.features.contents.map((c) => c.id),
    ];
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
