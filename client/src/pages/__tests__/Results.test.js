import { render, screen, waitFor } from "@testing-library/react";
import Results from "../Results";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAxios } from "hooks/useAxios";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("hooks/useAxios");

jest.mock("features/results/components/ResultsAll", () => ({ result }) => (
  <div data-testid="results-all">{result.length} results</div>
));
jest.mock("features/results/components/ResultsRemoved", () => () => (
  <div data-testid="results-removed">No Results</div>
));
jest.mock("features/results/components/ResultsNotAvailable", () => () => (
  <div data-testid="results-na">Not Available</div>
));

describe("Results component", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockImplementation((selector) => {
      if (selector.name === "userAuth") return true;
      if (selector.name === "electionStatus") return "active_election_ended";
    });
  });

  it("redirects to /signin if user is not authenticated", () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === "userAuth") return false;
      if (selector.name === "electionStatus") return "active_election_ended";
    });

    useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: null,
    });

    render(<Results />);

    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  it("dispatches fetchThenSetCurrentTimerStatus", async () => {
    useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: null,
    });

    render(<Results />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("renders ResultsAll when election ended and results exist", async () => {
    useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: { electionData: [{ id: 1 }, { id: 2 }] },
      error: null,
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
    useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: { electionData: [] },
      error: null,
    });

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByTestId("results-removed")).toBeInTheDocument();
    });
  });

  it("renders ResultsNotAvailable when election is still ongoing", async () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === "userAuth") return true;
      if (selector.name === "electionStatus") return "active_election_live";
    });

    useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: { electionData: [{ id: 1 }] },
      error: null,
    });

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByTestId("results-na")).toBeInTheDocument();
    });
  });

  it("dispatches userNotAuthenticated and redirects on error", async () => {
    useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: true,
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
