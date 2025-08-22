import React from "react";
import { render, screen } from "@testing-library/react";
import ToastMessage from "components/ui/ToastMessage";

jest.mock("components/ui/ToastMessage.module.css", () => ({
  display: "toast-display",
  success: "toast-success",
  failure: "toast-failure",
}));

describe("<ToastMessage />", () => {
  it("renders success message with correct role and class", () => {
    const toast = {
      status: "success",
      message: "Action completed successfully!",
    };

    render(<ToastMessage toast={toast} />);

    const toastElement = screen.getByRole("status");

    expect(toastElement).toBeInTheDocument();
    expect(toastElement).toHaveTextContent(toast.message);
    expect(toastElement).toHaveClass("toast-display");
    expect(toastElement).toHaveClass("toast-success");
    expect(toastElement).toHaveAttribute("aria-live", "assertive");
  });

  it("renders failure message with correct role and class", () => {
    const toast = {
      status: "failure",
      message: "An error occurred.",
    };

    render(<ToastMessage toast={toast} />);

    const toastElement = screen.getByRole("alert");

    expect(toastElement).toBeInTheDocument();
    expect(toastElement).toHaveTextContent(toast.message);
    expect(toastElement).toHaveClass("toast-display");
    expect(toastElement).toHaveClass("toast-failure");
    expect(toastElement).toHaveAttribute("aria-live", "assertive");
  });

  it("throws if required props are missing", () => {
    // Suppress expected console error temporarily
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ToastMessage />)).toThrow();

    spy.mockRestore();
  });
});
