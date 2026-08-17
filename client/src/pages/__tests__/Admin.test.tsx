import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSelector } from "react-redux";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Admin from "pages/Admin";
import * as useAxiosHook from "hooks/useAxios";
import * as useToastMessageHook from "hooks/useToastMessage";
import type { AdminFormDetailsProps } from "features/admin/components/AdminFormDetails";
import type { AdminDataToolTipsBtnsListProps } from "features/admin/components/AdminDataToolTipsBtnsList";
import type { ToastMessageProps } from "components/ui/ToastMessage";
import { vi } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: vi.fn(),
}));
vi.mock("hooks/useAxios");
vi.mock("hooks/useToastMessage");
vi.mock("features/admin/components/AdminElectionDelete", () => () => (
  <div>AdminElectionDelete</div>
));

vi.mock(
  "features/admin/components/AdminFormDetails",
  () => (props: AdminFormDetailsProps) => (
    <div data-testid="admin-form-details">
      AdminFormDetails
      <button onClick={() => props.setIsDisabled(false)}>Enable Submit</button>
      <button
        onClick={() => {
          const formData = { surname: "Test Candidate" } as unknown as FormData;
          props.setFormData(formData);
        }}
      >
        Set Form Data
      </button>
    </div>
  ),
);
vi.mock(
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
vi.mock("components/ui/ToastMessage", () => ({ toast }: ToastMessageProps) => (
  <div>ToastMessage: {toast?.message}</div>
));

describe("Admin Component", () => {
  const mockNavigate = vi.fn();
  const mockUseSelector = vi.mocked(useSelector);
  const mockUseNavigate = vi.mocked(useNavigate);
  const mockUseAxios = vi.mocked(useAxiosHook.useAxios);
  const mockUseToastMessage = vi.mocked(useToastMessageHook.useToastMessage);

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSelector.mockReturnValue(true); // User is admin
    mockUseNavigate.mockReturnValue(mockNavigate);

    mockUseAxios.mockReturnValue({
      triggerRequest: vi.fn(),
      response: null,
      error: null,
      clearError: vi.fn(),
    });

    mockUseToastMessage.mockReturnValue({
      toast: { message: "Success!", status: "success" },
      triggerSuccessToast: vi.fn(),
      triggerFailureToast: vi.fn(),
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
    const mockTriggerRequest = vi.fn();
    mockUseAxios.mockReturnValue({
      triggerRequest: mockTriggerRequest,
      response: null,
      error: null,
      clearError: vi.fn(),
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
      triggerRequest: vi.fn(),
      response: { status: 200 },
      error: null,
      clearError: vi.fn(),
    });

    const mockSuccess = vi.fn();
    mockUseToastMessage.mockReturnValue({
      toast: { message: "Success!", status: "success" },
      triggerSuccessToast: mockSuccess,
      triggerFailureToast: vi.fn(),
      toastDetailsSet: () => true,
    });

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockSuccess).toHaveBeenCalledWith(
      "New Contestant Successfully Added!!!",
    );
  });

  it("shows error toast on failure response when error message is received", () => {
    mockUseAxios.mockReturnValue({
      triggerRequest: vi.fn(),
      response: null,
      error: { message: "API Error" },
      clearError: vi.fn(),
    });

    const mockFailure = vi.fn();
    mockUseToastMessage.mockReturnValue({
      toast: { message: "Failed!", status: "failure" },
      triggerSuccessToast: vi.fn(),
      triggerFailureToast: mockFailure,
      toastDetailsSet: () => true,
    });

    render(<Admin />, { wrapper: MemoryRouter });

    expect(mockFailure).toHaveBeenCalledWith("API Error");
  });
});
