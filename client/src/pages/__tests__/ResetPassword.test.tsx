import { render, screen } from "@testing-library/react";
import ResetPassword from "pages/ResetPassword";
import type { AuthFrameProps } from "features/auth/components/AuthFrame";
import type { AuthHeadingProps } from "features/auth/components/AuthHeading";
import type { ForgotPasswordResetPasswordProps } from "features/auth/components/forgotPassword/ForgotPasswordResetPassword";

jest.mock(
  "features/auth/components/AuthFrame",
  () =>
    ({ children, className }: AuthFrameProps) => (
      <div data-testid="auth-frame" className={className}>
        {children}
      </div>
    ),
);

jest.mock(
  "features/auth/components/AuthHeading",
  () =>
    ({ children }: AuthHeadingProps) => (
      <h1 data-testid="auth-heading">{children}</h1>
    ),
);

jest.mock(
  "features/auth/components/forgotPassword/ForgotPasswordResetPassword",
  () =>
    ({ setBottomSpacingClass }: ForgotPasswordResetPasswordProps) => {
      const { useEffect } = require("react");
      useEffect(() => {
        setBottomSpacingClass("mb-1p5r");
      }, [setBottomSpacingClass]);

      return <div data-testid="reset-password-form">ResetForm</div>;
    },
);

describe("ForgotPassword", () => {
  it("renders AuthHeading and ForgotPasswordResetPassword inside AuthFrame", () => {
    render(<ResetPassword />);

    expect(screen.getByTestId("auth-heading")).toHaveTextContent(
      "Reset Password",
    );

    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();

    const frame = screen.getByTestId("auth-frame");
    expect(frame).toBeInTheDocument();
    expect(frame).toHaveClass("mb-1p5r"); // updated by child
  });
});
