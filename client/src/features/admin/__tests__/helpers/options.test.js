import getOptions from "features/admin/helpers/options";

describe("getOptions", () => {
  it("returns an array of positions with correct label/value pairs", () => {
    const result = getOptions();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(11);

    expect(result[0]).toEqual({
      optionLabel: "President",
      optionValue: "president",
    });

    expect(result[1]).toEqual({
      optionLabel: "Vice President",
      optionValue: "vice president",
    });

    expect(result[2]).toEqual({
      optionLabel: "General Secretary",
      optionValue: "general secretary",
    });

    expect(result[3]).toEqual({
      optionLabel: "Assistant General Secretary",
      optionValue: "assistant general secretary",
    });

    expect(result[4]).toEqual({
      optionLabel: "National Treasurer",
      optionValue: "national treasurer",
    });

    expect(result[5]).toEqual({
      optionLabel: "National Financial Secretary",
      optionValue: "national financial secretary",
    });

    expect(result[6]).toEqual({
      optionLabel: "National Social Welfare Officer",
      optionValue: "national social welfare officer",
    });

    expect(result[7]).toEqual({
      optionLabel: "National Public Relations Officer",
      optionValue: "national public relations officer",
    });

    expect(result[8]).toEqual({
      optionLabel: "National Legal Adviser",
      optionValue: "national legal adviser",
    });

    expect(result[9]).toEqual({
      optionLabel: "National Internal Auditor",
      optionValue: "national internal auditor",
    });

    expect(result[10]).toEqual({
      optionLabel: "Chief Whip",
      optionValue: "chief whip",
    });
  });

  it("each item has string label and value", () => {
    const result = getOptions();
    result.forEach((item) => {
      expect(typeof item.optionLabel).toBe("string");
      expect(typeof item.optionValue).toBe("string");
      expect(item.optionValue).toBe(item.optionLabel.toLowerCase());
    });
  });
});
