import { render, screen, fireEvent } from "@testing-library/react";
import SignUpStartAccountExists from "features/auth/components/signup/SignUpStartAccountExists";
import { ButtonProps } from "components/ui/Button";
import { ParagraphProps } from "components/ui/Paragraph";
import { vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock(
  "components/ui/Button",
  () =>
    ({ children, ...props }: ButtonProps) => (
      <button {...props}>{children}</button>
    ),
);
vi.mock(
  "components/ui/Paragraph",
  () =>
    ({ children, ...props }: ParagraphProps) => <p {...props}>{children}</p>,
);

describe("SignUpStartAccountExists", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the question and sign in button", () => {
    render(<SignUpStartAccountExists />);

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("navigates to /signin when button is clicked", () => {
    render(<SignUpStartAccountExists />);
    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });
});
