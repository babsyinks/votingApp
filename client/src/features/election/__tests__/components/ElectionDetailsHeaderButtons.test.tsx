import { render, screen, fireEvent } from "@testing-library/react";
import ElectionDetailsHeaderButtons from "features/election/components/ElectionDetailsHeaderButtons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAxios } from "hooks/useAxios";
import useOrientation from "hooks/useOrientation";
import { userNotAuthenticated } from "features/auth/userAuthSlice";
import { BlockProps } from "components/ui/Block";
import { ElectionDetailsHeaderButtonProps } from "features/election/components/ElectionDetailsHeaderButton";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("hooks/useOrientation", () => vi.fn());
vi.mock("hooks/useAxios", () => ({
  useAxios: vi.fn(),
}));

vi.mock("components/ui/Block", () => ({ children, type }: BlockProps) => (
  <div data-testid={`block-${type}`}>{children}</div>
));

vi.mock(
  "features/election/components/ElectionDetailsHeaderButton",
  () =>
    ({ onClick, btnLabel, className }: ElectionDetailsHeaderButtonProps) => (
      <button
        onClick={onClick}
        className={className}
        data-testid={`btn-${btnLabel}`}
      >
        {btnLabel}
      </button>
    ),
);

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
const mockTriggerRequest = vi.fn(() => Promise.resolve());

describe("ElectionDetailsHeaderButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useDispatch as Mock).mockReturnValue(mockDispatch);
    (useAxios as Mock).mockReturnValue({
      triggerRequest: mockTriggerRequest,
    });
    (useOrientation as Mock).mockReturnValue(true); // portrait
  });

  it("renders both buttons for admin role", () => {
    render(<ElectionDetailsHeaderButtons role="admin" />);

    expect(screen.getByTestId("btn-Admin In")).toBeInTheDocument();
    expect(screen.getByTestId("btn-Sign Out")).toBeInTheDocument();
  });

  it("renders only Sign Out button for non-admin role", () => {
    render(<ElectionDetailsHeaderButtons role="user" />);

    expect(screen.queryByTestId("btn-Admin In")).not.toBeInTheDocument();
    expect(screen.getByTestId("btn-Sign Out")).toBeInTheDocument();
  });

  it("sets the right block type and class for portrait orientation", () => {
    render(<ElectionDetailsHeaderButtons role="admin" />);

    expect(screen.getByTestId("block-flex-vert-sb")).toBeInTheDocument();
    expect(screen.getByTestId("btn-Admin In")).toHaveClass("mb-5p");
  });

  it("sets the right block type and class for landscape orientation", () => {
    (useOrientation as Mock).mockReturnValue(false);
    render(<ElectionDetailsHeaderButtons role="admin" />);

    expect(screen.getByTestId("block-flex-horz-sb")).toBeInTheDocument();
    expect(screen.getByTestId("btn-Admin In")).toHaveClass("mr-5p");
  });

  it("navigates to /admin when admin clicks Admin In", () => {
    render(<ElectionDetailsHeaderButtons role="admin" />);

    fireEvent.click(screen.getByTestId("btn-Admin In"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("Does not navigate to /admin if user is not admin", () => {
    render(<ElectionDetailsHeaderButtons role="admin" />);

    fireEvent.click(screen.getByTestId("btn-Admin In"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("signs out user and dispatches logout action", async () => {
    render(<ElectionDetailsHeaderButtons role="admin" />);

    fireEvent.click(screen.getByTestId("btn-Sign Out"));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockTriggerRequest).toHaveBeenCalledWith({
      params: { method: "POST", url: "/api/v1/auth/signout" },
    });

    expect(mockDispatch).toHaveBeenCalledWith(userNotAuthenticated());
  });
});
