import { render, screen } from "@testing-library/react";
import ElectionDetailsHeaderMessage from "features/election/components/ElectionDetailsHeaderMessage";
import type { BlockProps } from "components/ui/Block";
import { vi } from "vitest";

vi.mock("components/ui/Block", () => ({ children, ...props }: BlockProps) => (
  <div data-testid="mock-block" {...props}>
    {children}
  </div>
));

describe("ElectionDetailsHeaderMessage", () => {
  const baseProps = {
    username: "JohnDoe",
    message: "Please proceed to vote.",
  };

  it("renders the full message correctly", () => {
    render(<ElectionDetailsHeaderMessage {...baseProps} />);
    expect(screen.getByTestId("mock-block")).toHaveTextContent(
      "Welcome johndoe. Please proceed to vote.",
    );
  });

  it("renders the username in lowercase with appropriate styling", () => {
    render(<ElectionDetailsHeaderMessage {...baseProps} />);
    const usernameSpan = screen.getByText("johndoe.");
    expect(usernameSpan.tagName).toBe("SPAN");
    expect(usernameSpan).toHaveClass(
      "fw-bold",
      "fs-italic",
      "ff-merienda",
      "tt-cap",
      "mx-10-my-0p",
      "text-blue",
    );
  });

  it("applies the correct class to the Block component", () => {
    render(<ElectionDetailsHeaderMessage {...baseProps} />);
    const block = screen.getByTestId("mock-block");
    expect(block).toHaveClass(
      "fw-bold",
      "fs-italic",
      "ta-center",
      "ff-cormorant",
      "mx-10-my-0p",
    );
  });
});
