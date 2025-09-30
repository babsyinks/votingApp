import { render, screen } from "@testing-library/react";
import Grid from "layout/Grid";
import defaultStyle from "layout/Grid.module.css";
import getCompClasses from "util/getCompClasses";
import { BlockProps } from "components/ui/Block";

jest.mock("util/getCompClasses");
const mockedGetCompClasses = jest.mocked(getCompClasses);

jest.mock("components/ui/Block", () => ({ children, ...rest }: BlockProps) => (
  <div data-testid="grid-container" {...rest}>
    {children}
  </div>
));

describe("Grid component", () => {
  beforeEach(() => {
    mockedGetCompClasses.mockReturnValue("resolved-class");
  });

  it("renders children correctly", () => {
    render(
      <Grid>
        <p>Test Content</p>
      </Grid>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies the default grid class", () => {
    render(
      <Grid>
        <p>Default Grid</p>
      </Grid>
    );
    const grid = screen.getByTestId("grid-container");
    expect(grid).toHaveClass(defaultStyle.grid);
  });

    it("does not apply the default grid class when useDefaultStyle is false", () => {
    render(
      <Grid useDefaultStyle={false}>
        <p>Grid</p>
      </Grid>
    );
    const grid = screen.getByTestId("grid-container");
    expect(grid).not.toHaveClass(defaultStyle.grid);
  });

  it("merges custom className using getCompClasses", () => {
    render(
      <Grid className="resolved-class">
        <span>With Class</span>
      </Grid>
    );
    const grid = screen.getByTestId("grid-container");
    expect(grid).toHaveClass("grid resolved-class");
  });

  it("applies inline styles", () => {
    const style = { backgroundColor: "red", padding: "1rem" };
    render(
      <Grid style={style}>
        <span>Styled Grid</span>
      </Grid>
    );
    const grid = screen.getByTestId("grid-container");
    expect(grid).toHaveStyle({ backgroundColor: "red", padding: "1rem" });
  });
});
