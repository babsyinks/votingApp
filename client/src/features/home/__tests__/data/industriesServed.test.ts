import industriesServed from "features/home/data/industriesServed";

describe("industriesServed config", () => {
  it("should export an array", () => {
    expect(Array.isArray(industriesServed)).toBe(true);
  });

  it("should have the correct number of industries", () => {
    expect(industriesServed.length).toBe(18);
  });

  it("should contain the expected industries in order", () => {
    const expectedIndustries = [
      "Corporate Bodies",
      "Professional Associations",
      "Alumni Associations",
      "Unions",
      "Industry Associations",
      "Political Parties",
      "Governmental Bodies",
      "Non-Governmental Organizations (NGOs)",
      "Other Organizations and Associations",
      "Churches",
      "Mosques",
      "Other Religious Groups",
      "Cooperatives and Credit Unions",
      "Schools",
      "Companies",
      "Clubs",
      "Sport Groups",
      "Many More",
    ];

    expect(industriesServed).toEqual(expectedIndustries);
  });

  it("should not contain duplicate entries", () => {
    const uniqueIndustries = new Set(industriesServed);
    expect(uniqueIndustries.size).toBe(industriesServed.length);
  });

  it("should only contain strings", () => {
    industriesServed.forEach((industry) => {
      expect(typeof industry).toBe("string");
    });
  });
});
