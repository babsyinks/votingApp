/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen } from "@testing-library/react";
import Grid from "layout/Grid";
import defaultStyle from "layout/Grid.module.css";
import getCompClasses from "util/getCompClasses";

jest.mock("util/getCompClasses");

describe("Grid component", () => {
  beforeEach(() => {
    getCompClasses.mockReturnValue("resolved-class");
  });

  it("renders children correctly", () => {
    render(
      <Grid>
        <p>Test Content</p>
      </Grid>,
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies the default grid class", () => {
    render(
      <Grid>
        <p>Default Grid</p>
      </Grid>,
    );
    const div = screen.getByText("Default Grid").parentElement;
    expect(div.className).toContain(defaultStyle.grid);
  });

  it("merges custom className using getCompClasses", () => {
    render(
      <Grid className="resolved-class">
        <span>With Class</span>
      </Grid>,
    );
    const div = screen.getByText("With Class").parentElement;
    expect(div.className).toBe("grid resolved-class");
  });

  it("applies inline styles", () => {
    const style = { backgroundColor: "red", padding: "1rem" };
    render(
      <Grid style={style}>
        <span>Styled Grid</span>
      </Grid>,
    );
    const div = screen.getByText("Styled Grid").parentElement;
    expect(div).toHaveStyle("background-color: red");
    expect(div).toHaveStyle("padding: 1rem");
  });
});
