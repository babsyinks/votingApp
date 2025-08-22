import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminElectionDeleteWarningModal from "features/admin/components/AdminElectionDeleteWarningModal";

jest.mock("components/ui/Block", () => ({ children }) => <div data-testid="block">{children}</div>);

jest.mock(
  "components/modal/Modal",
  () =>
    ({ message, positiveBtnTxt, negativeBtnTxt, positiveHandler, negativeHandler }) => (
      <div data-testid="modal">
        <p>{message}</p>
        <button onClick={positiveHandler} data-testid="yes-btn">
          {positiveBtnTxt}
        </button>
        <button onClick={negativeHandler} data-testid="no-btn">
          {negativeBtnTxt}
        </button>
      </div>
    ),
);

describe("AdminElectionDeleteWarningModal", () => {
  const expectedMessage =
    "Election Result And Timer Will Be Deleted. Are You Sure You Want To Proceed?";

  it("does not render Modal when openModal is false", () => {
    render(
      <AdminElectionDeleteWarningModal
        openModal={false}
        setOpenModal={jest.fn()}
        deleteElection={jest.fn()}
      />,
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("renders Modal with correct message when openModal is true", () => {
    render(
      <AdminElectionDeleteWarningModal
        openModal={true}
        setOpenModal={jest.fn()}
        deleteElection={jest.fn()}
      />,
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('calls deleteElection when "Yes" button is clicked', () => {
    const mockDelete = jest.fn();

    render(
      <AdminElectionDeleteWarningModal
        openModal={true}
        setOpenModal={jest.fn()}
        deleteElection={mockDelete}
      />,
    );

    fireEvent.click(screen.getByTestId("yes-btn"));
    expect(mockDelete).toHaveBeenCalled();
  });

  it('calls setOpenModal(false) when "No" button is clicked', () => {
    const mockSetOpenModal = jest.fn();

    render(
      <AdminElectionDeleteWarningModal
        openModal={true}
        setOpenModal={mockSetOpenModal}
        deleteElection={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("no-btn"));
    expect(mockSetOpenModal).toHaveBeenCalledWith(false);
  });
});
