import { render, screen } from "@testing-library/react";
import AuthValidationIndicator from "features/auth/components/AuthValidationIndicator";

jest.mock("components/ui/Span", () => ({ children, className, ...props }) => (
  <span data-testid="span" className={className} {...props}>{children}</span>
));
jest.mock("components/ui/I", () => ({ className }) => (
  <i data-testid="icon" className={className}></i>
));

describe("AuthValidationIndicator", () => {
  it("renders label and check icon when isValid is true", () => {
    render(<AuthValidationIndicator label="Minimum 10 characters" isValid={true} />);

    expect(screen.getByText("Minimum 10 characters")).toBeInTheDocument();

    const icon = screen.getByTestId("icon");
    expect(icon).toHaveClass("fa-check-circle");
    expect(icon).not.toHaveClass("fa-times-circle");
  });

  it("renders label and times icon when isValid is false", () => {
    render(<AuthValidationIndicator label="One digit" isValid={false} />);

    expect(screen.getByText("One digit")).toBeInTheDocument();

    const icon = screen.getByTestId("icon");
    expect(icon).toHaveClass("fa-times-circle");
    expect(icon).not.toHaveClass("fa-check-circle");
  });

  it("applies preset widths when usePresetWidths is true (default)", () => {
    render(<AuthValidationIndicator label="Uppercase letter" isValid={true} />);

    const spans = screen.getAllByTestId("span");
    expect(spans[0]).toHaveClass("w-90p");
    expect(spans[1]).toHaveClass("w-10p");
  });

  it("does not apply preset widths when usePresetWidths is false", () => {
    render(
      <AuthValidationIndicator
        label="Special character"
        isValid={false}
        usePresetWidths={false}
      />
    );

    const spans = screen.getAllByTestId("span");
    expect(spans[0]).not.toHaveClass("w-90p");
    expect(spans[1]).not.toHaveClass("w-10p");
  });
});
