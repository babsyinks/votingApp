import { render, screen } from "@testing-library/react";
import SocialButtons from "features/auth/components/socials/SocialButtons";

jest.mock("components/ui/Block", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="block">{children}</div>,
}));

jest.mock("features/auth/components/socials/SocialButton", () => ({
  __esModule: true,
  default: ({ type }) => <div data-testid="social-button">{`Button: ${type}`}</div>,
}));

describe("SocialButtons", () => {
  it("renders one SocialButton for each provider", () => {
    render(<SocialButtons />);

    const buttons = screen.getAllByTestId("social-button");
    expect(buttons).toHaveLength(3);

    expect(buttons[0]).toHaveTextContent("Button: Google");
    expect(buttons[1]).toHaveTextContent("Button: Facebook");
    expect(buttons[2]).toHaveTextContent("Button: Github");

    // Ensure Block is rendered as wrapper
    expect(screen.getByTestId("block")).toBeInTheDocument();
  });
});
