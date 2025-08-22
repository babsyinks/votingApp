import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSelector } from "react-redux";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Admin from "pages/Admin";
import * as useAxiosHook from "hooks/useAxios";
import * as useToastMessageHook from "hooks/useToastMessage";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("hooks/useAxios");
jest.mock("hooks/useToastMessage");
jest.mock("features/admin/components/AdminElectionDelete", () => () => <div>AdminElectionDelete</div>);
jest.mock("features/admin/components/AdminFormDetails", () => (props) => (
  <div data-testid="admin-form-details">
    AdminFormDetails
    <button onClick={() => props.setIsDisabled(false)}>Enable Submit</button>
    <button onClick={() => props.setFormData({ name: "Test Candidate" })}>Set Form Data</button>
  </div>
));
jest.mock("features/admin/components/AdminDataToolTipsBtnsList", () => (props) => (
  <div data-testid="tooltips-list">
    AdminDataToolTipsBtnsList
    <button
      onClick={props.handleSubmitVals}
      disabled={props.isSubmitBtnDisabled}
    >
      Submit
    </button>
  </div>
));
jest.mock("components/ui/ToastMessage", () => ({ toast }) => <div>ToastMessage: {toast?.message}</div>);

describe("Admin Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useSelector.mockReturnValue(true); // User is admin
    useNavigate.mockReturnValue(mockNavigate);

    useAxiosHook.useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: null,
    });

    useToastMessageHook.useToastMessage.mockReturnValue({
      toast: { message: "Success!" },
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
    useSelector.mockReturnValue(false);

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("enables submit button and triggers form submission", async () => {
    const mockTriggerRequest = jest.fn();
    useAxiosHook.useAxios.mockReturnValue({
      triggerRequest: mockTriggerRequest,
      response: null,
      error: null,
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
            data: { name: "Test Candidate" },
          }),
          useDefaultJsonHeader: false,
        })
      );
    });
  });

  it("shows success toast on successful response", () => {
    useAxiosHook.useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: { status: 200 },
      error: null,
    });

    const mockSuccess = jest.fn();
    useToastMessageHook.useToastMessage.mockReturnValue({
      toast: { message: "Success!" },
      triggerSuccessToast: mockSuccess,
      triggerFailureToast: jest.fn(),
      toastDetailsSet: () => true,
    });

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockSuccess).toHaveBeenCalledWith(
      "New Contestant Successfully Added!!!"
    );
  });

  it("shows error toast on failure response when error message is received", () => {
    useAxiosHook.useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: { message: "API Error" },
    });

    const mockFailure = jest.fn();
    useToastMessageHook.useToastMessage.mockReturnValue({
      toast: { message: "Failed!" },
      triggerSuccessToast: jest.fn(),
      triggerFailureToast: mockFailure,
      toastDetailsSet: () => true,
    });

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockFailure).toHaveBeenCalledWith("API Error");
  });

    it("shows error toast on failure response when error message is not received", () => {
    useAxiosHook.useAxios.mockReturnValue({
      triggerRequest: jest.fn(),
      response: null,
      error: { error: "Error" },
    });

    const mockFailure = jest.fn();
    useToastMessageHook.useToastMessage.mockReturnValue({
      toast: { message: "Failed!" },
      triggerSuccessToast: jest.fn(),
      triggerFailureToast: mockFailure,
      toastDetailsSet: () => true,
    });

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockFailure).toHaveBeenCalledWith("Something went wrong!");
  });
});
