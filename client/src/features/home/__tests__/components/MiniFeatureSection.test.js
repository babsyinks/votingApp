import React from "react";
import { render, screen } from "@testing-library/react";
import MiniFeatureSection from "features/home/components/MiniFeatureSection";

jest.mock("features/home/components/MiniFeatureCard", () => ({ title, description, icon: Icon }) => (
  <div data-testid="framer-id">
    {Icon && <span data-testid="icon">{Icon.name}</span>}
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
));

describe("MiniFeatureSection Component", () => {
  const mockSection = {
    title: "Our Features",
    contents: [
      {
        id: 1,
        title: "Feature One",
        description: "Description of feature one",
        icon: function MockIcon() {},
      },
      {
        id: 2,
        title: "Feature Two",
        description: "Description of feature two",
        icon: function AnotherMockIcon() {},
      },
    ],
  };

  it("renders the section heading", () => {
    render(<MiniFeatureSection section={mockSection} />);
    expect(
      screen.getByRole("heading", { level: 2, name: /our features/i })
    ).toBeInTheDocument();
  });

  it("renders all MiniFeatureCards from section.contents", () => {
    render(<MiniFeatureSection section={mockSection} />);
    const cards = screen.getAllByTestId("framer-id");
    expect(cards).toHaveLength(2);
  });

  it("passes the correct title and description to MiniFeatureCard", () => {
    render(<MiniFeatureSection section={mockSection} />);
    expect(screen.getByText("Feature One")).toBeInTheDocument();
    expect(screen.getByText("Description of feature one")).toBeInTheDocument();
    expect(screen.getByText("Feature Two")).toBeInTheDocument();
    expect(screen.getByText("Description of feature two")).toBeInTheDocument();
  });

  it("renders icons inside MiniFeatureCard", () => {
    render(<MiniFeatureSection section={mockSection} />);
    const icons = screen.getAllByTestId("icon");
    expect(icons).toHaveLength(2);
    expect(icons[0]).toHaveTextContent("MockIcon");
    expect(icons[1]).toHaveTextContent("AnotherMockIcon");
  });
});
