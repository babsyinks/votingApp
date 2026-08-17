
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResultsNone from "features/results/components/ResultsNone";
import { useNavigate } from "react-router-dom";
import { vi, type Mock } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("ResultsNone", () => {
  const heading = "No Results Found";
  const content = "We couldn't find any results for your request.";
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading, content, and static prompt", () => {
    render(<ResultsNone heading={heading} content={content} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heading);
    expect(screen.getByText(content)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /what would you like to do/i })
    ).toBeInTheDocument();
  });

  it("renders two buttons with correct labels", () => {
    render(<ResultsNone heading={heading} content={content} />);

    expect(screen.getByRole("button", { name: /go to home page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to help page/i })).toBeInTheDocument();
  });

  it("navigates to '/' when 'Go To Home Page' is clicked", async () => {
    render(<ResultsNone heading={heading} content={content} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /go to home page/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to '/help' when 'Go To Help Page' is clicked", async () => {
    render(<ResultsNone heading={heading} content={content} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /go to help page/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/help");
  });
});
