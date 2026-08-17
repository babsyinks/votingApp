import { render, screen } from "@testing-library/react";
import HelpMeans from "features/help/components/HelpMeans";
import useBreakpoint from "hooks/useBreakpoint";
import { BlockProps } from "components/ui/Block";
import { HelpMeansWhatsAppProps } from "features/help/components/HelpMeansWhatsApp";
import { vi, type Mock } from "vitest";

vi.mock("features/help/data/helpNums", () => [
  "2348051750010",
  "2349154549010",
]);

vi.mock("hooks/useBreakpoint", () => vi.fn());

vi.mock(
  "components/ui/Block",
  () =>
    ({ children, type, className }: BlockProps) => (
      <div data-testid="block" data-type={type} className={className}>
        {children}
      </div>
    ),
);

vi.mock(
  "features/help/components/HelpMeansWhatsApp",
  () =>
    ({ phoneNumber, helpDeskSlot }: HelpMeansWhatsAppProps) => (
      <div
        data-testid={`whatsapp-${helpDeskSlot}`}
      >{`WhatsApp ${helpDeskSlot}: ${phoneNumber}`}</div>
    ),
);

vi.mock("features/help/components/HelpMeansEmail", () => () => (
  <div data-testid="email">Email Section</div>
));

describe("HelpMeans component", () => {
  const mockUseBreakpoint = useBreakpoint as Mock;
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders WhatsApp help with vertical layout on mobile", () => {
    mockUseBreakpoint.mockReturnValue("mobile");
    render(<HelpMeans />);

    const block = screen.getByTestId("block");
    expect(block).toHaveAttribute("data-type", "flex-vert");
    expect(block).toHaveClass("gap-1p5r mb-1p5r");

    const whatsapp1 = screen.getByTestId("whatsapp-1");
    const whatsapp2 = screen.getByTestId("whatsapp-2");
    expect(whatsapp1).toHaveTextContent("WhatsApp 1: 2348051750010");
    expect(whatsapp2).toHaveTextContent("WhatsApp 2: 2349154549010");

    const email = screen.getByTestId("email");
    expect(email).toBeInTheDocument();
  });

  it("renders WhatsApp help with horizontal layout on tablet/desktop", () => {
    mockUseBreakpoint.mockReturnValue("tablet");
    render(<HelpMeans />);

    const block = screen.getByTestId("block");
    expect(block).toHaveAttribute("data-type", "flex-horz-sa");

    const whatsapp1 = screen.getByTestId("whatsapp-1");
    const whatsapp2 = screen.getByTestId("whatsapp-2");
    expect(whatsapp1).toHaveTextContent("WhatsApp 1: 2348051750010");
    expect(whatsapp2).toHaveTextContent("WhatsApp 2: 2349154549010");

    const email = screen.getByTestId("email");
    expect(email).toBeInTheDocument();
  });
});
