
import { render, screen } from "@testing-library/react";
import HeroSectionImage from "features/home/components/HeroSectionImage";
import { ImgProps } from "components/ui/Img";

jest.mock("components/ui/Img", () => ({ src, alt, className }: ImgProps) => (
  <img data-testid="hero-img" src={src} alt={alt} className={className} />
));

describe("HeroSectionImage", () => {
  it("renders the image with correct attributes", () => {
    render(<HeroSectionImage />);

    const img = screen.getByTestId("hero-img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "vote-hero.png");
    expect(img).toHaveAttribute("alt", "Voting illustration");
    expect(img).toHaveClass("border-rounded-1r");
  });
});
