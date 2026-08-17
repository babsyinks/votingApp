import { render, screen, fireEvent } from "@testing-library/react";
import NotFound from "pages/NotFound";
import type { BlockProps } from "components/ui/Block";
import type { HeadingProps } from "components/ui/Heading";
import type { ButtonProps } from "components/ui/Button";
import type { ContainerProps } from "layout/Container";
import { vi } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("components/ui/Block", () => ({
  __esModule: true,
  default: ({ children }: BlockProps) => (
    <div data-testid="Block">{children}</div>
  ),
}));

vi.mock("components/ui/Heading", () => ({
  __esModule: true,
  default: ({ children, type, className }: HeadingProps) => (
    <div data-testid={`Heading-${type}`} className={className}>
      {children}
    </div>
  ),
}));

vi.mock("components/ui/Button", () => ({
  __esModule: true,
  default: ({ children, onClick, className }: ButtonProps) => (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("layout/Container", () => ({
  __esModule: true,
  default: ({ children }: ContainerProps) => (
    <div data-testid="Container">{children}</div>
  ),
}));

describe("NotFound component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders all headings and buttons correctly", () => {
    render(<NotFound />);

    expect(screen.getByTestId("Container")).toBeInTheDocument();
    expect(screen.getByTestId("Heading-h1")).toHaveTextContent(
      "This Page Does Not Exist",
    );
    expect(screen.getByTestId("Heading-h2")).toHaveTextContent(
      "What Would You Like To Do?",
    );
    expect(screen.getByText("Go To Home Page")).toBeInTheDocument();
    expect(screen.getByText("Go To Voting Page")).toBeInTheDocument();
  });

  it("navigates to home page on first button click", () => {
    render(<NotFound />);
    fireEvent.click(screen.getByText("Go To Home Page"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to voting page on second button click", () => {
    render(<NotFound />);
    fireEvent.click(screen.getByText("Go To Voting Page"));
    expect(mockNavigate).toHaveBeenCalledWith("/vote");
  });
});
