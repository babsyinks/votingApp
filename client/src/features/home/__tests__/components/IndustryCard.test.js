import { render, screen } from "@testing-library/react";
import IndustryCard from "features/home/components/IndustryCard";

describe("IndustryCard component", () => {
  const mockName = "Corporate Bodies";

  it("renders without crashing", () => {
    render(<IndustryCard name={mockName} />);
    const card = screen.getByTestId("framer-id");
    expect(card).toBeInTheDocument();
  });

  it("displays the correct industry name", () => {
    render(<IndustryCard name={mockName} />);
    expect(screen.getByText(mockName)).toBeInTheDocument();
  });

  it("applies the correct class names", () => {
    render(<IndustryCard name={mockName} />);
    const card = screen.getByTestId("framer-id");
    expect(card).toHaveClass(
      "bg-white",
      "border-2-aqua",
      "bs-black-mixed-mild",
      "border-rounded-1r",
      "p-1r",
      "flex",
      "align-items-center",
      "justify-content-center",
      "ta-center",
      "text-black-firm",
      "fw-500"
    );
  });

  it("renders children inside the motion.div mock", () => {
    render(<IndustryCard name={mockName} />);
    const card = screen.getByTestId("framer-id");
    expect(card.textContent).toBe(mockName);
  });
});
