import React from "react";
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
import { allElectionData, setAllElectionData } from "features/election/electionSlice";
import { setUserInfo } from "features/user/userSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("features/election/components/ElectionDetailsAllData", () => ({
  __esModule: true,
  default: ({ listOfElectionData }) => (
    <div data-testid="all-data">{JSON.stringify(listOfElectionData)}</div>
  ),
}));

jest.mock("features/election/components/ElectionDetailsNoData", () => ({
  __esModule: true,
  default: () => <div data-testid="no-data">No Election Data</div>,
}));

describe("ElectionDetails", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
  });

  const mockUseAxios = ({ response = null, error = null }) => {
    const triggerRequest = jest.fn(() => Promise.resolve());
    useAxios.mockReturnValue({
      response,
      error,
      triggerRequest,
    });
    return triggerRequest;
  };

  it("redirects to home if user is not authenticated", () => {
    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn === userAuth) return false;
      if (selectorFn === allElectionData) return [];
    });

    mockUseAxios({});

    render(<ElectionDetails />);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders ElectionDetailsNoData if election data is empty", async () => {
    useSelector.mockImplementation((selectorFn) => {
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
    expect(mockDispatch).toHaveBeenCalledWith(userAuthenticated({ role: "admin" }));
    expect(mockDispatch).toHaveBeenCalledWith(
      setUserInfo({ username: "testuser", userId: "123", role: "admin" })
    );

    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });

  it("renders ElectionDetailsAllData if election data exists", async () => {
    const electionData = [
      { position: "President", contestants: ["A", "B"] },
    ];

    useSelector.mockImplementation((selectorFn) => {
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
    useSelector.mockImplementation((selectorFn) => {
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
