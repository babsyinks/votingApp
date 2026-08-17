import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerifyCode from "pages/VerifyCode";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import { vi } from "vitest";

vi.mock("react-router-dom", () => ({
  ...reactRouterDom,
  useSearchParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("hooks/useAxios", () => ({
  useAxios: vi.fn(),
}));

vi.mock("hooks/useToastMessage", () => ({
  useToastMessage: vi.fn(),
}));

describe("VerifyCode component", () => {
  const mockNavigate = vi.fn();
  const mockDispatch = vi.fn();
  const mockTriggerRequest = vi.fn();
  const mockTriggerFailureToast = vi.fn();
  const mockedUseNavigate = vi.mocked(useNavigate);
  const mockUseSearchParams = vi.mocked(useSearchParams);
  const mockUseDispatch = vi.mocked(useDispatch);
  const mockUseAxios = vi.mocked(useAxios);
  const mockUseToastMessage = vi.mocked(useToastMessage);

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSearchParams.mockReturnValue([
      new URLSearchParams({ email: "test@example.com" }),
      vi.fn(),
    ]);
    mockedUseNavigate.mockReturnValue(mockNavigate);
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseAxios.mockReturnValue({
      response: null,
      error: null,
      triggerRequest: mockTriggerRequest,
      clearError: vi.fn(),
    });
    mockUseToastMessage.mockReturnValue({
      toast: { status: "failure", message: "Some error" },
      triggerFailureToast: mockTriggerFailureToast,
      toastDetailsSet: () => false,
      triggerSuccessToast: vi.fn(),
    });
  });

  it("renders email and heading", () => {
    render(<VerifyCode />);
    expect(
      screen.getByText(/Enter the 6-digit code sent to/i),
    ).toBeInTheDocument();
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
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    render(<VerifyCode />);
    expect(mockNavigate).toHaveBeenCalledWith("/signup-start");
  });

  it("shows toast and calls triggerFailureToast when there's an error", () => {
    mockUseAxios.mockReturnValue({
      response: null,
      error: { message: "Invalid sign up code!" },
      triggerRequest: mockTriggerRequest,
      clearError: vi.fn(),
    });
    mockUseToastMessage.mockReturnValue({
      toast: { status: "failure", message: "Invalid sign up code!" },
      triggerFailureToast: mockTriggerFailureToast,
      toastDetailsSet: () => true,
      triggerSuccessToast: vi.fn(),
    });

    render(<VerifyCode />);
    expect(mockTriggerFailureToast).toHaveBeenCalledWith(
      "Invalid sign up code!",
    );
    expect(screen.getByText("Invalid sign up code!")).toBeInTheDocument();
  });

  it("dispatches setUserJustVerified and navigates to /register on success", () => {
    const { setUserJustVerified } = require("features/auth/verificationSlice");

    mockUseAxios.mockReturnValue({
      response: { success: true },
      error: null,
      triggerRequest: mockTriggerRequest,
      clearError: vi.fn(),
    });

    render(<VerifyCode />);
    expect(mockDispatch).toHaveBeenCalledWith(setUserJustVerified(true));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/register?email=test%40example.com",
      {
        replace: true,
      },
    );
  });
});
