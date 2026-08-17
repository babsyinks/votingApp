import { render, screen } from "@testing-library/react";
import AdminFormFieldGroup from "features/admin/components/AdminFormFieldGroup";
import { BlockProps } from "components/ui/Block";
import { LabelProps } from "components/ui/Label";
import { vi } from "vitest";

vi.mock("components/ui/Block", () => ({ children, ...props }: BlockProps) => (
  <div data-testid="block" {...props}>
    {children}
  </div>
));

vi.mock(
  "components/ui/Label",
  () =>
    ({ name, className, children }: LabelProps) => (
      <label data-testid="label" data-name={name} className={className}>
        {children}
      </label>
    ),
);

describe("AdminFormFieldGroup", () => {
  it("renders Block and Label with correct props and label text", () => {
    render(
      <AdminFormFieldGroup label="Email" name="email">
        <input data-testid="input" name="email" />
      </AdminFormFieldGroup>,
    );

    const block = screen.getByTestId("block");
    expect(block).toHaveClass("mb-2p");
    expect(block).toHaveAttribute("type", "flex-horz-fs");

    const label = screen.getByTestId("label");
    expect(label).toHaveTextContent("Email");
    expect(label).toHaveAttribute("data-name", "email");
    expect(label).toHaveClass("wd-md bld");

    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
  });

  it("renders children elements inside Block", () => {
    render(
      <AdminFormFieldGroup label="name" name="name">
        <input data-testid="child-input" type="text" />
      </AdminFormFieldGroup>,
    );

    expect(screen.getByTestId("child-input")).toBeInTheDocument();
  });
});
