import React from "react";
import { render, screen, within } from "@testing-library/react";
import HelpMeansWhatsApp from "features/help/components/HelpMeansWhatsApp";

jest.mock("components/ui/Block", () => ({ children, className }) => (
  <div data-testid="block" className={className}>
    {children}
  </div>
));

jest.mock("components/ui/A", () => ({ children, ...props }) => (
  <a data-testid="link" {...props}>
    {children}
  </a>
));

jest.mock("components/ui/I", () => ({ className }) => (
  <i data-testid="icon" className={className}></i>
));

describe("HelpMeansWhatsApp component", () => {
  const phoneNumber = "2348051750010";

  it("renders correct WhatsApp link, button, and slideInLeft for slot 1", () => {
    render(<HelpMeansWhatsApp phoneNumber={phoneNumber} helpDeskSlot={1} />);

    const block = screen.getByTestId("block");
    expect(block).toHaveClass("slideInLeft");

    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute(
      "href",
      `https://api.whatsapp.com/send?phone=${phoneNumber}`
    );
    expect(link).toHaveAttribute("target", "_blank");

    const button = within(link).getByRole("button", {
      name: /chat help desk 1/i,
    });
    expect(button).toBeInTheDocument();

    const icon = screen.getByTestId("icon");
    expect(icon).toHaveClass("fab", "fa-whatsapp");
  });

  it("renders slideInRight for slot 2", () => {
    render(<HelpMeansWhatsApp phoneNumber={phoneNumber} helpDeskSlot={2} />);
    const block = screen.getByTestId("block");
    expect(block).toHaveClass("slideInRight");
  });
});
