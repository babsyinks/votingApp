import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "routes/AppRoutes";

jest.mock("pages/HomePage", () => () => <div>Home Page</div>);
jest.mock("pages/Register", () => () => <div>Register Page</div>);
jest.mock("pages/SignIn", () => () => <div>Sign In Page</div>);
jest.mock("pages/SignUpStart", () => () => <div>Sign Up Start Page</div>);
jest.mock("pages/VerifyCode", () => () => <div>Verify Code Page</div>);
jest.mock("pages/OAuthSuccess", () => () => <div>OAuth Success Page</div>);
jest.mock("pages/ForgotPassword", () => () => <div>Forgot Password Page</div>);
jest.mock("pages/ResetPassword", () => () => <div>Reset Password Page</div>);
jest.mock("pages/Admin", () => () => <div>Admin Page</div>);
jest.mock("pages/VotingProcess", () => () => <div>Voting Process Page</div>);
jest.mock("pages/ElectionTimerSettings", () => () => <div>Election Timer Settings Page</div>);
jest.mock("pages/Help", () => () => <div>Help Page</div>);
jest.mock("pages/Results", () => () => <div>Results Page</div>);
jest.mock("pages/NotFound", () => () => <div>404 Not Found</div>);

const renderWithRoute = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>
  );

describe("AppRoutes", () => {
  it("renders HomePage at '/'", () => {
    renderWithRoute("/");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders Register page at '/register'", () => {
    renderWithRoute("/register");
    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });

  it("renders SignIn page at '/signin'", () => {
    renderWithRoute("/signin");
    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });

  it("renders SignUpStart page at '/signup-start'", () => {
    renderWithRoute("/signup-start");
    expect(screen.getByText("Sign Up Start Page")).toBeInTheDocument();
  });

  it("renders VerifyCode page at '/verify-code'", () => {
    renderWithRoute("/verify-code");
    expect(screen.getByText("Verify Code Page")).toBeInTheDocument();
  });

  it("renders OAuthSuccess page at '/oauth-success'", () => {
    renderWithRoute("/oauth-success");
    expect(screen.getByText("OAuth Success Page")).toBeInTheDocument();
  });

  it("renders ForgotPassword page at '/forgot-password'", () => {
    renderWithRoute("/forgot-password");
    expect(screen.getByText("Forgot Password Page")).toBeInTheDocument();
  });

  it("renders ResetPassword page at '/reset-password/abc123'", () => {
    renderWithRoute("/reset-password/abc123");
    expect(screen.getByText("Reset Password Page")).toBeInTheDocument();
  });

  it("renders Admin page at '/admin'", () => {
    renderWithRoute("/admin");
    expect(screen.getByText("Admin Page")).toBeInTheDocument();
  });

  it("renders VotingProcess page at '/vote'", () => {
    renderWithRoute("/vote");
    expect(screen.getByText("Voting Process Page")).toBeInTheDocument();
  });

  it("renders ElectionTimerSettings page at '/time'", () => {
    renderWithRoute("/time");
    expect(screen.getByText("Election Timer Settings Page")).toBeInTheDocument();
  });

  it("renders Help page at '/help'", () => {
    renderWithRoute("/help");
    expect(screen.getByText("Help Page")).toBeInTheDocument();
  });

  it("renders Results page at '/results'", () => {
    renderWithRoute("/results");
    expect(screen.getByText("Results Page")).toBeInTheDocument();
  });

  it("renders NotFound page for unknown route", () => {
    renderWithRoute("/some/unknown/path");
    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
  });
});
