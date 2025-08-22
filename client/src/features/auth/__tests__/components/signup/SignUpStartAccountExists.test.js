import { render, screen, fireEvent } from "@testing-library/react";
import SignUpStartAccountExists from "features/auth/components/signup/SignUpStartAccountExists";

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

describe("SignUpStartAccountExists", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the question and sign in button", () => {
    render(<SignUpStartAccountExists />);

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("navigates to /signin when button is clicked", () => {
    render(<SignUpStartAccountExists />);
    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/signin"); 
  });
});
