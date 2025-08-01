import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInForm from "features/auth/components/signIn/SignInForm";
import { setUserInfo } from "features/user/userSlice";
import { userAuthenticated, userNotAuthenticated } from "features/auth/userAuthSlice";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockTriggerRequest = jest.fn();
const mockUser = { username: "john", userId: "1", role: "user" };
let mockResposne = { user: mockUser };
let mockError = null;
const mockTriggerFailureToast = jest.fn();
let mockToastDetailsSet = jest.fn(() => false);

jest.mock("hooks/useAxios", () => ({
  useAxios: () => ({
    triggerRequest: mockTriggerRequest,
    response: mockResposne,
    error: mockError,
  }),
}));

jest.mock("hooks/useToastMessage", () => ({
  useToastMessage: () => ({
    toast: { type: "error", message: "Invalid credentials" },
    triggerFailureToast: mockTriggerFailureToast,
    toastDetailsSet: mockToastDetailsSet,
  }),
}));

let mockRedirect = "";

jest.mock("features/auth/hooks/useStatusOfElectionRedirect", () => ({
  __esModule: true,
  default: () => mockRedirect,
}));

jest.mock("components/ui/ToastMessage", () => ({ toast }) => <div>Toast: {toast.message}</div>);
jest.mock("features/auth/components/AuthFieldUser", () => ({ value, onChange, placeholder }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} />
));
jest.mock("features/auth/components/AuthFieldPassword", () => ({ value, onChange }) => (
  <input type="password" value={value} onChange={onChange} placeholder="Password" />
));
jest.mock("features/auth/components/AuthButton", () => ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
));
jest.mock("features/auth/components/AuthAlternativeAccessMeans", () => ({ btnLabel }) => (
  <button>{btnLabel}</button>
));

describe("SignInForm", () => {
  beforeEach(() => {
    mockTriggerRequest.mockClear();
    mockDispatch.mockClear();
    mockNavigate.mockClear();
  });

  it("renders all fields and buttons", () => {
    render(<SignInForm />);

    expect(screen.getByPlaceholderText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /forgot password\?/i })).toBeInTheDocument();
  });

  it("enables Sign In button when both fields are filled", () => {
    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText(/username or email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Password123!" },
    });

    expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled();
  });

  it("triggers sign in request with email", async () => {
    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText(/username or email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockTriggerRequest).toHaveBeenCalledWith({
        params: {
          method: "POST",
          url: "/api/v1/auth/signin",
          data: {
            email: "user@example.com",
            password: "Password123!",
          },
        },
      });
    });
  });

  it("triggers sign in request with username", async () => {
    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText(/username or email/i), {
      target: { value: "myusername" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Secretpass1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockTriggerRequest).toHaveBeenCalledWith({
        params: {
          method: "POST",
          url: "/api/v1/auth/signin",
          data: {
            username: "myusername",
            password: "Secretpass1",
          },
        },
      });
    });
  });

  it("redirects if useStatusOfElectionRedirect returns a path", () => {
    mockRedirect = "/vote";
    render(<SignInForm />);
    expect(mockNavigate).toHaveBeenCalledWith("/vote", { replace: true });
  });

  it("dispatches user info and user authenticated actions on successful sign in", async () => {
    render(<SignInForm />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setUserInfo(mockUser));
    });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(userAuthenticated(mockUser));
    });
  });

  it("dispatches userNotAuthenticated and shows error toast on sign-in failure", async () => {
    mockResposne = null;
    mockError = { message: "Invalid credentials" };

    render(<SignInForm />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(userNotAuthenticated());
    });
    await waitFor(() => {
      expect(mockTriggerFailureToast).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("renders ToastMessage when toastDetailsSet returns true", () => {
    mockToastDetailsSet.mockReturnValueOnce(true);

    render(<SignInForm />);

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
