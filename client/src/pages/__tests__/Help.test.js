import React from "react";
import { render, screen } from "@testing-library/react";
import Help from "pages/Help";

jest.mock("features/help/components/HelpMessage", () => ({
  __esModule: true,
  default: () => <div data-testid="HelpMessage" />,
}));

jest.mock("features/help/components/HelpMeans", () => ({
  __esModule: true,
  default: () => <div data-testid="HelpMeans" />,
}));

jest.mock("features/help/components/HelpFootNote", () => ({
  __esModule: true,
  default: () => <div data-testid="HelpFootNote" />,
}));

jest.mock("layout/MultiLayerWrapper", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="MultiLayerWrapper">{children}</div>,
}));

describe("Help Component", () => {
  it("renders MultiLayerWrapper", () => {
    render(<Help />);
    expect(screen.getByTestId("MultiLayerWrapper")).toBeInTheDocument();
  });

  it("renders HelpMessage", () => {
    render(<Help />);
    expect(screen.getByTestId("HelpMessage")).toBeInTheDocument();
  });

  it("renders HelpMeans", () => {
    render(<Help />);
    expect(screen.getByTestId("HelpMeans")).toBeInTheDocument();
  });

  it("renders HelpFootNote", () => {
    render(<Help />);
    expect(screen.getByTestId("HelpFootNote")).toBeInTheDocument();
  });
});
