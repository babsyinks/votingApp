import React from "react";
import { render, screen } from "@testing-library/react";
import MiniFeatureCard from "features/home/components/MiniFeatureCard";

const MockIcon = ({ className, size }) => (
  <svg
    data-testid="mock-icon"
    className={className}
    width={size}
    height={size}
  />
);

describe("MiniFeatureCard Component", () => {
  const defaultProps = {
    icon: MockIcon,
    title: "Feature Title",
    description: "This is the feature description.",
  };

  it("renders title and description", () => {
    render(<MiniFeatureCard {...defaultProps} />);
    expect(
      screen.getByRole("heading", { level: 3, name: /feature title/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this is the feature description./i)
    ).toBeInTheDocument();
  });

  it("renders the provided icon", () => {
    render(<MiniFeatureCard {...defaultProps} />);
    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("width", "90");
    expect(icon).toHaveAttribute("height", "90");
  });

  it("applies correct heading styles", () => {
    render(<MiniFeatureCard {...defaultProps} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass("text-xl fw-600");
  });

  it("renders description inside a paragraph", () => {
    render(<MiniFeatureCard {...defaultProps} />);
    const description = screen.getByText(/this is the feature description./i);
    expect(description).toHaveClass("text-grey-soft lh-1p6");
  });

  it("applies expected wrapper classes", () => {
    render(<MiniFeatureCard {...defaultProps} />);
    const wrapper = screen.getByTestId("framer-id");
    expect(wrapper).toHaveClass(
      "p-2r bg-white transition-bg transition-color bs-black-mixed-mild border-rounded-10"
    );
  });
});
