import { render, screen, waitFor } from "@testing-library/react";
import Results from "../Results";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAxios } from "hooks/useAxios";
import type { ElectionCategory } from "features/election/types/electionCategoryType";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("hooks/useAxios");

jest.mock(
  "features/results/components/ResultsAll",
  () =>
    ({ result }: { result: ElectionCategory[] }) => (
      <div data-testid="results-all">{result.length} results</div>
    ),
);
jest.mock("features/results/components/ResultsRemoved", () => () => (
  <div data-testid="results-removed">No Results</div>
));
jest.mock("features/results/components/ResultsNotAvailable", () => () => (
  <div data-testid="results-na">Not Available</div>
));

describe("Results component", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockUseDispatch = jest.mocked(useDispatch);
  const mockUseNavigate = jest.mocked(useNavigate);
  const mockUseSelector = jest.mocked(useSelector);
  const mockUseAxios = jest.mocked(useAxios);

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseSelector.mockImplementation((selector) => {
      if (selector.name === "userAuth") return true;
      if (selector.name === "electionStatus") return "active_election_ended";
    });
  });

  it("redirects to /signin if user is not authenticated", () => {
    mockUseSelector.mockImplementation((selector) => {
      if (selector.name === "userAuth") return false;
      if (selector.name === "electionStatus") return "active_election_ended";
    });

    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: null,
      clearError: jest.fn(),
    });

    render(<Results />);

    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  it("dispatches fetchThenSetCurrentTimerStatus", async () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: null,
      clearError: jest.fn(),
    });

    render(<Results />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("renders ResultsAll when election ended and results exist", async () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: { electionData: [{ id: 1 }, { id: 2 }] },
      error: null,
      clearError: jest.fn(),
    });

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByTestId("results-all")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("results-all")).toHaveTextContent("2 results");
    });
  });

  it("renders ResultsRemoved when election ended and no results", async () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: { electionData: [] },
      error: null,
      clearError: jest.fn(),
    });

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByTestId("results-removed")).toBeInTheDocument();
    });
  });

  it("renders ResultsNotAvailable when election is still ongoing", async () => {
    mockUseSelector.mockImplementation((selector) => {
      if (selector.name === "userAuth") return true;
      if (selector.name === "electionStatus") return "active_election_live";
    });

    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: { electionData: [{ id: 1 }] },
      error: null,
      clearError: jest.fn(),
    });

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByTestId("results-na")).toBeInTheDocument();
    });
  });

  it("dispatches userNotAuthenticated and redirects on error", async () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: { message: "Some error" },
      clearError: jest.fn(),
    });

    render(<Results />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });
  });
});
