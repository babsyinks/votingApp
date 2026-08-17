import { render, screen, fireEvent } from "@testing-library/react";
import SocialButton from "features/auth/components/socials/SocialButton";
import { IProps } from "components/ui/I";
import { SpanProps } from "components/ui/Span";
import { AuthButtonProps } from "features/auth/components/AuthButton";
import { SocialProvider } from "features/auth/components/socials/SocialButton";
import { vi } from "vitest";

vi.mock("components/ui/I", () => ({
  __esModule: true,
  default: ({ className }: IProps) => (
    <i data-testid="social-icon" className={className} />
  ),
}));

vi.mock("components/ui/Span", () => ({
  __esModule: true,
  default: ({ children, ...props }: SpanProps) => (
    <span {...props}>{children}</span>
  ),
}));

let mockWidth = 1024;

vi.mock("hooks/useWindowSize", () => ({
  __esModule: true,
  default: () => ({ width: mockWidth }),
}));

vi.mock("features/auth/components/AuthButton", () => ({
  __esModule: true,
  default: ({ children, ...props }: AuthButtonProps) => (
    <button {...props}>{children}</button>
  ),
}));

describe("SocialButton", () => {
  const providers: SocialProvider[] = ["Google", "Facebook", "Github"];

  it.each(providers)("renders correct icon and label for %s", (provider) => {
    render(<SocialButton type={provider} />);

    expect(screen.getByText(`Continue with ${provider}`)).toBeInTheDocument();
    expect(screen.getByText(`Continue with ${provider}`)).toHaveClass("w-60p");

    expect(screen.getByRole("button")).toHaveClass(
      `btn-social ${provider.toLowerCase()}`,
    );

    const icon = screen.getByTestId("social-icon");
    expect(icon).toHaveClass(
      `fa-${provider.toLowerCase() === "facebook" ? "facebook-f" : provider.toLowerCase()}`,
    );
  });

  it.each(providers)(
    "renders a w-70p class when width is less or equal 400",
    (provider) => {
      mockWidth = 400;
      render(<SocialButton type={provider} />);
      expect(screen.getByText(`Continue with ${provider}`)).toBeInTheDocument();
      expect(screen.getByText(`Continue with ${provider}`)).toHaveClass(
        "w-70p",
      );
    },
  );

it("redirects to the correct OAuth URL on click", () => {
  const originalLocation = window.location;

  Object.defineProperty(window, "location", {
    configurable: true,
    value: { href: "" },
  });

  render(<SocialButton type="Github" />);
  fireEvent.click(screen.getByRole("button"));

  expect(window.location.href).toBe(
    "http://localhost:3001/api/v1/oauth/github",
  );

  // restore original after test
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation,
  });
});

});
