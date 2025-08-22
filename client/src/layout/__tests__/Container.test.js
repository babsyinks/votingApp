/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import Container from "layout/Container";
import useOrientation from "hooks/useOrientation";

jest.mock("hooks/useOrientation");

describe("Container Component", () => {
  // Default props for testing
  const defaultProps = {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flexWrap: "nowrap",
    height: "100vh",
    width: "100vw",
    className: "",
    flipDirectionOnOrientationChange: false,
    children: <div>Child Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useOrientation.mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
  });

  test("uses default props if prop is not passed in", () => {
    render(
      <Container>
        <div>Child Content</div>
      </Container>,
    );
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      flexWrap: "nowrap",
      height: "100vh",
      width: "100vw",
    });
    expect(container).not.toHaveClass();
  });

  test("renders children correctly", () => {
    render(<Container {...defaultProps} />);
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  test("applies default props correctly", () => {
    render(<Container {...defaultProps} />);
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      flexWrap: "nowrap",
      height: "100vh",
      width: "100vw",
    });
  });

  test("applies custom props correctly", () => {
    const customProps = {
      ...defaultProps,
      justifyContent: "flex-start",
      alignItems: "flex-end",
      flexDirection: "row",
      flexWrap: "wrap",
      height: "50vh",
      width: "50vw",
      className: "custom-class",
    };
    render(<Container {...customProps} />);
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      flexDirection: "row",
      flexWrap: "wrap",
      height: "50vh",
      width: "50vw",
    });
    expect(container).toHaveClass("custom-class");
  });

  test("applies background image when provided", () => {
    const propsWithBackground = {
      ...defaultProps,
      backgroundImage: "url(/test-image.jpg)",
    };
    render(<Container {...propsWithBackground} />);
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      backgroundImage: "url(/test-image.jpg)",
    });
  });

  test("flips flex direction in portrait mode when flipDirectionOnOrientationChange is true", () => {
    useOrientation.mockReturnValue(true); // Portrait
    const propsWithFlip = {
      ...defaultProps,
      flexDirection: "row",
      flipDirectionOnOrientationChange: true,
    };
    render(<Container {...propsWithFlip} />);
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      flexDirection: "column", // Flipped from row to column
    });
  });

  test("does not flip flex direction in landscape mode when flipDirectionOnOrientationChange is true", () => {
    useOrientation.mockReturnValue(false); // Landscape
    const propsWithFlip = {
      ...defaultProps,
      flexDirection: "row",
      flipDirectionOnOrientationChange: true,
    };
    render(<Container {...propsWithFlip} />);
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      flexDirection: "row", // Original direction
    });
  });

  test.each([
    { input: "row", expected: "column" },
    { input: "column", expected: "row" },
    { input: "row-reverse", expected: "column-reverse" },
    { input: "column-reverse", expected: "row-reverse" },
  ])("flips flex direction from $input to $expected in portrait mode", ({ input, expected }) => {
    useOrientation.mockReturnValue(true); // Portrait
    render(
      <Container {...defaultProps} flexDirection={input} flipDirectionOnOrientationChange={true} />,
    );
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      flexDirection: expected,
    });
  });

  test("does not apply flex direction flip when flipDirectionOnOrientationChange is false", () => {
    useOrientation.mockReturnValue(true); // Portrait
    render(
      <Container {...defaultProps} flexDirection="row" flipDirectionOnOrientationChange={false} />,
    );
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      flexDirection: "row", // Original direction
    });
  });

  test("PropTypes validation does not throw for valid props", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Container {...defaultProps} />);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("PropTypes validation warns for invalid justifyContent", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Container {...defaultProps} justifyContent="invalid" />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Warning: Failed %s type: %s%s",
      "prop",
      'Invalid prop `justifyContent` of value `invalid` supplied to `Container`, expected one of ["flex-start","flex-end","start","end","left","right","center","space-around","space-between","space-evenly","stretch"].',
      expect.any(String),
    );
    consoleErrorSpy.mockRestore();
  });

  test("PropTypes validation warns for invalid alignItems", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Container {...defaultProps} alignItems="invalid" />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Warning: Failed %s type: %s%s",
      "prop",
      'Invalid prop `alignItems` of value `invalid` supplied to `Container`, expected one of ["flex-start","flex-end","start","end","center","baseline","stretch"].',
      expect.any(String),
    );
    consoleErrorSpy.mockRestore();
  });

  test("PropTypes validation warns for invalid flexDirection", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Container {...defaultProps} flexDirection="invalid" />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Warning: Failed %s type: %s%s",
      "prop",
      'Invalid prop `flexDirection` of value `invalid` supplied to `Container`, expected one of ["row","row-reverse","column","column-reverse"].',
      expect.any(String),
    );
    consoleErrorSpy.mockRestore();
  });
});
