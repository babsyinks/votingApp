import React from "react";
import { render, screen } from "@testing-library/react";
import Section from "components/ui/Section";
import getCompClasses from "util/getCompClasses";

jest.mock("components/ui/Base.module.css", () => ({
  section: "base-section",
  "flex-vert": "base-flex-vert",
}));

jest.mock("util/getCompClasses");

jest.mock("components/accessibility/AccessibleWrapper");

describe("<Section />", () => {
  beforeEach(() => {
    getCompClasses.mockReturnValue("resolved-class");
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
      </Section>
    );

    const section = screen.getByText("Custom Section");
    expect(section).toHaveClass("base-flex-vert resolved-class");
  });

  test("applies inline style", () => {
    render(<Section style={{ padding: "10px" }}>Styled Section</Section>);
    const section = screen.getByText("Styled Section");
    expect(section).toHaveStyle({ padding: "10px" });
  });

  test("wraps with AccessibleWrapper when withAccessibility is true", () => {
    render(
      <Section withAccessibility role="region" ariaLabel="section-label">
        Accessible Section
      </Section>
    );

    const wrapper = screen.getByLabelText("section-label");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute("role", "region");
    expect(screen.getByText("Accessible Section")).toBeInTheDocument();
  });

  test("does not wrap with AccessibleWrapper when withAccessibility is false", () => {
    render(<Section withAccessibility={false}>Non-accessible Section</Section>);

    const section = screen.getByText("Non-accessible Section");
    expect(section.tagName).toBe("SECTION");
    expect(section).toBeInTheDocument();
  });
});
