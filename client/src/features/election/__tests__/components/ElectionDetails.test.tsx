import { render, screen, waitFor } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import ElectionDetails from "features/election/components/ElectionDetails";
import { useAxios } from "hooks/useAxios";

import {
  userAuth,
  userAuthenticated,
  userNotAuthenticated,
} from "features/auth/userAuthSlice";
import {
  allElectionData,
  setAllElectionData,
} from "features/election/electionSlice";
import { setUserInfo } from "features/user/userSlice";
import { ElectionCategory } from "features/election/types/electionCategoryType";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("hooks/useAxios", () => ({
  useAxios: vi.fn(),
}));

vi.mock("features/election/components/ElectionDetailsAllData", () => ({
  __esModule: true,
  default: ({
    listOfElectionData,
  }: {
    listOfElectionData: ElectionCategory[];
  }) => <div data-testid="all-data">{JSON.stringify(listOfElectionData)}</div>,
}));

vi.mock("features/election/components/ElectionDetailsNoData", () => ({
  __esModule: true,
  default: () => <div data-testid="no-data">No Election Data</div>,
}));

describe("ElectionDetails", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  const mockUseDispatch = vi.mocked(useDispatch);
  const mockUseSelector = vi.mocked(useSelector);
  const mockUseNavigate = vi.mocked(useNavigate);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  const mockUseAxios = ({
    response = null,
    error = null,
  }: {
    response?: any;
    error?: any;
  }) => {
    const triggerRequest = vi.fn(() => Promise.resolve());
    (useAxios as Mock).mockReturnValue({
      response,
      error,
      triggerRequest,
    });
    return triggerRequest;
  };

  it("redirects to home if user is not authenticated", () => {
    mockUseSelector.mockImplementation((selectorFn) => {
      if (selectorFn === userAuth) return false;
      if (selectorFn === allElectionData) return [];
    });

    mockUseAxios({});

    render(<ElectionDetails />);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders ElectionDetailsNoData if election data is empty", async () => {
    mockUseSelector.mockImplementation((selectorFn) => {
      if (selectorFn === userAuth) return true;
      if (selectorFn === allElectionData) return [];
    });

    const mockResponse = {
      electionData: [],
      username: "testuser",
      userId: "123",
      role: "admin",
    };

    const triggerRequest = mockUseAxios({ response: mockResponse });

    render(<ElectionDetails />);
    await waitFor(() => expect(triggerRequest).toHaveBeenCalled());

    expect(mockDispatch).toHaveBeenCalledWith(setAllElectionData([]));
    expect(mockDispatch).toHaveBeenCalledWith(
      userAuthenticated({ role: "admin" }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      setUserInfo({ username: "testuser", userId: "123", role: "admin" }),
    );

    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });

  it("renders ElectionDetailsAllData if election data exists", async () => {
    const electionData = [{ position: "President", contestants: ["A", "B"] }];

    mockUseSelector.mockImplementation((selectorFn) => {
      if (selectorFn === userAuth) return true;
      if (selectorFn === allElectionData) return electionData;
    });

    const mockResponse = {
      electionData,
      username: "testuser",
      userId: "123",
      role: "user",
    };

    const triggerRequest = mockUseAxios({ response: mockResponse });

    render(<ElectionDetails />);
    await waitFor(() => expect(triggerRequest).toHaveBeenCalled());

    expect(screen.getByTestId("all-data")).toHaveTextContent("President");
  });

  it("dispatches userNotAuthenticated and navigates to home on error", async () => {
    mockUseSelector.mockImplementation((selectorFn) => {
      if (selectorFn === userAuth) return true;
      if (selectorFn === allElectionData) return [];
    });

    const triggerRequest = mockUseAxios({ error: "Some error" });

    render(<ElectionDetails />);
    await waitFor(() => expect(triggerRequest).toHaveBeenCalled());

    expect(mockDispatch).toHaveBeenCalledWith(userNotAuthenticated());
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
