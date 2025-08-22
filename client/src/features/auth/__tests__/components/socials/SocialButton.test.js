import { render, screen, fireEvent } from "@testing-library/react";
import SocialButton from "features/auth/components/socials/SocialButton";

jest.mock("components/ui/I", () => ({
  __esModule: true,
  default: ({ className }) => <i data-testid="social-icon" className={className} />,
}));

jest.mock("components/ui/Span", () => ({
  __esModule: true,
  default: ({ children, ...props }) => <span {...props}>{children}</span>,
}));

let mockWidth = 1024;

jest.mock("hooks/useWindowSize", () => ({
  __esModule: true,
  default: () => ({ width: mockWidth }),
}));

jest.mock("features/auth/components/AuthButton", () => ({
  __esModule: true,
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe("SocialButton", () => {
  const providers = ["Google", "Facebook", "Github"];

  it.each(providers)("renders correct icon and label for %s", (provider) => {
    render(<SocialButton type={provider} />);

    expect(screen.getByText(`Continue with ${provider}`)).toBeInTheDocument();
    expect(screen.getByText(`Continue with ${provider}`)).toHaveClass("w-60p");

    expect(screen.getByRole("button")).toHaveClass(`btn-social ${provider.toLowerCase()}`);

    const icon = screen.getByTestId("social-icon");
    expect(icon).toHaveClass(
      `fa-${provider.toLowerCase() === "facebook" ? "facebook-f" : provider.toLowerCase()}`,
    );
  });

  it.each(providers)("renders a w-70p class when width is less or equal 400", (provider) => {
    mockWidth = 400;
    render(<SocialButton type={provider} />);
    expect(screen.getByText(`Continue with ${provider}`)).toBeInTheDocument();
    expect(screen.getByText(`Continue with ${provider}`)).toHaveClass("w-70p");
  });

  it("redirects to the correct OAuth URL on click", () => {
    delete window.location;
    window.location = { href: "" };

    render(<SocialButton type="Github" />);
    fireEvent.click(screen.getByRole("button"));

    expect(window.location.href).toBe("http://localhost:3001/api/v1/oauth/github");
  });
});
