import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotFound from "pages/NotFound";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("components/ui/Block", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="Block">{children}</div>,
}));

jest.mock("components/ui/Heading", () => ({
  __esModule: true,
  default: ({ children, type, className }) => (
    <div data-testid={`Heading-${type}`} className={className}>
      {children}
    </div>
  ),
}));

jest.mock("components/ui/Button", () => ({
  __esModule: true,
  default: ({ children, onClick, className }) => (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock("layout/Container", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="Container">{children}</div>,
}));

describe("NotFound component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders all headings and buttons correctly", () => {
    render(<NotFound />);

    expect(screen.getByTestId("Container")).toBeInTheDocument();
    expect(screen.getByTestId("Heading-h1")).toHaveTextContent(
      "This Page Does Not Exist"
    );
    expect(screen.getByTestId("Heading-h2")).toHaveTextContent(
      "What Would You Like To Do?"
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
