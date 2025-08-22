import React from "react";
import { render, screen } from "@testing-library/react";
import ContestantPicture from "features/election/components/contestant/info/ContestantPicture";

jest.mock("../ContestantPicture.module.css", () => ({
  "contestant-picture-wrapper": "contestant-picture-wrapper",
  "contestant-picture": "contestant-picture",
  "contestant-picture-full": "contestant-picture-full",
}));

jest.mock("components/ui/Block", () => (props) => <div data-testid="contestant-picture-wrapper" {...props}></div>);

describe("ContestantPicture", () => {
  const pictureUrl = "https://example.com/image.jpg";

  it("renders the image with the correct src and alt", () => {
    render(<ContestantPicture picture={pictureUrl} />);
    const img = screen.getByRole("img", { name: /contestant/i });

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", pictureUrl);
    expect(img).toHaveAttribute("alt", "contestant");
  });

  it("applies the default styling class to the wrapper", () => {
    render(<ContestantPicture picture={pictureUrl} />);
    const wrapper = screen.getByTestId("contestant-picture-wrapper")
    expect(wrapper).toHaveClass("contestant-picture-wrapper");
  });

  it("applies the correct image class when showFullPicture is true", () => {
    render(<ContestantPicture picture={pictureUrl} showFullPicture />);
    const img = screen.getByRole("img", { name: /contestant/i });

    expect(img).toHaveClass("contestant-picture");
    expect(img).toHaveClass("contestant-picture-full");
  });

  it("does not apply the full picture class when showFullPicture is false", () => {
    render(<ContestantPicture picture={pictureUrl} showFullPicture={false} />);
    const img = screen.getByRole("img", { name: /contestant/i });

    expect(img).toHaveClass("contestant-picture");
    expect(img).not.toHaveClass("contestant-picture-full");
  });
});
