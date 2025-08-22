import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminElectionDelete from "features/admin/components/AdminElectionDelete";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "hooks/useAxios";
import { useToastMessage } from "hooks/useToastMessage";
import { setTimerData } from "features/timer/timerSlice";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("hooks/useToastMessage", () => ({
  useToastMessage: jest.fn(),
}));

jest.mock("components/ui/ToastMessage", () => ({ toast }) => (
  <div data-testid="toast">{toast.message}</div>
));

jest.mock(
  "features/admin/components/AdminElectionDeleteWarningModal",
  () =>
    ({ openModal, setOpenModal, deleteElection }) =>
      openModal ? (
        <div data-testid="modal">
          <button onClick={deleteElection} data-testid="confirm-delete">
            Confirm Delete
          </button>
          <button onClick={() => setOpenModal(false)}>Close</button>
        </div>
      ) : null,
);

jest.mock("features/admin/components/AdminElectionDeleteButton", () => ({ setOpenModal }) => (
  <button onClick={() => setOpenModal(true)} data-testid="open-modal">
    Open Modal
  </button>
));

describe("AdminElectionDelete", () => {
  const mockDispatch = jest.fn();
  const mockTriggerRequest = jest.fn();
  const mockTriggerSuccessToast = jest.fn();
  const mockTriggerFailureToast = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useAxios.mockReturnValue({
      response: null,
      error: null,
      triggerRequest: mockTriggerRequest,
    });
    useToastMessage.mockReturnValue({
      toast: { message: "Test toast" },
      triggerSuccessToast: mockTriggerSuccessToast,
      triggerFailureToast: mockTriggerFailureToast,
      toastDetailsSet: () => true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render anything when status is not "active_election_ended"', () => {
    useSelector.mockReturnValue("inactive");

    render(<AdminElectionDelete />);
    expect(screen.queryByTestId("open-modal")).not.toBeInTheDocument();
    expect(screen.getByTestId("toast")).toBeInTheDocument();
  });

  it("renders modal and button when election has ended", () => {
    useSelector.mockReturnValue("active_election_ended");

    render(<AdminElectionDelete />);
    expect(screen.getByTestId("open-modal")).toBeInTheDocument();
  });

  it("opens modal and calls deleteElection on confirm", async () => {
    useSelector.mockReturnValue("active_election_ended");

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
    useSelector.mockReturnValue("active_election_ended");

    useAxios.mockReturnValue({
      response: true,
      error: null,
      triggerRequest: mockTriggerRequest,
    });

    render(<AdminElectionDelete />);

    await waitFor(() => {
      expect(mockTriggerSuccessToast).toHaveBeenCalledWith("Election successfully ended!!!");
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setTimerData({}));
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(updateElectionStatusFromTimer({}));
    });
  });

  it("shows failure toast on error", async () => {
    useSelector.mockReturnValue("active_election_ended");

    useAxios.mockReturnValue({
      response: null,
      error: true,
      triggerRequest: mockTriggerRequest,
    });

    render(<AdminElectionDelete />);

    await waitFor(() => {
      expect(mockTriggerFailureToast).toHaveBeenCalledWith("Election could not be ended!!!");
    });
  });
});
