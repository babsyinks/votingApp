import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminDataToolTipsBtnsList from "../components/AdminDataToolTipsBtnsList";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock(
  "../components/AdminDataToolTipBtn",
  () =>
    ({ data, disabled, className, onClick, children }) => (
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

jest.mock("components/ui/I", () => ({ className }) => (
  <i data-testid="icon" className={className}></i>
));

jest.mock("../helpers/tooltipBtnDetails", () => () => [
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
  const mockNavigate = jest.fn();
  const mockUseSelector = useSelector;

  beforeEach(() => {
    mockUseSelector.mockImplementation(() => false);
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the submit button with loading icon when loading is true", () => {
    mockUseSelector.mockReturnValue(true);

    render(<AdminDataToolTipsBtnsList isSubmitBtnDisabled={false} handleSubmitVals={jest.fn()} />);

    const submitBtn = screen.getByTestId("tooltip-btn-Add A New Contestant");
    const icon = screen.getAllByTestId("icon")[0];

    expect(submitBtn).toBeInTheDocument();
    expect(icon).toHaveClass("fas fa-circle-notch fa-spin fa-xs");
  });

  it("renders submit button normally when loading is false", () => {
    mockUseSelector.mockReturnValue(false);

    render(<AdminDataToolTipsBtnsList isSubmitBtnDisabled={false} handleSubmitVals={jest.fn()} />);

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
