import React from "react";
import { render, screen } from "@testing-library/react";
import Img from "components/ui/Img";
import getCompClasses from "util/getCompClasses";

jest.mock("components/ui/Img.module.css", () => ({
  img: "default-img-class",
}));

jest.mock("util/getCompClasses");

describe("<Img />", () => {
  it("renders an img element with required src and alt", () => {
    render(<Img src="logo.png" alt="Logo" />);
    const img = screen.getByAltText("Logo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "logo.png");
    expect(img.tagName.toLowerCase()).toBe("img");
  });

  it("applies default and resolved class names", () => {
    getCompClasses.mockReturnValue("resolved-class")
    render(<Img src="a.png" alt="test" className="my-class" />);
    const img = screen.getByAltText("test");
    expect(img).toHaveClass("default-img-class");
    expect(img).toHaveClass("resolved-class");
  });

  it("applies inline styles", () => {
    render(<Img src="styled.png" alt="styled" style={{ width: "100px" }} />);
    const img = screen.getByAltText("styled");
    expect(img).toHaveStyle("width: 100px");
  });
});
