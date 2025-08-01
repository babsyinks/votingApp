import { render, screen } from "@testing-library/react";
import AuthPasswordValidator from "features/auth/components/AuthPasswordValidator";
import React from "react";

jest.mock("components/ui/Heading", () => ({ children }) => <h4>{children}</h4>);
jest.mock("components/ui/List", () => ({ children }) => <ul>{children}</ul>);
jest.mock("components/ui/Li", () => ({ children, ...props }) => <li {...props}>{children}</li>);
jest.mock("features/auth/components/AuthFrame", () => ({ children }) => <div>{children}</div>);
jest.mock("features/auth/components/AuthValidationIndicator", () => ({ label, isValid }) => (
  <span data-testid="validation-indicator">
    {label} - {isValid ? "valid" : "invalid"}
  </span>
));

describe("AuthPasswordValidator", () => {
  it("renders heading and all validation indicators", () => {
    const mockSetPasswordValid = jest.fn();
    render(<AuthPasswordValidator password="weak" setPasswordValid={mockSetPasswordValid} />);

    expect(screen.getByText(/Password must have:/i)).toBeInTheDocument();

    // Five criteria indicators should be rendered
    const indicators = screen.getAllByTestId("validation-indicator");
    expect(indicators).toHaveLength(5);

    // Specific criteria labels should be present
    expect(screen.getByText(/Minimum length of 10 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/At least 1 lowercase character/i)).toBeInTheDocument();
    expect(screen.getByText(/At least 1 uppercase character/i)).toBeInTheDocument();
    expect(screen.getByText(/At least 1 number/i)).toBeInTheDocument();
    expect(screen.getByText(/At least 1 special character/i)).toBeInTheDocument();
  });

  it("calls setPasswordValid with false when password does not meet all criteria", () => {
    const mockSetPasswordValid = jest.fn();
    render(<AuthPasswordValidator password="weak" setPasswordValid={mockSetPasswordValid} />);

    expect(mockSetPasswordValid).toHaveBeenCalledWith(false);
  });

  it("calls setPasswordValid with true when password meets all criteria", () => {
    const mockSetPasswordValid = jest.fn();
    render(<AuthPasswordValidator password="StrongP@ssw0rd!" setPasswordValid={mockSetPasswordValid} />);

    expect(mockSetPasswordValid).toHaveBeenCalledWith(true);
  });

  it("renders indicators with correct valid/invalid state", () => {
    const mockSetPasswordValid = jest.fn();
    render(<AuthPasswordValidator password="Strongpass" setPasswordValid={mockSetPasswordValid} />);

    const indicators = screen.getAllByTestId("validation-indicator");
    const textContent = indicators.map((el) => el.textContent);

    // Should be valid for length, lowercase, uppercase
    expect(textContent[0]).toMatch(/valid$/); // length
    expect(textContent[1]).toMatch(/valid$/); // lowercase
    expect(textContent[2]).toMatch(/valid$/); // uppercase

    // Should be invalid for number and special character
    expect(textContent[3]).toMatch(/invalid$/); // number
    expect(textContent[4]).toMatch(/invalid$/); // special char
  });
});
