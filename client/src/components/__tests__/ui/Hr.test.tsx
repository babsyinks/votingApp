import { render, screen } from "@testing-library/react";
import Hr from "components/ui/Hr";
import getCompClasses from "util/getCompClasses";
import { vi } from "vitest";

vi.mock("util/getCompClasses", () => vi.fn());

const mockedGetCompClasses = vi.mocked(getCompClasses);

describe("<Hr />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders an <hr> element", () => {
    render(<Hr />);
    const hr = screen.getByRole("separator");
    expect(hr).toBeInTheDocument();
    expect(hr.tagName.toLowerCase()).toBe("hr");
  });

  it("applies default and custom classes", () => {
    mockedGetCompClasses.mockReturnValue("resolved-class");
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
