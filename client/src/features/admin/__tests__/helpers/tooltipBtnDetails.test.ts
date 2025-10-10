import tooltipBtnDetails from "features/admin/helpers/tooltipBtnDetails";

describe("tooltipBtnDetails", () => {
  it("returns an array of button detail objects", () => {
    const result = tooltipBtnDetails();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(4);

    result.forEach((item) => {
      expect(item).toHaveProperty("data");
      expect(item).toHaveProperty("compClass");
      expect(item).toHaveProperty("route");
      expect(item).toHaveProperty("iClasses");

      expect(typeof item.data).toBe("string");
      expect(typeof item.compClass).toBe("string");
      expect(typeof item.iClasses).toBe("string");
    });
  });

  it("includes expected specific entries", () => {
    const result = tooltipBtnDetails();

    expect(result).toContainEqual({
      data: "Add A New Contestant",
      compClass: "shd-grn",
      route: null,
      iClasses: "fa-plus",
    });

    expect(result).toContainEqual({
      data: "Go To The Home Page",
      compClass: "shd-vlt",
      route: "/",
      iClasses: "fa-home",
    });

    expect(result).toContainEqual({
      data: "Go To The Voting Page",
      compClass: "shd-blu",
      route: "/vote",
      iClasses: "fa-poll",
    });

    expect(result).toContainEqual({
      data: "Go To The Election Schedule Page",
      compClass: "shd-red",
      route: "/time",
      iClasses: "fa-stopwatch",
    });
  });

  it("ensures only one entry has a null route", () => {
    const result = tooltipBtnDetails();
    const nullRoutes = result.filter((item) => item.route === null);
    expect(nullRoutes).toHaveLength(1);
    expect(nullRoutes[0].data).toBe("Add A New Contestant");
  });
});
