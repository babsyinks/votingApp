
import { render, screen, waitFor } from "@testing-library/react";
import OAuthSuccess from "pages/OAuthSuccess";
import * as userSlice from "features/user/userSlice";
import * as authSlice from "features/auth/userAuthSlice";
import * as useAxiosHook from "hooks/useAxios";
import useStatusOfElectionRedirect from "features/auth/hooks/useStatusOfElectionRedirect";
import type { ParagraphProps } from "components/ui/Paragraph";
import { vi } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>(
    "react-redux",
  );

  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock("features/auth/hooks/useStatusOfElectionRedirect");

vi.mock("components/ui/Paragraph", () => ({
  __esModule: true,
  default: ({ children }: ParagraphProps) => <div>{children}</div>,
}));

describe("OAuthSuccess", () => {
  const mockUseStatusOfElectionRedirect = vi.mocked(
    useStatusOfElectionRedirect,
  );
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects if redirect path is returned", () => {
    mockUseStatusOfElectionRedirect.mockReturnValue("/dashboard");

    vi.spyOn(useAxiosHook, "useAxios").mockReturnValue({
      response: null,
      triggerRequest: vi.fn(),
      error: null,
      clearError: vi.fn(),
    });

    render(<OAuthSuccess />);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("dispatches setUserInfo and userAuthenticated if response contains user", async () => {
    const mockUser = { username: "John", userId: "123", role: "user" };

    mockUseStatusOfElectionRedirect.mockReturnValue("");
    vi.spyOn(useAxiosHook, "useAxios").mockReturnValue({
      response: { user: mockUser },
      triggerRequest: vi.fn(),
      error: null,
      clearError: vi.fn(),
    });

    render(<OAuthSuccess />);

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        userSlice.setUserInfo(mockUser),
      ),
    );

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        authSlice.userAuthenticated(mockUser),
      ),
    );
  });

  it("dispatches userNotAuthenticated and redirects to /signin if error occurs", async () => {
    mockUseStatusOfElectionRedirect.mockReturnValue("");
    vi.spyOn(useAxiosHook, "useAxios").mockReturnValue({
      response: null,
      triggerRequest: vi.fn(),
      error: new Error("Something went wrong"),
      clearError: vi.fn(),
    });

    render(<OAuthSuccess />);

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        authSlice.userNotAuthenticated(),
      ),
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/signin"));
  });

  it("renders loading text", () => {
    mockUseStatusOfElectionRedirect.mockReturnValue("");
    vi.spyOn(useAxiosHook, "useAxios").mockReturnValue({
      response: null,
      triggerRequest: vi.fn(),
      error: null,
      clearError: vi.fn(),
    });

    render(<OAuthSuccess />);
    expect(screen.getByText("Logging you in...")).toBeInTheDocument();
  });
});
