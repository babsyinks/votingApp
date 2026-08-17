import { render, screen } from "@testing-library/react";
import { LucideIcon } from "lucide-react";
import MiniFeatureSection from "features/home/components/MiniFeatureSection";
import type { FeatureSection } from "features/home/data/featureCardConfig";
import type { MiniFeatureCardProps } from "features/home/components/MiniFeatureCard";
import { vi } from "vitest";

vi.mock(
  "features/home/components/MiniFeatureCard",
  () =>
    ({ title, description, icon: Icon }: MiniFeatureCardProps) => (
      <div data-testid="framer-id">
        {Icon && <span data-testid="icon">{Icon.name}</span>}
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    ),
);

describe("MiniFeatureSection Component", () => {
  const mockSection: FeatureSection = {
    title: "Our Features",
    contents: [
      {
        id: '1',
        title: "Feature One",
        description: "Description of feature one",
        icon: function MockIcon() {} as unknown as LucideIcon,
      },
      {
        id: '2',
        title: "Feature Two",
        description: "Description of feature two",
        icon: function AnotherMockIcon() {} as unknown as LucideIcon,
      },
    ],
  };

  it("renders the section heading", () => {
    render(<MiniFeatureSection section={mockSection} />);
    expect(
      screen.getByRole("heading", { level: 2, name: /our features/i }),
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
