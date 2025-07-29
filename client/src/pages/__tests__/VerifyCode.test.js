import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerifyCode from "pages/VerifyCode";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("hooks/useToastMessage", () => ({
  useToastMessage: jest.fn(),
}));

describe("VerifyCode component", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const mockTriggerRequest = jest.fn();
  const mockTriggerFailureToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useSearchParams.mockReturnValue([new URLSearchParams({ email: "test@example.com" })]);
    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);
    useAxios.mockReturnValue({
      response: null,
      error: null,
      triggerRequest: mockTriggerRequest,
    });
    useToastMessage.mockReturnValue({
      toast: { status: "failure", message: "Some error" },
      triggerFailureToast: mockTriggerFailureToast,
      toastDetailsSet: () => false,
    });
  });

  it("renders email and heading", () => {
    render(<VerifyCode />);
    expect(screen.getByText(/Enter the 6-digit code sent to/i)).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("disables verify button when code is not 6 digits", () => {
    render(<VerifyCode />);
    const button = screen.getByRole("button", { name: /verify/i });
    expect(button).toBeDisabled();
  });

  it("enables verify button when code is 6 digits", () => {
    render(<VerifyCode />);
    const input = screen.getByPlaceholderText("Code");
    fireEvent.change(input, { target: { value: "123456" } });
    const button = screen.getByRole("button", { name: /verify/i });
    expect(button).toBeEnabled();
  });

  it("calls triggerRequest with correct data when Verify button is clicked", async () => {
    render(<VerifyCode />);
    const input = screen.getByPlaceholderText("Code");
    fireEvent.change(input, { target: { value: "654321" } });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    await waitFor(() => {
      expect(mockTriggerRequest).toHaveBeenCalledWith({
        params: {
          method: "POST",
          url: "/api/v1/auth/verify-signup-code",
          data: {
            email: "test@example.com",
            code: "654321",
          },
        },
      });
    });
  });

  it("redirects to /signup-start if email is missing", () => {
    useSearchParams.mockReturnValue([new URLSearchParams()]);
    render(<VerifyCode />);
    expect(mockNavigate).toHaveBeenCalledWith("/signup-start");
  });

  it("shows toast and calls triggerFailureToast when there's an error", () => {
    useAxios.mockReturnValue({
      response: null,
      error: "Invalid code",
      triggerRequest: mockTriggerRequest,
    });
    useToastMessage.mockReturnValue({
      toast: { status: "failure", message: "Invalid sign up code!" },
      triggerFailureToast: mockTriggerFailureToast,
      toastDetailsSet: () => true,
    });

    render(<VerifyCode />);
    expect(mockTriggerFailureToast).toHaveBeenCalledWith("Invalid sign up code!");
    expect(screen.getByText("Invalid sign up code!")).toBeInTheDocument();
  });

  it("dispatches setUserJustVerified and navigates to /register on success", () => {
    const { setUserJustVerified } = require("features/auth/verificationSlice");

    useAxios.mockReturnValue({
      response: { success: true },
      error: null,
      triggerRequest: mockTriggerRequest,
    });

    render(<VerifyCode />);
    expect(mockDispatch).toHaveBeenCalledWith(setUserJustVerified(true));
    expect(mockNavigate).toHaveBeenCalledWith("/register?email=test%40example.com", {
      replace: true,
    });
  });
});
