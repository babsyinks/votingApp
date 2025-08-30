import timerLabelsWithTypes from "../../data/timerLabelsWithTypes";

describe("timerLabelsWithTypes", () => {
  test("should contain 4 configuration items", () => {
    expect(timerLabelsWithTypes).toHaveLength(4);
  });

  test("should contain correct labels and types", () => {
    expect(timerLabelsWithTypes).toEqual([
      { label: "Election Start Day", type: "date" },
      { label: "Election Start Time", type: "time" },
      { label: "Election End Day", type: "date" },
      { label: "Election End Time", type: "time" },
    ]);
  });

  test("all config items should have a label and type", () => {
    timerLabelsWithTypes.forEach((item) => {
      expect(item).toHaveProperty("label");
      expect(typeof item.label).toBe("string");

      expect(item).toHaveProperty("type");
      expect(["date", "time"]).toContain(item.type);
    });
  });
});
