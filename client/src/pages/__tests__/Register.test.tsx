/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useWindowSize from "hooks/useWindowSize";
import Register from "pages/Register";
import type { AuthFrameProps } from "features/auth/components/AuthFrame";
import type { AuthHeadingProps } from "features/auth/components/AuthHeading";
import type { SignUpRegistrationFormProps } from "features/auth/components/signup/SignUpRegistrationForm";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("hooks/useWindowSize");

jest.mock("features/auth/hooks/useStatusOfElectionRedirect", () => ({
  __esModule: true,
  default: jest.fn(),
}));

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
    ({ children }: AuthHeadingProps) => <h1>{children}</h1>,
);

jest.mock(
  "features/auth/components/signup/SignUpRegistrationForm",
  () =>
    ({ email }: SignUpRegistrationFormProps) => (
      <div data-testid="signup-form">Form for: {email}</div>
    ),
);

describe("Register component", () => {
  const mockNavigate = jest.fn();
  const mockUseNavigate = jest.mocked(useNavigate);
  const mockUseSearchParams = jest.mocked(useSearchParams);
  const mockUseSelector = jest.mocked(useSelector);
  const mockUseWindowSize = jest.mocked(useWindowSize);

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseWindowSize.mockReturnValue({ height: 1000, width: 1500 });
  });

  it("redirects when redirect is present", () => {
    require("features/auth/hooks/useStatusOfElectionRedirect").default.mockReturnValue(
      "/vote",
    );

    mockUseSearchParams.mockReturnValue([
      new URLSearchParams("?email=test@example.com"),
      jest.fn(),
    ]);
    mockUseSelector.mockReturnValue(true);

    render(<Register />);

    expect(mockNavigate).toHaveBeenCalledWith("/vote", { replace: true });
  });

  describe("redirect not present", () => {
    beforeEach(() => {
      require("features/auth/hooks/useStatusOfElectionRedirect").default.mockReturnValue(
        "",
      );
      mockUseSearchParams.mockReturnValue([
        new URLSearchParams("?email=test@example.com"),
        jest.fn(),
      ]);
      mockUseSelector.mockReturnValue(true);
    });

    it("renders the registration form when email and userJustVerified are present", () => {
      render(<Register />);

      expect(screen.getByTestId("auth-frame")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Complete Your Registration/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("signup-form")).toHaveTextContent(
        "Form for: test@example.com",
      );
    });

    it("renders null if email is missing", () => {
      mockUseSearchParams.mockReturnValue([new URLSearchParams(""), jest.fn()]);

      const { container } = render(<Register />);
      expect(container.firstChild).toBeNull();
    });

    it("renders null if userJustVerified is false", () => {
      mockUseSelector.mockReturnValue(false);

      const { container } = render(<Register />);
      expect(container.firstChild).toBeNull();
    });

    it("does not add bottom margin when height greater than or equal 940", () => {
      mockUseWindowSize.mockReturnValue({ height: 940, width: 1400 });
      render(<Register />);

      expect(screen.getByTestId("auth-frame")).not.toHaveClass("mb-1p5r");
    });

    it("adds bottom margin when height less than 940", () => {
      mockUseWindowSize.mockReturnValue({ height: 900, width: 1400 });
      render(<Register />);

      expect(screen.getByTestId("auth-frame")).toHaveClass("mb-1p5r");
    });
  });
});
