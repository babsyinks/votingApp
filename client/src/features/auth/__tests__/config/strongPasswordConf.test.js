import criteria from "features/auth/config/strongPasswordConf";

describe("Password criteria", () => {
  it("should have 5 criteria with correct labels", () => {
    expect(criteria).toHaveLength(5);
    expect(criteria[0].label).toBe("Minimum length of 10 characters");
    expect(criteria[1].label).toBe("At least 1 lowercase character");
    expect(criteria[2].label).toBe("At least 1 uppercase character");
    expect(criteria[3].label).toBe("At least 1 number");
    expect(criteria[4].label).toBe("At least 1 special character");
  });

  describe("Minimum length of 10 characters", () => {
    const test = criteria[0].test;
    it("returns true if length >= 10", () => {
      expect(test("abcdefghij")).toBe(true);
    });
    it("returns false if length < 10", () => {
      expect(test("abc")).toBe(false);
    });
  });

  describe("At least 1 lowercase character", () => {
    const test = criteria[1].test;
    it("returns true if has lowercase", () => {
      expect(test("ABCd123!")).toBe(true);
    });
    it("returns false if no lowercase", () => {
      expect(test("ABC123!")).toBe(false);
    });
  });

  describe("At least 1 uppercase character", () => {
    const test = criteria[2].test;
    it("returns true if has uppercase", () => {
      expect(test("abcD123!")).toBe(true);
    });
    it("returns false if no uppercase", () => {
      expect(test("abc123!")).toBe(false);
    });
  });

  describe("At least 1 number", () => {
    const test = criteria[3].test;
    it("returns true if has a number", () => {
      expect(test("abcD123!")).toBe(true);
    });
    it("returns false if no number", () => {
      expect(test("abcDEF!@#")).toBe(false);
    });
  });

  describe("At least 1 special character", () => {
    const test = criteria[4].test;
    it("returns true if has a special character", () => {
      expect(test("abcD123!")).toBe(true);
    });
    it("returns false if no special character", () => {
      expect(test("abcD1234")).toBe(false);
    });
  });
});
