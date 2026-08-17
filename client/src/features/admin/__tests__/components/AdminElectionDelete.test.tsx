
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminElectionDelete from "features/admin/components/AdminElectionDelete";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import { setTimerData } from "features/timer/timerSlice";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";
import { AdminElectionDeleteWarningModalProps } from "features/admin/components/AdminElectionDeleteWarningModal";
import { AdminElectionDeleteButtonProps } from "features/admin/components/AdminElectionDeleteButton";
import { ToastMessageProps } from "components/ui/ToastMessage";
import { vi } from "vitest";

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

vi.mock(
  "components/ui/ToastMessage",
  () =>
    ({ toast }: ToastMessageProps) => (
      <div data-testid="toast">{toast.message}</div>
    ),
);

vi.mock(
  "features/admin/components/AdminElectionDeleteWarningModal",
  () =>
    ({
      openModal,
      setOpenModal,
      deleteElection,
    }: AdminElectionDeleteWarningModalProps) =>
      openModal ? (
        <div data-testid="modal">
          <button onClick={deleteElection} data-testid="confirm-delete">
            Confirm Delete
          </button>
          <button onClick={() => setOpenModal(false)}>Close</button>
        </div>
      ) : null,
);

vi.mock(
  "features/admin/components/AdminElectionDeleteButton",
  () =>
    ({ setOpenModal }: AdminElectionDeleteButtonProps) => (
      <button onClick={() => setOpenModal(true)} data-testid="open-modal">
        Open Modal
      </button>
    ),
);

describe("AdminElectionDelete", () => {
  const mockDispatch = vi.fn();
  const mockTriggerRequest = vi.fn();
  const mockTriggerSuccessToast = vi.fn();
  const mockTriggerFailureToast = vi.fn();
  const mockedUseDispatch = vi.mocked(useDispatch);
  const mockedUseAxios = vi.mocked(useAxios);
  const mockedUseToastMessage = vi.mocked(useToastMessage);
  const mockedUseSelector = vi.mocked(useSelector);
  beforeEach(() => {
    mockedUseDispatch.mockReturnValue(mockDispatch);
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

  it('does not render anything when status is not "active_election_ended"', () => {
    mockedUseSelector.mockReturnValue("inactive");

    render(<AdminElectionDelete />);
    expect(screen.queryByTestId("open-modal")).not.toBeInTheDocument();
    expect(screen.getByTestId("toast")).toBeInTheDocument();
  });

  it("renders modal and button when election has ended", () => {
    mockedUseSelector.mockReturnValue("active_election_ended");

    render(<AdminElectionDelete />);
    expect(screen.getByTestId("open-modal")).toBeInTheDocument();
  });

  it("opens modal and calls deleteElection on confirm", async () => {
    mockedUseSelector.mockReturnValue("active_election_ended");

    render(<AdminElectionDelete />);

    fireEvent.click(screen.getByTestId("open-modal"));
    expect(await screen.findByTestId("modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("confirm-delete"));
    expect(mockTriggerRequest).toHaveBeenCalledWith({
      params: {
        method: "DELETE",
        url: "/api/v1/election/delete",
      },
    });
  });

  it("dispatches and shows success toast on response", async () => {
    mockedUseSelector.mockReturnValue("active_election_ended");

    mockedUseAxios.mockReturnValue({
      response: true,
      error: null,
      triggerRequest: mockTriggerRequest,
      clearError: vi.fn(),
    });

    render(<AdminElectionDelete />);

    await waitFor(() => {
      expect(mockTriggerSuccessToast).toHaveBeenCalledWith(
        "Election successfully ended!!!",
      );
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setTimerData({}));
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        updateElectionStatusFromTimer({}),
      );
    });
  });

  it("shows failure toast on error", async () => {
    mockedUseSelector.mockReturnValue("active_election_ended");

    mockedUseAxios.mockReturnValue({
      response: null,
      error: { message: "error" },
      triggerRequest: mockTriggerRequest,
      clearError: vi.fn(),
    });

    render(<AdminElectionDelete />);

    await waitFor(() => {
      expect(mockTriggerFailureToast).toHaveBeenCalledWith(
        "Election could not be ended!!!",
      );
    });
  });
});
