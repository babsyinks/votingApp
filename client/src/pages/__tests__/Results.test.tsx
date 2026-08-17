import { render, screen, waitFor } from "@testing-library/react";
import Results from "../Results";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAxios } from "hooks/useAxios";
import type { ElectionCategory } from "features/election/types/electionCategoryType";
import { vi } from "vitest";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));
vi.mock("hooks/useAxios");

vi.mock(
  "features/results/components/ResultsAll",
  () =>
    ({ result }: { result: ElectionCategory[] }) => (
      <div data-testid="results-all">{result.length} results</div>
    ),
);
vi.mock("features/results/components/ResultsRemoved", () => () => (
  <div data-testid="results-removed">No Results</div>
));
vi.mock("features/results/components/ResultsNotAvailable", () => () => (
  <div data-testid="results-na">Not Available</div>
));

describe("Results component", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  const mockUseDispatch = vi.mocked(useDispatch);
  const mockUseNavigate = vi.mocked(useNavigate);
  const mockUseSelector = vi.mocked(useSelector);
  const mockUseAxios = vi.mocked(useAxios);

  beforeEach(() => {
    vi.clearAllMocks();
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
      triggerRequest: vi.fn(),
      response: null,
      error: null,
      clearError: vi.fn(),
    });

    render(<Results />);

    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  it("dispatches fetchThenSetCurrentTimerStatus", async () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: vi.fn(),
      response: null,
      error: null,
      clearError: vi.fn(),
    });

    render(<Results />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("renders ResultsAll when election ended and results exist", async () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: vi.fn(),
      response: { electionData: [{ id: 1 }, { id: 2 }] },
      error: null,
      clearError: vi.fn(),
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
      triggerRequest: vi.fn(),
      response: { electionData: [] },
      error: null,
      clearError: vi.fn(),
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
      triggerRequest: vi.fn(),
      response: { electionData: [{ id: 1 }] },
      error: null,
      clearError: vi.fn(),
    });

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByTestId("results-na")).toBeInTheDocument();
    });
  });

  it("dispatches userNotAuthenticated and redirects on error", async () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: vi.fn(),
      response: null,
      error: { message: "Some error" },
      clearError: vi.fn(),
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
