import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";
import AccessibleWrapper from "components/accessibility/AccessibleWrapper";

/**
 * A block component that renders its children inside a div. Its main purpose is to logically group
 * components. Optionally supports accessibility props via `withAccessibility`.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the block. E.g block or flex-vert.
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @param {Boolean} [props.withAccessibility] - Whether to wrap the component with accessibility attributes.
 * @param {String} [props.role] - ARIA role if accessibility is enabled.
 * @param {String} [props.ariaLabel] - ARIA label.
 * @param {String} [props.ariaLabelledBy] - ID of element that labels this component.
 * @param {String} [props.ariaDescribedBy] - ID of element that describes this component.
 * @param {String} [props.title] - Tooltip / additional description.
 * @param {React.ReactNode} [props.children] - Child elements to render inside the block.
 *
 * @returns {JSX.Element} The rendered block component.
 */
export default function Block({
  type = "block",
  className = "",
  style = {},
  withAccessibility = false,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  title,
  children,
}) {
  const blockContent = (
    <div
      className={`${defaultStyle[type]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </div>
  );

  if (!withAccessibility) return blockContent;

  return (
    <AccessibleWrapper
      role={role}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      title={title}
    >
      {blockContent}
    </AccessibleWrapper>
  );
}

Block.propTypes = {
  type: PropTypes.oneOf([
    "flex-vert",
    "flex-horz",
    "flex-vert-sb",
    "flex-horz-sb",
    "flex-vert-sa",
    "flex-horz-sa",
    "flex-vert-fs",
    "flex-horz-fs",
    "flex-vert-fe",
    "flex-horz-fe",
    "block",
    "inline",
    "inline-block",
    "flex",
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
  withAccessibility: PropTypes.bool,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};
