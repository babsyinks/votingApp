import { renderHook } from "@testing-library/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useStatusOfElectionRedirect from "features/auth/hooks/useStatusOfElectionRedirect";
import { vi } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("useStatusOfElectionRedirect", () => {
  const mockNavigate = vi.fn();
  const mockUseNavigate = vi.mocked(useNavigate);
  const mockUseSelector = vi.mocked(useSelector);

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
