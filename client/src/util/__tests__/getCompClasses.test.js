import getCompClasses from "../getCompClasses";

describe("getCompClasses", () => {
  const mockStyles = {
    block: "block_hash",
    primary: "primary_hash",
    "flex-column": "flex_column_hash",
  };

  test("returns empty string if no parameter is passed in", () => {
    const result = getCompClasses();
    expect(result).toBe("");
  });

  test("returns mapped class from style module", () => {
    const result = getCompClasses(mockStyles, "block");
    expect(result).toBe("block_hash");
  });

  test("returns unmapped class if not in style module", () => {
    const result = getCompClasses(mockStyles, "custom-class");
    expect(result).toBe("custom-class");
  });

  test("resolves multiple classes: both mapped and unmapped", () => {
    const result = getCompClasses(mockStyles, "block custom-class primary");
    expect(result).toBe("block_hash custom-class primary_hash");
  });

  test("handles class names with extra spaces", () => {
    const result = getCompClasses(mockStyles, "  block   primary ");
    expect(result).toBe("block_hash primary_hash");
  });

  test("returns empty string when classes input is empty", () => {
    const result = getCompClasses(mockStyles, "");
    expect(result).toBe("");
  });

  test("returns empty string when classes input is an empty string and style module is undefined", () => {
    const result = getCompClasses(undefined, "");
    expect(result).toBe("");
  });

  test("handles style module being undefined but classes are present", () => {
    const result = getCompClasses(undefined, "plain-class");
    expect(result).toBe("plain-class");
  });

  test("handles null or undefined classes input", () => {
    expect(getCompClasses(mockStyles, null)).toBe("");
    expect(getCompClasses(mockStyles, undefined)).toBe("");
  });

  test("ignores multiple spaces between class names", () => {
    const result = getCompClasses(mockStyles, "block    custom-class   primary");
    expect(result).toBe("block_hash custom-class primary_hash");
  });
});
