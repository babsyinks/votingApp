import { render, screen } from "@testing-library/react";
import AuthFrame from "features/auth/components/AuthFrame";

jest.mock("components/ui/Block", () => ({ children, className = "", type }) => {
  return (
    <div data-testid={`block-${type || "none"}`} className={className}>
      {children}
    </div>
  );
});

describe("AuthFrame", () => {
  it("renders children inside inner Block", () => {
    render(
      <AuthFrame>
        <p data-testid="child">Test content</p>
      </AuthFrame>
    );

    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Test content");
  });

  it("applies full height class when isFull is true (default)", () => {
    render(<AuthFrame />);
    const outerBlock = screen.getByTestId("block-flex-horz");

    expect(outerBlock).toHaveClass(
      "bg-blue-faded",
      "mnh-100vh",
      "px-1r-py-0r",
      "flex"
    );
  });

  it("does not apply full height class when isFull is false", () => {
    render(<AuthFrame isFull={false} />);
    const outerBlock = screen.getByTestId("block-flex-horz");

    expect(outerBlock).not.toHaveClass("mnh-100vh");
  });

  it("uses custom className and type", () => {
    render(
      <AuthFrame className="custom-class" type="flex-vert">
        <div>Content</div>
      </AuthFrame>
    );

    const outerBlock = screen.getByTestId("block-flex-vert");
    expect(outerBlock).toHaveClass("custom-class");
    expect(outerBlock).toHaveClass("flex");
  });

  it("renders inner Block with expected classes", () => {
    render(<AuthFrame />);
    const innerBlock = screen.getByText((_, el) =>
      el?.classList.contains("bg-blue-faded") &&
      el?.classList.contains("border-rounded-1r")
    );

    expect(innerBlock).toBeInTheDocument();
    expect(innerBlock).toHaveClass(
      "bg-blue-faded",
      "border-rounded-1r",
      "bs-blue-faded",
      "w-full",
      "mxw-28r",
      "p-2r",
      "mt-1p5r"
    );
  });
});
