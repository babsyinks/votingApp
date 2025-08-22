import React from "react";
import { render, screen } from "@testing-library/react";
import DataToolTip from "components/ui/DataToolTip";

import AccessibleWrapper from "components/accessibility/AccessibleWrapper";

jest.mock("components/accessibility/AccessibleWrapper", () => {
  const React = require("react");

  const AccessibleWrapperMock = jest.fn(({ children, ...rest }) => {
    const { role, ariaLabel, ariaLabelledBy, ariaDescribedBy, title } = rest;

    const propsToAdd = {
      ...(role ? { role } : {}),
      ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      ...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {}),
      ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
      ...(title ? { title } : {}),
    };

    if (!React.isValidElement(children)) return null;
    return React.cloneElement(children, propsToAdd);
  });

  return {
    __esModule: true,
    default: AccessibleWrapperMock,
  };
});

describe("<DataToolTip />", () => {
  const defaultProps = {
    data: "This is a tooltip",
    role: "region",
    ariaLabel: "group-label",
    children: <button>Hover me</button>,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the tooltip content with data-tooltip attribute", () => {
    render(<DataToolTip {...defaultProps} />);
    // eslint-disable-next-line testing-library/no-node-access
    const tooltipWrapper = screen.getByText("Hover me").closest("div");
    expect(tooltipWrapper).toHaveAttribute("data-tooltip", "This is a tooltip");
  });

  it("renders the children inside the tooltip", () => {
    render(<DataToolTip {...defaultProps} />);
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("does not use AccessibleWrapper if withAccessibility is false", () => {
    render(<DataToolTip {...defaultProps} withAccessibility={false} />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("passes accessibility props to AccessibleWrapper", () => {
    const accessibilityProps = {
      withAccessibility: true,
      role: "tooltip",
      ariaLabel: "Tooltip label",
      ariaLabelledBy: "label-id",
      ariaDescribedBy: "desc-id",
      title: "Tooltip title",
    };

    render(<DataToolTip {...defaultProps} {...accessibilityProps} />);
    expect(AccessibleWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "tooltip",
        ariaLabel: "Tooltip label",
        ariaLabelledBy: "label-id",
        ariaDescribedBy: "desc-id",
        title: "Tooltip title",
      }),
      expect.anything(),
    );
  });

  it("defaults title to data if not provided", () => {
    render(<DataToolTip {...defaultProps} withAccessibility />);
    expect(AccessibleWrapper).toHaveBeenCalledWith(
      expect.objectContaining({ title: "This is a tooltip" }),
      expect.anything(),
    );
  });
});
