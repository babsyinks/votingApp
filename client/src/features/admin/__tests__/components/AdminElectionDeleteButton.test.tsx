import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminElectionDeleteButton from "features/admin/components/AdminElectionDeleteButton";
import { BlockProps } from "components/ui/Block";
import { ButtonProps } from "components/ui/Button";

jest.mock("components/ui/Block", () => ({ children, ...props }: BlockProps) => (
  <div data-testid="block" {...props}>
    {children}
  </div>
));

jest.mock("components/ui/Button", () => ({ children, onClick, ...props }: ButtonProps) => (
  <button data-testid="button" onClick={onClick} {...props}>
    {children}
  </button>
));

describe("AdminElectionDeleteButton", () => {
  it("renders the button inside Block", () => {
    const mockSetOpenModal = jest.fn();
    render(<AdminElectionDeleteButton setOpenModal={mockSetOpenModal} />);

    const block = screen.getByTestId("block");
    const button = screen.getByTestId("button");

    expect(block).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Delete This Election");
  });

  it("calls setOpenModal(true) when button is clicked", () => {
    const mockSetOpenModal = jest.fn();
    render(<AdminElectionDeleteButton setOpenModal={mockSetOpenModal} />);

    const button = screen.getByTestId("button");
    fireEvent.click(button);

    expect(mockSetOpenModal).toHaveBeenCalledWith(true);
    expect(mockSetOpenModal).toHaveBeenCalledTimes(1);
  });
});
