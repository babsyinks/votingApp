import React from "react";
import { render, screen } from "@testing-library/react";
import Hr from "components/ui/Hr";
import getCompClasses from "util/getCompClasses";

jest.mock("util/getCompClasses", () => jest.fn());

describe("<Hr />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders an <hr> element", () => {
    render(<Hr />);
    const hr = screen.getByRole("separator");
    expect(hr).toBeInTheDocument();
    expect(hr.tagName.toLowerCase()).toBe("hr");
  });

  it("applies default and custom classes", () => {
    getCompClasses.mockReturnValue("resolved-class")
    render(<Hr className="custom-class" />);
    const hr = screen.getByRole("separator");
    expect(hr).toHaveClass("hr-line");
    expect(hr).toHaveClass("resolved-class");
  });

  it("applies inline styles", () => {
    render(<Hr style={{ marginTop: "10px" }} />);
    const hr = screen.getByRole("separator");
    expect(hr).toHaveStyle({ marginTop: "10px" });
  });

  it("calls getCompClasses with correct arguments", () => {
    const getCompClasses = require("util/getCompClasses");
    render(<Hr className="my-hr" />);
    expect(getCompClasses).toHaveBeenCalledWith(expect.any(Object), "my-hr");
  });
});
