import React from "react";
import { render, screen } from "@testing-library/react";
import ElectionDetailsHeader from "features/election/components/ElectionDetailsHeader";

import useOrientation from "hooks/useOrientation";
import { useSelector } from "react-redux";

jest.mock("hooks/useOrientation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("components/ui/Block", () => ({ children, type, ...props }) => (
  <div data-testid={`mock-block-${type}`} {...props}>
    {children}
  </div>
));

jest.mock("features/election/components/ElectionDetailsHeaderButtons", () => () => (
  <div data-testid="buttons" />
));
jest.mock("features/election/components/ElectionDetailsHeaderHomeIcon", () => () => (
  <div data-testid="home-icon" />
));
jest.mock(
  "features/election/components/ElectionDetailsHeaderMessage",
  () =>
    ({ message, username }) => <div data-testid="message">{`${message} ${username}`}</div>,
);

describe("ElectionDetailsHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with portrait font size and all child components", () => {
    useSelector.mockImplementation(() => ({
      username: "JaneDoe",
      role: "admin",
    }));
    useOrientation.mockReturnValue(true); // portrait

    render(<ElectionDetailsHeader message="Welcome" />);

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByTestId("message")).toHaveTextContent("Welcome JaneDoe");
    expect(screen.getByTestId("buttons")).toBeInTheDocument();
    expect(screen.getByTestId("mock-block-flex-horz-sb")).toHaveClass("text-3vh");
  });

  it("uses landscape font size when orientation is not portrait", () => {
    useSelector.mockImplementation(() => ({
      username: "JohnDoe",
      role: "voter",
    }));
    useOrientation.mockReturnValue(false); // landscape

    render(<ElectionDetailsHeader message="Hello" />);

    expect(screen.getByTestId("message")).toHaveTextContent("Hello JohnDoe");
    expect(screen.getByTestId("mock-block-flex-horz-sb")).toHaveClass("text-2vw");
  });
});
