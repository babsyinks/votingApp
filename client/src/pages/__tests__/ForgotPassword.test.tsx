import { render, screen } from "@testing-library/react";
import ForgotPassword from "pages/ForgotPassword";
import type { AuthFrameProps } from "features/auth/components/AuthFrame";
import type { AuthHeadingProps } from "features/auth/components/AuthHeading";
import { vi } from "vitest";

vi.mock("features/auth/components/AuthFrame", () => ({
  __esModule: true,
  default: ({ children }: AuthFrameProps) => (
    <div data-testid="auth-frame">{children}</div>
  ),
}));

vi.mock("features/auth/components/AuthHeading", () => ({
  __esModule: true,
  default: ({ children }: AuthHeadingProps) => <h1>{children}</h1>,
}));

vi.mock(
  "features/auth/components/forgotPassword/ForgotPasswordStartForm",
  () => ({
    __esModule: true,
    default: () => <div data-testid="forgot-password">Form</div>,
  }),
);

describe("ForgotPassword Component", () => {
  it("renders the AuthFrame", () => {
    render(<ForgotPassword />);
    expect(screen.getByTestId("auth-frame")).toBeInTheDocument();
  });

  it("displays the heading 'Forgot Password'", () => {
    render(<ForgotPassword />);
    expect(
      screen.getByRole("heading", { name: /forgot password/i }),
    ).toBeInTheDocument();
  });

  it("renders the ForgotPasswordStartForm", () => {
    render(<ForgotPassword />);
    expect(screen.getByTestId("forgot-password")).toBeInTheDocument();
  });
});
