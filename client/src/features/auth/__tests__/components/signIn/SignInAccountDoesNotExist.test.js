import { render, screen, fireEvent } from "@testing-library/react";
import SignInAccountDoesNotExist from "features/auth/components/signIn/SignInAccountDoesNotExist";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("components/ui/Button", () => ({ children, ...props }) => ( 
  <button {...props}>{children}</button>
));
jest.mock("components/ui/Paragraph", () => ({ children, ...props }) => (
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
