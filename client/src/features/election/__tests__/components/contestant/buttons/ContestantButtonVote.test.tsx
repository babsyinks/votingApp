import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContestantButtonVote from "features/election/components/contestant/buttons/ContestantButtonVote";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import { updateVotes } from "features/election/electionSlice";
import { vi, type Mock } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));
vi.mock("hooks/useAxios", () => ({
  useAxios: vi.fn(),
}));
vi.mock("hooks/useToastMessage", () => ({
  useToastMessage: vi.fn(),
}));

vi.mock("features/election/electionSlice", () => ({
  updateVotes: vi.fn(),
}));

describe("ContestantButtonVote", () => {
  let mockDispatch: Mock;
  let mockTriggerRequest: Mock;
  let mockTriggerFailureToast: Mock;
  let mockTriggerSuccessToast: Mock;
  let mockedUseDispatch = vi.mocked(useDispatch);
  let mockedUseSelector = vi.mocked(useSelector);
  let mockedUseAxios = vi.mocked(useAxios);
  let mockedUseToastMessage = vi.mocked(useToastMessage);

  const defaultProps = {
    contestantId: "abc123",
    position: "president",
  };

  const mockUserId = "user42";

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockTriggerRequest = vi.fn();
    mockTriggerFailureToast = vi.fn();
    mockTriggerSuccessToast = vi.fn();

    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseSelector.mockImplementation((selector) =>
      selector === expect.any(Function)
        ? selector({ user: { userId: mockUserId } })
        : { userId: mockUserId },
    );
    mockedUseAxios.mockReturnValue({
      response: null,
      error: null,
      triggerRequest: mockTriggerRequest,
      clearError: vi.fn(),
    });
    mockedUseToastMessage.mockReturnValue({
      toast: { message: "Test toast", status: "success" },
      triggerSuccessToast: mockTriggerSuccessToast,
      triggerFailureToast: mockTriggerFailureToast,
      toastDetailsSet: () => true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders vote button enabled by default", () => {
    render(<ContestantButtonVote {...defaultProps} />);
    const button = screen.getByRole("button", { name: /vote/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("disables button when clicked and calls triggerRequest", async () => {
    render(<ContestantButtonVote {...defaultProps} />);
    const button = screen.getByRole("button", { name: /vote/i });

    fireEvent.click(button);
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(mockTriggerRequest).toHaveBeenCalledWith({
        params: {
          method: "POST",
          url: "/api/v1/election/vote",
          data: {
            userId: mockUserId,
            contestantId: defaultProps.contestantId,
            position: defaultProps.position,
          },
        },
      });
    });
  });

  it("dispatches updateVotes when response is present", async () => {
    const mockResponse = {
      positionVotes: ["id1", "id2", "id3", "id4", "id5"],
      contestantVotes: ["id1", "id2", "id3"],
    };

    mockedUseAxios.mockReturnValue({
      response: mockResponse,
      error: null,
      triggerRequest: mockTriggerRequest,
      clearError: vi.fn(),
    });

    render(<ContestantButtonVote {...defaultProps} />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        updateVotes({
          positionVotes: mockResponse.positionVotes,
          contestantVotes: mockResponse.contestantVotes,
          contestantId: defaultProps.contestantId,
          position: defaultProps.position,
        }),
      );
    });
  });

  it("triggers toast error when error is present", async () => {
    mockedUseAxios.mockReturnValue({
      response: null,
      error: {message: "Some error" },
      triggerRequest: mockTriggerRequest,
      clearError: vi.fn(),
    });

    render(<ContestantButtonVote {...defaultProps} />);

    await waitFor(() => {
      expect(mockTriggerFailureToast).toHaveBeenCalledWith(
        "An error occured! Try again later.",
      );
    });
  });
});
