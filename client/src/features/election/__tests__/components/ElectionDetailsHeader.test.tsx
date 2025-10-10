import { render, screen } from "@testing-library/react";
import ElectionDetailsHeader from "features/election/components/ElectionDetailsHeader";
import useOrientation from "hooks/useOrientation";
import { useSelector } from "react-redux";
import { BlockProps } from "components/ui/Block";
import { ElectionDetailsHeaderMessageProps } from "features/election/components/ElectionDetailsHeaderMessage";

jest.mock("hooks/useOrientation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock(
  "components/ui/Block",
  () =>
    ({ children, type, ...props }: BlockProps) => (
      <div data-testid={`mock-block-${type}`} {...props}>
        {children}
      </div>
    ),
);

jest.mock(
  "features/election/components/ElectionDetailsHeaderButtons",
  () => () => <div data-testid="buttons" />,
);
jest.mock(
  "features/election/components/ElectionDetailsHeaderHomeIcon",
  () => () => <div data-testid="home-icon" />,
);
jest.mock(
  "features/election/components/ElectionDetailsHeaderMessage",
  () =>
    ({ message, username }: ElectionDetailsHeaderMessageProps) => (
      <div data-testid="message">{`${message} ${username}`}</div>
    ),
);

describe("ElectionDetailsHeader", () => {
  let useSelectorMock = useSelector as jest.Mock;
  let useOrientationMock = useOrientation as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with portrait font size and all child components", () => {
    useSelectorMock.mockImplementation(() => ({
      username: "JaneDoe",
      role: "admin",
    }));
    useOrientationMock.mockReturnValue(true); // portrait

    render(<ElectionDetailsHeader message="Welcome" />);

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByTestId("message")).toHaveTextContent("Welcome JaneDoe");
    expect(screen.getByTestId("buttons")).toBeInTheDocument();
    expect(screen.getByTestId("mock-block-flex-horz-sb")).toHaveClass(
      "text-3vh",
    );
  });

  it("uses landscape font size when orientation is not portrait", () => {
    useSelectorMock.mockImplementation(() => ({
      username: "JohnDoe",
      role: "voter",
    }));
    useOrientationMock.mockReturnValue(false); // landscape

    render(<ElectionDetailsHeader message="Hello" />);

    expect(screen.getByTestId("message")).toHaveTextContent("Hello JohnDoe");
    expect(screen.getByTestId("mock-block-flex-horz-sb")).toHaveClass(
      "text-2vw",
    );
  });
});
