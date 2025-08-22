import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainHeader from "layout/MainHeader";
import useBreakpoint from "hooks/useBreakpoint";

jest.mock("hooks/useBreakpoint", () => jest.fn());

describe("MainHeader Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo with correct alt text", () => {
    useBreakpoint.mockReturnValue("desktop");
    render(<MainHeader />);
    expect(screen.getByAltText("VoteNow Logo")).toBeInTheDocument();
  });

  test("renders email and phone text on desktop", () => {
    useBreakpoint.mockReturnValue("desktop");
    render(<MainHeader />);

    expect(screen.getByText("multac@proton.me")).toBeInTheDocument();
    expect(screen.getByText("+234 (805) 175-0010")).toBeInTheDocument();
  });

  test("does not render email and phone text on mobile", () => {
    useBreakpoint.mockReturnValue("mobile");
    render(<MainHeader />);

    expect(screen.queryByText("multac@proton.me")).not.toBeInTheDocument();
    expect(screen.queryByText("+234 (805) 175-0010")).not.toBeInTheDocument();

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  test("renders mailto and tel links correctly", () => {
    useBreakpoint.mockReturnValue("desktop");
    render(<MainHeader />);

    const emailLink = screen.getByRole("link", { name: /multac@proton.me/i });
    const phoneLink = screen.getByRole("link", { name: /\+234 \(805\) 175-0010/i });

    expect(emailLink).toHaveAttribute("href", "mailto:multac@proton.me");
    expect(phoneLink).toHaveAttribute("href", "tel:+2348051750010");
  });
});
