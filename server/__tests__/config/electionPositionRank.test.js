const ranks = require("../../config/electionPositionRank");

describe("Election Position Rank config", () => {
  it("should export an object with expected positions and ranks", () => {
    expect(ranks).toEqual({
      president: 0,
      "vice president": 1,
      "general secretary": 2,
      "assistant general secretary": 3,
      "national treasurer": 4,
      "national financial secretary": 5,
      "national social welfare officer": 6,
      "national public relations officer": 7,
      "national legal adviser": 8,
      "national internal auditor": 9,
      "chief whip": 10,
    });
  });

  it("should assign ranks in ascending order starting from 0", () => {
    const values = Object.values(ranks);
    expect(values).toEqual(values.sort((a, b) => a - b));
    expect(values[0]).toBe(0);
    expect(values[values.length - 1]).toBe(values.length - 1);
  });
});
