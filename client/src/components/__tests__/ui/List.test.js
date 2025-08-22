import React from "react";
import { render, screen } from "@testing-library/react";
import List from "components/ui/List";
import Li from "components/ui/Li";
import getCompClasses from "util/getCompClasses";

jest.mock("util/getCompClasses");

jest.mock("components/ui/List.module.css", () => ({
  ul: "default-ul",
  ol: "default-ol",
}));

describe("List component", () => {
  beforeEach(() => {
    getCompClasses.mockReturnValue("resolved-class");
  });

  it("renders an unordered list by default", () => {
    render(<List items={["Apple", "Banana"]} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(list).toHaveClass("default-ul resolved-class");
  });

  it("renders an ordered list when `as='ol'` is set", () => {
    render(<List as="ol" items={["One", "Two"]} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(list).toHaveClass("default-ol resolved-class");
  });

  it("renders list items using the `items` prop", () => {
    render(<List items={["Red", "Blue", "Green"]} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Red");
    expect(items[1]).toHaveTextContent("Blue");
    expect(items[2]).toHaveTextContent("Green");
  });

  it("renders children instead of items if children are provided", () => {
    render(
      <List>
        <Li>Custom 1</Li>
        <Li>Custom 2</Li>
      </List>,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Custom 1");
    expect(items[1]).toHaveTextContent("Custom 2");
  });

  it("applies additional className", () => {
    render(<List items={["One"]} className="extra-class" />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("resolved-class");
  });

  it("applies inline styles", () => {
    const style = { backgroundColor: "lightblue" };
    render(<List items={["Styled"]} style={style} />);
    const list = screen.getByRole("list");
    expect(list).toHaveStyle("background-color: lightblue");
  });

  it("renders list items with custom object format", () => {
    const customItems = [
      { id: "1", content: "Item A" },
      { id: "2", content: "Item B" },
    ];
    render(<List items={customItems} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Item A");
    expect(items[1]).toHaveTextContent("Item B");
  });
});
