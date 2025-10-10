import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainHeader from "layout/MainHeader";

describe("MainHeader Component", () => {
  test("renders logo with correct alt text", () => {
    render(<MainHeader />);
    expect(screen.getByAltText("VoteNow Logo")).toBeInTheDocument();
  });

  test("renders email and phone text in the DOM (accessible to assistive tech)", () => {
    render(<MainHeader />);
    expect(screen.getByText("multac@proton.me")).toBeInTheDocument();
    expect(screen.getByText("+234 (805) 175-0010")).toBeInTheDocument();
  });

  test("renders two contact links with correct hrefs and accessible names", () => {
    render(<MainHeader />);

    const emailLink = screen.getByRole("link", { name: /multac@proton.me/i });
    const phoneLink = screen.getByRole("link", { name: /\+234 \(805\) 175-0010/i });

    expect(emailLink).toHaveAttribute("href", "mailto:multac@proton.me");
    expect(phoneLink).toHaveAttribute("href", "tel:+2348051750010");

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  test("icons are presentational and do not affect accessible names", () => {
    render(<MainHeader />);

    const emailLink = screen.getByRole("link", { name: "multac@proton.me" });
    const phoneLink = screen.getByRole("link", { name: "+234 (805) 175-0010" });

    expect(emailLink).toHaveAccessibleName("multac@proton.me");
    expect(phoneLink).toHaveAccessibleName("+234 (805) 175-0010");
  });
});
