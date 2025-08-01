import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpStartAccountDoesNotExist from "features/auth/components/signup/SignUpStartAccountDoesNotExist";

const mockTriggerRequest = jest.fn();
const mockTriggerFailureToast = jest.fn();
const mockNavigate = jest.fn();

let mockResponse = null;
let mockError = null;
let mockToastDetailsSet = () => false;
let mockToast = { type: "error", message: "Something went wrong" };

jest.mock("hooks/useAxios", () => ({
  useAxios: () => ({
    triggerRequest: mockTriggerRequest,
    response: mockResponse,
    error: mockError,
  }),
}));

jest.mock("hooks/useToastMessage", () => ({
  useToastMessage: () => ({
    toast: mockToast,
    triggerFailureToast: mockTriggerFailureToast,
    toastDetailsSet: mockToastDetailsSet,
  }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockResponse = null;
  mockError = null;
  mockToastDetailsSet = () => false;
  jest.clearAllMocks();
});

describe("SignUpStartAccountDoesNotExist", () => {
  it("renders the input and button", () => {
    render(<SignUpStartAccountDoesNotExist />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("updates email input value", () => {
    render(<SignUpStartAccountDoesNotExist />);
    const input = screen.getByPlaceholderText(/email/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect(input.value).toBe("test@example.com");
  });

  it("calls triggerRequest with correct params when clicking Next", async () => {
    render(<SignUpStartAccountDoesNotExist />);
    const input = screen.getByPlaceholderText(/email/i);
    const button = screen.getByRole("button", { name: /next/i });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockTriggerRequest).toHaveBeenCalledWith({
        params: {
          method: "POST",
          url: "/api/v1/auth/request-signup-code",
          data: { email: "test@example.com" },
        },
      });
    });
  });

  it("navigates to verify-code page on success", async () => {
    mockResponse = { success: true };

    render(<SignUpStartAccountDoesNotExist />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/verify-code?email=",
      );
    });
  });

  it("calls triggerFailureToast when error exists", async () => {
    mockError = { message: "Oops" };

    render(<SignUpStartAccountDoesNotExist />);
    await waitFor(() => {
      expect(mockTriggerFailureToast).toHaveBeenCalledWith("Oops");
    });
  });

  it("renders ToastMessage when toastDetailsSet returns true", () => {
    mockToastDetailsSet = () => true;
    mockToast = { type: "error", message: "Invalid email" };

    render(<SignUpStartAccountDoesNotExist />);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
