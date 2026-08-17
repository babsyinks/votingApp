import { render, screen, fireEvent } from "@testing-library/react";
import TextArea from "components/ui/TextArea";
import getCompClasses from "util/getCompClasses";
import { TextAreaProps } from "components/ui/TextArea";
import { vi } from "vitest";

vi.mock("util/getCompClasses", () => vi.fn());
vi.mock("components/ui/TextArea.module.css", () => ({
  "txt-area": "default-textarea-class",
}));
vi.mock("hooks/useOrientation", () => vi.fn());

const mockUseOrientation = require("hooks/useOrientation");

const mockedGetCompClasses = vi.mocked(getCompClasses);

describe("<TextArea />", () => {
  let baseProps: TextAreaProps;

  beforeEach(() => {
    baseProps = {
      name: "comment",
      value: "Initial text",
      dimension: { rows: 5, cols: 60 },
      onChange: vi.fn(),
      placeholder: "Enter your comment",
    };
    mockedGetCompClasses.mockReturnValue("resolved-class");
    vi.clearAllMocks();
  });

  it("renders with default values", () => {
    mockUseOrientation.mockReturnValue(false); // landscape
    baseProps = {
      name: "comment",
      value: "Initial text",
      onChange: vi.fn(),
      placeholder: "Enter your comment",
    };
    // Suppress expected console error temporarily
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

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

    render(
      <TextArea {...baseProps} className="custom-class" style={customStyle} />,
    );

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveClass("default-textarea-class resolved-class");
    expect(textarea).toHaveStyle({
      backgroundColor: "lightgray",
      resize: "none",
    });
  });

  it("sets accessibility attributes", () => {
    mockUseOrientation.mockReturnValue(false);

    render(
      <TextArea
        {...baseProps}
        aria-label="Comment field"
        aria-labelledby="comment-label"
        aria-describedby="comment-hint"
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
