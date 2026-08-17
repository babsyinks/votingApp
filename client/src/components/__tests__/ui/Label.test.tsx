import { render, screen } from "@testing-library/react";
import Label from "../../ui/Label";
import "@testing-library/jest-dom";
import getCompClasses from "util/getCompClasses";
import { vi } from "vitest";

vi.mock("util/getCompClasses"); 

const mockedGetCompClasses = vi.mocked(getCompClasses);

describe("<Label />", () => {
  it("renders label text via children", () => {
    render(<Label name="email">Email Address</Label>);
    expect(screen.getByText("Email Address")).toBeInTheDocument();
  });

  it("sets htmlFor to match the 'name' prop", () => {
    render(<Label name="username">Username</Label>);
    const label = screen.getByText("Username");
    expect(label).toHaveAttribute("for", "username");
  });

  it("applies default and resolved classes", () => {
    mockedGetCompClasses.mockReturnValue("resolved-class")
    render(<Label name="test" className="custom-class">Label</Label>);
    const label = screen.getByText("Label");
    expect(label).toHaveClass("mg-r-5 pd-05 resolved-class");
  });

  it("applies inline styles when passed", () => {
    const style = { color: "red" };
    render(<Label name="styled" style={style}>Styled</Label>);
    const label = screen.getByText("Styled");
    expect(label).toHaveStyle("color: red");
  });
});
