/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import Container from "layout/Container";
import useOrientation from "hooks/useOrientation";
import { ContainerProps } from "layout/Container";
import type { FlexDirection } from "layout/Container";

jest.mock("hooks/useOrientation");
const mockedUseOrientation = useOrientation as jest.MockedFunction<
  typeof useOrientation
>;

describe("Container Component", () => {
  // Default props for testing
  const defaultProps: ContainerProps = {
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
    mockedUseOrientation.mockReturnValue(true);
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
    const customProps: ContainerProps = {
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
    mockedUseOrientation.mockReturnValue(true); // Portrait
    const propsWithFlip: ContainerProps = {
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
    mockedUseOrientation.mockReturnValue(false); // Landscape
    const propsWithFlip: ContainerProps = {
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

  interface inputToExpectedCheckInterface {
    input: FlexDirection;
    expected: FlexDirection;
  }

  const inputToExpectedCheck: Array<inputToExpectedCheckInterface> = [
    { input: "row", expected: "column" },
    { input: "column", expected: "row" },
    { input: "row-reverse", expected: "column-reverse" },
    { input: "column-reverse", expected: "row-reverse" },
  ];

  test.each(inputToExpectedCheck)(
    "flips flex direction from $input to $expected in portrait mode",
    ({ input, expected }) => {
      mockedUseOrientation.mockReturnValue(true); // Portrait
      render(
        <Container
          {...defaultProps}
          flexDirection={input}
          flipDirectionOnOrientationChange={true}
        />,
      );
      const container = screen.getByText("Child Content").parentElement;
      expect(container).toHaveStyle({
        flexDirection: expected,
      });
    },
  );

  test("does not apply flex direction flip when flipDirectionOnOrientationChange is false", () => {
    mockedUseOrientation.mockReturnValue(true); // Portrait
    render(
      <Container
        {...defaultProps}
        flexDirection="row"
        flipDirectionOnOrientationChange={false}
      />,
    );
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveStyle({
      flexDirection: "row", // Original direction
    });
  });
});
