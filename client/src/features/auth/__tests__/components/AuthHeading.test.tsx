import { render, screen } from "@testing-library/react";
import AuthHeading from "features/auth/components/AuthHeading";
import { HeadingProps } from "components/ui/Heading";
import { vi } from "vitest";

vi.mock("components/ui/Heading", () => ({ children, className, type }: HeadingProps) => {
  return (
    <h1 data-testid="mock-heading" data-type={type} className={className}>
      {children}
    </h1>
  );
});

describe("AuthHeading", () => {
  it("renders children text", () => {
    render(<AuthHeading>Sign In</AuthHeading>);
    const heading = screen.getByTestId("mock-heading");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Sign In");
  });

  it("applies correct type and className", () => {
    render(<AuthHeading>Title</AuthHeading>);
    const heading = screen.getByTestId("mock-heading");

    expect(heading.getAttribute("data-type")).toBe("h1");
    expect(heading).toHaveClass("text-2xl-r", "lh-2r", "fw-600", "ta-center");
  });
});
