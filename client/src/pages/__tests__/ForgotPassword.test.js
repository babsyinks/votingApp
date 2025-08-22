import React from "react";
import { render, screen } from "@testing-library/react";
import ForgotPassword from "pages/ForgotPassword";

jest.mock("features/auth/components/AuthFrame", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="auth-frame">{children}</div>,
}));

jest.mock("features/auth/components/AuthHeading", () => ({
  __esModule: true,
  default: ({ children }) => <h1>{children}</h1>,
}));

jest.mock("features/auth/components/forgotPassword/ForgotPasswordStartForm", () => ({
  __esModule: true,
  default: () => <div data-testid="forgot-password">Form</div>,
}));

describe("ForgotPassword Component", () => {
  it("renders the AuthFrame", () => {
    render(<ForgotPassword />);
    expect(screen.getByTestId("auth-frame")).toBeInTheDocument();
  });

  it("displays the heading 'Forgot Password'", () => {
    render(<ForgotPassword />);
    expect(screen.getByRole("heading", { name: /forgot password/i })).toBeInTheDocument();
  });

  it("renders the ForgotPasswordStartForm", () => {
    render(<ForgotPassword />);
    expect(screen.getByTestId("forgot-password")).toBeInTheDocument();
  });
});
