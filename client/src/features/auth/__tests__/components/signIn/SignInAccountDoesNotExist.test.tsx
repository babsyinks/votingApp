import { render, screen, fireEvent } from "@testing-library/react";
import SignInAccountDoesNotExist from "features/auth/components/signIn/SignInAccountDoesNotExist";
import { ButtonProps } from "components/ui/Button";
import { ParagraphProps } from "components/ui/Paragraph";
import { vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("components/ui/Button", () => ({ children, ...props }: ButtonProps) => ( 
  <button {...props}>{children}</button>
));
vi.mock("components/ui/Paragraph", () => ({ children, ...props }: ParagraphProps) => (
  <p {...props}>{children}</p>
));

describe("SignInAccountDoesNotExist", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the question and sign up button", () => {
    render(<SignInAccountDoesNotExist />);

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("navigates to /signup-start when button is clicked", () => {
    render(<SignInAccountDoesNotExist />);
    const button = screen.getByRole("button", { name: /sign up/i });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/signup-start");
  });
});
