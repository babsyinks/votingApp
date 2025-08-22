import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import OAuthSuccess from "pages/OAuthSuccess";
import * as userSlice from "features/user/userSlice";
import * as authSlice from "features/auth/userAuthSlice";
import * as useAxiosHook from "hooks/useAxios";
import useStatusOfElectionRedirect from "features/auth/hooks/useStatusOfElectionRedirect";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

jest.mock("features/auth/hooks/useStatusOfElectionRedirect");

jest.mock("components/ui/Paragraph", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe("OAuthSuccess", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects if redirect path is returned", () => {
    useStatusOfElectionRedirect.mockReturnValue("/dashboard");

    jest.spyOn(useAxiosHook, "useAxios").mockReturnValue({
      response: null,
      triggerRequest: jest.fn(),
      error: null,
    });

    render(<OAuthSuccess />);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("dispatches setUserInfo and userAuthenticated if response contains user", async () => {
    const mockUser = { id: "123", name: "Test User" };

    useStatusOfElectionRedirect.mockReturnValue("");
    jest.spyOn(useAxiosHook, "useAxios").mockReturnValue({
      response: { user: mockUser },
      triggerRequest: jest.fn(),
      error: null,
    });

    render(<OAuthSuccess />);

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(userSlice.setUserInfo(mockUser)));

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(authSlice.userAuthenticated(mockUser)),
    );
  });

  it("dispatches userNotAuthenticated and redirects to /signin if error occurs", async () => {
    useStatusOfElectionRedirect.mockReturnValue("");
    jest.spyOn(useAxiosHook, "useAxios").mockReturnValue({
      response: null,
      triggerRequest: jest.fn(),
      error: new Error("Something went wrong"),
    });

    render(<OAuthSuccess />);

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(authSlice.userNotAuthenticated()),
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/signin"));
  });

  it("renders loading text", () => {
    useStatusOfElectionRedirect.mockReturnValue("");
    jest.spyOn(useAxiosHook, "useAxios").mockReturnValue({
      response: null,
      triggerRequest: jest.fn(),
      error: null,
    });

    render(<OAuthSuccess />);
    expect(screen.getByText("Logging you in...")).toBeInTheDocument();
  });
});
