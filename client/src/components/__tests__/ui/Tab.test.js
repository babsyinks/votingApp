import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tab from "components/ui/Tab";
import getCompClasses from "util/getCompClasses";

jest.mock("util/getCompClasses");
jest.mock("components/ui/Tab.module.css", () => ({
  tb: "default-tab-class",
}));

describe("<Tab />", () => {
  const labels = ["Home", "Profile", "Settings"];

  beforeEach(() => {
    getCompClasses.mockReturnValue("resolved-class");
    jest.clearAllMocks();
  });

  it("renders all tab labels", () => {
    render(<Tab labels={labels} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(labels.length);

    tabs.forEach((tab, i) => {
      expect(tab).toHaveTextContent(labels[i]);
      expect(tab).toHaveAttribute("id", `tab-${i}`);
      expect(tab).toHaveAttribute("aria-controls", `panel-${i}`);
      expect(tab).toHaveClass("default-tab-class resolved-class");
    });
  });

  it("sets the first tab as selected by default", () => {
    render(<Tab labels={labels} />);
    const tabs = screen.getAllByRole("tab");

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");

    for (let i = 1; i < tabs.length; i++) {
      expect(tabs[i]).toHaveAttribute("aria-selected", "false");
      expect(tabs[i]).toHaveAttribute("tabindex", "-1");
    }
  });

  it("updates selected tab on click", () => {
    render(<Tab labels={labels} />);
    const tabs = screen.getAllByRole("tab");

    // Click the second tab
    fireEvent.click(tabs[1]);

    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("tabindex", "0");

    // The first one should now be unselected
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[0]).toHaveAttribute("tabindex", "-1");
  });

  it("applies passed style and className to each tab", () => {
    const style = { color: "blue" };
    const className = "custom-class";

    render(<Tab labels={labels} className={className} style={style} />);
    const tabs = screen.getAllByRole("tab");

    tabs.forEach((tab) => {
      expect(tab).toHaveClass("default-tab-class resolved-class");
      expect(tab).toHaveStyle({ color: "blue" });
    });
  });

  it("sets equal width styles for tabs", () => {
    render(<Tab labels={labels} />);
    const expectedWidth = `${Math.floor(100 / labels.length) - 1}%`;

    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab) => {
      expect(tab.style.width).toBe(expectedWidth);
    });
  });

  it("has tablist role on the container", () => {
    render(<Tab labels={labels} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
    expect(tablist).toHaveAttribute("aria-label", "Tab list");
  });
});
