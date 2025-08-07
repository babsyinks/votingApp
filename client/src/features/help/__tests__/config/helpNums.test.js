import helpNums from "features/help/config/helpNums";

describe("helpNums config", () => {
  it("should export an array of help numbers", () => {
    expect(Array.isArray(helpNums)).toBe(true);
    expect(helpNums.length).toBe(2);
  });

  it("should contain the correct phone numbers", () => {
    expect(helpNums).toEqual(["2348051750010", "2349154549010"]);
  });
});
