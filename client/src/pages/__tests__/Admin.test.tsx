import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSelector } from "react-redux";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Admin from "pages/Admin";
import * as useAxiosHook from "hooks/useAxios";
import * as useToastMessageHook from "hooks/useToastMessage";
import type { AdminFormDetailsProps } from "features/admin/components/AdminFormDetails";
import type { AdminDataToolTipsBtnsListProps } from "features/admin/components/AdminDataToolTipsBtnsList";
import type { ToastMessageProps } from "components/ui/ToastMessage";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("hooks/useAxios");
jest.mock("hooks/useToastMessage");
jest.mock("features/admin/components/AdminElectionDelete", () => () => (
  <div>AdminElectionDelete</div>
));

jest.mock(
  "features/admin/components/AdminFormDetails",
  () => (props: AdminFormDetailsProps) => (
    <div data-testid="admin-form-details">
      AdminFormDetails
      <button onClick={() => props.setIsDisabled(false)}>Enable Submit</button>
      <button
        onClick={() => {
          const formData = { surname: "Test Candidate" } as unknown as FormData
          props.setFormData(formData);
        }}
      >
        Set Form Data
      </button>
    </div>
  ),
);
jest.mock(
  "features/admin/components/AdminDataToolTipsBtnsList",
  () => (props: AdminDataToolTipsBtnsListProps) => (
    <div data-testid="tooltips-list">
      AdminDataToolTipsBtnsList
      <button
        onClick={props.handleSubmitVals}
        disabled={props.isSubmitBtnDisabled}
      >
        Submit
      </button>
    </div>
  ),
);
jest.mock(
  "components/ui/ToastMessage",
  () =>
    ({ toast }: ToastMessageProps) => <div>ToastMessage: {toast?.message}</div>,
);

describe("Admin Component", () => {
  const mockNavigate = jest.fn();
  const mockUseSelector = jest.mocked(useSelector);
  const mockUseNavigate = jest.mocked(useNavigate);
  const mockUseAxios = jest.mocked(useAxiosHook.useAxios);
  const mockUseToastMessage = jest.mocked(useToastMessageHook.useToastMessage);

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSelector.mockReturnValue(true); // User is admin
    mockUseNavigate.mockReturnValue(mockNavigate);

    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: null,
      clearError: jest.fn(),
    });

    mockUseToastMessage.mockReturnValue({
      toast: { message: "Success!", status: "success" },
      triggerSuccessToast: jest.fn(),
      triggerFailureToast: jest.fn(),
      toastDetailsSet: () => true,
    });
  });

  it("renders all admin sections when user is admin", () => {
    render(<Admin />, { wrapper: MemoryRouter });

    expect(screen.getByText("AdminElectionDelete")).toBeInTheDocument();
    expect(screen.getByText("AdminFormDetails")).toBeInTheDocument();
    expect(screen.getByText("AdminDataToolTipsBtnsList")).toBeInTheDocument();
    expect(screen.getByText(/ToastMessage/)).toBeInTheDocument();
  });

  it("redirects to home when user is not admin", () => {
    mockUseSelector.mockReturnValue(false);

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("enables submit button and triggers form submission", async () => {
    const mockTriggerRequest = jest.fn();
    mockUseAxios.mockReturnValue({
      triggerRequest: mockTriggerRequest,
      response: null,
      error: null,
      clearError: jest.fn(),
    });

    render(<Admin />, { wrapper: MemoryRouter });

    // Simulate enabling submit button
    fireEvent.click(screen.getByText("Enable Submit"));
    fireEvent.click(screen.getByText("Set Form Data"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockTriggerRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            method: "POST",
            url: "/api/v1/election/contestants",
            data: { surname: "Test Candidate" },
          }),
          useDefaultJsonHeader: false,
        }),
      );
    });
  });

  it("shows success toast on successful response", () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: { status: 200 },
      error: null,
      clearError: jest.fn(),
    });

    const mockSuccess = jest.fn();
    mockUseToastMessage.mockReturnValue({
      toast: { message: "Success!", status: "success" },
      triggerSuccessToast: mockSuccess,
      triggerFailureToast: jest.fn(),
      toastDetailsSet: () => true,
    });

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockSuccess).toHaveBeenCalledWith(
      "New Contestant Successfully Added!!!",
    );
  });

  it("shows error toast on failure response when error message is received", () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: { message: "API Error" },
      clearError: jest.fn(),
    });

    const mockFailure = jest.fn();
    mockUseToastMessage.mockReturnValue({
      toast: { message: "Failed!", status: "failure" },
      triggerSuccessToast: jest.fn(),
      triggerFailureToast: mockFailure,
      toastDetailsSet: () => true,
    });

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockFailure).toHaveBeenCalledWith("API Error");
  });
});
