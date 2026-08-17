import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import AuthAlternativeAccessMeans from "features/auth/components/AuthAlternativeAccessMeans";
import { ParagraphProps } from "components/ui/Paragraph";
import { ButtonProps } from "components/ui/Button";
import { vi } from "vitest";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));
vi.mock(
  "components/ui/Paragraph",
  () =>
    ({ children, className }: ParagraphProps) => (
      <p className={className} data-testid="paragraph">
        {children}
      </p>
    ),
);
vi.mock(
  "components/ui/Button",
  () =>
    ({ children, className, onClick }: ButtonProps) => (
      <button className={className} onClick={onClick} data-testid="button">
        {children}
      </button>
    ),
);

describe("AuthAlternativeAccessMeans", () => {
  const mockNavigate = vi.fn();
  const mockedUseNavigate = vi.mocked(useNavigate);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNavigate.mockReturnValue(mockNavigate);
  });

  it("renders Paragraph and Button with correct props", () => {
    render(
      <AuthAlternativeAccessMeans
        question="Don't have an account?"
        btnLabel="Sign Up"
        route="/signup"
      />,
    );
    expect(screen.getByTestId("paragraph")).toHaveClass("text-sm-r ta-center");
    expect(screen.getByTestId("paragraph")).toHaveTextContent(
      "Don't have an account?",
    );
    expect(screen.getByTestId("button")).toHaveTextContent("Sign Up");
    expect(screen.getByTestId("button")).toHaveClass(
      "text-blueviolet-mute td-none-with-hover fw-500 bg-transparent",
    );
  });

  it("renders without question prop and only displays btnLabel", () => {
    render(<AuthAlternativeAccessMeans btnLabel="Sign In" route="/signin" />);
    expect(screen.getByTestId("paragraph")).toHaveTextContent("Sign In");
    expect(screen.getByTestId("button")).toHaveTextContent("Sign In");
  });

  it("calls navigate with the correct route when Button is clicked", () => {
    render(
      <AuthAlternativeAccessMeans
        question="Already have an account?"
        btnLabel="Sign In"
        route="/signin"
      />,
    );
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });
});
