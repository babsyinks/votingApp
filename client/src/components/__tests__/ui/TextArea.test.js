import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextArea from "components/ui/TextArea";
import getCompClasses from "util/getCompClasses";

jest.mock("util/getCompClasses", () => jest.fn());
jest.mock("components/ui/TextArea.module.css", () => ({
  "txt-area": "default-textarea-class",
}));
jest.mock("hooks/useOrientation", () => jest.fn());

const mockUseOrientation = require("hooks/useOrientation");

describe("<TextArea />", () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      name: "comment",
      value: "Initial text",
      dimension: { rows: "5", cols: "60" },
      onChange: jest.fn(),
      placeholder: "Enter your comment",
    };
    getCompClasses.mockReturnValue("resolved-class");
    jest.clearAllMocks();
  });

  it("renders with default values", () => {
    mockUseOrientation.mockReturnValue(false); // landscape
    baseProps = {
      placeholder: "Enter your comment",
    };
    // Suppress expected console error temporarily
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<TextArea {...baseProps} />);

    const textarea = screen.getByPlaceholderText("Enter your comment");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("rows", "10");
    expect(textarea).toHaveAttribute("cols", "40");
    expect(textarea).toHaveAttribute("placeholder", "Enter your comment");
    expect(textarea).not.toBeDisabled();
    expect(textarea).toHaveClass("default-textarea-class resolved-class");
    expect(textarea).toHaveStyle({ resize: "none" });
    spy.mockRestore();
  });

  it("renders with given props in landscape mode (default)", () => {
    mockUseOrientation.mockReturnValue(false); // landscape

    render(<TextArea {...baseProps} />);

    const textarea = screen.getByPlaceholderText("Enter your comment");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Initial text");
    expect(textarea).toHaveAttribute("name", "comment");
    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveAttribute("cols", "60");
    expect(textarea).toHaveAttribute("placeholder", "Enter your comment");
    expect(textarea).toHaveClass("default-textarea-class resolved-class");
    expect(textarea).toHaveStyle({ resize: "none" });
  });

  it("overrides cols to 25 in portrait mode", () => {
    mockUseOrientation.mockReturnValue(true); // portrait

    render(<TextArea {...baseProps} />);
    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("cols", "25");
  });

  it("calls onChange when typing", () => {
    mockUseOrientation.mockReturnValue(false);

    render(<TextArea {...baseProps} />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "Updated text" } });
    expect(baseProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("applies custom className and style", () => {
    mockUseOrientation.mockReturnValue(false);

    const customStyle = { backgroundColor: "lightgray" };

    render(<TextArea {...baseProps} className="custom-class" style={customStyle} />);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveClass("default-textarea-class resolved-class");
    expect(textarea).toHaveStyle({ backgroundColor: "lightgray", resize: "none" });
  });

  it("sets accessibility attributes", () => {
    mockUseOrientation.mockReturnValue(false);

    render(
      <TextArea
        {...baseProps}
        ariaLabel="Comment field"
        ariaLabelledBy="comment-label"
        ariaDescribedBy="comment-hint"
      />,
    );

    const textarea = screen.getByLabelText("Comment field");
    expect(textarea).toHaveAttribute("aria-labelledby", "comment-label");
    expect(textarea).toHaveAttribute("aria-describedby", "comment-hint");
  });

  it("disables textarea when disabled=true", () => {
    mockUseOrientation.mockReturnValue(false);

    render(<TextArea {...baseProps} disabled />);
    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeDisabled();
  });
});
