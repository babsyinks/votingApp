import { render, screen } from "@testing-library/react";
import A from "components/ui/A";
import getCompClasses from "util/getCompClasses";
import { vi } from "vitest";

vi.mock("components/ui/A.module.css", () => ({
  link: "mock-link-class",
}));

vi.mock("util/getCompClasses");

const mockedGetCompClasses = vi.mocked(getCompClasses);

describe("<A />", () => {
  const href = "https://example.com";
  const text = "Visit Example";

  test("renders with required props", () => {
    render(<A href={href}>{text}</A>);
    const link = screen.getByRole("link", { name: text });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("target", "_self");
  });

  test('adds rel="noopener noreferrer" when target is _blank and rel is not set', () => {
    render(
      <A href={href} target="_blank">
        {text}
      </A>,
    );
    const link = screen.getByRole("link", { name: text });

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test('uses provided rel even with target="_blank"', () => {
    render(
      <A href={href} target="_blank" rel="custom-rel">
        {text}
      </A>,
    );
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("rel", "custom-rel");
  });

  test("applies aria attributes and title", () => {
    render(
      <A
        href={href}
        aria-label="Custom label"
        aria-labelledby="label-id"
        aria-describedby="desc-id"
        title="Link title"
        role="link"
      >
        {text}
      </A>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Custom label");
    expect(link).toHaveAttribute("aria-labelledby", "label-id");
    expect(link).toHaveAttribute("aria-describedby", "desc-id");
    expect(link).toHaveAttribute("title", "Link title");
    expect(link).toHaveAttribute("role", "link");
  });

  test("applies inline style and custom class name", () => {
    mockedGetCompClasses.mockReturnValue("resolved-class");
    const customStyle = { color: "red" };

    render(
      <A href={href} className="my-class" style={customStyle}>
        {text}
      </A>,
    );
    const link = screen.getByRole("link");

    expect(link).toHaveStyle("color: red");
    expect(mockedGetCompClasses).toHaveBeenCalledWith(expect.any(Object), "my-class");
    expect(link).toHaveClass("mock-link-class");
    expect(link).toHaveClass("resolved-class");
  });
});
