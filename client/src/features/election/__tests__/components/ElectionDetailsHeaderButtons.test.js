import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ElectionDetailsHeaderButtons from "features/election/components/ElectionDetailsHeaderButtons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAxios } from "hooks/useAxios";
import useOrientation from "hooks/useOrientation";
import { userNotAuthenticated } from "features/auth/userAuthSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("hooks/useOrientation", () => jest.fn());
jest.mock("hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("components/ui/Block", () => ({ children, type }) => (
  <div data-testid={`block-${type}`}>{children}</div>
));

jest.mock(
  "features/election/components/ElectionDetailsHeaderButton",
  () =>
    ({ onClick, btnLabel, className }) => (
      <button onClick={onClick} className={className} data-testid={`btn-${btnLabel}`}>
        {btnLabel}
      </button>
    ),
);

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockTriggerRequest = jest.fn(() => Promise.resolve());

describe("ElectionDetailsHeaderButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);
    useAxios.mockReturnValue({ triggerRequest: mockTriggerRequest });
    useOrientation.mockReturnValue(true); // portrait
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
    expect(screen.getByTestId("btn-Admin In")).toHaveClass("mb-5");
  });

  it("sets the right block type and class for landscape orientation", () => {
    useOrientation.mockReturnValue(false);
    render(<ElectionDetailsHeaderButtons role="admin" />);

    expect(screen.getByTestId("block-flex-horz-sb")).toBeInTheDocument();
    expect(screen.getByTestId("btn-Admin In")).toHaveClass("mr-5");
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
