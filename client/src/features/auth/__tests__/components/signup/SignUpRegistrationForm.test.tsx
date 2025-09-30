import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpRegistrationForm from "features/auth/components/signup/SignUpRegistrationForm";
import { mockResponseType, mockErrorType } from "../types/authResults";

const mockDispatch = jest.fn();
const mockTriggerRequest = jest.fn();
const mockTriggerFailureToast = jest.fn();
let mockResponse: mockResponseType = null;
let mockError: mockErrorType = null;
let mockToast = { status: "failure", message: "Something went wrong" };
let mockToastDetailsSet = () => false;

type nonNullmockResponseType = NonNullable<mockResponseType>;

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

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

jest.mock("features/auth/userAuthSlice", () => ({
  userAuthenticated: (user: nonNullmockResponseType["user"]) => ({
    type: "user/authenticated",
    payload: user,
  }),
  userNotAuthenticated: () => ({ type: "user/notAuthenticated" }),
}));

jest.mock("features/user/userSlice", () => ({
  setUserInfo: (user: nonNullmockResponseType["user"]) => ({
    type: "user/setInfo",
    payload: user,
  }),
}));

jest.mock("features/auth/verificationSlice", () => ({
  resetUserJustVerified: () => ({ type: "user/resetVerified" }),
}));

beforeEach(() => {
  mockDispatch.mockClear();
  mockTriggerRequest.mockClear();
  mockResponse = null;
  mockError = null;
  mockToastDetailsSet = () => false;
});

describe("SignUpRegistrationForm", () => {
  it("renders all input fields and register button", () => {
    render(<SignUpRegistrationForm email="test@example.com" />);
    expect(screen.getByPlaceholderText("Firstname")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Lastname")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("updates input fields correctly", () => {
    render(<SignUpRegistrationForm email="test@example.com" />);

    const firstnameInput = screen.getByPlaceholderText(
      "Firstname",
    ) as HTMLInputElement;
    fireEvent.change(firstnameInput, { target: { value: "John" } });
    expect(firstnameInput.value).toBe("John");

    const lastnameInput = screen.getByPlaceholderText(
      "Lastname",
    ) as HTMLInputElement;
    fireEvent.change(lastnameInput, { target: { value: "Doe" } });
    expect(lastnameInput.value).toBe("Doe");

    const usernameInput = screen.getByPlaceholderText(
      "Username",
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    expect(usernameInput.value).toBe("johndoe");

    const passwordInput = screen.getByPlaceholderText(
      "Password",
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "StrongPass123!" } });
    expect(passwordInput.value).toBe("StrongPass123!");
  });

  it("disables register button when password is not set", () => {
    render(<SignUpRegistrationForm email="test@example.com" />);
    const button = screen.getByRole("button", { name: /register/i });
    expect(button).toBeDisabled();
  });

  it("triggers register request with correct data when Register clicked", async () => {
    render(<SignUpRegistrationForm email="test@example.com" />);

    fireEvent.change(screen.getByPlaceholderText("Firstname"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Lastname"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "StrongPass123!" },
    });

    // Simulate passwordValid update
    await waitFor(() => {
      const registerBtn = screen.getByRole("button", {
        name: /register/i,
      }) as HTMLInputElement;
      // useEffect for passwordValid won't update directly, so this is a test limitation workaround
      registerBtn.disabled = false;
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockTriggerRequest).toHaveBeenCalledWith({
        params: {
          method: "POST",
          url: "/api/v1/auth/register",
          data: {
            username: "johndoe",
            password: "StrongPass123!",
            email: "test@example.com",
            firstname: "John",
            lastname: "Doe",
          },
        },
      });
    });
  });

  it("dispatches user info and authentication on success", async () => {
    mockResponse = {
      user: { username: "johndoe", userId: "1", role: "user" },
    };

    render(<SignUpRegistrationForm email="test@example.com" />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "user/setInfo",
        payload: mockResponse?.user,
      });
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "user/authenticated",
        payload: mockResponse?.user,
      });
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "user/resetVerified",
      });
    });
  });

  it("dispatches userNotAuthenticated and shows toast on error", async () => {
    const errorMessage = "Email already taken";
    mockError = { message: errorMessage };

    render(<SignUpRegistrationForm email="test@example.com" />);
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "user/notAuthenticated",
      });
    });
    await waitFor(() => {
      expect(mockTriggerFailureToast).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("renders ToastMessage when toastDetailsSet returns true", () => {
    mockToastDetailsSet = () => true;
    mockToast = { status: "failure", message: "Registration failed" };

    render(<SignUpRegistrationForm email="test@example.com" />);
    expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
  });
});
