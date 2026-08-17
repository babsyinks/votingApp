import { render, screen } from "@testing-library/react";
import Section from "components/ui/Section";
import getCompClasses from "util/getCompClasses";
import { vi } from "vitest";

vi.mock("components/ui/Base.module.css", () => ({
  section: "base-section",
  "flex-vert": "base-flex-vert",
}));

vi.mock("util/getCompClasses");

const mockedGetCompClasses = vi.mocked(getCompClasses);

describe("<Section />", () => {
  beforeEach(() => {
    mockedGetCompClasses.mockReturnValue("resolved-class");
  });

  test("renders with default props", () => {
    render(<Section>Default Section</Section>);

    const section = screen.getByText("Default Section");
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveClass("base-section base-flex-vert resolved-class");
  });

  test("renders with specific type and className", () => {
    render(
      <Section type="flex-vert" className="custom-class">
        Custom Section
      </Section>,
    );

    const section = screen.getByText("Custom Section");
    expect(section).toHaveClass("base-flex-vert resolved-class");
  });

  test("applies inline style", () => {
    render(<Section style={{ padding: "10px" }}>Styled Section</Section>);
    const section = screen.getByText("Styled Section");
    expect(section).toHaveStyle({ padding: "10px" });
  });
});
