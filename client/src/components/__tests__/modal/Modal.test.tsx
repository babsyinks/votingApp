import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "components/modal/Modal";
import { ModalProps } from "components/modal/Modal";
import { ButtonProps } from "components/ui/Button";

jest.mock(
  "components/ui/Button",
  () =>
    ({ children, ...props }: ButtonProps) => (
      <button {...props}>{children}</button>
    ),
);

describe("Modal", () => {
  let defaultProps: ModalProps;

  beforeEach(() => {
    jest.clearAllMocks();
    defaultProps = {
      message: "Are you sure you want to proceed?",
      positiveBtnTxt: "Yes",
      negativeBtnTxt: "No",
      positiveHandler: jest.fn(),
      negativeHandler: jest.fn(),
      ariaLabel: "Confirmation Modal",
      ariaLabelledBy: "modal-title",
      ariaDescribedBy: "modal-description",
    };
  });

  test("renders modal with message and both buttons", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  test("has correct accessibility attributes", () => {
    render(<Modal {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", defaultProps.ariaLabel);
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      defaultProps.ariaLabelledBy,
    );
    expect(dialog).toHaveAttribute(
      "aria-describedby",
      defaultProps.ariaDescribedBy,
    );

    const description = screen.getByText(defaultProps.message);
    expect(description).toHaveAttribute("id", defaultProps.ariaDescribedBy);
  });

  test("calls positiveHandler when confirm button is clicked", () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByText("Yes"));
    expect(defaultProps.positiveHandler).toHaveBeenCalledTimes(1);
  });

  test("calls negativeHandler when cancel button is clicked", () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByText("No"));
    expect(defaultProps.negativeHandler).toHaveBeenCalledTimes(1);
  });

  test("renders only confirm button if negativeBtnTxt is not provided", () => {
    delete defaultProps.negativeBtnTxt;
    render(<Modal {...defaultProps} />);

    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.queryByText("No")).not.toBeInTheDocument();
  });

  test("renders only cancel button if positiveBtnTxt is not provided", () => {
    delete defaultProps.positiveBtnTxt;
    render(<Modal {...defaultProps} />);

    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.queryByText("Yes")).not.toBeInTheDocument();
  });
});
