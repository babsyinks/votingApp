import { renderHook } from "@testing-library/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useStatusOfElectionRedirect from "features/auth/hooks/useStatusOfElectionRedirect";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("useStatusOfElectionRedirect", () => {
  const mockNavigate = jest.fn();
  const mockUseNavigate = jest.mocked(useNavigate);
  const mockUseSelector = jest.mocked(useSelector);

  beforeEach(() => {
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseSelector.mockReset();
    mockNavigate.mockReset();
  });

  it("returns an empty string if user is not authenticated", () => {
    mockUseSelector
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => "active");

    const { result } = renderHook(() => useStatusOfElectionRedirect());

    expect(result.current).toBe("");
  });

  it('returns "/vote" if user is authenticated and election is active', () => {
    mockUseSelector
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => "active");

    const { result } = renderHook(() => useStatusOfElectionRedirect());

    expect(result.current).toBe("/vote");
  });

  it('returns "/results" if user is authenticated and election ended', () => {
    mockUseSelector
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => "active_election_ended");

    const { result } = renderHook(() => useStatusOfElectionRedirect());

    expect(result.current).toBe("/results");
  });
});
