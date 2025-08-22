import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ElectionDetailsHeaderButton from "features/election/components/ElectionDetailsHeaderButton";

jest.mock("components/ui/Button", () => ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} data-testid="custom-button">
    {children}
  </button>
));

describe("ElectionDetailsHeaderButton", () => {
  it("renders the button with the correct label", () => {
    render(
      <ElectionDetailsHeaderButton
        onClick={() => {}}
        btnLabel="Click Me"
      />
    );
    const button = screen.getByTestId("custom-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click Me");
  });

  it("applies the default and custom class names", () => {
    render(
      <ElectionDetailsHeaderButton
        onClick={() => {}}
        btnLabel="Test"
        className="custom-class"
      />
    );
    const button = screen.getByTestId("custom-button");
    expect(button).toHaveClass("bg-slateblue", "text-white", "border-rounded-5", "p-10", "custom-class");
  });

  it("calls onClick when clicked", () => {
    const mockClick = jest.fn();
    render(
      <ElectionDetailsHeaderButton
        onClick={mockClick}
        btnLabel="Vote"
      />
    );
    const button = screen.getByTestId("custom-button");
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
