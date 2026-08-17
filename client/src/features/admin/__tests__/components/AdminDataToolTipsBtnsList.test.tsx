import { render, screen, fireEvent } from "@testing-library/react";
import AdminDataToolTipsBtnsList from "features/admin/components/AdminDataToolTipsBtnsList";
import { AdminDataToolTipBtnProps } from "features/admin/components/AdminDataToolTipBtn";
import { IProps } from "components/ui/I";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock(
  "features/admin/components/AdminDataToolTipBtn",
  () =>
    ({ data, disabled, className, onClick, children }: AdminDataToolTipBtnProps) => (
      <button
        data-testid={`tooltip-btn-${data}`}
        disabled={disabled}
        className={className}
        onClick={onClick}
      >
        {children}
      </button>
    ),
);

vi.mock("components/ui/I", () => ({ className }: IProps) => (
  <i data-testid="icon" className={className}></i>
));

vi.mock("features/admin/helpers/tooltipBtnDetails", () => () => [
  {
    data: "Add A New Contestant",
    compClass: "shd-grn",
    route: null,
    iClasses: "fa-plus",
  },
  {
    data: "Go To The Home Page",
    compClass: "shd-vlt",
    route: "/",
    iClasses: "fa-home",
  },
]);

describe("AdminDataToolTipsBtnsList", () => {
  const mockNavigate = vi.fn();
  const mockUseSelector = vi.mocked(useSelector);
  const mockUseNavigate = vi.mocked(useNavigate)

  beforeEach(() => {
    mockUseSelector.mockImplementation(() => false);
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the submit button with loading icon when loading is true", () => {
    mockUseSelector.mockReturnValue(true);

    render(<AdminDataToolTipsBtnsList isSubmitBtnDisabled={false} handleSubmitVals={vi.fn()} />);

    const submitBtn = screen.getByTestId("tooltip-btn-Add A New Contestant");
    const icon = screen.getAllByTestId("icon")[0];

    expect(submitBtn).toBeInTheDocument();
    expect(icon).toHaveClass("fas fa-circle-notch fa-spin fa-xs");
  });

  it("renders submit button normally when loading is false", () => {
    mockUseSelector.mockReturnValue(false);

    render(<AdminDataToolTipsBtnsList isSubmitBtnDisabled={false} handleSubmitVals={vi.fn()} />);

    const icon = screen.getAllByTestId("icon")[0];
    expect(icon).toHaveClass("fas fa-plus");
  });

  it("disables submit button when isSubmitBtnDisabled is true", () => {
    render(<AdminDataToolTipsBtnsList isSubmitBtnDisabled={true} handleSubmitVals={() => {}} />);

    const submitBtn = screen.getByTestId("tooltip-btn-Add A New Contestant");
    expect(submitBtn).toBeDisabled();
  });

  it("calls navigate on home button click", () => {
    render(<AdminDataToolTipsBtnsList isSubmitBtnDisabled={false} handleSubmitVals={() => {}} />);

    const homeBtn = screen.getByTestId("tooltip-btn-Go To The Home Page");
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
