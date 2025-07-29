import React from "react";
import { render, screen } from "@testing-library/react";
import SignUpStart from "pages/SignUpStart";

jest.mock("features/auth/components/AuthHeading", () => () => (
  <h1>Create your account</h1>
));

jest.mock("features/auth/components/signup/SignUpStartAccountDoesNotExist", () => () => (
  <div data-testid="account-does-not-exist">Account Does Not Exist Component</div>
));

jest.mock("features/auth/components/signup/SignUpStartAccountExists", () => () => (
  <div data-testid="account-exists">Account Exists Component</div>
));

describe("SignUpStart", () => {
  it("renders without crashing", () => {
    render(<SignUpStart />);
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("renders SignUpStartAccountDoesNotExist", () => {
    render(<SignUpStart />);
    expect(screen.getByTestId("account-does-not-exist")).toBeInTheDocument();
  });

  it("renders SignUpStartAccountExists", () => {
    render(<SignUpStart />);
    expect(screen.getByTestId("account-exists")).toBeInTheDocument();
  });
});
